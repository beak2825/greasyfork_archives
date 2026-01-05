// ==UserScript==
// @name       sweet
// @namespace  http://blog.eclosionstudio.com
// @version     201.1
// @description  改以eddie32前輩製作的『绯月表情增强插件 2.82v6版』作為插件基礎，將原先插件內的Pisuke&Rabbit主題貼圖刪去。增加了Rabbo the Muscle Rabbit貼圖。
// @icon        http://nekohand.moe/favicon.ico
// @homepage    https://greasyfork.org/zh-CN/scripts/5124-%E7%BB%AF%E6%9C%88%E8%A1%A8%E6%83%85%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6
// @match       http://*.2dkf.com/read.php?*
// @copyright  2014-2015, eddie32
// @grant       none
// @license     MIT
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/9047/sweet.user.js
// @updateURL https://update.greasyfork.org/scripts/9047/sweet.meta.js
// ==/UserScript==

/* 自定义内容*/

// 功能栏标题

var ItemTitleArray = new Array('字','企鵝','雜','EnemyAppear','muscles','RM','sorry');
// 链接ID, 对应, 100101开始的整数。
var loadTitleArray = [];
var ItemLength = ItemTitleArray.length;
//for(var j=0; j<ItemLength;j++){
  // loadTitleArray[j] = 100101 + j;
//}

var loadTitleArray = new Array(100101, 100102, 100103, 100104, 100105, 100106);
                              
//不显示的元素位置
var itemDoNotShow =[];
var user=getCookie("setup");
//alert(user);
var itemDoNotShow = new Array();
if (user != ""){
    // alert(user.split(','));
    itemDoNotShow = user.split(',');
   // alert(itemDoNotShow);
    if(itemDoNotShow.length>0){
        for(var j=0; j<itemDoNotShow.length;j++){
            ItemTitleArray[itemDoNotShow[j]] = undefined;
            loadTitleArray[itemDoNotShow[j]] = undefined;
        }
    }
}



var totalNum = ItemTitleArray.length; // 功能栏数量
var textareas, textarea;
var emptyContainer;
var startPos, endPos; // 当前光标位置定位


/************************** 内置表情 *******************/

//字
var emotionArray = Array("信仰把成长经验缩水200倍，然后重新计算等级，并根据新等级计算福利工资，目的很简单──Q:『信仰，我想吃劳保』A:『吃你MB,起来HIGH』","“信仰，我想吃劳保” “吃你MB,起来HIGH”");




//企鵝們
var Pen1 = ['http://up.twblog.org/image.php?di=6N5Z'];
var Pen1Title = [];
var Pen2 = ['http://up.twblog.org/image.php?di=N1WM'];
var Pen2Title = [];
var Pen3 = ['http://up.twblog.org/image.php?di=HFQF'];
var Pen3Title = [];
var Pen4= ['http://up.twblog.org/image.php?di=SPOW'];
var Pen4Title = [];
var Pen5 = ['http://up.twblog.org/image.php?di=8NCO'];
var Pen5Title = [];
var Pen6 = ['http://up.twblog.org/image.php?di=O9CQ'];
var Pen6Title = [];
var Pen7 = ['http://up.twblog.org/image.php?di=JKJG'];
var Pen7Title = [];
var Pen8 = ['http://up.twblog.org/image.php?di=60JH'];
var Pen8Title = [];
var Pen9 = ['http://up.twblog.org/image.php?di=SLJH'];
var Pen9Title = [];
var Pen10 = ['http://up.twblog.org/image.php?di=G83L'];
var Pen10Title = [];
var Pen11 = ['http://up.twblog.org/image.php?di=J42G'];
var Pen11Title = [];
var Pen12 = ['http://up.twblog.org/image.php?di=4Y0G'];
var Pen12Title = [];
var Pen13 = ['http://up.twblog.org/image.php?di=E7LN'];
var Pen13Title = [];
var Pen14 = ['http://up.twblog.org/image.php?di=ZLTY'];
var Pen14Title = [];
var Pen15 = ['http://up.twblog.org/image.php?di=7ZLJ'];
var Pen15Title = [];
var Pen16 = ['http://up.twblog.org/image.php?di=5H1J'];
var Pen16Title = [];
var Pen17 = ['http://up.twblog.org/image.php?di=SXWD'];
var Pen17Title = [];
var Pen18 = ['http://up.twblog.org/image.php?di=LVNG'];
var Pen18Title = [];
var Pen19 = ['http://up.twblog.org/image.php?di=8ZRK'];
var Pen19Title = [];
var Pen20 = ['http://up.twblog.org/image.php?di=PSA4'];
var Pen20Title = [];
var Pen21 = ['http://up.twblog.org/image.php?di=BCOE'];
var Pen21Title = [];
var Pen22 = ['http://up.twblog.org/image.php?di=YXKB'];
var Pen22Title = [];
var Pen23 = ['http://up.twblog.org/image.php?di=0HX1'];
var Pen23Title = [];
var Pen24 = ['http://up.twblog.org/image.php?di=D4DQ'];
var Pen24Title = [];
var Pen25 = ['http://up.twblog.org/image.php?di=V29Q'];
var Pen25Title = [];
var Pen26 = ['http://up.twblog.org/image.php?di=6NOE'];
var Pen26Title = [];
var Pen27 = ['http://up.twblog.org/image.php?di=4T46'];
var Pen27Title = [];
var Pen28 = ['http://up.twblog.org/image.php?di=U6KY'];
var Pen28Title = [];
var Pen29 = ['http://up.twblog.org/image.php?di=OFJK'];
var Pen29Title = [];
var Pen30 = ['http://up.twblog.org/image.php?di=WHLE'];
var Pen30Title = [];
var Pen31 = ['http://up.twblog.org/image.php?di=HKCS'];
var Pen31Title = [];
var Pen32 = ['http://up.twblog.org/image.php?di=DNXJ'];
var Pen32Title = [];
var Pen33 = ['http://up.twblog.org/image.php?di=OGHW'];
var Pen33Title = [];
var Pen34 = ['http://up.twblog.org/image.php?di=U3C3'];
var Pen34Title = [];
var Pen35 = ['http://up.twblog.org/image.php?di=KC9S'];
var Pen35Title = [];
var Pen36 = ['http://up.twblog.org/image.php?di=GEQ7'];
var Pen36Title = [];
var Pen37 = ['http://up.twblog.org/image.php?di=C54X'];
var Pen37Title = [];


//雜
var Zha1 = ['http://up.twblog.org/image.php?di=84IL'];
var Zha1Title = [];
var Zha2 = ['http://up.twblog.org/image.php?di=XZVK'];
var Zha2Title = [];
var Zha3 = ['http://up.twblog.org/image.php?di=YV3X'];
var Zha3Title = [];
var Zha4 = ['http://up.twblog.org/image.php?di=57TU'];
var Zha4Title = [];
var Zha5 = ['http://www.iforce.co.nz/i/ke0llruw.12h.gif'];
var Zha5Title = [];
var Zha6 = ['http://iforce.co.nz/i/bwa2zojl.rkv.gif'];
var Zha6Title = [];
var Zha6 = ['http://iforce.co.nz/i/bwa2zojl.rkv.gif'];
var Zha6Title = [];
var Zha7 = ['http://www.iforce.co.nz/i/txjedkkv.2kf.png'];
var Zha7Title = [];

//EnemyAppear
var EnemyAppear1 = ['http://iforce.co.nz/i/rw4kxlzm.fxr.png'];
var EnemyAppear1Title = [];
var EnemyAppear2 = ['http://iforce.co.nz/i/vjmwpgwj.qwc.png'];
var EnemyAppear2Title = [];
var EnemyAppear3 = ['http://iforce.co.nz/i/0snqqsxy.alc.png'];
var EnemyAppear3Title = [];
var EnemyAppear4 = ['http://iforce.co.nz/i/icb3zzun.q3b.png'];
var EnemyAppear4Title = [];
var EnemyAppear5 = ['http://iforce.co.nz/i/nkoarho0.no2.png'];
var EnemyAppear5Title = [];
var EnemyAppear6 = ['http://iforce.co.nz/i/4obupbpw.kcp.png'];
var EnemyAppear6Title = [];
var EnemyAppear7 = ['http://iforce.co.nz/i/jbzq55tn.h2w.png'];
var EnemyAppear7Title = [];
var EnemyAppear8 = ['http://iforce.co.nz/i/zym2tmxh.seh.png'];
var EnemyAppear8Title = [];
var EnemyAppear9 = ['http://iforce.co.nz/i/fb0ssdaf.04l.png'];
var EnemyAppear9Title = [];
var EnemyAppear10 = ['http://iforce.co.nz/i/iisd0u2p.mbi.png'];
var EnemyAppear10Title = [];
var EnemyAppear11 = ['http://iforce.co.nz/i/yzxz3uua.yk3.png'];
var EnemyAppear11Title = [];
var EnemyAppear12 = ['http://iforce.co.nz/i/fg134u0j.tdd.png'];
var EnemyAppear12Title = [];
var EnemyAppear13 = ['http://iforce.co.nz/i/utptzl0i.zjf.png'];
var EnemyAppear13Title = [];
var EnemyAppear14 = ['http://iforce.co.nz/i/5yfqouwe.wa0.png'];
var EnemyAppear14Title = [];
var EnemyAppear15 = ['http://iforce.co.nz/i/chykmbk3.xgw.png'];
var EnemyAppear15Title = [];
var EnemyAppear16 = ['http://iforce.co.nz/i/31zljzpe.ijz.png'];
var EnemyAppear16Title = [];
var EnemyAppear17 = ['http://iforce.co.nz/i/p2d5pvfs.4d3.png'];
var EnemyAppear17Title = [];
var EnemyAppear18 = ['http://iforce.co.nz/i/rxfal0jz.vfs.png'];
var EnemyAppear18Title = [];
var EnemyAppear19 = ['http://iforce.co.nz/i/enoojiup.5b3.png'];
var EnemyAppear19Title = [];
var EnemyAppear20 = ['http://iforce.co.nz/i/s4ajjloh.ylp.png'];
var EnemyAppear20Title = [];
var EnemyAppear21 = ['http://iforce.co.nz/i/fognucu4.mj5.png'];
var EnemyAppear21Title = [];
var EnemyAppear22 = ['http://iforce.co.nz/i/2y2imxqe.jww.png'];
var EnemyAppear22Title = [];
var EnemyAppear23 = ['http://iforce.co.nz/i/wpkvu3g0.wn4.png'];
var EnemyAppear23Title = [];
var EnemyAppear24 = ['http://iforce.co.nz/i/jjmsl2eq.lbz.png'];
var EnemyAppear24Title = [];
var EnemyAppear25 = ['http://iforce.co.nz/i/bron3adq.rmf.png'];
var EnemyAppear25Title = [];
var EnemyAppear26 = ['http://iforce.co.nz/i/wmigbki1.xa3.png'];
var EnemyAppear26Title = [];
var EnemyAppear27 = ['http://iforce.co.nz/i/e33htd2k.1ww.png'];
var EnemyAppear27Title = [];
var EnemyAppear28 = ['http://iforce.co.nz/i/yq3dfhgi.lha.png'];
var EnemyAppear28Title = [];
var EnemyAppear29 = ['http://iforce.co.nz/i/szxgfp5e.lv4.png'];
var EnemyAppear29Title = [];
var EnemyAppear30 = ['http://iforce.co.nz/i/go3zanot.lw5.png'];
var EnemyAppear30Title = [];
var EnemyAppear31 = ['http://iforce.co.nz/i/uehmwrgj.apq.png'];
var EnemyAppear31Title = [];
var EnemyAppear32 = ['http://iforce.co.nz/i/4krbrydr.jqa.png'];
var EnemyAppear32Title = [];
var EnemyAppear33 = ['http://iforce.co.nz/i/zxwepk4y.rdd.png'];
var EnemyAppear33Title = [];
var EnemyAppear34 = ['http://iforce.co.nz/i/chygf3xc.svu.png'];
var EnemyAppear34Title = [];
var EnemyAppear35 = ['http://iforce.co.nz/i/e14b55s2.ic4.png'];
var EnemyAppear35Title = [];
var EnemyAppear36 = ['http://iforce.co.nz/i/ad1kdx0v.xwk.png'];
var EnemyAppear36Title = [];
var EnemyAppear37 = ['http://iforce.co.nz/i/rznd0cgx.d1x.png'];
var EnemyAppear37Title = [];
var EnemyAppear38 = ['http://iforce.co.nz/i/jgwqh2yp.eee.png'];
var EnemyAppear38Title = [];
var EnemyAppear39 = ['http://iforce.co.nz/i/zchlvs1u.iaq.png'];
var EnemyAppear39Title = [];
var EnemyAppear40 = ['http://iforce.co.nz/i/npirw4bm.mie.png'];
var EnemyAppear40Title = [];

