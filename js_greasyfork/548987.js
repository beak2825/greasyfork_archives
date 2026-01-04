// ==UserScript==
// @name         ☝🤓必应搜索屏蔽
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  屏蔽必应搜索结果中不想看到的网页，使用-site规则实现
// @author       ACYFT
// @license      MIT
// @match        https://cn.bing.com/search?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @resource css https://blog-static.cnblogs.com/files/blogs/827294/bingBlock_1123.css?t=1763896270&download=true
// @noframes
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/548987/%E2%98%9D%F0%9F%A4%93%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/548987/%E2%98%9D%F0%9F%A4%93%E5%BF%85%E5%BA%94%E6%90%9C%E7%B4%A2%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 获取本地数据
    var allRules=GM_getValue('allRules') ?? []
    var enabledRules=GM_getValue('enabledRules') ?? []

    var url=location.href // 原url
    var newUrl=url// 新url
    var isIncludeAll=true // url是否包含所有规则，默认为true
    var searchInputEle=document.getElementById('sb_form_q') // 搜索栏元素
    var searchInputValue=searchInputEle.value.trim() // 搜索栏内容
    var inputLength=searchInputValue.length // 搜索栏内容长度，用于判断内容是否变化
    var uselessParamsInUrl=['tsc','sp','FORM','form','pq','sc','qs','sk','cvid','lq','ghsh','ghacc','ghpl','ghc','PC','go','rdr','rdrig','FPIG'] // url无用参数

    // 生成newUrl
    enabledRules.forEach((rule)=>{
        // 匹配规则关键词的正则，使用new RegExp以便动态生成
        var regex = new RegExp(`(^|\\s)-site:${rule.replace(/[.?+*()[\]{}^$|\\]/g,'\\$&')}(\\s|$)`)
        // 尝试清除脚本自动添加的规则关键词
        searchInputValue=searchInputValue.replace(regex,' ')
        // 如果清除成功说明规则已存在
        if(searchInputValue.length < inputLength){
            // 去除搜索栏首尾及重复空格
            searchInputValue=searchInputValue.replace(/\s+/g,' ').trim()
            // 更新搜索栏内容长度
            inputLength=searchInputValue.length
        }
        // 如果长度没有变化说明规则不存在
        else {
            // 添加规则到新url中
            newUrl=newUrl.replace('q=',`q=-site%3A${rule}+`)
            // 是否包含所有规则，修正为false
            isIncludeAll=false
        }
    })

    // 修正搜索栏的内容
    searchInputEle.value=searchInputValue
    // 重定向
    if(!isIncludeAll){
        window.stop()
        location.replace(newUrl)
    } else {
        newUrl=new URL(url)
        // 去除url无用参数
        uselessParamsInUrl.forEach((paramName)=>{
            newUrl.searchParams.delete(paramName)
        })
        newUrl=newUrl.toString()
        // 清除页面地址中的规则，覆盖当前历史记录，页面不跳转
        enabledRules.forEach((rule)=>{
            // 匹配地址栏中规则的正则，使用new RegExp以便动态生成
            var regex = new RegExp(`-site%3A${rule.replace(/[.?+*()[\]{}^$|\\]/g,'\\$&')}\\+`)
            newUrl=newUrl.replace(regex,'')
        })
        history.replaceState(null,null,newUrl)
        // 修改网页标题
        document.title=`${searchInputValue} - 搜索`
            // 修改原pushState函数为跳转至目标页面
            history.pushState=(f=>function(){
                console.log('pushStateURL',arguments[2])
                window.stop()
                window.location.href=`https://cn.bing.com${arguments[2]}`
            //return f.apply(this,arguments)
            })(history.pushState)
            console.log('change pushState')
    }

    // 清除未回收的规则/规则组
    allRules.forEach((group,groupIndex)=>{
        if(group.disabled=='notYet'){
            allRules.splice(groupIndex,1)
        } else {
            group.rules.forEach((rule,ruleIndex)=>{
                if(rule.disabled=='notYet'){
                    group.rules.splice(ruleIndex,1)
                }
            })
        }
    })
    GM_setValue('allRules',allRules)

    console.log('allRules',allRules)
    console.log('enabledRules',enabledRules)

    var searchInput=document.getElementsByClassName('b_searchboxForm')[0]

    {searchInput.insertAdjacentHTML('afterend',`
        <div class='menuBtnBox'>
            <div class='menuBtn'>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                    <path d="M12 22q-2.075 0-3.9-.788t-3.175-2.137T2.788 15.9T2 12t.788-3.9t2.137-3.175T8.1 2.788T12 2t3.9.788t3.175 2.137T21.213 8.1T22 12t-.788 3.9t-2.137 3.175t-3.175 2.138T12 22m0-2q1.35 0 2.6-.437t2.3-1.263L5.7 7.1q-.825 1.05-1.263 2.3T4 12q0 3.35 2.325 5.675T12 20m6.3-3.1q.825-1.05 1.263-2.3T20 12q0-3.35-2.325-5.675T12 4q-1.35 0-2.6.437T7.1 5.7z"/>
                </svg>
            </div>
        </div>
        <div class='menuMainBox'>
            <div class=menuMain>
                <div class='groupCreateBox'>
                    <div class='groupCreateBtn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	                        <path d="M12 21q-.425 0-.712-.288T11 20v-7H4q-.425 0-.712-.288T3 12t.288-.712T4 11h7V4q0-.425.288-.712T12 3t.713.288T13 4v7h7q.425 0 .713.288T21 12t-.288.713T20 13h-7v7q0 .425-.288.713T12 21" />
                        </svg>
                    </div>
                    <div class='groupCreateForm'>
                        <input class='groupCreateInput' placeholder='组名称' value='group${allRules.length+1}'/>
                        <div class='groupCreatingBtn'>
                            <div class='groupCreatingBtnCancel'>取消</div>
                            <div class='groupCreatingBtnConfirm'>确定</div>
                        </div>
                    </div>
                </div>
                <dialog class='deleteDialog'>
                    <div class='deleteDialogContent'>
                        <div class='deleteDialogWarning'></div>
                        <div class='deleteDialogBtn'>
                            <div class='deleteDialogBtnCancel'>取消</div>
                            <div class='deleteDialogBtnConfirm'>确定</div>
                        </div>
                    </div>
                </dialog>
            </div>
        </div>
    `)}

    GM_addStyle(GM_getResourceText("css"));

    var groupCreateBox=document.querySelector('.groupCreateBox')

    // 插入groupHTML
    function injectGroupHTML(groupIndex,groupData){
        groupCreateBox.insertAdjacentHTML('beforebegin',`
            <div id='rulesGroup_#${groupIndex}' class='rulesGroup'>
                <div class='rulesGroupHeader'>
                    <div class='groupHeaderLeft'>
                        <div class='groupSwitchBtn'>
                            <div class=groupSwitchBall></div>
                        </div>
                        <div class='groupNameBox'>
                            <div class='groupName'>${groupData.groupName}</div>
                            <div class='groupNameEditBtn'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-6v-4.25l9.175-9.175q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4t-.137.738t-.438.662L13.25 15zM21.025 4.4l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"/>
                                </svg>
                            </div>
                            <input id='groupNameEditInput_#${groupIndex}' class='groupNameEditInput' value='${groupData.groupName}'>
                            <div class='groupNameEditingBtn'>
                                <div class='groupNameEditingBtnCancel'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 18h3.75a5.25 5.25 0 1 0 0-10.5H5M7.5 4L4 7.5L7.5 11"/>
                                    </svg>
                                </div>
                                <div class='groupNameEditingBtnConfirm'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    	<path d="m9.55 15.15l8.475-8.475q.3-.3.7-.3t.7.3t.3.713t-.3.712l-9.175 9.2q-.3.3-.7.3t-.7-.3L4.55 13q-.3-.3-.288-.712t.313-.713t.713-.3t.712.3z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class='groupHeaderRight'>
                        <div class='groupOpenBtn'>
                                <svg class='groupOpenIconSide' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="m14.475 12l-7.35-7.35q-.375-.375-.363-.888t.388-.887t.888-.375t.887.375l7.675 7.7q.3.3.45.675t.15.75t-.15.75t-.45.675l-7.7 7.7q-.375.375-.875.363T7.15 21.1t-.375-.888t.375-.887z"/>
                                </svg>
                                <svg class='groupOpenIconCenter' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="M6 14q-.825 0-1.412-.587T4 12t.588-1.412T6 10t1.413.588T8 12t-.587 1.413T6 14m6 0q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m6 0q-.825 0-1.412-.587T16 12t.588-1.412T18 10t1.413.588T20 12t-.587 1.413T18 14"/>
                                </svg>
                                <svg class='groupOpenIconSide' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path d="m9.55 12l7.35 7.35q.375.375.363.875t-.388.875t-.875.375t-.875-.375l-7.7-7.675q-.3-.3-.45-.675t-.15-.75t.15-.75t.45-.675l7.7-7.7q.375-.375.888-.363t.887.388t.375.875t-.375.875z"/>
                                </svg>
                        </div>
                        <div class='groupDeleteBtn'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/>
                            </svg>
                        </div>
                    </div>
                </div>
                <div class='rulesGroupMain'>
                    <div class='rulesBox'>
                        <div class='ruleCreateBox'>
                            <div class='ruleCreateBtn'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	                                <path d="M12 21q-.425 0-.712-.288T11 20v-7H4q-.425 0-.712-.288T3 12t.288-.712T4 11h7V4q0-.425.288-.712T12 3t.713.288T13 4v7h7q.425 0 .713.288T21 12t-.288.713T20 13h-7v7q0 .425-.288.713T12 21" />
                                </svg>
                            </div>
                            <div class='ruleCreateForm'>
                                <input id='ruleCreateInput_#${groupIndex}' class='ruleCreateInput'/>
                                <div class='ruleCreatingBtn'>
                                    <div class='ruleCreatingBtnCancel'>取消</div>
                                    <div class='ruleCreatingBtnConfirm'>确定</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `)
    }
