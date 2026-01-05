// ==UserScript==
// @name	Lap
// @author	googleGuard
// @version	1.6
// @description 贴吧编辑框生成舔楼主图片
// @description:zh-cn  贴吧编辑框生成舔楼主图片
// @namespace   googleGuard
// @include	http://tieba.baidu.com/p/*
// @include	http://imgsrc.baidu.com/*
// @include	http://imgsrc.baidu.com/*
// @include	http://*photos.baidu.com/*
// @include	http://*photos.bdimg.com/*
// @include	http://tb.himg.baidu.com/*
// @run-at	document-end
// @grant	none
// @downloadURL https://update.greasyfork.org/scripts/6307/Lap.user.js
// @updateURL https://update.greasyfork.org/scripts/6307/Lap.meta.js
// ==/UserScript==

//大家可以自行添加
lapList = {
	'六花': {
		width: 200,
		height: 210,
		repeat: 0,	//循环次数，0无限循环
		delay: 0,	//每帧间隔，毫秒
		text: '@[NAME] <br>',
		// [FLOOR] 楼层
		// [NAME] 名字
		// [LEVEL] 等级
		// [LEVEL_NAME] 等级名
		// [FOURM_NAME] 吧名
		afterText: '-------------------------',
		layer: [
			[
				{src: 'http://imgsrc.baidu.com/forum/pic/item/5882b2b7d0a20cf4c463b28f75094b36adaf99eb.jpg'},
				{x: 40, y: 50, w: 60, h: 60, src: '[FACE]'},
			],
			[
				{src: 'http://imgsrc.baidu.com/forum/pic/item/6f061d950a7b0208def170b161d9f2d3572cc8a2.jpg'},
				{x: 120, y: 80, w: 60, h: 60, src: '[FACE]'},
			],
			[
				{src: 'http://imgsrc.baidu.com/forum/pic/item/e4dde71190ef76c6a806b77b9e16fdfaae51678d.jpg'},
				{x: 95, y: 140, w: 60, h: 60, src: '[FACE]'},
			],
			[
				{src: 'http://imgsrc.baidu.com/forum/pic/item/b58f8c5494eef01f23995495e3fe9925bd317dd4.jpg'},
				{x: 15, y: 150, w: 60, h: 60, src: '[FACE]'},
			],
			[
				{src: 'http://imgsrc.baidu.com/forum/pic/item/b8389b504fc2d5628ffa9cbde41190ef77c66ceb.jpg'},
				{x: 0, y: 100, w: 60, h: 60, src: '[FACE]'},
			],
		]
	},
	'WHY_R_U_SO_DIAO': {
		width: 205,
		height: 148,
		text: '@[NAME] <br>',
		layer: [
			[
				{x: 93, y: 32, w: 110, h: 110, src: '[FACE]'},
				{src: 'http://imgsrc.baidu.com/forum/pic/item/314e251f95cad1c8bff957767c3e6709c93d5124.jpg'},
				{x: 8, y: 25, text: '你为何这么', style: {
					font: '18px 微软雅黑',
				}},
				{x: 8, y: 50, text: '屌？', style: {
					font: '18px 微软雅黑',		//字体
					//strokeStyle: '#ffffff',	//轮廓颜色
					//fillStyle: '#000000',		//字体颜色
					//shadowColor: '#000000', 	//阴影颜色
					//shadowOffsetX: 0,		//阴影横坐标
					//shadowOffsetY: 0,		//阴影竖坐标
					//shadowBlur: 3,		//阴影大小
				}},
			],
		]
	},
	'舔': {
		width: 186,
		height: 260,
		text: '笑舔[FLOOR]楼 @[NAME] <br>',
		layer: [
			[
				{src: 'http://imgsrc.baidu.com/forum/pic/item/4ec2d5628535e5ddeba1e98f75c6a7efcf1b62d4.jpg'},
				{x: -95, y: 154, r: -Math.PI / 100 * 10.5, w: 110, h: 110, src: '[FACE]'},
			],
		]
	},
	'引用': {
		width: 1000,
		height: 30,
		layer: [
			[
				{x: 5, y: 25, text: '以下效果取自 柏拉图样图森破 的脚本', style: {
					font: '20px 微软雅黑',
					fillStyle: 'blue',
				}},
			],
		]
	},
	'海贼王': {
		width: 216,
		height: 313,
		text: '活捉 [FLOOR] 楼 @[NAME] 大水笔<br>',
		layer: [
			[
				{src: 'http://imgsrc.baidu.com/forum/pic/item/c657f1899e510fb350bf99f8da33c895d0430c51.jpg'},
				{x: 53, y: 76, w: 110, h: 110, src: '[FACE]'},
				{x: 25, y: 50, w: 100, h: 107, src: 'http://imgsrc.baidu.com/forum/pic/item/5b1314510fb30f24223c026ccb95d143ac4b0351.jpg'},
				{x: 108, y: 246, text: '[NAME]', style: {
					textAlign: 'center',
					font: '20px 微软雅黑',
					fillStyle: '#3b2c27',
				}},
				{x: 108, y: 270, text: '[FOURM_NAME]吧', style: {
					textAlign: 'center',
					font: '15px 微软雅黑',
					fillStyle: '#3b2c27',
				}},
			],
		]
	},
	'游戏王': {
		width: 154,
		height: 219,
		text: '对 [FLOOR] 楼 @[NAME] 使用：<br>',
		layer: [
			[
				{src: 'http://imgsrc.baidu.com/forum/pic/item/bfa772dcd100baa14472fdeb4410b912c9fc2e9a.jpg'},
				{x: 22, y: 47, w: 110, h: 110, src: '[FACE]'},
				{x: 15, y: 27, text: '[NAME]', style: {
					font: '15px 楷体',
					fillStyle: '#3b2c27',
				}},
				{x: 14, y: 180, text: '【大水笔·效果】', style: {
					font: '11px 宋体',
					fillStyle: '#3b2c27',
				}},
				{x: 18, y: 195, text: '经验：+233', style: {
					font: '11px 宋体',
					fillStyle: '#3b2c27',
				}},
			],
		]
	},
	'变态': {
		width: 315,
		height: 405,
		text: '[FLOOR] 楼 @[NAME] 你个大变态！<br>',
		layer: [
			[
				{src: 'http://imgsrc.baidu.com/forum/pic/item/a2112c1ea8d3fd1f3672076a334e251f94ca5f85.jpg'},
				{x: 105, y: 236, w: 110, h: 110, src: '[FACE]'},
				{src: 'http://imgsrc.baidu.com/forum/pic/item/8849771f4134970a4961b57f96cad1c8a6865dee.jpg'},
				{x: 155, y: 365, text: '变态', style: {
					textAlign: 'center',
					font: '15px 微软雅黑',
					fillStyle: '#3b2c27',
				}},
			],
		]
	},
	'警察叔叔': {
		width: 533,
		height: 300,
		text: '警察叔叔，就是 [FLOOR] 楼 @[NAME] 这个人<br>',
		layer: [
			[
				{src: 'http://imgsrc.baidu.com/forum/pic/item/05851fcad1c8a78663e71b5f6409c93d71cf5028.jpg'},
				{x: 264, y: 148, r: Math.PI / 100 * 3, w: 48, h: 48, src: '[FACE]'},
				{src: 'http://imgsrc.baidu.com/forum/pic/item/5b6e80d162d9f2d34b0f4fbeaaec8a136227ccdb.jpg'},
				//{x: 266, y: 287, text: '警察叔叔，就是 [NAME] 这个人！', style: {
				//	textAlign: 'center',
				//	font: 'bold 25px 微软雅黑',
				//	strokeStyle: '#000000',
				//}},
				{x: 266, y: 287, text: '警察叔叔，就是 [NAME] 这个人！', style: {
					textAlign: 'center',
					font: 'bold 25px 微软雅黑',
					fillStyle: '#ffffff',
					shadowColor: '#000000',
					shadowOffsetX: 0,
					shadowOffsetY: 0,
					shadowBlur: 3,
				}},
			],
		]
	},
};