//The muscles of lovely animals
var Tmola1 = ['http://iforce.co.nz/i/uzqydxan.rwz.png'];
var Tmola1Title = [];
var Tmola2 = ['http://iforce.co.nz/i/jjjxfslo.5ll.png'];
var Tmola2Title = [];
var Tmola3 = ['http://iforce.co.nz/i/x013ujdw.if5.png'];
var Tmola3Title = [];
var Tmola4 = ['http://iforce.co.nz/i/lmvo3kif.ldn.png'];
var Tmola4Title = [];
var Tmola5 = ['http://iforce.co.nz/i/fu5b1xol.fvl.png'];
var Tmola5Title = [];
var Tmola6 = ['http://iforce.co.nz/i/sqmogklv.dhu.png'];
var Tmola6Title = [];
var Tmola7 = ['http://iforce.co.nz/i/kyj50ebt.fvf.png'];
var Tmola7Title = [];
var Tmola8 = ['http://iforce.co.nz/i/4yyx5gnr.ahn.png'];
var Tmola8Title = [];
var Tmola9 = ['http://iforce.co.nz/i/ojcxmlyq.3uh.png'];
var Tmola9Title = [];
var Tmola10 = ['http://iforce.co.nz/i/2eorztrb.ylw.png'];
var Tmola10Title = [];
var Tmola11 = ['http://iforce.co.nz/i/o4okbvhd.ugp.png'];
var Tmola11Title = [];
var Tmola12 = ['http://iforce.co.nz/i/3zfoxfpp.fiu.png'];
var Tmola12Title = [];
var Tmola13 = ['http://iforce.co.nz/i/ajkz1cvo.qd2.png'];
var Tmola13Title = [];
var Tmola14 = ['http://iforce.co.nz/i/yf3suuys.yby.png'];
var Tmola14Title = [];
var Tmola15 = ['http://iforce.co.nz/i/wyb0tje3.dv3.png'];
var Tmola15Title = [];
var Tmola16 = ['http://iforce.co.nz/i/osr4l053.r4c.png'];
var Tmola16Title = [];
var Tmola17 = ['http://iforce.co.nz/i/zzdtuwf2.z5v.png'];
var Tmola17Title = [];
var Tmola18 = ['http://iforce.co.nz/i/yrlbkh5v.4zx.png'];
var Tmola18Title = [];
var Tmola19 = ['http://iforce.co.nz/i/wccg2jeh.2ey.png'];
var Tmola19Title = [];
var Tmola20 = ['http://iforce.co.nz/i/zxsd0flo.5ap.png'];
var Tmola20Title = [];
var Tmola21 = ['http://iforce.co.nz/i/hpf1ts3f.awt.png'];
var Tmola21Title = [];
var Tmola22 = ['http://iforce.co.nz/i/afn0c320.24q.png'];
var Tmola22Title = [];
var Tmola23 = ['http://iforce.co.nz/i/jbaykwbm.1by.png'];
var Tmola23Title = [];
var Tmola24 = ['http://iforce.co.nz/i/g2zjhxvf.0n0.png'];
var Tmola24Title = [];
var Tmola25 = ['http://iforce.co.nz/i/1g3ht3vp.poc.png'];
var Tmola25Title = [];
var Tmola26 = ['http://iforce.co.nz/i/2on2xsli.isz.png'];
var Tmola26Title = [];
var Tmola27 = ['http://iforce.co.nz/i/g4uy13aw.i4g.png'];
var Tmola27Title = [];
var Tmola28 = ['http://iforce.co.nz/i/tijcnj41.zd3.png'];
var Tmola28Title = [];
var Tmola29 = ['http://iforce.co.nz/i/jfw0bv0f.v32.png'];
var Tmola29Title = [];
var Tmola30 = ['http://iforce.co.nz/i/2q3gfjnn.ac2.png'];
var Tmola30Title = [];
var Tmola31 = ['http://iforce.co.nz/i/0ncuc2h2.idg.png'];
var Tmola31Title = [];
var Tmola32 = ['http://iforce.co.nz/i/xyvcgzrs.hq4.png'];
var Tmola32Title = [];
var Tmola33 = ['http://iforce.co.nz/i/3tp2szvr.o04.png'];
var Tmola33Title = [];
var Tmola34 = ['http://iforce.co.nz/i/2keify0x.pm0.png'];
var Tmola34Title = [];
var Tmola35 = ['http://iforce.co.nz/i/mqmhxpiu.wir.png'];
var Tmola35Title = [];
var Tmola36 = ['http://iforce.co.nz/i/km0asv0r.ber.png'];
var Tmola36Title = [];
var Tmola37 = ['http://iforce.co.nz/i/syua4ulo.k5p.png'];
var Tmola37Title = [];
var Tmola38 = ['http://iforce.co.nz/i/r13mo4pw.pun.png'];
var Tmola38Title = [];
var Tmola39 = ['http://iforce.co.nz/i/wkvys1ph.d3l.png'];
var Tmola39Title = [];
var Tmola40 = ['http://iforce.co.nz/i/doikz0jx.dfh.png'];
var Tmola40Title = [];
//Muscle Sticker
var MS1 = ['http://iforce.co.nz/i/11vkcacz.wuc.png'];
var MS1Title = [];
var MS2 = ['http://iforce.co.nz/i/bomcbtxt.3km.png'];
var MS2Title = [];
var MS3 = ['http://iforce.co.nz/i/ma0tc3m1.rdi.png'];
var MS3Title = [];
var MS4 = ['http://iforce.co.nz/i/0por1mxu.evi.png'];
var MS4Title = [];
var MS5 = ['http://iforce.co.nz/i/qzkmfrjh.ati.png'];
var MS5Title = [];
var MS6 = ['http://iforce.co.nz/i/cpdk2mpu.dkh.png'];
var MS6Title = [];
var MS7 = ['http://iforce.co.nz/i/qhen2kpt.b2b.png'];
var MS7Title = [];
var MS8 = ['http://iforce.co.nz/i/ufovn4gx.ln4.png'];
var MS8Title = [];
var MS9 = ['http://iforce.co.nz/i/4bt5bz4j.d12.png'];
var MS9Title = [];
var MS10 = ['http://iforce.co.nz/i/g5le0l44.kba.png'];
var MS10Title = [];
var MS11 = ['http://iforce.co.nz/i/sb5v1ipe.m2r.png'];
var MS11Title = [];
var MS12 = ['http://iforce.co.nz/i/ccqdmpnn.fka.png'];
var MS12Title = [];
var MS13 = ['http://iforce.co.nz/i/lsscfa4g.zjj.png'];
var MS13Title = [];
var MS14 = ['http://iforce.co.nz/i/1u52le5g.ftc.png'];
var MS14Title = [];
var MS15 = ['http://iforce.co.nz/i/prezji5t.h2v.png'];
var MS15Title = [];
var MS16 = ['http://iforce.co.nz/i/zugouvi2.dgi.png'];
var MS16Title = [];
var MS17 = ['http://iforce.co.nz/i/ylqex4oc.hre.png'];
var MS17Title = [];
var MS18 = ['http://iforce.co.nz/i/yx11w2jh.ai2.png'];
var MS18Title = [];
var MS19 = ['http://iforce.co.nz/i/3lwhf00l.qew.png'];
var MS19Title = [];
var MS20 = ['http://iforce.co.nz/i/4gry0zzv.xqz.png'];
var MS20Title = [];
var MS21 = ['http://iforce.co.nz/i/xwnxuse4.5ts.png'];
var MS21Title = [];
var MS22 = ['http://iforce.co.nz/i/fcezb3qb.e3m.png'];
var MS22Title = [];
var MS23 = ['http://iforce.co.nz/i/4wefddry.f0n.png'];
var MS23Title = [];
var MS24 = ['http://iforce.co.nz/i/inuvuk01.eug.png'];
var MS24Title = [];
var MS25 = ['http://iforce.co.nz/i/dqjakahq.ijh.png'];
var MS25Title = [];
var MS26 = ['http://iforce.co.nz/i/4outgfpr.f1g.png'];
var MS26Title = [];
var MS27 = ['http://iforce.co.nz/i/omiaczia.zsr.png'];
var MS27Title = [];
var MS28 = ['http://iforce.co.nz/i/tqrznkft.o44.png'];
var MS28Title = [];
var MS29 = ['http://iforce.co.nz/i/124jlhi3.k3h.png'];
var MS29Title = [];
var MS30 = ['http://iforce.co.nz/i/xrnb2juw.wv2.png'];
var MS30Title = [];
var MS31 = ['http://iforce.co.nz/i/jesklud5.fpd.png'];
var MS31Title = [];
var MS32 = ['http://iforce.co.nz/i/mjk41dx5.mry.png'];
var MS32Title = [];
var MS33 = ['http://iforce.co.nz/i/a2gf5vn2.b0g.png'];
var MS33Title = [];
var MS34 = ['http://iforce.co.nz/i/wcd3qogx.ngl.png'];
var MS34Title = [];
var MS35 = ['http://iforce.co.nz/i/p4rgwit1.nki.png'];
var MS35Title = [];
var MS36 = ['http://iforce.co.nz/i/wvj4vnam.vpy.png'];
var MS36Title = [];
var MS37 = ['http://iforce.co.nz/i/mdwph234.ozn.png'];
var MS37Title = [];
var MS38 = ['http://iforce.co.nz/i/02yczics.pi1.png'];
var MS38Title = [];
var MS39 = ['http://iforce.co.nz/i/pmr1tvpe.qna.png'];
var MS39Title = [];
var MS40 = ['http://iforce.co.nz/i/oq0rck2w.lyj.png'];
var MS40Title = [];