// 插入ruleHTNL
function injectRuleHTML(ruleCreateBox,groupIndex,ruleIndex,ruleData){
    ruleCreateBox.insertAdjacentHTML('beforebegin',`
            <div id='rule_#${groupIndex}_#${ruleIndex}' class='rule'>
                <div class=ruleLeftBox>
                    <div class='ruleSwitchBtn'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
	                        <path d="m9.55 18l-5.7-5.7l1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4z" />
                        </svg>
                    </div>
                    <div class='ruleValueBox'>
                        <div class='ruleValue'>${ruleData.value}</div>
                        <div class='ruleValueEditBtn'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                <path d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h8.925l-2 2H5v14h14v-6.95l2-2V19q0 .825-.587 1.413T19 21zm4-6v-4.25l9.175-9.175q.3-.3.675-.45t.75-.15q.4 0 .763.15t.662.45L22.425 3q.275.3.425.663T23 4.4t-.137.738t-.438.662L13.25 15zM21.025 4.4l-1.4-1.4zM11 13h1.4l5.8-5.8l-.7-.7l-.725-.7L11 11.575zm6.5-6.5l-.725-.7zl.7.7z"/>
                            </svg>
                        </div>
                        <input id='ruleValueEditInput_#${groupIndex}_#${ruleIndex}' class='ruleValueEditInput' value='${ruleData.value}'>
                        <div class='ruleValueEditingBtn'>
                            <div class=ruleValueEditingBtnCancel>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 18h3.75a5.25 5.25 0 1 0 0-10.5H5M7.5 4L4 7.5L7.5 11"/>
                                </svg>
                            </div>
                            <div class=ruleValueEditingBtnConfirm>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                	<path d="m9.55 15.15l8.475-8.475q.3-.3.7-.3t.7.3t.3.713t-.3.712l-9.175 9.2q-.3.3-.7.3t-.7-.3L4.55 13q-.3-.3-.288-.712t.313-.713t.713-.3t.712.3z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
                <div class='ruleDeleteBtn'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                        <path d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"/>
                    </svg>
                </div>
            </div>
        `)
    }