/**
 * This class handles LZW encoding
 * Adapted from Jef Poskanzer's Java port by way of J. M. G. Elliott.
 * @author Kevin Weiner (original Java version - kweiner@fmsware.com)
 * @author Thibault Imbert (AS3 version - bytearray.org)
 * @author Kevin Kwok (JavaScript version - https://github.com/antimatter15/jsgif)
 * @version 0.1 AS3 implementation
 */
LZWEncoder=function(){var exports={};var EOF=-1;var imgW;var imgH;var pixAry;var initCodeSize;var remaining;var curPixel;var BITS=12;var HSIZE=5003;var n_bits;var maxbits=BITS;var maxcode;var maxmaxcode=1<<BITS;var htab=[];var codetab=[];var hsize=HSIZE;var free_ent=0;var clear_flg=false;var g_init_bits;var ClearCode;var EOFCode;var cur_accum=0;var cur_bits=0;var masks=[0x0000,0x0001,0x0003,0x0007,0x000F,0x001F,0x003F,0x007F,0x00FF,0x01FF,0x03FF,0x07FF,0x0FFF,0x1FFF,0x3FFF,0x7FFF,0xFFFF];var a_count;var accum=[];var LZWEncoder=exports.LZWEncoder=function LZWEncoder(width,height,pixels,color_depth){imgW=width;imgH=height;pixAry=pixels;initCodeSize=Math.max(2,color_depth)};var char_out=function char_out(c,outs){accum[a_count++]=c;if(a_count>=254)flush_char(outs)};var cl_block=function cl_block(outs){cl_hash(hsize);free_ent=ClearCode+2;clear_flg=true;output(ClearCode,outs)};var cl_hash=function cl_hash(hsize){for(var i=0;i<hsize;++i)htab[i]=-1};var compress=exports.compress=function compress(init_bits,outs){var fcode;var i;var c;var ent;var disp;var hsize_reg;var hshift;g_init_bits=init_bits;clear_flg=false;n_bits=g_init_bits;maxcode=MAXCODE(n_bits);ClearCode=1<<(init_bits-1);EOFCode=ClearCode+1;free_ent=ClearCode+2;a_count=0;ent=nextPixel();hshift=0;for(fcode=hsize;fcode<65536;fcode*=2)++hshift;hshift=8-hshift;hsize_reg=hsize;cl_hash(hsize_reg);output(ClearCode,outs);outer_loop:while((c=nextPixel())!=EOF){fcode=(c<<maxbits)+ent;i=(c<<hshift)^ent;if(htab[i]==fcode){ent=codetab[i];continue}else if(htab[i]>=0){disp=hsize_reg-i;if(i===0)disp=1;do{if((i-=disp)<0)i+=hsize_reg;if(htab[i]==fcode){ent=codetab[i];continue outer_loop}}while(htab[i]>=0)}output(ent,outs);ent=c;if(free_ent<maxmaxcode){codetab[i]=free_ent++;htab[i]=fcode}else cl_block(outs)}output(ent,outs);output(EOFCode,outs)};var encode=exports.encode=function encode(os){os.writeByte(initCodeSize);remaining=imgW*imgH;curPixel=0;compress(initCodeSize+1,os);os.writeByte(0)};var flush_char=function flush_char(outs){if(a_count>0){outs.writeByte(a_count);outs.writeBytes(accum,0,a_count);a_count=0}};var MAXCODE=function MAXCODE(n_bits){return(1<<n_bits)-1};var nextPixel=function nextPixel(){if(remaining===0)return EOF;--remaining;var pix=pixAry[curPixel++];return pix&0xff};var output=function output(code,outs){cur_accum&=masks[cur_bits];if(cur_bits>0)cur_accum|=(code<<cur_bits);else cur_accum=code;cur_bits+=n_bits;while(cur_bits>=8){char_out((cur_accum&0xff),outs);cur_accum>>=8;cur_bits-=8}if(free_ent>maxcode||clear_flg){if(clear_flg){maxcode=MAXCODE(n_bits=g_init_bits);clear_flg=false}else{++n_bits;if(n_bits==maxbits)maxcode=maxmaxcode;else maxcode=MAXCODE(n_bits)}}if(code==EOFCode){while(cur_bits>0){char_out((cur_accum&0xff),outs);cur_accum>>=8;cur_bits-=8}flush_char(outs)}};LZWEncoder.apply(this,arguments);return exports};