//RM
var RM_1 = ['http://i4.imgbus.com/doimg/6syu2rae0e7092.png'];
var RM_1Title = [];
var RM_2 = ['http://i3.imgbus.com/doimg/4syuerab3533d2.png'];
var RM_2Title = [];
var RM_3 = ['http://i3.imgbus.com/doimg/5sy9ur1a52e0b4.png'];
var RM_3Title = [];
var RM_4 = ['http://i4.imgbus.com/doimg/dseydu4r5a4d10.png'];
var RM_4Title = [];
var RM_5 = ['http://i4.imgbus.com/doimg/7sy6ur2adda384.png'];
var RM_5Title = [];
var RM_6 = ['http://i4.imgbus.com/doimg/5s8yau1r6a4243.png'];
var RM_6Title = [];
var RM_7 = ['http://i2.imgbus.com/doimg/csyaur9a1a18f7.png'];
var RM_7Title = [];
var RM_8 = ['http://i3.imgbus.com/doimg/5syfurcadaafd1.png'];
var RM_8Title = [];
var RM_9 = ['http://i4.imgbus.com/doimg/4s5y4ubr0ae6f9.png'];
var RM_9Title = [];
var RM_10 = ['http://i3.imgbus.com/doimg/6sby8u5r2a1789.png'];
var RM_10Title = [];
var RM_11 = ['http://i3.imgbus.com/doimg/7s6y2u0rea0079.png'];
var RM_11Title = [];
var RM_12 = ['http://i2.imgbus.com/doimg/7s2ycu8r7ae459.png'];
var RM_12Title = [];
var RM_13 = ['http://i1.imgbus.com/doimg/3sy2ur0a161494.png'];
var RM_13Title = [];
var RM_14 = ['http://i1.imgbus.com/doimg/ds4yeufr0a57a9.png'];
var RM_14Title = [];
var RM_15 = ['http://i4.imgbus.com/doimg/5say4u4raa8670.png'];
var RM_15Title = [];
var RM_16 = ['http://i2.imgbus.com/doimg/dsyu8raf4a2de8.png'];
var RM_16Title = [];
var RM_17 = ['http://i3.imgbus.com/doimg/bsy2ur1af20987.png'];
var RM_17Title = [];
var RM_18 = ['http://i3.imgbus.com/doimg/5s9y5u0r7abde0.png'];
var RM_18Title = [];
var RM_19 = ['http://i1.imgbus.com/doimg/dsy3ur9a3a87e1.png'];
var RM_19Title = [];
var RM_20 = ['http://i4.imgbus.com/doimg/fsy5ureab9ecd1.png'];
var RM_20Title = [];
var RM_21 = ['http://i1.imgbus.com/doimg/1sfyduer8a42a9.png'];
var RM_21Title = [];
var RM_22 = ['http://i1.imgbus.com/doimg/3syucraafe2a22.png'];
var RM_22Title = [];
var RM_23 = ['http://i3.imgbus.com/doimg/0s0y2u6r4a3356.png'];
var RM_23Title = [];
var RM_24 = ['http://i1.imgbus.com/doimg/2say4u6r9a43d6.png'];
var RM_24Title = [];
var RM_25 = ['http://i4.imgbus.com/doimg/9sy8ur8aa7aa87.png'];
var RM_25Title = [];
var RM_26 = ['http://i2.imgbus.com/doimg/1syufra7f955b8.png'];
var RM_26Title = [];
var RM_27 = ['http://i1.imgbus.com/doimg/7sy5ur9a078fb7.png'];
var RM_27Title = [];
var RM_28 = ['http://i2.imgbus.com/doimg/2s5yeu8rcad473.png'];
var RM_28Title = [];
var RM_29 = ['http://i2.imgbus.com/doimg/2sy9urda008911.png'];
var RM_29Title = [];
var RM_30 = ['http://i4.imgbus.com/doimg/3sy1ur6a667597.png'];
var RM_30Title = [];
var RM_31 = ['http://i4.imgbus.com/doimg/2scy2u6r2ab639.png'];
var RM_31Title = [];
var RM_32 = ['http://i4.imgbus.com/doimg/ds4ybu2reac3b3.png'];
var RM_32Title = [];
var RM_33 = ['http://i1.imgbus.com/doimg/9syu4raba6e402.png'];
var RM_33Title = [];
var RM_34 = ['http://i4.imgbus.com/doimg/asy4ureaca22d4.png'];
var RM_34Title = [];
var RM_35 = ['http://i1.imgbus.com/doimg/3sy6ur5a155fb7.png'];
var RM_35Title = [];
var RM_36 = ['http://i2.imgbus.com/doimg/esyueraed09f92.png'];
var RM_36Title = [];
var RM_37 = ['http://i2.imgbus.com/doimg/1sy9ur8a8a5061.png'];
var RM_37Title = [];
var RM_38 = ['http://i2.imgbus.com/doimg/0s9y7ufr6a8f76.png'];
var RM_38Title = [];
var RM_39 = ['http://i2.imgbus.com/doimg/1syu0rad0ddce8.png'];
var RM_39Title = [];
var RM_40 = ['http://i4.imgbus.com/doimg/cs0y4uerca02a3.png'];
var RM_40Title = [];