// 事件绑定和处理-展开总菜单
var sb_form=document.querySelector('#sb_form')
function menuSwitch(){
    sb_form.hasAttribute('data-menu-open')
        ? sb_form.removeAttribute('data-menu-open')
    : sb_form.setAttribute('data-menu-open','')
}
var menuBtn=sb_form.querySelector('.menuBtn')
menuBtn.addEventListener('click',menuSwitch,false)
// 事件处理-激活规则组
function groupSwitch(groupIndex,groupElement){
    return function(){
        if(groupElement.hasAttribute('data-group-disabled')){
            // 处理数据
            allRules[groupIndex].disabled=false
            allRules[groupIndex].rules.forEach((rule)=>{
                if(!rule.disabled){
                    enabledRules.push(rule.value)
                }
            })
            GM_setValue('allRules',allRules)
            GM_setValue('enabledRules',enabledRules)
            // 处理前端
            groupElement.removeAttribute('data-group-disabled')
        }else{
            // 处理数据
            allRules[groupIndex].disabled=true
            allRules[groupIndex].rules.forEach((rule)=>{
                var index=enabledRules.indexOf(rule.value)
                if(index!==-1){
                    enabledRules.splice(index,1)
                }
            })
            GM_setValue('allRules',allRules)
            GM_setValue('enabledRules',enabledRules)
            groupElement.setAttribute('data-group-disabled','')
        }
    }
}
// 事件处理-重命名规则组
function groupNameEdit(groupNameBox){
    return function(){
        // 处理前端
        if(!groupNameBox.hasAttribute('data-group-name-editing')){
            groupNameBox.setAttribute('data-group-name-editing','')
        }
    }
}
// 事件处理-取消重命名
function groupNameEditCancel(groupIndex,groupNameEditInput,groupNameBox){
    return function(){
        // 处理前端
        groupNameEditInput.value=document.querySelector(`#rulesGroup_\\#${groupIndex} .groupName`).innerText
        if(groupNameBox.hasAttribute('data-group-name-editing')){
            groupNameBox.removeAttribute('data-group-name-editing')
        }
    }
}
// 事件处理-确定重命名
function groupNameEditConfirm(groupIndex,groupName,groupNameBox){
    return function(event){
        if(event?.key=='Enter' || event.type=='click'){
            var newGroupName=document.querySelector(`#groupNameEditInput_\\#${groupIndex}`).value
            // 处理数据
            allRules[groupIndex].groupName=newGroupName
            GM_setValue('allRules',allRules)
            // 处理前端
            groupName.innerText=newGroupName
            if(groupNameBox.hasAttribute('data-group-name-editing')){
                groupNameBox.removeAttribute('data-group-name-editing')
            }
            event.preventDefault()
        }
    }
}
// 事件处理-展开规则组
function groupOpen(groupElement){
    return function(){
        // 处理前端
        groupElement.hasAttribute('data-group-open')
            ? groupElement.removeAttribute('data-group-open')
        : groupElement.setAttribute('data-group-open','')
    }
}
// 事件处理-激活规则
function ruleSwitch(groupIndex,ruleIndex,ruleElement){
    return function(){
        if(ruleElement.hasAttribute('data-rule-disabled')){
            // 处理数据
            allRules[groupIndex].rules[ruleIndex].disabled=false
            enabledRules.push(allRules[groupIndex].rules[ruleIndex].value)
            GM_setValue('allRules',allRules)
            GM_setValue('enabledRules',enabledRules)
            // 处理前端
            ruleElement.removeAttribute('data-rule-disabled')
        } else{
            // 处理数据
            allRules[groupIndex].rules[ruleIndex].disabled=true
            var index=enabledRules.indexOf(allRules[groupIndex].rules[ruleIndex].value)
            if(index!==-1){
                enabledRules.splice(index,1)
            }
            GM_setValue('allRules',allRules)
            GM_setValue('enabledRules',enabledRules)
            // 处理前端
            ruleElement.setAttribute('data-rule-disabled','')
        }
    }
}
// 事件处理-修改规则
function ruleValueEdit(ruleValueBox){
    return function(){
        // 处理前端
        if(!ruleValueBox.hasAttribute('data-rule-value-editing'))
        {ruleValueBox.setAttribute('data-rule-value-editing','')}
    }
}
// 事件处理-取消修改
function ruleValueEditCancel(groupIndex,ruleIndex,ruleValueEditInput,ruleValueBox){
    return function(){
        // 处理前端
        ruleValueEditInput.value=document.querySelector(`#rule_\\#${groupIndex}_\\#${ruleIndex} .ruleValue`).innerText
        if(ruleValueBox.hasAttribute('data-rule-value-editing')){
            ruleValueBox.removeAttribute('data-rule-value-editing')
        }
    }
}
// 事件处理-确定修改
function ruleValueEditConfirm(groupIndex,ruleIndex,ruleValue,ruleValueBox){
    return function(event){
        if(event?.key=='Enter'||event.type=='click'){
            // 处理数据
            var newRuleValue=document.querySelector(`#ruleValueEditInput_\\#${groupIndex}_\\#${ruleIndex}`).value
            var index=enabledRules.indexOf(allRules[groupIndex].rules[ruleIndex].value)
            allRules[groupIndex].rules[ruleIndex].value=newRuleValue
            if(index!=-1){
                enabledRules[index]=newRuleValue
            }
            GM_setValue('allRules',allRules)
            GM_setValue('enabledRules',enabledRules)
            // 处理前端
            ruleValue.innerText=newRuleValue
            if(ruleValueBox.hasAttribute('data-rule-value-editing')){
                ruleValueBox.removeAttribute('data-rule-value-editing')
            }
            event.preventDefault()
        }
    }
}
// 事件处理-展示删除对话框
var deleteDialog=document.querySelector('.deleteDialog')
var deleteDialogWarning=document.querySelector('.deleteDialogWarning')
function showDeleteDialog(groupIndex,ruleIndex){
    return function(){
        deleteDialogWarning.innerText = ruleIndex == undefined
            ? `确定删除规则组${document.querySelector(`#rulesGroup_\\#${groupIndex} .groupName`).innerText}吗？`
                : `确定删除规则${allRules[groupIndex].rules[ruleIndex].value}吗？`
            deleteDialog.setAttribute('data-group-index',groupIndex)
            deleteDialog.setAttribute('data-rule-index',ruleIndex)
            deleteDialog.showModal()
        }
    }