/*
 * NeuQuant Neural-Net Quantization Algorithm
 * ------------------------------------------
 *
 * Copyright (c) 1994 Anthony Dekker
 *
 * NEUQUANT Neural-Net quantization algorithm by Anthony Dekker, 1994. See
 * "Kohonen neural networks for optimal colour quantization" in "Network:
 * Computation in Neural Systems" Vol. 5 (1994) pp 351-367. for a discussion of
 * the algorithm.
 *
 * Any party obtaining a copy of these files from the author, directly or
 * indirectly, is granted, free of charge, a full and unrestricted irrevocable,
 * world-wide, paid up, royalty-free, nonexclusive right and license to deal in
 * this software and documentation files (the "Software"), including without
 * limitation the rights to use, copy, modify, merge, publish, distribute,
 * sublicense, and/or sell copies of the Software, and to permit persons who
 * receive copies from any such party to do so, with the only requirement being
 * that this copyright notice remain intact.
 */

/*
 * This class handles Neural-Net quantization algorithm
 * @author Kevin Weiner (original Java version - kweiner@fmsware.com)
 * @author Thibault Imbert (AS3 version - bytearray.org)
 * @author Kevin Kwok (JavaScript version - https://github.com/antimatter15/jsgif)
 * @version 0.1 AS3 implementation
 */