//BATTLE COUPLE!!
var BC1 = ['http://iforce.co.nz/i/dh1r53ra.1nc.png'];
var BC1Title = [];
var BC2 = ['http://iforce.co.nz/i/ujypr2oe.3qq.png'];
var BC2Title = [];
var BC3 = ['http://iforce.co.nz/i/rvdiwwjy.xqn.png'];
var BC3Title = [];
var BC4 = ['http://iforce.co.nz/i/lfik2f0o.oui.png'];
var BC4Title = [];
var BC5 = ['http://iforce.co.nz/i/gv5ajgtd.ksf.png'];
var BC5Title = [];
var BC6 = ['http://iforce.co.nz/i/5jplb4q5.jqf.png'];
var BC6Title = [];
var BC7 = ['http://iforce.co.nz/i/jamanavl.1q5.png'];
var BC7Title = [];
var BC8 = ['http://iforce.co.nz/i/0ijecttj.ize.png'];
var BC8Title = [];
var BC9 = ['http://iforce.co.nz/i/4hyf2h5x.4ug.png'];
var BC9Title = [];
var BC10 = ['http://iforce.co.nz/i/ijrexsef.1gc.png'];
var BC10Title = [];
var BC11 = ['http://iforce.co.nz/i/p52ivnb5.anp.png'];
var BC11Title = [];
var BC12 = ['http://iforce.co.nz/i/cn4yw4ja.nkr.png'];
var BC12Title = [];
var BC13 = ['http://iforce.co.nz/i/mf1eswit.oec.png'];
var BC13Title = [];
var BC14 = ['http://iforce.co.nz/i/cfyfljxe.x2y.png'];
var BC14Title = [];
var BC15 = ['http://iforce.co.nz/i/weybgail.j2n.png'];
var BC15Title = [];
var BC16 = ['http://iforce.co.nz/i/5g4gvt5a.fkt.png'];
var BC16Title = [];
var BC17 = ['http://iforce.co.nz/i/hyygfhca.2fp.png'];
var BC17Title = [];
var BC18 = ['http://iforce.co.nz/i/3vnd1bnc.sxw.png'];
var BC18Title = [];
var BC19 = ['http://iforce.co.nz/i/1szkyft3.tvv.png'];
var BC19Title = [];
var BC20 = ['http://iforce.co.nz/i/4lb0sdtq.kzg.png'];
var BC20Title = [];
var BC21 = ['http://iforce.co.nz/i/n1rfcoma.ksc.png'];
var BC21Title = [];
var BC22 = ['http://iforce.co.nz/i/nrk11iol.3wf.png'];
var BC22Title = [];
var BC23 = ['http://iforce.co.nz/i/llww4o4f.rb1.png'];
var BC23Title = [];
var BC24 = ['http://iforce.co.nz/i/i45u4tje.wuu.png'];
var BC24Title = [];
var BC25 = ['http://iforce.co.nz/i/ukzvtwac.dv0.png'];
var BC25Title = [];
var BC26 = ['http://iforce.co.nz/i/3u3v355b.5np.png'];
var BC26Title = [];
var BC27 = ['http://iforce.co.nz/i/4xdfsmlw.f4t.png'];
var BC27Title = [];
var BC28 = ['http://iforce.co.nz/i/aczifl2z.e52.png'];
var BC28Title = [];
var BC29 = ['http://iforce.co.nz/i/empgu4ek.evq.png'];
var BC29Title = [];
var BC30 = ['http://iforce.co.nz/i/ovbwmlcr.tqm.png'];
var BC30Title = [];
var BC31 = ['http://iforce.co.nz/i/ixu1cuuc.fdj.png'];
var BC31Title = [];
var BC32 = ['http://iforce.co.nz/i/nvso132u.jqv.png'];
var BC32Title = [];
var BC33 = ['http://iforce.co.nz/i/hy013ggp.okl.png'];
var BC33Title = [];
var BC34 = ['http://iforce.co.nz/i/iifnls0y.3dr.png'];
var BC34Title = [];
var BC35 = ['http://iforce.co.nz/i/fnwhq0ts.csx.png'];
var BC35Title = [];
var BC36 = ['http://iforce.co.nz/i/icayngll.udg.png'];
var BC36Title = [];
var BC37 = ['http://iforce.co.nz/i/1a3wafz1.3so.png'];
var BC37Title = [];
var BC38 = ['http://iforce.co.nz/i/e2g0lqnp.mtc.png'];
var BC38Title = [];
var BC39 = ['http://iforce.co.nz/i/qe0yuwws.wvs.png'];
var BC39Title = [];
var BC40 = ['http://iforce.co.nz/i/4iwmda42.hkw.png'];
var BC40Title = [];
//Office girl fighting
var Ogf1 = ['http://iforce.co.nz/i/y5d4vty1.0hk.png'];
var Ogf1Title = [];
var Ogf2 = ['http://iforce.co.nz/i/3wkq4msk.00f.png'];
var Ogf2Title = [];
var Ogf3 = ['http://iforce.co.nz/i/yxlpc50s.qml.png'];
var Ogf3Title = [];
var Ogf4 = ['http://iforce.co.nz/i/hrxey0lt.b1t.png'];
var Ogf4Title = [];
var Ogf5 = ['http://iforce.co.nz/i/1i0rlulf.1ak.png'];
var Ogf5Title = [];
var Ogf6 = ['http://iforce.co.nz/i/rwjtpyg2.t0u.png'];
var Ogf6Title = [];
var Ogf7 = ['http://iforce.co.nz/i/5u0xftn4.hz4.png'];
var Ogf7Title = [];
var Ogf8 = ['http://iforce.co.nz/i/mwr2m4l4.j3d.png'];
var Ogf8Title = [];
var Ogf9 = ['http://iforce.co.nz/i/ronj5nym.5wx.png'];
var Ogf9Title = [];
var Ogf10 = ['http://iforce.co.nz/i/tvnnz5cq.wyb.png'];
var Ogf10Title = [];
var Ogf11 = ['http://iforce.co.nz/i/k2uoir05.crl.png'];
var Ogf11Title = [];
var Ogf12 = ['http://iforce.co.nz/i/u315lbwj.fid.png'];
var Ogf12Title = [];
var Ogf13 = ['http://iforce.co.nz/i/h55upgqo.aqr.png'];
var Ogf13Title = [];
var Ogf14 = ['http://iforce.co.nz/i/dwtmu0kv.x1p.png'];
var Ogf14Title = [];
var Ogf15 = ['http://iforce.co.nz/i/0qujjblm.5gf.png'];
var Ogf15Title = [];
var Ogf16 = ['http://iforce.co.nz/i/21ohd2q4.o2l.png'];
var Ogf16Title = [];
var Ogf17 = ['http://iforce.co.nz/i/gc5nzlj1.klj.png'];
var Ogf17Title = [];
var Ogf18 = ['http://iforce.co.nz/i/sqnlvhsh.lca.png'];
var Ogf18Title = [];
var Ogf19 = ['http://iforce.co.nz/i/uoo2bjxg.tko.png'];
var Ogf19Title = [];
var Ogf20 = ['http://iforce.co.nz/i/pvmxv1jx.n24.png'];
var Ogf20Title = [];
var Ogf21 = ['http://iforce.co.nz/i/h0hjfa5a.npn.png'];
var Ogf21Title = [];
var Ogf22 = ['http://iforce.co.nz/i/cl3mmoq4.uzv.png'];
var Ogf22Title = [];
var Ogf23 = ['http://iforce.co.nz/i/swntfgh2.d0i.png'];
var Ogf23Title = [];
var Ogf24 = ['http://iforce.co.nz/i/d5ek5kjg.zfm.png'];
var Ogf24Title = [];
var Ogf25 = ['http://iforce.co.nz/i/vbdhswjh.gqa.png'];
var Ogf25Title = [];
var Ogf26 = ['http://iforce.co.nz/i/t21vgby4.pf4.png'];
var Ogf26Title = [];
var Ogf27 = ['http://iforce.co.nz/i/bf3mkdj0.q1t.png'];
var Ogf27Title = [];
var Ogf28 = ['http://iforce.co.nz/i/fqtpjvn4.25v.png'];
var Ogf28Title = [];
var Ogf29 = ['http://iforce.co.nz/i/fw2kgksh.5ut.png'];
var Ogf29Title = [];
var Ogf30 = ['http://iforce.co.nz/i/nr0ivuzn.tht.png'];
var Ogf30Title = [];
var Ogf31 = ['http://iforce.co.nz/i/nqinhkbf.cqp.png'];
var Ogf31Title = [];
var Ogf32 = ['http://iforce.co.nz/i/0mwpa1ou.rtl.png'];
var Ogf32Title = [];
var Ogf33 = ['http://iforce.co.nz/i/dax5av22.c0o.png'];
var Ogf33Title = [];
var Ogf34 = ['http://iforce.co.nz/i/uckdopik.ppv.png'];
var Ogf34Title = [];
var Ogf35 = ['http://iforce.co.nz/i/wsueyryg.qog.png'];
var Ogf35Title = [];
var Ogf36 = ['http://iforce.co.nz/i/2liewwse.yt0.png'];
var Ogf36Title = [];
var Ogf37 = ['http://iforce.co.nz/i/zhgnv153.zbp.png'];
var Ogf37Title = [];
var Ogf38 = ['http://iforce.co.nz/i/4jvcinej.i4w.png'];
var Ogf38Title = [];
var Ogf39 = ['http://iforce.co.nz/i/ltsc3fkn.smy.png'];
var Ogf39Title = [];
var Ogf40 = ['http://iforce.co.nz/i/f2fd4v4q.yfi.png'];
var Ogf40Title = [];
//DOGEZA
var DOGEZA1 = ['http://iforce.co.nz/i/go1mobod.rhu.png'];
var DOGEZA1Title = [];
var DOGEZA2 = ['http://iforce.co.nz/i/4ho0tfmi.kaj.png'];
var DOGEZA2Title = [];
var DOGEZA3 = ['http://iforce.co.nz/i/mps40wic.3xe.png'];
var DOGEZA3Title = [];
var DOGEZA4 = ['http://iforce.co.nz/i/bwyor0pq.jrh.png'];
var DOGEZA4Title = [];
var DOGEZA5 = ['http://iforce.co.nz/i/veckemzw.1ac.png'];
var DOGEZA5Title = [];
var DOGEZA6 = ['http://iforce.co.nz/i/3ngs3qm0.g1f.png'];
var DOGEZA6Title = [];
var DOGEZA7 = ['http://iforce.co.nz/i/d05nx4uv.bji.png'];
var DOGEZA7Title = [];
var DOGEZA8 = ['http://iforce.co.nz/i/1jorbiop.rgp.png'];
var DOGEZA8Title = [];
var DOGEZA9 = ['http://iforce.co.nz/i/hpyhzlq3.cv3.png'];
var DOGEZA9Title = [];
var DOGEZA10 = ['http://iforce.co.nz/i/sfukpqqe.r51.png'];
var DOGEZA10Title = [];
var DOGEZA11 = ['http://iforce.co.nz/i/mqp2on4t.t55.png'];
var DOGEZA11Title = [];
var DOGEZA12 = ['http://iforce.co.nz/i/5snxflyj.hvq.png'];
var DOGEZA12Title = [];
var DOGEZA13 = ['http://iforce.co.nz/i/e25v23zr.1ar.png'];
var DOGEZA13Title = [];
var DOGEZA14 = ['http://iforce.co.nz/i/aqxnihhk.nd2.png'];
var DOGEZA14Title = [];
var DOGEZA15 = ['http://iforce.co.nz/i/2gvss0cj.dyt.png'];
var DOGEZA15Title = [];
var DOGEZA16 = ['http://iforce.co.nz/i/vcvi1q0s.3tb.png'];
var DOGEZA16Title = [];
var DOGEZA17 = ['http://iforce.co.nz/i/vcal43k2.izv.png'];
var DOGEZA17Title = [];
var DOGEZA18 = ['http://iforce.co.nz/i/skpcohbh.dcs.png'];
var DOGEZA18Title = [];
var DOGEZA19 = ['http://iforce.co.nz/i/un1jvbp5.bp0.png'];
var DOGEZA19Title = [];
var DOGEZA20 = ['http://iforce.co.nz/i/qf3hreev.u2j.png'];
var DOGEZA20Title = [];
var DOGEZA21 = ['http://iforce.co.nz/i/ptoxp12y.c3b.png'];
var DOGEZA21Title = [];
var DOGEZA22 = ['http://iforce.co.nz/i/2o5ve5pu.k4r.png'];
var DOGEZA22Title = [];
var DOGEZA23 = ['http://iforce.co.nz/i/4ylyypy3.ram.png'];
var DOGEZA23Title = [];
var DOGEZA24 = ['http://iforce.co.nz/i/w3rwuxnv.rnk.png'];
var DOGEZA24Title = [];
var DOGEZA25 = ['http://iforce.co.nz/i/4yoviv0h.bg3.png'];
var DOGEZA25Title = [];
var DOGEZA26 = ['http://iforce.co.nz/i/uc2yjf0q.gal.png'];
var DOGEZA26Title = [];
var DOGEZA27 = ['http://iforce.co.nz/i/3hs5fcmp.lvb.png'];
var DOGEZA27Title = [];
var DOGEZA28 = ['http://iforce.co.nz/i/1pfbdgyy.yj1.png'];
var DOGEZA28Title = [];
var DOGEZA29 = ['http://iforce.co.nz/i/hfofanp0.avp.png'];
var DOGEZA29Title = [];
var DOGEZA30 = ['http://iforce.co.nz/i/aguuf1yz.pnh.png'];
var DOGEZA30Title = [];
var DOGEZA31 = ['http://iforce.co.nz/i/042egutx.ea4.png'];
var DOGEZA31Title = [];
var DOGEZA32 = ['http://iforce.co.nz/i/harouho2.xk0.png'];
var DOGEZA32Title = [];
var DOGEZA33 = ['http://iforce.co.nz/i/flbwqoyh.f5w.png'];
var DOGEZA33Title = [];
var DOGEZA34 = ['http://iforce.co.nz/i/xdo0u53o.q15.png'];
var DOGEZA34Title = [];
var DOGEZA35 = ['http://iforce.co.nz/i/cr05lztd.t32.png'];
var DOGEZA35Title = [];
var DOGEZA36 = ['http://iforce.co.nz/i/xkkkpgoi.p3k.png'];
var DOGEZA36Title = [];
var DOGEZA37 = ['http://iforce.co.nz/i/vm0abkns.vux.png'];
var DOGEZA37Title = [];
var DOGEZA38 = ['http://iforce.co.nz/i/oizb2m4f.blj.png'];
var DOGEZA38Title = [];
var DOGEZA39 = ['http://iforce.co.nz/i/u3cpcpa2.0sp.png'];
var DOGEZA39Title = [];
var DOGEZA40 = ['http://iforce.co.nz/i/tw3jtfvb.owp.png'];
var DOGEZA40Title = [];




