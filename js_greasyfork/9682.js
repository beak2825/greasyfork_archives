// ==UserScript==
// @name			HV掉落检测
// @namespace		HVgame
// @description		检测掉落物品,自动进入下一层,装备耐久显示
// @author			ggxxsol
// @match			http://hentaiverse.org
// @match			http://hentaiverse.org/?s=Battle*
// @match			http://alt.hentaiverse.org/?s=Battle*
// @match			http://hentaiverse.org/?s=Character&ss=eq
// @match			http://hentaiverse.org/?s=Forge&ss=re
// @match			http://hentaiverse.org/?s=Forge&ss=re&filter=equipped
// @version			3.7.3
// @grant			none
// @downloadURL https://update.greasyfork.org/scripts/9682/HV%E6%8E%89%E8%90%BD%E6%A3%80%E6%B5%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/9682/HV%E6%8E%89%E8%90%BD%E6%A3%80%E6%B5%8B.meta.js
// ==/UserScript==

//跳层延时,基本不用更改,如果输入1000为延时1秒（1000毫秒）,可以自己修改
var delaytime=0
//如果想最后一层不跳过的话,请设置为true,否则设备为false
var lastjump=false

//面板颜色设置，你以后再也不用担心面板颜色不能自己更改啦，
//可以写英文的颜色，也可以写颜色编号
//只要你不改崩溃就行 >_<
var equipcolor=";background: #E3E0D1";
var equipfont=";color:black;"
var itemcolor=";background:lightgreen"
var itemfont=";color:black"

//物品标红,请用逗号加单引号添加自己想要的内容
var redword = ['Legendary','Ethereal','of Slaughter','Peerless','Katalox','Phase','Shade','Power','Tower Shield','Estoc','Destruction','Radiant','Savage']  //,'Wakizashi','Katana'

//以下为检测的道具和汉化名称,请一一对应
//itemlist为检测的道具,itemlistname则是对应的显示名称
//如果显示名称留空的话,会直接显示检测名称,
//例如最后那个Mana Potion，直接显示道具名称
//你可以按照下面的格式检测你需要的任何东西
var itemlistname=["祭献古董","遗忘碎片","羽毛碎片" ,
				"以太碎片" ,"血之代币" , "混沌代币","MP中药"]
function itemseek(){
	var itemlist=["Precursor Artifact","Amnesia Shard","Featherweight Shard" ,
				"Aether Shard" ,"Token of Blood" , "Chaos Token","Mana Potion"]
	return itemlist
}
//以下内容如果不会脚本的话，就不要更改了
function autoclicka(){   //跳层
    if(localStorage.xiaohaolv!=0){
        var equnow = new Array();
        var badno=0;
        monsl=document.getElementById('monsterpane').innerHTML;
        monno=monsl.match(/mkey_(\d)/g);    
        localStorage.monnoa=localStorage.monnoa*1-monno.length
        localStorage.monnob=localStorage.monnoa+"("+((100*localStorage.monnoa/localStorage.m_maxcondition+50).toFixed(2))+"%)"
    }
    if(lastjump==true&&document.querySelector(".btcp").innerHTML.match("cleared")=="cleared") return
    document.getElementById("ckey_continue").click();
}
if(!localStorage.jinggaoyuvi){   //脚本初始化数据,只运行一次
    localStorage.jinggaoyuvi=200;localStorage.shuijingshuliang=0;    localStorage.eqsl=1;    localStorage.itemo=localStorage.item='掉落列表:';    localStorage.Artifact=0;    localStorage.Amnesia=0;    localStorage.Featherweight=0;    localStorage.Aether=0;     localStorage.ctoken=0;    localStorage.btoken=0;    localStorage.rounds=0;    localStorage.money=0;    localStorage.moneyt=0;    localStorage.eqtype="";   localStorage.jingli1='';    localStorage.jingli2='';    localStorage.jingli3='';    localStorage.eqsl=2;    localStorage.qtext='Ex';    localStorage.hckg='true';localStorage.xiaohaolv=200;    localStorage.shuijinghuode=0;    return
}
function gaosuwocuowu(){ 
    if(delaytime==0)document.getElementById("ckey_continue").click();
}
function converdot(v){
    var s=v.toString();
    var l=s.match(/^\d*/)[0].length;
    var m=l%3?l%3:3; 
    s=s.slice(0,m)+s.slice(m,l).replace(/(\d{3})/g,",$1")+s.slice(l);   
    return s
}