NeuQuant=function(){var exports={};var netsize=256;var prime1=499;var prime2=491;var prime3=487;var prime4=503;var minpicturebytes=(3*prime4);var maxnetpos=(netsize-1);var netbiasshift=4;var ncycles=100;var intbiasshift=16;var intbias=(1<<intbiasshift);var gammashift=10;var gamma=(1<<gammashift);var betashift=10;var beta=(intbias>>betashift);var betagamma=(intbias<<(gammashift-betashift));var initrad=(netsize>>3);var radiusbiasshift=6;var radiusbias=(1<<radiusbiasshift);var initradius=(initrad*radiusbias);var radiusdec=30;var alphabiasshift=10;var initalpha=(1<<alphabiasshift);var alphadec;var radbiasshift=8;var radbias=(1<<radbiasshift);var alpharadbshift=(alphabiasshift+radbiasshift);var alpharadbias=(1<<alpharadbshift);var thepicture;var lengthcount;var samplefac;var network;var netindex=[];var bias=[];var freq=[];var radpower=[];var NeuQuant=exports.NeuQuant=function NeuQuant(thepic,len,sample){var i;var p;thepicture=thepic;lengthcount=len;samplefac=sample;network=new Array(netsize);for(i=0;i<netsize;i++){network[i]=new Array(4);p=network[i];p[0]=p[1]=p[2]=(i<<(netbiasshift+8))/netsize;freq[i]=intbias/netsize;bias[i]=0}};var colorMap=function colorMap(){var map=[];var index=new Array(netsize);for(var i=0;i<netsize;i++)index[network[i][3]]=i;var k=0;for(var l=0;l<netsize;l++){var j=index[l];map[k++]=(network[j][0]);map[k++]=(network[j][1]);map[k++]=(network[j][2])}return map};var inxbuild=function inxbuild(){var i;var j;var smallpos;var smallval;var p;var q;var previouscol;var startpos;previouscol=0;startpos=0;for(i=0;i<netsize;i++){p=network[i];smallpos=i;smallval=p[1];for(j=i+1;j<netsize;j++){q=network[j];if(q[1]<smallval){smallpos=j;smallval=q[1]}}q=network[smallpos];if(i!=smallpos){j=q[0];q[0]=p[0];p[0]=j;j=q[1];q[1]=p[1];p[1]=j;j=q[2];q[2]=p[2];p[2]=j;j=q[3];q[3]=p[3];p[3]=j}if(smallval!=previouscol){netindex[previouscol]=(startpos+i)>>1;for(j=previouscol+1;j<smallval;j++)netindex[j]=i;previouscol=smallval;startpos=i}}netindex[previouscol]=(startpos+maxnetpos)>>1;for(j=previouscol+1;j<256;j++)netindex[j]=maxnetpos};var learn=function learn(){var i;var j;var b;var g;var r;var radius;var rad;var alpha;var step;var delta;var samplepixels;var p;var pix;var lim;if(lengthcount<minpicturebytes)samplefac=1;alphadec=30+((samplefac-1)/3);p=thepicture;pix=0;lim=lengthcount;samplepixels=lengthcount/(3*samplefac);delta=(samplepixels/ncycles)|0;alpha=initalpha;radius=initradius;rad=radius>>radiusbiasshift;if(rad<=1)rad=0;for(i=0;i<rad;i++)radpower[i]=alpha*(((rad*rad-i*i)*radbias)/(rad*rad));if(lengthcount<minpicturebytes)step=3;else if((lengthcount%prime1)!==0)step=3*prime1;else{if((lengthcount%prime2)!==0)step=3*prime2;else{if((lengthcount%prime3)!==0)step=3*prime3;else step=3*prime4}}i=0;while(i<samplepixels){b=(p[pix+0]&0xff)<<netbiasshift;g=(p[pix+1]&0xff)<<netbiasshift;r=(p[pix+2]&0xff)<<netbiasshift;j=contest(b,g,r);altersingle(alpha,j,b,g,r);if(rad!==0)alterneigh(rad,j,b,g,r);pix+=step;if(pix>=lim)pix-=lengthcount;i++;if(delta===0)delta=1;if(i%delta===0){alpha-=alpha/alphadec;radius-=radius/radiusdec;rad=radius>>radiusbiasshift;if(rad<=1)rad=0;for(j=0;j<rad;j++)radpower[j]=alpha*(((rad*rad-j*j)*radbias)/(rad*rad))}}};var map=exports.map=function map(b,g,r){var i;var j;var dist;var a;var bestd;var p;var best;bestd=1000;best=-1;i=netindex[g];j=i-1;while((i<netsize)||(j>=0)){if(i<netsize){p=network[i];dist=p[1]-g;if(dist>=bestd)i=netsize;else{i++;if(dist<0)dist=-dist;a=p[0]-b;if(a<0)a=-a;dist+=a;if(dist<bestd){a=p[2]-r;if(a<0)a=-a;dist+=a;if(dist<bestd){bestd=dist;best=p[3]}}}}if(j>=0){p=network[j];dist=g-p[1];if(dist>=bestd)j=-1;else{j--;if(dist<0)dist=-dist;a=p[0]-b;if(a<0)a=-a;dist+=a;if(dist<bestd){a=p[2]-r;if(a<0)a=-a;dist+=a;if(dist<bestd){bestd=dist;best=p[3]}}}}}return(best)};var process=exports.process=function process(){learn();unbiasnet();inxbuild();return colorMap()};var unbiasnet=function unbiasnet(){var i;var j;for(i=0;i<netsize;i++){network[i][0]>>=netbiasshift;network[i][1]>>=netbiasshift;network[i][2]>>=netbiasshift;network[i][3]=i}};var alterneigh=function alterneigh(rad,i,b,g,r){var j;var k;var lo;var hi;var a;var m;var p;lo=i-rad;if(lo<-1)lo=-1;hi=i+rad;if(hi>netsize)hi=netsize;j=i+1;k=i-1;m=1;while((j<hi)||(k>lo)){a=radpower[m++];if(j<hi){p=network[j++];try{p[0]-=(a*(p[0]-b))/alpharadbias;p[1]-=(a*(p[1]-g))/alpharadbias;p[2]-=(a*(p[2]-r))/alpharadbias}catch(e){}}if(k>lo){p=network[k--];try{p[0]-=(a*(p[0]-b))/alpharadbias;p[1]-=(a*(p[1]-g))/alpharadbias;p[2]-=(a*(p[2]-r))/alpharadbias}catch(e){}}}};var altersingle=function altersingle(alpha,i,b,g,r){var n=network[i];n[0]-=(alpha*(n[0]-b))/initalpha;n[1]-=(alpha*(n[1]-g))/initalpha;n[2]-=(alpha*(n[2]-r))/initalpha};var contest=function contest(b,g,r){var i;var dist;var a;var biasdist;var betafreq;var bestpos;var bestbiaspos;var bestd;var bestbiasd;var n;bestd=~(1<<31);bestbiasd=bestd;bestpos=-1;bestbiaspos=bestpos;for(i=0;i<netsize;i++){n=network[i];dist=n[0]-b;if(dist<0)dist=-dist;a=n[1]-g;if(a<0)a=-a;dist+=a;a=n[2]-r;if(a<0)a=-a;dist+=a;if(dist<bestd){bestd=dist;bestpos=i}biasdist=dist-((bias[i])>>(intbiasshift-netbiasshift));if(biasdist<bestbiasd){bestbiasd=biasdist;bestbiaspos=i}betafreq=(freq[i]>>betashift);freq[i]-=betafreq;bias[i]+=(betafreq<<gammashift)}freq[bestpos]+=beta;bias[bestpos]-=betagamma;return(bestbiaspos)};NeuQuant.apply(this,arguments);return exports};