function loadingHandler(loadindex, target){
    
    switch (loadindex) {
        
		
		case 1:
//企鵝們
            userInputImg(target, Pen1, Pen1, Pen1Title, returnImg, 40, 40);
            userInputImg(target, Pen2, Pen2, Pen2Title, returnImg, 40, 40);
            userInputImg(target, Pen3, Pen3, Pen3Title, returnImg, 40, 40);
            userInputImg(target, Pen4, Pen4, Pen4Title, returnImg, 40, 40);
            userInputImg(target, Pen5, Pen5, Pen5Title, returnImg, 40, 40);
            userInputImg(target, Pen6, Pen6, Pen6Title, returnImg, 40, 40);
            userInputImg(target, Pen7, Pen7, Pen7Title, returnImg, 40, 40);
            userInputImg(target, Pen8, Pen8, Pen8Title, returnImg, 40, 40);
            userInputImg(target, Pen9, Pen9, Pen9Title, returnImg, 40, 40);
            userInputImg(target, Pen10, Pen10, Pen10Title, returnImg, 40, 40);
            userInputImg(target, Pen11, Pen11, Pen11Title, returnImg, 40, 40);
            userInputImg(target, Pen12, Pen12, Pen12Title, returnImg, 40, 40);
            userInputImg(target, Pen13, Pen13, Pen13Title, returnImg, 40, 40);
            userInputImg(target, Pen14, Pen14, Pen14Title, returnImg, 40, 40);
            userInputImg(target, Pen15, Pen15, Pen15Title, returnImg, 80, 40);
            userInputImg(target, Pen16, Pen16, Pen16Title, returnImg, 40, 40);
            userInputImg(target, Pen17, Pen17, Pen17Title, returnImg, 40, 40);
            userInputImg(target, Pen18, Pen18, Pen18Title, returnImg, 40, 40);
            userInputImg(target, Pen19, Pen19, Pen19Title, returnImg, 40, 40);
            userInputImg(target, Pen20, Pen20, Pen20Title, returnImg, 40, 40);
            userInputImg(target, Pen21, Pen21, Pen21Title, returnImg, 40, 40);
            userInputImg(target, Pen22, Pen22, Pen22Title, returnImg, 40, 40);
            userInputImg(target, Pen23, Pen23, Pen23Title, returnImg, 40, 40);
            userInputImg(target, Pen24, Pen24, Pen24Title, returnImg, 40, 40);
            userInputImg(target, Pen25, Pen25, Pen25Title, returnImg, 40, 40);
            userInputImg(target, Pen26, Pen26, Pen26Title, returnImg, 40, 40);
            userInputImg(target, Pen27, Pen27, Pen27Title, returnImg, 40, 40);
            userInputImg(target, Pen28, Pen28, Pen28Title, returnImg, 40, 40);
            userInputImg(target, Pen29, Pen29, Pen29Title, returnImg, 40, 40);
            userInputImg(target, Pen30, Pen30, Pen30Title, returnImg, 40, 40);
            userInputImg(target, Pen31, Pen31, Pen31Title, returnImg, 40, 40);
            userInputImg(target, Pen32, Pen32, Pen32Title, returnImg, 40, 40);
            userInputImg(target, Pen33, Pen33, Pen33Title, returnImg, 40, 40);
            userInputImg(target, Pen34, Pen34, Pen34Title, returnImg, 40, 40);
            userInputImg(target, Pen35, Pen35, Pen35Title, returnImg, 40, 40);
            userInputImg(target, Pen36, Pen36, Pen36Title, returnImg, 40, 40);
            userInputImg(target, Pen37, Pen37, Pen37Title, returnImg, 40, 40);
   break;         
          case 2:  
        //雜
            userInputImg(target, Zha2, Zha2, Zha2Title, returnImg, 92, 42);
            userInputImg(target, Zha3, Zha3, Zha3Title, returnImg, 74.4, 40);
            userInputImg(target, Zha1, Zha1, Zha1Title, returnImg, 51, 28);
            userInputImg(target, Zha4, Zha4, Zha4Title, returnImg, 31, 29);
            userInputImg(target, Zha5, Zha5, Zha5Title, returnImg, 88, 70);
            userInputImg(target, Zha6, Zha6, Zha6Title, returnImg, 40, 40);
            userInputImg(target, Zha7, Zha7, Zha7Title, returnImg, 88, 70);
           
      break;      
            case 3:
        //EnemyAppear
            userInputImg(target, EnemyAppear1, EnemyAppear1, EnemyAppear1Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear2, EnemyAppear2, EnemyAppear2Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear3, EnemyAppear3, EnemyAppear3Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear4, EnemyAppear4, EnemyAppear4Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear5, EnemyAppear5, EnemyAppear5Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear6, EnemyAppear6, EnemyAppear6Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear7, EnemyAppear7, EnemyAppear7Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear8, EnemyAppear8, EnemyAppear8Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear9, EnemyAppear9, EnemyAppear9Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear10, EnemyAppear10, EnemyAppear10Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear11, EnemyAppear11, EnemyAppear11Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear12, EnemyAppear12, EnemyAppear12Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear13, EnemyAppear13, EnemyAppear13Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear14, EnemyAppear14, EnemyAppear14Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear15, EnemyAppear15, EnemyAppear15Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear16, EnemyAppear16, EnemyAppear16Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear17, EnemyAppear17, EnemyAppear17Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear18, EnemyAppear18, EnemyAppear18Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear19, EnemyAppear19, EnemyAppear19Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear20, EnemyAppear20, EnemyAppear20Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear21, EnemyAppear21, EnemyAppear21Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear22, EnemyAppear22, EnemyAppear22Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear23, EnemyAppear23, EnemyAppear23Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear24, EnemyAppear24, EnemyAppear24Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear25, EnemyAppear25, EnemyAppear25Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear26, EnemyAppear26, EnemyAppear26Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear27, EnemyAppear27, EnemyAppear27Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear28, EnemyAppear28, EnemyAppear28Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear29, EnemyAppear29, EnemyAppear29Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear30, EnemyAppear30, EnemyAppear30Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear31, EnemyAppear31, EnemyAppear31Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear32, EnemyAppear32, EnemyAppear32Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear33, EnemyAppear33, EnemyAppear33Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear34, EnemyAppear34, EnemyAppear34Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear35, EnemyAppear35, EnemyAppear35Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear36, EnemyAppear36, EnemyAppear36Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear37, EnemyAppear37, EnemyAppear37Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear38, EnemyAppear38, EnemyAppear38Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear39, EnemyAppear39, EnemyAppear39Title, returnImg, 60, 60);
            userInputImg(target, EnemyAppear40, EnemyAppear40, EnemyAppear40Title, returnImg, 60, 60);
          
            break;
            case 4:
             //The muscles of lovely animals
            userInputImg(target, Tmola1, Tmola1, Tmola1Title, returnImg, 60, 60);
            userInputImg(target, Tmola2, Tmola2, Tmola2Title, returnImg, 60, 60);
            userInputImg(target, Tmola3, Tmola3, Tmola3Title, returnImg, 60, 60);
            userInputImg(target, Tmola4, Tmola4, Tmola4Title, returnImg, 60, 60);
            userInputImg(target, Tmola5, Tmola5, Tmola5Title, returnImg, 60, 60);
            userInputImg(target, Tmola6, Tmola6, Tmola6Title, returnImg, 60, 60);
            userInputImg(target, Tmola7, Tmola7, Tmola7Title, returnImg, 60, 60);
            userInputImg(target, Tmola8, Tmola8, Tmola8Title, returnImg, 60, 60);
            userInputImg(target, Tmola9, Tmola9, Tmola9Title, returnImg, 60, 60);
            userInputImg(target, Tmola10, Tmola10, Tmola10Title, returnImg, 60, 60);
            userInputImg(target, Tmola11, Tmola11, Tmola11Title, returnImg, 60, 60);
            userInputImg(target, Tmola12, Tmola12, Tmola12Title, returnImg, 60, 60);
            userInputImg(target, Tmola13, Tmola13, Tmola13Title, returnImg, 60, 60);
            userInputImg(target, Tmola14, Tmola14, Tmola14Title, returnImg, 60, 60);
            userInputImg(target, Tmola15, Tmola15, Tmola15Title, returnImg, 60, 60);
            userInputImg(target, Tmola16, Tmola16, Tmola16Title, returnImg, 60, 60);
            userInputImg(target, Tmola17, Tmola17, Tmola17Title, returnImg, 60, 60);
            userInputImg(target, Tmola18, Tmola18, Tmola18Title, returnImg, 60, 60);
            userInputImg(target, Tmola19, Tmola19, Tmola19Title, returnImg, 60, 60);
            userInputImg(target, Tmola20, Tmola20, Tmola20Title, returnImg, 60, 60);
            userInputImg(target, Tmola21, Tmola21, Tmola21Title, returnImg, 60, 60);
            userInputImg(target, Tmola22, Tmola22, Tmola22Title, returnImg, 60, 60);
            userInputImg(target, Tmola23, Tmola23, Tmola23Title, returnImg, 60, 60);
            userInputImg(target, Tmola24, Tmola24, Tmola24Title, returnImg, 60, 60);
            userInputImg(target, Tmola25, Tmola25, Tmola25Title, returnImg, 60, 60);
            userInputImg(target, Tmola26, Tmola26, Tmola26Title, returnImg, 60, 60);
            userInputImg(target, Tmola27, Tmola27, Tmola27Title, returnImg, 60, 60);
            userInputImg(target, Tmola28, Tmola28, Tmola28Title, returnImg, 60, 60);
            userInputImg(target, Tmola29, Tmola29, Tmola29Title, returnImg, 60, 60);
            userInputImg(target, Tmola30, Tmola30, Tmola30Title, returnImg, 60, 60);
            userInputImg(target, Tmola31, Tmola31, Tmola31Title, returnImg, 60, 60);
            userInputImg(target, Tmola32, Tmola32, Tmola32Title, returnImg, 60, 60);
            userInputImg(target, Tmola33, Tmola33, Tmola33Title, returnImg, 60, 60);
            userInputImg(target, Tmola34, Tmola34, Tmola34Title, returnImg, 60, 60);
            userInputImg(target, Tmola35, Tmola35, Tmola35Title, returnImg, 60, 60);
            userInputImg(target, Tmola36, Tmola36, Tmola36Title, returnImg, 60, 60);
            userInputImg(target, Tmola37, Tmola37, Tmola37Title, returnImg, 60, 60);
            userInputImg(target, Tmola38, Tmola38, Tmola38Title, returnImg, 60, 60);
            userInputImg(target, Tmola39, Tmola39, Tmola39Title, returnImg, 60, 60);
            userInputImg(target, Tmola40, Tmola40, Tmola40Title, returnImg, 60, 60);
            //Muscle Sticker
            userInputImg(target, MS1, MS1, MS1Title, returnImg, 60, 60);
            userInputImg(target, MS2, MS2, MS2Title, returnImg, 60, 60);
            userInputImg(target, MS3, MS3, MS3Title, returnImg, 60, 60);
            userInputImg(target, MS4, MS4, MS4Title, returnImg, 60, 60);
            userInputImg(target, MS5, MS5, MS5Title, returnImg, 60, 60);
            userInputImg(target, MS6, MS6, MS6Title, returnImg, 60, 60);
            userInputImg(target, MS7, MS7, MS7Title, returnImg, 60, 60);
            userInputImg(target, MS8, MS8, MS8Title, returnImg, 60, 60);
            userInputImg(target, MS9, MS9, MS9Title, returnImg, 60, 60);
            userInputImg(target, MS10, MS10, MS10Title, returnImg, 60, 60);
            userInputImg(target, MS11, MS11, MS11Title, returnImg, 60, 60);
            userInputImg(target, MS12, MS12, MS12Title, returnImg, 60, 60);
            userInputImg(target, MS13, MS13, MS13Title, returnImg, 60, 60);
            userInputImg(target, MS14, MS14, MS14Title, returnImg, 60, 60);
            userInputImg(target, MS15, MS15, MS15Title, returnImg, 60, 60);
            userInputImg(target, MS16, MS16, MS16Title, returnImg, 60, 60);
            userInputImg(target, MS17, MS17, MS17Title, returnImg, 60, 60);
            userInputImg(target, MS18, MS18, MS18Title, returnImg, 60, 60);
            userInputImg(target, MS19, MS19, MS19Title, returnImg, 60, 60);
            userInputImg(target, MS20, MS20, MS20Title, returnImg, 60, 60);
            userInputImg(target, MS21, MS21, MS21Title, returnImg, 60, 60);
            userInputImg(target, MS22, MS22, MS22Title, returnImg, 60, 60);
            userInputImg(target, MS23, MS23, MS23Title, returnImg, 60, 60);
            userInputImg(target, MS24, MS24, MS24Title, returnImg, 60, 60);
            userInputImg(target, MS25, MS25, MS25Title, returnImg, 60, 60);
            userInputImg(target, MS26, MS26, MS26Title, returnImg, 60, 60);
            userInputImg(target, MS27, MS27, MS27Title, returnImg, 60, 60);
            userInputImg(target, MS28, MS28, MS28Title, returnImg, 60, 60);
            userInputImg(target, MS29, MS29, MS29Title, returnImg, 60, 60);
            userInputImg(target, MS30, MS30, MS30Title, returnImg, 60, 60);
            userInputImg(target, MS31, MS31, MS31Title, returnImg, 60, 60);
            userInputImg(target, MS32, MS32, MS32Title, returnImg, 60, 60);
            userInputImg(target, MS33, MS33, MS33Title, returnImg, 60, 60);
            userInputImg(target, MS34, MS34, MS34Title, returnImg, 60, 60);
            userInputImg(target, MS35, MS35, MS35Title, returnImg, 60, 60);
            userInputImg(target, MS36, MS36, MS36Title, returnImg, 60, 60);
            userInputImg(target, MS37, MS37, MS37Title, returnImg, 60, 60);
            userInputImg(target, MS38, MS38, MS38Title, returnImg, 60, 60);
            userInputImg(target, MS39, MS39, MS39Title, returnImg, 60, 60);
            userInputImg(target, MS40, MS40, MS40Title, returnImg, 60, 60);            
            break;
            
           case 5:
            
              //BATTLE COUPLE!!
            userInputImg(target, BC1, BC1, BC1Title, returnImg, 60, 60);
            userInputImg(target, BC2, BC2, BC2Title, returnImg, 60, 60);
            userInputImg(target, BC3, BC3, BC3Title, returnImg, 60, 60);
            userInputImg(target, BC4, BC4, BC4Title, returnImg, 60, 60);
            userInputImg(target, BC5, BC5, BC5Title, returnImg, 60, 60);
            userInputImg(target, BC6, BC6, BC6Title, returnImg, 60, 60);
            userInputImg(target, BC7, BC7, BC7Title, returnImg, 60, 60);
            userInputImg(target, BC8, BC8, BC8Title, returnImg, 60, 60);
            userInputImg(target, BC9, BC9, BC9Title, returnImg, 60, 60);
            userInputImg(target, BC10, BC10, BC10Title, returnImg, 60, 60);
            userInputImg(target, BC11, BC11, BC11Title, returnImg, 60, 60);
            userInputImg(target, BC12, BC12, BC12Title, returnImg, 60, 60);
            userInputImg(target, BC13, BC13, BC13Title, returnImg, 60, 60);
            userInputImg(target, BC14, BC14, BC14Title, returnImg, 60, 60);
            userInputImg(target, BC15, BC15, BC15Title, returnImg, 60, 60);
            userInputImg(target, BC16, BC16, BC16Title, returnImg, 60, 60);
            userInputImg(target, BC17, BC17, BC17Title, returnImg, 60, 60);
            userInputImg(target, BC18, BC18, BC18Title, returnImg, 60, 60);
            userInputImg(target, BC19, BC19, BC19Title, returnImg, 60, 60);
            userInputImg(target, BC20, BC20, BC20Title, returnImg, 60, 60);
            userInputImg(target, BC21, BC21, BC21Title, returnImg, 60, 60);
            userInputImg(target, BC22, BC22, BC22Title, returnImg, 60, 60);
            userInputImg(target, BC23, BC23, BC23Title, returnImg, 60, 60);
            userInputImg(target, BC24, BC24, BC24Title, returnImg, 60, 60);
            userInputImg(target, BC25, BC25, BC25Title, returnImg, 60, 60);
            userInputImg(target, BC26, BC26, BC26Title, returnImg, 60, 60);
            userInputImg(target, BC27, BC27, BC27Title, returnImg, 60, 60);
            userInputImg(target, BC28, BC28, BC28Title, returnImg, 60, 60);
            userInputImg(target, BC29, BC29, BC29Title, returnImg, 60, 60);
            userInputImg(target, BC30, BC30, BC30Title, returnImg, 60, 60);
            userInputImg(target, BC31, BC31, BC31Title, returnImg, 60, 60);
            userInputImg(target, BC32, BC32, BC32Title, returnImg, 60, 60);
            userInputImg(target, BC33, BC33, BC33Title, returnImg, 60, 60);
            userInputImg(target, BC34, BC34, BC34Title, returnImg, 60, 60);
            userInputImg(target, BC35, BC35, BC35Title, returnImg, 60, 60);
            userInputImg(target, BC36, BC36, BC36Title, returnImg, 60, 60);
            userInputImg(target, BC37, BC37, BC37Title, returnImg, 60, 60);
            userInputImg(target, BC38, BC38, BC38Title, returnImg, 60, 60);
            userInputImg(target, BC39, BC39, BC39Title, returnImg, 60, 60);
            userInputImg(target, BC40, BC40, BC40Title, returnImg, 60, 60);            
           //Office girl fighting
            userInputImg(target, Ogf1, Ogf1, Ogf1Title, returnImg, 60, 60);
            userInputImg(target, Ogf2, Ogf2, Ogf2Title, returnImg, 60, 60);
            userInputImg(target, Ogf3, Ogf3, Ogf3Title, returnImg, 60, 60);
            userInputImg(target, Ogf4, Ogf4, Ogf4Title, returnImg, 60, 60);
            userInputImg(target, Ogf5, Ogf5, Ogf5Title, returnImg, 60, 60);
            userInputImg(target, Ogf6, Ogf6, Ogf6Title, returnImg, 60, 60);
            userInputImg(target, Ogf7, Ogf7, Ogf7Title, returnImg, 60, 60);
            userInputImg(target, Ogf8, Ogf8, Ogf8Title, returnImg, 60, 60);
            userInputImg(target, Ogf9, Ogf9, Ogf9Title, returnImg, 60, 60);
            userInputImg(target, Ogf10, Ogf10, Ogf10Title, returnImg, 60, 60);
            userInputImg(target, Ogf11, Ogf11, Ogf11Title, returnImg, 60, 60);
            userInputImg(target, Ogf12, Ogf12, Ogf12Title, returnImg, 60, 60);
            userInputImg(target, Ogf13, Ogf13, Ogf13Title, returnImg, 60, 60);
            userInputImg(target, Ogf14, Ogf14, Ogf14Title, returnImg, 60, 60);
            userInputImg(target, Ogf15, Ogf15, Ogf15Title, returnImg, 60, 60);
            userInputImg(target, Ogf16, Ogf16, Ogf16Title, returnImg, 60, 60);
            userInputImg(target, Ogf17, Ogf17, Ogf17Title, returnImg, 60, 60);
            userInputImg(target, Ogf18, Ogf18, Ogf18Title, returnImg, 60, 60);
            userInputImg(target, Ogf19, Ogf19, Ogf19Title, returnImg, 60, 60);
            userInputImg(target, Ogf20, Ogf20, Ogf20Title, returnImg, 60, 60);
            userInputImg(target, Ogf21, Ogf21, Ogf21Title, returnImg, 60, 60);
            userInputImg(target, Ogf22, Ogf22, Ogf22Title, returnImg, 60, 60);
            userInputImg(target, Ogf23, Ogf23, Ogf23Title, returnImg, 60, 60);
            userInputImg(target, Ogf24, Ogf24, Ogf24Title, returnImg, 60, 60);
            userInputImg(target, Ogf25, Ogf25, Ogf25Title, returnImg, 60, 60);
            userInputImg(target, Ogf26, Ogf26, Ogf26Title, returnImg, 60, 60);
            userInputImg(target, Ogf27, Ogf27, Ogf27Title, returnImg, 60, 60);
            userInputImg(target, Ogf28, Ogf28, Ogf28Title, returnImg, 60, 60);
            userInputImg(target, Ogf29, Ogf29, Ogf29Title, returnImg, 60, 60);
            userInputImg(target, Ogf30, Ogf30, Ogf30Title, returnImg, 60, 60);
            userInputImg(target, Ogf31, Ogf31, Ogf31Title, returnImg, 60, 60);
            userInputImg(target, Ogf32, Ogf32, Ogf32Title, returnImg, 60, 60);
            userInputImg(target, Ogf33, Ogf33, Ogf33Title, returnImg, 60, 60);
            userInputImg(target, Ogf34, Ogf34, Ogf34Title, returnImg, 60, 60);
            userInputImg(target, Ogf35, Ogf35, Ogf35Title, returnImg, 60, 60);
            userInputImg(target, Ogf36, Ogf36, Ogf36Title, returnImg, 60, 60);
            userInputImg(target, Ogf37, Ogf37, Ogf37Title, returnImg, 60, 60);
            userInputImg(target, Ogf38, Ogf38, Ogf38Title, returnImg, 60, 60);
            userInputImg(target, Ogf39, Ogf39, Ogf39Title, returnImg, 60, 60);
            userInputImg(target, Ogf40, Ogf40, Ogf40Title, returnImg, 60, 60);  
            //DOGEZA
            userInputImg(target, DOGEZA1, DOGEZA1, DOGEZA1Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA2, DOGEZA2, DOGEZA2Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA3, DOGEZA3, DOGEZA3Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA4, DOGEZA4, DOGEZA4Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA5, DOGEZA5, DOGEZA5Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA6, DOGEZA6, DOGEZA6Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA7, DOGEZA7, DOGEZA7Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA8, DOGEZA8, DOGEZA8Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA9, DOGEZA9, DOGEZA9Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA10, DOGEZA10, DOGEZA10Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA11, DOGEZA11, DOGEZA11Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA12, DOGEZA12, DOGEZA12Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA13, DOGEZA13, DOGEZA13Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA14, DOGEZA14, DOGEZA14Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA15, DOGEZA15, DOGEZA15Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA16, DOGEZA16, DOGEZA16Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA17, DOGEZA17, DOGEZA17Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA18, DOGEZA18, DOGEZA18Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA19, DOGEZA19, DOGEZA19Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA20, DOGEZA20, DOGEZA20Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA21, DOGEZA21, DOGEZA21Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA22, DOGEZA22, DOGEZA22Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA23, DOGEZA23, DOGEZA23Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA24, DOGEZA24, DOGEZA24Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA25, DOGEZA25, DOGEZA25Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA26, DOGEZA26, DOGEZA26Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA27, DOGEZA27, DOGEZA27Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA28, DOGEZA28, DOGEZA28Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA29, DOGEZA29, DOGEZA29Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA30, DOGEZA30, DOGEZA30Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA31, DOGEZA31, DOGEZA31Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA32, DOGEZA32, DOGEZA32Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA33, DOGEZA33, DOGEZA33Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA34, DOGEZA34, DOGEZA34Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA35, DOGEZA35, DOGEZA35Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA36, DOGEZA36, DOGEZA36Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA37, DOGEZA37, DOGEZA37Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA38, DOGEZA38, DOGEZA38Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA39, DOGEZA39, DOGEZA39Title, returnImg, 60, 60);
            userInputImg(target, DOGEZA40, DOGEZA40, DOGEZA40Title, returnImg, 60, 60);
           
            break;
			
			case 6:
                        userInputImg(target, RM_1, RM_1, RM_1Title, returnImg, 60, 60);
            userInputImg(target, RM_2, RM_2, RM_2Title, returnImg, 60, 60);
            userInputImg(target, RM_3, RM_3, RM_3Title, returnImg, 60, 60);
            userInputImg(target, RM_4, RM_4, RM_4Title, returnImg, 60, 60);
            userInputImg(target, RM_5, RM_5, RM_5Title, returnImg, 60, 60);
            userInputImg(target, RM_6, RM_6, RM_6Title, returnImg, 60, 60);
            userInputImg(target, RM_7, RM_7, RM_7Title, returnImg, 60, 60);
            userInputImg(target, RM_8, RM_8, RM_8Title, returnImg, 60, 60);
            userInputImg(target, RM_9, RM_9, RM_9Title, returnImg, 60, 60);
            userInputImg(target, RM_10, RM_10, RM_10Title, returnImg, 60, 60);
            userInputImg(target, RM_11, RM_11, RM_11Title, returnImg, 60, 60);
            userInputImg(target, RM_12, RM_12, RM_12Title, returnImg, 60, 60);
            userInputImg(target, RM_13, RM_13, RM_13Title, returnImg, 60, 60);
            userInputImg(target, RM_14, RM_14, RM_14Title, returnImg, 60, 60);
            userInputImg(target, RM_15, RM_15, RM_15Title, returnImg, 60, 60);
            userInputImg(target, RM_16, RM_16, RM_16Title, returnImg, 60, 60);
            userInputImg(target, RM_17, RM_17, RM_17Title, returnImg, 60, 60);
            userInputImg(target, RM_18, RM_18, RM_18Title, returnImg, 60, 60);
            userInputImg(target, RM_19, RM_19, RM_19Title, returnImg, 60, 60);
            userInputImg(target, RM_20, RM_20, RM_20Title, returnImg, 60, 60);
            userInputImg(target, RM_21, RM_21, RM_21Title, returnImg, 60, 60);
            userInputImg(target, RM_22, RM_22, RM_22Title, returnImg, 60, 60);
            userInputImg(target, RM_23, RM_23, RM_23Title, returnImg, 60, 60);
            userInputImg(target, RM_24, RM_24, RM_24Title, returnImg, 60, 60);
            userInputImg(target, RM_25, RM_25, RM_25Title, returnImg, 60, 60);
            userInputImg(target, RM_26, RM_26, RM_26Title, returnImg, 60, 60);
            userInputImg(target, RM_27, RM_27, RM_27Title, returnImg, 60, 60);
            userInputImg(target, RM_28, RM_28, RM_28Title, returnImg, 60, 60);
            userInputImg(target, RM_29, RM_29, RM_29Title, returnImg, 60, 60);
            userInputImg(target, RM_30, RM_30, RM_30Title, returnImg, 60, 60);
            userInputImg(target, RM_31, RM_31, RM_31Title, returnImg, 60, 60);
            userInputImg(target, RM_32, RM_32, RM_32Title, returnImg, 60, 60);
            userInputImg(target, RM_33, RM_33, RM_33Title, returnImg, 60, 60);
            userInputImg(target, RM_34, RM_34, RM_34Title, returnImg, 60, 60);
            userInputImg(target, RM_35, RM_35, RM_35Title, returnImg, 60, 60);
            userInputImg(target, RM_36, RM_36, RM_36Title, returnImg, 60, 60);
            userInputImg(target, RM_37, RM_37, RM_37Title, returnImg, 60, 60);
            userInputImg(target, RM_38, RM_38, RM_38Title, returnImg, 60, 60);
            userInputImg(target, RM_39, RM_39, RM_39Title, returnImg, 60, 60);
            userInputImg(target, RM_40, RM_40, RM_40Title, returnImg, 60, 60);

            break;

			


   // case: 编号     
/*
         case xx:
            在这里添加 
            break;
*/            
//    
        default:
            emptyContainer.innerHTML = '<b style="color:orange">空白表情容器</b>';
            return;
    }
    
}
/* 自定义内容到此结束 */
/*------------------------------------*/