// 事件绑定和处理-取消删除
function deleteCancel(){
    deleteDialog.close()
}
var deleteDialogBtnCancel=deleteDialog.querySelector('.deleteDialogBtnCancel')
deleteDialogBtnCancel.addEventListener('click',deleteCancel,false)
// 事件绑定和处理-确定删除
function deleteConfirm(){
    var deleteDialog=document.querySelector('.deleteDialog')
    var groupIndex=deleteDialog.dataset.groupIndex
    var ruleIndex=deleteDialog.dataset.ruleIndex
    if(ruleIndex=='undefined'){
        // 处理数据
        allRules[groupIndex].disabled='notYet'
        allRules[groupIndex].rules.forEach((rule)=>{
            var index=enabledRules.indexOf(rule.value)
            if(index!==-1){
                enabledRules.splice(index,1)
            }
        })
        GM_setValue('allRules',allRules)
        GM_setValue('enabledRules',enabledRules)
        // 处理前端
        var groupElement=document.querySelector(`#rulesGroup_\\#${groupIndex}`)
        groupElement.style.display='none'
    } else {
        // 处理数据
        allRules[groupIndex].rules[ruleIndex].disabled='notYet'
        var index=enabledRules.indexOf(allRules[groupIndex].rules[ruleIndex].value)
        if(index!==-1){
            enabledRules.splice(index,1)
        }
        GM_setValue('allRules',allRules)
        GM_setValue('enabledRules',enabledRules)
        // 处理前端
        var ruleElement=document.querySelector(`#rule_\\#${groupIndex}_\\#${ruleIndex}`)
        ruleElement.style.display='none'
    }
    // 处理前端
    deleteDialog.close()
}
var deleteDialogBtnConfirm=deleteDialog.querySelector('.deleteDialogBtnConfirm')
deleteDialogBtnConfirm.addEventListener('click',deleteConfirm,false)