/**
 * This class lets you encode animated GIF files
 * Base class :  http://www.java2s.com/Code/Java/2D-Graphics-GUI/AnimatedGifEncoder.htm
 * @author Kevin Weiner (original Java version - kweiner@fmsware.com)
 * @author Thibault Imbert (AS3 version - bytearray.org)
 * @author Kevin Kwok (JavaScript version - https://github.com/antimatter15/jsgif)
 * @version 0.1 AS3 implementation
 */
GIFEncoder=function(){for(var i=0,chr={};i<256;i++)chr[i]=String.fromCharCode(i);function ByteArray(){this.bin=[]}ByteArray.prototype.getData=function(){for(var v='',l=this.bin.length,i=0;i<l;i++)v+=chr[this.bin[i]];return v};ByteArray.prototype.writeByte=function(val){this.bin.push(val)};ByteArray.prototype.writeUTFBytes=function(string){for(var l=string.length,i=0;i<l;i++)this.writeByte(string.charCodeAt(i))};ByteArray.prototype.writeBytes=function(array,offset,length){for(var l=length||array.length,i=offset||0;i<l;i++)this.writeByte(array[i])};var exports={};var width;var height;var transparent=null;var transIndex;var repeat=-1;var delay=0;var started=false;var out;var image;var pixels;var indexedPixels;var colorDepth;var colorTab;var usedEntry=[];var palSize=7;var dispose=-1;var closeStream=false;var firstFrame=true;var sizeSet=false;var sample=10;var comment="Generated by jsgif (https://github.com/antimatter15/jsgif/)";var setDelay=exports.setDelay=function setDelay(ms){delay=Math.round(ms/10)};var setDispose=exports.setDispose=function setDispose(code){if(code>=0)dispose=code};var setRepeat=exports.setRepeat=function setRepeat(iter){if(iter>=0)repeat=iter};var setTransparent=exports.setTransparent=function setTransparent(c){transparent=c};var setComment=exports.setComment=function setComment(c){comment=c};var addFrame=exports.addFrame=function addFrame(im,is_imageData){if((im===null)||!started||out===null){throw new Error("Please call start method before calling addFrame");}var ok=true;try{if(!is_imageData){image=im.getImageData(0,0,im.canvas.width,im.canvas.height).data;if(!sizeSet)setSize(im.canvas.width,im.canvas.height)}else{image=im}getImagePixels();analyzePixels();if(firstFrame){writeLSD();writePalette();if(repeat>=0){writeNetscapeExt()}}writeGraphicCtrlExt();if(comment!==''){writeCommentExt()}writeImageDesc();if(!firstFrame)writePalette();writePixels();firstFrame=false}catch(e){ok=false}return ok};var finish=exports.finish=function finish(){if(!started)return false;var ok=true;started=false;try{out.writeByte(0x3b)}catch(e){ok=false}return ok};var reset=function reset(){transIndex=0;image=null;pixels=null;indexedPixels=null;colorTab=null;closeStream=false;firstFrame=true};var setFrameRate=exports.setFrameRate=function setFrameRate(fps){if(fps!=0xf)delay=Math.round(100/fps)};var setQuality=exports.setQuality=function setQuality(quality){if(quality<1)quality=1;sample=quality};var setSize=exports.setSize=function setSize(w,h){if(started&&!firstFrame)return;width=w;height=h;if(width<1)width=320;if(height<1)height=240;sizeSet=true};var start=exports.start=function start(){reset();var ok=true;closeStream=false;out=new ByteArray();try{out.writeUTFBytes("GIF89a")}catch(e){ok=false}return started=ok};var cont=exports.cont=function cont(){reset();var ok=true;closeStream=false;out=new ByteArray();return started=ok};var analyzePixels=function analyzePixels(){var len=pixels.length;var nPix=len/3;indexedPixels=[];var nq=new NeuQuant(pixels,len,sample);colorTab=nq.process();var k=0;for(var j=0;j<nPix;j++){var index=nq.map(pixels[k++]&0xff,pixels[k++]&0xff,pixels[k++]&0xff);usedEntry[index]=true;indexedPixels[j]=index}pixels=null;colorDepth=8;palSize=7;if(transparent!==null){transIndex=findClosest(transparent)}};var findClosest=function findClosest(c){if(colorTab===null)return-1;var r=(c&0xFF0000)>>16;var g=(c&0x00FF00)>>8;var b=(c&0x0000FF);var minpos=0;var dmin=256*256*256;var len=colorTab.length;for(var i=0;i<len;){var dr=r-(colorTab[i++]&0xff);var dg=g-(colorTab[i++]&0xff);var db=b-(colorTab[i]&0xff);var d=dr*dr+dg*dg+db*db;var index=i/3;if(usedEntry[index]&&(d<dmin)){dmin=d;minpos=index}i++}return minpos};var getImagePixels=function getImagePixels(){var w=width;var h=height;pixels=[];var data=image;var count=0;for(var i=0;i<h;i++){for(var j=0;j<w;j++){var b=(i*w*4)+j*4;pixels[count++]=data[b];pixels[count++]=data[b+1];pixels[count++]=data[b+2]}}};var writeGraphicCtrlExt=function writeGraphicCtrlExt(){out.writeByte(0x21);out.writeByte(0xf9);out.writeByte(4);var transp;var disp;if(transparent===null){transp=0;disp=0}else{transp=1;disp=2}if(dispose>=0){disp=dispose&7}disp<<=2;out.writeByte(0|disp|0|transp);WriteShort(delay);out.writeByte(transIndex);out.writeByte(0)};var writeCommentExt=function writeCommentExt(){out.writeByte(0x21);out.writeByte(0xfe);out.writeByte(comment.length);out.writeUTFBytes(comment);out.writeByte(0)};var writeImageDesc=function writeImageDesc(){out.writeByte(0x2c);WriteShort(0);WriteShort(0);WriteShort(width);WriteShort(height);if(firstFrame){out.writeByte(0)}else{out.writeByte(0x80|0|0|0|palSize)}};var writeLSD=function writeLSD(){WriteShort(width);WriteShort(height);out.writeByte((0x80|0x70|0x00|palSize));out.writeByte(0);out.writeByte(0)};var writeNetscapeExt=function writeNetscapeExt(){out.writeByte(0x21);out.writeByte(0xff);out.writeByte(11);out.writeUTFBytes("NETSCAPE"+"2.0");out.writeByte(3);out.writeByte(1);WriteShort(repeat);out.writeByte(0)};var writePalette=function writePalette(){out.writeBytes(colorTab);var n=(3*256)-colorTab.length;for(var i=0;i<n;i++)out.writeByte(0)};var WriteShort=function WriteShort(pValue){out.writeByte(pValue&0xFF);out.writeByte((pValue>>8)&0xFF)};var writePixels=function writePixels(){var myencoder=new LZWEncoder(width,height,indexedPixels,colorDepth);myencoder.encode(out)};var stream=exports.stream=function stream(){return out};var setProperties=exports.setProperties=function setProperties(has_start,is_first){started=has_start;firstFrame=is_first};return exports};