if(continuekey=document.querySelector(".btcp"))STDI(1)
function STDI(data){
	stop_states=stop()  //检测
	Money=converdot(localStorage.moneyt)
	Crystal=converdot(localStorage.shuijingshuliang)
	jianceshuaxin()
	timer1=setTimeout(autoclicka,delaytime);
	localStorage.rounds=localStorage.rounds*1+1
	if(data==1){
	stopskip = document.createElement("div");
	stopskip.style.cssText = "z-index:100;font-size:25px;cursor:pointer";
	stopskip.innerHTML = "停止跳过"
	stopskip.onclick=function(){clearTimeout(timer2);clearTimeout(timer1);stopskip.innerHTML="已停止"}
	continuekey.appendChild(stopskip)
	}
	else window.location.href = window.location.href;
}
linktoreloaddiv = document.createElement("a");
linktoreloaddiv.id = "event_of_dropscript"
//linktoreloaddiv.style.cssText = "z-index:0;position:absolute; top:155px; left:1242px ";
linktoreloaddiv.innerHTML = "Version:3.7.2<br>"
linktoreloaddiv.onclick=STDI
function jianceshuaxin(){
	localStorage.msgstore=	"<span style=\"color:blue\">品质:<\/span>"+localStorage.qtext+
						'<br><span style=\"color:blue\">层数:<\/span>'+localStorage.rounds+
						'<br>C:'+'<span style=\"color:darkred\">'+Money+"+"+localStorage.money+
						"<br><\/span>水晶:"+Crystal+"+"+localStorage.shuijinghuode+
						'<br>剩余怪物(约):<br>'+localStorage.monnob+'<br>'
}
temp=document.querySelector(".clb")
if(temp.innerHTML.match("Armor Damage")){
    repairdiv = document.createElement("a");
    repairdiv.style.cssText = "z-index:100;font-size:25px;cursor:pointer";
    repairdiv.innerHTML = "全部维修"
    repairdiv.href="http://hentaiverse.org/?s=Forge&ss=re" 
    temp.appendChild(repairdiv)
}
try{
if (document.location.href.match(/ss=re|ss=eq/)) {
	var min;
	var min_maxcondition=0;
	var x,y,z;
	if(localStorage.min_maxcondition)min=localStorage.min_maxcondition
	else min = 1000
	temp=document.body.innerHTML.match(/Condition: [0-9]+ \/ [0-9]+/g)
	if (!temp) {
		localStorage.monnoa=localStorage.min_maxcondition*localStorage.xiaohaolv //如果修理完成，那么会自动填写
		return};
	if(temp.length>7)return;
	for(x in temp){
            y=temp[x].match(/ ([0-9]+) \/ ([0-9]+)/)
            x=y[1]-y[2]/2   //维修
            z=y[1]-y[2]*0.6	//警告
            if (min>=x){
				
            	min=x;localStorage.condition=min;localStorage.condition_60=z;
				localStorage.min_maxcondition=y[2]/2  //最小耐久的维修值
            	localStorage.m_maxcondition=y[2]*localStorage.xiaohaolv 	
            };
        }
		localStorage.monnoa=localStorage.condition*localStorage.xiaohaolv
		localStorage.monnob=localStorage.monnoa+"("+((100*localStorage.monnoa/localStorage.m_maxcondition+50).toFixed(2))+"%)"
		Money=0
		Crystal=0
		jianceshuaxin()
}
}catch(e){}

rightpan = document.createElement("stat");
rightpan.onmouseover = paneapper
rightpan.onmouseout = panedisapp
rightpan.style.cssText = "z-index:10;font-size:13px;color:black; position:fixed; top:5px; left:1242px ;text-align:left;width:300px";
if(localStorage.msgstore)rightpan.innerHTML=localStorage.msgstore
else rightpan.innerHTML="进行游戏后会显示数据"
rightpan.onclick = qingchu
if(localStorage.itemo!=localStorage.item)rightpan.innerHTML+='!!!新装备!!!<br>'
document.body.appendChild(rightpan);