// 用户操作函数
function userInputPlainText(target, textBox,titleBox, func){
   var textlength = textBox.length;
    for (var j=0;j<textlength; j++){
        var newElementEx = document.createElement('a'); 
        var imgaa = document.createElement('img');
        imgaa.style.margin = "4px";
        newElementEx.onclick = func;
        newElementEx._target = textarea;
        newElementEx.style.cursor = 'pointer';
        imgaa.alt = titleBox[j];
        imgaa.useMap = textBox[j];
        target.appendChild(newElementEx);
        newElementEx.appendChild(imgaa);
   }
   target.parentNode.insertAfter(document.createElement('br'));
}

function userInputImg(target,thumbURL, targetURL, targetTitle, func, ImgWidth, ImgHeight){
    var emotionlength = targetURL.length;
    for (var i = 0; i<emotionlength; i++)
    {
        target.appendChild(
                    createButton(
                        textarea,     //对象
                        func,   //方法
                        targetTitle[i],   //提示文字
                        ImgWidth, // 缩略图宽
                        ImgHeight, //缩略图高
                        targetURL[i],thumbURL[i])); // 贴图地址和缩略图地址
    }

}


// 返回纯文本

function insertText(selector, text) {
    var target = document.querySelector(selector);
    var startPos = target.selectionStart;
    //var endPos = target.selectionEnd;
    var value = target.value;
    target.value = value.slice(0, startPos) + text + value.slice(startPos);
}


