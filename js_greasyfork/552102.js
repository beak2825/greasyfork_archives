// ==UserScript==
// @name         四川学法用法学习助手
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  学习助手
// @author       kimi
// @match        https://www.scxfks.com/study/*
// @icon         data:image/png;base64,AAABAAEAEBAAAAEAIABoBAAAFgAAACgAAAAQAAAAIAAAAAEAIAAAAAAAAAQAABILAAASCwAAAAAAAAAAAAA/UcQAXHTAAx0lyEUNFNXFDzTh0g0z4tcIGOb8Ej/l6xRD6esMJfD6Gknx1iZY4cwpP+/PRFrzUGOI9gVTdfUAHCfQACArzikJDtzbAgne/wc53f8ITt//DFDf/xmF4v8ciOb/G2ru/yN78v8jaez/Fizp/xcv8eUvUvc7I0X1ABwjyAAdI8kmBQjf5gII3v8LH+j/EUPq/wxL6v8MTev/EFDs/xhb7/8VU/H/Cyvy/woX7v8IIfLtJUv4MSFF9gAdZcoAJXDNOQkf0ewJN+T/PJTs/yV+6P8QaNf/GZTi/xyZ5f8fhO3/JoLq/zGb7v8TSfP/CyT05UuH9is/evYALnrYCDCj4qMZet//Fozj/xpk6/8KJO7/CB/k/xBJ4P8QUun/Cy7x/wsm7v8eY+f/PK7t/0GW9P9p0fSSYen2BCKQ304wp+PwLK3j/w+M2/8Kfd3/FYbi/yKU5v8glOf/I5jq/y2i7f8xqPD/NKrx/0O/8P9h0vL/WdT06Fjc+D8fktymHZ/g/x5/5f8EJ+H/BCjf/xFn1f8cneH/H6Hj/yGl5f8orun/Iofv/xFA8/8ROe3/Po7l/1zY9f9h2/edH5Pb5CGg4f8NRuT/AADj/wEA4/8IKNT/Fnrg/xV95P8Xgeb/HIXo/ww17/8AAvD/AAHv/xpC4f9Z0PH/Zdj14hmR2ugVj9z/CC7e/wAA3f8BAOL/AgPh/wYW4/8EEef/AxDo/wUX6P8CB+z/AQTt/wAD7v8LJd//P7zs/0rQ9eYmnN7SHpvf/ww/3v8AANn/AADd/wEF3f8MR9n/CSjk/wQh3P8MReD/Awnq/wEE6/8AA+v/CzLX/y2x6f9AwfDUM6Timx6a3v8TYN7/AgLW/wQa1P8GINv/BBzc/wMQ5P8CDuH/BR3j/wUe4P8GGeX/AALo/xZX2P8yuez/L7PrtTGh30Mcmd3sGYrf/wgg2f8GKtD/D0Hg/wQM3f8QQdr/CjfY/wIL5f8GMdf/CjHk/wUU4P8mkOP/QL7u9VvH8F5pvuoHJprenRqY3v8VdOD/Bhra/wED3/8CDdT/EVrJ/yZ/5P8OI+j/AATn/wQW4/8aceD/NLfs/0a97rBXyPEOLqHiADWe4CAlneG2HJvh/xV63v8JNdz/BRXd/wQm1P8HK+H/Bxbh/ww24P8egeL/IqPl/zWt6cdJvO4uP7nuAKfr/AAmoOQAOqzoGSKa4ZEameDtFo/d/xaB3v8YgOD/Fnje/x2F4P8oouX/L6zo8i2m56EnmOMkG4/gADu67AAAAAAAAAAAAES17ABLue4GNKnnRymf46Qdkt/fG5bi+BmQ3/sonuPlManmqzaq509JuOwKMabnAAAAAAAAAAAAgAEAAIABAACAAQAAgAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIABAADAAwAA4AcAAA==
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/552102/%E5%9B%9B%E5%B7%9D%E5%AD%A6%E6%B3%95%E7%94%A8%E6%B3%95%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/552102/%E5%9B%9B%E5%B7%9D%E5%AD%A6%E6%B3%95%E7%94%A8%E6%B3%95%E5%AD%A6%E4%B9%A0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查总学分
    function checkTotal(){
        const userbox=document.querySelector(".userbox")
        const total=parseFloat(userbox.querySelectorAll('p')[3].innerText.match(/\d+(?:\.\d+)?/)[0]);
        //console.log(total)
        if(total>=100){
            return true;
        }
        return false;
    }
    // 点击年度-日常学法
    function start(){
        const isIndexPage=window.location.href.includes('/study/index')
        // 日常学法-年度课程
        const isYearCourseList = window.location.href.includes('/study/courses/year');
        // 所有课程列表页
        const isAllCourseList = window.location.href.includes('/study/courses/all');
        // 具体课程内容
        const isCourse=/\/study\/course\/\d+$/.test(window.location.href)
        // 内容页
        const isContent=/\/study\/course\/\d+\/chapter\/\d+/.test(window.location.href)
        if(isIndexPage){
            if(checkTotal()) return;
            const year=document.querySelector('.content.nav').querySelectorAll('a')[1]
            //console.log(year)
            year.click()
        }
        if(isYearCourseList){
            const allCourseListbtn=document.querySelector('.card.nopad.bgxy').querySelectorAll('a')[1]
            allCourseListbtn.click();
        }
        if(isAllCourseList){
            //const list=document.querySelector('ul.film_focus_nav').querySelectorAll('li')
            const list=document.querySelector('table.list-tab').querySelector('tbody').querySelectorAll('tr')
            for(let i=0;i<list.length;i++){
                let tds=list[i].querySelectorAll('td')
                if(tds[tds.length-1].innerText!="已经完成"){
                    tds[tds.length-1].querySelector('a').click();
                    return;
                }
            }
        }
        if(isCourse){
            const list=document.querySelectorAll('li.c_item')
            // console.log(list[1].innerText)  2.中共中央印发《法治社会建设实施纲要（2020－2025年）》
            //获得0.5学分
            for(let i=0;i<list.length;i++){
                console.log(i,":",/获得\d+\.?\d+学分/.test(list[i].innerText))
                if(/获得\d+\.?\d+学分/.test(list[i].innerText)){
                    continue;
                }else{
                    list[i].querySelector('table').click();
                    return;
                }
            }
            document.querySelector('.content.nav').querySelectorAll('a')[1].click()
        }
        if(isContent){
            const dom=document.querySelector('.chapter-score')
            //console.log(dom.classList)
            const btn=document.querySelector('button')
            if(document.querySelector('.chapter-score').classList.contains('chapter-score-suc')){
                btn.click()
            }
            // 达到每日上限
            if(document.querySelector('.chapter-score').classList.contains('limit')){
                alert("学习完成")
                return
            }
            setTimeout(start,1000)
        }
    }
    window.addEventListener('load', () => {
        start()
    })
})();