rightpan.appendChild(linktoreloaddiv)
if (document.getElementById("riddlemaster")){
    localStorage.jinglijiance=1
    aaa=document.querySelector(".clb").innerHTML.match(/Stamina: (\d+)/)
    if(aaa==null)localStorage.jinglidianshu="error"
    else localStorage.jinglidianshu=aaa[1]
}
else if(!document.getElementById("riddlemaster")&&localStorage.jinglijiance==1){
    localStorage.jinglijiance=0
    aaa=document.querySelector(".clb").innerHTML.match(/Stamina: (\d+)/)
    if(aaa==null) alert("<HV掉落检测>脚本需要在自定义字体的情况下才能检测精力降低情况")
    else bbb = localStorage.jinglidianshu - aaa[1]
    if(bbb>=1){
        if(bbb>5){
            if(confirm('你的精力值降低了'+bbb+',真可怜,要摸摸头吗?'))alert('你感觉有人摸了摸你的头,并且听见有人对你说:"不要气馁,下次细心一点吧~"')
            alert('注意,Stamina小于10的话,是不会有任何的报酬!')
            localStorage.jinglidianshu=aaa[0];
            return
        }
        alert("HV掉落检测:上回合你的精力(Stamina)降低了"+bbb)
        var myDate = new Date();
        localStorage.jingli3=localStorage.jingli2
        localStorage.jingli2=localStorage.jingli1
        localStorage.jingli1=myDate.getMonth()+1+'/'+myDate.getDate()+'|'+myDate.toLocaleTimeString()+'|-'+bbb+'P<br>'
    }
};

/***********************************function*************************************************/
//情除数据
function qingchu(){
    if(confirm('确定要清除目前的数据吗?(需要胜利一次才能刷新)')){
        localStorage.item='掉落列表:';
        localStorage.itemo=localStorage.item='掉落列表:';
		localStorage.iwmessage=""
        var temp = itemseek()
        for(x in temp){
        	localStorage[temp[x]]=0
        }
        localStorage.shuijingshuliang=localStorage.rounds=localStorage.money=localStorage.moneyt=0;
     }
}


function addRedWord(temptext) {redword = redword.concat(temptext)}
function changecolor(eqname){  //装备颜色
    for (var i = 0 ; i < redword.length ; i++ )eqname = eqname.replace(redword[i],'<span style=\"color:red\">'+redword[i]+'</span>')
    return eqname
}

function stop(){
    var itemname = new Array();
    var delname = new Array();
    function addit(temptext) {itemname = itemname.concat(temptext)}
    function delit(temptext) {delname = delname.concat(temptext)}
    var temp;
	
    if(tempa =document.querySelector("#togpane_log").innerHTML.match(/You gain.*Victorious/))tempa=tempa[0];
	else return
    tempmoney = tempa.match(/\d+ Credits/g)
    if (tempmoney){
        rndmoney=0
        for (var j=0; j<tempmoney.length; j++){
            tmoney=tempmoney[j].match(/\d+/)
            rndmoney+=parseInt(tmoney)
        }
        localStorage.money=rndmoney
        localStorage.moneyt=localStorage.moneyt*1+parseInt(rndmoney)
    }
    else localStorage.money=0
    switch (localStorage.eqsl){
        case '1':
            addit(/[[]Superior[ a-zA-Z-]+]/g);
        case '2':
            addit(/[[]Exquisite[ a-zA-Z-]+]/g);
        case '3':
            addit(/[[]Magnificent[ a-zA-Z-]+]/g);
        case '4':
            addit(/[[]Legendary[ a-zA-Z-]+]/g);
        default:
            addit(/[[]Peerless[ a-zA-Z-]+]/g);
        break;
    }
    for (var i=0; i<itemname.length; i++){
        temp = tempa.match(itemname[i])
        if (temp!=null){
            for (var j=0; j<temp.length; j++){
                // if(localStorage.eqt3=='false'||temp[j].match(/(Elixir|Wakizashi|Katana|Katalox|Phase|Shade|Power|Tower Shield)/))
                if (temp[j].match(/Peerless/)){alert('掉落了'+temp[j]+"好幸运!!!");delaytime+=100000}
                delzhuangbei=0
                for(var k=0; k<delname.length; k++){
                    if(temp[j].match(delname[k])){delzhuangbei=1;break;}
                }
                //alert(delzhuangbei)
                if(delzhuangbei==1)continue;
                temp[j] = changecolor(temp[j])
                localStorage.item+='<br>'+temp[j];
                delaytime+=3000
            }
        }
    }
	if(temp=tempa.match(/Unlocked innate potential: [^0-9]+\d/g)){
		for(x in temp)localStorage.iwmessage+="<br>"+temp[x].match(/: ([^0-9]+\d)/)[1]
	}

//水晶掉落
    localStorage.shuijinghuode=0
	var reg=new RegExp('[0-9]+x Crystal',"g");
	temp=tempa.match(reg)
	if(temp){
		cryno=0;
		for(j=0;j<temp.length;j++){
			temp1=temp[j].match(/[0-9]+/)
			cryno=cryno*1+temp1*1
		}
		localStorage.shuijingshuliang=localStorage.shuijingshuliang*1+cryno*1;
		localStorage.shuijinghuode=cryno;
	}
	localStorage.itemlistpan=""
    var itemname = itemseek();
    for (i=0; i<itemname.length; i++){
    	 	try
        {
    	temp = patt1=new RegExp(itemname[i],"g");
        temp = tempa.match(temp)

        if (itemlistname[i]) {name=itemlistname[i]}  //显示名称
        else name=itemname[i]

        if (temp==null){
	        localStorage.itemlistpan+=name+":"+localStorage[itemname[i]]+"<br>";
	        continue
        };
        if (localStorage[itemname[i]]) {localStorage[itemname[i]]=localStorage[itemname[i]]*1+temp.length*1}
        else localStorage[itemname[i]]=temp.length*1
        localStorage.itemlistpan+=name+":"+localStorage[itemname[i]]+"<br>";
        		}
        	catch(e){}


    }

}