// Lap
// 1.0
// 1.1 重写脚本，修正跨域问题
// 1.2 修正翻页、回贴后按钮消失问题
// 1.3 修正被重定向的图片无法获取的问题
// 1.4 添加支持图片插入文本，整合柏拉图样图森破的效果
//     看了柏拉图样图森破的脚本，原来GM_xmlhttpRequest就支持跨域，我真是想多了
(function() {
	var contain = {
		id: 'LapContain',
		title: '\u0028\u0E51\u2022\u0300\u3142\u2022\u0301\u0029\u0648\u2727',
		width: 689,
		height: 426,
		left: function() {
			return (document.documentElement.clientWidth / 2 - this.width / 2).toFixed(1) + 'px'
		},
		top: function() {
			return (document.documentElement.clientHeight / 2 - this.height / 2).toFixed(1) + 'px'
		}
	};
	var face = {};
	var imageList = {};
	var getImage = function(u, n, c) {
		var x = createElement('IFRAME', {style:'display:none'});
		x.onload = function() {
			x.contentWindow.postMessage(n, '*');
			var t = setInterval(function() {
				if (!imageList[n]) {
					return
				};
				var i = new Image();
				i.onload = function() {
					c(this)
				};
				i.src = URL.createObjectURL(imageList[n]);
				x.parentNode.removeChild(x), clearInterval(t)
			}, 1);
		};
		x.src = u;
		document.documentElement.appendChild(x)
	};
	var postImage = function(b, c) {
		var t = new XMLHttpRequest();
		t.open('GET', 'http://tieba.baidu.com/dc/common/imgtbs', true);
		t.onreadystatechange = function() {
			t.readyState == 4 && (function(tbs) {
				var f = new FormData(), x = new XMLHttpRequest();
				f.append('file', b);
				f.append('tbs', tbs);
				x.open('POST', 'http://upload.tieba.baidu.com/upload/pic', true);
				x.onreadystatechange = function() {
					x.readyState == 4 && (function(i) {
						c(i.pic_water.replace(/.*(\/[a-z0-9]{40}.jpg)$/, 'http://imgsrc.baidu.com/forum/pic/item/$1'), i.fullpic_width, i.fullpic_height)
					})(JSON.parse(x.responseText).info)
				};
				x.withCredentials = true;
				x.send(f)
			})(JSON.parse(t.responseText).data.tbs)
		};
		t.send()
	};
	var madeImage = function(l, x, y, m, c) {
		var t = this, u = arguments, a = 'image/jpeg', b = t.getContext('2d'), k = lapList[l].layer, v = k[x][y], n, s, f = function(i) {
			y == 0 && (x == 1 && (m = new GIFEncoder(), a = 'image/gif', m.setRepeat(lapList[l].repeat || 0), m.setDelay(lapList[l].delay || 84), m.start(), !1) || x > 0 && m.addFrame(b));
			b.save();
			v.r && b.rotate(v.r);
			v.style && (function() {
				for (var j in v.style) {
					j == 'strokeStyle' && (v.stroke = 1);
					b[j] = v.style[j]
				}
			})();
			v.text && (!v.stroke ? b.fillText(replaceText(v.text), v.x || 0, v.y || 0) : b.strokeText(replaceText(v.text), v.x || 0, v.y || 0));
			i && b.drawImage(i, v.x || 0, v.y || 0, v.w || t.width, v.h || t.height);
			b.restore();
			y = y < k[x].length - 1 ? y + 1 : (++x, 0);
			x < (!m ? 1 : k.length) ? madeImage.apply(t, u) : (c && c(toBlob((typeof(m) == 'object' ? (m.addFrame(b), m.finish(), m.stream().bin) : Array.prototype.map.call(atob(t.toDataURL(a).replace('data:' + a + ';base64,', '')), function(x) {return x.charCodeAt(0) & 0xff})), a)))
		};
		x == 0 && y == 0 && (t.height = lapList[l].height, t.width = lapList[l].width);
		if (v.text) {
			return f()
		};
		v.src == '[FACE]' ? (n = v.src, s = face.src) : (n = encodeURIComponent(l) + '&' + x + '&' + y, s = v.src);
		getImage(s, n, f)
	};
	var toBlob = function(s, f) {
		return new Blob([new Uint8Array(s).buffer], {type: f})
	};
	var createElement = function(e, s) {
		e = document.createElement(e), s = s || {};
		for (var i in s) {
			e.setAttribute(i, s[i])
		};
		return e
	};
	var removeContain = function(e) {
		var d = document.getElementById(contain.id);
		return d && (e && (e.preventDefault(), e.stopPropagation()) || d.parentNode.removeChild(d), !0)
	};
	var replaceText = function(t) {
		return t.replace(/\[FLOOR\]/g, face.floor).replace(/\[NAME\]/g, face.name).replace(/\[LEVEL\]/g, face.lid).replace(/\[LEVEL_NAME\]/g, face.lname).replace(/\[FOURM_NAME\]/g, !face.fname ? '\u65E0\u540D' : face.fname.getAttribute('fname'))
	};
	var createContain = function(e) {
		var i, j, t, d, o;
		removeContain();
		d = createElement('DIV', {id: contain.id, class: 'dialogJ dialogJfix dialogJshadow ui-draggable', style: 'z-index:60001;width:' + contain.width + 'px;left:' + contain.left() + ';top:' + contain.top()});
		d.innerHTML = '<div class=uiDialogWrapper><div class=dialogJtitle><span class=dialogJtxt>' + contain.title + '</span><a href=# class=dialogJclose title=\u5173\u95ED>&nbsp;</a></div><div class=dialogJcontent><div class=dialogJbody style=overflow-x:hidden;overflow-y:scroll;height:' + (contain.height - 66) + 'px></div></div></div>';
		document.body.appendChild(d);
		o = e.target.parentNode, face.src = o.querySelector('.p_author_face>IMG').src + '?t=' + (new Date()).getTime();
		o = JSON.parse(o.parentNode.parentNode.parentNode.parentNode.getAttribute('data-field')), imageList['[FACE]'] = null;
		face.floor = o.content.post_no, face.name = o.author.user_name, face.lid = o.author.level_id, face.lname = o.author.level_name, face.fname = document.querySelector('META[fname]');
		i = document.querySelector('#' + contain.id + ' .dialogJbody');
		for (j in lapList) {
			t = createElement('CANVAS', {style: 'cursor:pointer'});
			i.appendChild(createElement('DIV', {class: 'lapContent', data: j, style: 'float:left;margin:3px'})).appendChild(t);
			madeImage.call(t, j, 0, 0, 0)
		}
	};
	var createButton = function() {
		var f = document.querySelectorAll('.icon_relative');
		for (var i = f.length - 1; i > -1; i--) {
			var j = f[i].appendChild(createElement('DIV', {class: 'LAP_BUTTON', style: 'position:absolute;right:0;bottom:0;background-color:#eee;padding:0 3px 0 3px;border-radius:2px;box-shadow:0 0 1px #333'}));
			j.addEventListener('click', createContain, false);
			j.textContent = '\u8214'
		}
	};

	if (location.hostname != 'tieba.baidu.com') {
		window.addEventListener('message', function(e) {
			var i = new Image();
			i.onload = function() {
				var c = document.createElement('canvas');
				c.width = this.width, c.height = this.height;
				c.getContext('2d').drawImage(this, 0, 0);
				window.parent.postMessage(e.data + '!IMAGE_DATA!' + c.toDataURL(), '*')
			};
			i.src = location.href;
		}, false);
		return
	};

	window.addEventListener('message', function(e) {
		if (e.data.indexOf('!IMAGE_DATA!') == -1) {
			return
		};
		e = e.data.split('!IMAGE_DATA!');
		imageList[e[0]] = toBlob(Array.prototype.map.call(atob(e[1].replace('data:image/png;base64,', '')), function(x) {return x.charCodeAt(0) & 0xff}), 'image/png');
	}, false);

	window.addEventListener('resize', function() {
		var d = document.getElementById(contain.id);
		d && (d.style.left = contain.left(), d.style.top = contain.top())
	}, false);

	document.addEventListener('click', function(e) {
		e.target.className.indexOf('dialogJclose') != -1 && removeContain(e);
		e.target.parentNode.className.indexOf('lapContent') != -1 && removeContain(e) && (function() {
			var i = e.target.parentNode.getAttribute('data');
			window.scrollTo(0, 0xffffff);
			madeImage.call(createElement('CANVAS'), i, 0, 0, 1, function(b) {
				postImage(b, function(u, w, h) {
					document.getElementById('ueditor_replace').innerHTML += (lapList[i].text ? '<p>' + replaceText(lapList[i].text) + '</p>' : '') + '<p><img class=BDE_Image src="' + u + '" unselectable=on pic_type=0 height= ' + h + ' width= ' + w + '></p>' + (lapList[i].afterText ? '<p>' + replaceText(lapList[i].afterText) + '</p>' : '')
				})
			})
		})()
	}, false);

	(function() {
		var f = function() {
			!document.querySelector('.LAP_BUTTON') && createButton()
		};
		(new MutationObserver(f)).observe(document, {childList: true, subtree: true});
		f()
	})()

})();
