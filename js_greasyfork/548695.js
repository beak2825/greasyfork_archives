// ==UserScript==
// @name        💯超星学习通小助手-章节、作业、考试覆盖98%|有任何问题请联系客服VX：xue808010|后台自动挂机|闯关课程|自动答题|阅读时长|公式题、图片题|1:1时长|不清进度|云端题库实时更新💯
// @namespace    http://tampermonkey.net/
// @version      4.3.2
// @description  💯支持【超星学习通】【智慧树知到】【职教云系列】【雨课堂】【考试星】【168网校】【继续教育类】【绎通云课堂】【九江系列】【柠檬文才】【亿学宝云】【优课学堂】【小鹅通】【安徽继续教育】 【上海开放大学】 【华侨大学自考网络助学平台】【良师在线】【和学在线】【人卫慕课】【国家开放大学】【山财培训网（继续教育）】【浙江省高等学校在线开放课程共享平台】【国地质大学远程与继续教育学院】【重庆大学网络教育学院】【浙江省高等教育自学考试网络助学平台】 【湖南高等学历继续教育】 【优学院】 【学起系列】【青书学堂】 【学堂在线】【英华学堂】【广开网络教学平台】等平台。内置第三方题库，需要付费，不是本人收取，有任何问题请联系客服VX：xue808010 进行解决
// @author       学捷阁
// @run-at       document-end
// @match        *://*.chaoxing.com/*
// @match        *://*.edu.cn/*
// @match        *://*.nbdlib.cn/*
// @match        *://*.hnsyu.net/*
// @match        *://*.gdhkmooc.com/*
// @connect      cx.icodef.com
// @connect      api.tikuhai.com
// @connect      sso.chaoxing.com
// @connect      mooc1-api.chaoxing.com
// @connect      mooc1-1.chaoxing.com
// @connect      mooc1-2.chaoxing.com
// @connect      mooc2-ans.chaoxing.com
// @connect      cdn.bootcdn.net
// @connect      cdnjs.cloudflare.com
 
// @connect      mooc1.chaoxing.com
// @connect      fystat-ans.chaoxing.com
// @connect      stat2-ans.chaoxing.com
// @connect      mooc1.gdhkmooc.com
// @connect      mooc2-ans.hnsyu.net
// @connect      mooc1.hnsyu.net
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAMAAACahl6sAAAAY1BMVEUqpQsqpRUqpRUqpRUppBUqpBUqpRQqpRQqpRUqpRUqpRYqpRUnpBsqpRUqpRUqpBYppBUpphYqpRUqpRQqpRUqpRUqpRUqpRUpphUrpRUqpRUqpRQqpRUqpRQppRUqpRUqpRXRpjWOAAAAIHRSTlMAc+PDoII0G/OWU7QJYcYiQxTUZenf99C/XzCufU3wkc0k4ycAAAt0SURBVHja7V1pe7I6EBVkkUVBUfGtovz/X3nRtkpmy8QF7X043yohyUlmzkxCoJPJiBEjRowYMWLEiBEjRowYMWLEiP8pPN+fBmH07m48iDictd9I/jKVKGh7CN/dnXuRZq2JIH93l+7BfNoiLIp398oZ6aKlELy7X44os5ZB+u6uuaAIWhaLeOjeLMN2lSXhHe1Wa55HmwxM4zqo69DRP2NhOtrNwApsmPjWqfG0FnjUw3oIkn8HcwhbGcFw+kvJv1Y0o11rw2wg42LkX9e66OVXVAPQiFhHLRV3JxoaHf69mkYsGPjULsOBkkfbfr2WR+ULbdv9fa/moTPUKrlPF6Ro3Nb2phdqGl1sstaWH3zV6DlOh2+/X3TzKgS1W/w9/i3vnGLGFrvIbBVINwfLroDnYFu9QXWck1KKxhqrlqwyJdqQ+tcYsWjuwsNr7RCNgZvH83Rc1a4vibzJFEDDNw5Jq0r+fUFCmFu8boAOt1JxnyI7pshV1YlAzi6BTPCDSMtEHU0i38gRexd3dE1fhKsqhOaCpVo2OWulBwJ7QWol4pHSp9tEio9aHpw5kNnAhkjX+yNGESkY5VSFxUjq+aZMttYaU+rOjCi67NdFEEm5QKbhUUo8zl4WJ+AHNIwr5k6Epl8CE2HTPMad1DyyH9Osbj/VRBVUXkMrdSj1ruAVR5H0czwyY1B7TeBtQioCMc5pdHVvXks3/Igu7+Ux80Jj86nnBMjyG33DuaFIhqZFUrq6n9gQ0zd2JpUaPe7xbWAVRGbDBWJz2PpelLYS7LsVpEhsPVSuZ9vQXImUoOGaM43QI+snUFt3vUnv2hH23ZN/oEbEUB7Y9kzzSblKtoejskJpHKictGAMgjQsPi8Cgbe8XjC2bPwKEJ7ZoiFpl56tpEkUG5aQnFdmyZsn9cLk4h+SD9typKDWH7Rb9btr5I14LKTQZVry8fr7LbXIUlzOundD6R0j/33KhhSiZPMoZHeFWXSKLgQlNTq2hSkVxpaKHvTrnaMaKn2LN4vJz3/6v/vkOdjktGyAlXoepm33iaB9VXGfAExfZVy5PbkAnlRPROTECoS1CsMIe6aFPGQlLUnh0JX9Ob9FCqiDFu0llJcPn0bY7A16pq8CN7llih3MYkdZe6MZ4uGxhU01TJjfW4tOxiCLYHy48B3qpBSL5wFiRcj8bhu8UNfgSWvvF2D5F7Yplj5dcrnW14EnhOkhXK1atBd5+lRIy4DGXv0AqEvri5tPcEIYMYKmIue9SP630gQCl46Y3yXjJCbkRBaDbmfRXiT/Uh9APL4GG2gEcq6NVLLUDJo8ONhDxAUYiMdH5nd5WY0mhB5qaCpHeasU0vZFtZkyPQDWvHKbENKyUJSWtRfJvziWJSh8jYdAs0TJKtDuYUkVQ+mfrL1QGKZOpX9ZRy5torBFWhayP1l7ofPKCod2IX87DEZPdDMo1IwTh049Q8Vl2jB6Xx/87fRtFmiLg3RiNCELsWc5LF46Td+VtrEhLOs9zodIJ0YTImsvnGb5SSPMfK4+HdE/a1psaYdCE7KWtTdQ1HmbkCPXBdA7YVqxYdHWrFPoG0C18mYkqvyqcOZ4HIUgQmwNULTRhFi0F6qQ+LwUy//VbM1mBcFAxqn1EMt+L1BNX9zmxoP5mwMsGX4IB1RFu6USCTwhlv1ekJ6IOQD20uvIfymtgHB0WhjQhMjaix4il0JRwkuvowTyTq4Kai+TXragzUJZe2FcEGljw7oVNy2U210kH06SmR1i7Fse7YAbHOX/1gfTEhgDLVoCtA+jZ7m2EwLAFKX9TWxYvUzdbJg2gyX1wHxGNokp256rm74unScg5L83SmamRQsMeUaH5oxc3XoeyNcWJ55DbXpmaxIhh484psoFnBxxtk0IkH9eqqlHQP3BNIlQcZ08wcAciUeubj1qBuSfVQZqp97YXDCIUBZKHzbSPLTWTAigzorvnOqEIZs7Sz30w03mISlSafvZP91RPOrBOVgQG0TwYoTmwe0NKLeK+FuYiukzNuZoGpq2lpv5BSstcO/EfjwAeCA904WmF2ZXc+kiP2/cwLGP6W8wJZE8Ck2fhYBbX2bYL41rzNEYtlOQt7yr8w1TrynRyukzaNAKTTfqO1tBxg/p5BgMIpZ0Ed9DPjKiD34h886Ny7cwl1fMmduS7VOpp8x0k5J/uhtEPDbjxE9kjT2Gxpbn4bg99QPDbgj5p89o1sQYmeN4Meso5M7x+QIP1KbqxRKzf+gy7ab0cJrtn/KGP281lQI1FMm1/YzZBJgWkn/mDDOdkckHrPoIxX16t302ehhV8s9OtfLNHd+yiQCTS90bceZdpXGNkU1WDONVq8DepkHm1mu7UvEAg96X/5LpljDTCuNaW2NCCe5QvmFhtn0TuiLc0j0Rz9tajWtvf40K2rPyXUt6YfV14o6Uy5qeyyfqfU2Ihi6ifb/CFNiL/Je8btrmuWwF6N7yAhFUk2ddAJZ+4XIuvMVpf2mjYV+qykpdh2auTf4g2rZarDVvPEb06emp9r1PmGsr6U/srwPf+qJ7Y4M6zx4oFhQ/AMa5Vd84WarUv7Nw9ZcyGpNK7fTmO4jrqoSRvpWG2xvnZbj7sVg/LF1uRAai0TnuXgqhKnEzyTRpdXD/CA0IRW4V2OLY1HFUHwGQfscvv4hzshjiRfMr9HvRJNIPoQHTcRdfF5kMTWMyMcPQHe9JU99CyN7w+RgzybtrHMFHNvz3fPfKXOWX91XSk/+kedOXoszc74Hv8Fzk/86BeAaMrYfj4/W9AMsiKtPKK3u/RE1VwmL9QGJ7tD5Ux8/9Dk9BNq03t+y+TOeXHxc+7QVRz0ucw8gzEUdpFQa7WvXasr9ARIxIMPyH0PIiSr0wWPia7rfbOkvCqoloX+75+4D6n3+lXjLV9b+bgP3JS6PCooi3dcAQX93Ko/SgZlBnp6q09d+g8l2x5h3pu7HsGDjYUNgxuKeZIg1f9429rvJMy2DfMXjsu3LL8BWfquo47HRCtEseZfAqRFWy0Oy1XCi4LyWHQB5VgfVrNZ9NobOleaLgcPxkCp0xeZn9a2t+FqYf/AnSOD3Zv+1SB94HT8N5IgKbuG4XSRU9ulTJ4yJqzgllEnzvCOff+WX358Mc8iacWpRptnvAlC6pWHJOhH1TxEF++eBMHKYyh7ZOqns4dCM9PySZLg3YrqbBAxEwnlvMyd97paMt5UVThUmmy+TbY5cKe/OyeMTpylB07LMxOcXovOhS4Z06FQ74VN4BRRVIEutmTG4MdomXOqTCUruNNBXb3UFvTC4MNp0NNc8LPUW156fimOl30M852EzF4LwceSKDbxb8B5L8zFOSyEtPlYOdQ+fhBeFfYOEHShJxc9hrnnFtFy+hILKog0pFQrmsmi2CZ3qCkoUf6MQp8vYKDvULKUgspqoHfMsue1FYUqKb1qezWCX/FGNXVPZFyXqAdD6fkyy2KnlSLEq6JUkzwPI8OlFmXSepPatpQtuixB9qSRJXhGGvNVMReZZvijunYA+gCXDmuVJMhTUXvjOfvw/FATvoQiFQllzYzxxSsMeRp/jNmZ3doL68veTZi9PA+wxRCNOH495qC8tU0liXNPJJWKKQ4dvdooszfAarTyOfCfgFudruFlIuvNGmka/lsbH/oyuBxaDaBNHvVTa3yQvPYnC/hrie8Kmtk8Gy2KgSsBcjUjoGy2I3uDoxSHc76+lBjkWXgH3msxmGKnkyWZcLfw6isP77U0EvTP7aVNDvOvl/bCqoxEWXC38YygROhiKL/DjEHlwlqta5H4a8ScAq8WMinhsPsNpTbsR9HsyDvNvBz+8+DcYp8bp8d3fuR29Lp/b+nIP38Dsjs331J//X6w3nBNE//T21xUj//L91HjFixIgRI0aMGDFixIgRI0aMeDb+A8GbtsQaz3w6AAAAAElFTkSuQmCC
// @grant        unsafeWindow
// @grant        GM_info
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @antifeature  ads
// @require      https://lib.baomitu.com/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/blueimp-md5/2.19.0/js/md5.min.js
// @resource     layxcss https://cdn.bootcdn.net/ajax/libs/layx/2.5.4/layx.min.css
// @resource     layxcss https://cdnjs.cloudflare.com/ajax/libs/layx/2.5.4/layx.min.css
// @resource     layuicss https://lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/layui/2.6.8/css/layui.min.css
// @resource     ttf https://www.forestpolice.org/ttf/2.0/table.json
// @license No
// @downloadURL https://update.greasyfork.org/scripts/548695/%F0%9F%92%AF%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%B0%8F%E5%8A%A9%E6%89%8B-%E7%AB%A0%E8%8A%82%E3%80%81%E4%BD%9C%E4%B8%9A%E3%80%81%E8%80%83%E8%AF%95%E8%A6%86%E7%9B%9698%25%7C%E6%9C%89%E4%BB%BB%E4%BD%95%E9%97%AE%E9%A2%98%E8%AF%B7%E8%81%94%E7%B3%BB%E5%AE%A2%E6%9C%8DVX%EF%BC%9Axue808010%7C%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%7C%E9%97%AF%E5%85%B3%E8%AF%BE%E7%A8%8B%7C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%7C%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF%7C%E5%85%AC%E5%BC%8F%E9%A2%98%E3%80%81%E5%9B%BE%E7%89%87%E9%A2%98%7C1%3A1%E6%97%B6%E9%95%BF%7C%E4%B8%8D%E6%B8%85%E8%BF%9B%E5%BA%A6%7C%E4%BA%91%E7%AB%AF%E9%A2%98%E5%BA%93%E5%AE%9E%E6%97%B6%E6%9B%B4%E6%96%B0%F0%9F%92%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/548695/%F0%9F%92%AF%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%B0%8F%E5%8A%A9%E6%89%8B-%E7%AB%A0%E8%8A%82%E3%80%81%E4%BD%9C%E4%B8%9A%E3%80%81%E8%80%83%E8%AF%95%E8%A6%86%E7%9B%9698%25%7C%E6%9C%89%E4%BB%BB%E4%BD%95%E9%97%AE%E9%A2%98%E8%AF%B7%E8%81%94%E7%B3%BB%E5%AE%A2%E6%9C%8DVX%EF%BC%9Axue808010%7C%E5%90%8E%E5%8F%B0%E8%87%AA%E5%8A%A8%E6%8C%82%E6%9C%BA%7C%E9%97%AF%E5%85%B3%E8%AF%BE%E7%A8%8B%7C%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%7C%E9%98%85%E8%AF%BB%E6%97%B6%E9%95%BF%7C%E5%85%AC%E5%BC%8F%E9%A2%98%E3%80%81%E5%9B%BE%E7%89%87%E9%A2%98%7C1%3A1%E6%97%B6%E9%95%BF%7C%E4%B8%8D%E6%B8%85%E8%BF%9B%E5%BA%A6%7C%E4%BA%91%E7%AB%AF%E9%A2%98%E5%BA%93%E5%AE%9E%E6%97%B6%E6%9B%B4%E6%96%B0%F0%9F%92%AF.meta.js
// ==/UserScript==
/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
var defaultConfig = {
    ua: 'Dalvik/2.1.0 (Linux; U; Android 11; M3121K1AB Build/SKQ1.211006.001) (device:M3121K1AB) Language/zh_CN com.chaoxing.mobile/ChaoXingStudy_3_5.1.4_android_phone_614_74 (@Kalimdor)_',
    interval: 3000,
    autoVideo: true,
    autoRead: true,
    autoAnswer: true,
    videoSpeed: 1,
    reviewMode: false,
    matchRate: 0.8,
    autoSubmitRate: 0.8,
    autoSubmit: true,
    autoSwitch: false,
    tutorial: true,
    randomAnswer: false,
    threadWatch: true,
    freeFirst: true,
    readSpeed: 10,
    notice: '本脚本仅供学习研究，请勿使用于非法用途！',
    debugger: true,
    types: {
        '单选题': '0',
        '多选题': '1',
        '填空题': '2',
        '判断题': '3',
        '简答题': '4',
        '名词解释': '5',
        '论述题': '6',
        '计算题': '7',
    },
    /** 付费题库可将token填入下方''中 */
    token: '',
}, otherApi = [
    {
        desc: "接口来源:https://cx.icodef.com/query.html",
        url: 'http://cx.icodef.com/wyn-nb?v=4',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Authorization': ''/** 一之题库token填写 */
        },
        method: 'post',
        getdata: (data) => {
            return `question=${encodeURIComponent(data.question)}`;
        },
        getanswer: (response) => {
            const res = JSON.parse(response.responseText);
            if (res.code === 1) {
                let data = res.data.replace(/javascript:void\(0\);/g, '').trim().replace(/\n/g, '');
                if (data.includes('叛逆') || data.includes('公众号') || data.includes('李恒雅') || data.includes('一之')) {
                    return false;
                } else {
                    return data.split("#");
                }
            }
            return false;
        }
    }
], _self = unsafeWindow, top = (/* unused pure expression or super */ null && (_self)), script_info = GM_info.script, cache_key = "20230524", reqUrl = {
    "api": "http://api.tikuhai.com/",
    "headers": {
    }
},
    icon = `<svg t="1679897263513" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1586" width="32" height="32"><path d="M105.321374 914.265136c-11.700669 0-17.551004-11.702475-17.551003-17.541972 0-5.870203 5.850335-17.551004 11.7097-17.551004 269.155125-111.194286 561.722425-169.684988 848.441196-181.3983v5.839497c23.410369 0 52.662042-5.839497 76.076024-5.839497v11.711506c-292.558269 29.251673-579.284266 87.756824-854.300562 175.535323-17.551004 17.541972-40.964985 23.403144-64.375355 29.244447zM772.382332 580.741882c-29.260704 0-58.514183-5.861172-76.054349-29.240835-17.55281-23.412175-35.123682-46.826157-35.123681-76.079636 0-81.917327 23.403144-157.984319 76.068798-222.350642 46.835188-64.377161 117.042815-111.168999 193.106195-140.433316 29.251673 0 52.654817 17.563647 64.368129 40.954148-5.862978 5.850335-11.711506 11.711506-17.563647 11.711506 29.251673 11.700669 40.952342 35.102007 40.952342 64.366324 5.862978 163.834654-99.459299 310.121916-245.753787 351.072451z m157.996963-374.484627c-11.702475 5.850335-29.273347 17.551004-40.954148 29.264316-5.870203 0-5.870203-5.850335-5.870203-11.711506-87.778499 52.665654-146.281844 146.294487-152.114116 245.742949 0 11.711506 5.832272 52.665654 23.38147 46.835188 29.284184-11.7097 52.662042-23.423013 70.225688-46.835188 19.503523-21.441593 39.00524-42.894024 58.506958-64.344648 35.121876-46.81532 58.535857-105.320471 70.216658-163.847297 11.700669-17.55281-5.848528-29.253479-23.392307-35.103814zM122.872378 288.185419l-64.366323 29.251673c-5.839497 5.839497-11.689832 5.839497-17.540167 5.839497-5.862978 0-5.862978-11.713313-5.862978-17.540166 0-17.551004 11.713313-29.264316 29.273347-35.114651 35.103813-29.264316 70.20582-52.654817 111.158163-70.216657 17.551004 5.850335 29.264316 23.403144 35.11465 40.952341 0 17.540166 0 17.540166-81.919133 204.812282-29.249866 58.505151-52.651204 122.873281-58.523213 187.237798 0 5.852141 5.872009 17.55281 5.872009 23.412176v5.841303c-1.959745 1.948907-3.910458 3.912264-5.872009 5.861172-5.830466 0-11.700669 0-11.700669-5.861172-29.253479 0-52.663848-17.55281-58.505152-46.804482 0-46.813513 11.711506-99.470137 29.251673-140.433316 23.413982-64.366323 58.517795-122.871475 93.619802-187.237798zM637.792126 282.326054c11.700669 157.984319-87.760436 298.417635-239.892614 339.380813-29.264316 0-58.515989-5.850335-76.07783-29.264316-23.401338-17.561841-35.092976-46.813513-35.092976-76.056155 0-81.926358 23.403144-157.99335 76.068798-222.359673 46.804482-64.355486 117.008497-111.159968 193.086327-140.433316 29.242642 0 52.665654 17.551004 64.368129 40.975823-5.852141 5.839497-11.702475 11.689832-17.55281 11.689832 17.551004 17.549197 35.092976 46.811707 35.092976 76.066992z m-81.908295-35.103814c-11.7097 5.850335-29.260704 17.551004-40.963179 29.251673-5.850335 0-5.850335-5.850335-5.850335-11.700669-87.769468 52.665654-146.272813 146.28365-152.135791 245.762818 0 11.680801 5.862978 52.663848 23.413982 46.793645 29.251673-11.702475 52.665654-23.403144 70.20582-46.793645a140273.571944 140273.571944 0 0 0 58.515989-64.366324c35.103813-46.826157 58.514183-105.320471 70.214852-163.84549 11.713313-17.551004-5.839497-29.253479-23.401338-35.102008zM23.414885 808.944665c269.155125-111.170806 561.711587-169.684988 848.437584-181.3983v5.859365c29.251673 0 52.665654-5.859366 76.068798-5.859365v11.711506c-292.558269 29.26251-579.287878 87.778499-854.302368 175.544354-23.413982 11.713313-40.954148 17.554616-64.36813 23.3905h-5.837691c-5.872009 0-11.702475-5.835885-11.702475-17.551003 3.903233-3.896009 7.804661-7.797436 11.704282-11.697057z" fill="#e6e6e6" p-id="1587"></path></svg>`;