// 全部事件绑定-规则
function ruleAddEventListener(ruleElement,groupIndex,ruleIndex){
    // 事件绑定-开关规则
    var ruleSwitchBtn=ruleElement.querySelector('.ruleSwitchBtn')
    ruleSwitchBtn.addEventListener('click',ruleSwitch(groupIndex,ruleIndex,ruleElement),false)
    // 事件绑定-修改规则
    var ruleValueBox=ruleElement.querySelector('.ruleValueBox')
    var ruleValueEditBtn=ruleElement.querySelector('.ruleValueEditBtn')
    ruleValueEditBtn.addEventListener('click',ruleValueEdit(ruleValueBox),false)
    // 事件绑定-取消修改
    var ruleValueEditInput=ruleElement.querySelector('.ruleValueEditInput')
    var ruleValueEditingBtnCancel=ruleElement.querySelector('.ruleValueEditingBtnCancel')
    ruleValueEditingBtnCancel.addEventListener('click',ruleValueEditCancel(groupIndex,ruleIndex,ruleValueEditInput,ruleValueBox),false)
    // 事件绑定-确定修改
    var ruleValue=ruleElement.querySelector('.ruleValue')
    var ruleValueEditingBtnConfirm=ruleElement.querySelector('.ruleValueEditingBtnConfirm')
    ruleValueEditingBtnConfirm.addEventListener('click',ruleValueEditConfirm(groupIndex,ruleIndex,ruleValue,ruleValueBox),false)
    ruleValueEditInput.addEventListener('keydown',ruleValueEditConfirm(groupIndex,ruleIndex,ruleValue,ruleValueBox),false)
    // 事件绑定-删除规则
    var ruleDeleteBtn=ruleElement.querySelector('.ruleDeleteBtn')
    ruleDeleteBtn.addEventListener('click',showDeleteDialog(groupIndex,ruleIndex),false)
}
// 事件处理-创建规则
function ruleCreate(ruleCreateBox){
    return function(){
        // 处理前端
        if(!ruleCreateBox.hasAttribute('data-rule-creating')){
            ruleCreateBox.setAttribute('data-rule-creating','')
        }
    }
}
// 事件处理-取消创建
function ruleCreateCancel(ruleCreateInput,ruleCreateBox){
    return function(){
        // 处理前端
        ruleCreateInput.value=''
        if(ruleCreateBox.hasAttribute('data-rule-creating')){
            ruleCreateBox.removeAttribute('data-rule-creating','')
        }
    }
}
// 事件处理-确定创建
function ruleCreateConfirm(groupIndex,ruleCreateInput,ruleCreateBox){
    return function(event){
        if(event?.key=='Enter'||event.type=='click'){
            // 处理数据
            var ruleData={
                value:document.querySelector(`#ruleCreateInput_\\#${groupIndex}`).value,
                disabled:false,
            }
            allRules[groupIndex].rules.push(ruleData)
            enabledRules.push(ruleData.value)
            GM_setValue('allRules',allRules)
            GM_setValue('enabledRules',enabledRules)
            var ruleIndex=allRules[groupIndex].rules.length-1
            // 创建新规则
            injectRuleHTML(ruleCreateBox,groupIndex,ruleIndex,ruleData)
            var ruleElement=document.querySelector(`#rule_\\#${groupIndex}_\\#${ruleIndex}`)
            ruleAddEventListener(ruleElement,groupIndex,ruleIndex)
            // 处理前端
            ruleCreateInput.value=''
            if(ruleCreateBox.hasAttribute('data-rule-creating')){
                ruleCreateBox.removeAttribute('data-rule-creating','')
            }
            event.preventDefault()
        }
    }
}