function returnPlainText(event) {
    var link, textarea, s, selectedTarget;
    link = event.currentTarget;
    textarea = link._target;
    selectedTarget = event.target;
    insertText("textarea", selectedTarget.useMap);
    // 定位光标
//    alert(startPos);
//    if(typeof textarea.selectionStart === 'number' && typeof textarea.selectionEnd === 'number'){
//        textarea.value = textarea.value.substring(0,startPos) + selectedTarget.innerHTML + textarea.value.substring(endPos, textarea.value.length);
//    }else{
//        textarea.value +=selectedTarget.useMap;
//    }
    event.preventDefault();
}

// 返回Wincode代码
function returnImg(event) {
    var link, textarea, s, selectedTarget;
    link = event.currentTarget;
    textarea = link._target;
    selectedTarget = event.target;
//    textarea.value += '[img]'+selectedTarget.useMap+'[/img]';
    var inserttext = '[img]'+selectedTarget.useMap+'[/img]';
    insertText("textarea", inserttext);
    event.preventDefault();
}

// ImgButton
function createButton(target, func, title, width, height, src, smallsrc) {
    // target: 控制对象
    // func:     方法
    // title:   提示文字
    // width,height  外观
    // src:  路径
    var img, button;
    img = document.createElement('img');
    img.width = width;
    img.height = height;
    img.style.borderTop = img.style.borderLeft = "1px solid #ccc";
    img.style.borderRight = img.style.borderBottom = "1px solid #888";
    img.style.marginRight = "2px";
    img.src = smallsrc;
    img.useMap = src;
    button = document.createElement('a');
    button._target = target;
    button.title = title;
    button.href = '#';
    button.onclick = func;
    button.style.cursor="pointer";
    button.appendChild(img);
    button.style.borderBottom = '1px solid';
    return button;       
}



