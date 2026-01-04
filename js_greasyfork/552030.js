// ==UserScript==
// @name         Snapchat Ads UTM
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Snapchat Ads UTM Tool For Saker!
// @author       Jimmy
// @include      *.snapchat.com/*
// @icon         https://img.staticdj.com/02face4114a147617cabf02ab9c59cec.png
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/moment@2.29.1/moment.min.js
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
// @downloadURL https://update.greasyfork.org/scripts/552030/Snapchat%20Ads%20UTM.user.js
// @updateURL https://update.greasyfork.org/scripts/552030/Snapchat%20Ads%20UTM.meta.js
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
            }
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
        convertDateRange(dateRangeStr) {
            // 处理单日情况 (如 "8 Oct 2025 (GMT-10)")
            const singleDayPattern = /^(\d+) (\w+) (\d+) \(GMT([+-]\d+)\)$/;
            let match = dateRangeStr.match(singleDayPattern);

            if (match) {
                const [_, day, month, year, timezoneOffset] = match;
                const date = moment(`${day} ${month} ${year}`, 'D MMM YYYY')
                .utcOffset(parseInt(timezoneOffset) * 60);

                const dateStr = date.format('YYYY-MM-DD');
                return {
                    startDate: dateStr,
                    endDate: dateStr
                };
            }

            // 处理日期范围 (如 "1–8 Oct 2025" 或 "29 Sept–2 Oct 2025")
            const rangePattern = /^(\d+)\s*(\w+)?\s*–\s*(\d+)\s+(\w+)\s+(\d+)\s+\(GMT([+-]\d+)\)$/;
            match = dateRangeStr.match(rangePattern);

            if (!match) {
                throw new Error('Invalid date range format');
            }

            let [_, startDay, startMonth, endDay, endMonth, year, timezoneOffset] = match;
            startMonth = startMonth || endMonth; // 如果开始月份未指定，使用结束月份

            const offsetMinutes = parseInt(timezoneOffset) * 60;
            const startDate = moment(`${startDay} ${startMonth} ${year}`, 'D MMM YYYY')
            .utcOffset(offsetMinutes);
            const endDate = moment(`${endDay} ${endMonth} ${year}`, 'D MMM YYYY')
            .utcOffset(offsetMinutes);

            return {
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            };
        },
        convertDateRange2(dateRangeStr) {
            // 移除时区信息（如"(GMT-10)"）
            const cleanStr = dateRangeStr.replace(/\s*\(GMT[+-]\d+\)/g, '').trim();

            // 处理单日情况 (如 "8 Oct 2025")
            const singleDayPattern = /^(\d+)\s+(\w+)\s+(\d+)$/;
            let match = cleanStr.match(singleDayPattern);

            if (match) {
                const [_, day, month, year] = match;
                const date = moment(`${day} ${month} ${year}`, 'D MMM YYYY');
                const dateStr = date.format('YYYY-MM-DD');
                return {
                    startDate: dateStr,
                    endDate: dateStr
                };
            }

            // 处理日期范围 (如 "1–8 Oct 2025" 或 "29 Sept–2 Oct 2025")
            const rangePattern = /^(\d+)\s*(\w+)?\s*–\s*(\d+)\s+(\w+)\s+(\d+)$/;
            match = cleanStr.match(rangePattern);

            if (!match) {
                throw new Error('Invalid date range format');
            }

            let [_, startDay, startMonth, endDay, endMonth, year] = match;
            startMonth = startMonth || endMonth; // 如果开始月份未指定，使用结束月份

            const startDate = moment(`${startDay} ${startMonth} ${year}`, 'D MMM YYYY');
            const endDate = moment(`${endDay} ${endMonth} ${year}`, 'D MMM YYYY');

            return {
                startDate: startDate.format('YYYY-MM-DD'),
                endDate: endDate.format('YYYY-MM-DD')
            };
        }
    };

    let siteadd = false; //页面元素是否增加的标记
    let refreshdata = false; //重新通过接口获取数据
    let tracking = false; //执行标题

    let act = "" ; //账户标记
    let from =""; //起始日期
    let to = ""; //结束日期
    let type = ""; //广告类型
    let siteId = ""; //站点ID
    let siteName = ""; //站点名称
    let trackBtn = "close"; //开关状态标记

    let campaignsElementClass = ".styles-14r34si"; //左上角广告账户选项元素
    let dateElementClass = ".styles-zpf9c7"; //右上角日期元素
    let tableElementClass = ".sds-vtable-header-row.styles-1x5kmoe"; //主体数据列表
    let tableElementClass2 = ".sds-vtable-header-row.styles-1x5kmoe"

    let utmdata = []; //接口数据列表

    //新增页面元素内容
    function addhtmlFun(siteName,trackBtn){
        let addhtml = '<div id="sakerHtml" style="display: flex;align-items: center; margin-left:20px;">'
        addhtml += '<div class="sitelist">'
        addhtml += '<div class="dropdown">'
        addhtml += '<input type="text" placeholder="Select Shopify Site" value="'+siteName+'" id="myInput">'
        addhtml += '<div id="myDropdown" class="dropdown-content">'
        addhtml += '<a data-id="">Sample</a>'
        addhtml += '</div>'
        addhtml += '</div>'
        addhtml += '</div>'
        addhtml += '<div class="trackon" style="display: flex;align-items: center;margin-left: 20px;">'
        addhtml += '<span class="fkloq7h8 raq0z4z6" style="margin-right: 10px;">Turn on to track:</span>'
        addhtml += '<label class="switch"><input type="checkbox" class="trackbox" '+(trackBtn=="open"?'checked="checked"':"")+'> <span class="slider round"></span> </label>'
        addhtml += '</div>'
        addhtml += '</div>'
        addhtml += '<style>'
        addhtml += ' .dropbtn { background-color: #63be09; color: white; padding: 10px 16px; font-size: 16px; border: none; cursor: pointer; } .dropbtn:hover, .dropbtn:focus { background-color: #3e8e41; } #myInput { background-size: 16px; box-sizing: border-box; background-image: url(https://www.w3schools.com/howto/searchicon.png); background-position: 14px 8px; background-repeat: no-repeat; font-size: 0.875rem; padding: 8px 20px 8px 45px; border: none; border-bottom: 1px solid #ddd;min-width:230px;  height: 36px; background-color: rgb(255, 255, 255); border: 1px solid rgba(0, 0, 0, 0.15); border-radius: 6px; box-shadow: none; color: rgba(0, 0, 0, 0.85); font-family: Roboto, Arial, sans-serif; } #myInput:focus { outline: 1px solid #ddd; } .dropdown { position: relative; display: inline-block; } .dropdown-content { display: none; position: absolute; background-color: #f6f6f6; min-width: 230px; overflow: auto; border: 1px solid #ddd; z-index: 999;max-height: 300px; border-radius: 6px; } .dropdown-content a { color: black; padding: 8px; text-decoration: none; display: block; font-size: 0.875rem; } .dropdown a:hover { background-color: #ddd; } .show { display: block; } '
        addhtml += '.switch { position: relative; display: inline-block; width: 60px; height: 34px; } .switch input { opacity: 0; width: 0; height: 0; } .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background-color: #ccc; -webkit-transition: .4s; transition: .4s; } .slider:before { position: absolute; content: ""; height: 26px; width: 26px; left: 4px; bottom: 4px; background-color: white; -webkit-transition: .4s; transition: .4s; } input:checked+.slider { background-color: #2196F3; } input:focus+.slider { box-shadow: 0 0 1px #2196F3; } input:checked+.slider:before { -webkit-transform: translateX(26px); -ms-transform: translateX(26px); transform: translateX(26px); } .slider.round { border-radius: 34px; } .slider.round:before { border-radius: 50%; } '
        addhtml += '.showbg { padding: 0 5px; background-color: #ffc107; margin-right: 5px; font-weight: bold; border-radius: 10px; }';
        addhtml += '.markcol {display:block;text-align: center;padding: 2px 5px;margin-bottom: 2px;margin-left: -5px; border-radius: 5px;}';
        addhtml += '</style>';
        return addhtml;
    }


    function track(){
        tracking = setInterval(async function(){
            //判断主体数据列表中的数据是否有变化
            let tabelElementOld = util.getStorage(act+'_tabelElement') || ""
            let tabelElement = $(tableElementClass).length>0?$(tableElementClass).next('div').html():$(tableElementClass2).next('div').html()
            if(tabelElementOld != tabelElement){
                util.clog("tabelElement changed")
                $('span.showbg').remove();
            }

            //日期处理
            let datestr = $(dateElementClass).find('span').first().html();
            console.log("datestr",datestr);
            let datestrarr=[];
            let from_arr = [];
            let to_arr = [];
            let from_date,from_month,from_year,to_date,to_month,to_year,dateArr
            if(datestr){
                let dateobj = util.convertDateRange2(datestr)
                console.log("dateobj: ",dateobj)

                from = dateobj.startDate;
                to = dateobj.endDate;
            }
            let fromOld = util.getStorage(act+'_from')
            let toOld = util.getStorage(act+'_to')
            if(fromOld != from || toOld != to){
                util.setStorage(act+'_from',from)
                util.setStorage(act+'_to',to)
                refreshdata = false
            }

            let tabstr = $(".styles-sy60sn.styles-2zx8ei").find('span').html()
            type = tabstr.trim().toLowerCase()
            if(type == "ad sets"){
                type = "adgroups"
            }

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
            if(daybetween>31){
                return util.message.error('The time period should not exceed 1 months');
            }


            //获取数据
            if(type && from && siteId){
                if(!refreshdata){
                    let formData = new FormData();
                    formData.append('type', type=="adgroups"?"adsets":type);
                    formData.append('from', from);
                    formData.append('to', to);
                    formData.append('siteid', siteId);
                    let utmres = await util.post("https://openapi.ycimedia.net/sak-api/facebook/utm/data",formData)
                    if(utmres.code==1){
                        refreshdata = true
                        utmdata = utmres.data;
                    }
                }
                console.log('utmdata',utmdata);

                //获取需要使用的选项所在列的位置
                let arr = []
                let titleobj = null;
                if($(".sds-vtable-header-row.styles-1x5kmoe").find("div.sds-vtable-cell").length>0){
                    titleobj = $(".sds-vtable-header-row.styles-1x5kmoe").find("div.sds-vtable-cell");
                }

                 console.log("titleobj",titleobj)

                titleobj.each(function(i){
                    let position = $(this).find('span').html().trim() || "";
                    switch(position.toLowerCase()){
                        case "id":
                            arr['id']=i;
                            break;
                        case "result":
                            arr['results']=i;
                            break;
                        case "amount spent":
                            arr['amount_spent']=i;
                            break;
                        case "purchase roas (return on ad spend)":
                            arr['p_roas']=i;
                            break;
                        default:
//                             console.log("position.toLowerCase()",position.toLowerCase())
                            break;
                    }
                })

                console.log('arr',arr)

                if((!arr['id'] && arr['id']!=0) || (!arr['results'] && arr['results']!=0) || (!arr['amount_spent'] && arr['amount_spent']!=0) || (!arr['p_roas'] && arr['amount_spent']!=0)){
                    return util.message.error('添加列 "ID，Amount spent, Result, Purchase ROAS (return on ad spend)" ');
                }

                let col = "";
                let allqty=0,alltotal=0;
                if($('div[data-testid="sds.virtualTable.innerElement"]').find("div.sds-vtable-row.styles-32obxo").length>0){
                    let stickyLength = $('.sds-vtable-sticky-corner').find('.sds-vtable-cell').length
                    console.log("stickyLength: ",stickyLength)
                    $('div[data-testid="sds.virtualTable.innerElement"]').find("div.sds-vtable-row.styles-32obxo").each(function(i){
                        //根据tab类型获取判断依据
                        switch(type){
                            case "ads":
                                col = arr['id'];
                                break;
                            case "adgroups":
                                col = arr['id'];
                                break;
                            case "campaigns":
                                col = arr['id'];
                                break;
                            default:
                                break;
                        }

                        console.log("行",$(this).html());

                        let rowObj = $(this); //每行数据对象
                        console.log("rowObj",rowObj)
                        let markidObj = rowObj.children("div.sds-vtable-cell:nth-child("+(col+1-stickyLength+1)+")").find('span'); //判断依据列数据对象
                        console.log("markidObj",markidObj.html())
                        let markid = markidObj.html().trim(); //判断依据列值
                        console.log("markid",markid)

                        let resultsObj = rowObj.children("div.sds-vtable-cell:nth-child("+(arr['results']+1-stickyLength+1)+")").find('span').first(); //成效列对象
                        console.log("resultsObj",resultsObj.html())
                        let spentObj = rowObj.children("div.sds-vtable-cell:nth-child("+(arr['amount_spent']+1-stickyLength+1)+")").find('span'); //广告花费列对象
                        console.log("spentObj",spentObj.html())
                        let proasObj = rowObj.children("div.sds-vtable-cell:nth-child("+(arr['p_roas']+1-stickyLength+1)+")").find('span'); //广告花费回报-购物
                        console.log("proasObj",proasObj.html())

                        //对接口返回值进行匹配
                        $.map( utmdata, function( val, index ) {
                            //根据类型获取判断依据
                            let datamark = "";
                            switch(type){
                                case "ads":
                                    datamark = val.content_id
                                    break;
                                case "adgroups":
                                    datamark = val.term_id
                                    break;
                                case "campaigns":
                                    datamark = val.medium_id
                                    break;
                                default:
                                    break;
                            }

                            if(markid === datamark || $(markid).text() === datamark){
                                allqty += val.qty*100
                                alltotal += val.total*100
                            }

                            //匹配成功时在同行必要的数据展示列中增加展示元素
                            if(markid === datamark){
                                markidObj.find('span.showbg').length>0?markidObj.find('span').html(datamark):markidObj.prepend("<span class='showbg markcol'>"+datamark+"</span>")
                                resultsObj.find('span.showbg').length>0?resultsObj.find('span').html(val.qty):resultsObj.prepend("<span class='showbg'>"+val.qty+"</span>")
                                let spentAmount = spentObj.html().substring(1).replaceAll(",", "").replaceAll("US$","").replaceAll("S$","").replaceAll("$","").replaceAll("<!---->","").replaceAll("<tooltip></tooltip>","").trim(); //订单总额除广告花费
                                console.log("spentAmount",spentAmount)
                                let roas = spentAmount>0?(val.total/spentAmount).toFixed(2):"";
                                proasObj.find('span.showbg').length>0?proasObj.find('span').html(roas):(roas>0?proasObj.prepend("<span class='showbg'>"+roas+"</span>"):"")
                            }
                        });
                    })
                }

                //存储最新的主体数据列表
                util.setStorage(act+'_tabelElement',$(tableElementClass).length>0?$(tableElementClass).next('div').html():$(tableElementClass2).next('div').html())
            }else{
                return util.message.error('Parameter error');
            }
        }, 3000);
    }

    setInterval(async function(){
//         let pageURL = $(location).attr("href");
//         let urlarr = pageURL.match("aw/(.*)[\?]ocid=");
//         if(!urlarr){
//             urlarr = pageURL.match("aw/(.*)[\?]campaignId=");
//         }
        let tabstr = $(".styles-sy60sn.styles-2zx8ei").find('span').html()
        type = tabstr.trim().toLowerCase()
        if(type == "ad sets"){
          type = "adgroups"
        }
        console.log('type',type)
        if(type == "campaigns" || type == "adgroups" || type == "ads"){
            console.log('siteadd',siteadd);
            console.log('act',act);

            if(!siteadd && $(campaignsElementClass).length>0 && $(".account-picker-info-name").length>0 ){
                let actstr = $(".account-picker-info-name").html()
                act = actstr ? actstr.trim() : ""
                console.log('act',act);

                from = util.getStorage(act+'_from') || ""; //起始日期
                to = util.getStorage(act+'_to') || ""; //结束日期
                type = util.getStorage(act+'_type') || ""; //广告类型
                siteId = util.getStorage(act+'_siteId') || ""; //站点ID
                siteName = util.getStorage(act+'_siteName') || ""; //站点名称
                trackBtn = util.getStorage(act+'_trackBtn') || "close"; //开关状态标记
                console.log(act+'_trackBtn',trackBtn);

                //位于Campaigns div后, 以便小屏下UI展示
                console.log('addhtml start')
                let addhtml = addhtmlFun(siteName,trackBtn)
                $(campaignsElementClass).first().after(addhtml)
                siteadd = true;

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

                //开关
                $('.trackbox').on('change',function(){
                    if ($(this).prop("checked")) {
                        if(!siteId){
                            $(this).prop("checked",false)
                            return util.message.error('Please select site');
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
})();