// 全部事件绑定-规则组
function groupAddEventListener(groupElement,groupIndex,ruleCreateBox){
    // 开关规则组
    var groupSwitchBtn=groupElement.querySelector('.groupSwitchBtn')
    groupSwitchBtn.addEventListener('click',groupSwitch(groupIndex,groupElement),false)
    // 重命名规则组
    var groupNameBox=groupElement.querySelector('.groupNameBox')
    var groupNameEditBtn=groupElement.querySelector('.groupNameEditBtn')
    groupNameEditBtn.addEventListener('click',groupNameEdit(groupNameBox),false)
    // 取消重命名
    var groupNameEditInput=groupElement.querySelector('.groupNameEditInput')
    var groupNameEditingBtnCancel=groupElement.querySelector('.groupNameEditingBtnCancel')
    groupNameEditingBtnCancel.addEventListener('click',groupNameEditCancel(groupIndex,groupNameEditInput,groupNameBox),false)
    // 确定重命名
    var groupName=groupElement.querySelector('.groupName')
    var groupNameEditingBtnConfirm=groupElement.querySelector('.groupNameEditingBtnConfirm')
    groupNameEditingBtnConfirm.addEventListener('click',groupNameEditConfirm(groupIndex,groupName,groupNameBox),false)
    groupNameEditInput.addEventListener('keydown',groupNameEditConfirm(groupIndex,groupName,groupNameBox),false)
    // 展开规则组
    var groupOpenBtn=groupElement.querySelector('.groupOpenBtn')
    groupOpenBtn.addEventListener('click',groupOpen(groupElement),false)
    // 删除规则组
    var groupDeleteBtn=groupElement.querySelector('.groupDeleteBtn')
    groupDeleteBtn.addEventListener('click',showDeleteDialog(groupIndex),false)
    // 创建规则
    var ruleCreateBtn=groupElement.querySelector('.ruleCreateBtn')
    ruleCreateBtn.addEventListener('click',ruleCreate(ruleCreateBox),false)
    // 取消创建
    var ruleCreateInput=groupElement.querySelector('.ruleCreateInput')
    var ruleCreatingBtnCancel=groupElement.querySelector('.ruleCreatingBtnCancel')
    ruleCreatingBtnCancel.addEventListener('click',ruleCreateCancel(ruleCreateInput,ruleCreateBox),false)
    // 确定创建
    var ruleCreatingBtnConfirm=groupElement.querySelector('.ruleCreatingBtnConfirm')
    ruleCreatingBtnConfirm.addEventListener('click',ruleCreateConfirm(groupIndex,ruleCreateInput,ruleCreateBox),false)
    ruleCreateInput.addEventListener('keydown',ruleCreateConfirm(groupIndex,ruleCreateInput,ruleCreateBox),false)
}
// 事件绑定和处理-创建规则组
function groupCreate(){
    if(!groupCreateBox.hasAttribute('data-group-creating')){
        groupCreateBox.setAttribute('data-group-creating','')
    }
}
var groupCreateBtn=groupCreateBox.querySelector('.groupCreateBtn')
groupCreateBtn.addEventListener('click',groupCreate,false)
// 事件绑定和处理-取消创建
var groupCreateInput=groupCreateBox.querySelector('.groupCreateInput')
function groupCreateCancel(){
    groupCreateInput.value=`group${allRules.length+1}`
        if(groupCreateBox.hasAttribute('data-group-creating')){
            groupCreateBox.removeAttribute('data-group-creating')
        }
    }