// 清空容器用函数
function closeHandler(event){
    var deletTarget = document.getElementById('emotioncontainer9999');
    deletTarget.parentNode.removeChild(deletTarget);
    emptyContainer = document.createElement('div');
    emptyContainer.id = 'emotioncontainer9999';
    textarea.parentNode.insertBefore(emptyContainer, textarea);
}
function closeSetupHandler(event){
    var deletTarget = document.getElementById('setup');
    deletTarget.parentNode.removeChild(deletTarget);
}
function reSetupHandler(event){
    var deletTarget = document.getElementById('setup');
    deletTarget.parentNode.removeChild(deletTarget);
    user = prompt("请输入不想使用的表情组, 从0开始以逗号分隔, 如0,1,2,3, 可以留空表示全部显示","");
    setCookie("setup", user, 30);
    //alert(document.location.href);
   
}



//展开动作
function extendHandler(event){
    var newElement2,link,selectedTarget;
    
    /*清空当前容器*/
    closeHandler();
    
    newElement2 = document.createElement('div');
    newElement2.style.border = '1px solid #9999FF';
    //newElement2.innerHTML = '&nbsp;&nbsp;';
    newElement2.style.background = '#FCFCFC';
    newElement2.style.paddingLeft = '4px';
    newElement2.style.height = '200px';
    newElement2.style.width = textarea.style.width;
    newElement2.style.overflow = 'auto';
 //   newElement2.style.position = 'fixed';
   // newElement2.style.top = '0';
   // newElement2.style.left = '5px';
    emptyContainer.appendChild(newElement2);
    
    
    /*表情载入*/
    selectedTarget = event.target;
    var loadIndex = selectedTarget.id - '100100';
    //    alert(loadIndex);
    loadingHandler(loadIndex,newElement2);
    
    event.preventDefault();
}

//生成栏目
function createMenuItem(target,func,title, loadTitle){
    var newElement;
    newElement = document.createElement('a');
    newElement.style.height = '40px';
    newElement.style.width = '100px';
    newElement.innerHTML = '  [' +title+ ']'+'&nbsp;';
    newElement.onclick = func;
    newElement.style.cursor = 'pointer';
    newElement.id = loadTitle;
    if(title!==undefined){
    target.appendChild(newElement);
    }
}
function setupHandler(){
            /*------------------------------------*/
    var user=getCookie("setup");
    if (document.getElementById('setup')){return;}
    if (user != "") {
    newElement = document.createElement('div');
    newElement.id = 'setup';
    newElement.style.left = '43%';
    newElement.style.bottom = '100px';
    newElement.style.width = '400px';
    newElement.style.height = '50px';
    newElement.style.border = '3px solid deeppink';
    newElement.style.padding = '5px 5px';
   
    newElement.style.background = '#eee';
    newElement.innerHTML = ' ';
    document.body.appendChild(newElement);
    document.getElementById('setup').style.position = 'fixed';
    /*
    var submitform = document.createElement('fieldset');
    submitform.id = 'formsetup';
    submitform.style.margin = "10px 10px";
    submitform.innerHTML =' <legend>勾选启用的表情组</legend>';
    document.getElementById('setup').appendChild(submitform);
    for(j=0;j<ItemTitleArray.length;j++)
    {
        var checkBoxItem = document.createElement('input');
        checkBoxItem.type = 'checkbox';
        checkBoxItem.name = ItemTitleArray[j];
        checkBoxItem.value = loadTitleArray[j];
        document.getElementById('formsetup').appendChild(checkBoxItem);
        var descriptionWord = document.createElement('b');
        descriptionWord.innerHTML = ItemTitleArray[j]+'  ';
        document.getElementById('formsetup').appendChild(descriptionWord);
    }*/
    var cookienow = document.createElement('b');
    cookienow.innerHTML = user + '<br>';    
    document.getElementById('setup').appendChild(cookienow);
    var additionalInfo = document.createElement('button');
    additionalInfo.type = 'submit';
    additionalInfo.name = 'setup';
    additionalInfo.innerHTML = ' 保存并关闭 ';
    additionalInfo.onclick = closeSetupHandler;
    additionalInfo.style.cursor = 'pointer';
    document.getElementById('setup').appendChild(additionalInfo);
        
    var additionalInfo2 = document.createElement('button');
    additionalInfo2.type = 'submit';
    additionalInfo2.name = 'setup';
    additionalInfo2.innerHTML = ' 重新设定 ';
    additionalInfo2.onclick = reSetupHandler;
    additionalInfo2.style.cursor = 'pointer';
    document.getElementById('setup').appendChild(additionalInfo2);
/*    
     var additionalInfo = document.createElement('button');
    additionalInfo.type = 'submit';
    additionalInfo.name = 'setup';
    additionalInfo.value = ' 确定 ';
    additionalInfo.onclick = closeSetupHandler;
    additionalInfo.style.cursor = 'pointer';
    document.getElementById('formsetup').appendChild(additionalInfo);
    
     var additionalInfo = document.createElement('button');
    additionalInfo.type = 'submit';
    additionalInfo.name = 'setup';
    additionalInfo.value = ' 默认值 ';
    additionalInfo.onclick = closeSetupHandler;
    additionalInfo.style.cursor = 'pointer';
    document.getElementById('formsetup').appendChild(additionalInfo);
    */
        //alert("Welcome again " + user);
    } else {
       user = prompt("请输入不想使用的表情组, 从0开始以逗号分隔, 如0,1,2,3, 可以留空表示全部显示","");
       if (user != "" && user != null) {
           setCookie("setup", user, 30);
       }
    }
    
}
// 生成项目
function createMenuElement(target, listNumber){
    var newElement;
    newElement = document.createElement('div');
    newElement.style.border = '1px solid #9999FF';
    newElement.id='itemlist';
    newElement.align = 'left';
    newElement.style.paddingLeft = '4px';
    newElement.innerHTML = ' <b style="color:gold">⑨_⑨ </b> ';
    newElement.style.background = '#FCFCFC';
    newElement.style.height = '44px';
    newElement.style.width = '100%' ;
    //document.getElementById('itemlist').style.position = 'relative';
    target.parentNode.insertBefore(newElement, target);
    
    for (var i = 0; i < listNumber; i++) {
        createMenuItem(newElement,extendHandler,ItemTitleArray[i],loadTitleArray[i]);
    }
    
     var brElement = document.createElement('br');

    
    
    var additionalInfo = document.createElement('a');
    additionalInfo.innerHTML = ' <b style="color:red"> [隐藏] </b> ';
    additionalInfo.onclick = closeHandler;
    additionalInfo.style.cursor = 'pointer';
    newElement.appendChild(additionalInfo);
    //newElement.appendChild(brElement);
    var additionalInfo3 = document.createElement('a');
    additionalInfo3.innerHTML = '<b style="color:deeppink;z-index:1001;"> [禁用表情] </b>';
    additionalInfo3.onclick = setupHandler;
    additionalInfo3.style.cursor = 'pointer';
    newElement.appendChild(additionalInfo3);
    
//    var additionalInfo2 = document.createElement('b');
//    additionalInfo2.innerHTML = ' <a style="color:deeppink;text-align:right;" href="http://blog.nekohand.moe/" target="_blank"> eddie32 </a> ';
//    newElement.appendChild(additionalInfo2);
   
   
}

// 设置cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
     history.go(0);
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
    }
    return "";
}






var KFOL = {
    init: function(){

textareas = document.getElementsByTagName('textarea');
if (!textareas.length) { return; }
        textarea = textareas[0];
        emptyContainer = document.createElement('div');
        emptyContainer.id = 'emotioncontainer9999';
        createMenuElement(textarea, totalNum); 
        textarea.parentNode.insertBefore(emptyContainer, textarea);
    }
}
KFOL.init();