function paneapper(){
    if (temp=document.getElementById('itemlist'))	showjcpane.style.display = "block";
    else{
        showsetting = document.createElement("span");
        showsetting.style.cssText = "z-index:201;font-size:15px ;text-align:middle;color:;text-align:certern; background : lightblue;cursor:pointer";
        showsetting.innerHTML = "品质设置<br>"
        showsetting.onmouseover=function(){showsetting.style.background = "blue"}
        showsetting.onmouseout=function(){showsetting.style.background = "lightblue"}
        showsetting.onclick = ileadyou
        rightpan.appendChild(showsetting)
        showsetting2 = document.createElement("span");
        showsetting2.style.cssText = "z-index:201;font-size:15px;text-align:middle;color:; background : lightgreen;cursor:pointer";
        showsetting2.innerHTML = "耐久设置"
        showsetting2.onmouseover =function(){showsetting2.style.background = "green"}
        showsetting2.onmouseout=function(){showsetting2.style.background = "lightgreen"}
        showsetting2.onclick = setnaijiu
        rightpan.appendChild(showsetting2)
        showjcpane = document.createElement("div");
        showjcpane.style.cssText = "z-index:200;font-size:15px;color:black; position:absolute; top:0px; left:530px;width:500px";

        itemtype = document.createElement("span");
        itemtype.setAttribute('id','itemjc')
    	itemtype.innerHTML="道具检测<br>"+localStorage.itemlistpan+
               '<br>选错日志（最近三次）：<br>'+localStorage.jingli1+localStorage.jingli2+localStorage.jingli3+"<br>IW信息"+localStorage.iwmessage
        itemtype.style.cssText = "z-index:200;font-size:15px;position:absolute; top:0px; left:130px  ;text-align:left; width: 200px; min-height: 50px;"+itemcolor+itemfont;
        itemtype.onmouseout = panedisapp
        showjcpane.appendChild(itemtype)
        localStorage.itemo=localStorage.item
        
        templist = document.createElement("span");
        templist.setAttribute('id','itemlist')
        templist.innerHTML=localStorage.item
        templist.onmouseout = panedisapp
        templist.onclick = qingchu
        templist.style.cssText = "z-index:200;font-size:15px; position:absolute; top:0px; left:330px  ;text-align:left; min-width: 380px; min-height: 200px;"+equipcolor+equipfont;     
        showjcpane.appendChild(templist)
        document.body.appendChild(showjcpane)
    }
}
function panedisapp(){if(temp=document.getElementById('itemlist'))showjcpane.style.display = "none";}
function setnaijiu(){
    alert("接下来请输入数字，否则脚本不能正常工作")
    localStorage.xiaohaolv=prompt("请输入消耗每点耐久需要杀的怪物\n参考：200lv以上200,100-200lv为400，0-100为0\n如果拥有park，请自己计算",200);
    //localStorage.jinggaoyuvi=prompt("剩余怪物的数量，如果装备耐久小于该数量，那么会在面板显示，进行警告",1000);
}


function ileadyou(){
    var i=1;
    while(i==1){
        localStorage.eqsl=prompt("装备品质检测:\n1:Sup及以上;\n2:EX及以上;\n3:Mag及以上;\n4:Leg及以上。\nPeerless级别必定暂停\n请输入：1-4",localStorage.eqsl);
        if(localStorage.eqsl>=0&&localStorage.eqsl<=4){
            switch (localStorage.eqsl){
                case '1':
                localStorage.qtext='S+'
                break
                case '2':
                localStorage.qtext='E+'
                break
                case '3':
                localStorage.qtext='M+'
                break
                case '4':
                localStorage.qtext='L+'
                break
                default:
            }
            i=0;
        }
        else alert('你输入的不对!');	
    }
} 