var groupCreatingBtnCancel=document.querySelector('.groupCreatingBtnCancel')
groupCreatingBtnCancel.addEventListener('click',groupCreateCancel,false)
// 事件绑定和处理-确定创建
function groupCreateConfirm(event){
    if(event?.key=='Enter'||event.type=='click'){
        // 处理数据
        var groupData={
            groupName:groupCreateBox.querySelector('.groupCreateInput').value,
            disabled:false,
            rules:[]
        }
        allRules.push(groupData)
        GM_setValue('allRules',allRules)
        var groupIndex=allRules.length-1
        // 创建新规则组
        injectGroupHTML(groupIndex,groupData)
        var groupElement=document.querySelector(`#rulesGroup_\\#${groupIndex}`)
        var ruleCreateBox=groupElement.querySelector(`.ruleCreateBox`)
        groupAddEventListener(groupElement,groupIndex,ruleCreateBox)
        // 处理前端
        groupCreateInput.value=`group${groupIndex+2}`
            if(groupCreateBox.hasAttribute('data-group-creating')){
                groupCreateBox.removeAttribute('data-group-creating')
            }
            event.preventDefault()
        }
    }
var groupCreatingBtnConfirm=document.querySelector('.groupCreatingBtnConfirm')
groupCreatingBtnConfirm.addEventListener('click',groupCreateConfirm,false)
groupCreateInput.addEventListener('keydown',groupCreateConfirm,false)
// 生成规则组
allRules.forEach((groupData,groupIndex)=>{
    // 插入规则组
    injectGroupHTML(groupIndex,groupData)
    // 获取规则组元素
    var groupElement=document.querySelector(`#rulesGroup_\\#${groupIndex}`)
    if(groupData.disabled){groupElement.setAttribute('data-group-disabled','')}
    // 生成规则
    var ruleCreateBox=groupElement.querySelector(`.ruleCreateBox`)
    groupData.rules.forEach((ruleData,ruleIndex)=>{
        // 插入规则
        injectRuleHTML(ruleCreateBox,groupIndex,ruleIndex,ruleData)
        // 获取规则元素
        var ruleElement=groupElement.querySelector(`#rule_\\#${groupIndex}_\\#${ruleIndex}`)
        if(ruleData.disabled){ruleElement.setAttribute('data-rule-disabled','')}
        // 绑定规则事件
        ruleAddEventListener(ruleElement,groupIndex,ruleIndex)
    })
    // 绑定规则组事件
    groupAddEventListener(groupElement,groupIndex,ruleCreateBox)
})






























// Your code here...
})();