let cacheData = GM_getValue(cache_key);
if (cacheData && !cacheData.token) cacheData.token = defaultConfig.token;
defaultConfig = cacheData || defaultConfig;
const log = msg => defaultConfig.debugger && console.log(msg);
(function () {
    'use strict';
    String.prototype.cl = function () {
        return this.replace(/^【.*?】\s*/, '').replace(/\s*（\d+\.\d+分）$/, '')
    };
    var utils = {
        randomStr: (len = 32) => {
            const $chars = 'qwertyuioplkjhgfdsazxcvbnm1234567890';
            let ss = '';
            for (let i = 0; i < len; i++) {
                ss += $chars.charAt(Math.floor(Math.random() * $chars.length));
            }
            return ss;
        },
        notify: (level, msg) => {
            let data = {
                level: level,
                msg: msg
            }
            return JSON.stringify(data);
        },
        sortData: (data) => {
            const arr = [];
            data.forEach(item => {
                const parent = data.find(item2 => item2.id === item.parentnodeid);
                parent ? (parent.children || (parent.children = [])).push(item) : arr.push(item);
            });
            return arr;
        },
        toOneArray: (arr) => {
            return arr.reduce((newArr, item) => newArr.concat(item, item.children ? utils.toOneArray(item.children) : []), []);
        },
        sleep: (time) => {
            return new Promise(resolve => setTimeout(resolve, time));
        },
        getUrlParam: (name) => {
            const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            const r = window.location.search.substr(1).match(reg);
            return r ? unescape(r[2]) : null;
        },
        toQueryString: (obj) => {
            return obj ? Object.keys(obj).sort().map(key => {
                const val = obj[key];
                return Array.isArray(val) ? val.sort().map(val2 => encodeURIComponent(key) + '=' + encodeURIComponent(val2)).join('&') : encodeURIComponent(key) + '=' + encodeURIComponent(val);
            }).join('&') : '';
        },
        getInputParam: (name) => {
            const input = document.getElementsByName(name)[0];
            return input ? input.value : null;
        },
        getVideoEnc: (clazzid, uid, jobid, objectId, playingTime, duration) => {
            return md5("[" + clazzid + "][" + uid + "][" + jobid + "][" + objectId + "][" + (playingTime * 1000) + "][d_yHJ!$pdA~5][" + (duration * 1000) + "][0_" + duration + "]");
        },
        getTimestamp: () => {
            return new Date().getTime();
        }
        , removeHtml: (html) => {
            if (html == null) {
                return '';
            }
            // 判断是否为字符串
            if (typeof html !== 'string') {
                return html;
            }
            return html.replace(/<((?!img|sub|sup|br)[^>]+)>/g, '').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').replace(/<br\s*\/?>/g, '\n').replace(/<img.*?src="(.*?)".*?>/g, '<img src="$1"/>').trim();
        }
        , cache: (key, value) => {
            GM_setValue(key, { value: value, time: utils.getTimestamp() });
            return value;
        },
        cacheExpired: (key, time) => {
            var cache = GM_getValue(key);
            if (cache) {
                if (cache.time + time > utils.getTimestamp()) {
                    return cache.value;
                }
            }
            return false;
        },
        matchIndex: (options, answer) => {
            var matchArr = [];
            for (var i = 0; i < answer.length; i++) {
                for (var j = 0; j < options.length; j++) {
                    if (answer[i] == options[j]) {
                        matchArr.push(j);
                    }
                }
            }
            return matchArr;
        }
        , similarity: (s, t) => {
            let l = Math.max(s.length, t.length);
            let n = s.length;
            let m = t.length;
            let d = Array.from({ length: n + 1 }, (_, i) => [i]);
            for (let j = 0; j <= m; j++) d[0][j] = j;
            for (let i = 1; i <= n; i++)
                for (let j = 1; j <= m; j++) {
                    let cost = s[i - 1] === t[j - 1] ? 0 : 1;
                    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + cost);
                }
            return (1 - d[n][m] / l);
        }
        , fuzzyMatchIndex: (options, answer) => {
            const matchArr = [];
            for (const ans of answer) {
                let maxSim = 0, index = 0;
                for (let i = 0; i < options.length; i++) {
                    const sim = utils.similarity(ans, options[i]);
                    if (sim > maxSim) {
                        maxSim = sim;
                        index = i;
                    }
                }
                if (maxSim > defaultConfig.matchRate) matchArr.push(index);
            }
            return matchArr;
        }
    };
    var api = {
        monitorVerify: (responseText, url, method, data, ua) => {
            return new Promise((resolve, reject) => {
                try {
                    let obj = JSON.parse(responseText);
                    let divHtml = '<img src="' + obj.verify_png_path + '"/> <input type="text" class="code_input" placeholder="请输入图中的验证码" /><button id="code_btn">验证</button>';
                    layx.prompt(divHtml, "请输入验证码", function (id, value, textarea, button, event) {
                        let url = obj.verify_path + "&ucode=" + value;
                        window.open(url);
                    });
                } catch (error) {
                    let domain = url.match(/:\/\/(.[^/]+)/)[1];
                    let urlShowVerify = "https://" + domain + "/antispiderShowVerify.ac";
                    page.layx_log(`<a target="_blank" href="${urlShowVerify}">若未自动弹出页面，请点我打开</a>`, 'error');
                    layx.iframe('verifyCode', '验证码验证', urlShowVerify);
                    let timer = setInterval(() => {
                        api.defaultRequest(url, method, data, ua, true).then((response) => {
                            if (response.responseText && !response.responseText.includes('输入验证码')) {
                                layx.destroy('verifyCode');
                                clearInterval(timer);
                                page.layx_log('验证码验证成功！', 'success');
                                resolve(response);
                            } else {
                                page.layx_log('验证码验证失败！将在5s后重新验证', 'error');
                            }
                        })
                    }, 5000);
                }
            });
        },
        defaultRequest: async (url, method, data = {}, ua = defaultConfig.ua, verify = false) => {
            try {
                const response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        url,
                        method,
                        headers: {
                            'User-Agent': ua,
                            'X-Requested-With': 'XMLHttpRequest',
                            'Sec-Fetch-Site': 'same-origin',
                            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                        },
                        data: utils.toQueryString(data),
                        onload: resolve,
                        onerror: reject
                    });
                });
                if (!verify && response.responseText && response.responseText.includes('输入验证码')) {
                    page.layx_log('检测到验证码！将弹出新页面自行验证验证码（出现验证码多为间隔频率过短，或者请求过多，请根据自己情况调高运行间隔）', 'error');
                    await api.monitorVerify(response.responseText, url, method, data, ua);
                    return await api.defaultRequest(url, method, data);
                }
                return response;
            } catch (err) {
                if (err.error.indexOf("connect list") != -1) {
                    let domain = err.error.match(/:\/\/(.[^/]+)/)[1];
                    let notice = `由于connect未添加导致无权限请求<br><a target="_blank" href="https://afdian.net/p/e2460ee4c2fa11ed9ab152540025c377">点我查看具体教程</a><br>请复制以下代码至脚本中的第19行位置<br>// @connect      ${domain}`;
                    page.layx_log(notice, 'error');
                }
                return Promise.reject(err);
            }
        }
        ,
        getVerifyCode: async (url) => {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "blob",
                    onload: function (res) {
                        var blob = res.response;
                        var reader = new FileReader();
                        reader.onload = function (event) {
                            resolve(event.target.result);
                        };
                        reader.readAsDataURL(blob);
                    }
                });
            });
        },
        getCourseChapter: async (courseId, classId) => {
            let url = _self.ServerHost.mooc1Domain + "/gas/clazz?id=" + classId + "&personid=" + courseId + "&fields=id,bbsid,classscore,isstart,allowdownload,chatid,name,state,isfiled,visiblescore,begindate,coursesetting.fields(id,courseid,hiddencoursecover,coursefacecheck),course.fields(id,name,infocontent,objectid,app,bulletformat,mappingcourseid,imageurl,teacherfactor,jobcount,knowledge.fields(id,name,indexOrder,parentnodeid,status,layer,label,jobcount,begintime,endtime,attachment.fields(id,type,objectid,extension).type(video)))&view=json";
            let result = await api.defaultRequest(url, 'GET');
            return JSON.parse(result.responseText);
        },
        getChapterList: async (courseid, clazzid, nodes, userid, cpi) => {
            let data = {
                "view": "json",
                "nodes": nodes,
                "clazzid": clazzid,
                "userid": userid,
                "cpi": cpi,
                "courseid": courseid,
                "time": (new Date()).valueOf()
            }
            let result = await api.defaultRequest(_self.ServerHost.mooc1Domain + "/job/myjobsnodesmap", 'post', data);
            return JSON.parse(result.responseText);
        },
        getChapterInfo: async (id, courseid) => {
            let data = {
                "id": id,
                "courseid": courseid,
                "fields": "id,parentnodeid,indexorder,label,layer,name,begintime,createtime,lastmodifytime,status,jobUnfinishedCount,clickcount,openlock,card.fields(id,knowledgeid,title,knowledgeTitile,description,cardorder).contentcard(all)",
                "view": "json",
            }
            let url = _self.ServerHost.mooc1Domain + "/gas/knowledge?" + utils.toQueryString(data);
            let result = await api.defaultRequest(url, 'get');
            return JSON.parse(result.responseText);
        },
        getChapterDetail: async (courseid, clazzid, knowledgeid, num, cpi) => {
            let url = _self.ServerHost.mooc1Domain + "/knowledge/cards?clazzid=" + clazzid + "&courseid=" + courseid + "&knowledgeid=" + knowledgeid + "&num=" + num + "&cpi=" + cpi + "&ut=s&cpi=229749849&v=20160407-1";
            let result = await api.defaultRequest(url, 'get');
            return result.responseText;
        },
        uploadStudyLog: async (courseid, clazzid, knowledgeid, cpi) => {
            let url = `${location.origin}/mooc2-ans/mycourse/studentcourse?courseid=${courseid}&clazzid=${clazzid}&cpi=${cpi}&ut=s&t=${utils.getTimestamp()}`
            let text = await api.defaultRequest(url, 'get', {}, navigator.userAgent);
            let match = text.responseText.match(/encode=([\w]+)/);
            if (match) {
                const encode = match[1];
                let url = `${_self.ServerHost.moocTJDomain}/log/setlog?personid=${cpi}&courseId=${courseid}&classId=${clazzid}&encode=${encode}&chapterId=${knowledgeid}&_=${new Date().valueOf()}`;
                let result = await api.defaultRequest(url, 'get', {}, navigator.userAgent);
                return result.responseText;
            }
            return false;
        },
        docStudy: async (jobid, knowledgeid, courseid, clazzid, jtoken) => {
            let url = _self.ServerHost.mooc1Domain + "/ananas/job/document?jobid=" + jobid + "&knowledgeid=" + knowledgeid + "&courseid=" + courseid + "&clazzid=" + clazzid + "&jtoken=" + jtoken + "&_dc=" + new Date().valueOf();
            let result = await api.defaultRequest(url, 'get', {}, navigator.userAgent);
            return JSON.parse(result.responseText);
        },
        videoStudy: async (data, dtoken, taskDefaultConfig) => {
            let url = taskDefaultConfig.reportUrl + "/" + dtoken + "?" + utils.toQueryString(data);
            let result = await api.defaultRequest(url, 'get', {}, navigator.userAgent);
            return JSON.parse(result.responseText);
        },
        getVideoConfig: async (objectId) => {
            let url = _self.ServerHost.mooc1Domain + "/ananas/status/" + objectId + "?k=&flag=normal&_dc=" + new Date().valueOf();
            let result = await api.defaultRequest(url, 'get');
            return JSON.parse(result.responseText);
        },
        unlockChapter: async (courseid, clazzid, knowledgeid, userid, cpi) => {
            let url = `${_self.ServerHost.mooc1Domain}/job/submitstudy?node=${knowledgeid}&userid=${userid}&clazzid=${clazzid}&courseid=${courseid}&personid=${cpi}&view=json`;
            let result = await api.defaultRequest(url, 'get', {}, navigator.userAgent);
            return result.status;
        },
        initdatawithviewer: async (mid, cpi, classid, taskDefaultConfig) => {
            let url = `${taskDefaultConfig.initdataUrl}?mid=${mid}&cpi=${cpi}&classid=${classid}&_dc=${new Date().valueOf()}`;
            let result = await api.defaultRequest(url, 'get');
            return JSON.parse(result.responseText);
        }
        , submitdatawithviewer: async (classid, cpi, objectid, eventid, memberinfo, answer) => {
            let url = `${_self.ServerHost.mooc1Domain}/question/quiz-validation?classid=${classid}&cpi=${cpi}&objectid=${objectid}&_dc=${new Date().valueOf()}&eventid=${eventid}&memberinfo=${memberinfo}&answerContent=${answer}`;
            let result = await api.defaultRequest(url, 'get');
            return JSON.parse(result.responseText);
        }
    };
    var ServerApi = {
        defaultRequest: async function (url, method, data, headers = {}) {
            if(_self.getCookie == undefined){
                _self.getCookie=function(name){
                    return '';
                };
            }
            headers = Object.assign({
                'Content-Type': 'application/json',
                'v': script_info.version,
                'referer': location.href,
                't': utils.getTimestamp(),
                "token": defaultConfig.token || '',
                "u": _self.uid || _self.getCookie('UID') || _self.getCookie("_uid") || '',
            }, headers, reqUrl.headers);
            return new Promise(function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: method,
                    url: url,
                    data: JSON.stringify(data),
                    headers: headers,
                    timeout: 5000,
                    onload: function (response) {
                        resolve(response);
                    },
                    onerror: function (response) {
                        reject(response);
                    },
                    ontimeout: function (response) {
                        reject(response);
                    }
                });
            });
        }, search: async function (data, status = true) {
            data.key = status && defaultConfig.token || '';
            $(".layx_status").html("正在搜索答案");
            let params = {
                "z": data.workType,
                "t": data.type,
                "u": _self.uid || _self.getCookie('UID') || _self.getCookie("_uid") || '',
            }
 
            var url = reqUrl.api + 'search?' + utils.toQueryString(params);
            const res = await ServerApi.defaultRequest(url, 'post', data);
            return res;
        }, configRequest: async function (url) {
            return await ServerApi.defaultRequest(url, 'get');
        }, get_msg: async function () {
            let url = reqUrl.api + 'def/autoMsg';
            let res = await ServerApi.defaultRequest(url, 'get');
            try {
                let reqData = JSON.parse(res.responseText);
                return reqData.data;
            } catch (e) {
                return defaultConfig.notice;
            }
        }, searchOther: (data, item) => {
            return new Promise(async function (resolve, reject) {
                GM_xmlhttpRequest({
                    method: item.method,
                    url: item.url,
                    data: item.getdata(data),
                    headers: item.headers,
                    timeout: 5000,
                    onload: function (response) {
                        resolve(response);
                    },
                    onerror: function (response) {
                        reject(response);
                    },
                    ontimeout: function (response) {
                        reject(response);
                    }
                });
            });
        }, checkKey: async function (key) {
            if (!key) {
                page.layx_log("秘钥为空停止检测", "notice");
            }
            let url = reqUrl.api + 'key';
            let data = {
                "key": key
            }
            let res = await ServerApi.defaultRequest(url, 'post', data);
            try {
                res = JSON.parse(res.responseText);
                if (res.code === 200) {
                    reqUrl.num = res.data.num || null;
                    reqUrl.usenum = res.data.usenum || null;
                }
                page.layx_log(res.msg, "notice");
            } catch (error) {
                page.layx_log("秘钥验证失败", "notice");
            }
        }, getVerifyCode: async function (img) {
            let url = reqUrl.api + 'code';
            let data = {
                "img": img.replace('data:image/png;base64,', '')
            }
            let res = await ServerApi.defaultRequest(url, 'post', data);
            return JSON.parse(res.responseText).data.code;
        }
    }
    var page = {
        threadWatch: async function () {
            if (!defaultConfig.threadWatch) {
                return;
            }
            log('线程守护已开启');
            let thread = setInterval(async function () {
                let layx_status_msg = $("#layx_status_msg");
                if (!layx_status_msg.length) {
                    alert("未检测到悬浮窗，已自动关闭线程守护");
                    clearInterval(thread);
                }
                if (defaultConfig.lastMsg && defaultConfig.lastMsg.indexOf("每60秒更新一次进度") !== -1) {
                    if (defaultConfig.lastMsg === layx_status_msg.html()) {
                        location.reload();
                    }
                } else {
                    log("一切正常");
                }
                defaultConfig.lastMsg = layx_status_msg.html();
                log(layx_status_msg.html());
            }, 320000);
        },
        init: async function () {
            GM_addStyle(GM_getResourceText("layxcss"));
            GM_addStyle(GM_getResourceText("layuicss"));
            defaultConfig.workinx = 0;
            defaultConfig.succ = 0;
            defaultConfig.fail = 0;
            console.log(location.pathname);
            switch (location.pathname) {
                case '/exam-ans/exam/test/reVersionTestStartNew':
                case '/exam/test/reVersionTestStartNew':
                case '/mooc-ans/exam/test/reVersionTestStartNew':
                    if (location.href.includes('newMooc=true')) {
                        await this.layx("ks", {
                            title: "🔥考试界面",
                            // storeStatus:false,
                            width: 300,
                            height: 500
                        });
                        $('#layx_log, h2').hide();
                        $('#layx_content').css('margin', '10px');
                        const createButton = (text, onClick) => {
                            const btn = document.createElement('button');
                            btn.innerHTML = text;
                            btn.classList.add('layui-btn', 'layui-btn-primary', 'layui-border-black');
                            btn.style.margin = '10px 0px 10px 10px';
                            btn.onclick = onClick;
                            return btn;
                        };
                        const btn = createButton(defaultConfig.autoSwitch ? '关闭自动切换' : '开启自动切换', () => {
                            defaultConfig.autoSwitch = !defaultConfig.autoSwitch;
                            btn.innerHTML = defaultConfig.autoSwitch ? '关闭自动切换' : '开启自动切换';
                            defaultConfig.autoSwitch && location.reload();
                            GM_setValue(cache_key, defaultConfig);
                        });
                        const btn1 = createButton('配置', () => {
                            log(defaultConfig);
                            page.layx_config();
                        });
                        $('#layx_content').before($('<div>').attr('id', 'btn_cc').css('margin', '10px').append(btn, btn1));
                        this.layx_status_msg('初始化完成');
                        let reqData = page.getQuestion("3");
                        this.layx_status_msg("自动答题中.....");
                        await page.startAsk(reqData);
                        break;
                    } else {
                        let url = location.href;
                        if (!url.includes('newMooc=false')) {
                            url = url + '&newMooc=true';
                        } else {
                            url = url.replace('newMooc=false', 'newMooc=true');
                        }
                        location.href = url;
                        break;
                    }
                case '/mycourse/stu':
                case '/mooc-ans/mycourse/stu':
                case '/mooc2-ans/mycourse/stu':
                    await this.layx();
                    page.threadWatch();
                    const btn = document.createElement("button");
                    btn.innerHTML = "配置";
                    btn.classList.add("layui-btn", "layui-btn-primary", "layui-border-black");
                    btn.style.margin = "10px 0px 10px 10px";
                    btn.onclick = () => {
                        page.layx_config()
                    };
                    document.getElementById("layx_content").appendChild(btn);
                    this.layx_log("正在检测题库", "notice");
                    ServerApi.checkKey(defaultConfig.token);
                    this.layx_log("正在启动任务,预计耗时" + defaultConfig.interval / 1000 + "秒");
                    await utils.sleep(defaultConfig.interval);
                    this.layx_status_msg("正在等待任务加载");
                    this.mainTask();
                    break;
                case '/workHandle/handle':
                case '/mooc-ans/workHandle/handle':
                case '/mooc2-ans/workHandle/handle':
                    console.log("123");
                    window.parent.postMessage(utils.notify("error", "作业已被删除-跳过"), '*');
                    break;
                case '/work/doHomeWorkNew':
                case '/mooc-ans/work/doHomeWorkNew':
                case '/mooc2-ans/work/doHomeWorkNew':
                    if (document.body.innerHTML.indexOf("此作业已被老师") !== -1) {
                        window.parent.postMessage(utils.notify("error", "作业已被删除-跳过"), '*');
                        break;
                    }
                    if (location.href.includes('reEdit=2')) {
                        this.getScore();
                        window.parent.postMessage(utils.notify("error", "作业待批阅"), '*');
                        break;
                    }
                    if (location.href.includes('mooc2=1')) {
                        // 删除url中的mooc2=1
                        location.href = location.href.replace(/&mooc2=1/g, '');
                    }
                    if (location.href.includes('oldWorkId')) {
                        try {
                            page.decode();
                        } catch (e) {
                            log(e);
                        }
                        await page.layx("zj", {
                            closeMenu: false,
                            maxMenu: true,
                            title: '🔥作业答题(本窗口禁止关闭)',
                            width: 600,
                            height: 300,
                            storeStatus: false,
                            position: 'lt'
                        });
                        const btn1 = $('<button>', {
                            text: '配置',
                            class: 'layui-btn layui-btn-primary layui-border-black',
                            style: 'margin: 10px 0 10px 10px;',
                            click: function () {
                                log(defaultConfig);
                                page.layx_config();
                            }
                        });
                        $('#layx_content').before($('<div>', { id: 'btn_cc', style: 'margin: 10px;' }).append(btn1));
                        $('h2, #layx_log').hide();
                        if (defaultConfig.autoAnswer) {
                            this.layx_status_msg("正在自动答题中");
                            await page.startChapter();
                        }
                    } else {
                        layx.msg('不支持旧版作业', { dialogIcon: 'help' });
                    }
                    break;
                case '/work/selectWorkQuestionYiPiYue':
                case '/mooc-ans/work/selectWorkQuestionYiPiYue':
                case '/mooc2-ans/work/selectWorkQuestionYiPiYue':
                    this.getScore();
                    utils.sleep(1000);
                    window.parent.postMessage(utils.notify("success", "作业已完成"), '*');
                    break;
                case '/mooc2/work/dowork':
                case '/mooc-ans/mooc2/work/dowork':
                case '/mooc2-ans/mooc2/work/dowork':
                    await this.layx('zy', {
                        width: 600,
                        height: 300,
                        storeStatus: false,
                        position: "lt"
                    });
                    this.layx_status_msg("初始化完成");
                    $("#layx_log").hide();
                    const btn1 = $("<button>", {
                        html: "配置",
                        class: "layui-btn layui-btn-primary layui-border-black",
                        style: "margin:10px 0px 10px 10px",
                        click: function () {
                            log(defaultConfig);
                            page.layx_config();
                        }
                    });
                    $("#layx_content").before("<div id='btn_cc' style='margin:10px'></div>");
                    $("h2").hide();
                    $("#btn_cc").append(btn1);
                    if (defaultConfig.autoAnswer) {
                        this.layx_status_msg("正在自动答题中");
                        page.startWork()
                        // defaultConfig.loop = setInterval(() => page.startWork(), defaultConfig.interval);
                    }
                    break;
                case '/visit/courses':
                    break;
                case '/antispiderShowVerify.ac':
                case '/html/processVerify.ac':
                    let src = "/processVerifyPng.ac?t=" + Math.floor(2147483647 * Math.random());
                    let imgData = await api.getVerifyCode(src);
                    let res = await ServerApi.getVerifyCode(imgData);
                    let url = `/html/processVerify.ac?app=0&ucode=${res}`;
                    window.location.href = url;
                    break;
                case '/mycourse/studentstudy':
                case '/mycourse/studentcourse':
                    let div = document.createElement("div");
                    div.onclick = function () {
                        let courseid = $("#curCourseId").val() || utils.getUrlParam("courseId");
                        let clazzid = $("#curClazzId").val() || utils.getUrlParam("clazzid");
                        let cpi = $("#curCpi").val() || utils.getUrlParam("cpi") || /cpi=([^&]*)/.exec(document.documentElement.innerHTML)[1];
                        let url = `${_self.ServerHost.mooc1Domain || _self.ServerHost.moocDomain}/visit/stucoursemiddle?courseid=${courseid}&clazzid=${clazzid}&cpi=${cpi}&ismooc2=1`;
                        window.open(url);
                    };
                    div.id = "notify";
                    div.style = "z-index:1000;position: fixed;right: 300px;bottom:0px;";
                    div.innerHTML = `<a target="_self" href="javascript:;" style="position: absolute; width: 72px; height: 36px; line-height: 36px; font-size: 16px; bottom: 96px; border: 1px solid rgb(123, 158, 49); color: red; background: url(&quot;https://mooc1.chaoxing.com/mooc2/images/chapter_wancheng.png&quot;) 9px center no-repeat rgb(255, 255, 255); padding-left: 42px; border-radius: 3px; right: -83px; display: block;" onclick="$('html,body').animate({scrollTop:0},600);">点我开刷</a>`;
                    defaultConfig.tutorial && document.body.appendChild(div);
                    break;
                case '/ztnodedetailcontroller/visitnodedetail':
                case '/mooc-ans/ztnodedetailcontroller/visitnodedetail':
                case '/mooc2-ans/ztnodedetailcontroller/visitnodedetail':
                    layx.msg('若有时长要求，请在主配置页修改', { dialogIcon: 'help' });
                    $('html, body').animate({
                        scrollTop: $(document).height() - $(window).height()
                    },
                        ($(document).height() - $(window).height()) * (defaultConfig.readSpeed || 10)
                        , function () {
                            $('.nodeItem.r i').click();
                        }).one('click', '#top', function (event) {
                            $(event.delegateTarget).stop();
                        });
                    break;
                case '/mooc2/work/view':
                case '/mooc-ans/mooc2/work/view':
                case '/mooc2-ans/mooc2/work/view':
                    this.getScore3();
                    break
                case '/exam-ans/exam/test/reVersionPaperMarkContentNew':
                case '/mooc-ans/exam-ans/exam/test/reVersionPaperMarkContentNew':
                case '/mooc2-ans/exam-ans/exam/test/reVersionPaperMarkContentNew':
                    this.getScore4();
                    break;
                default:
                    if (/^\/(mooc2-ans\/course|mooc2-ans\/zt|mooc-ans\/course|mooc-ans\/zt|course|zt)\/\d+\.html$/.test(location.pathname)) {
                        setTimeout(function () {
                            _self.sendLogs && $('.course_section:eq(0) .chapterText').click();
                        }, defaultConfig.interval);
                    }
                    
            }
        },
        layx: async (id = "abcde", option = {}) => {
            const configs = Object.assign({
                icon: icon,
                position: "lb",
                width: 300,
                height: 500,
                borderRadius: "5px",
                skin: "asphalt",
                opacity: 1,
                maxMenu: false,
                statusBar: "<div id='layx_status_msg'>正在初始化</div>",
                style: "#layx_div{background-color:#F5F7FA;color:#000;height:100%;width:100%;overflow:auto;}#layx_msg{background-color:#fff;padding:10px;border-bottom:1px solid #ccc;border-radius:5px;margin:10px;}#layx_log{height:60%;padding:10px;color:#A8A8B3;}#layx_content{height:10%;}.layx_success{color:green;font-weight:bold;}.layx_error{color:#F56C6C;font-weight:bold;}.layx_info{color:#909399;font-weight:bold;}.layx_notice{color:#E6A23C;font-weight:bold;}.layx_status_msg{color:green;font-weight:bold;}h2{text-align:center;}"
            }, option);
            const notice = utils.cacheExpired("noticetemp", 600000) || await ServerApi.get_msg();
            const htmlStr = `<div id="layx_div"><div id="layx_msg">${notice}</div><h2>保持此页面开启将自动刷课</h2><div id="layx_content"></div><div id="layx_log">运行日志:</div></div>`;
            layx.html(id, `🔥超星小助手 v${script_info.version}`, htmlStr, configs)
        },
        layx_config: function () {
            let configForm = [
                {
                    group: "基本设置",
                    groupId: "base",
                    items: {
                        tutorial: {
                            type: 'checkbox',
                            label: '是否开启引导',
                            value: defaultConfig.tutorial,
                            desc: '关闭章节页的刷课引导'
                        },
                        interval: {
                            type: 'number',
                            label: '运行间隔',
                            value: defaultConfig.interval,
                            desc: '用于控制脚本运行速度，单位毫秒'
                        },
                        autoSubmitRate: {
                            type: 'number',
                            label: '答案正确率',
                            value: defaultConfig.autoSubmitRate,
                            desc: '满足此正确率则提交，否则保存不提交'
                        },
                        randomAnswer: {
                            type: 'checkbox',
                            label: '无答案是否随机选择',
                            value: defaultConfig.randomAnswer,
                            desc: '关闭后将不会随机选择，需要手动选择，建议关闭'
                        },
                        matchRate: {
                            type: 'number',
                            label: '答案模糊匹配率',
                            value: defaultConfig.matchRate,
                            desc: '0-1之间，越大越严格'
                        },
                    }
                },
                {
                    group: "章节配置",
                    groupId: "chapter",
                    items: {
                        autoVideo: {
                            type: 'checkbox',
                            label: '是否开启自动视频',
                            value: defaultConfig.autoVideo,
                            desc: '关闭后章节将自动跳过视频'
                        },
                        videoSpeed: {
                            type: 'number',
                            label: '视频倍速',
                            value: defaultConfig.videoSpeed,
                            desc: '视频倍速[1-16]，不推荐修改！！超星目前倍速会被清理进度！！'
                        },
                        readSpeed: {
                            type: 'number',
                            label: '阅读速度',
                            value: defaultConfig.readSpeed || 10,
                            desc: '若有时长要求，按照时长多少设置速度，默认为10'
                        },
                        autoRead: {
                            type: 'checkbox',
                            label: '是否开启自动阅读',
                            value: defaultConfig.autoRead,
                            desc: '关闭后章节将自动跳过文档以及ppt等'
                        },
                        autoAnswer: {
                            type: 'checkbox',
                            label: '是否开启自动答题',
                            value: defaultConfig.autoAnswer,
                            desc: '关闭后章节将自动跳过章节作业'
                        },
                        autoSubmit: {
                            type: 'checkbox',
                            label: '是否开启自动提交',
                            value: defaultConfig.autoSubmit,
                            desc: '关闭后将不会自动提交，需要手动提交'
                        },
                    }
                },
                {
                    group: "其他配置",
                    groupId: "other",
                    items: {
                        reviewMode: {
                            type: 'checkbox',
                            label: '是否开启复习模式',
                            value: defaultConfig.reviewMode,
                            desc: '开启后将从开头补时长补次数'
                        },
                        threadWatch: {
                            type: 'checkbox',
                            label: '是否开启进程守护',
                            value: defaultConfig.threadWatch,
                            desc: '开启后遇到卡壳将自动刷新网页'
                        },
                        freeFirst: {
                            type: 'checkbox',
                            label: '是否开启免费题库优先',
                            value: defaultConfig.freeFirst,
                            desc: '开启后免费题库无答案后才会搜索付费题库'
                        },
                        token: {
                            type: 'textarea',
                            label: '付费题库token',
                            value: defaultConfig.token,
                            desc: '赞助题库Token,非必填'
                        },
                    }
                }
            ];
            let html = '';
            for (const item of configForm) {
                let tab = `<input type="radio" name="tab" id="${item.groupId}" class="tab-button" checked>
                <label class="tab_lable" id="tab-${item.groupId}" for="${item.groupId}">${item.group}</label>`;
                html += tab;
            }
            for (const item of configForm) {
                let itemHtml = "";
                for (const [key, { type, label, value, desc }] of Object.entries(item.items)) {
                    const inputHTML = (() => {
                        switch (type) {
                            case 'textarea':
                                return `<textarea name="${key}" class="layui-textarea">${value}</textarea>`;
                            case 'number':
                                return `<input type="number" name="${key}" value="${value}" class="layui-input">`;
                            case 'checkbox':
                                return `<input type="checkbox" name="${key}" lay-skin="primary" lay-text="开启|关闭"  ${value ? 'checked' : ''}>`;
                            default:
                                return '';
                        }
                    })();
                    itemHtml += `
                    <div class="layui-form-item">
                        <label class="layui-form-label">${label}</label>
                        ${type == "checkbox" ? inputHTML : ''}
                        <div class="layui-input-block">
                            ${['textarea', 'number'].includes(type) ? inputHTML : ''}
                            <div class="layui-form-mid layui-word-aux">${desc}</div>
                        </div>
                    </div>`;
                }
                html += `
                    <div class="tab-content" id="${item.groupId}-content">
                    ${itemHtml}
                    </div>
                `;
            }
            layx.html(utils.randomStr(10), '🔥超星小助手配置', html, {
                statusBar: true,
                buttons: [
                    {
                        label: '保存',
                        callback: function (id, button, event) {
                            for (let item of configForm) {
                                for (let key in item.items) {
                                    let value = null;
                                    if ($(`input[name=${key}]`).attr('type') == 'checkbox') {
                                        value = $(`input[name=${key}]`).is(':checked');
                                    }
                                    if ($(`textarea[name=${key}]`).length > 0) {
                                        value = $(`textarea[name=${key}]`).val();
                                    }
                                    if ($(`input[name=${key}]`).attr('type') == 'number') {
                                        value = $(`input[name=${key}]`).val();
                                    }
                                    if (value != null) {
                                        log(`保存配置项${key}=${value}`);
                                        defaultConfig[key] = value;
                                    }
                                }
                            }
                            if (defaultConfig.interval < 1000) {
                                page.layx_log('公共间隔不合法，已默认3000', "error");
                                defaultConfig.interval = 3000;
                            }
                            if (defaultConfig.videoSpeed > 16) {
                                page.layx_log('视频倍速不推荐修改！！你咋不上天，已默认1倍速', "error");
                                defaultConfig.videoSpeed = 1;
                            } else if (defaultConfig.videoSpeed > 1) {
                                page.layx_log(`视频倍速不推荐修改！！当前倍速【${defaultConfig.videoSpeed}】,超星目前倍速会被清理进度！！`, "error");
                            } else if (defaultConfig.videoSpeed < 1) {
                                defaultConfig.videoSpeed = 1;
                                page.layx_log('你觉得你的倍速合理吗?', "error");
                            }
                            if (defaultConfig.matchRate > 1 || defaultConfig.matchRate < 0) {
                                page.layx_log('答案模糊匹配率不合法，已默认0.8', "error");
                                defaultConfig.matchRate = 0.8;
                            }
                            if (defaultConfig.autoSubmitRate > 1 || defaultConfig.autoSubmitRate < 0) {
                                page.layx_log('答案正确率不合法，已默认0.8', "error");
                                defaultConfig.autoSubmitRate = 0.8;
                            }
                            log(defaultConfig);
                            GM_setValue(cache_key, defaultConfig);
                            layx.destroy(id);
                        }
                    },
                    {
                        label: '取消',
                        callback: function (id, button, event) {
                            layx.destroy(id);
                        }
                    }
                ],
                position: 'lt',
                width: 300,
                height: 500,
                borderRadius: "5px",
                skin: 'asphalt',
                opacity: 1,
                maxMenu: false,
                style: "input{-webkit-appearance:auto;line-height:normal;}.tab-button{display:none;}.tab-button:hover{background-color:gray;color:#000;}.tab-content{display:none;}.tab_lable{color:#c3c3c3;display:inline-block;*display:inline;*zoom:1;vertical-align:middle;font-size:14px;transition:all .2s;-webkit-transition:all .2s;position:relative;line-height:40px;min-width:65px;padding:0 15px;text-align:center;cursor:pointer;margin-bottom:15px;}#base:checked~#base-content,#chapter:checked~#chapter-content,#other:checked~#other-content{display:block;}#base:checked~#tab-base,#chapter:checked~#tab-chapter,#other:checked~#tab-other{font-weight:bold;color:#000;}"
            });
        },
        layx_log: function (msg, level = "info") {
            const log = document.querySelector("#layx_log");
            const maxLine = Math.floor(log.offsetHeight / 20);
            if (log.children.length > maxLine) {
                log.removeChild(log.children[0]);
            }
            const time = new Date().toLocaleTimeString();
            const str = `<p>${time}  <span class="layx_${level}">${msg}</span></p>`;
            log.innerHTML += str;
        },
        layx_status_msg: function (msg) {
            let log = document.getElementById("layx_status_msg").innerHTML = msg;
        },
        mainTask: async function () {
            const pz = {
                courseid: utils.getUrlParam("courseid") || utils.getUrlParam("courseId"),
                clazzid: utils.getUrlParam("clazzid"),
                cpi: utils.getUrlParam("cpi"),
                userid: utils.getInputParam("userId") || _self.uid
            };
            const data = await api.getCourseChapter(pz.courseid, pz.clazzid);
            const courseData = data.data[0].course.data[0];
            const chapterData = utils.toOneArray(utils.sortData(courseData.knowledge.data));
            const statusTask = chapterData.some(item => item.status === "task");
            defaultConfig.reviewMode && this.layx_log("检测到为复习模式，将以复习形式完成任务", "info");
            statusTask && this.layx_log("检测到为闯关模式，将以闯关形式完成任务", "info");
            const chapterIds = chapterData.map(item => item.id).join(",");
            const chapterInfo = await api.getChapterList(pz.courseid, pz.clazzid, chapterIds, pz.userid, pz.cpi);
            const unfinishcount = Object.values(chapterInfo).reduce((total, current) => total + current.unfinishcount, 0);
            this.layx_log(`[${courseData['name']}-${courseData['teacherfactor']}]获取到${chapterData.length}个章节，共计${courseData.jobcount}个任务,待完成${unfinishcount}个任务`, "info");
 
            async function doTask(item) {
                statusTask && item.jobcount == 0 && await api.unlockChapter(pz.courseid, pz.clazzid, item.id, pz.userid, pz.cpi) && await utils.sleep(1000);
                if (unfinishcount === 0 && !defaultConfig.reviewMode) {
                    return false;
                }
                page.layx_log(`开始完成章节[${item.label}${item.name}]`, "info");
                if (chapterInfo[item.id].unfinishcount === 0 && !defaultConfig.reviewMode) {
                    page.layx_log("已完成的章节,跳过", "success");
                    return null;
                }
                let res = await api.uploadStudyLog(pz.courseid, pz.clazzid, item.id, pz.cpi);
                res && page.layx_log(`上传学习记录成功`, "success");
                const chapterOne = await api.getChapterInfo(item.id, pz.courseid);
                for (const item3 of chapterOne.data[0].card.data) {
                    log(item3.title);
                    const chapterDetail = await api.getChapterDetail(pz.courseid, pz.clazzid, item3.knowledgeid, item3.cardorder, pz.cpi);
                    if (chapterDetail.indexOf("章节未开放") !== -1) {
                        return "unlock";
                    }
                    const regex = /mArg\s*=\s*({.*?});/;
                    const match = regex.exec(chapterDetail);
                    if (match) {
                        const jsonStr = match[1];
                        const mArg = JSON.parse(jsonStr);
                        const taskDefaultConfig = mArg.defaults;
                        for (const task of mArg.attachments) {
                            if (!task.type) {
                                continue;
                            }
                            await page.finishTask(task, item3, pz, taskDefaultConfig);
                            await utils.sleep(defaultConfig.interval);
                        }
                    }
                    await utils.sleep(defaultConfig.interval);
                }
                await utils.sleep(defaultConfig.interval);
            }
 
            let lastItem = null, unlockChapterNum = 0;
            for (const item of chapterData) {
                let back = await doTask(item);
                if (unlockChapterNum > 0) {
                    page.layx_log("章节未开放异常(一般都是章节作业正确率不够，自行完成作业后继续)", "error");
                    if (statusTask) {
                        page.layx_log("已暂停刷课，请自行完成作业", "error");
                        return;
                    }
 
                }
                back == "unlock" && lastItem != null && await api.unlockChapter(pz.courseid, pz.clazzid, lastItem.id, pz.userid, pz.cpi) && unlockChapterNum++;
                if (back == false) {
                    break;
                }
                lastItem = item;
            }
            this.layx_status_msg("任务已全部完成");
            this.layx_log("章节全部完成(若仍有知识点未完成请刷新页面)", "success")
        },
        finishTask: async function (task, item3, pz, taskDefaultConfig) {
            return new Promise(async (resolve, reject) => {
                this.layx_status_msg(`正在完成[${task.property.name || task.property.title}]`);
                this.layx_log(`[${(task.property.name || task.property.title)}-${task.type}]开始完成任务`, "info");
                log(task);
                log(item3);
                log(taskDefaultConfig);
                switch (task.type) {
                    case "video":
                        if (!defaultConfig.autoVideo) {
                            this.layx_log("[" + task.property.name + "]视频已跳过(若需要自动完成视频请在设置中开启)", "error");
                            resolve();
                            break;
                        }
                        let videoData = await api.getVideoConfig(task.objectId);
                        await this.finishVideoAnswer(task, pz, videoData, taskDefaultConfig);
                        this.layx_log("[" + task.property.name + "]视频开始任务，具体进度查看下方进度条", "info");
                        let videoStatus = await this.finishVideo(task, videoData, pz, taskDefaultConfig);
                        if (videoStatus == true) {
                            this.layx_log("[" + task.property.name + "]视频已完成", "success");
                        } else {
                            this.layx_log("[" + task.property.name + "]视频异常跳过,正常情况无视即可", "error");
                        }
                        resolve();
                        break;
                    case "document":
                        if (!defaultConfig.autoRead) {
                            this.layx_log("[" + task.property.name + "]文档已跳过(若需要自动完成文档请在设置中开启)", "error");
                            resolve();
                            break;
                        }
                        let result = await api.docStudy(task.property.jobid, item3.knowledgeid, pz.courseid, pz.clazzid, task.jtoken);
                        result.status ? this.layx_log("[" + task.property.name + "]文档已完成", "success") : this.layx_log("[" + task.property.name + "]文档异常(正常不用理会)", "error");
                        resolve();
                        break;
                    case "workid":
                        if (!defaultConfig.autoAnswer) {
                            this.layx_log("[" + task.property.title + "]作业已跳过(若需要自动完成作业请在设置中开启)", "error");
                            resolve();
                            break;
                        }
                        reqUrl.num && this.layx_log(`付费题库剩余次数:${reqUrl.num}}`, 'notice')
                        let url = `${_self.ServerHost.mooc1Domain}/api/work?api=1&workId=${(task.jobid || task.property.workid).replace('work-', '')}&jobid=${task.property.jobid || ""}&needRedirect=true&knowledgeid=${item3.knowledgeid}&ktoken=${taskDefaultConfig.ktoken}&cpi=${taskDefaultConfig.cpi}&ut=s&clazzId=${taskDefaultConfig.clazzId}&type=&enc=${task.enc}&utenc=undefined&courseid=${taskDefaultConfig.courseid}`;
                        log(url);
                        layx.iframe('workiframe', '作业', url)
                        await this.finishWork();
                        layx.destroy('workiframe');
                        resolve();
                        break;
                    default:
                        this.layx_log("暂不支持该任务类型" + task.type, "error");
                        resolve();
                        break;
                }
            });
        },
        finishVideoAnswer: async function (task, pz, videoData, taskDefaultConfig) {
            let res = await api.initdatawithviewer(task.property.mid, pz.cpi, pz.clazzid, taskDefaultConfig);
            this.layx_log("[" + task.property.name + "]获取视频中的题目", "info");
            for (const item of res) {
                try {
                    const item1 = item.datas[0];
                    const options = item1.options;
                    let answer = options.filter(item => item.isRight == true).map(item => item.name).join();
                    let res1 = await api.submitdatawithviewer(pz.clazzid, pz.cpi, videoData.objectid, item1.resourceId, item1.memberinfo, answer);
                    if (res1.status) {
                        this.layx_log(`[正在完成视频中的题目]:${item1.description}<br>答案:${answer}<br>${res1.isRight ? "答案正确" : "答案错误"}`, "success");
                    } else {
                        this.layx_log(`[正在完成视频中的题目]:${item1.description}<br>答案:${answer}<br>${res1.msg}`, "error");
                    }
                    await utils.sleep(defaultConfig.interval);
                } catch (e) {
                    this.layx_log("有个垃圾题跳过", "error");
                }
            }
            this.layx_log("[" + task.property.name + "]视频题目已完毕", "info");
        },
        finishVideo: async function (task, videoData, pz, taskDefaultConfig) {
            return new Promise(async (resolve, reject) => {
                let data = {
                    "clazzId": pz.clazzid,
                    "playingTime": "0",
                    "duration": videoData.duration,
                    "clipTime": "0_" + videoData.duration,
                    "objectId": videoData.objectid,
                    "otherInfo": task.otherInfo.replace(/&cour.*$/, ""),
                    "courseId": pz.courseid,
                    "jobid": task.property.jobid || task.property._jobid,
                    "userid": pz.userid,
                    "isdrag": "3",
                    "view": "pc",//json
                    "enc": "",
                    "rt": task.property.rt || "0.9",
                    "dtype": task.property.module.includes('audio') ? 'Audio' : 'Video',
                    "_t": new Date().getTime()
                }
                if (data.duration == undefined) {
                    resolve(false);
                }
                let time = 0, result;
                const intervalTime = 60000;
                while (true) {
                    data.isdrag = time < data.duration ? 3 : 4;
                    data.playingTime = time >= data.duration ? data.duration : time;
                    log("当前进度:" + data.playingTime + "/" + data.duration + "s  " + "每60秒更新一次进度");
                    this.layx_status_msg("当前进度:" + data.playingTime + "/" + data.duration + "s  " + "每60秒更新一次进度");
                    data.enc = utils.getVideoEnc(data.clazzId, data.userid, data.jobid, data.objectId, data.playingTime, data.duration);
                    result = await api.videoStudy(data, videoData.dtoken, taskDefaultConfig);
                    if (time >= data.duration || (result.isPassed == true && !defaultConfig.reviewMode)) {
                        break;
                    }
                    time += 60 * defaultConfig.videoSpeed;
                    if (time > data.duration) {
                        let waitTime = (60 * defaultConfig.videoSpeed - (time - data.duration)) / defaultConfig.videoSpeed;
                        this.layx_log("等待" + waitTime + "秒后完成任务");
                        await utils.sleep(waitTime * 1000);
                    } else {
                        await utils.sleep(intervalTime);
                    }
                }
                resolve(result.isPassed);
            });
        },
        finishWork: async function () {
            return new Promise(async (resolve, reject) => {
                const handler = function (event) {
                    let res = JSON.parse(event.data);
                    if (res.level == "success") {
                        page.layx_log("作业已完成", "success");
                        _self.removeEventListener("message", handler);
                        resolve();
                    } else {
                        page.layx_log(res.msg, "error");
                        _self.removeEventListener("message", handler);
                        resolve();
                    }
                }
                _self.addEventListener('message', handler);
            });
        },
        /**
         * 获取题目
         * @param data
         * @param num
         * @returns {Promise<Awaited<unknown>[]>}
         */
        requestMerge: async function (data, num = 0) {
 
            try {
                data.id = _self["uid"] || _self.getCookie('UID') || _self.getCookie("_uid") || 0;
            } catch (e) {
                data.id = 0;
            }
            let promiseArr = [];
            if (defaultConfig.freeFirst && num === 0) {
                // return [];
                otherApi.forEach((item) => {
                    promiseArr.push(
                        ServerApi.searchOther(data, item)
                            .then((response) => {
                                let res = item.getanswer(response);
                                return res === false ? [] : res;
                            })
                            .catch(() => [])
                    );
                });
                page.layx_status_msg("免费题库检索中（无答案将使用收费题库）");
                try {
                    ServerApi.search(data, false).then((response) => {
                        return [];
                    }).catch((error) => {
                        return [];
                    })
                } catch (e) {
                    console.log(e);
                }
                // 清除定时器
                return await Promise.all(promiseArr);
            }
            else {
                page.layx_status_msg("收费题库检索中");
                const res = await ServerApi.search(data).then((response) => {
                    const result = JSON.parse(response.responseText);
                    switch (result.code) {
                        case 200:
                            reqUrl.num = result.data.num || null;
                            reqUrl.usenum = result.data.usenum || null;
                            return result.data.answer;
                        case 401:
                            return result.msg;
                        case 403:
                            page.layx_status_msg("请求频率过高");
                            return "error-_-";
                        case 404:
                            page.layx_status_msg("页面不存在");
                            return "error-_-";
                        case 500:
                            page.layx_status_msg("服务器错误");
                            return "error-_-";
                        default:
                            page.getScore2(result.data);
                            return result.msg;
                    }
                }).catch((error) => {
                    switch (error.status) {
                        case 403:
                            page.layx_status_msg("请求被拒绝,等待重试");
                            let msg;
                            try {
                                msg = JSON.parse(error.responseText).msg;
                            } catch (e) {
                                msg = "请求频率过快,请稍后重试";
                            }
                            page.layx_status_msg(msg);
                            break;
                        case 404:
                            page.layx_status_msg("请求地址错误,任务结束");
                            break;
                        default:
                            page.layx_status_msg("请求错误,等待重试");
                            break;
                    }
                    return "error-_-";
                });
                if (res === "error-_-" && num < 3) {
                    return await page.requestMerge(data, num + 1);
                } else if (res === "error-_-" && num >= 3) {
                    return [];
                } else {
                    return [res];
                }
 
 
            }
            return [];
 
        },
        clear: function () {
            $(".answerBg, .textDIV, .eidtDiv").each(function () {
                ($(this).find(".check_answer").length || $(this).find(".check_answer_dx").length) && $(this).click();
            });
            $(".answerBg, .textDIV, .eidtDiv").find('textarea').each(function () {
                _self.UE.getEditor($(this).attr('name')).ready(function () {
                    this.setContent("");
                });
            });
        },
        clearCurrent: function (item) {
            $(item).find(".answerBg, .textDIV, .eidtDiv").each(function () {
                ($(this).find(".check_answer").length || $(this).find(".check_answer_dx").length) && $(this).click();
            });
            $(item).find(".answerBg, .textDIV, .eidtDiv").find('textarea').each(function () {
                _self.UE.getEditor($(this).attr('name')).ready(function () {
                    this.setContent("");
                });
            });
            $(item).find(':radio, :checkbox').prop('checked', false);
            $(item).find('textarea').each(function () {
                _self.UE.getEditor($(this).attr('name')).ready(function () {
                    this.setContent("");
                });
            });
        },
        /**
         * 解密字体
         * 作者wyn
         * 原地址:https://bbs.tampermonkey.net.cn/forum.php?mod=viewthread&tid=2303&highlight=%E5%AD%97%E4%BD%93%E8%A7%A3%E5%AF%86
         */
        decode: function () {
            var Typr = {
                parse: function (r) {
                    var e = function (r, e, a, t) {
                        Typr.B;
                        var n = Typr.T, o = {
                            cmap: n.cmap,
                            head: n.head,
                            hhea: n.hhea,
                            maxp: n.maxp,
                            hmtx: n.hmtx,
                            name: n.name,
                            "OS/2": n.OS2,
                            post: n.post,
                            loca: n.loca,
                            kern: n.kern,
                            glyf: n.glyf,
                            "CFF ": n.CFF,
                            "SVG ": n.SVG
                        }, i = { _data: r, _index: e, _offset: a };
                        for (var s in o) {
                            var d = Typr.findTable(r, s, a);
                            if (d) {
                                var u = d[0], h = t[u];
                                null == h && (h = o[s].parseTab(r, u, d[1], i)), i[s] = t[u] = h
                            }
                        }
                        return i
                    }, a = Typr.B, t = new Uint8Array(r), n = {};
                    if ("ttcf" == a.readASCII(t, 0, 4)) {
                        var o = 4;
                        a.readUshort(t, o);
                        o += 2;
                        a.readUshort(t, o);
                        o += 2;
                        var i = a.readUint(t, o);
                        o += 4;
                        for (var s = [], d = 0; d < i; d++) {
                            var u = a.readUint(t, o);
                            o += 4, s.push(e(t, d, u, n))
                        }
                        return s
                    }
                    return [e(t, 0, 0, n)]
                }, findTable: function (r, e, a) {
                    for (var t = Typr.B, n = t.readUshort(r, a + 4), o = a + 12, i = 0; i < n; i++) {
                        var s = t.readASCII(r, o, 4), d = (t.readUint(r, o + 4), t.readUint(r, o + 8)),
                            u = t.readUint(r, o + 12);
                        if (s == e) return [d, u];
                        o += 16
                    }
                    return null
                }, T: {}
            };
            Typr.B = {
                readFixed: function (r, e) {
                    return (r[e] << 8 | r[e + 1]) + (r[e + 2] << 8 | r[e + 3]) / 65540
                }, readF2dot14: function (r, e) {
                    return Typr.B.readShort(r, e) / 16384
                }, readInt: function (r, e) {
                    var a = Typr.B.t.uint8;
                    return a[0] = r[e + 3], a[1] = r[e + 2], a[2] = r[e + 1], a[3] = r[e], Typr.B.t.int32[0]
                }, readInt8: function (r, e) {
                    return Typr.B.t.uint8[0] = r[e], Typr.B.t.int8[0]
                }, readShort: function (r, e) {
                    var a = Typr.B.t.uint8;
                    return a[1] = r[e], a[0] = r[e + 1], Typr.B.t.int16[0]
                }, readUshort: function (r, e) {
                    return r[e] << 8 | r[e + 1]
                }, writeUshort: function (r, e, a) {
                    r[e] = a >> 8 & 255, r[e + 1] = 255 & a
                }, readUshorts: function (r, e, a) {
                    for (var t = [], n = 0; n < a; n++) {
                        var o = Typr.B.readUshort(r, e + 2 * n);
                        t.push(o)
                    }
                    return t
                }, readUint: function (r, e) {
                    var a = Typr.B.t.uint8;
                    return a[3] = r[e], a[2] = r[e + 1], a[1] = r[e + 2], a[0] = r[e + 3], Typr.B.t.uint32[0]
                }, writeUint: function (r, e, a) {
                    r[e] = a >> 24 & 255, r[e + 1] = a >> 16 & 255, r[e + 2] = a >> 8 & 255, r[e + 3] = a >> 0 & 255
                }, readUint64: function (r, e) {
                    return 4294967296 * Typr.B.readUint(r, e) + Typr.B.readUint(r, e + 4)
                }, readASCII: function (r, e, a) {
                    for (var t = "", n = 0; n < a; n++) t += String.fromCharCode(r[e + n]);
                    return t
                }, writeASCII: function (r, e, a) {
                    for (var t = 0; t < a.length; t++) r[e + t] = a.charCodeAt(t)
                }, readUnicode: function (r, e, a) {
                    for (var t = "", n = 0; n < a; n++) {
                        var o = r[e++] << 8 | r[e++];
                        t += String.fromCharCode(o)
                    }
                    return t
                }, _tdec: window.TextDecoder ? new window.TextDecoder : null, readUTF8: function (r, e, a) {
                    var t = Typr.B._tdec;
                    return t && 0 == e && a == r.length ? t.decode(r) : Typr.B.readASCII(r, e, a)
                }, readBytes: function (r, e, a) {
                    for (var t = [], n = 0; n < a; n++) t.push(r[e + n]);
                    return t
                }, readASCIIArray: function (r, e, a) {
                    for (var t = [], n = 0; n < a; n++) t.push(String.fromCharCode(r[e + n]));
                    return t
                }, t: function () {
                    var r = new ArrayBuffer(8);
                    return {
                        buff: r,
                        int8: new Int8Array(r),
                        uint8: new Uint8Array(r),
                        int16: new Int16Array(r),
                        uint16: new Uint16Array(r),
                        int32: new Int32Array(r),
                        uint32: new Uint32Array(r)
                    }
                }()
            }, Typr.T.CFF = {
                parseTab: function (r, e, a) {
                    var t = Typr.B, n = Typr.T.CFF;
                    (r = new Uint8Array(r.buffer, e, a))[e = 0], r[++e], r[++e], r[++e];
                    e++;
                    var o = [];
                    e = n.readIndex(r, e, o);
                    for (var i = [], s = 0; s < o.length - 1; s++) i.push(t.readASCII(r, e + o[s], o[s + 1] - o[s]));
                    e += o[o.length - 1];
                    var d = [];
                    e = n.readIndex(r, e, d);
                    var u = [];
                    for (s = 0; s < d.length - 1; s++) u.push(n.readDict(r, e + d[s], e + d[s + 1]));
                    e += d[d.length - 1];
                    var h = u[0], p = [];
                    e = n.readIndex(r, e, p);
                    var f = [];
                    for (s = 0; s < p.length - 1; s++) f.push(t.readASCII(r, e + p[s], p[s + 1] - p[s]));
                    if (e += p[p.length - 1], n.readSubrs(r, e, h), h.CharStrings && (h.CharStrings = n.readBytes(r, h.CharStrings)), h.ROS) {
                        e = h.FDArray;
                        var l = [];
                        e = n.readIndex(r, e, l), h.FDArray = [];
                        for (s = 0; s < l.length - 1; s++) {
                            var v = n.readDict(r, e + l[s], e + l[s + 1]);
                            n._readFDict(r, v, f), h.FDArray.push(v)
                        }
                        e += l[l.length - 1], e = h.FDSelect, h.FDSelect = [];
                        var y = r[e];
                        if (e++, 3 != y) throw y;
                        var c = t.readUshort(r, e);
                        e += 2;
                        for (s = 0; s < c + 1; s++) h.FDSelect.push(t.readUshort(r, e), r[e + 2]), e += 3
                    }
                    return h.charset && (h.charset = n.readCharset(r, h.charset, h.CharStrings.length)), n._readFDict(r, h, f), h
                },
                _readFDict: function (r, e, a) {
                    var t, n = Typr.T.CFF;
                    for (var o in e.Private && (t = e.Private[1], e.Private = n.readDict(r, t, t + e.Private[0]), e.Private.Subrs && n.readSubrs(r, t + e.Private.Subrs, e.Private)), e) -1 != ["FamilyName", "FontName", "FullName", "Notice", "version", "Copyright"].indexOf(o) && (e[o] = a[e[o] - 426 + 35])
                },
                readSubrs: function (r, e, a) {
                    a.Subrs = Typr.T.CFF.readBytes(r, e);
                    var t, n = a.Subrs.length + 1;
                    t = n < 1240 ? 107 : n < 33900 ? 1131 : 32768, a.Bias = t
                },
                readBytes: function (r, e) {
                    Typr.B;
                    var a = [];
                    e = Typr.T.CFF.readIndex(r, e, a);
                    for (var t = [], n = a.length - 1, o = r.byteOffset + e, i = 0; i < n; i++) {
                        var s = a[i];
                        t.push(new Uint8Array(r.buffer, o + s, a[i + 1] - s))
                    }
                    return t
                },
                tableSE: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 0, 111, 112, 113, 114, 0, 115, 116, 117, 118, 119, 120, 121, 122, 0, 123, 0, 124, 125, 126, 127, 128, 129, 130, 131, 0, 132, 133, 0, 134, 135, 136, 137, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 138, 0, 139, 0, 0, 0, 0, 140, 141, 142, 143, 0, 0, 0, 0, 0, 144, 0, 0, 0, 145, 0, 0, 146, 147, 148, 149, 0, 0, 0, 0],
                glyphByUnicode: function (r, e) {
                    for (var a = 0; a < r.charset.length; a++) if (r.charset[a] == e) return a;
                    return -1
                },
                glyphBySE: function (r, e) {
                    return e < 0 || e > 255 ? -1 : Typr.T.CFF.glyphByUnicode(r, Typr.T.CFF.tableSE[e])
                },
                readCharset: function (r, e, a) {
                    var t = Typr.B, n = [".notdef"], o = r[e];
                    if (e++, 0 == o) for (var i = 0; i < a; i++) {
                        var s = t.readUshort(r, e);
                        e += 2, n.push(s)
                    } else {
                        if (1 != o && 2 != o) throw "error: format: " + o;
                        for (; n.length < a;) {
                            s = t.readUshort(r, e);
                            e += 2;
                            var d = 0;
                            1 == o ? (d = r[e], e++) : (d = t.readUshort(r, e), e += 2);
                            for (i = 0; i <= d; i++) n.push(s), s++
                        }
                    }
                    return n
                },
                readIndex: function (r, e, a) {
                    var t = Typr.B, n = t.readUshort(r, e) + 1, o = r[e += 2];
                    if (e++, 1 == o) for (var i = 0; i < n; i++) a.push(r[e + i]); else if (2 == o) for (i = 0; i < n; i++) a.push(t.readUshort(r, e + 2 * i)); else if (3 == o) for (i = 0; i < n; i++) a.push(16777215 & t.readUint(r, e + 3 * i - 1)); else if (4 == o) for (i = 0; i < n; i++) a.push(t.readUint(r, e + 4 * i)); else if (1 != n) throw "unsupported offset size: " + o + ", count: " + n;
                    return (e += n * o) - 1
                },
                getCharString: function (r, e, a) {
                    var t = Typr.B, n = r[e], o = r[e + 1], i = (r[e + 2], r[e + 3], r[e + 4], 1), s = null,
                        d = null;
                    n <= 20 && (s = n, i = 1), 12 == n && (s = 100 * n + o, i = 2), 21 <= n && n <= 27 && (s = n, i = 1), 28 == n && (d = t.readShort(r, e + 1), i = 3), 29 <= n && n <= 31 && (s = n, i = 1), 32 <= n && n <= 246 && (d = n - 139, i = 1), 247 <= n && n <= 250 && (d = 256 * (n - 247) + o + 108, i = 2), 251 <= n && n <= 254 && (d = 256 * -(n - 251) - o - 108, i = 2), 255 == n && (d = t.readInt(r, e + 1) / 65535, i = 5), a.val = null != d ? d : "o" + s, a.size = i
                },
                readCharString: function (r, e, a) {
                    for (var t = e + a, n = Typr.B, o = []; e < t;) {
                        var i = r[e], s = r[e + 1], d = (r[e + 2], r[e + 3], r[e + 4], 1), u = null, h = null;
                        i <= 20 && (u = i, d = 1), 12 == i && (u = 100 * i + s, d = 2), 19 != i && 20 != i || (u = i, d = 2), 21 <= i && i <= 27 && (u = i, d = 1), 28 == i && (h = n.readShort(r, e + 1), d = 3), 29 <= i && i <= 31 && (u = i, d = 1), 32 <= i && i <= 246 && (h = i - 139, d = 1), 247 <= i && i <= 250 && (h = 256 * (i - 247) + s + 108, d = 2), 251 <= i && i <= 254 && (h = 256 * -(i - 251) - s - 108, d = 2), 255 == i && (h = n.readInt(r, e + 1) / 65535, d = 5), o.push(null != h ? h : "o" + u), e += d
                    }
                    return o
                },
                readDict: function (r, e, a) {
                    for (var t = Typr.B, n = {}, o = []; e < a;) {
                        var i = r[e], s = r[e + 1], d = (r[e + 2], r[e + 3], r[e + 4], 1), u = null, h = null;
                        if (28 == i && (h = t.readShort(r, e + 1), d = 3), 29 == i && (h = t.readInt(r, e + 1), d = 5), 32 <= i && i <= 246 && (h = i - 139, d = 1), 247 <= i && i <= 250 && (h = 256 * (i - 247) + s + 108, d = 2), 251 <= i && i <= 254 && (h = 256 * -(i - 251) - s - 108, d = 2), 255 == i) throw h = t.readInt(r, e + 1) / 65535, d = 5, "unknown number";
                        if (30 == i) {
                            var p = [];
                            for (d = 1; ;) {
                                var f = r[e + d];
                                d++;
                                var l = f >> 4, v = 15 & f;
                                if (15 != l && p.push(l), 15 != v && p.push(v), 15 == v) break
                            }
                            for (var y = "", c = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber"], S = 0; S < p.length; S++) y += c[p[S]];
                            h = parseFloat(y)
                        }
                        if (i <= 21) if (u = ["version", "Notice", "FullName", "FamilyName", "Weight", "FontBBox", "BlueValues", "OtherBlues", "FamilyBlues", "FamilyOtherBlues", "StdHW", "StdVW", "escape", "UniqueID", "XUID", "charset", "Encoding", "CharStrings", "Private", "Subrs", "defaultWidthX", "nominalWidthX"][i], d = 1, 12 == i) u = ["Copyright", "isFixedPitch", "ItalicAngle", "UnderlinePosition", "UnderlineThickness", "PaintType", "CharstringType", "FontMatrix", "StrokeWidth", "BlueScale", "BlueShift", "BlueFuzz", "StemSnapH", "StemSnapV", "ForceBold", "", "", "LanguageGroup", "ExpansionFactor", "initialRandomSeed", "SyntheticBase", "PostScript", "BaseFontName", "BaseFontBlend", "", "", "", "", "", "", "ROS", "CIDFontVersion", "CIDFontRevision", "CIDFontType", "CIDCount", "UIDBase", "FDArray", "FDSelect", "FontName"][s], d = 2;
                        null != u ? (n[u] = 1 == o.length ? o[0] : o, o = []) : o.push(h), e += d
                    }
                    return n
                }
            }, Typr.T.cmap = {
                parseTab: function (r, e, a) {
                    var t = { tables: [], ids: {}, off: e };
                    r = new Uint8Array(r.buffer, e, a);
                    e = 0;
                    var n = Typr.B, o = n.readUshort, i = Typr.T.cmap, s = (o(r, e), o(r, e += 2));
                    e += 2;
                    for (var d = [], u = 0; u < s; u++) {
                        var h = o(r, e), p = o(r, e += 2);
                        e += 2;
                        var f = n.readUint(r, e);
                        e += 4;
                        var l = "p" + h + "e" + p, v = d.indexOf(f);
                        if (-1 == v) {
                            v = t.tables.length;
                            var y = {};
                            d.push(f);
                            var c = y.format = o(r, f);
                            0 == c ? y = i.parse0(r, f, y) : 4 == c ? y = i.parse4(r, f, y) : 6 == c ? y = i.parse6(r, f, y) : 12 == c && (y = i.parse12(r, f, y)), t.tables.push(y)
                        }
                        if (null != t.ids[l]) throw "multiple tables for one platform+encoding";
                        t.ids[l] = v
                    }
                    return t
                }, parse0: function (r, e, a) {
                    var t = Typr.B;
                    e += 2;
                    var n = t.readUshort(r, e);
                    e += 2;
                    t.readUshort(r, e);
                    e += 2, a.map = [];
                    for (var o = 0; o < n - 6; o++) a.map.push(r[e + o]);
                    return a
                }, parse4: function (r, e, a) {
                    var t = Typr.B, n = t.readUshort, o = t.readUshorts, i = e, s = n(r, e += 2),
                        d = (n(r, e += 2), n(r, e += 2));
                    e += 2;
                    var u = d >>> 1;
                    a.searchRange = n(r, e), e += 2, a.entrySelector = n(r, e), e += 2, a.rangeShift = n(r, e), e += 2, a.endCount = o(r, e, u), e += 2 * u, e += 2, a.startCount = o(r, e, u), e += 2 * u, a.idDelta = [];
                    for (var h = 0; h < u; h++) a.idDelta.push(t.readShort(r, e)), e += 2;
                    return a.idRangeOffset = o(r, e, u), e += 2 * u, a.glyphIdArray = o(r, e, i + s - e >>> 1), a
                }, parse6: function (r, e, a) {
                    var t = Typr.B;
                    e += 2;
                    t.readUshort(r, e);
                    e += 2;
                    t.readUshort(r, e);
                    e += 2, a.firstCode = t.readUshort(r, e), e += 2;
                    var n = t.readUshort(r, e);
                    e += 2, a.glyphIdArray = [];
                    for (var o = 0; o < n; o++) a.glyphIdArray.push(t.readUshort(r, e)), e += 2;
                    return a
                }, parse12: function (r, e, a) {
                    var t = Typr.B.readUint, n = (t(r, e += 4), t(r, e += 4), 3 * t(r, e += 4));
                    e += 4;
                    for (var o = a.groups = new Uint32Array(n), i = 0; i < n; i += 3) o[i] = t(r, e + (i << 2)), o[i + 1] = t(r, e + (i << 2) + 4), o[i + 2] = t(r, e + (i << 2) + 8);
                    return a
                }
            }, Typr.T.glyf = {
                parseTab: function (r, e, a, t) {
                    for (var n = [], o = t.maxp.numGlyphs, i = 0; i < o; i++) n.push(null);
                    return n
                }, _parseGlyf: function (r, e) {
                    var a = Typr.B, t = r._data, n = r.loca;
                    if (n[e] == n[e + 1]) return null;
                    var o = Typr.findTable(t, "glyf", r._offset)[0] + n[e], i = {};
                    if (i.noc = a.readShort(t, o), o += 2, i.xMin = a.readShort(t, o), o += 2, i.yMin = a.readShort(t, o), o += 2, i.xMax = a.readShort(t, o), o += 2, i.yMax = a.readShort(t, o), o += 2, i.xMin >= i.xMax || i.yMin >= i.yMax) return null;
                    if (i.noc > 0) {
                        i.endPts = [];
                        for (var s = 0; s < i.noc; s++) i.endPts.push(a.readUshort(t, o)), o += 2;
                        var d = a.readUshort(t, o);
                        if (o += 2, t.length - o < d) return null;
                        i.instructions = a.readBytes(t, o, d), o += d;
                        var u = i.endPts[i.noc - 1] + 1;
                        i.flags = [];
                        for (s = 0; s < u; s++) {
                            var h = t[o];
                            if (o++, i.flags.push(h), 0 != (8 & h)) {
                                var p = t[o];
                                o++;
                                for (var f = 0; f < p; f++) i.flags.push(h), s++
                            }
                        }
                        i.xs = [];
                        for (s = 0; s < u; s++) {
                            var l = 0 != (2 & i.flags[s]), v = 0 != (16 & i.flags[s]);
                            l ? (i.xs.push(v ? t[o] : -t[o]), o++) : v ? i.xs.push(0) : (i.xs.push(a.readShort(t, o)), o += 2)
                        }
                        i.ys = [];
                        for (s = 0; s < u; s++) {
                            l = 0 != (4 & i.flags[s]), v = 0 != (32 & i.flags[s]);
                            l ? (i.ys.push(v ? t[o] : -t[o]), o++) : v ? i.ys.push(0) : (i.ys.push(a.readShort(t, o)), o += 2)
                        }
                        var y = 0, c = 0;
                        for (s = 0; s < u; s++) y += i.xs[s], c += i.ys[s], i.xs[s] = y, i.ys[s] = c
                    } else {
                        var S;
                        i.parts = [];
                        do {
                            S = a.readUshort(t, o), o += 2;
                            var T = { m: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }, p1: -1, p2: -1 };
                            if (i.parts.push(T), T.glyphIndex = a.readUshort(t, o), o += 2, 1 & S) {
                                var U = a.readShort(t, o);
                                o += 2;
                                var g = a.readShort(t, o);
                                o += 2
                            } else {
                                U = a.readInt8(t, o);
                                o++;
                                g = a.readInt8(t, o);
                                o++
                            }
                            2 & S ? (T.m.tx = U, T.m.ty = g) : (T.p1 = U, T.p2 = g), 8 & S ? (T.m.a = T.m.d = a.readF2dot14(t, o), o += 2) : 64 & S ? (T.m.a = a.readF2dot14(t, o), o += 2, T.m.d = a.readF2dot14(t, o), o += 2) : 128 & S && (T.m.a = a.readF2dot14(t, o), o += 2, T.m.b = a.readF2dot14(t, o), o += 2, T.m.c = a.readF2dot14(t, o), o += 2, T.m.d = a.readF2dot14(t, o), o += 2)
                        } while (32 & S);
                        if (256 & S) {
                            var m = a.readUshort(t, o);
                            o += 2, i.instr = [];
                            for (s = 0; s < m; s++) i.instr.push(t[o]), o++
                        }
                    }
                    return i
                }
            }, Typr.T.head = {
                parseTab: function (r, e, a) {
                    var t = Typr.B, n = {};
                    t.readFixed(r, e);
                    e += 4, n.fontRevision = t.readFixed(r, e), e += 4;
                    t.readUint(r, e);
                    e += 4;
                    t.readUint(r, e);
                    return e += 4, n.flags = t.readUshort(r, e), e += 2, n.unitsPerEm = t.readUshort(r, e), e += 2, n.created = t.readUint64(r, e), e += 8, n.modified = t.readUint64(r, e), e += 8, n.xMin = t.readShort(r, e), e += 2, n.yMin = t.readShort(r, e), e += 2, n.xMax = t.readShort(r, e), e += 2, n.yMax = t.readShort(r, e), e += 2, n.macStyle = t.readUshort(r, e), e += 2, n.lowestRecPPEM = t.readUshort(r, e), e += 2, n.fontDirectionHint = t.readShort(r, e), e += 2, n.indexToLocFormat = t.readShort(r, e), e += 2, n.glyphDataFormat = t.readShort(r, e), e += 2, n
                }
            }, Typr.T.hhea = {
                parseTab: function (r, e, a) {
                    var t = Typr.B, n = {};
                    t.readFixed(r, e);
                    e += 4;
                    for (var o = ["ascender", "descender", "lineGap", "advanceWidthMax", "minLeftSideBearing", "minRightSideBearing", "xMaxExtent", "caretSlopeRise", "caretSlopeRun", "caretOffset", "res0", "res1", "res2", "res3", "metricDataFormat", "numberOfHMetrics"], i = 0; i < o.length; i++) {
                        var s = o[i],
                            d = "advanceWidthMax" == s || "numberOfHMetrics" == s ? t.readUshort : t.readShort;
                        n[s] = d(r, e + 2 * i)
                    }
                    return n
                }
            }, Typr.T.hmtx = {
                parseTab: function (r, e, a, t) {
                    for (var n = Typr.B, o = [], i = [], s = t.maxp.numGlyphs, d = t.hhea.numberOfHMetrics, u = 0, h = 0, p = 0; p < d;) u = n.readUshort(r, e + (p << 2)), h = n.readShort(r, e + (p << 2) + 2), o.push(u), i.push(h), p++;
                    for (; p < s;) o.push(u), i.push(h), p++;
                    return { aWidth: o, lsBearing: i }
                }
            }, Typr.T.kern = {
                parseTab: function (r, e, a, t) {
                    var n = Typr.B, o = Typr.T.kern;
                    if (1 == n.readUshort(r, e)) return o.parseV1(r, e, a, t);
                    var i = n.readUshort(r, e + 2);
                    e += 4;
                    for (var s = { glyph1: [], rval: [] }, d = 0; d < i; d++) {
                        e += 2;
                        a = n.readUshort(r, e);
                        e += 2;
                        var u = n.readUshort(r, e);
                        e += 2;
                        var h = u >>> 8;
                        0 == (h &= 15) && (e = o.readFormat0(r, e, s))
                    }
                    return s
                }, parseV1: function (r, e, a, t) {
                    var n = Typr.B, o = Typr.T.kern, i = (n.readFixed(r, e), n.readUint(r, e + 4));
                    e += 8;
                    for (var s = { glyph1: [], rval: [] }, d = 0; d < i; d++) {
                        n.readUint(r, e);
                        e += 4;
                        var u = n.readUshort(r, e);
                        e += 2;
                        n.readUshort(r, e);
                        e += 2, 0 == (255 & u) && (e = o.readFormat0(r, e, s))
                    }
                    return s
                }, readFormat0: function (r, e, a) {
                    var t = Typr.B, n = t.readUshort, o = -1, i = n(r, e);
                    n(r, e + 2), n(r, e + 4), n(r, e + 6);
                    e += 8;
                    for (var s = 0; s < i; s++) {
                        var d = n(r, e), u = n(r, e += 2);
                        e += 2;
                        var h = t.readShort(r, e);
                        e += 2, d != o && (a.glyph1.push(d), a.rval.push({ glyph2: [], vals: [] }));
                        var p = a.rval[a.rval.length - 1];
                        p.glyph2.push(u), p.vals.push(h), o = d
                    }
                    return e
                }
            }, Typr.T.loca = {
                parseTab: function (r, e, a, t) {
                    var n = Typr.B, o = [], i = t.head.indexToLocFormat, s = t.maxp.numGlyphs + 1;
                    if (0 == i) for (var d = 0; d < s; d++) o.push(n.readUshort(r, e + (d << 1)) << 1);
                    if (1 == i) for (d = 0; d < s; d++) o.push(n.readUint(r, e + (d << 2)));
                    return o
                }
            }, Typr.T.maxp = {
                parseTab: function (r, e, a) {
                    var t = Typr.B, n = t.readUshort, o = {};
                    t.readUint(r, e);
                    return e += 4, o.numGlyphs = n(r, e), e += 2, o
                }
            }, Typr.T.name = {
                parseTab: function (r, e, a) {
                    var t = Typr.B, n = {};
                    t.readUshort(r, e);
                    e += 2;
                    var o = t.readUshort(r, e);
                    e += 2;
                    t.readUshort(r, e);
                    for (var i = ["copyright", "fontFamily", "fontSubfamily", "ID", "fullName", "version", "postScriptName", "trademark", "manufacturer", "designer", "description", "urlVendor", "urlDesigner", "licence", "licenceURL", "---", "typoFamilyName", "typoSubfamilyName", "compatibleFull", "sampleText", "postScriptCID", "wwsFamilyName", "wwsSubfamilyName", "lightPalette", "darkPalette"], s = e += 2, d = t.readUshort, u = 0; u < o; u++) {
                        var h = d(r, e), p = d(r, e += 2), f = d(r, e += 2), l = d(r, e += 2), v = d(r, e += 2),
                            y = d(r, e += 2);
                        e += 2;
                        var c, S = s + 12 * o + y;
                        0 == h || 3 == h && 0 == p ? c = t.readUnicode(r, S, v / 2) : 0 == p ? c = t.readASCII(r, S, v) : 1 == p || 3 == p || 4 == p || 10 == p ? c = t.readUnicode(r, S, v / 2) : 1 == h ? (c = t.readASCII(r, S, v), console.log("reading unknown MAC encoding " + p + " as ASCII")) : (console.log("unknown encoding " + p + ", platformID: " + h), c = t.readASCII(r, S, v));
                        var T = "p" + h + "," + f.toString(16);
                        null == n[T] && (n[T] = {}), n[T][i[l]] = c, n[T]._lang = f
                    }
                    var U, g = "postScriptName";
                    for (var m in n) if (null != n[m][g] && 1033 == n[m]._lang) return n[m];
                    for (var m in n) if (null != n[m][g] && 0 == n[m]._lang) return n[m];
                    for (var m in n) if (null != n[m][g] && 3084 == n[m]._lang) return n[m];
                    for (var m in n) if (null != n[m][g]) return n[m];
                    for (var m in n) {
                        U = n[m];
                        break
                    }
                    return console.log("returning name table with languageID " + U._lang), null == U[g] && null != U.ID && (U[g] = U.ID), U
                }
            }, Typr.T.OS2 = {
                parseTab: function (r, e, a) {
                    var t = Typr.B.readUshort(r, e);
                    e += 2;
                    var n = Typr.T.OS2, o = {};
                    if (0 == t) n.version0(r, e, o); else if (1 == t) n.version1(r, e, o); else if (2 == t || 3 == t || 4 == t) n.version2(r, e, o); else {
                        if (5 != t) throw "unknown OS/2 table version: " + t;
                        n.version5(r, e, o)
                    }
                    return o
                }, version0: function (r, e, a) {
                    var t = Typr.B;
                    return a.xAvgCharWidth = t.readShort(r, e), e += 2, a.usWeightClass = t.readUshort(r, e), e += 2, a.usWidthClass = t.readUshort(r, e), e += 2, a.fsType = t.readUshort(r, e), e += 2, a.ySubscriptXSize = t.readShort(r, e), e += 2, a.ySubscriptYSize = t.readShort(r, e), e += 2, a.ySubscriptXOffset = t.readShort(r, e), e += 2, a.ySubscriptYOffset = t.readShort(r, e), e += 2, a.ySuperscriptXSize = t.readShort(r, e), e += 2, a.ySuperscriptYSize = t.readShort(r, e), e += 2, a.ySuperscriptXOffset = t.readShort(r, e), e += 2, a.ySuperscriptYOffset = t.readShort(r, e), e += 2, a.yStrikeoutSize = t.readShort(r, e), e += 2, a.yStrikeoutPosition = t.readShort(r, e), e += 2, a.sFamilyClass = t.readShort(r, e), e += 2, a.panose = t.readBytes(r, e, 10), e += 10, a.ulUnicodeRange1 = t.readUint(r, e), e += 4, a.ulUnicodeRange2 = t.readUint(r, e), e += 4, a.ulUnicodeRange3 = t.readUint(r, e), e += 4, a.ulUnicodeRange4 = t.readUint(r, e), e += 4, a.achVendID = t.readASCII(r, e, 4), e += 4, a.fsSelection = t.readUshort(r, e), e += 2, a.usFirstCharIndex = t.readUshort(r, e), e += 2, a.usLastCharIndex = t.readUshort(r, e), e += 2, a.sTypoAscender = t.readShort(r, e), e += 2, a.sTypoDescender = t.readShort(r, e), e += 2, a.sTypoLineGap = t.readShort(r, e), e += 2, a.usWinAscent = t.readUshort(r, e), e += 2, a.usWinDescent = t.readUshort(r, e), e += 2
                }, version1: function (r, e, a) {
                    var t = Typr.B;
                    return e = Typr.T.OS2.version0(r, e, a), a.ulCodePageRange1 = t.readUint(r, e), e += 4, a.ulCodePageRange2 = t.readUint(r, e), e += 4
                }, version2: function (r, e, a) {
                    var t = Typr.B, n = t.readUshort;
                    return e = Typr.T.OS2.version1(r, e, a), a.sxHeight = t.readShort(r, e), e += 2, a.sCapHeight = t.readShort(r, e), e += 2, a.usDefault = n(r, e), e += 2, a.usBreak = n(r, e), e += 2, a.usMaxContext = n(r, e), e += 2
                }, version5: function (r, e, a) {
                    var t = Typr.B.readUshort;
                    return e = Typr.T.OS2.version2(r, e, a), a.usLowerOpticalPointSize = t(r, e), e += 2, a.usUpperOpticalPointSize = t(r, e), e += 2
                }
            }, Typr.T.post = {
                parseTab: function (r, e, a) {
                    var t = Typr.B, n = {};
                    return n.version = t.readFixed(r, e), e += 4, n.italicAngle = t.readFixed(r, e), e += 4, n.underlinePosition = t.readShort(r, e), e += 2, n.underlineThickness = t.readShort(r, e), e += 2, n
                }
            }, Typr.T.SVG = {
                parseTab: function (r, e, a) {
                    var t = Typr.B, n = { entries: [] }, o = e;
                    t.readUshort(r, e);
                    e += 2;
                    var i = t.readUint(r, e);
                    e += 4;
                    t.readUint(r, e);
                    e += 4, e = i + o;
                    var s = t.readUshort(r, e);
                    e += 2;
                    for (var d = 0; d < s; d++) {
                        var u = t.readUshort(r, e);
                        e += 2;
                        var h = t.readUshort(r, e);
                        e += 2;
                        var p = t.readUint(r, e);
                        e += 4;
                        var f = t.readUint(r, e);
                        e += 4;
                        for (var l = new Uint8Array(r.buffer, o + p + i, f), v = t.readUTF8(l, 0, l.length), y = u; y <= h; y++) n.entries[y] = v
                    }
                    return n
                }
            };
            Typr.U = {
                shape: function (t, e, r) {
                    for (var s = function (t, e, r, s) {
                        var n = e[r], a = e[r + 1], h = t.kern;
                        if (h) {
                            var o = h.glyph1.indexOf(n);
                            if (-1 != o) {
                                var f = h.rval[o].glyph2.indexOf(a);
                                if (-1 != f) return [0, 0, h.rval[o].vals[f], 0]
                            }
                        }
                        return [0, 0, 0, 0]
                    }, n = [], a = 0; a < e.length; a++) {
                        var h = e.codePointAt(a);
                        h > 65535 && a++, n.push(Typr.U.codeToGlyph(t, h))
                    }
                    var o = [];
                    for (a = 0; a < n.length; a++) {
                        var f = s(t, n, a), i = n[a], l = t.hmtx.aWidth[i] + f[2];
                        o.push({ g: i, cl: a, dx: 0, dy: 0, ax: l, ay: 0 }), l
                    }
                    return o
                }, shapeToPath: function (t, e, r) {
                    for (var s = { cmds: [], crds: [] }, n = 0, a = 0, h = 0; h < e.length; h++) {
                        for (var o = e[h], f = Typr.U.glyphToPath(t, o.g), i = f.crds, l = 0; l < i.length; l += 2) s.crds.push(i[l] + n + o.dx), s.crds.push(i[l + 1] + a + o.dy);
                        r && s.cmds.push(r);
                        for (l = 0; l < f.cmds.length; l++) s.cmds.push(f.cmds[l]);
                        var c = s.cmds.length;
                        r && 0 != c && "X" != s.cmds[c - 1] && s.cmds.push("X"), n += o.ax, a += o.ay
                    }
                    return { cmds: s.cmds, crds: s.crds }
                }, codeToGlyph: function (t, e) {
                    for (var r = t.cmap, s = -1, n = ["p3e10", "p0e4", "p3e1", "p1e0", "p0e3", "p0e1"], a = 0; a < n.length; a++) if (null != r.ids[n[a]]) {
                        s = r.ids[n[a]];
                        break
                    }
                    if (-1 == s) throw "no familiar platform and encoding!";
                    var h = function (t, e, r) {
                        for (var s = 0, n = Math.floor(t.length / e); s + 1 != n;) {
                            var a = s + (n - s >>> 1);
                            t[a * e] <= r ? s = a : n = a
                        }
                        return s * e
                    }, o = r.tables[s], f = o.format, i = -1;
                    if (0 == f) i = e >= o.map.length ? 0 : o.map[e]; else if (4 == f) {
                        var l = -1, c = o.endCount;
                        if (e > c[c.length - 1] ? l = -1 : c[l = h(c, 1, e)] < e && l++, -1 == l) i = 0; else if (e < o.startCount[l]) i = 0; else {
                            i = 65535 & (0 != o.idRangeOffset[l] ? o.glyphIdArray[e - o.startCount[l] + (o.idRangeOffset[l] >> 1) - (o.idRangeOffset.length - l)] : e + o.idDelta[l])
                        }
                    } else if (6 == f) {
                        var u = e - o.firstCode, d = o.glyphIdArray;
                        i = u < 0 || u >= d.length ? 0 : d[u]
                    } else {
                        if (12 != f) throw "unknown cmap table format " + o.format;
                        var v = o.groups;
                        e > v[v.length - 2] ? i = 0 : (v[a = h(v, 3, e)] <= e && e <= v[a + 1] && (i = v[a + 2] + (e - v[a])), -1 == i && (i = 0))
                    }
                    var p = t["SVG "], g = t.loca;
                    return 0 == i || null != t["CFF "] || null != p && null != p.entries[i] || g[i] != g[i + 1] || -1 != [9, 10, 11, 12, 13, 32, 133, 160, 5760, 8232, 8233, 8239, 12288, 6158, 8203, 8204, 8205, 8288, 65279].indexOf(e) || 8192 <= e && e <= 8202 || (i = 0), i
                }, glyphToPath: function (t, e) {
                    var r = { cmds: [], crds: [] }, s = t["SVG "], n = t["CFF "], a = Typr.U;
                    if (s && s.entries[e]) {
                        var h = s.entries[e];
                        null != h && ("string" == typeof h && (h = a.SVG.toPath(h), s.entries[e] = h), r = h)
                    } else if (n) {
                        var o = n.Private, f = {
                            x: 0,
                            y: 0,
                            stack: [],
                            nStems: 0,
                            haveWidth: !1,
                            width: o ? o.defaultWidthX : 0,
                            open: !1
                        };
                        if (n.ROS) {
                            for (var i = 0; n.FDSelect[i + 2] <= e;) i += 2;
                            o = n.FDArray[n.FDSelect[i + 1]].Private
                        }
                        a._drawCFF(n.CharStrings[e], f, n, o, r)
                    } else t.glyf && a._drawGlyf(e, t, r);
                    return { cmds: r.cmds, crds: r.crds }
                }, _drawGlyf: function (t, e, r) {
                    var s = e.glyf[t];
                    null == s && (s = e.glyf[t] = Typr.T.glyf._parseGlyf(e, t)), null != s && (s.noc > -1 ? Typr.U._simpleGlyph(s, r) : Typr.U._compoGlyph(s, e, r))
                }, _simpleGlyph: function (t, e) {
                    for (var r = Typr.U.P, s = 0; s < t.noc; s++) {
                        for (var n = 0 == s ? 0 : t.endPts[s - 1] + 1, a = t.endPts[s], h = n; h <= a; h++) {
                            var o = h == n ? a : h - 1, f = h == a ? n : h + 1, i = 1 & t.flags[h],
                                l = 1 & t.flags[o], c = 1 & t.flags[f], u = t.xs[h], d = t.ys[h];
                            if (h == n) if (i) {
                                if (!l) {
                                    r.MoveTo(e, u, d);
                                    continue
                                }
                                r.MoveTo(e, t.xs[o], t.ys[o])
                            } else l ? r.MoveTo(e, t.xs[o], t.ys[o]) : r.MoveTo(e, Math.floor(.5 * (t.xs[o] + u)), Math.floor(.5 * (t.ys[o] + d)));
                            i ? l && r.LineTo(e, u, d) : c ? r.qCurveTo(e, u, d, t.xs[f], t.ys[f]) : r.qCurveTo(e, u, d, Math.floor(.5 * (u + t.xs[f])), Math.floor(.5 * (d + t.ys[f])))
                        }
                        r.ClosePath(e)
                    }
                }, _compoGlyph: function (t, e, r) {
                    for (var s = 0; s < t.parts.length; s++) {
                        var n = { cmds: [], crds: [] }, a = t.parts[s];
                        Typr.U._drawGlyf(a.glyphIndex, e, n);
                        for (var h = a.m, o = 0; o < n.crds.length; o += 2) {
                            var f = n.crds[o], i = n.crds[o + 1];
                            r.crds.push(f * h.a + i * h.b + h.tx), r.crds.push(f * h.c + i * h.d + h.ty)
                        }
                        for (o = 0; o < n.cmds.length; o++) r.cmds.push(n.cmds[o])
                    }
                }, pathToSVG: function (t, e) {
                    var r = t.cmds, s = t.crds;
                    null == e && (e = 5);
                    for (var n = [], a = 0, h = { M: 2, L: 2, Q: 4, C: 6 }, o = 0; o < r.length; o++) {
                        var f = r[o], i = a + (h[f] ? h[f] : 0);
                        for (n.push(f); a < i;) {
                            var l = s[a++];
                            n.push(parseFloat(l.toFixed(e)) + (a == i ? "" : " "))
                        }
                    }
                    return n.join("")
                }, SVGToPath: function (t) {
                    var e = { cmds: [], crds: [] };
                    return Typr.U.SVG.svgToPath(t, e), { cmds: e.cmds, crds: e.crds }
                }, pathToContext: function (t, e) {
                    for (var r = 0, s = t.cmds, n = t.crds, a = 0; a < s.length; a++) {
                        var h = s[a];
                        "M" == h ? (e.moveTo(n[r], n[r + 1]), r += 2) : "L" == h ? (e.lineTo(n[r], n[r + 1]), r += 2) : "C" == h ? (e.bezierCurveTo(n[r], n[r + 1], n[r + 2], n[r + 3], n[r + 4], n[r + 5]), r += 6) : "Q" == h ? (e.quadraticCurveTo(n[r], n[r + 1], n[r + 2], n[r + 3]), r += 4) : "#" == h.charAt(0) ? (e.beginPath(), e.fillStyle = h) : "Z" == h ? e.closePath() : "X" == h && e.fill()
                    }
                }, P: {
                    MoveTo: function (t, e, r) {
                        t.cmds.push("M"), t.crds.push(e, r)
                    }, LineTo: function (t, e, r) {
                        t.cmds.push("L"), t.crds.push(e, r)
                    }, CurveTo: function (t, e, r, s, n, a, h) {
                        t.cmds.push("C"), t.crds.push(e, r, s, n, a, h)
                    }, qCurveTo: function (t, e, r, s, n) {
                        t.cmds.push("Q"), t.crds.push(e, r, s, n)
                    }, ClosePath: function (t) {
                        t.cmds.push("Z")
                    }
                }, _drawCFF: function (t, e, r, s, n) {
                    for (var a = e.stack, h = e.nStems, o = e.haveWidth, f = e.width, i = e.open, l = 0, c = e.x, u = e.y, d = 0, v = 0, p = 0, g = 0, m = 0, y = 0, T = 0, C = 0, b = 0, _ = 0, M = Typr.T.CFF, x = Typr.U.P, P = s.nominalWidthX, w = {
                        val: 0,
                        size: 0
                    }; l < t.length;) {
                        M.getCharString(t, l, w);
                        var S = w.val;
                        if (l += w.size, "o1" == S || "o18" == S) a.length % 2 != 0 && !o && (f = a.shift() + P), h += a.length >> 1, a.length = 0, o = !0; else if ("o3" == S || "o23" == S) {
                            a.length % 2 != 0 && !o && (f = a.shift() + P), h += a.length >> 1, a.length = 0, o = !0
                        } else if ("o4" == S) a.length > 1 && !o && (f = a.shift() + P, o = !0), i && x.ClosePath(n), u += a.pop(), x.MoveTo(n, c, u), i = !0; else if ("o5" == S) for (; a.length > 0;) c += a.shift(), u += a.shift(), x.LineTo(n, c, u); else if ("o6" == S || "o7" == S) for (var F = a.length, A = "o6" == S, U = 0; U < F; U++) {
                            var G = a.shift();
                            A ? c += G : u += G, A = !A, x.LineTo(n, c, u)
                        } else if ("o8" == S || "o24" == S) {
                            F = a.length;
                            for (var L = 0; L + 6 <= F;) d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), c = p + a.shift(), u = g + a.shift(), x.CurveTo(n, d, v, p, g, c, u), L += 6;
                            "o24" == S && (c += a.shift(), u += a.shift(), x.LineTo(n, c, u))
                        } else {
                            if ("o11" == S) break;
                            if ("o1234" == S || "o1235" == S || "o1236" == S || "o1237" == S) "o1234" == S && (v = u, p = (d = c + a.shift()) + a.shift(), _ = g = v + a.shift(), y = g, C = u, c = (T = (m = (b = p + a.shift()) + a.shift()) + a.shift()) + a.shift(), x.CurveTo(n, d, v, p, g, b, _), x.CurveTo(n, m, y, T, C, c, u)), "o1235" == S && (d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), b = p + a.shift(), _ = g + a.shift(), m = b + a.shift(), y = _ + a.shift(), T = m + a.shift(), C = y + a.shift(), c = T + a.shift(), u = C + a.shift(), a.shift(), x.CurveTo(n, d, v, p, g, b, _), x.CurveTo(n, m, y, T, C, c, u)), "o1236" == S && (d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), _ = g = v + a.shift(), y = g, T = (m = (b = p + a.shift()) + a.shift()) + a.shift(), C = y + a.shift(), c = T + a.shift(), x.CurveTo(n, d, v, p, g, b, _), x.CurveTo(n, m, y, T, C, c, u)), "o1237" == S && (d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), b = p + a.shift(), _ = g + a.shift(), m = b + a.shift(), y = _ + a.shift(), T = m + a.shift(), C = y + a.shift(), Math.abs(T - c) > Math.abs(C - u) ? c = T + a.shift() : u = C + a.shift(), x.CurveTo(n, d, v, p, g, b, _), x.CurveTo(n, m, y, T, C, c, u)); else if ("o14" == S) {
                                if (a.length > 0 && !o && (f = a.shift() + r.nominalWidthX, o = !0), 4 == a.length) {
                                    var k = a.shift(), O = a.shift(), V = a.shift(), W = a.shift(),
                                        B = M.glyphBySE(r, V), I = M.glyphBySE(r, W);
                                    Typr.U._drawCFF(r.CharStrings[B], e, r, s, n), e.x = k, e.y = O, Typr.U._drawCFF(r.CharStrings[I], e, r, s, n)
                                }
                                i && (x.ClosePath(n), i = !1)
                            } else if ("o19" == S || "o20" == S) {
                                a.length % 2 != 0 && !o && (f = a.shift() + P), h += a.length >> 1, a.length = 0, o = !0, l += h + 7 >> 3
                            } else if ("o21" == S) a.length > 2 && !o && (f = a.shift() + P, o = !0), u += a.pop(), c += a.pop(), i && x.ClosePath(n), x.MoveTo(n, c, u), i = !0; else if ("o22" == S) a.length > 1 && !o && (f = a.shift() + P, o = !0), c += a.pop(), i && x.ClosePath(n), x.MoveTo(n, c, u), i = !0; else if ("o25" == S) {
                                for (; a.length > 6;) c += a.shift(), u += a.shift(), x.LineTo(n, c, u);
                                d = c + a.shift(), v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), c = p + a.shift(), u = g + a.shift(), x.CurveTo(n, d, v, p, g, c, u)
                            } else if ("o26" == S) for (a.length % 2 && (c += a.shift()); a.length > 0;) d = c, v = u + a.shift(), c = p = d + a.shift(), u = (g = v + a.shift()) + a.shift(), x.CurveTo(n, d, v, p, g, c, u); else if ("o27" == S) for (a.length % 2 && (u += a.shift()); a.length > 0;) v = u, p = (d = c + a.shift()) + a.shift(), g = v + a.shift(), c = p + a.shift(), u = g, x.CurveTo(n, d, v, p, g, c, u); else if ("o10" == S || "o29" == S) {
                                var q = "o10" == S ? s : r;
                                if (0 == a.length) console.log("error: empty stack"); else {
                                    var Q = a.pop(), X = q.Subrs[Q + q.Bias];
                                    e.x = c, e.y = u, e.nStems = h, e.haveWidth = o, e.width = f, e.open = i, Typr.U._drawCFF(X, e, r, s, n), c = e.x, u = e.y, h = e.nStems, o = e.haveWidth, f = e.width, i = e.open
                                }
                            } else if ("o30" == S || "o31" == S) {
                                var D = a.length, E = (L = 0, "o31" == S);
                                for (L += D - (F = -3 & D); L < F;) E ? (v = u, p = (d = c + a.shift()) + a.shift(), u = (g = v + a.shift()) + a.shift(), F - L == 5 ? (c = p + a.shift(), L++) : c = p, E = !1) : (d = c, v = u + a.shift(), p = d + a.shift(), g = v + a.shift(), c = p + a.shift(), F - L == 5 ? (u = g + a.shift(), L++) : u = g, E = !0), x.CurveTo(n, d, v, p, g, c, u), L += 4
                            } else {
                                if ("o" == (S + "").charAt(0)) throw console.log("Unknown operation: " + S, t), S;
                                a.push(S)
                            }
                        }
                    }
                    e.x = c, e.y = u, e.nStems = h, e.haveWidth = o, e.width = f, e.open = i
                }, SVG: function () {
                    var t = {
                        getScale: function (t) {
                            return Math.sqrt(Math.abs(t[0] * t[3] - t[1] * t[2]))
                        }, translate: function (e, r, s) {
                            t.concat(e, [1, 0, 0, 1, r, s])
                        }, rotate: function (e, r) {
                            t.concat(e, [Math.cos(r), -Math.sin(r), Math.sin(r), Math.cos(r), 0, 0])
                        }, scale: function (e, r, s) {
                            t.concat(e, [r, 0, 0, s, 0, 0])
                        }, concat: function (t, e) {
                            var r = t[0], s = t[1], n = t[2], a = t[3], h = t[4], o = t[5];
                            t[0] = r * e[0] + s * e[2], t[1] = r * e[1] + s * e[3], t[2] = n * e[0] + a * e[2], t[3] = n * e[1] + a * e[3], t[4] = h * e[0] + o * e[2] + e[4], t[5] = h * e[1] + o * e[3] + e[5]
                        }, invert: function (t) {
                            var e = t[0], r = t[1], s = t[2], n = t[3], a = t[4], h = t[5], o = e * n - r * s;
                            t[0] = n / o, t[1] = -r / o, t[2] = -s / o, t[3] = e / o, t[4] = (s * h - n * a) / o, t[5] = (r * a - e * h) / o
                        }, multPoint: function (t, e) {
                            var r = e[0], s = e[1];
                            return [r * t[0] + s * t[2] + t[4], r * t[1] + s * t[3] + t[5]]
                        }, multArray: function (t, e) {
                            for (var r = 0; r < e.length; r += 2) {
                                var s = e[r], n = e[r + 1];
                                e[r] = s * t[0] + n * t[2] + t[4], e[r + 1] = s * t[1] + n * t[3] + t[5]
                            }
                        }
                    };
 
                    function e(t, e, r) {
                        for (var s = [], n = 0, a = 0, h = 0; ;) {
                            var o = t.indexOf(e, a), f = t.indexOf(r, a);
                            if (-1 == o && -1 == f) break;
                            -1 == f || -1 != o && o < f ? (0 == h && (s.push(t.slice(n, o).trim()), n = o + 1), h++, a = o + 1) : (-1 == o || -1 != f && f < o) && (0 == --h && (s.push(t.slice(n, f).trim()), n = f + 1), a = f + 1)
                        }
                        return s
                    }
 
                    function r(r) {
                        for (var n = e(r, "(", ")"), a = [1, 0, 0, 1, 0, 0], h = 0; h < n.length; h += 2) {
                            var o = a;
                            a = s(n[h], n[h + 1]), t.concat(a, o)
                        }
                        return a
                    }
 
                    function s(e, r) {
                        for (var s = [1, 0, 0, 1, 0, 0], n = !0, a = 0; a < r.length; a++) {
                            var h = r.charAt(a);
                            "," == h || " " == h ? n = !0 : "." == h ? (n || (r = r.slice(0, a) + "," + r.slice(a), a++), n = !1) : "-" == h && a > 0 && "e" != r[a - 1] && (r = r.slice(0, a) + " " + r.slice(a), a++, n = !0)
                        }
                        if (r = r.split(/\s*[\s,]\s*/).map(parseFloat), "translate" == e) 1 == r.length ? t.translate(s, r[0], 0) : t.translate(s, r[0], r[1]); else if ("scale" == e) 1 == r.length ? t.scale(s, r[0], r[0]) : t.scale(s, r[0], r[1]); else if ("rotate" == e) {
                            var o = 0, f = 0;
                            1 != r.length && (o = r[1], f = r[2]), t.translate(s, -o, -f), t.rotate(s, -Math.PI * r[0] / 180), t.translate(s, o, f)
                        } else "matrix" == e ? s = r : console.log("unknown transform: ", e);
                        return s
                    }
 
                    function n(e, s, a) {
                        for (var o = 0; o < e.length; o++) {
                            var f = e[o], i = f.tagName, l = f.getAttribute("fill");
                            if (null == l && (l = a), "g" == i) {
                                var c = { crds: [], cmds: [] };
                                n(f.children, c, l);
                                var u = f.getAttribute("transform");
                                if (u) {
                                    var d = r(u);
                                    t.multArray(d, c.crds)
                                }
                                s.crds = s.crds.concat(c.crds), s.cmds = s.cmds.concat(c.cmds)
                            } else if ("path" == i || "circle" == i || "ellipse" == i) {
                                var v;
                                if (s.cmds.push(l || "#000000"), "path" == i && (v = f.getAttribute("d")), "circle" == i || "ellipse" == i) {
                                    for (var p = [0, 0, 0, 0], g = ["cx", "cy", "rx", "ry", "r"], m = 0; m < 5; m++) {
                                        var y = f.getAttribute(g[m]);
                                        y && (y = parseFloat(y), m < 4 ? p[m] = y : p[2] = p[3] = y)
                                    }
                                    var T = p[0], C = p[1], b = p[2], _ = p[3];
                                    v = ["M", T - b, C, "a", b, _, 0, 1, 0, 2 * b, 0, "a", b, _, 0, 1, 0, 2 * -b, 0].join(" ")
                                }
                                h(v, s), s.cmds.push("X")
                            } else "defs" == i || console.log(i, f)
                        }
                    }
 
                    function a(t, e, r) {
                        for (var s = e; s < t.length && "string" != typeof t[s];) s += r;
                        return (s - e) / r
                    }
 
                    function h(t, e) {
                        for (var r = function (t) {
                            for (var e = [], r = 0, s = !1, n = "", a = ""; r < t.length;) {
                                var h = t.charCodeAt(r), o = t.charAt(r);
                                r++;
                                var f = 48 <= h && h <= 57 || "." == o || "-" == o || "e" == o || "E" == o;
                                s ? "-" == o && "e" != a || "." == o && -1 != n.indexOf(".") ? (e.push(parseFloat(n)), n = o) : f ? n += o : (e.push(parseFloat(n)), "," != o && " " != o && e.push(o), s = !1) : f ? (n = o, s = !0) : "," != o && " " != o && e.push(o), a = o
                            }
                            return s && e.push(parseFloat(n)), e
                        }(t), s = 0, n = 0, h = 0, o = 0, f = 0, i = e.crds.length, l = {
                            M: 2,
                            L: 2,
                            H: 1,
                            V: 1,
                            T: 2,
                            S: 4,
                            A: 7,
                            Q: 4,
                            C: 6
                        }, c = e.cmds, u = e.crds; s < r.length;) {
                            var d = r[s];
                            s++;
                            var v = d.toUpperCase();
                            if ("Z" == v) c.push("Z"), n = o, h = f; else for (var p = a(r, s, l[v]), g = 0; g < p; g++) {
                                1 == g && "M" == v && (d = d == v ? "L" : "l", v = "L");
                                var m = 0, y = 0;
                                if (d != v && (m = n, y = h), "M" == v) n = m + r[s++], h = y + r[s++], c.push("M"), u.push(n, h), o = n, f = h; else if ("L" == v) n = m + r[s++], h = y + r[s++], c.push("L"), u.push(n, h); else if ("H" == v) n = m + r[s++], c.push("L"), u.push(n, h); else if ("V" == v) h = y + r[s++], c.push("L"), u.push(n, h); else if ("Q" == v) {
                                    var T = m + r[s++], C = y + r[s++], b = m + r[s++], _ = y + r[s++];
                                    c.push("Q"), u.push(T, C, b, _), n = b, h = _
                                } else if ("T" == v) {
                                    T = n + n - u[P = Math.max(u.length - 2, i)], C = h + h - u[P + 1], b = m + r[s++], _ = y + r[s++];
                                    c.push("Q"), u.push(T, C, b, _), n = b, h = _
                                } else if ("C" == v) {
                                    T = m + r[s++], C = y + r[s++], b = m + r[s++], _ = y + r[s++];
                                    var M = m + r[s++], x = y + r[s++];
                                    c.push("C"), u.push(T, C, b, _, M, x), n = M, h = x
                                } else if ("S" == v) {
                                    var P;
                                    T = n + n - u[P = Math.max(u.length - ("C" == c[c.length - 1] ? 4 : 2), i)], C = h + h - u[P + 1], b = m + r[s++], _ = y + r[s++], M = m + r[s++], x = y + r[s++];
                                    c.push("C"), u.push(T, C, b, _, M, x), n = M, h = x
                                } else if ("A" == v) {
                                    T = n, C = h;
                                    var w = r[s++], S = r[s++], F = r[s++] * (Math.PI / 180), A = r[s++],
                                        U = r[s++];
                                    b = m + r[s++], _ = y + r[s++];
                                    if (b == n && _ == h && 0 == w && 0 == S) continue;
                                    var G = (T - b) / 2, L = (C - _) / 2, k = Math.cos(F), O = Math.sin(F),
                                        V = k * G + O * L, W = -O * G + k * L, B = w * w, I = S * S, q = V * V,
                                        Q = W * W, X = (B * I - B * Q - I * q) / (B * Q + I * q),
                                        D = (A != U ? 1 : -1) * Math.sqrt(Math.max(X, 0)), E = D * (w * W) / S,
                                        H = S * V * -D / w, R = k * E - O * H + (T + b) / 2,
                                        Z = O * E + k * H + (C + _) / 2, z = function (t, e, r, s) {
                                            var n = (t * r + e * s) / (Math.sqrt(t * t + e * e) * Math.sqrt(r * r + s * s));
                                            return (t * s - e * r >= 0 ? 1 : -1) * Math.acos(Math.max(-1, Math.min(1, n)))
                                        }, N = (V - E) / w, j = (W - H) / S, J = z(1, 0, N, j),
                                        K = z(N, j, (-V - E) / w, (-W - H) / S);
                                    !function (t, e, r, s, n, a, h) {
                                        var o = function (t, e) {
                                            var r = Math.sin(e), s = Math.cos(e), n = (e = t[0], t[1]), a = t[2],
                                                h = t[3];
                                            t[0] = e * s + n * r, t[1] = -e * r + n * s, t[2] = a * s + h * r, t[3] = -a * r + h * s
                                        }, f = function (t, e) {
                                            for (var r = 0; r < e.length; r += 2) {
                                                var s = e[r], n = e[r + 1];
                                                e[r] = t[0] * s + t[2] * n + t[4], e[r + 1] = t[1] * s + t[3] * n + t[5]
                                            }
                                        }, i = function (t, e) {
                                            for (var r = 0; r < e.length; r++) t.push(e[r])
                                        };
                                        if (h) for (; a > n;) a -= 2 * Math.PI; else for (; a < n;) a += 2 * Math.PI;
                                        var l = (a - n) / 4, c = Math.cos(l / 2), u = -Math.sin(l / 2),
                                            d = (4 - c) / 3, v = 0 == u ? u : (1 - c) * (3 - c) / (3 * u),
                                            p = [d, v, d, -v, c, -u],
                                            g = { cmds: ["C", "C", "C", "C"], crds: p.slice(0) },
                                            m = [1, 0, 0, 1, 0, 0];
                                        o(m, -l);
                                        for (var y = 0; y < 3; y++) f(m, p), i(g.crds, p);
                                        o(m, l / 2 - n), m[0] *= s, m[1] *= s, m[2] *= s, m[3] *= s, m[4] = e, m[5] = r, f(m, g.crds), f(t.ctm, g.crds), function (t, e) {
                                            i(t.cmds, e.cmds), i(t.crds, e.crds)
                                        }(t.pth, g)
                                    }({
                                        pth: e,
                                        ctm: [w * k, w * O, -S * O, S * k, R, Z]
                                    }, 0, 0, 1, J, J + (K %= 2 * Math.PI), 0 == U), n = b, h = _
                                } else console.log("Unknown SVG command " + d)
                            }
                        }
                    }
 
                    return {
                        cssMap: function (t) {
                            for (var r = e(t, "{", "}"), s = {}, n = 0; n < r.length; n += 2) for (var a = r[n].split(","), h = 0; h < a.length; h++) {
                                var o = a[h].trim();
                                null == s[o] && (s[o] = ""), s[o] += r[n + 1]
                            }
                            return s
                        }, readTrnf: r, svgToPath: h, toPath: function (t) {
                            var e = { cmds: [], crds: [] };
                            if (null == t) return e;
                            var r = (new DOMParser).parseFromString(t, "image/svg+xml").getElementsByTagName("svg")[0],
                                s = r.getAttribute("viewBox");
                            s = s ? s.trim().split(" ").map(parseFloat) : [0, 0, 1e3, 1e3], n(r.children, e);
                            for (var a = 0; a < e.crds.length; a += 2) {
                                var h = e.crds[a], o = e.crds[a + 1];
                                h -= s[0], o = -(o -= s[1]), e.crds[a] = h, e.crds[a + 1] = o
                            }
                            return e
                        }
                    }
                }(), initHB: function (t, e) {
                    var r = function (t) {
                        var e = 0;
                        return 0 == (4294967168 & t) ? e = 1 : 0 == (4294965248 & t) ? e = 2 : 0 == (4294901760 & t) ? e = 3 : 0 == (4292870144 & t) && (e = 4), e
                    }, s = new window.TextEncoder("utf8");
                    fetch(t).then((function (t) {
                        return t.arrayBuffer()
                    })).then((function (t) {
                        return WebAssembly.instantiate(t)
                    })).then((function (t) {
                        console.log("HB ready");
                        var n = t.instance.exports, a = n.memory;
                        a.grow(700);
                        var h, o, f, i, l, c = new Uint8Array(a.buffer), u = new Uint32Array(a.buffer),
                            d = new Int32Array(a.buffer);
                        Typr.U.shapeHB = function (t, e, a) {
                            var v = t._data, p = t.name.postScriptName;
                            h != p && (null != o && (n.hb_blob_destroy(o), n.free(f), n.hb_face_destroy(i), n.hb_font_destroy(l)), f = n.malloc(v.byteLength), c.set(v, f), o = n.hb_blob_create(f, v.byteLength, 2, 0, 0), i = n.hb_face_create(o, 0), l = n.hb_font_create(i), h = p);
                            var g = n.hb_buffer_create(), m = s.encode(e), y = m.length, T = n.malloc(y);
                            c.set(m, T), n.hb_buffer_add_utf8(g, T, y, 0, y), n.free(T), n.hb_buffer_set_direction(g, a ? 4 : 5), n.hb_buffer_guess_segment_properties(g), n.hb_shape(l, g, 0, 0);
                            var C = function (t) {
                                for (var e = n.hb_buffer_get_length(t), r = [], s = n.hb_buffer_get_glyph_infos(t, 0) >>> 2, a = n.hb_buffer_get_glyph_positions(t, 0) >>> 2, h = 0; h < e; ++h) {
                                    var o = s + 5 * h, f = a + 5 * h;
                                    r.push({
                                        g: u[o + 0],
                                        cl: u[o + 2],
                                        ax: d[f + 0],
                                        ay: d[f + 1],
                                        dx: d[f + 2],
                                        dy: d[f + 3]
                                    })
                                }
                                return r
                            }(g);
                            n.hb_buffer_destroy(g);
                            var b = C.slice(0);
                            a || b.reverse();
                            for (var _ = 0, M = 0, x = 1; x < b.length; x++) {
                                for (var P = b[x], w = P.cl; ;) {
                                    var S = e.codePointAt(_), F = r(S);
                                    if (!(M + F <= w)) break;
                                    M += F, _ += S <= 65535 ? 1 : 2
                                }
                                P.cl = _
                            }
                            return C
                        }, e()
                    }))
                }
            };
            var $tip = $('style:contains(font-cxsecret)');
            if (!$tip.length) return;
            var font = $tip.text().match(/base64,([\w\W]+?)'/)[1];
            font = Typr.parse(this.base64ToUint8Array(font))[0];
            var table = JSON.parse(GM_getResourceText('ttf'));
            var match = {};
            for (var i = 19968; i < 40870; i++) {
                $tip = Typr.U.codeToGlyph(font, i);
                if (!$tip) continue;
                $tip = Typr.U.glyphToPath(font, $tip);
                $tip = md5(JSON.stringify($tip)).slice(24);
                match[i] = table[$tip];
            }
            $('.font-cxsecret').html(function (index, html) {
                $.each(match, function (key, value) {
                    key = String.fromCharCode(key);
                    key = new RegExp(key, 'g');
                    value = String.fromCharCode(value);
                    html = html.replace(key, value);
                });
                return html;
            }).removeClass('font-cxsecret');
        },
        base64ToUint8Array(base64) {
            var data = window.atob(base64);
            var buffer = new Uint8Array(data.length);
            for (var i = 0; i < data.length; ++i) {
                buffer[i] = data.charCodeAt(i);
            }
            return buffer;
        },
        getQuestion: function (type, html = '') {
            let questionHtml, questionText, questionType, questionTypeId, optionHtml, tokenHtml, workType,
                optionText, index;
            switch (type) {
                case '1':
                    workType = "zj"
                    questionHtml = $(html).find(".clearfix .fontLabel");
                    questionText = utils.removeHtml(questionHtml[0].innerHTML).cl();
                    questionTypeId = $(html).find("input[name^=answertype]:eq(0)").val();
                    optionHtml = $(html).find('ul:eq(0) li .after');
                    tokenHtml = html.innerHTML;
                    optionText = [];
                    optionHtml.each(function (index, item) {
                        optionText.push(utils.removeHtml(item.innerHTML));
                    });
                    break;
                case '2':
                    workType = "zy"
                    questionHtml = $(html).find(".mark_name");
                    index = questionHtml[0].innerHTML.indexOf('</span>');
                    questionText = utils.removeHtml(questionHtml[0].innerHTML.substring(index + 7)).cl();
                    questionType = questionHtml[0].getElementsByTagName('span')[0].innerHTML.replace('(', '').replace(')', '').split(',')[0];
                    questionTypeId = $(html).find("input[name^=answertype]:eq(0)").val();
                    optionHtml = $(html).find(".answer_p");
                    tokenHtml = html.innerHTML;
                    optionText = [];
                    for (let i = 0; i < optionHtml.length; i++) {
                        optionText.push(utils.removeHtml(optionHtml[i].innerHTML));
                    }
                    break;
                case '3':
                    workType = "ks"
                    questionHtml = document.getElementsByClassName('mark_name colorDeep');
                    index = questionHtml[0].innerHTML.indexOf('</span>');
                    questionText = utils.removeHtml(questionHtml[0].innerHTML.substring(index + 7)).cl();
                    questionType = questionHtml[0].getElementsByTagName('span')[0].innerHTML.replace('(', '').replace(')', '').split(',')[0];
                    questionTypeId = $("input[name^=type]:eq(1)").val();
                    optionHtml = document.getElementsByClassName('answer_p');
                    tokenHtml = document.getElementsByClassName('mark_table')[0].innerHTML;
                    optionText = [];
                    for (let i = 0; i < optionHtml.length; i++) {
                        optionText.push(utils.removeHtml(optionHtml[i].innerHTML));
                    }
                    if (!defaultConfig.hidden) {
                        let layx_content = document.getElementById('layx_content');
                        layx_content.innerHTML = '<div class="question_content"><span class="question_type">' + questionType + '</span>' + questionText + '</div><div class="option"></div><div class="answer">答案正在获取中</div>';
                        let option = document.getElementsByClassName('option')[0];
                        for (let i = 0; i < optionText.length; i++) {
                            option.innerHTML += '<div class="option_item">' + String.fromCharCode(65 + i) + '、' + optionText[i] + '</div>';
                        }
                        let answer = document.getElementsByClassName('answer')[0];
                        answer.innerHTML = '答案正在获取中';
                    }
                    break;
            }
            return {
                "question": questionText,
                "options": optionText,
                "type": questionTypeId,
                "questionData": tokenHtml,
                "workType": workType
            }
        },
        answerFormat: function (answer) {
            //如果是数组
            if (answer instanceof Array) {
                //去除null
                answer = answer.filter(function (item) {
                    return item !== null;
                });
                for (let i = 0; i < answer.length; i++) {
                    answer[i] = utils.removeHtml(answer[i]);
                }
            } else if (typeof answer === 'string') {
                answer = answer.cl();
            }
            return answer;
        },
        setAnswer: function (type, options, answer) {
            answer = this.answerFormat(answer);
            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    this.clear();
                    var matchArr = utils.matchIndex(options, answer);
                    for (var i = 0; i < matchArr.length; i++) {
                        $(".answerBg").eq(matchArr[i]).click();
                        $(".option_item").eq(matchArr[i]).css("color", "green").css("font-weight", "bold");
                    }
                    return matchArr.length > 0;
                case '3':// 判断
                    answer = answer[0];
                    answer && this.clear();
                    $(".answerBg").each(function () {
                        if ($(this).find(".num_option").attr("data") == "true") {
                            answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $(this).click()
                        } else {
                            answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $(this).click()
                        }
                    });
                    return ($(".answerBg").find(".check_answer").length > 0 || $(".answerBg").find(".check_answer_dx").length > 0);
                case '2':// 填空
                case '9':// 程序填空
                case '4':// 简答
                case '5':
                case '6':
                case '7':
                    var blankNum = $(".answerBg, .textDIV, .eidtDiv").find('textarea').length;
                    if (blankNum != answer.length) {
                        return false;
                    }
                    this.clear();
                    $(".answerBg, .textDIV, .eidtDiv").find('textarea').each(function (index) {
                        _self.UE.getEditor($(this).attr('name')).ready(function () {
                            this.setContent(answer[index].replace(/第.空:/g, ""));
                        });
                    });
                    return true;
                default:
                    return false;
            }
        },
        setWorkAnswer: function (type, options, answer, inx) {
            answer = this.answerFormat(answer);
            let item = $(".questionLi").eq(inx);
            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    this.clearCurrent(item);
                    var matchArr = utils.matchIndex(options, answer);
                    for (var i = 0; i < matchArr.length; i++) {
                        item.find(".answerBg").eq(matchArr[i]).click();
                        $(".option_item").eq(matchArr[i]).css("color", "green").css("font-weight", "bold");
                    }
                    return matchArr.length > 0 && answer;
                case '3':// 判断
                    answer = answer[0];
                    answer && this.clearCurrent(item);
                    item.find(".answerBg").each(function () {
                        if ($(this).find(".num_option").attr("data") == "true") {
                            answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $(this).click()
                        } else {
                            answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $(this).click()
                        }
                    });
                    return ($(".answerBg").find(".check_answer").length > 0 || $(".answerBg").find(".check_answer_dx").length > 0) && answer;
                case '2':// 填空
                case '9':// 程序填空
                case '4':// 简答
                case '5':
                case '6':
                case '7':
                    var blankNum = item.find('textarea').length;
                    if (blankNum != answer.length) {
                        return false;
                    }
                    page.clearCurrent(item);
                    item.find('textarea').each(function (index) {
                        _self.UE.getEditor($(this).attr('name')).ready(function () {
                            this.setContent(answer[index]);
                        });
                    });
                    return answer;
                default:
                    return false;
            }
        },
        setChapterAnswer: function (type, options, answer, inx) {
            answer = this.answerFormat(answer);
            let item = $(".TiMu").eq(inx);
            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    page.clearCurrent(item);
                    var matchArr = utils.matchIndex(options, answer);
                    if (matchArr.length > 0) {
                        for (var i = 0; i < matchArr.length; i++) {
                            item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(matchArr[i]).click();
                            $(".option_item").eq(matchArr[i]).css("color", "green").css("font-weight", "bold");
                        }
                        return answer;
                    } else {
                        matchArr = utils.fuzzyMatchIndex(options, answer);
                        for (var i = 0; i < matchArr.length; i++) {
                            item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(matchArr[i]).click();
                            $(".option_item").eq(matchArr[i]).css("color", "green").css("font-weight", "bold");
                        }
                        if (!matchArr.length) {
                            var random = Math.floor(Math.random() * options.length);
                            item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(random).click();
                            return false;
                        }
                        return matchArr.length > 0;
                    }
                case '3':// 判断
                    answer = answer[0];
                    answer && page.clearCurrent(item);
                    item.find('ul:eq(0) li :radio,:checkbox,textarea').each(function () {
                        if ($(this).val() == "true") {
                            answer.match(/(^|,)(True|true|正确|是|对|√|T|ri)(,|$)/) && $(this).click()
                        } else {
                            answer.match(/(^|,)(False|false|错误|否|错|×|F|wr)(,|$)/) && $(this).click()
                        }
                    });
                    let isCheck = item.find('ul:eq(0) li :radio,:checkbox,textarea').is(':checked');
                    if (!isCheck) {
                        var random = Math.floor(Math.random() * 2);
                        item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(random).click();
                    }
                    return isCheck && answer;
                case '2':// 填空
                case '9':// 程序填空
                case '4':// 简答
                case '5':
                case '6':
                case '7':
                    var blankNum = item.find('textarea').length;
                    if (blankNum != answer.length) {
                        return false;
                    }
                    page.clearCurrent(item);
                    item.find('textarea').each(function (index) {
                        _self.UE.getEditor($(this).attr('name')).ready(function () {
                            this.setContent(answer[index]);
                        });
                    });
                    return answer;
                default:
                    return false;
            }
        },
        randomChapterAnswer: function (type, options, inx) {
            let item = $(".TiMu").eq(inx);
            switch (type) {
                case '0':// 单选
                case '1':// 多选
                    var random = Math.floor(Math.random() * options.length);
                    item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(random).click();
                    return true;
                case '3':// 判断
                    var random = Math.floor(Math.random() * 2);
                    item.find('ul:eq(0) li :radio,:checkbox,textarea').eq(random).click();
                    return true;
                default:
                    return false;
            }
        }
        ,
        startAsk: async function (data) {
            const answer = document.getElementsByClassName('answer')[0];
            let answerArr = await page.requestMerge(data);
            let validAnswer = answerArr.find(item => Array.isArray(item) && item.length > 0 && page.setAnswer(data.type, data.options, item));
            if (!validAnswer && defaultConfig.freeFirst) {
                answerArr = await page.requestMerge(data, 1);
                validAnswer = answerArr.find(item => Array.isArray(item) && item.length > 0 && page.setAnswer(data.type, data.options, item));
            }
            if (validAnswer) {
                answer.innerHTML = '答案：<br />' + validAnswer.join('<br />');
                answer.style.color = 'green';
                this.layx_status_msg(`已答题,等待切换 剩余次数:${reqUrl.num || '暂未获取'}`);
            } else {
                answer.innerHTML = answerArr.find(item => !Array.isArray(item) && item.length > 0 && item) || '暂无答案';
                this.layx_status_msg("答案匹配失败,等待切换");
            }
            await utils.sleep(defaultConfig.interval);
            defaultConfig.autoSwitch && $('.nextDiv .jb_btn:contains("下一题")').click();
            !$('.nextDiv .jb_btn:contains("下一题")') && this.layx_status_msg("答题已完成");
        },
        startWork: async function () {
            let layx_content = $("#layx_content"), questionList = $(".questionLi"), tableHTML = `
            <table id="qlist" class="table table-bordered">
                <thead>
                <tr>
                    <th style="width: 10%">题号</th>
                    <th style="width: 60%">题目</th>
                    <th style="width: 30%">答案</th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
            `;
            layx_content.html(tableHTML);
 
            async function startWorkTask(workinx) {
                let data = page.getQuestion("2", questionList[workinx]);
                let tr = $('<tr>').css("border-bottom", "1px solid #ddd");
                let td1 = $('<td>').html(`<a href="javascript:void(0)" onclick="document.getElementsByClassName('questionLi')[${workinx}].scrollIntoView();">${parseInt(workinx) + 1}</a>`);
                let td2 = $('<td>').html(`<a href="javascript:void(0)" onclick="document.getElementsByClassName('questionLi')[${workinx}].scrollIntoView();">${data.question}</a>`);
                let td3 = $('<td>');
                tr.append(td1, td2, td3);
                let answerArr = await page.requestMerge(data);
                let validAnswer = answerArr.find(item => Array.isArray(item) && item.length > 0 && page.setWorkAnswer(data.type, data.options, item, workinx));
                if (!validAnswer && defaultConfig.freeFirst) {
                    answerArr = await page.requestMerge(data, 1);
                    validAnswer = answerArr.find(item => Array.isArray(item) && item.length > 0 && page.setWorkAnswer(data.type, data.options, item, workinx));
                }
                if (validAnswer) {
                    td3.html(validAnswer.join('<br />'));
                    tr.css("color", "green");
                    defaultConfig.succ++;
                } else {
                    td3.html(answerArr.find(item => !Array.isArray(item) && item.length > 0 && item) || '暂无答案');
                    let aBtn = $('<a>').html('重试').css({
                        'color': 'blue',
                        'margin-left': '10px',
                        'cursor': 'pointer'
                    }).click(function () {
                        startWorkTask(workinx);
                    });
                    td3.append(aBtn);
                    tr.css("color", "red");
                    defaultConfig.fail++;
                    $(".layx_status").html("答案匹配失败,等待切换");
                }
                validAnswer && page.layx_status_msg(`答题进度:${parseInt(workinx) + 1}/${questionList.length} 成功${defaultConfig.succ}题 失败${defaultConfig.fail}题,剩余次数:${reqUrl.num || '暂未使用'}`);
                if ($("#qlist tbody tr").length > workinx) {
                    $("#qlist tbody tr").eq(workinx).replaceWith(tr);
                } else {
                    $("#qlist tbody").append(tr);
                }
            }
 
            for (let i = 0; i < questionList.length; i++) {
                await startWorkTask(i);
                await utils.sleep(defaultConfig.interval);
            }
            this.layx_status_msg(`答题完成 - 已答${defaultConfig.succ}题,未答${questionList.length - defaultConfig.succ}题,剩余次数:${reqUrl.num || '暂未使用'}`);
        },
        startChapter: async function () {
            let layx_content = $("#layx_content"), questionList = $(".TiMu"), tableHTML = `
            <table id="qlist" class="table table-bordered">
                <thead>
                <tr>
                    <th style="width: 10%">题号</th>
                    <th style="width: 60%">题目</th>
                    <th style="width: 30%">答案</th>
                </tr>
                </thead>
                <tbody></tbody>
            </table>
            `;
            layx_content.html(tableHTML);
 
            async function startChapterTask(workinx) {
                let data = page.getQuestion("1", questionList[workinx]);
                let tr = $('<tr>').css("border-bottom", "1px solid #ddd");
                let td1 = $('<td>').html(`<a href="javascript:void(0)" onclick="document.getElementsByClassName('TiMu')[${workinx}].scrollIntoView();">${parseInt(workinx) + 1}</a>`);
                let td2 = $('<td>').html(`<a href="javascript:void(0)" onclick="document.getElementsByClassName('TiMu')[${workinx}].scrollIntoView();">${data.question}</a>`);
                let td3 = $('<td>');
                tr.append(td1, td2, td3);
                let answerArr = await page.requestMerge(data);
                let validAnswer = answerArr.find(item => Array.isArray(item) && item.length > 0 && page.setChapterAnswer(data.type, data.options, item, workinx));
                if (!validAnswer && defaultConfig.freeFirst) {
                    log("开始请求");
                    answerArr = await page.requestMerge(data, 1);
                    log(answerArr);
 
                    validAnswer = answerArr.find(item => Array.isArray(item) && item.length > 0 && page.setChapterAnswer(data.type, data.options, item, workinx));
                }
                if (validAnswer) {
                    td3.html(validAnswer.join('<br />'));
                    tr.css("color", "green");
                    defaultConfig.succ++;
                } else {
                    td3.html(answerArr.find(item => !Array.isArray(item) && item.length > 0 && item) || '暂无答案');
                    let aBtn = $('<a>').html('重试').css({
                        'color': 'blue',
                        'margin-left': '10px',
                        'cursor': 'pointer'
                    }).click(function () {
                        startChapterTask(workinx);
                    });
                    td3.append(aBtn);
                    tr.css("color", "red");
                    $(".layx_status").html("答案匹配失败,等待切换");
                }
                validAnswer && page.layx_status_msg(`答题进度:${parseInt(workinx) + 1}/${questionList.length} 成功${defaultConfig.succ}题 失败${defaultConfig.fail}题,剩余次数:${reqUrl.num || '暂未使用'}`);
                if ($("#qlist tbody tr").length > workinx) {
                    $("#qlist tbody tr").eq(workinx).replaceWith(tr);
                } else {
                    $("#qlist tbody").append(tr);
                }
            }
 
            for (let i = 0; i < questionList.length; i++) {
                await startChapterTask(i);
                await utils.sleep(defaultConfig.interval);
            }
            this.layx_status_msg(`答题完成 - 已答${defaultConfig.succ}题,未答${questionList.length - defaultConfig.succ}题,剩余次数:${reqUrl.num || '暂未使用'}  ${defaultConfig.autoSubmit ? "【准备自动提交】" : "【未开启自动提交，请手动操作】"}`);
            let z = defaultConfig.succ / questionList.length;
            if (defaultConfig.autoSubmit) {
                setInterval(function () {
                    window.parent.postMessage(utils.notify("error", "提交超时，已暂时关闭"), '*');
                }, 5000);
                if (z >= defaultConfig.autoSubmitRate) {
                    this.layx_status_msg(`正确率达标，等待3秒后提交`);
                    await utils.sleep(3000);
                    btnBlueSubmit();
                    await utils.sleep(1000);
                    submitCheckTimes()
                } else {
                    this.layx_status_msg(`准确率不足${defaultConfig.autoSubmitRate * 100}%,暂存答案`);
                    noSubmit();
                    window.alert = function (e) {
                        console.log(e);
                    };
                    window.parent.postMessage(utils.notify("error", "正确率不够，暂存"), '*');
                }
            }
        },
        getScore: async function () {
            let questionList = $(".TiMu").map(function (index, element) {
                try {
                    let questionHtml, questionText, questionType, questionAnswer, questionOption = [],
                        questionAnalysis = "";
                    questionHtml = $(element).find(".Zy_TItle .clearfix");
                    questionText = utils.removeHtml(questionHtml[0].innerHTML);
                    questionType = questionText.match(/^\【(.+?)\】/)[1];
                    questionText = questionText.replace(questionText.match(/^\【(.+?)\】/)[0], "")
                    switch (questionType) {
                        case '单选题':
                        case '多选题':
                            questionOption = $(element).find("ul>li").map(function (inx, item) {
                                return utils.removeHtml($(item).find("a").html());
                            }).get();
                            return null;
                        case '判断题':
                            questionAnalysis = utils.removeHtml($(element).find(".Py_addpy:eq(0)").html() || "");
                            if (element.innerHTML.includes("正确答案")) {
                                questionAnswer = utils.removeHtml($(element).find(".Py_answer.clearfix>span").html());
                            } else {
                                let temp = $(element).find(".Py_answer.clearfix").html();
                                const match = temp.match(/^(.*?)(?=<i class="fr (dui|cuo)"><\/i>)/s);
                                const result = match ? match[1] : null;
                                questionAnswer = utils.removeHtml(result);
                            }
                            if (questionAnswer.includes("正确答案")) {
                                questionAnswer = questionAnswer.replace("正确答案：", "").trim();
                            } else if ($(element).find(".fr.dui").length > 0) {
                                questionAnswer = questionAnswer.replace("我的答案：", "").trim();
                            } else if (questionAnswer.replace("我的答案：", "").trim().includes("√") || questionAnswer.replace("我的答案：", "").trim().includes("×")) {
                                questionAnswer = questionAnswer.replace("我的答案：", "").trim() == "√" ? "×" : "√";
                            } else {
                                return null;
                            }
                            break
                        case '填空题':
                            questionAnswer = $("span.font14", $(element)).map(function (inx, item) {
                                return utils.removeHtml($(item).html()).replace(/^第.空：/, "").trim();
                            }).get();
                            if (questionAnswer.length == 0) {
                                questionAnswer = $(element).find(".Py_answer.clearfix>div>div[class='font14']");
                                if (questionAnswer.length = $(element).find(".Py_answer.clearfix>div>div[class='font14']>>.fr.dui").length) {
                                    questionAnswer = questionAnswer.map(function (inx, item) {
                                        return utils.removeHtml($(item).html()).replace(/^第.空：/, "").trim();
                                    }).get();
                                } else {
                                    return null;
                                }
                            }
                            break;
                        default:
                            return null;
                    }
                    return {
                        "question": questionText,
                        "options": questionOption,
                        "type": defaultConfig.types[questionType],
                        "answer": questionAnswer,
                    }
                } catch (e) {
                    log(e)
                    return null;
                }
            }).get();
 
            questionList.length && ServerApi.defaultRequest(reqUrl.api + "save1", "post", {
                "questionList": questionList,
                "url": location.href,
            }, reqUrl.headers).then(function (res) {
                log(res.responseText);
            });
        },
        getScore2: async function (data) {
            log(data);
            if (data.url == undefined) {
                return;
            }
            let url = data.url
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: {},
                onload: function (response) {
                    let html = response.responseText;
                    let document1, questionList, questionListHtml;
                    document1 = new DOMParser().parseFromString(html, "text/html");
                    questionList = document1.getElementsByClassName('Py-mian1');
                    questionListHtml = [];
                    for (let i = 0; i < questionList.length; i++) {
                        try {
                            if (i === 0) {
                                continue;
                            }
                            let questionTitle = utils.removeHtml(questionList[i].getElementsByClassName('Py-m1-title')[0].innerHTML);
                            let questionType = questionTitle.match(/\[(.*?)\]/)[1];
                            if (questionType === "单选题" || questionType === "多选题") {
                                questionTitle = questionTitle.replace(/[0-9]{1,3}.\s/ig, '').replace(/(^\s*)|(\s*$)/g, "").replace(/^【.*?】\s*/, '').replace(/\[(.*?)\]\s*/, '').replace(/\s*（\d+\.\d+分）$/, '');
                                let optionHtml = $(questionList[i]).find('ul.answerList li.clearfix');
                                let optionText = [];
                                optionHtml.each(function (index, item) {
                                    let abcd = String.fromCharCode(65 + index) + ".";
                                    let optionTemp = utils.removeHtml(item.innerHTML);
                                    if (optionTemp.indexOf(abcd) == 0) {
                                        optionTemp = optionTemp.replace(abcd, "").trim();
                                    }
                                    optionText.push(optionTemp);
                                });
                                questionListHtml.push({
                                    "question": questionTitle,
                                    "type": defaultConfig.types[questionType],
                                    "options": optionText,
                                    "questionData": questionList[i].innerHTML
                                })
                            }
                        } catch (e) {
                            continue;
                        }
                    }
 
                    let postData = {
                        "questionList": questionListHtml,
                        "url": url
                    }
                    ServerApi.defaultRequest(data.url1, "post", postData, data.headers).then(function (res) {
                        log(res.responseText);
                    });
                }
            });
        },
        getScore3: async function () {
            let questionList = $(".marBom60.questionLi").map(function (index, element) {
                let questionHtml, questionText, questionType, questionAnswer, questionOption = [],
                    questionAnalysis = "", $colorGreen, $colorDeep;
                questionHtml = $(element).find("h3");
                questionType = questionHtml.find('span[class="colorShallow"]');
                questionText = utils.removeHtml(questionHtml[0].outerHTML.split(questionType[0].outerHTML)[1]);
                questionType = utils.removeHtml(questionType.html()).match(/^\((.+?)\)/)[1];
                ;
                switch (questionType) {
                    case '判断题':
                        $colorGreen = $(element).find(".colorGreen");
                        $colorDeep = $(element).find(".colorDeep");
                        questionAnswer = ($colorGreen.length > 0) ? $colorGreen.text().replace("正确答案:", "").trim() :
                            ($colorDeep.hasClass("marking_dui")) ? $colorDeep.text().replace("我的答案:", "").trim() :
                                null;
                        questionAnswer = (["√", "正确", "对"].includes(questionAnswer)) ? "正确" :
                            (["×", "错误", "错"].includes(questionAnswer)) ? "错误" :
                                null;
                        break;
                    case '填空题':
                        $colorGreen = $(element).find("dl.colorGreen");
                        $colorDeep = $(element).find(".mark_fill.colorDeep>dd");
                        questionAnswer = ($colorGreen.length > 0) ? $colorGreen.find("dd").map((index, item) =>
                            utils.removeHtml($(item).html()).replace(/^\(.\)/, "").trim()
                        ).get() :
                            ($colorDeep.length === $colorDeep.find(".marking_dui").length) ? $colorDeep.find(".answer_span").map((index, item) =>
                                utils.removeHtml($(item).html()).replace(/^\(.\)/, "").trim()
                            ).get() :
                                null;
                        break;
                    default:
                        return null;
                }
                return {
                    "question": questionText,
                    "options": questionOption,
                    "type": defaultConfig.types[questionType],
                    "answer": questionAnswer,
                }
            }).get();
            questionList.length && ServerApi.defaultRequest(reqUrl.api + "save1", "post", {
                "questionList": questionList,
                "url": location.href,
            }, reqUrl.headers).then(function (res) {
                log(res.responseText);
            });
        },
        getScore4: async function () {
            let questionList = $(".questionLi").map((index, element) => {
                let $element = $(element),
                    questionHtml = $element.find("h3"),
                    questionTypeHtml = questionHtml.find('span[class="colorShallow"]'),
                    questionText = utils.removeHtml(questionHtml[0].outerHTML.split(questionTypeHtml[0].outerHTML)[1]),
                    questionType = utils.removeHtml(questionTypeHtml.html()).match(/^\((.+?)\)/)[1].split(",")[0],
                    totalScore = Number(utils.removeHtml($element.find(".totalScore.fr>i").html())),
                    questionAnswer;
 
                switch (questionType) {
                    case '判断题':
                        let $colorGreen = $element.find(".colorGreen"),
                            $colorDeep = $element.find(".colorDeep");
                        questionAnswer = $colorGreen.length > 0 ?
                            $colorGreen.text().replace("正确答案:", "").trim() :
                            totalScore > 0 ? $colorDeep.text().replace("我的答案:", "").trim() :
                                null;
                        questionAnswer = ["√", "正确", "对"].includes(questionAnswer) ? "正确" :
                            ["×", "错误", "错"].includes(questionAnswer) ? "错误" :
                                null;
                        break;
 
                    case '填空题':
                        questionAnswer = $element.find(".colorGreen>dd").map((inx, item) => {
                            return utils.removeHtml($(item).html()).replace(/^\(.\)/, "").trim();
                        }).get();
                        break;
 
                    default:
                        return null;
                }
                if(questionAnswer === null) {
                    return null;
                }
 
                return {
                    "question": questionText,
                    "options": [],
                    "type": defaultConfig.types[questionType],
                    "answer": questionAnswer,
                }
            }).get();
            questionList.length && ServerApi.defaultRequest(reqUrl.api + "save1", "post", {
                "questionList": questionList,
                "url": location.href,
            }, reqUrl.headers).then(function (res) {
                log(res.responseText);
            });
            console.log(questionList);
            
        },
    };
 
    function start_layx() {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://cdnjs.cloudflare.com/ajax/libs/layx/2.5.4/layx.min.js",
            onload: function (response) {
                var script = document.createElement("script");
                script.textContent = response.responseText;
                document.body.appendChild(script);
                page.init().then(r => {
                    log("init");
                }).catch(e => {
                    log(e);
                });
            },
            onerror: function () {
                alert("必要依赖加载失败，请反馈给作者~");
            },
            ontimeout: function () {
                alert("必要依赖加载超时，请反馈给作者~");
            }
        });
    }
    for (let i = 0; i < _self.localStorage.length; i++) {
        let key = _self.localStorage.key(i);
 
        if (key.indexOf("layx_") === 0) {
            _self.localStorage.removeItem(key);
        }
    }
 
    GM_xmlhttpRequest({
        method: "GET",
        url: "https://cdn.bootcdn.net/ajax/libs/layx/2.5.4/layx.min.js",
        onload: function (response) {
            var script = document.createElement("script");
            script.textContent = response.responseText;
            document.body.appendChild(script);
            page.init().then(r => {
                log("初始化成功");
            }).catch(e => {
                log(e);
            });
        },
        onerror: function () {
            start_layx();
        },
        ontimeout: function () {
            start_layx();
        }
    });
 
}
)();
 
/******/ })()
;