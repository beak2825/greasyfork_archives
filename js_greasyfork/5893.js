// ==UserScript==
// @name			W.A.R. Links Checker Premium
// @description		this script automatically checks links from hundreds of filehosts. For Firefox, Chrome, Opera, Safari & edge.
// @namespace		premium version
// @icon         data:image/png;base64,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
// @license			GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @author			mental
// @connect *
// @match    http://*.nexcess.net/*
// @exclude  http://*.nexcess.net*
// @match    https://pizzaonline.dominos.co.in/*
// @exclude  https://pizzaonline.dominos.co.in*
// @exclude  https://www.google.*
// @exclude  https://mega.io/
// @exclude  https://www.express-scripts.com/*
// @exclude  https://www.sous-titres.eu/*
// @include			http://*
// @include			https://*
// @include			file:///*
// @grant			GM_setValue
// @grant			GM_getValue
// @grant			GM_xmlhttpRequest
// @grant			GM_log
// @grant			GM_addStyle
// @grant			GM_registerMenuCommand
// @grant			GM_getResourceText
// @grant			GM_info
// @grant     GM_setClipboard
// @require			https://cdnjs.cloudflare.com/ajax/libs/crypto-js/4.0.0/crypto-js.min.js
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @require			https://ajax.googleapis.com/ajax/libs/jqueryui/1.9.1/jquery-ui.min.js
// @resource		jQueryUICSS https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/smoothness/jquery-ui.css
// @resource        https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/smoothness/images/ui-bg_flat_75_ffffff_40x100.png
// @resource        https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/smoothness/images/ui-bg_highlight-soft_75_cccccc_1x100.png
// @resource        https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/smoothness/images/ui-bg_glass_75_e6e6e6_1x400.png
// @resource        https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/smoothness/images/ui-bg_glass_75_dadada_1x400.png
// @resource        https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/smoothness/images/ui-bg_glass_65_ffffff_1x400.png
// @resource        https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/smoothness/images/ui-bg_glass_55_fbf9ee_1x400.png
// @resource        https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/smoothness/images/ui-bg_glass_95_fef1ec_1x400.png
// @resource        https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/smoothness/images/ui-icons_222222_256x240.png
// @resource        https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/smoothness/images/ui-icons_888888_256x240.png
// @resource        https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/smoothness/images/ui-icons_454545_256x240.png
// @resource        https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/smoothness/images/ui-icons_2e83ff_256x240.png
// @resource        https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/smoothness/images/ui-icons_cd0a0a_256x240.png
// @resource        https://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/smoothness/images/ui-bg_flat_0_aaaaaa_40x100.png
// @homepage        http://usa.x10host.com/mybb
// @namespace      war premium
// @noframes
// @version			1.7.3.3
// @downloadURL https://update.greasyfork.org/scripts/2024/WAR%20Links%20Checker%20Premium.user.js
// @updateURL https://update.greasyfork.org/scripts/2024/WAR%20Links%20Checker%20Premium.meta.js
// ==/UserScript==

var War_version = "1.7.3.3 November 02, 2025";

//separate alternative domains with "|" char (first name is considered being main)
var allHostNames = [
"rapidcloud.cc",
"fastupload.io",
"upload42.com",
"devuploads.com",
"qiwi.gg",
//"transfer.it",
"download.gg",
"rosefile.net",
"uploady.io",
"filedot.to|filedot.top",
"yourupload.com",
"dbree.me",
"hexload.com",
"pixeldrain.com",
"pixeldra.in",
"ufile.io",
"fireload.com",
"1dl.net",
"fastclick.to",
"takefile.link",
"wrzucaj.pl",
"filerice.com",
"frdl.io|frdl.is|frdl.my",
"darkibox.com",
"terabytez.org",
"fastfile.cc",
"gofile.io",
"send.cm",
"send.now",
"hexupload.net",
"drop.download",
"down.mdiaload.com",
"openload.cc",
"loadit.io",
"fastdrive.io",
"xubster.com",
"wplik.com",
"krakenfiles.com",
"fikper.com",
"cloud.189.cn",
"uploadocean.com",
"userupload.net",
"pan.lanzou.com",
"share.weiyun.com",
"lanzous.com",
"lanzoui.com",
"lanzoux.com",
"uploadship.com",
"stackstorage.com",
"turb.pw",
"uploadrar.com",
//"miui.rahim-soft.com",
"fireget.com",
"centfile.com",
"ddownload.com",
"filemia.co",
"speed-down.org",
"letsupload.to",
"gounlimited.to",
"mega4up.com",
"mega4upload.com",
"mega4up.org",
"datator.cz",
"mixdrop.co",
"desiupload.to|desiupload.co",
"uploadev.org",
"usersdrive.com",
"filesite.xyz",
"earn4files.com",
"europeup.com",
"mexa.sh",
"upload.st",
"mixloads.com",
"fileup.cc",
"nelion.me",
"oxycloud.com",
"ddl.to",
"turbo.to",
"hil.to",
"udrop.net",
"rocketshare.com",
"uploadproper.com",
"uploadproper.net",
"uplod.org",
"dfiles.eu",
"filebonus.com",
"filebonus.net",
"megadl.fr",
"upload4earn.com",
"upload2win.com",
"mon-partage.fr",
"filedeluxe.com",
"sora.io",
"freshfile.pl",
"1fichier.com|dl4free.com",
"megaup.net",
"anonfile.com",
"uploadkadeh.com",
"douploads.com",
"coolbytez.com",
"gfycat.com",
"indishare.me",
"4downfiles.org",
"backin.net",
"filefox.cc",
"sendit.cloud",
"9xupload.me",
"uploadbank.com",
"up-4ever.com",
"fileshd.net",
"flexydrive.com",
"hotlink.cc",
"fileshark.pl",
"uploads.to",
"uploadify.net",
"ausfile.com",
"filesha.com",
"upfiles.net",
"upfile.mobi",
"share.az",
"drive.google.com",
"erafile.com",
"mystore.to",
"littlebyte.net",
"bdupload.info",
"workupload.com",
"wayupload.com",
"cloud.mail.ru",
"fileshareup.com",
"usercloud.net",
"daofile.com",
"subyshare.com",
"mexashare.com",
"mx-sh.net",
"uploadgig.com",
"upload.af",
"imagenetz.de",
"katfile.com",
"katfile.cloud",
"dl.free.fr|getfile.pl",
"keepshare.net",
"myfiles.onl",
"uploadserv.com",
"uploading.site",
"filedwon.info",
"yandex.com",
"down4files.com",
"filespace.com",
"filespace.pl",
"uplod.it",
"rapidu.net",
"file.up09.com",
"lunaticfiles.com",
"filecad.com",
"filesupload.org",
"rapidrar.com",
"rapidrar.cr",
"pornfile.cz",
"pinkfile.cz",
"dinoshare.cz",
"file-share.top",
"pornoid.cz",
"dailyuploads.net",
"sharehost.eu",
"tezfiles.com",
"alfafile.net",
"multiup.org",
"filenuke.com",
"file.al|1f.al",
"vidto.me",
"filehost.pw",
"turbobit.ru",
"turb.to",
"turb.cc",
"sharesix.com|sharesix.net",
"swoopshare.com",
"2shared.com",
"fileupload.pw",
"up07.net",
"up07.me",
"4shared.com",
"adrive.com",
"pan.baidu.com",
"datei.to",
"daten-hoster.de|filehosting.org|xtraupload.de",
"depositfiles.com|depositfiles.lt|depositfiles.org|dfiles.ru|dfiles.eu|dfiles.com",
"divshare.com",
"easybytez.com",
"easybytez.eu",
"edisk.cz",
"file-upload.net",
"file-upload.com",
"file-upload.org",
"yadi.sk",
"fastshare.cz",
"fastshare.live",
"fastshare.cloud",
"filefactory.com",
"share.vnn.vn",
"yunpan.cn",
"tropicshare.com",
"inclouddrive.com",
"fileflyer.com",
"filerio.in",
"up.4share.vn",
"upfile.vn",
"worldbytez.com",
"files.mail.ru",
"box.com",
"uptobox.com",
"uptobox.eu",
"box.net",
"sdilej.cz",
"ex-load.com",
"filesmonster.com",
"filestore.to",
"filestore.me",
"filedropper.com",
"free-uploading.com",
"gamefront.com|filefront.com",
"gigapeta.com",
"hitfile.net",
"hitf.to",
"hitf.cc",
"htfl.net",
"hostuje.net",
"freefilehosting.net",
"free.fr",
"hyperfileshare.com",
"leteckaposta.cz|sharegadget.com",
"mediafire.com",
"movshare.net",
"narod.ru|narod.yandex.ru",
"fboom.me|fileboom.me",
"sharerapid.cz",
"rapidgator.net|rg.to",
"k2s.cc|keep2s.cc|keep2share.cc|keep2share.com",
"filepi.com",
"rarefile.net",
"rayfile.com",
"rghost.net",
"sendmyway.com",
"clicknupload.com",
"clicknupload.co",
"clicknupload.me",
"clicknupload.link|clickndownload.link",
"clicknupload.org|clickndownload.org",
"clicknupload.cfd|clickndownload.cfd",
"clicknupload.cc",
"clicknupload.to",
"clicknupload.club",
"clicknupload.red",
"clicknupload.click",
"clicknupload.site",
"clicknupload.online",
"clicknupload.download",
"clicknupload.vip",
"clicknupload.space|clickndownload.space",
"clicknupload.one",
"sharemods.com",
"hostr.co",
"sendspace.com",
"sharecash.org",
"share-links.biz",
"shareflare.net",
"stahovanizasms.cz",
"turbobit.net",
"turboupload.com",
"uloz.to",
"ulozto.net",
"ulozto.sk",
"ulozto.cz",
"uloziste.com",
"upload-il.net|przeslij.net",
//"uploaded.to|uploaded.net|ul.to",
"chayfile.com",
"rockfile.co",
"usaupload.net",
"veehd.com",
"videobb.com",
"vip-file.com",
"webshare.cz",
"xdisk.cz",
"yunfile.com|filemarkets.com",
"fileupup.com",
"wikiupload.com",
"uploadstube.de",
"flyfiles.net",
"prefiles.com",
"hackerbox.org",
"data.hu",
"brupload.net",
"uppit.com|up.ht|upx.nz",
"downloadani.me",
"filesabc.com",
"extmatrix.com",
"sendfiles.nl",
"yourfilestore.com",
"filebig.net",
"file4safe.com",
"filemac.com",
"gboxes.com",
"novafile.com",
"longfiles.com",
"bitupload.com",
"indowebster.com",
"superload.cz",
"hellupload.com",
"sendspace.pl",
"fastshare.org",
"filejoker.net",
"sendurl.me",
"filestore.com.ua",
"rapidfileshare.net",
"filedais.com",
"nitroflare.com",
"nitro.download",
"up.top4top.net",
"upload.ee",
"shareplace.org",
"uploadc.com",
"mightyupload.com",
"anysend.com",
"upstore.net",
"upsto.re",
"speedy.sh",
"salefiles.com",
"datoid.cz",
"streamfile.com",
"filemoney.com",
"uploadboy.com",
"uploadboy.me",
"speedshare.eu",
"google.com|google.be",
"unlimitzone.com",
"jumbofiles.org",
"fshare.vn",
"spaceforfiles.com",
"up.media1fire.com",
"dropbox.com",
"redbunker.net",
"mega.nz|mega.co.nz",
"storageserver.co.uk",
"anafile.com",
"sharerepo.com",
"sfshare.se",
"files.fm",
"koofile.com",
"doraupload.com",
"upnito.sk",
"vidoza.net",
"intoupload.net",
"lilfile.com",
"down.fast-down.com",



];

try
{
	//iframes excluded
	if (window.top != window.self)
	{
		return;
	}

	//allHostNames sites excluded
	if (window.location.href.match("https?:\/\/(www\.)?[\w\.-]*(?:" +
						allHostNames.join("|").replace(/\./g, "\\.").replace(/-/g, "\\-") +
																		")"))
	{
		return;
	}
}
catch (e)
{
	return;
}

//separate alternative domains with "|" char (first name is considered being main)
var allContainerNames = [
"adf.ly",
"linkcrypt.ws",
"linksafe.me",
"linkto.net",
"madlink.sk",
"mirrorcreator.com",
"redi.re",
"relink.us",
"safelinking.net",
"theloo.katt.it",
"bit.ly",

];

//separate alternative domains with "|" char (first name is considered being main)
var allObsoleteNames = [
"zxcfiles.com",
"ziddu.com",
"kolombox.com",
"zapfile.net",
"faststore.org",
"file.bz",
"filescdn.com",
"filescdn.net",
"ortofiles.com",
"dropapk.com",
"dropapk.to",
"tusfiles.net",
"tusfiles.com",
"uploadex.com",
"userscloud.com",
"solidfiles.com",
"zippyshare.com",
"xshare.eu",
"wizupload.com",
"vshare.io",
"tikfile.com",
"ninefile.com",
"thefile.me",
"oboom.com",
"bayfiles.com",
"vidzi.tv",
"videoweed.es",
"fileflares.com",
"uploads.ws|upl.me",
"hellshare.cz",
"hellshare.sk",
"download.hellshare.sk",
"download.hellshare.cz",
"download.cz.hellshare.com",
"hellshare.com",
"anonfiles.com",
"hellspy.cz",
"hellspy.com",
"stiahnito.sk",
"wrzucajpliki.pl",
"wupfile.com",
"filesin.space",
"upx.nz",
"frdl.to",
"frdl.pw",
"unibytes.com",
"datafilehost.com",
"ge.tt",
"thevideo.me",
"vidbull.com",
"filehoot.com",
"stagevu.com",
"streamin.to",
"temp-share.com",
"rusfolder.com",
"rodfile.com",
"rioupload.com",
"queenshare.com",
"pobierz.to",
"partage-facile.com",
"uploaded.net",
"uploaded.to",
"ul.to",
"grandshare.net",
"ozofiles.com",
"owndrives.com",
"nowvideo.sx",
"novamov.com",
"nosupload.com",
"myvdrive.com|fileserving.com",
"movpod.in",
"mixturecloud.com",
"minhateca.com.br",
"megafileupload.com",
"megafiles.us",
"media4up.com",
"mafiastorage.com",
"load.to",
"lafiles.com",
"kumpulbagi.com|kumpulbagi.id",
"kingfiles.net",
"kingfile.pl",
"kb.simple-aja.info",
"jeodrive.com",
"ifolder.ru",
"hulkload.com",
"gorillavid.in",
"go4up.com",
"gigasize.com",
"gettyfile.ru",
"eyesfile.ca",
"exoshare.com",
"exclusiveloader.com",
"exbit.net",
"easy-share.com|crocko.com",
"divxpress.com",
"dir50.net",
"devilshare.net",
"debrid.pl",
"dailyfiles.net",
"cloudyfiles.com|cloudyfiles.org",
"cloudtime.to",
"cloudstor.es",
"cloudsix.me",
"cloudshares.net",
"catshare.net",
"bytewhale.com",
"borncash.org",
"bittfox.com",
"bitshare.com",
"bigfile.to",
"bankupload.com",
"avatarshare.com",
"arabloads.net",
"amonshare.com",
"alltu.eu",
"akafile.com",
"aisfile.com",
"acefile.net",
"700files.com",
"4upld.com|expressleech.com",
"4file.net",
"2giga.link",
"2downloadz.com",
"ifile.it",
"share-online.biz",
"bezvadata.cz",
"letsupload.co",
"letsupload.cc",
"egoshare.com",
"datafile.com",
"ncrypt.in",
"magic4up.com",
"ulozisko.sk",
"firstplanet.eu",
"multiload.cz",
"bitster.cz",
"therapide.com",
"drop.me",
"euroshare.eu",
"lix.in",
"superbshare.com",
"filecloud.io",
"ayefiles.com",
"black-label.pro",
"filesflash.com",
"filesflash.net",
"suprafiles.net",
"suprafiles.co",
"suprafiles.org",
"stiahni.si",
"suprafiles.me",
"srfiles.com",
"sfiles.me",
"4up.me",
"depfile.com",
"Jeodrive.com",
"depfile.us",
"dipfile.com",
"ssh.tf",
"led.wf",
"lan.wf",
"adlink.wf",
"click.tf",
"ssh.yt",
"yep.pm",
"kyc.pm",
"crazyshare.cc",
"megarapid.cz",
"axifile.com",
"creafile.net",
"cloudzilla.to",
"uploadrocket.net",
"usersfiles.com",
"uplea.com",
"datoteke.com",
"uploadable.ch",
"neodrive.co",
"demo.ovh.eu",
"filesin.com",
"fileswap.com",
"junocloud.me",
"gulfup.com",
"hexupload.com",
"secureupload.eu",
"hugefiles.net",
"jumbofiles.com",
"letitbit.net",
"lolabits.es",
"nowdownload.ch",
"openfile.ru",
"radicalshare.com",
"remixshare.com",
"storefiles.co",
"oload.tv",
"oload.stream",
"oload.net",
"openload.co",
"openload.io",
"toutbox.fr",
"uploadbaz.com",
"uploadingit.com",
"uploading.com",
"verzend.be",
"vidplay.net",
"vidxden.com",
"xfileload.com",
"warped.co",
"xkeepfile.com",
"abelhas.pt",
"uploadspace.pl",
"allmyvideos.net",
"uploads.xxx",
"netkups.com",
"nekaka.com",
"vidspot.net",
"myupload.dk",
"muchshare.net",
"loudupload.net",
"idup.in",
"hulkshare.com",
"goldbytez.com",
"filesmelt.com",
"fileband.com",
"uloz.cz",
"secured.in",
"rapidfilehost.com",
"fileover.net",
"fileinz.com",
"linksave.in",
"seenupload.com",
"sangfile.com",
"filepost.com|fp.io",
"sharingmaster.com ",
"24uploading.com",
"storagon.com",
"sanshare.com",
"filestorm.to",
"uploadnet.co",
"180upload.com",
"rapidsonic.com",
"fileparadox.com",
"4upfiles.com",
"geupload.com",
"lenfile.com",
"fileparadox.in",
"uploadhero.co",
"uploadhero.com",
"newfileland.com",
"quickshare.cz",
"elffiles.com",
"netload.in",
"netload.me",
"movreel.com",
"migahost.com",
"krotix.net",
"jumbofile.net",
"edoc.com",
"cramit.in|cramitin.net",
"freakshare.com",
"burnupload.com|burnupload.ihiphop.com",
"freakshare.net",
"daj.to",
"bl.st",
"2drive.net",
"ryushare.com",
"crisshare.com",
"tufiles.ru",
"uncapped-downloads.com",
"sockshare.com",
"ddlstorage.com",
"dataport.cz",
"dizzcloud.com",
"sharebeast.com",
"stahovadlo.cz",
"shared.com",
"storage.to",
"putlocker.com",
"lumfile.com",
"lumfile.se",
"lumfile.eu",
"firedrive.com",
"fileshare.in.ua",
"filecore.co.nz",
"filecore.co",
"iskladka.cz",
"file-rack.com",
"fast-load.net",
"subory.sk",
"bigandfree.com",
"fileop.com",
"mujsoubor.cz",
"sendfile.to",
"superfastfile.com",
"quickyshare.com",
"duckload.com",
"uploadstore.net",
"meinupload.com",
"dualshare.com",
"2xupload.to|2xupload.de",
"oxedion.com",
"uploadline.com",
"dll.bz",
"movieshare.in",
"milledrive.com",
"quickupload.net",
"safelink.in",
"metadivx.com",
"divxlink.com",
"uploadrack.com",
"teradepot.com",
"dataup.to",
"upit.to",
"driveway.com",
"eatlime.com",
"a2zuploads.com",
"friendlyfiles.net",
"flyfile.us",
"speedyshare.com",
"uploadspace.eu",
"keepfile.com",
"piggyshare.com",
"uplly.com",
"filecrown.com",
"6giga.com",
"uploadjockey.com",
"bluehost.to",
"filegu.ru",
"filebase.to",
"up-file.com",
"xvideos.com",
"ufox.com",
"filebling.com",
"loaded.it",
"uploadcell.com",
"uploadshare.cz",
"mangoshare.com",
"filestab.com",
"crazyupload.com",
"gaiafile.com",
"sharejunky.com",
"fileho.com",
"bigandfree.com",
"bigfile.in",
"bigshare.eu",
"dahosting.org",
"digisofts.net",
"file4save.com",
"filechip.com",
"filescloud.com",
"saveqube.com",
"turboshare.de",
"z-upload.com",
"youshare.com",
"jiffyupload.com",
"gigeshare.com",
"datenklo.net",
"upload.dj",
"loadfiles.in",
"upit.to",
"dsfileshare.com",
"sharesimple.net",
"4files.net",
"wooupload.com",
"odsiebie.com",
"filenavi.com",
"3oof.com",
"meshwaar.com",
"maxupload.com",
"share.cx",
"atserver.eu",
"hotfiles.ws",
"esnips.com",
"tuxfile.com",
"file2upload.net",
"filebling.com",
"turboshare.com",
"rarhost.com",
"isharehd.com",
"i741.com",
"dataup.de",
"fofly.com",
"shareonall.com",
"sexuploader.com",
"megaupload.com|megavideo.com|megaporn.com|megarotic.com",
"uploadhyper.com",
"filespawn.com",
"caizzii.com",
"volnyweb.cz",
"usershare.net",
"filescash.net",
"metahyper.com",
"combozip.com",
"x7.to",
"uploadbox.com",
"enterupload.com|flyupload.com",
"filepoint.de",
"mystream.to",
"x-fs.com",
"shareator.com",
"srapid.eu",
"sosame.cz",
"filesdump.com",
"2-klicks.de",
"uploking.com",
"silofiles.com",
"upfile.in",
"filehook.com",
"uploadking.com",
"uploadhere.com",
"kewlshare.com",
"rapidable.com",
"uploadwaste.com",
"filemup.com",
"filesonic.com|sharingmatrix.com",
"fileserve.com",
"wupload.com",
"skipfile.com",
"smartuploader.com",
"dualshare.com",
"storeandserve.com",
"mountfile.com",
"transitfiles.com",
"uploadstation.com",
"filejungle.com",
"shareshared.com",
"quickyshare.com",
"save.am",
"petandrive.com",
"file2box.com",
"flyshare.cz",
"yabadaba.ru",
"cloudcache.cc",
"yourfilehost.com",
"jakfile.com",
"kickload.com",
"pyramidfiles.com",
"refile.net",
"zshare.net",
"ddlani.me|ddlanime.com",
"ftp2share.com",
"fooget.com",
"rapidhide.com",
"gotupload.com",
"mooload.com",
"zupload.com",
"mytempdir.com",
"onionshare.com",
"stahnu.to",
"oron.com",
"badongo.com",
"filereactor.com",
"filegaze.com",
"4bytez.com",
"1hostclick.com",
"anonstream.com",
"batshare.com",
"bitroad.net",
"brontofile.com",
"cloudnxt.net",
"cloudnator.com|shragle.com",
"filesfrog.net",
"coolshare.cz",
"dotavi.com",
"ezyfile.net",
"file-bit.net",
"filecosy.com",
"fileduct.com|fileduct.net",
"filefat.com",
"filelaser.com",
"filemashine.com",
"fileserver.cc",
"filetechnology.com",
"fireuploads.net",
"gigfiles.net",
"holderfile.com",
"ihostia.com",
"k2files.com",
"mojofile.com",
"ovfile.com",
"qshare.com",
"shafiles.me",
"sharefilehost.com",
"shareupload.com",
"stahuj.to",
"ugotfile.com",
"uploadboost.com",
"fileom.com",
"vidhog.com",
"xfileshare.eu",
"bzlink.us",
"bulletupload.com",
"bloggerarticles.com",
"mojedata.sk",
"sharpfile.com",
"upgrand.com",
"nasdilej.cz",
"mediatack.cz",
"share-it.to",
"primeupload.com",
"filebeer.info",
"baberepublic",
"xtu.me",
"sharebase.de",
"luckyshare.net",
"filerobo.com",
"filevelocity.com",
"filezpro.com",
"file4sharing.com",
"cing.be",
"ufile.eu",
"pigsonic.com",
"fileupped.com",
"sharerun.com",
"filesaur.com",
"rapidslnare.com",
"bestsharing.com",
"savefiles.net",
"file2share.biz",
"filecache.de",
"monsteruploads.eu",
"b9bb.com",
"aiotool.net",
"jamber.info",
"megaftp.com",
"desiupload.net",
"file27.com",
"yastorage.com",
"filehost.ws",
"copyload.com",
"venusfile.com",
"aieshare.com",
"terafile.co",
"terafile.com",
"fileza.net",
"filerose.com",
"squillion.com",
"fileprohost.com",
"bitbonus.com",
"warserver.cz",
"uload.to",
"sharedbit.net",
"megaload.it",
"filewinds.com",
"uploadcore.com",
"syfiles.com",
"eyesfile.com",
"hotfile.com",
"superupl.com",
"oteupload.com",
"henchfile.com",
"filegag.com",
"HenchFile.com",
"filedefend.com",
"share-rapid.com|rapids.cz|share-credit.cz|share-central.cz|share-ms.cz|share-net.cz|srapid.cz|share-rapid.cz",
"megabitshare.com",
"cloudzer.com",
"asfile.com",
"cloudzer.net",
"clz.to",
"extabit.com",
"247upload.com",
"2download.de",
"4fastfile.com",
"asixfiles.com",
"berofile.com",
"bigupload.com",
"cepzo.com",
"clouds.to",
"cobrashare.sk",
"coraldrive.net",
"cyberlocker.ch",
"czshare.com",
"darkport.org",
"dark-uploads.com",
"davvas.com",
"enigmashare.com",
"erofly.cz",
"fastsonic.net",
"filebox.com",
"filecity.net",
"filedap.com",
"filedino.com",
"filedownloads.org",
"filefolks.com",
"fileking.co",
"filemates.com",
"files.to",
"files2k.eu",
"filesector.cc",
"filesega.com",
"filesend.net",
"filestay.com",
"filestrum.com",
"fileuplo.de",
"forunesia.com",
"freeuploads.fr",
"uploa.dk",
"getthebit.com",
"getzilla.net",
"goldfile.eu",
"good.com",
"grupload.com",
"hellfile.com",
"hipfile.com",
"hitfile.com",
"hulkfile.eu|duckfile.net",
"i-filez.com",
"ifile.ws",
"kupload.org",
"packupload.com",
"lemuploads.com",
"limelinx.com",
"maxshare.pl",
"megarelease.org",
"megashares.com",
"megashare.com",
"minus.com",
"mlfat4arab.com",
"multishare.cz",
"nirafile.com",
"ok2upload.com",
"peejeshare.com",
"premiuns.org",
"przeklej.net",
"qkup.net",
"rapidupload.sk",
"rockdizfile.com",
"rocketfile.net",
"share-now.net",
"share76.com",
"sharebees.com",
"sharefiles.co",
"sharefiles.com",
"slingfile.com",
"sms4file.com",
"space4file.com",
"tigershare.net",
"toucansharing.com",
"ubuntuone.com",
"unextfiles.com",
"upaj.pl",
"upfile.biz",
"uploadbin.net",
"uploadic.com",
"uploadinc.com",
"uploading4u.eu",
"uploadjet.net",
"uploadorb.com",
"upthe.net",
"uptorch.com",
"vidbox.yt",
"videozer.com",
"vreer.com",
"wallobit.com",
"zooupload.com",
"privatefiles.com",
"xerver.co",
"BillionUploads.com",
"rapidshare.com",
"rapidshare.ru",
"4savefile.com",
"dodane.pl",
"dotsemper.com",
"egofiles.com",
"epicshare.net",
"fiberupload.net",
"filemonkey.in",
"filemonster.net",
"filepom.com",
"filesbb.com",
"filevice.com",
"gigaup.fr",
"isavelink.com",
"loombo.com",
"megafiles.se",
"migupload.com",
"mydisc.net",
"nitrobits.com",
"potload.com",
"redload.net",
"shareprofi.com",
"sharesuper.info",
"sinhro.net",
"speedfile.cz",
"speedshare.org",
"storage.novoro.net",
"swankshare.com",
"swatupload.com",
"upafile.com",
"uploadmachine.com",
"uploadsat.com",
"upshared.com",
"usefile.com",
"yourfiles.to",
"zomgupload.com",
"ultramegabit.com",
"uploadto.us",
"inafile.com",
"vodlocker.com",
"megairon.net",

];
///////////////////////////////////////////////////////////////////////////////////////
var firstRun = GM_getValue("First_run", true);

var chromeBrowser = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());
//////////////////////////////////////////////////////////////////////////////////////
try
{
	var thisVersion = GM_info.script.version; //not supported in Scriptish and others
	var last_known_version = GM_getValue("last_known_version", "");
	if (!last_known_version)
	{
		last_known_version = thisVersion;
		GM_setValue("last_known_version", last_known_version);
	}
	//var newVersion = !(thisVersion == last_known_version);
	var newVersion = !(a.replace(/^(\d+\.\d+\.\d+).*/,'$1') == b.replace(/^(\d+\.\d+\.\d+).*/,'$1')); //true only if one of the first three numbers differs
	GM_setValue("last_known_version", thisVersion);
}
catch (err)
{
	var newVersion = false;
}

var now = (new Date()).getTime();
var last_custom_rules_nag = GM_getValue('last_custom_rules_nag', 0);
if (!last_custom_rules_nag)
{
	last_custom_rules_nag = now;
	GM_setValue('last_custom_rules_nag', ''+now);
}


allHostNames.sort();
allContainerNames.sort();
allObsoleteNames.sort();

var RAND_STRING = "8QyvpOSsRG3QWq";
var DEBUG_MODE = false;

var TOOLTIP_MAXWIDTH = 600; //in pixels
var TOOLTIP_THUMBWIDTH = 200;

var containers_processed = false;

//settings for keyboard functions start
var CHECK_ALL_LINKS_KEY = "A";
var CONFIGURATION_KEY = "C";
var copy_to_dead_key = "D";
var copy_to_live_key = "L";
var toggle_autocheck_key = "W";
var toggle_Enable_Anonymizer_key = "Z";
var first_key_keycode = '17'; // 18=ALT 16=Shift 17=Ctrl 32=SPACE_BAR 9=TAB
var first_key_keycodename = 'CTRL';
var second_key_keycode = '18';
var second_key_keycodename = 'ALT';
var CHECK_ALL_LINKS_KEYCODE = CHECK_ALL_LINKS_KEY.charCodeAt(0);
var CONFIGURATION_KEYCODE = CONFIGURATION_KEY.charCodeAt(0);
var copy_to_dead_keycode = copy_to_dead_key.charCodeAt(0);
var copy_to_live_keycode = copy_to_live_key.charCodeAt(0);
var toggle_autocheck_keycode = toggle_autocheck_key.charCodeAt(0);
var toggle_Enable_Anonymizer_keycode = toggle_Enable_Anonymizer_key.charCodeAt(0);
//settings for keyboard functions end

//global settings start
var Show_black_background_in_DL_links, Show_line_through_in_dead_links, Color_DL_links;
var Live_links_color, Dead_links_color, Temp_unavailable_links_color, Premium_links_color, Ref_anonymize_service;
var Do_not_linkify_DL_links, Keyboard_functions, Autocheck, Enable_Anonymizer;
var Processbox_Pos_X, Processbox_Pos_Y, Progressbox_Scaling;
var Show_progress_stats, Display_tooltip_info, Icon_set;
var Progress_box_opacity, Progress_box_background_color, Progress_box_item_color;
var Progress_box_refresh_rate;
var Obsolete_file_hosts;
var Custom_rules, Custom_rules_text;
var Progress_box_Pos_X, Progress_box_Pos_Y, Progress_box_Scaling;

var messageBox = document.createElement('b'); // top-left message box

var cLinksTotal = 0;
var cLinksDead = 0;
var cLinksAlive = 0;
var cLinksUnava = 0;
var cLinksprem = 0;
var cLinksProcessed = 0;

var intervalId; //for updateProgress()

//icon resources
var PAW_ICON_GREEN = 	'data:image/png;base64,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';
var PAW_ICON_RED = 		'data:image/png;base64,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';
var PAW_ICON_YELLOW =	'data:image/png;base64,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';
var	PAW_ICON_PINK =	  'data:image/png;base64,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';

var RSLC_ICON_GREEN =   'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AMJCQY36Sc4vgAAAlRJREFUeNpV0r9PE3EABfD3veu1lJYr15ZCoBHBqJBAMEbjL0hYFAkyOAmJMUYd/Q+cXF1wYPQPILppYkKIRARiMDGoaAKimBaKHMWDXnu93venE0Tf9Ib3tg/BP7m3NGgwxtKcM4vyIKSk4BBqnwux9/LGKjvckcNy9/1Akgk2ZJHMWNyw+qWUMSGZ51R2FzbdX1NSyOnZWznn6HRn8UqSCv6gLdz58GSsL2voURJIirAWhh+U1fLO4tbKztdJIvHsw/1NR7/97pJBOR9tDXc+6rMGsg4vkd3AhkMdVJgLounkdKLHdL1S13ZpdyMzbK5pnNF0I0mNn4r3Ze3AJrZvo0zL8KkPyil6rTOgipFzrRezLXVt4zWKtBbwWjIeTgyEQlHiUhepcBpNkSaYehxX20Yw2HYd3VYP6iNRYhrpAeojGfJqvs7rRIyKGpSUGOm4iYgWwX7wB72ps/hWXMZCbgaNkUYQrseUr3SNB0JQRj0DBnSlYWN/DcfNEzifuYzVvS94vf4cVeoiBB2ScY8IiBBnytk7KM5XG8qj9SRClrbnUKNVZKLNWMjPwKkWkYk146BSUbZrz0PC0ZuHzaBYLokq9S90p3pMJRnJl35gtfgZQnAko0lY4WY1+2lu63s+N0EE+agXXrkydc3czjtF7noHXccSx82mWIY0hBpgRVMIalK9WX67tfJzfZJo5EVuouAdieh4kk3KQA21J1rGmuoy/UToMSG5t+vaC5u/7Smikenc04LzHyMAaH+cNcBVGgyWClSIgHAA+2DYy00Wjuz9Bce5MucW9xnuAAAAAElFTkSuQmCC';
var RSLC_ICON_RED = 	  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AMJCQkjdGXwDAAAAcpJREFUeNptkj9PFHEQhp/ZBcIhxyKHYgNCYUxogE0OpdDGxsQCY6e5ggS1Mn4Ce621u7MCYqOdX4DkSLTBqwyNiQmJBiJiDjmWP/ub1+IAMXGqmTx5M5nJY5wpwRiQHPfoL2rG8PVksDOBlKRYZWgwxcwkIQlc0o+fDe3sPu6E1dOQIGWg/yUT4zOUBiLtHYAHFBy6YvRrW+Hzl4/e/P2kAJ8iwRhJscrE+AzDwxG3Z2E/oO9bKMvhzj104aLZ1dFr9PZUWzDWASQMDaYqDZjdvAWzd2HkMlpcJKpUsMlJdHiI3i1Ffr4v9d29pEMnt7UyfOkNNjKKTU8Tl8tghq+sEGqvUZwjZA5EAiShPIetLXxhASSIY3An1Gr4xkabq70iar9OkOeoWCSqVMAM8hzMiObnIUnQ0RFyR0DkgNylzhh7cB+bmsLrdQ7n5gj1OlG5TPxoHro7kUsC4mdQUB5u0NdziW/r5q2M/PkLfG2NsLwMkRHevyVkWQib26t+FJYMIIOUvt5XdmXkunXEke/sQchRCNDdRfAQ8vXND97af1qCxqkRLUj9XKFq/cUUMMmRQHKFZquh7OBhCRr/aATQ/I97foxKZ9z7A9QA5voyr3dtAAAAAElFTkSuQmCC';
var RSLC_ICON_YELLOW =	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH2AQJDBgxYO68rwAAAZNJREFUeNptkr9LW1EcxT/3GhOTKIG8QTpm8B8IIoJTFkFwsXVyUaxFJHYoFzJYUVFHn4sKtoidCoKtIigWOtQOhRKowaFzJwcF0VeJ+fFe7nUwP57R7/S9nO+595z7PQJfGUgAsWqPaUBOC/yrHQI+QjKTXc7GQq4EhP+uKzdUcbtnelvhDzXQQHL2bCkbxhOA5GmZ24LUC73zPWE4lQYSmexynaCmjh5Nq9FdANER1uL9j7nfeUhIIFaVJNXEPrguKvPzgfD2G0iBGt8DkPG4CGiIyapZAWBvDUEoBOfnqPQxaANxC3v7Ze1hoQFpmsTbGwMQicLNNeTz2HaKYuO/4DnTauwLeC6i8wW4ZdSbA9rw/GtB6kaPmjyESATKZVZWUxAMQqnI9MTXOqdGcvRFoSw8o+0Pg1DxsD+PcFcJYH8aphSNsr71CkAH/17danAEQAGSa98zv7x4W9AIpGkRzap18cKU3vUv9lmQq6N5SH7cSZ8Uuqx205SI1rPL/6/HN1MW5GiKC84z2at6dixf9u4B/PqUtJuX27QAAAAASUVORK5CYII=';
var RSLC_ICON_PINK = 	  'data:image/png;base64,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';

var NEW_ICON_GREEN = 	'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAACGklEQVR42mNkIBcwMWQwsDMrMZKhlZmRi2mCWYtE9st1bx+SagAPlwTLCt+pot6vrv/8t7/mnQcpBsjI6jNvDp4uZvDuMw/D8uA7U39/+Z9DrAGG5r5Mmz06pKQ//BVnWJl89daL0z8MgeLfiDHAN6SAaZlhjjzP+x8SDAcX3P1zuueVDVD8JEiSkVOcZbWAJKPi8wu/q4H8nSgBzcyQl9jN1ifvp8z8+acQw50brxk2Rd1u+fvzfy1MDaN7DOO7ohnSgqe2Pf0/rYJh1/N7/0uB4tdYuRknJMzgzZYyV2L89pub4c3Xbwwb4q+de3/9pwVQ/jfcAGYWhrJ5x207ZdSFGB59Ockwb+L3vydX/7oRPYFPW05DnuHbb1aGD79+MRyZev/H9TlvTIB6riK7EhQGbNr2rJe714eq/fjLwPD8x22GO5/eM/CzijN8BdoD0nz3/FuG/an3Sv7/ZehFDyBYIHplzFHcYullyPjp13eGj79/MHwEagRpfvPpB8OuuJsHvz785QRU9w+XAQwCMkyby3aZ+/xj5YBr/vDzD8OpngefHq55rw9U8gBbFCFHo4pljvAV60x19o+/fgMN+cNw79h7hjNFD5IZ/jPMwxXHKOmAmYOxPWCNWgWzKBfDm7c/GY4m3Nr089Uff3yJBD0h8Ug68tzQbVCUvtD66PWrXR91gWIvSTEABOw5pNlKfjz91QNkHySUTAGg7t0uvj1ytQAAAABJRU5ErkJggg==';
var NEW_ICON_RED = 		'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAA6klEQVQ4jbWTwWrCQBRFz6Rxnay6iuAXlJIg+BHZZR/d6++4t/5MpRQRf8CCrurGrDP6uumESTol04J3dbmPd7hvYBTAG5QBzIFH/PQpsBzDWm2gDGEFKM9lIxGYBSEsustRnpPWNZkImQip1sRF0QUoBQv1DgdgZE9SrdmGIX0Z8NFKni8XHqIIgEzkR+dMhGtVsYvjJgt6L+1Rq4FN/hcA2md01a0PjhPM8n44bDLjXeBf36A+nZzeG+Cr+wEGSeL0LsDZDq5VBcDT8dhkxpuZpbN6hXIAL76Vbd1gqgC+IX/6zhqWE1h/AYSwSjYrmXJlAAAAAElFTkSuQmCC';
var NEW_ICON_YELLOW =	'data:image/png;base64,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';
var	NEW_ICON_PINK =	  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABUklEQVQ4jY3TsUuWURQG8F8WEvFNDREfIg5RURAOIeL0DhJBS0tDY9BQQ0Oj29kiIvoDhBpFQRTUD1GKi0sRtEs0SEQ0RBQIRcVXw3eF6+vrWwcunPvc53nuPffcS0uEmA0x38Y5cohwGjOYxBBe4VGI3j8NQlzHYhaW0cfNEAslWCfBw4yvYhkv8hjCgxD7yMdquw/jbJ4+xq2cz+AKdrJRv9EAv/EDx3Ft75QhtrHdcFpHy0mS/lSqcVzAFM7he6XaTNLXJoOmS+ziOc4XcB893A3xodUgm5zAHdzHSLH0DhdD/GwsoSjlV5Je5nK+YQUTOInXSXq7x6134RQuo4unGf6Me7iKMxgrNfUuXMJazr8U+DA6Of/UZrCF9xjFM3zELpZwOptulIKmLlQGNXdqS7u4EWK9BA9cYpJ2KtWcwaMazcInuB3iTZ3fGv/znf8CBMxX4hrPUbUAAAAASUVORK5CYII=';

//global settings end
if (window.opera && !window.console)
{
	window.console = {};

	function fn()
	{
		opera.postError(arguments);
	};
	['log', 'debug', 'info', 'warn', 'error', 'assert', 'dir', 'dirxml', 'group', 'groupEnd', 'time', 'timeEnd', 'count', 'trace', 'profile', 'profileEnd'].forEach(function (name)
	{
		window.console[name] = fn;
	});
}

//displays colored text in message box
function sendMessage(text, color)
{
	var msgDiv = document.createElement('div');
	msgDiv.style.color = color;
	msgDiv.innerHTML = text;
	messageBox.appendChild(msgDiv);
	setTimeout(function(){messageBox.removeChild(msgDiv)}, 3000);
}

function linkify(totalourls)
{ // code from http://userscripts.org/scripts/review/2254  Linkify ting
	var ikkeTilladteTags;

	var allLinksRegex = "(?:http:\/\/.+?\\?)?(?:https?:\/\/)?"
		+ "[0-9A-Za-z]+(?:[\\.-][0-9A-Za-z]+)*\\.[A-Za-z]+"   //instead of totalourls
		+ "[\\w\\–\\-\\.+$!*\\/()\\[\\]\',~%?:@#&=\\\\\\—;…×Ã\\_\\u0080-\\u03FF’‘" +    (Allow_spaces_in_DL_links ? "\\u0020" : "")    + "]*";
	allLinksRegex = new RegExp(allLinksRegex, "g");

	var regexy = "^(?:http:\/\/.+?\\?)?(?:https?:\/\/)?(?:www\\.)?(?:" + totalourls + ")";

	if (Do_not_linkify_DL_links)
		ikkeTilladteTags = ['a', 'head', 'script', 'style', 'title', 'option', 'iframe', 'textarea', 'span']; //tags, hvor det der stAÎžâ€™Î’ÂĄr inden i ikke skal vAÎžâ€™Î’Â¦re links
	else
		ikkeTilladteTags = ['a', 'head', 'script', 'style', 'title', 'option', 'iframe', 'textarea']; //tags, hvor det der stAÎžâ€™Î’ÂĄr inden i ikke skal vAÎžâ€™Î’Â¦re links

	var regex = new RegExp(regexy);
	var textNode, muligtLink;

	var path = "//text()[not(parent::" + ikkeTilladteTags.join(" or parent::") + ") and contains(.,'/')]";
	var textNodes = document.evaluate(path, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	var i = textNodes.snapshotLength;

	while (i--)
	{
		textNode = textNodes.snapshotItem(i);

		muligtLink = textNode.nodeValue; //all links on page

		var myArray = null;
		var span = null;
		var lastLastIndex = 0;
		allLinksRegex.lastIndex = 0;

		if (/^https?:\/\/~[\w\s\~]*\//.test(muligtLink))
		{
			if (textNode.parentNode.className == "adead_link") continue;
			var censoredLink = muligtLink;
			var span = document.createElement('span');
			span.className = "adead_link";
			$(span).attr('warlc_error', "Cause of error: <b>Censored link.</b>");
			$(span).html(censoredLink);
			span.addEventListener("mouseover", displayTooltipError, false);
			cLinksTotal++; cLinksProcessed++; cLinksDead++;
			textNode.parentNode.replaceChild(span, textNode);
			continue;
			alert(censoredLink);
		}

		while (myArray = allLinksRegex.exec(muligtLink)) //find all links
		{
			if (!regex.test(myArray[0]))  //this link is not recognized
			{

				continue;
			}

			if (!span)
				span = document.createElement('span');

			var link = myArray[0];
			span.appendChild(document.createTextNode(muligtLink.substring(lastLastIndex, myArray.index))); //inds?t det der kommer for dette hit

			var $a = $("<a>" + link + "</a>")

			if (!link.match(/https?:\/\//))
			{
				link = 'http://' + link;
			}

			$a.attr("href", link.replace(/\[\/hide:\w+\]/,""))
				.addClass("processing_link")
				.appendTo(span);


			lastLastIndex = allLinksRegex.lastIndex;
		}

		if (span)
		{
			span.appendChild(document.createTextNode(muligtLink.substring(lastLastIndex))); //ins?t det der kommer efter sidste hit
			textNode.parentNode.replaceChild(span, textNode);
		}
	}
}

function add_WARLC_style()
{
	if (!(document.getElementsByTagName('WARLC')[0]))
	{
		var meta_not_to_add_more_style = document.createElement("WARLC");
		meta_not_to_add_more_style.setAttribute('content', 'war_links_checker');
		meta_not_to_add_more_style.setAttribute('name', 'description');
		document.getElementsByTagName('head')[0].appendChild(meta_not_to_add_more_style);

		alive_link_png = "";
		adead_link_png = "";
		unava_link_png = "";
		prem_link_png = "";
		switch(Icon_set)
		{
		//no icons
		case 0:	break;

		// cat paws
		case 1:	alive_link_png = PAW_ICON_GREEN;
				adead_link_png = PAW_ICON_RED;
				unava_link_png = PAW_ICON_YELLOW;
				prem_link_png = PAW_ICON_PINK;
				break;

		// classic RSLC look
		case 2: alive_link_png = RSLC_ICON_GREEN;
				adead_link_png = RSLC_ICON_RED;
				unava_link_png = RSLC_ICON_YELLOW;
				prem_link_png = RSLC_ICON_PINK;
				break;

		// New Icons
		case 3: alive_link_png = NEW_ICON_GREEN;
				adead_link_png = NEW_ICON_RED;
				unava_link_png = NEW_ICON_YELLOW;
				prem_link_png = NEW_ICON_PINK;
				break;

		// cat paws
		default:alive_link_png = PAW_ICON_GREEN;
				adead_link_png = PAW_ICON_RED;
				unava_link_png = PAW_ICON_YELLOW;
				prem_link_png = PAW_ICON_PINK;
				break;
		}

		processing_link_gif = 'data:image/gif;base64,' + // or temporary anavailable
		'R0lGODlhCgAKAJEDAMzMzP9mZv8AAP///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQFAAADACwAAAAACgAKAAACF5wncgaAGgJzJ647cWua4sOBFEd62VEAACH5BAUAAAMALAEAAAAIAAMAAAIKnBM2IoMDAFMQFAAh+QQFAAADACwAAAAABgAGAAACDJwHMBGofKIRItJYAAAh+QQFAAADACwAAAEAAwAIAAACChxgOBPBvpYQYxYAIfkEBQAAAwAsAAAEAAYABgAAAgoEhmPJHOGgEGwWACH5BAUAAAMALAEABwAIAAMAAAIKBIYjYhOhRHqpAAAh+QQFAAADACwEAAQABgAGAAACDJwncqi7EQYAA0p6CgAh+QQJAAADACwHAAEAAwAIAAACCpRmoxoxvQAYchQAOw%3D%3D';

		var dead_color_css, live_color_css, unava_color_css, prem_color_css, black_background_css;

		if (Color_DL_links)
		{
			dead_color_css = 'color:' + Dead_links_color + ' !important;';
			live_color_css = 'color:' + Live_links_color + ' !important;';
			unava_color_css = 'color:' + Temp_unavailable_links_color + ' !important;';
			container_color_css = 'color:' + Container_links_color + ' !important;';
			prem_color_css = 'color:' + Premium_links_color + ' !important;';
		}
		else
		{
			dead_color_css = live_color_css = unava_color_css = container_color_css = prem_color_css = '';
		}

		if (Show_black_background_in_DL_links)
		{
			black_background_css = 'background-color: black !important;';
		}
		else
		{
			black_background_css = '';
		}

		if (Show_line_through_in_dead_links)
		{
			line_through_css = 'text-decoration: line-through !important;';
		}
		else
		{
			line_through_css = '';
		}

		GM_addStyle(".alive_link {background:transparent url(" + alive_link_png + ") no-repeat scroll 100% 50%;padding-right:15px;" + live_color_css + black_background_css + "}");
		GM_addStyle(".adead_link {background:transparent url(" + adead_link_png + ") no-repeat scroll 100% 50%;padding-right:15px;" + dead_color_css + black_background_css + line_through_css + "}");
		GM_addStyle(".unava_link {background:transparent url(" + unava_link_png + ") no-repeat scroll 100% 50%;padding-right:15px;" + unava_color_css + black_background_css + "}");
		GM_addStyle(".processing_link {background:transparent url(" + processing_link_gif + ") no-repeat scroll 100% 50%;padding-right:15px;" + container_color_css + black_background_css + "}");
		GM_addStyle(".container_link {background:transparent url(" + processing_link_gif + ") no-repeat scroll 100% 50%;padding-right:15px;" + container_color_css + black_background_css + "}");
		GM_addStyle(".container_list {font-size:90%; list-style-type:square; padding: 0px 5% 0px; margin: 0px}");
		GM_addStyle(".prem_link {background:transparent url(" + prem_link_png + ") no-repeat scroll 100% 50%;padding-right:15px;" + prem_color_css + black_background_css + "}");
	}
}

var warlcTooltip = null;
var mouseoverLink = null; //link href with mouse cursor over it

var lastX = 0;
var	lastY = 0;

$(document).ready(initTooltip);

//inits tooltip
function initTooltip()
{	warlcTooltip = document.createElement("div");
	warlcTooltip.setAttribute("style", "background: #EAEAEA; box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);padding: 6px 6px 6px 6px; border-radius:2px; border:2px solid #6699CC; color:#000000;font-family:Verdana,sans-serif;font-size:11px;position:absolute;z-index:2000; max-width: " + TOOLTIP_MAXWIDTH + "px;");
	warlcTooltip.style.visibility = "hidden";

	document.body.appendChild(warlcTooltip);
}

//"mousemove" event handler for all links
function moveTooltip(event)
{
	if ((Math.abs(lastX - event.clientX) + Math.abs(lastY - event.clientY)) < 6)
	{	//no need to reflow if the cursor moved just a little
		return;
	}
	else
	{
		lastX = event.clientX;
		lastY = event.clientY;
	}

	posX = event.clientX + window.pageXOffset + 10;
	posY = event.clientY + window.pageYOffset;

	var ttHeight = warlcTooltip.offsetHeight;
	var ttFreeSpace = window.innerHeight - event.clientY;

	if (ttHeight > ttFreeSpace)
	{	//prevents tooltip from getting out of the window
		posY -= (ttHeight - (ttFreeSpace)) + 10;
	}
	else
	{
		posY += 7;
	}

	warlcTooltip.style.top = posY + "px";
	warlcTooltip.style.left = posX + "px";
}

//"mouseout" event handler for all links
function hideTooltip(){
	warlcTooltip.style.visibility = "hidden";
	mouseoverLink = null;
}


//"mouseover" event handler for dead links
//displays tooltip error message on dead links
function displayTooltipError()
{
	mouseoverLink = this.href;

	this.addEventListener("mouseout", hideTooltip);
	this.addEventListener("mousemove", function(event) { moveTooltip(event); });

	warlcTooltip.innerHTML = '<b>LOADING...</b>';
	warlcTooltip.style.minWidth = 0;
	warlcTooltip.style.visibility = "visible";

	if (this.warlc_error) //an error message is already known and stored in warlc_error attribute
	{
		warlcTooltip.innerHTML = this.warlc_error;
	}
	else
	{
		loadErrorInfo(this);
	}

	function loadErrorInfo(link)
	{
		var href = link.href;

		href = href.replace(/quickshare\.cz\/.+/, "quickshare.cz/chyba");

		GM_xmlhttpRequest({
			method: 'GET',
			url: href.replace(Ref_anonymize_service, ""),
			headers: {
				'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
				'Accept': 'text/xml',
				'Referer': ""
			},
			onload: function(result) {
				var res = result.responseText;

				//TODO: errorRegexs -
				var errorRegexs = 	[	//generic error messages follow
										/(empty directory)/i,
										/(soubor nebyl nalezen)/i,
										/((?:file|page|link|folder)(?:is|not|does|has been|was| ){1,}(?:found|available|blocked|exists?|deleted|removed))/i,

										//server specific error messages follow
										/msg error" style="cursor: default">(.+?)<\/div>/, //sendspace
										/color:red;font\-weight:bold;border\-style:dashed;font-size:12px;border\-width:2px;><tr><td align=center>(.+?)<\/td>/, //fastshare
										/(Takový soubor neexistuje. Je možné, že byl již smazán.)/, //quickshare
										/file_info file_info_deleted">\s*<h1>(.+?)<\/h1>/, //filepost
										/<br \/>\s*<p style="color:#000">(.+?)<\/p>\s*<\/center>/, //letitbit
										/(?:error_div">|<\/h1><p>)<strong>(.+?)<\/strong>/, //share-rapid,quickshare
										/class="red">(.+?)<(?:span|br)>/, //czshare
										/not-found">\s*<p>(.+?)<\/p>/, //bayfiles
										/(Your file could not be found. Please check the download link.)/, //stahnu.to
										//Tento soubor již neexistuje z následujích důvodů/, //edisk
										/error">\s*(?:<[bp]>)?\s*(.+?)<\/[bp]>/, //filesmonster, shragle, gigapeta
										///center aC">\s*<h1>(.+?)<br \/>/, //uploaded.to
										/icon_err">\s*<h1>(.+?)<\/h1>/, //filejungle
									//	/Not found!/, //filerio

									];
				var errorIdx = errorRegexs.length;

				var error = "Cause of error: <b>unknown</b>";
				var errorCandidate = "";
				while(errorIdx--)
				{
					var errorCandidate = res.match(errorRegexs[errorIdx]);
					if (errorCandidate != null)
					{
						error = "Cause of error: <b>" + errorCandidate[1].replace(/&nbsp;/g," ") + "</b>";
						break;
					}
				}

				//link attributes
				link.warlc_error = error;

				if (mouseoverLink == link.href) //mouse cursor is still over the link
				{
					warlcTooltip.innerHTML = error;
				}
			}
		});
	}
}

//"mouseover" event handler for alive links
//displays tooltip info (file size, file name,...) on alive links
function displayTooltipInfo()
{
	mouseoverLink = this.href;
	//exclude direct download filehostings
	if (this.href.match(/(?:filemonster\.net|uploadbin\.net|loombo\.com|adrive\.com|myupload\.dk|storage\.novoro\.net|ubuntuone\.com|multi-debrid\.com\/directdl|mms\.multishare\.cz\/html\/mms_process\.php|zevera\.com\/getFiles|filesmelt\.com)/))
	{
		return;
	}

	this.addEventListener("mouseout", hideTooltip);
	this.addEventListener("mousemove", function(event) { moveTooltip(event); });

	warlcTooltip.innerHTML = '<b>LOADING...</b>';
	warlcTooltip.style.minWidth = 0;
	warlcTooltip.style.visibility = "visible";

	if (this.warlc_tooltipcache) //file size is already known and stored in warlc_filename and warlc_filesize attributes
	{
		warlcTooltip.innerHTML = this.warlc_tooltipcache;
	}
	else if (this.href.includes('mega.nz') || this.href.includes('mega.co.nz'))
        loadInfoMega(this);
     else if (this.href.includes('mediafire.com'))
         loadInfoMediafire(this);
	else
		loadInfo(this);

    function loadInfoMediafire(link) {
        var key = getQuickKey(link.href);
        if (key.length == 13)
            GM_xmlhttpRequest(
                {
                    method: "POST",
                    url: 'https://www.mediafire.com/api/1.5/folder/get_info.php?response_format=json&folder_key=' + key,
                    data: null,
                    headers: {
                        'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                        'Content-Type': 'application/json',
                        'Referer': "https://mediafire.com/"
                    },
                    onload: function(result)
                    {
                        var res = JSON.parse(result.response);
                        res = res.response.folder_info;
                        var tooltip = "Folder Name: <b>" + res.name + "</b><br />";
                        tooltip += "File count: <b>" + res.file_count + "</b><br />";
                        tooltip += "Folders count: <b>" + res.folder_count + "</b><br />";
                        tooltip += "Created: <b>" + res.created + "</b><br />";
                        tooltip += "Owner: <b>" + res.owner_name + "</b><br />";
                        if (res.avatar)
                            tooltip += "<img src='" + res.avatar + "' />";
                        link.warlc_tooltipcache = tooltip;
                        if (mouseoverLink == link.href) //mouse cursor is still over the link
                        {
                            warlcTooltip.innerHTML = tooltip;
                        }
                    }
                });
        else
            GM_xmlhttpRequest(
                {
                    method: "POST",
                    url: 'https://www.mediafire.com/api/1.5/file/get_info.php?response_format=json&quick_key=' + key,
                    data: null,
                    headers: {
                        'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                        'Content-Type': 'application/json',
                        'Referer': "https://mediafire.com/"
                    },
                    onload: function(result)
                    {
                        var res = JSON.parse(result.response);
                        var fileName = res.response.file_info.filename;
                        var fileSize = res.response.file_info.size;
                        if (/^\d+$/.test(fileSize) && fileSize >= 1024) //assume bytes
                        {
                            if(fileSize > (1<<30)) fileSize = Math.round(10 * fileSize / (1<<30)) / 10 + ' GB';
                            else if(fileSize > (1<<20)) fileSize = Math.round(fileSize / (1<<20)) + ' MB';
                            else fileSize = Math.round(fileSize / 1024) + ' KB';
                        }
                        var tooltip = "File Name: <b>" + fileName + "</b><br />";
                        tooltip += "File size: <b>" + fileSize + "</b><br />";
                        tooltip += "Created: <b>" + res.response.file_info.created + "</b><br />";
                        tooltip += "Owner: <b>" + res.response.file_info.owner_name + "</b><br />";
                        link.warlc_tooltipcache = tooltip;
                        if (mouseoverLink == link.href) //mouse cursor is still over the link
                        {
                            warlcTooltip.innerHTML = tooltip;
                        }
                    }
                }
            );

        function getQuickKey(link) {
            var rx = /mediafire\.com\/?(\?|file\/|folder\/|download\/|download\.php\?|view\/)(.*?)(#|\/|,|$)/g;
            var match = rx.exec(link);
            if (match != null)
                return match[2];
            else
                return null;
        }
    }

    function loadInfoMega(link)
    {
        var id = link.href.substring(1 + link.href.lastIndexOf('/'));
        id = id.replace(new RegExp("^[#!]+"), "");
        id = id.replace("#","!");
        var parts = id.split('!');
        GM_xmlhttpRequest(
            {
                method: "POST",
                url: 'https://eu.api.mega.co.nz/cs',
                data: '[{"a": "g","p": "' + parts[0] + '"}]',
                headers: {
                    'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                    'Content-Type': 'application/json',
                    'Referer': "https://mega.nz/"
                },
                onload: function(result)
                {
                    var resp = JSON.parse(result.response);
                    var fileId = base64_to_ab(resp[0].at);
                    var iv = CryptoJS.lib.WordArray.create([0, 0, 0, 0]);
                    var attr = CryptoJS.enc.Latin1.parse(fileId).words;
                    var key = base64_to_a32(parts[1]);
                    key = CryptoJS.lib.WordArray.create([key[0] ^ key[4], key[1] ^ key[5], key[2] ^ key[6], key[3] ^ key[7]]);
                    attr = a32_to_ab(CryptoJS.AES.decrypt(
                        CryptoJS.lib.CipherParams.create({
                            ciphertext: CryptoJS.lib.WordArray.create(attr),
                            iv: iv,
                            key: key
                        }), key, {
                            iv: iv,
                            padding: {
                                pad: function () {},
                                unpad: function () {}
                            }
                        }
                    ).words);

                    var b = String.fromCharCode.apply(null, attr).replace(/\0/g, '');

                    var fileName;
                    if (b.substr(0, 6) !== 'MEGA{"')
                        fileName = 'Decryption failed';
                    else
                        fileName = JSON.parse(from8(b.substr(4))).n;

                    var fileSize = resp[0].s;
                    if (/^\d+$/.test(fileSize) && fileSize >= 1024) //assume bytes
                    {
                        if(fileSize > (1<<30)) fileSize = Math.round(10 * fileSize / (1<<30)) / 10 + ' GB';
                        else if(fileSize > (1<<20)) fileSize = Math.round(fileSize / (1<<20)) + ' MB';
                        else fileSize = Math.round(fileSize / 1024) + ' KB';
                    }
                    var tooltip = "File Name: <b>" + fileName + "</b><br />";
                    tooltip += "File size: <b>" + fileSize + "</b>";
                    link.warlc_tooltipcache = tooltip;
                    if (mouseoverLink == link.href) //mouse cursor is still over the link
                    {
                        warlcTooltip.innerHTML = tooltip;
                    }

                }
            }
        );


        function from8(utf8) {
            return decodeURIComponent(escape(utf8));
        }

        // base64_to_a32 BLOCK

        function str_to_a32(b) {
            var a = Array((b.length + 3) >> 2);
            for (var i = 0; i < b.length; i++) {
                a[i >> 2] |= (b.charCodeAt(i) << (24 - (i & 3) * 8));
            }
            return a;
        }

        function base64_to_a32(s) {
            return str_to_a32(base64urldecode(s));
        }

        // END base64_to_a32 BLOCK

        // base64_to_ab BLOCK

        function str_to_ab(b) {
            var ab, i;

            b += Array(16 - ((b.length - 1) & 15)).join(String.fromCharCode(0));

            return b;
        }

        function base64_to_ab(a) {
            return str_to_ab(base64urldecode(a));
        }

        // END OF base64_to_ab BLOCK

        function a32_to_ab(a) {
            var ab = new Array(4 * a.length);

            for (var i = 0; i < a.length; i++) {
                ab[4 * i] = a[i] >>> 24;
                ab[4 * i + 1] = a[i] >>> 16 & 255;
                ab[4 * i + 2] = a[i] >>> 8 & 255;
                ab[4 * i + 3] = a[i] & 255;
            }

            return ab;
        }

        function base64urldecode(data) {
            data += '=='.substr((2 - data.length * 3) & 3);
            data = data.replace(/\-/g, '+').replace(/_/g, '/').replace(/,/g, '');
            return atob(data);
        }
    }

	function loadInfo(link)
	{
		var href = link.href;

		GM_xmlhttpRequest({
			method: 'GET',
			url: href.replace(Ref_anonymize_service, ""),
			headers: {
				'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
				'Accept': 'text/xml',
				'Referer': ""
			},
			onload: function(result) {

				var res = result.responseText;

				var nameRegexs = 	[	/Filename: <b class="f_arial f_14px">(.+?)<\/b>/, //oron
										/(?:finfo|file[-_]?name)">\s*(.+?)<\/?(?:h1|a|div|span style|td)/, //hellshare, netload, badongo, 4fastfile
										/fl" title="(.+?)">/, //edisk
										/<title>\s*(?:Download)?\s*(.+?)\s*(?::: DataPort|\| Ulož|- Share\-Rapid|- WEBSITENAME|download Extabit|- download now for free|\| refile)/, //dataport, share-rapid, shragle, extabit, refile.net
										/<h3>Stahujete soubor: <\/h3>\s*<div class="textbox">(.+?)<\/div>/, //webshare
										/<h3><b><span style=color:black;>(.+?)<\/b><\/h3><br>/, //fastshare
										/title="download (.+?)">/, //sendspace
										/Stáhnout soubor: (.+?)<\/h1>/, //quickshare
										/fz24">Download:\s*<strong>(.+?)<\/strong>/, //crocko
										/d0FileName =  "(.+?)";/, //letitbit
										/file(?:_name|-info)" title="">\w+: <span>(.+?)<\/span>/, //vip-file, shareflare
										/recent-comments"><h2>(.+) &nbsp;/, //xdisk
										/fname" value="(.+?)">/, //syfiles, grupload,
										/download\-header">\s*<h2>File:<\/h2>\s*<p title="(.+?)">/, //bayfiles
										/description">\s*<p><b>Soubor: (.+?)<\/b>/, //bezvadata
										/Complete name                            : (.+?)<br \/>/, //bezvadata
										/itemprop="name">(.+?)<\/span>/, //bezvadata
									];
				var nameIdx = nameRegexs.length;


				//      [sizeRegexs]
				//      /    \    \?
				//   prefix (size) postfix
				//           /   \
				//          val  quant

				var quantRegex = '(?:M|G|K)?i?(?:B)(?:[y|i]te?s?)?';
				var valRegex = '\\d+(?:[\\., ]\\d+){0,2}'; 				// 111([., ]222)?([., ]333)?

				var uniSizeRegex = valRegex + '(?:\\s*|&nbsp;)' + quantRegex;

				var preSizeRegex = '(?::|\\(|>|>, | - )';
				var postSizeRegex = '(?:\\))?';

				var sizeRegexs = 	[	 preSizeRegex + "\\s*(" + uniSizeRegex + ")\\s*" + postSizeRegex,
										'FileSize_master">(.+?)<\/strong>', //hellshare
									];
				var sizeIdx = sizeRegexs.length;

				//
				//

				var tooltip = "File Name: <b>";

				var fileName = "unknown";
				var nameCandidate = "";
				while(nameIdx--)
				{
					var nameCandidate = res.match(nameRegexs[nameIdx]);
					if (nameCandidate != null)
					{
						fileName = nameCandidate[1].replace(/&nbsp;/g," ");
						break;
					}
				}

				tooltip += fileName + "</b><br>File Size:  <b>";

				var fileSize = "unknown";
				var sizeCandidate = "";
				while(sizeIdx--)
				{
					sizeCandidate = res.match(new RegExp(sizeRegexs[sizeIdx], "i"));
					if (sizeCandidate != null)
					{
						fileSize = sizeCandidate[1].replace(/&nbsp;/g," ");
						if (/^\d+$/.test(fileSize) && fileSize >= 1024)  //assume bytes
						{
							if(fileSize > (1<<30)) fileSize = Math.round(10 * fileSize / (1<<30)) / 10 + ' GB';
								else if(fileSize > (1<<20)) fileSize = Math.round(fileSize / (1<<20)) + ' MB';
									else fileSize = Math.round(fileSize / 1024) + ' KB';
						}
						break;
					}
				}

				tooltip += fileSize + "</b>";

				// PROTOTYPE
				// video thumbnails
				if (href.match('hellshare'))
				{
					var thumbs;
					thumbs = res.match(/http:\/\/static\d+\.helldata\.com\/thumbs(?:\/\d+){1,2}\/\d{1,2}"/g);

					if (thumbs)
					{
						tooltip += '<br>';

						var j = Math.min(thumbs.length, 9);
						for (var i = 0; i < j; i++)
						{
							tooltip += '<img src="' + thumbs[i].replace('"',"") + '" width="' + TOOLTIP_THUMBWIDTH + 'px">';
						}

						warlcTooltip.style.minWidth = TOOLTIP_MAXWIDTH;
					}
				}

				if (href.match('czshare'))
				{
					var thumbs;
					thumbs = res.match(/src="http:\/\/www(\d+)\.czshare\.com\/images_velke\/\d+\.(\d+)\.jpeg/);

					if (thumbs)
					{
						var thumbsServer = thumbs[1];
						var thumbsId = thumbs[2];

						tooltip += '<br>';
						for (var i = 1; i < 9; i++)
						{
							tooltip += '<img src="http://www' + thumbsServer + '.czshare.com/images_velke/' + i + '.' + thumbsId + '.jpeg" width="' + TOOLTIP_THUMBWIDTH + 'px">';
						}

						warlcTooltip.style.minWidth = TOOLTIP_MAXWIDTH;
					}
				}

				if (href.match('bezvadata'))
				{
					var thumbs;
					thumbs = res.match(/http:\/\/nahledy\.bezvadata\.cz\/nahledy\/\d+\/\d+\/\d+_\d+_\d+x\d+_\w.jpg/g);

					if (thumbs)
					{
						tooltip += '<br>';

						var j = Math.min(thumbs.length, 9);
						for (var i = 0; i < j; i++)
						{
							tooltip += '<img src="' + thumbs[i] + '" width="' + TOOLTIP_THUMBWIDTH + 'px">';
						}

						warlcTooltip.style.minWidth = TOOLTIP_MAXWIDTH;
					}
				}


				link.warlc_tooltipcache = tooltip;

				if (mouseoverLink == link.href) //mouse cursor is still over the link
				{
					warlcTooltip.innerHTML = tooltip;
				}
			}
		});
	}
}

	function setVariables()
	{
		if (firstRun)
		{
			GM_log('First run, applying default settings...');

			GM_setValue("Icon_set",1);
			GM_setValue("Display_tooltip_info",true);
			GM_setValue("Show_black_background_in_DL_links",false);
			GM_setValue("Show_line_through_in_dead_links",false);
			GM_setValue("Display_full_links_in_link_containers",true);
			GM_setValue("Allow_spaces_in_DL_links",false);
			GM_setValue("Autocheck",true);
			GM_setValue("Enable_Anonymizer",false);
			GM_setValue("Do_not_linkify_DL_links",false);
			GM_setValue("Show_progress_stats",true);
			GM_setValue("Keyboard_functions",true);
			GM_setValue("Obsolete_file_hosts",false);
			GM_setValue("Color_DL_links",true);
			GM_setValue("Live_links_color","Green");
			GM_setValue("Dead_links_color","#FF3300");
			GM_setValue("Temp_unavailable_links_color","#F7EF09");
			GM_setValue("Container_links_color","DarkKhaki");
			GM_setValue("Premium_links_color","DeepPink");
			GM_setValue("Ref_anonymize_service","");
			GM_setValue("Custom_rules",false);
			GM_setValue("Custom_rules_text","");
			GM_setValue("Processbox_Pos_Y", 0);
			GM_setValue("Processbox_Pos_X", 80);
			GM_setValue("Progressbox_Scaling", 100);


			GM_setValue("First_run", false);
		}

		//hidden settings
		GM_setValue("Progress_box_pos_bottom", Progress_box_pos_bottom = GM_getValue("Progress_box_pos_bottom", 20));
		GM_setValue("Progress_box_pos_right", Progress_box_pos_right = GM_getValue("Progress_box_pos_right", 10));
		GM_setValue("Progress_box_Scaling", Progress_box_Scaling = GM_getValue("Progress_box_Scaling", 100));
		GM_setValue("Progress_box_opacity", Progress_box_opacity = GM_getValue("Progress_box_opacity", 85));
		GM_setValue("Progress_box_background_color", Progress_box_background_color = GM_getValue("Progress_box_background_color", 'white'));
		GM_setValue("Progress_box_item_color", Progress_box_item_color = GM_getValue("Progress_box_item_color", 'DimGray'));
		GM_setValue("Progress_box_refresh_rate", Progress_box_refresh_rate = GM_getValue("Progress_box_refresh_rate", 2000));
		GM_setValue("Debug_mode", DEBUG_MODE = GM_getValue("Debug_mode", false));
		//hidden settings end

		Icon_set = GM_getValue("Icon_set", 1); //0 - no icons, 1 - cat paws, 2 - old RSLC style, 3 - New Icons,
		Display_tooltip_info = GM_getValue("Display_tooltip_info", true);
		Show_black_background_in_DL_links = GM_getValue("Show_black_background_in_DL_links", false);
		Show_line_through_in_dead_links = GM_getValue("Show_line_through_in_dead_links", false);
		Display_full_links_in_link_containers = GM_getValue("Display_full_links_in_link_containers", false);
		Allow_spaces_in_DL_links = GM_getValue("Allow_spaces_in_DL_links", false);
		Autocheck = GM_getValue("Autocheck", true);
		Enable_Anonymizer = GM_getValue("Enable_Anonymizer", false);
		Do_not_linkify_DL_links = GM_getValue("Do_not_linkify_DL_links", false);
		Show_progress_stats = GM_getValue("Show_progress_stats", true);
		Keyboard_functions = GM_getValue("Keyboard_functions", true);
		Obsolete_file_hosts = GM_getValue("Obsolete_file_hosts", false);
		Color_DL_links = GM_getValue("Color_DL_links", true);
		Live_links_color = GM_getValue("Live_links_color", "Green");
		Dead_links_color = GM_getValue("Dead_links_color", "#FF3300");
		Temp_unavailable_links_color = GM_getValue("Temp_unavailable_links_color", "#F7EF09");
		Container_links_color = GM_getValue("Container_links_color", "DarkKhaki");
		Premium_links_color = GM_getValue("Premium_links_color", "DeepPink");
		Ref_anonymize_service = GM_getValue("Ref_anonymize_service", "");
		Custom_rules = GM_getValue("Custom_rules", false);
		Custom_rules_text = GM_getValue("Custom_rules_text", false);
		Processbox_Pos_Y = GM_getValue("Processbox_Pos_Y", 0);
		Processbox_Pos_X = GM_getValue("Processbox_Pos_X", 88);
		Progressbox_Scaling = GM_getValue("Progressbox_Scaling", 100);
	}


	// Delinkifies the links
	// params:
	// links -> list of links or link components (note they should be sufficiently unique to identify the link on page,
	// e.g. 'uloz.to/xs68skxl8')
	function delinkifySnapshot(snapshot)
	{
		var n = snapshot.snapshotLength;

		while (n--)
		{
			thisLink = snapshot.snapshotItem(n);

			var spanElm = document.createElement("span");
			spanElm.className = thisLink.className;
			spanElm.innerHTML = thisLink.innerHTML;

			if (Display_tooltip_info)
			{
				spanElm.href = thisLink.href;

				switch (thisLink.className){
				case "alive_link": spanElm.addEventListener("mouseover", displayTooltipInfo, false); break
				case "adead_link": spanElm.addEventListener("mouseover", displayTooltipError, false); break;
				case "unava_link": //reserved
				default:
				}
			}

			thisLink.parentNode.replaceChild(spanElm, thisLink);
		}
	}

	function processContainers()
	{
		var redirectorTypes = {	"HTTP_302": 0,
								"INNER_LINK": 1,
								"THELOO_KATT_IT": 2,
								"CING_BE": 3,
								"ADF_LY": 4};

		var cMultiloadTotal = 0;
		var cMultiloadProcessed = 0;

		var cMirrorcreatorComTotal = 0;
		var cMirrorcreatorComProcessed = 0;

		var hostRestrictionRegex = "";
		var multiloadComRestriction = "";
		var multiloadComRestrictionRegex;

		//
		//HANDLING REDIRECTORS START
		//

		var redirectors = new Array();
		initRedirectors();

		var redirectorsCount = redirectors.length;

		if (redirectorsCount > 0)
		{
			var allRedirectorsRegex = "";

			//linkify redirector links
			for(var redirIdx = 0; redirIdx < redirectorsCount; redirIdx++)
			{
				allRedirectorsRegex += redirectors[redirIdx].linkRegex + "|";
			}
			allRedirectorsRegex = allRedirectorsRegex.replace(/\|$/, "");
			linkify(allRedirectorsRegex);
			//

			//process redirector links
			for(var redirIdx = 0; redirIdx < redirectorsCount; redirIdx++)
			{
				var redirectorsSnapshot = document.evaluate(redirectors[redirIdx].xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
				redirectors[redirIdx].cTotal = redirectorsSnapshot.snapshotLength;

				cLinksTotal += redirectors[redirIdx].cTotal;
				var linkIdx = redirectors[redirIdx].cTotal;

				while(linkIdx--)
				{
					switch(redirectors[redirIdx].type)
					{
					case redirectorTypes.HTTP_302:			processRedirectorLink(redirectorsSnapshot.snapshotItem(linkIdx), redirIdx); break;
					case redirectorTypes.INNER_LINK:		processRedirectorLinkEx(redirectorsSnapshot.snapshotItem(linkIdx), redirIdx); break;
					case redirectorTypes.THELOO_KATT_IT:	processThelooKattItLink(redirectorsSnapshot.snapshotItem(linkIdx), redirIdx); break;
					case redirectorTypes.CING_BE:			processCingBeLink(redirectorsSnapshot.snapshotItem(linkIdx), redirIdx); break;
					case redirectorTypes.ADF_LY:			processAdfLyLink(redirectorsSnapshot.snapshotItem(linkIdx), redirIdx); break;
					default:
					}
				}
			}
			//
		}

		//HTTP_302
		function processRedirectorLink(link, redirectorId)
		{
			link.className = 'container_link';

			GM_xmlhttpRequest({
				method: 'HEAD',
				url: link.href,
				headers: {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'text/xml',
					'Referer': ""
				},
				onload: function(result) {
					if (result.finalUrl.replace("https", "http") == link.href) // service hasn't redirected anywhere
					{
						processRedirectorLink(link, redirectorId);
					}
					else
					{
						redirectors[redirectorId].cProcessed++;

						link.href = result.finalUrl;

						if (redirectors[redirectorId].cProcessed >= redirectors[redirectorId].cTotal)
						checkLinks('container_link');
					}
				},
				onerror: function(result) { //probably caused by unresponsive filehosting
					redirectors[redirectorId].cProcessed++;

					link.className = 'unava_link';
					cLinksProcessed++;

					if (redirectors[redirectorId].cProcessed >= redirectors[redirectorId].cTotal)
						checkLinks('container_link');
				}
			});
		}

		//INNER_LINK
		function processRedirectorLinkEx(link, redirectorId)
		{
			link.className = 'container_link';

			GM_xmlhttpRequest({
				method: 'GET',
				url: link.href,
				headers: {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'text/xml',
					'Referer': ""
				},
				onload: function(result) {
					link.href = result.responseText.match(redirectors[redirectorId].innerLinkRegex)[1];

					redirectors[redirectorId].cProcessed++;

					if (redirectors[redirectorId].cProcessed >= redirectors[redirectorId].cTotal)
						checkLinks('container_link');
				}
			});
		}

		//theloo.katt.it (wrapped safelinking.net)
		function processThelooKattItLink(link, redirectorId)
		{
			link.className = 'container_link';

			GM_xmlhttpRequest({
				method: 'GET',
				url: link.href,
				headers: {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'text/xml',
					'Referer': ""
				},
				onload: function(result) {
					link.href = result.responseText.match(redirectors[redirectorId].innerLinkRegex)[1];

					redirectors[redirectorId].cProcessed++;


					//the inner links are safelinking.net links, so lets proceed with it
					if (GM_getValue("Check_safelinking_dot_net_links", false))
					{
						processRedirectorLink(link, 0);
					}
				}
			});
		}

		//adf.ly (adf.ly/go innerLink, locking mechanism)
		function processAdfLyLink(link, redirectorId)
		{
			link.className = 'container_link';

			GM_xmlhttpRequest({
				method: 'GET',
				url: link.href,
				headers: {
					'User-agent': 'Mozilla/4.0',
					'Accept': 'text/xml',
					'Referer': ""
				},
				onload: function(result) {

					if (result.finalUrl.match('/locked/'))
					{
						var delay = result.responseText.match(/countdown">(\d+)</)[1];
						// GM_log(result.finalUrl + 'is locked. Repeating the request in ' + delay + 's.');
						// setTimeout(function(){processAdfLyLink(link, redirectorId);}, delay * 1000);
					}
					else
					{
						// GM_log('Processing... ' + link.href);
						// GM_log('Found...' + result.responseText.match(/\/go\/(\w+\/\w+)/)[1]);

						var directLink = 'http://adf.ly' + result.responseText.match(/(\/go\/\w+\/\w+)/)[1];

						var logToken = result.responseText.match(/flashy_(\w+)/)[1];
						var users = result.responseText.match(/user=\d+&user2=\d+/);

						//confirm advert
						GM_xmlhttpRequest(
						{
						method: 'POST',
						url: 'http://adf.ly/l.php',
						headers: {
							'User-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0',
							'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
							'Referer': link.href
						},
						data: users + '&lt=' + logToken,
						onload: function(result) {

							//retrieve final url from .../go/... link
							GM_xmlhttpRequest({
							method: 'GET',
							url: directLink,
							headers: {
								'User-agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:13.0) Gecko/20100101 Firefox/13.0',
								'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
								'Referer': link.href
							},
							onload: function(result) {

								link.href = result.finalUrl;

								redirectors[redirectorId].cProcessed++;

								if (redirectors[redirectorId].cProcessed >= redirectors[redirectorId].cTotal)
									checkLinks('container_link');
							}
							});
						}
						});
					}

				}
			});

			function proceedOK()
			{
			}
		}

		//MULTILOAD.CZ START
		if (GM_getValue("Check_multiload_dot_cz_links", false))
		{
			var mlRegex = 'multiload\\.cz\/stahnout\/\\d+\/';
			var mlXpath = "//a[contains(@href,'http://www.multiload.cz/stahnout')]";

			hostRestrictionRegex = 'Upload se nezdařil|limit exceeded|probíhá reupload|';

			if (GM_getValue("Check_hellshare_dot_com_links", false))
				hostRestrictionRegex += 'hellshare|';
			if (GM_getValue("Check_download_dot_cz_dot_hellshare_dot_com_links", false))
				hostRestrictionRegex += 'downloadhellshare|';
			if (GM_getValue("Check_share_dash_rapid_dot_com_links", false))
				hostRestrictionRegex += 'share-rapid\\.com|';
			if (GM_getValue("Check_quickshare_dot_cz_links", false))
				hostRestrictionRegex += 'quickshare\\.cz|';
			if (GM_getValue("Check_czshare_dot_com_links", false))
				hostRestrictionRegex += 'czshare\\.com|';
			if (GM_getValue("Check_hellspy_dot_com_links", false))
				hostRestrictionRegex += 'hellspy|';
			if (GM_getValue("Check_multishare_dot_cz_links", false))
				hostRestrictionRegex += 'multishare\\.cz|';

			hostRestrictionRegex = hostRestrictionRegex.replace(/\|$/, "");

			linkify(mlRegex);

			var mlSnapshot = document.evaluate(mlXpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			var mlCount = mlSnapshot.snapshotLength;

			if (mlCount > 0)
			{
				cMultiloadTotal += mlCount;

				mlIdx = mlCount - 1;
				do
				{
					processMultiloadLink(mlSnapshot.snapshotItem(mlIdx));
				}
				while(mlIdx--)
			}
		}
		//MULTILOAD.CZ END



		function processMultiloadLink(mlLink)
		{
			GM_xmlhttpRequest({
				method: 'GET',
				url: mlLink.href,
				headers: {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'text/xml',
					'Referer': ""
				},
				onload: function(result) {
					var res = result.responseText;

					var innerBlockRegex = /<p class="manager-linky">(?:.|\s)+?<\/p>/g;
					var innerLinksRegex = /(?:Upload se nezdařil \((?:chyba serveru|chybné přihlašovací údaje)\)\. <|>https?:\/\/(?:.|\s)+?<|Právě probíhá reupload, buďte trpěliví\.\.\.<)/g;
					var innerLinkRegex = /((?:Upload se nezdařil.+|https?:\/\/(?:.|\s)+|Právě probíhá reupload, buďte trpěliví\.\.\.))</;
					var mlRestrictionRegex = new RegExp(hostRestrictionRegex,"g"); //what links should be displayed

					var blocks; // blocks of links
					var blockIdx;

					mlLink.className = '';

					if (result.status == 503) //service temporarily unavailable, repeat request in one second
					{
						setTimeout(function(){ processMultiloadLink(mlLink); }, 1000);
						return;
					}

					blocks = res.match(innerBlockRegex);

					if (blocks == null) //no links found, cancel further processing
					{
						mlLink.parentNode.appendChild(document.createTextNode(' | Požadovaný soubor neexistuje.'));
						cMultiloadProcessed++;
						if (cMultiloadTotal <= cMultiloadProcessed)
						{
							startBulkCheck('container_link');
							start('container_link');
						}
						return;
					}

					blockIdx = blocks.length;

					if (Display_full_links_in_link_containers)
					{
						var ulElm = document.createElement('ul');
						ulElm.className = 'container_list'; //CSS smaller font, padding, margin, square style

						while(blockIdx--)
						{
							if (blocks[blockIdx].match(mlRestrictionRegex) == null)
							{
								continue;
							}

							var innerLinks = blocks[blockIdx].match(innerLinksRegex);

							var linkIdx = innerLinks.length;
							while (linkIdx--)
							{
								var innerLink = innerLinks[linkIdx].match(innerLinkRegex)[1];

								var liElm = document.createElement('li');

								if (innerLink.match(/Upload se nezdařil|limit exceeded|probíhá reupload/))
								{
									liElm.appendChild(document.createTextNode(innerLink));
								}
								else
								{
									var aElm = document.createElement('a');
									aElm.innerHTML = innerLink;
									aElm.href = innerLink;
									aElm.className = 'container_link';

									liElm.appendChild(aElm);
								}

								ulElm.appendChild(liElm);
								cLinksTotal++;
							}
						}

						mlLink.parentNode.appendChild(ulElm);
					}
					else //compact view
					{
						mlLink.parentNode.appendChild(document.createTextNode("|"));

						while(blockIdx--)
						{
							if (blocks[blockIdx].match(mlRestrictionRegex) == null)
							{
								continue;
							}

							var innerLinks = blocks[blockIdx].match(innerLinksRegex);

							var linkIdx = innerLinks.length;
							while (linkIdx--)
							{
								var innerLink = innerLinks[linkIdx].match(innerLinkRegex)[1];

								if (innerLink.match(/Upload se nezdařil|limit exceeded|probíhá reupload/))
								{
									mlLink.parentNode.appendChild(document.createTextNode("----"));
								}
								else
								{
									var aElm = document.createElement('a');

									var hostName = innerLink.match(/quickshare|hellshare|downloadhellshare|multishare|hellspy|share\-rapid|czshare/);

									//abbreviate host name
									switch(hostName + ""){

										case 'quickshare': aElm.innerHTML = 'QS'; break;
										case 'hellshare': aElm.innerHTML = 'HS'; break;
										case 'downloadhellshare': aElm.innerHTML = 'HS'; break;
										case 'multishare': aElm.innerHTML = 'MS'; break;
										case 'hellspy': aElm.innerHTML = 'hs'; break;
										case 'share-rapid': aElm.innerHTML = 'SR'; break;
										case 'czshare': aElm.innerHTML = 'CS'; break;
										default: aElm.innerHTML = 'xx';

									}

									aElm.href = innerLink;
									aElm.className = 'container_link';

									mlLink.parentNode.appendChild(aElm);
									cLinksTotal++;
								}
							}

							mlLink.parentNode.appendChild(document.createTextNode("|")); //blocks delimiter

						}
					}

					cMultiloadProcessed++;
					if (cMultiloadTotal == cMultiloadProcessed) //start check when all ml links have been processed
					{
						if (Do_not_linkify_DL_links)
						{
							delinkifySnapshot(mlSnapshot);
						}

						startBulkCheck('container_link');
						start('container_link');
					}
				}
			});
		}


		if (GM_getValue("Check_mirrorcreator_dot_com_links", false))
		{
			var mcRegex = 'mirrorcreator\\.com/files/(\\w+)';
			var mcXpath = "//a[contains(@href,'mirrorcreator.com/files')]";

			var mcShortHostNames =
				 '?? RS MU ES DF Zs FF ?? SS ?? Ba NL LT MF MS ZS UL 2S ZI HF ST UP GF ?? UB Fr IF fs X7 UG ?? TB FS EB LB EU ?? OR ?? ?? DL EY ?? FK FH US BS WU FP PL FJ CR JF SM Ms Ff GU';
				// 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 43 44 45 46 47 48 49 50 51 52 53 54 55 56
				//??????      depositfiles sendspace  load.to     ul.to       storage.to  uploadbox   x7.to       fileserve   ??????      duckload    filehook    filepost    jumbofiles  glumbouploads
				//   zshare      ??????     uploading   ugotfile    extabit     oron        eyvx       uploadstation putlocker
				//      megaupload  badongo   gamefront   ifile       ??????      letitbit    ??????      ??????      filejungle
				//         easy-share  ??????      netload     zippyshare     ??????      filesonic   turbobit    enterupload ??????      filekeen    wupload     crocko      fileflyer

			linkify(mcRegex);

			var mcSnapshot = document.evaluate(mcXpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
			var mcCount = mcSnapshot.snapshotLength;

			cMirrorcreatorComTotal = mcCount;

			if (mcCount > 0)
			{
				mcShortHostNames = mcShortHostNames.split(' ');
				mcIdx = mcCount;
				while(mcIdx--)
					processMirrorcreatorLink(mcSnapshot.snapshotItem(mcIdx));
			}

		}
		//MIRRORCREATOR.CZ END


		//mirrorcreator.com checking works like this:
		//The base URL is http://www.mirrorcreator.com/files/XXXXXXXX/filename_links
		//the actual list of mirrors is at http://www.mirrorcreator.com/status.php?uid=XXXXXXXX
		//the list contains links in the form of (http://www.mirrorcreator.com)/redirect/XXXXXXXX/1
		//these redirector links are extracted with mcLinkBlockRegex and the pages loaded
		//they contain the actual filehost links, which are extracted with mcHostRegex and displayed in a container list
		function processMirrorcreatorLink(mcLink)
		{
			var mcURL = mcLink.href.match(mcRegex);
			if(!mcURL || !mcURL[1]) return;
			mcURL = 'http://www.mirrorcreator.com/status.php?uid=' + mcURL[1]; //link correction
			GM_xmlhttpRequest({
				method: 'GET',
				url: mcURL,
				headers: {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*'+'/*;q=0.8',
					'Referer': ""
				},
				onload: function(mcLinkResult) {
					var mcLinkRes = mcLinkResult.responseText;

					var mcLinkBlockRegex = /(\/redirect\/\w+\/(\d+))/gi;
					var mcHostRegex = /<div id="redirectlink">.*?<a href="([^"]+)"/;

					var mcRedirectors;
					var mcHostURLs = [], mcRedirectorIDs = [], mcHostsFound = 0, mcHostsRetrieved = 0, mcHostsToProcess = 0;

					var m = mcLinkRes.match(mcLinkBlockRegex);

					if (m)
						mcHostsFound = m.length;
					else
					{ //no files inside container
						processMirrorcreatorFoundHosts(mcLink, []);
						return;
					}

					var mcRedirectorURL, idx, timedOut = false;

					var gmxhrFunc = function(mcRedirectorURL){ //Tampermonkey doesn't know neither this.url or result.finalUrl
						GM_xmlhttpRequest({
							method: 'GET',
							url: mcRedirectorURL,
							headers: {
								'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
								'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*'+'/*;q=0.8',
								'Referer': ""
							},
							onload: function(mcHostResult) {
								if (timedOut) return; //too late, the list is already displayed
								var mcHostRes = mcHostResult.responseText;
								var mcHost = mcHostRes.match(mcHostRegex);
								idx = mcHostURLs.indexOf(mcRedirectorURL);
								if (mcHost && idx!=-1)
								{
									mcHostURLs[idx] = mcHost[1].replace(/^\s+|\s+$/g, '');
									mcHostsRetrieved++;
									mcHostsToProcess++;
									if (mcHostsFound == mcHostsRetrieved) //this is the last one!
									{
										processMirrorcreatorFoundHosts(mcLink, mcHostURLs, mcRedirectorIDs);
										mcHostsToProcess = 0;
									}
								}
							} //end of onload: function
						}); //end of GM_xmlhttpRequest call
					};//end of var gmxhrFunc

					while (mcRedirectors = mcLinkBlockRegex.exec(mcLinkRes))
					{  //load individual redirector pages
						mcRedirectorURL = 'http://www.mirrorcreator.com' + mcRedirectors[1];
						mcHostURLs.push(mcRedirectorURL);
						mcRedirectorIDs.push(mcRedirectors[2]);
						gmxhrFunc(mcRedirectorURL);
					} //end of while block

					setTimeout(function(){ //in case the last page fails to load and call the function
							timedOut = true;
							if (mcHostsToProcess)
								processMirrorcreatorFoundHosts(mcLink, mcHostURLs);
						}, 60000);

				} //end of onload function
			}); //end of GM_xmlhttpRequest call
		} //end of function processMirrorcreatorLink


		function processMirrorcreatorFoundHosts(mcLink, mcHostURLs, mcRedirectorIDs)
		{
			var aEl, liEl, docFrag;
			var hostName, mcRedirectorID, trimFilename = false;

			var i = mcHostURLs.length;
			if (i == 0)
			{
				trimFilename = true;
				mcLink.parentNode.insertBefore(document.createTextNode(' | No files inside container'), mcLink.nextSibling);
			}
			else
			{
				if (Display_full_links_in_link_containers)
				{ //full view
					var wrapperEl = document.createElement('span');
					wrapperEl.style.display = 'block';
					var ulistEl = document.createElement('ul');
					ulistEl.className = 'container_list';
					while (i--)
					{
						liEl = document.createElement('li');
						aEl = document.createElement('a');
						aEl.appendChild(document.createTextNode(mcHostURLs[i]));
						aEl.href = mcHostURLs[i];
						aEl.className = 'container_link';
						liEl.appendChild(aEl);
						ulistEl.appendChild(liEl);
					}
					wrapperEl.appendChild(ulistEl);
					mcLink.parentNode.replaceChild(wrapperEl, mcLink);
					wrapperEl.insertBefore(mcLink, wrapperEl.firstChild);
				}
				else
				{ //compact view
					trimFilename = true;
					docFrag = document.createDocumentFragment();
					docFrag.appendChild(document.createTextNode(' |'));
					while (i--)
					{
						mcRedirectorID = mcRedirectorIDs[i];
						hostName = mcHostURLs[i];
						if (mcRedirectorID > mcShortHostNames.length-1 || mcShortHostNames[mcRedirectorID] == '??')
							hostName = hostName.replace(/https?:\/\/(?:www\.)?([-0-9a-z]+(?:\.[-0-9a-z]+)?)\.[a-z]+\/.*/i, '$1').toUpperCase();
						else
							hostName = mcShortHostNames[mcRedirectorID];

						aEl = document.createElement('a');
						aEl.href = mcHostURLs[i];
						aEl.className = 'container_link';
						aEl.appendChild(document.createTextNode(hostName));
						docFrag.appendChild(aEl);
						docFrag.appendChild(document.createTextNode('|'));
					}
					mcLink.parentNode.insertBefore(docFrag, mcLink.nextSibling);
				} //end of else block
			} //end of else block

			mcLink.className = '';
			if (trimFilename)
				mcLink.firstChild.nodeValue = mcLink.firstChild.nodeValue.replace(/(https?:\/\/[^\/]+\/files\/\w+\/).+/, '$1...');

			cMirrorcreatorComProcessed++;
			if (cMirrorcreatorComProcessed == cMirrorcreatorComTotal) //start check when all mc links have been processed
			{
				if (Do_not_linkify_DL_links)
					delinkifySnapshot(mcSnapshot);
				startBulkCheck('container_link');
				start('container_link');
			}
		} //end of function processMirrorcreatorFoundHosts

		containers_processed = true;


		function initRedirectors()
		{
			function addRedirector(linkRegex, xpathEx, redirType, innerLinkRegex)
			{
				var redirector = new Object();

				redirector.linkRegex = linkRegex;
				redirector.xpath = xpathEx; 				//xpath expression
				redirector.cProcessed = 0; 					//processed links count
				redirector.cTotal = 0; 						//total links count
				redirector.type = redirType;				//redirectorTypes enum
				redirector.innerLinkRegex = innerLinkRegex;	//innerLink, null if unused

				redirectors.push(redirector);
			}
			if (GM_getValue("Check_safelinking_dot_net_links", false))
			{
				addRedirector(
				'safelinking\\.net\/d\/\\w+',
				"//a[contains(@href,'safelinking.net/d/')]",
				redirectorTypes.HTTP_302,
				null);
			}
			if (GM_getValue("Check_linksafe_dot_me_links", false))
			{
				addRedirector(
				'linksafe\\.me\/d\/\\w+',
				"//a[contains(@href,'linksafe.me/d/')]",
				redirectorTypes.HTTP_302,
				null);
			}
			if (GM_getValue("Check_linkto_dot_net_links", false))
			{
				addRedirector(
				'linkto\\.net\/\\?\\w+\\.\\d+',
				"//a[contains(@href,'linkto.net/?')]",
				redirectorTypes.INNER_LINK,
				/<iframe id="iframe" name="iframe"  src="(.+?)\s*" frameborder="0"/);
			}
			if (GM_getValue("Check_theloo_dot_katt_dot_it_links", false))
			{
				addRedirector(
				'(?:the)?loo\\.katt\\.it\/\\w+',
				"//a[contains(@href,'loo.katt.it/')]",
				redirectorTypes.THELOO_KATT_IT,
				/Proceed to URL - <a href="(.+?)">/);
			}
			if (GM_getValue("Check_madlink_dot_sk_links", false))
			{
				addRedirector(
				'madlink\\.sk\/\\w+',
				"//a[contains(@href,'madlink.sk/')]",
				redirectorTypes.INNER_LINK,
				/name="url" value="(.+?)\s*"\/>/);
			}
			if (GM_getValue("Check_adf_dot_ly_links", false))
			{
				addRedirector(
				'(?:adf\\.ly|[u9]\\.bb|[qj]\\.gs)\/\\w+',
				"//a[contains(@href,'adf.ly/') (@href,'u.bb/') or contains(@href,'9.bb/') or contains(@href,'q.gs/') or contains(@href,'j.gs/')]",
				redirectorTypes.ADF_LY,
				null);
			}
			if (GM_getValue("Check_redi_dot_re_links", false))
			{
				addRedirector(
				'redi\\.re\/\\w+',
				"//a[contains(@href,'redi.re/')]",
				redirectorTypes.HTTP_302,
				null);
			}
			if (GM_getValue("Check_bit_dot_ly_links", false))
			{
				addRedirector(
				'bit\\.ly\/\\w+',
				"//a[contains(@href,'bit.ly/')]",
				redirectorTypes.HTTP_302,
				null);
			}
		}

	}

	var bulkHosts = new Array();
	var bulkHostNames = new Array();

	function initBulkCheck()
	{

		/////////////////////////////
		// Inits filehost object
		/////////////////////////////
		// params :
		// hostName 		-- 	[string]		host name (multiple domains separated with coma)
		// linkRegex		-- 	[string] 		link regex
		// xpath 			-- 	[string] 		xpath expression to detect the link objects with evaluate
		// blockSize 		-- 	[integer]		max. number of links sent in one request, 50 if null
		// corrMatch		--	[regex]			link correction regex (match), applied prior to corrRepl
		// corrReplWhat		-- 	[regex]			link correction regex (replace)
		// corrReplWith		--  [string]
		// splitSeparator	-- 	[string]		POSTDATA links separator, "\r\n" if null
		//
		// apiUrl			-- 	[string]		web linkchecker or API URL
		// postData 		-- 	[string]		POSTDATA of xmlhttprequest
		// resLinkRegex		--	[regex]
		// resLiveRegex		-- 	[regex]			matches substrings containing live links in the request response
		// resDeadRegex		-- 	[regex]			matches substrings containing dead links in the request response
		// resUnavaRegex	--	[regex]			matches substrings containing unava links in the request response
		// func				-- 	[function]		bulkcheck handler, genBulkCheck if null
		//
		//////////////////////////////
		function addHost(hostName, linkRegex, xpath, blockSize, corrMatch, corrReplWhat, corrReplWith, splitSeparator,
							apiUrl, postData, resLinkRegex, resLiveRegex, resDeadRegex, resUnavaRegex, func)
		{
			var fileHost = new Object();

            fileHost.linkRegex = linkRegex;
			fileHost.linkRegexObject = new RegExp(linkRegex, "");
			fileHost.xpath = xpath;
			fileHost.cFound = 0; //found links counter
			fileHost.links = new Array(); //found links

			if (blockSize == null)
			{
				fileHost.blockSize = 50;
			}
			else
			{
				fileHost.blockSize = blockSize;
			}

			fileHost.corrMatch = corrMatch;
			fileHost.corrReplWhat = corrReplWhat;
			fileHost.corrReplWith = corrReplWith;

			if (splitSeparator == null)
			{
				fileHost.splitSeparator = "\r\n";
			}
			else
			{
				fileHost.splitSeparator = splitSeparator;
			}

			fileHost.apiUrl = apiUrl;
			fileHost.postData = postData;
			fileHost.resLinkRegex = resLinkRegex;
			fileHost.resLiveRegex = resLiveRegex;
			fileHost.resDeadRegex = resDeadRegex;
			fileHost.resUnavaRegex = resUnavaRegex;

			if (func == null)
			{
				fileHost.func = genBulkCheck;
			}
			else
			{
				fileHost.func = func;
			}

			bulkHosts.push(fileHost);
			var names = hostName.split(',');
			var i = names.length ;
			while(i--)
			{
				bulkHostNames[names[i]] = fileHost;
			}
		}

		var genType1 = [
							"downloadani.me", //"rodfile.com", "migahost.com",
							"rarefile.net",
							"filesabc.com",
						//	"verzend.be",
						//	"movreel.com",
							"file4safe.com",	"filemac.com",
							"bitupload.com",  //"4up.me",
							//"uploadbaz.com"
						];

		var genType2 = [	//"queenshare.com",
							//"hulkload.com",
							//"amonshare.com",	//"edoc.com",




						];

		//xfilesharing 1.0
		function addGenericType1()
		{
			var i = genType1.length;

			while(i--)
			{
				if (GM_getValue("Check_" + genType1[i].replace(/\./g, "_dot_").replace(/-/g, "_dash_") + "_links", false))
				{
					var regexSafe = genType1[i].replace(/\./g, "\\.").replace(/-/g, "\\-");

					addHost(
						genType1[i].match(/[\w-]+/)[0], //hostname
						regexSafe + "\/\\w+", //linkregex
						"//a[contains(@href,'" + genType1[i] + "/')]", //xpath
						null, //blocksize
						new RegExp("(http:\/\/(?:|www\\.)" + regexSafe + "\/\\w+)",""),//, //corrmatch
						null, //corrreplwhat
						null, //corrreplwith
						null, //separator
						"http://" + genType1[i] + "/checkfiles.html", //api url
						"op=checkfiles&process=Check+URLs&list=", //postdata
						new RegExp("(" + regexSafe + "\/\\w+)",""), //linkregex
						new RegExp("green'>http:\/\/(?:|www\.)" + regexSafe + "\/\\w+","g"), //liveregex
						new RegExp("red'>http:\/\/(?:|www\.)" + regexSafe + "\/\\w+","g"), //deadregex
						new RegExp("orange'>http:\/\/(?:|www\.)" + regexSafe + "\/\\w+","g"), //unavaregex
						null //function delegate
					)
				}
			}
		}

		//xfilesharing 2.0
		function addGenericType2()
		{
			var i = genType2.length;

			while(i--)
			{
				if (GM_getValue("Check_" + genType2[i].replace(/\./g, "_dot_").replace(/-/g, "_dash_") + "_links", false))
				{
					var regexSafe = genType2[i].replace(/\./g, "\\.").replace(/-/g, "\\-");

					addHost(
						genType2[i].match(/[\w-]+/)[0], //hostname
						regexSafe + "\/\\w+", //linkregex
						"//a[contains(@href,'" + genType2[i] + "/')]", //xpath
						null, //blocksize
						new RegExp("(http:\/\/(?:|www\\.)" + regexSafe + "\/\\w+)",""),//, //corrmatch
						null, //corrreplwhat
						null, //corrreplwith
						null, //separator
						"http://www." + genType2[i] + "/?op=checkfiles", //api url
						"op=checkfiles&process=Check+URLs&list=", //postdata
						new RegExp("(" + regexSafe + "\/\\w+)",""), //linkregex
						new RegExp(regexSafe + "\/\\w+.*?<\/td>\\s*<td style=\"color:green;\">","g"), //liveregex
						new RegExp(regexSafe + "\/\\w+.*?<\/td>\\s*<td style=\"color:red;\">","g"), //deadregex
						new RegExp(regexSafe + "\/\\w+.*?<\/td>\\s*<td style=\"color:orange;\">","g"), //unavaregex
						null //function delegate
					)
				}
			}
		}
//api start
		// TEMPLATE
		// if (GM_getValue("Check__dot_com_links", false))
		// {
			// addHost(
				// "", //hostname
				// "", //linkregex
				// "//a[contains(@href,'.com/')]", //xpath
				// null, //blocksize
				// null, //corrmatch
				// null, //corrreplwhat
				// null, //corrreplwith
				// null, //separator
				// "", //api url
				// "", //postdata
				// /()/, //linkregex
				// //liveregex
				// //deadregex
				// //unavaregex
				// null //function delegate
			// )
		// }


		addGenericType1();
		addGenericType2();


		
		if (GM_getValue("Check_hackerbox_dot_org_links", false))
		{
			addHost(
				"hackerbox", //hostname
				"host\\.hackerbox\\.org\/\\w+", //linkregex
				"//a[contains(@href,'host.hackerbox.org/')]", //xpath
				null, //blocksize
				/(http:\/\/host\.hackerbox\.org\/\w+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				"http://host.hackerbox.org/checkfiles.html", //api url
				"op=checkfiles&process=Check+URLs&list=", //postdata
				/(host\.hackerbox\.org\/\w+)/, //linkregex
				/green'>http:\/\/host\.hackerbox\.org\/\w+/g, //liveregex
				/red'>http:\/\/host\.hackerbox\.org\/\w+/g, //deadregex
				/orange'>http:\/\/host\.hackerbox\.org\/\w+/g, //unavaregex
				null //function delegate
			)
		}
        if (GM_getValue("Check_gofile_dot_io_links", false))
        {
            addHost(
                "gofile", //hostname
                "gofile\\.io\/d\/\\w+", //linkregex
                "//a[contains(@href,'gofile.io')]", //xpath
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null, //api url
                null, //postdata
                null, //linkregex
                null, //liveregex
                null, //deadregex
                null, //unavaregex
                gofileBulkCheck //function delegate
            )
        }
        if (GM_getValue("Check_fikper_dot_com_links", false))
        {
            addHost(
                "fikper", //hostname
                "fikper\\.com\/\\w+", //linkregex
                "//a[contains(@href,'fikper.com')]", //xpath
                100000, //blocksize
                null, //corrmatch
                null, //corrreplwhat
                null, //corrreplwith
                null, //separator
                null, //api url
                null, //postdata
                null, //linkregex
                null, //liveregex
                null, //deadregex
                null, //unavaregex
                fikperBulkCheck //function delegate
            )
        }
/*		if (GM_getValue("Check_hellshare_dot_com_links", false))
		{
			addHost(
				"hellshare", //hostname
				"(?:|download\\.(?:cz\\.|en\\.|sk\\.|)|www\\.)hellshare\\.(?:com|sk|cz|pl|hu|COM|SK|CZ|PL|HU)\/[\\w-\\.]+\/(?:[\\w-\\.]+\/|)\\d{5,}", //linkregex
				"//a[contains(@href,'hellshare.')]", //xpath
				48, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				null, //api url
				null, //postdata
				null, //linkregex
				null, //liveregex
				null, //deadregex
				null, //unavaregex
				hellshareBulkCheck //function delegate
			)
		} */
    if (GM_getValue("Check_uploadrocket_dot_net_links", false))
		{
			addHost(
				"uploadrocket", //hostname
				"(?:uploadrocket\\.net)\/\\w+", //linkregex
				"//a[contains(@href,'uploadrocket.net/')]", //xpath
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				"\n", //separator
				'http://uploadrocket.net/?op=checkfiles',
				'op=checkfiles&process=Check+URLs&list=',
				/uploadrocket.net\/(\w+)/,
				/>http:\/\/uploadrocket.net\/\w+(?:[^>]+>)<td style="color:green/g,
				/>http:\/\/uploadrocket.net\/\w+(?:[^>]+>)<td style="color:red/g,
				null,
				null //function delegate
			)
		}
  	if (GM_getValue("Check_uploading_dot_site_links", false))
		{
			addHost(
				"uploading", //hostname
				"(?:uploading\\.site)\/\\w+", //linkregex
				"//a[contains(@href,'uploading.site/')]", //xpath
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				"\n", //separator
				'http://uploading.site/?op=checkfiles',
				'op=checkfiles&process=Check+URLs&list=',
				/uploading.site\/(\w+)/,
				/>http:\/\/uploading.site\/\w+(?:[^>]+>)<td style="color:green/g,
				/>http:\/\/uploading.site\/\w+(?:[^>]+>)<td style="color:red/g,
				null,
				null //function delegate
			)
		}
    if (GM_getValue("Check_1f_dot_al_links", false))
        {
           addHost(
               "1f",
               "(?:1f\\.al)\/d\/\\w+",
               "//a[contains(@href,'1f.al/d/')]",
               100000, //blocksize
               null, //corrmatch
               null, //corrreplwhat
               null, //corrreplwith
               null, //separator
               null,
               null,
               null,
               null,
               null,
               null,
               _1falBulkCheck //function delegate
            )
        }
		    if (GM_getValue("Check_k2s_dot_cc_links", false))
        {
           addHost(
               "k2s,keep2s,keep2share",
               "(?:(?:k2s\\.cc)|(?:keep2s\\.cc)|(?:keep2share\\.(?:cc|com)))\/file\/\\w+",
               "//a[contains(@href,'k2s.cc/file/') or contains(@href,'keep2s.cc/file/') or contains(@href,'keep2share.cc/file/') or contains(@href,'keep2share.com/file/')]",
               100000, //blocksize
               null, //corrmatch
               null, //corrreplwhat
               null, //corrreplwith
               null, //separator
               null,
               null,
               null,
               null,
               null,
               null,
               k2sBulkCheck //function delegate
            )
        }
				if (GM_getValue("Check_tezfiles_dot_com_links", false))
        {
           addHost(
               "tezfiles",
               "(?:tezfiles\\.com)\/\\w+",
               "//a[contains(@href,'tezfiles.com')]",
               100000, //blocksize
               null, //corrmatch
               null, //corrreplwhat
               null, //corrreplwith
               null, //separator
               null,
               null,
               null,
               null,
               null,
               null,
               k2sBulkCheck //function delegate
            )
        }
		if (GM_getValue("Check_fboom_dot_me_links", false))
        {
           addHost(
               "fboom,fileboom",
               "(?:(?:fboom\\.me)|(?:fileboom\\.me))\/file\/\\w+",
               "//a[contains(@href,'fboom.me/file/') or contains(@href,'fileboom.me/file/')]",
               100000, //blocksize
               null, //corrmatch
               null, //corrreplwhat
               null, //corrreplwith
               null, //separator
               null,
               null,
               null,
               null,
               null,
               null,
               k2sBulkCheck //function delegate
            )
        }
    		if (GM_getValue("Check_1fichier_dot_com_links", false))
        {
           addHost(
               "1fichier,dl4free",
               "(?:\\w{10}\\.(?:1fichier|dl4free)\\.com\/)|(?:(?:1fichier|dl4free)\\.com\/\\?\\w{10})|(?:www\\.)?\\w{6,}\\.1fichier\\.com|(?:\\w+\\.)?1fichier\\.com(?:\/\\?\\w{6,10})",
               "//a[contains(@href,'.1fichier.com') or contains(@href,'1fichier.com?') or contains(@href,'1fichier.com/?') or contains(@href,'.dl4free.com') or contains(@href,'dl4free.com?')or contains(@href,'dl4free.com/?')]",
               100000, //blocksize
               null, //corrmatch
               null, //corrreplwhat
               null, //corrreplwith
               null, //separator
               null,
               null,
               null,
               null,
               null,
               null,
               dl4free_1fichier_BulkCheck //function delegate
            )
        }
	    	if (GM_getValue("Check_nitroflare_dot_com_links", false))
        {
            addHost(
               "nitroflare",
               "nitroflare\\.com\/\\w+",
               "//a[contains(@href,'nitroflare.com/view/') or contains(@href,'nitroflare.com/watch/')]",
               100000, //blocksize
               null, //corrmatch
               null, //corrreplwhat
               null, //corrreplwith
               null, //separator
               null,
               null,
               null,
               null,
               null,
               null,
               nitroflareBulkCheck //function delegate
            )
        }
           	if (GM_getValue("Check_nitro_dot_download_links", false))
        {
            addHost(
               "nitro",
               "nitro\\.download\/\\w+",
               "//a[contains(@href,'nitro.download/view/') or contains(@href,'nitro.download/watch/')]",
               100000, //blocksize
               null, //corrmatch
               null, //corrreplwhat
               null, //corrreplwith
               null, //separator
               null,
               null,
               null,
               null,
               null,
               null,
               nitroBulkCheck //function delegate
            )
        }
		if (GM_getValue("Check_linkcrypt_dot_ws_links", false))
		{
			addHost(
				"linkcrypt", //hostname
				"linkcrypt\\.ws\/dir\/\\w+", //linkregex
				"//a[contains(@href,'linkcrypt.ws/dir')]", //xpath
				100000, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				null,
				null,
				null,
				null,
				null,
				null,
				linkcryptBulkCheck //function delegate
			)
		}
		if (GM_getValue("Check_videobb_dot_com_links", false))
		{
			addHost(
				"videobb", //hostname
				"videobb\\.com\/(?:video\/|watch_video\\.php\\?v=)\\w+", //linkregex
				"//a[contains(@href,'videobb.com')]", //xpath
				null, //blocksize
				null, //corrmatch
				/watch_video\.php\?v=/, //corrreplwhat
				'video/', //corrreplwith
				null, //separator
				'http://www.videobb.com/link_checker.php',
				'links=',
				/videobb\.com\/video\/(\w+)/,
				/<td>http:\/\/(?:www\.|)videobb.com\/video\/\w+<\/td>\s+<td>.+?<\/td>\s+<td>\d+:\d+<\/td>\s+<td>Available/g,
				/<td>http:\/\/(?:www\.|)videobb.com\/video\/\w+<\/td>\s+<td><\/td>\s+<td>N\/A<\/td>\s+<td>Not Available/g,
				null,
				null //function delegate
			)
		}
		if (GM_getValue("Check_mediafire_dot_com_links", false))
		{
			addHost(
				"mediafire",
				"mediafire\\.com",
                "//a[contains(@href,'mediafire')]",
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				null,
				null,
				null,
				null,
				null,
				null,
				mediafireBulkCheck //function delegate
			)
		}
        if (GM_getValue("Check_mega_dot_nz_links", false))
        {
           addHost(
               "mega",
               "mega(?:\\.co)?\\.nz\/(#!|file\\/)\\w+",
               "//a[contains(@href,'mega.co.nz/') or contains(@href,'mega.nz/')]",
               100000, //blocksize
               null, //corrmatch
               null, //corrreplwhat
               null, //corrreplwith
               null, //separator
               null,
               null,
               null,
               null,
               null,
               null,
               megaBulkCheckNew //function delegate
            )
        }

		//the same as GenType2, except api url is 'https://' instead of 'http://www.' and corrmatch is not??? needed

		if (GM_getValue("Check_extabit_dot_com_links", false))
		{
			addHost(
				"extabit", //hostname
				"extabit\\.com\/file\/\\w+", //linkregex
				"//a[contains(@href,'extabit.com')]", //xpath
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				"\n", //separator
				"http://extabit.com/linkchecker.jsp", //api url
				"url=", //postdata
				/extabit\.com\/(file\/\w+)/, //linkregex
				/extabit\.com\/file\/\w+\/[^<]+<\/a><\/td>\s*<td class="status"><span class="status_green">/g, //liveregex
				/extabit\.com\/file\/\w+\/[^<]+<\/a><\/td>\s*<td class="status"><span class="status_red">/g, //deadregex
				/extabit\.com\/file\/\w+\/[^<]+<\/a><\/td>\s*<td class="status"><span class="status_yellow">/g, //unavaregex
				extabitBulkCheck //function delegate
			)
		}
		if (GM_getValue("Check_webshare_dot_cz_links", false))
		{
			addHost(
				"webshare", //hostname
				"webshare\.cz\/(?:(?:#/)?file/\\w+|\\w+-.*)", //linkregex
				"//a[contains(@href,'webshare.cz')]", //xpath
				100000, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				null, //api url
				null, //postdata
				null, //linkregex
				null, //liveregex
				null, //deadregex
				null, //unavaregex
				webshareBulkCheck //function delegate
			)
		}

		/////////////////////////////
		// Common function delegate to send links to get checked by host linkchecker
		/////////////////////////////
		// If you define a new delegate, you may use following properties
		// this.links 			[array] array of strings (link blocks). The links in each block separated with host.splitSeparator.
		// this.apiUrl			[string] API or web linkchecker URL
		// this.postData		[string] POSTDATA for POST request
		// this.resLiveRegex 	[regex] matches live substrings in the request response
		// this.resDeadRegex 	[regex] matches dead substrings in the request response
		// this.resUnavaRegex 	[regex] matches unava substrings in the request response (the regex is often null!)
		//
		// this.resLinkRegex 	[regex] matches links further passed to DisplayTheCheckedLinks
		//
		// See the code below for standard bulkcheck handling reference.
		//////////////////////////////
		function genBulkCheck()
		{
			var blockIdx = this.links.length;

			while (blockIdx--)
			{
				postRequest(this.apiUrl, this.postData, this.links[blockIdx],
					this.resLinkRegex, this.resLiveRegex, this.resDeadRegex, this.resUnavaRegex);

			}
			function postRequest(api, postData, links, linkRegex, liveRegex, deadRegex, unavaRegex)
			{
				GM_xmlhttpRequest(
				{
					method: 'POST',
					url: api,
					headers: {
						'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
						'Content-type': 'application/x-www-form-urlencoded',
						'Referer': api,
						'X-Requested-With': 'XMLHttpRequest'
					},
					data: postData + encodeURIComponent(links),
					onload: function (result)
					{
						var res = result.responseText;

						// GM_log(res);

						var i;

						var livelinks = res.match(liveRegex);
						var deadlinks = res.match(deadRegex);

						// GM_log(livelinks);
						// GM_log(deadlinks);

						if (livelinks != null)
						{
							i = livelinks.length - 1;
							do
							{
								livelinks[i] = livelinks[i].match(linkRegex)[1];
							}
							while (i--);
							DisplayTheCheckedLinks(livelinks, 'alive_link');
						}

						if (deadlinks != null)
						{
							i = deadlinks.length - 1;
							do
							{
								deadlinks[i] = deadlinks[i].match(linkRegex)[1];
							}
							while (i--);
							DisplayTheCheckedLinks(deadlinks, 'adead_link');
						}

						if (unavaRegex != null)
						{
							var unavalinks = res.match(unavaRegex);
							if (unavalinks)
							{
								i = unavalinks.length - 1;
								do
								{
									unavalinks[i] = unavalinks[i].match(linkRegex)[1];
								}
								while (i--);
								DisplayTheCheckedLinks(unavalinks, 'unava_link');
							}
						}
					}
				});

			}
		}

		//specialized bulkchecking handlers follow
		function webshareBulkCheck()
		{
			var arr = this.links[0].split("\r\n");
			var i = arr.length;

			while(i--)
			{
				postRequest(arr[i]);
			}

			//function postRequest(api, postData, links, linkRegex, liveRegex, deadRegex, unavaRegex)
			function postRequest(wsLink)
			{
				var id = wsLink.match(/webshare\.cz\/(?:(?:#\/)?file\/)?(\w+)/)[1];

				GM_xmlhttpRequest(
				{
					method: 'POST',
					url: "http://webshare.cz/api/file_info/",
					headers: {
						'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
						'Content-type': 'application/x-www-form-urlencoded',
						'Referer': "",
					},
					data: "wst=&ident=" + id,
					onload: function (result)
					{
						var res = result.responseText;

						if (res.match(/<name>.+?<\/name>/))
						{
							DisplayTheCheckedLinks([id], 'alive_link');
						}
						else
						{
							DisplayTheCheckedLinks([id], 'adead_link');
						}
					}
				});

			}
		}
		//like genBulkCheck, but extabit linkchecker only works when logged in. If not logged in, non-bulk checking has to be used.
		//extabit also doesn't like requests in fast succession, so some delays are added.
		function extabitBulkCheck()
		{
			var timeoutDelay = 0;

			var blockIdx = this.links.length;
			while (blockIdx--)
			{
				postRequest(this.apiUrl, this.postData, this.links[blockIdx],
					this.resLinkRegex, this.resLiveRegex, this.resDeadRegex, this.resUnavaRegex);

			}

			function postRequest(api, postData, links, linkRegex, liveRegex, deadRegex, unavaRegex)
			{
				GM_xmlhttpRequest(
				{
					method: 'POST',
					url: api,
					headers: {
						'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
						'Content-type': 'application/x-www-form-urlencoded',
						'Referer': api,
						'X-Requested-With': 'XMLHttpRequest'
					},
					data: postData + encodeURIComponent(links),
					onload: function (result)
					{
						var res = result.responseText;

						if (/id="registration_header"/.test(res))  //not logged in, have to use non-bulk
						{
							function geturlfunc(link, tryID) //basically the geturl function with some changes (compacted, displaythecheckedlinkS, multiple tries)
							{
								//GM_log(tryID + ': ' + link);
								GM_xmlhttpRequest(
								{
									method: 'GET',
									url: link,
									headers: {'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8','Accept-Charset': 'windows-1250,utf-8;q=0.7,*;q=0.7','Referer': ""},
									onload: function(result2)
									{
										var res2 = result2.responseText;
										var res2Status = result.status;
										if (/download-file-btn/.test(res2)) {DisplayTheCheckedLinks([link], 'alive_link'); return;}
										if (/Search mirrors|id="mirrb"/.test(res2) || res2Status==404) {DisplayTheCheckedLinks([link], 'adead_link'); return;}
										if (/currently unavailable|temporarily unavailable|disponible en estos momentos|vorläufig unerreichbar|Файл временно недоступен/.test(res2) || res2Status == 500 || res2Status == 503)
										{
											if (tryID < 7)
												setTimeout(function(){geturlfunc(link,tryID+1)}, tryID * 1000 + (Math.random() * tryID * 2000));
											else
												{DisplayTheCheckedLinks([link], 'unava_link'); return;}
										}
									}
								});
							}

							//split the hrefs and check them one by one
							GM_log('Using slow extabit.com link checking. Log in to extabit to use fast bulk checking.');
							links = links.split('\n');
							var i = links.length;
							while (i--)
							{
								if (links[i])
								{
									(function(i){setTimeout(function(){geturlfunc(links[i],1)}, timeoutDelay);})(i);
									timeoutDelay += 500;
								}
							}

							return;
						}


						var i;

						var livelinks = res.match(liveRegex);
						var deadlinks = res.match(deadRegex);

						if (livelinks != null)
						{
							i = livelinks.length - 1;
							do
							{
								livelinks[i] = livelinks[i].match(linkRegex)[1];
							}
							while (i--);
							DisplayTheCheckedLinks(livelinks, 'alive_link');
						}

						if (deadlinks != null)
						{
							i = deadlinks.length - 1;
							do
							{
								deadlinks[i] = deadlinks[i].match(linkRegex)[1];
							}
							while (i--);
							DisplayTheCheckedLinks(deadlinks, 'adead_link');
						}

						if (unavaRegex != null)
						{
							var unavalinks = res.match(unavaRegex);
							if (unavalinks)
							{
								i = unavalinks.length - 1;
								do
								{
									unavalinks[i] = unavalinks[i].match(linkRegex)[1];
								}
								while (i--);
								DisplayTheCheckedLinks(unavalinks, 'unava_link');
							}
						}
					}
				});

			}
		}
		function _1falBulkCheck()
		{
			var arr = this.links[0].split("\r\n");
            var i = arr.length;

            c=0;
            arrIDs=[];
            while(i--)
            {
            	id = arr[i].match(/\/d\/(\w+)/)[1];

            	_1falalreadyexist=false;
            	for (j=0;j<arrIDs.length;j++)
            	{
            		if (arrIDs[j]==id)
            		{
            			_1falalreadyexist=g
            			break;
            		}
            	}
            	if (_1falalreadyexist) continue;
            	arrIDs.push(id);
            	c++;
            	setTimeout(_1falRequest,c*500,arr[i]);
            }
		}
		function _1falRequest(_1falLink)
		{
			var id = _1falLink.match(/\/d\/(\w+)/)[1];
			GM_xmlhttpRequest(
			{
				method: 'GET',
				url: _1falLink,
				headers: {
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
					'Accept-Charset': 'windows-1250,utf-8;q=0.7,*;q=0.7',
					'Referer': 'http://www.planetsuzy.org/'
				},
				onload: function (result)
				{
					var res = result.responseText;

					FAarr=res.match(/action=\"([\w\:\/\.]+)\"/);
					if (FAarr!=null)
					{
						FALink=FAarr[1];
						D_OP=res.match(/name=\"op\" value=\"(\w+)\"/)[1];
						D_id=res.match(/name=\"id\" value=\"(\w+)\"/)[1];
						D_referer=res.match(/name=\"referer\" value=\"([\w\:\/\.\?\&]+)\"/)[1];
						GM_xmlhttpRequest(
						{
							method: 'POST',
							url: FALink,
							headers: {
								'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
								'Accept-Charset': 'windows-1250,utf-8;q=0.7,*;q=0.7',
								'Content-Type': 'application/x-www-form-urlencoded',
								'Referer': _1falLink
							},
							data: 'op='+D_OP+'&id='+D_id+'&referer='+encodeURIComponent(D_referer),
							onload: function (_2ndresult)
							{
								var newres = _2ndresult.responseText;
								FAalivelink=new RegExp("method_free");
								if (FAalivelink.test(newres))
								{
									DisplayTheCheckedLinks([_1falLink], 'alive_link');
									return;
								}
								FAdeadlink=new RegExp("style=\"width:500px;text-align:left;\">");
								if (FAdeadlink.test(newres))
								{
									DisplayTheCheckedLinks([_1falLink], 'adead_link');
									return;
								}
								DisplayTheCheckedLinks([_1falLink], 'unava_link');
								return;
							}
						});
						return;
					}
					else
					{
						DisplayTheCheckedLinks([_1falLink], 'unava_link');
						return;
					}
				},
				onerror: function ()
				{
					DisplayTheCheckedLinks([_1falLink], 'unava_link');
					return;
				}
			});
		}
        function fikperBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                postRequest(arr[i]);
            }
            function postRequest(fikperLink)
            {
                var linkId = fikperLink.match(/fikper\.com\/(\w+)/)[1];

                GM_xmlhttpRequest(
                    {
                        method: "POST",
                        url: 'https://sapi.fikper.com',
                        headers: {
                            'User-agent':'Mozilla/4.0 [en] (Windows NT 6.0; U)',
                            'Content-type': 'application/json',
                            'Referer': "",
                            'Origin':'https://fikper.com'
                        },
                        data: JSON.stringify({'fileHashName': linkId}),
                        onload: function (result)
                        {
                            var res = JSON.parse(result.responseText);

                           // var status = res.hasOwnProperty('name');

                            if (res.hasOwnProperty('name'))
                            {
                                DisplayTheCheckedLinks([fikperLink], 'alive_link');
                                return;
                            }


                            if (res.message=='Not Found')
                            {
                                DisplayTheCheckedLinks([fikperLink], 'adead_link');
                                return;
                            }
                        }
                    });
            }
        }
function gofileBulkCheck()
            {

                var arr = this.links[0].split("\r\n");
                var arrlen = arr.length;
                var token;
                    GM_xmlhttpRequest
                    (
                        {
                    method: 'POST',
                    url: 'https://api.gofile.io/accounts',
                    headers: {
                        'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
                        'Content-type': 'application/x-www-form-urlencoded',
                        'Referer': ''
                    },
                    onload: function(result)
                            {
                                var resp = JSON.parse(result.responseText);
                                token = resp.data.token;
                                while(arrlen--)
                                {
                                    postRequest(arr[arrlen], token);
                                }
                            }
                        }
                    );
                function postRequest(gofileLink,token)
                {
                    var linkId = gofileLink.match(/gofile\.io\/d\/(\w+)/)[1];

                    GM_xmlhttpRequest
                    (
                        {
                            method: "GET",
                           url: 'https://api.gofile.io/contents/' + linkId + '?wt=4fd6sg89d7s6',
                            headers: {
                                'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
                                'Authorization': 'Bearer ' + token,
                           },
                            onload: function (result)
                            {

                                var res = JSON.parse(result.responseText);
                                if (res.status=="ok")
                                {
                                    DisplayTheCheckedLinks([gofileLink], 'alive_link');
                                    return;
                                }

                                if (res.status=='error-notFound')
                                {
                                    DisplayTheCheckedLinks([gofileLink], 'adead_link');
                                    return;
                                }
                            }
                        }
                    );
                }
            }
 		function k2sBulkCheck()
		{
			var arr = this.links[0].split("\r\n");
            var i = arr.length;

            c=0;
            arrIDs=[];
            while(i--)
            {
            	id = arr[i].match(/\/file\/(\w+)/)[1];
							if (id=='info')
            	{
            		DisplayTheCheckedLinks([arr[i]], 'adead_link');
					continue;
            	}
            	k2salreadyexist=false;
            	for (j=0;j<arrIDs.length;j++)
            	{
            		if (arrIDs[j]==id)
            		{
            			k2salreadyexist=true;
            			break;
            		}
            	}
            	if (k2salreadyexist) continue;
            	arrIDs.push(id);
            	c++;
            	setTimeout(k2sRequest,c*750,arr[i]);
            }
		}
function k2sRequest(K2SLink)
		{
            var mpDomain;
            mpDomain=K2SLink.toLowerCase();;
            if (mpDomain.indexOf('k2s.cc/')>-1||mpDomain.indexOf('keep2s.cc/')>-1||mpDomain.indexOf('keep2share.cc/')>-1)
            {
                mpDomain='k2s.cc';
            }
            else if (mpDomain.indexOf('fileboom.me/')>-1||mpDomain.indexOf('fboom.me/')>-1)
            {
                mpDomain='fboom.me';
            }
            else if (mpDomain.indexOf('tezfiles.com/')>-1)
            {
                mpDomain='tezfiles.com';
            }
            else if (mpDomain.indexOf('publish2.me/')>-1)
            {
                mpDomain='publish2.me';
            }
			var id = K2SLink.match(/\/file\/(\w+)/)[1];

            var MPAPILink='https://'+mpDomain+'/api/v2/GetFileStatus';
			GM_xmlhttpRequest(
			{
				method: 'POST',
				url: MPAPILink,
				headers: {
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                    'Accept-Charset': 'windows-1250,utf-8;q=0.7,*;q=0.7',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Referer': ''
				},
                data: '{"id":"'+id+'"}',
				onload: function (result)
				{
					var res = result.responseText;

					if (res.match('"is_available":false|"message":"File deleted"|"errorCode":"deleted"|"errorCode":"not_found"|"errorCode":"abused"|"errorCode":"blocked"|"code":406|"errorCode":20|"message":"File not available"'))
                    //if (res.match('"is_available":false|"message":"File deleted"|"errorCode":"deleted"|"errorCode":"not_found"|"isAvailableForFree":false|"errorCode":"abused"|"errorCode":"blocked"')) //use to mark premium links as dead
					{
						DisplayTheCheckedLinks([K2SLink], 'adead_link');
						return;
					}
                    if (res.match('"access":"premium"') || res.match('"isAvailableForFree":false'))
					//if (res.match('"access":"premium"')) //use to mark premium links as dead
					{
						DisplayTheCheckedLinks([K2SLink], 'prem_link');
						return;
					}
                    if (res.match('"is_folder":true'))
					{
						DisplayTheCheckedLinks([K2SLink], 'unava_link');
						return;
					}
                    if (res.match('"is_available":true'))
					{
						DisplayTheCheckedLinks([K2SLink], 'alive_link');
						return;
					}

					DisplayTheCheckedLinks([K2SLink], 'unava_link');
					return;
				},
				onerror: function ()
				{
					DisplayTheCheckedLinks([K2SLink], 'unava_link');
					return;
				}
			});
		}
		function fboomBulkCheck()
		{
			var arr = this.links[0].split("\r\n");
            var i = arr.length;

            c=0;
            arrIDs=[];
            while(i--)
            {
            	id = arr[i].match(/\/file\/(\w+)/)[1];
							if (id=='info')
            	{
            		DisplayTheCheckedLinks([arr[i]], 'adead_link');
					continue;
            	}
            	fbalreadyexist=false;
            	for (j=0;j<arrIDs.length;j++)
            	{
            		if (arrIDs[j]==id)
            		{
            			fbalreadyexist=true;
            			break;
            		}
            	}
            	if (fbalreadyexist) continue;
            	arrIDs.push(id);
            	c++;
            	setTimeout(fboomRequest,c*500,arr[i]);
            }
		}
		function fboomRequest(FBoomLink)
		{
			var id = FBoomLink.match(/\/file\/(\w+)/)[1];
					while (FBoomLink.indexOf("?http")>-1)
			{
				FBoomLink=FBoomLink.substring(FBoomLink.indexOf("?http")+1);
			}
			FBoomLink2='https://fboom.me/file/'+id;
			GM_xmlhttpRequest(
			{
				method: 'GET',
				url: FBoomLink,
				headers: {
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
					'Accept-Charset': 'windows-1250,utf-8;q=0.7,*;q=0.7',
					'Referer': ''
				},
				onload: function (result)
				{
					var res = result.responseText;

					if (res.match('no longer available|class="error-v1-title">404<|File not found or deleted|no longer available'))
					{
						DisplayTheCheckedLinks([FBoomLink], 'adead_link');
						return;
					}

					if (res.match('method="post">Displaying'))
					{
						DisplayTheCheckedLinks([FBoomLink], 'unava_link');
						return;
					}

					if (res.match('only for premium members'))
					{
						DisplayTheCheckedLinks([FBoomLink], 'prem_link');
						return;
					}
					if (res.match('id="download-free" href="#"'))
					{
						slow_id=new RegExp('<a id="download-free" href="#" class="free-button btn-u" data-slow-id="(\\w+)">');
						slID=slow_id.exec(res)[1];
						GM_xmlhttpRequest(
						{
							method: 'POST',
							url: FBoomLink2,
							headers: {
								'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
								'Accept-Charset': 'windows-1250,utf-8;q=0.7,*;q=0.7',
								'Content-Type': 'application/x-www-form-urlencoded',
								'Referer': FBoomLink
							},
							data: 'slow_id='+slID,
							onload: function (result)
							{
								var newres = result.responseText;
								newoversizedtest=new RegExp("Downloading is not possible");
								if (newoversizedtest.test(newres))
								{
									DisplayTheCheckedLinks([FBoomLink], 'prem_link');
									return;
								}
								else
								{
									DisplayTheCheckedLinks([FBoomLink], 'alive_link');
									return;
								}
								DisplayTheCheckedLinks([FBoomLink], 'unava_link');
								return;
							}
						});
						/////////////////////end additional check for oversized links
						return;
					}
					DisplayTheCheckedLinks([FBoomLink], 'unava_link');
					return;
				},
				onerror: function ()
				{
					DisplayTheCheckedLinks([FBoomLink], 'unava_link');
					return;
				}
			});
		}
    function dl4free_1fichier_BulkCheck()
		{
			var arr = this.links[0].split("\r\n");
            var i = arr.length;
            n = 0;
            while(i--)
            {
            	CorrectRE = new RegExp('(https?):\\/\\/(?:www\\.)?(\\w{5,15})\\.1fichier\\.com');
            	arr[i]=arr[i].replace(CorrectRE, '$1://1fichier.com/?$2');
                n ++;
            	setTimeout (gethead_dl4free_1fichier, n * 800, arr [i]);
            }
		}
		function gethead_dl4free_1fichier(link)
		{
			var id = link.match(/(?:1fichier|dl4free)\.com(?:\/)?\?(\w{6,})/)[1];
			GM_xmlhttpRequest(
			{
				method: 'HEAD',
				url: link,
				headers: {
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
					'Accept-Charset': 'windows-1250,utf-8;q=0.7,*;q=0.7',
					'Referer': ''
				},
				onload: function (result)
				{
					if (result.responseHeaders.match(/Content-Disposition: attachment; filename=/))//direct download
					{
						DisplayTheCheckedLinks([id], 'alive_link');
						return;
					}
					else
					{
						getlink_dl4free_1fichier(link);
					}
					return;
				},
				onerror: function ()
				{
					DisplayTheCheckedLinks([id], 'unava_link');
				}
			});
		}
		function getlink_dl4free_1fichier(link)
		{
			var id = link.match(/(?:1fichier|dl4free)\.com(?:\/)?\?(\w{6,})/)[1];
			GM_xmlhttpRequest(
			{
				method: 'GET',
				url: link,
				headers: {
					'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
					'Accept-Charset': 'windows-1250,utf-8;q=0.7,*;q=0.7',
					'Referer': ''
				},
				onload: function (result)
				{
					var res = result.responseText;

					deadRegex=new RegExp('The requested file has been deleted|has been automatically deleted|supprimé automatiquement après|Le fichier demandé a été supprimé|Select files to send|The requested file does not exist|The requested file do not exist|existe pas.|File not found|file could not be found|Select files to send|Selectionnez les fichiers a envoyer|file has been deleted|Le fichier demande a ete supprime|Le fichier demandé n');
					if (deadRegex.test(res))
					{
						DisplayTheCheckedLinks([id], 'adead_link');
						return;
					}

					premiumRegex=new RegExp('only for premium users');
					if (premiumRegex.test(res))
					{
						DisplayTheCheckedLinks([id], 'prem_link');
						return;
					}
					liveRegex=new RegExp('<title>Download</title>|<br/>You must wait|value="Access to download"|submit" value="Download|Download without SSL encryption|submit" value="Telecharger|ok btn-general btn-orange|<input type="submit" value="');
					if (liveRegex.test(res))
					{
						DisplayTheCheckedLinks([id], 'alive_link');
						return;
					}
					DisplayTheCheckedLinks([id], 'unava_link');
				},
				onerror: function ()
				{
					DisplayTheCheckedLinks([id], 'unava_link');
				}
			});
		}
		function nitroflareBulkCheck()
    {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                arr[i]=arr[i].replace('nitroflare.com/watch/','nitroflare.com/view/');
                if (arr[i].substr(arr[i].length-5, 5)=='/free') arr[i]=arr[i].substr(0, arr[i].length-5);
                NitroFlareRequest(arr[i]);
            }
        }
function NitroFlareRequest(NFLink)
        {
            var NFID=NFLink.match(/nitroflare.com\/view\/(\w+)/)[1];
            GM_xmlhttpRequest(
            {
                method: "GET",
                url: NFLink,
                headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': ""
                },
                onload: function (result)
                {
                    var res = result.responseText;
                    if (res.match('file has been removed|id="error" style="display|Probably deleted'))
                    {
                        DisplayTheCheckedLinks([NFID], 'adead_link');
                        return;
                    }
                    if (res.match('Report this file<\/a>|id="slow-download|premiumOnly|premium users only'))
                    {
                        measureRegex=new RegExp('\\[<span dir="ltr" style="text\\-align: left;">([\\d\\.])+\\s([a-zA-Z]+)<\\\/span>\\]<\\\/span>');
                        sizearr=measureRegex.exec(res);
                        if (sizearr[2]=='zzGB')
                        {
                            if (parseFloat(sizearr[1])>1)
                            {
                                DisplayTheCheckedLinks([NFID], 'prem_link');
                            }
                            else
                            {
                                DisplayTheCheckedLinks([NFID], 'alive_link');
                            }
                        }
                        else
                        {
                            DisplayTheCheckedLinks([NFID], 'alive_link');
                        }
                        return;
                    }
                    DisplayTheCheckedLinks([NFID], 'unava_link');
                }
            });
        }
                		function nitroBulkCheck()
    {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;

            while(i--)
            {
                arr[i]=arr[i].replace('nitro.download/watch/','nitro.download/view/');
                if (arr[i].substr(arr[i].length-5, 5)=='/free') arr[i]=arr[i].substr(0, arr[i].length-5);
                NitroRequest(arr[i]);
            }
        }
function NitroRequest(NLink)
        {
            var NID=NLink.match(/nitro.download\/view\/(\w+)/)[1];
            GM_xmlhttpRequest(
            {
                method: "GET",
                url: NLink,
                headers: {
                'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': ""
                },
                onload: function (result)
                {
                    var res = result.responseText;
                    if (res.match('file has been removed|id="error" style="display|Probably deleted'))
                    {
                        DisplayTheCheckedLinks([NID], 'adead_link');
                        return;
                    }
                    if (res.match('Report this file<\/a>|id="slow-download|premiumOnly|premium users only'))
                    {
                        measureRegex=new RegExp('\\[<span dir="ltr" style="text\\-align: left;">([\\d\\.])+\\s([a-zA-Z]+)<\\\/span>\\]<\\\/span>');
                        sizearr=measureRegex.exec(res);
                        if (sizearr[2]=='zzGB')
                        {
                            if (parseFloat(sizearr[1])>1)
                            {
                                DisplayTheCheckedLinks([NID], 'prem_link');
                            }
                            else
                            {
                                DisplayTheCheckedLinks([NID], 'alive_link');
                            }
                        }
                        else
                        {
                            DisplayTheCheckedLinks([NID], 'alive_link');
                        }
                        return;
                    }
                    DisplayTheCheckedLinks([NID], 'unava_link');
                }
            });
  
		}
		function mediafireBulkCheck()
		{

            var arr = this.links[0].split("\r\n");
			var i = arr.length;

			var keys = "";
			var folders = "";

			var foldersFinished = false;
			var filesFinished = false;

			var files_info = [];
			var folders_info = [];

			while (i--)
			{
				var match = getQuickKey(arr[i]);
				if (match != null) {
					if (match.length == 13)
						folders += match + ",";
					else
						keys += match + ",";
				}
			}
			if (folders != "")
				GM_xmlhttpRequest(
				{
					method: "POST",
					url: 'https://www.mediafire.com/api/1.5/folder/get_info.php?response_format=json&folder_key=' + folders,
					data: null,
					headers: {
							'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
							'Content-Type': 'application/json',
							'Referer': "https://mediafire.com/"
						},
					onload: function(result)
					{
						var res = JSON.parse(result.response);

						var fi = res.response.folder_info;
						if (fi != null)
							folders_info.push(fi);

						var fi = res.response.folder_infos;
						if (fi != null)
							folders_info = [...folders_info, ...fi];

						foldersFinished = true;
						finish();
					}
				});
			else
				foldersFinished = true;

			if (keys != "")
				GM_xmlhttpRequest(
				{
					method: "POST",
					url: 'https://www.mediafire.com/api/1.5/file/get_info.php?response_format=json&quick_key=' + keys,
					data: null,
					headers: {
							'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
							'Content-Type': 'application/json',
							'Referer': "https://mediafire.com/"
						},
					onload: function(result)
					{

						var res = JSON.parse(result.response);

						var fi = res.response.file_info;
						if (fi != null)
							files_info.push(fi);

						var fi = res.response.file_infos;

						if (fi != null)
							files_info = [...files_info, ...fi];

						filesFinished = true;
						finish();
					}
				}
				);
			else
				filesFinished = true;

			function finish() {
				if (!filesFinished || !foldersFinished)
					return;
				i = arr.length;

				while (i--)
				{
					var key = getQuickKey(arr[i]);
					if (key != null && key != '')
					{
						if (isValid(key)) {
							DisplayTheCheckedLinks([arr[i]], 'alive_link');
						} else {
							DisplayTheCheckedLinks([arr[i]], 'adead_link');
						}
					}
				}
			}

            function getQuickKey(link) {
                var rx = /mediafire\.com\/?(\?|file\/|folder\/|download\/|download\.php\?|view\/)(.*?)(#|\/|,|$)/g;
                var match = rx.exec(link);
                if (match != null)
                    return match[2];
                else
                    return null;
            }

            function isValid(quickkey) {
				for (var i = 0; i < files_info.length; i++) {
					if (quickkey == files_info[i].quickkey) {
						return true;
					}
				}
				for (var i = 0; i < folders_info.length; i++) {
					if (quickkey == folders_info[i].folderkey) {
						return true;
					}
				}
				return false;
			}
		}

        function megaBulkCheckNew()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;
            var seqno = Math.floor(Math.random()*1000000000);

            var body = '[';

            var id;

            while(i--)
            {
                //fiju 2020-04-03 mega introduced new link format with file instead of #!
                id = arr[i].match(/mega(?:\.co)?\.nz\/(#!|file\/)(\w+)(?:(!|#)\w+)?/)[2];
                body += '\r\n{"a":"g","p":"' + id + '","ssl": "1"},'
            }

            body = body.slice(0, -1) + '\r\n]';

            GM_xmlhttpRequest(
                {
                    method: "POST",
                    url: 'https://g.api.mega.co.nz/cs?id=' + seqno++,
                    data: body,
                    headers: {
                        'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                        'Content-Type': 'application/json',
                        'Referer': "https://mega.nz/"
                    },
                    onload: function(result)
                    {
                        var resp = JSON.parse(result.response);

                        var i = resp.length;
                        var res;
                        while (i--)
                        {
                            res = resp[i];
                            if ((typeof res == "number" && (res == -9 || res ==-8 || res == -16 || res == -6)) || res.d) {
                                DisplayTheCheckedLinks([arr[resp.length - i -1].match(/mega(?:\.co)?\.nz\/(#!|file\/)(\w+)(?:(!|#)\w+)?/)[0]], 'adead_link');
                            } else if (res.e == "ETEMPUNAVAIL") {
                                DisplayTheCheckedLinks([arr[resp.length - i -1].match(/mega(?:\.co)?\.nz\/(#!|file\/)(\w+)(?:(!|#)\w+)?/)[0]], 'unava_link');
                            } else if (res.at) {
                                DisplayTheCheckedLinks([arr[resp.length - i -1].match(/mega(?:\.co)?\.nz\/(#!|file\/)(\w+)(?:(!|#)\w+)?/)[0]], 'alive_link');
                            } else {
                                console.warn("Error in checking Mega.co.nz! Please notify devs.\r\nError code: " + result.response);
                            }
                        }
                    }
                }
            );
        }

        function megaBulkCheck()
        {
            var arr = this.links[0].split("\r\n");
            var i = arr.length;
            var seqno = Math.floor(Math.random()*1000000000);

            while(i--)
            {
            postRequest(arr[i]);
            }

		function postRequest(megaLink)
        {
            megaLink=megaLink.replace('mega.nz/','mega.co.nz/');
            var id = megaLink.match(/mega\.co\.nz\/file\/(\w+)/)[1];

            if (id=='F')
            {
                id = megaLink.match(/mega\.co\.nz\/#(F!\w+)/)[1]
                DisplayTheCheckedLinks([id], 'unava_link');
            }
            else

                GM_xmlhttpRequest(
                    {
                        method: "POST",
                        url: 'https://g.api.mega.co.nz/cs?id=' + seqno++,
                        data: '[{"a":"g","p":"' + id + '","ssl": "1"}]',
                        headers: {
                            'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
                            'Content-Type': 'application/xml',
                            'Referer': "https://mega.co.nz/"
                        },
                        onload: function (result)
                        {
                            var res = $.parseJSON(result.responseText.match(/\[(.+?)\]/)[1]);

                            if ((typeof res == "number" && (res == -9 || res == -16 || res == -6)) || res.d)
                            {

                                DisplayTheCheckedLinks([id], 'adead_link');
                            }
                            if (res.at)
                            {

                                DisplayTheCheckedLinks([id], 'alive_link');
                            }
                            if (res.e == "ETEMPUNAVAIL")
                            {

                                DisplayTheCheckedLinks([id], 'unava_link');
                            }
                        }
                    });
        }

        }
		function linkcryptBulkCheck()
		{
			var arr = this.links[0].split("\r\n");
			var i = arr.length;

			while(i--)
			{
				postRequest(arr[i]);
			}

			function postRequest(lcLink)
			{
				GM_xmlhttpRequest(
				{
					method: "GET",
					url: 'http://linkcrypt.ws/api.html?api=status_V1&folderKey=' + lcLink.match(/dir\/(\w+)/)[1],
					headers: {
						'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
						'Accept': 'text/xml',
						'Referer': ""
					},
					onload: function (result)
					{
						var res = result.responseText;

						if (res.match(/<errorCode>1101|Folder not Found|folderStatus>[23]/)) //Offline status
						{
							DisplayTheCheckedLinks([lcLink], 'adead_link');
							return;
						}

						if (res.match(/folderStatus>1/)) //Online status
						{
							DisplayTheCheckedLinks([lcLink], 'alive_link');
						}
						else
						{
							DisplayTheCheckedLinks([lcLink], 'unava_link');
						}
					}
				});
			}
		}
/*		function hellshareBulkCheck()
		{
			var links = this.links;

			GM_xmlhttpRequest(
			{
				method: "GET",
				url: 'http://www.hellshare.com',
				headers: {
					'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
					'Accept': 'text/xml',
					'Referer': ""
				},
				onload: function (result)
				{
					var domain = result.responseText.match(/param_rau = "www\.hellshare\.(\w+)"/)[1];

					var loc = 'check=Zkontrolovat+dostupnost+soubor%C5%AF&links=';
					if (domain == 'sk')
						loc = 'check=Skontrolova%C5%A5&links=';
					if (domain == 'com')
						loc = 'check=Check+availability&links=';
					if (domain == 'hu')
						loc = 'check=Kontrol%C3%A1lj&links=';
					if (domain == 'pl')
						loc = 'check=Sprawd%C5%BC+dost%C4%99pno%C5%9B%C4%87+plik%C3%B3w&links=';


					genBulkCheck.call({ 	links:			links,
											apiUrl: 		'http://www.hellshare.' + domain + '/linkchecker?do=linkChecker-linkcheckerform-submit',
											postData: 		loc,
											resLinkRegex:	/hellshare\.(?:cz|com|sk|hu|pl)\/(?:[\w-\.]+\/|)([\w-\.]+\/\d{5,})/,
											resLiveRegex:	/OK" style="width:21px;height:20px;margin-right:10px;" \/><a href="http:\/\/download\.hellshare\.(?:cz|com|sk|hu|pl)\/(?:[\w-\.]+\/|)[\w-\.]+\/\d{5,}/g,
											resDeadRegex:	/<span style="color:gray">.*?<\/span> - <strong>/g,
											resUnavaRegex: 	null
							});
				}
			});
		}


		/**
		 * Displays check result
		 * @param {Array} Array of links or link fragments.
		 * @param {String} Check result status -> ['alive_link'|'adead_link'|'unava_link']
		 */
		function DisplayTheCheckedLinks(links, resultStatus)
		{
			//(a[href*=link_1], a[href*=link_2], ..., a[href*=link_n])
			var $links = $('a[href*="' + links.join('"], a[href*="') + '"]');

			if (Do_not_linkify_DL_links)
			{	//TODO into separate jQuery function
				$links.replaceWith(function(){
					return '<span href="' + this.href + '">' + $(this).text() + '</span>';
				});

				$links = $('span[href*="' + links.join('"], span[href*="') + '"]');
			}

			$links.removeClass().addClass(resultStatus);
			$links.each(function() {
				this.href = Ref_anonymize_service + $(this).attr("href");
			});

			switch(resultStatus)
			{
				case "alive_link": 	cLinksAlive += $links.length;
									if (Display_tooltip_info) $links.mouseover(displayTooltipInfo);
									break;
				case "adead_link": 	cLinksDead += $links.length;
									if (Display_tooltip_info) $links.mouseover(displayTooltipError);
									break;
					case "prem_link": 	cLinksprem += $links.length;
					if (Display_tooltip_info) $links.mouseover(displayTooltipError);
					break;
				case "unava_link": 	cLinksUnava += $links.length; break;
				default:
			}

			cLinksProcessed += $links.length;
		}
	}

	// starts bulkchecking
	//
	// params
	// filterId 	[string] restricts link detection with passed id attribute
	function startBulkCheck(filterId)
	{
		var cHosts = bulkHosts.length;

		if (cHosts == 0) //no filehostings selected
			return;

		// STEP 1 linkify the links
		var linkifyRegex = '';
		var hostIdx = cHosts;
		while(hostIdx--)
		{
			linkifyRegex += bulkHosts[hostIdx].linkRegex + "|";
		}
		linkifyRegex = linkifyRegex.replace(/\|$/, '');
		linkify(linkifyRegex);
		//

		//STEP 2 detect link objects
		var xpathAll = '';

		var hostIdx = cHosts;
		while(hostIdx--)
		{
			xpathAll += bulkHosts[hostIdx].xpath + "|";
		}

		xpathAll = xpathAll.replace(/\]\|\/\/a\[/g, " or ");
		xpathAll = xpathAll.replace(/\]\|/, ')]');

		if (filterId != null) //insert id restriction in the xpath
		{
			xpathAll = xpathAll.replace(/\[/, "[@class='" + filterId + "' and (");
		}
		else
		{
			xpathAll = xpathAll.replace(/\[/, "[((not(@class)) or (@class!='alive_link' and @class!='adead_link' and @class!='unava_link')) and (");
		}

		var links = document.evaluate(xpathAll, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

		if (filterId == null)
		{
			cLinksTotal += links.snapshotLength;
		}
		//

		//STEP 3 bind links with hostings
		var linkIdx = links.snapshotLength;
		var href = null;

		if (linkIdx == 0) // no links found
			return;

		var name;
		while (linkIdx--)
		{
			href = links.snapshotItem(linkIdx).href;

			try // DO NOT REMOVE, filters crap that went through xpath detection
			{
				name = gimmeHostName(href);
                if (href.match(bulkHostNames[name].linkRegexObject) != null) {
					bulkHostNames[name].links.push(href);
                }
			}
			catch(e)
			{

			}
		}
		//


		//STEP 4 process the links for each filehosting
		var hostIdx = cHosts;
		var host;
		var m,n;
		var arr;

		while (hostIdx--)
		{
			host = bulkHosts[hostIdx];
			arr = host.links;

			if (arr.length == 0) //no links for this hosting, skip
			{
				continue;
			}

			//links match corrections
			if (host.corrMatch != null)
			{
				var idx = arr.length;
				while (idx--)
				{
					arr[idx] = arr[idx].match(host.corrMatch)[1];
				}
			}

			//links replace corrections
			if ((host.corrReplWhat != null) && (host.corrReplWith != null))
			{
				var idx = arr.length;
				while (idx--)
				{
					arr[idx] = arr[idx].replace(host.corrReplWhat, host.corrReplWith);
				}
			}

			m = arr.length;
			n = host.blockSize;
			if (m > n)
			{
				//insert block separators (RAND_STRING) into the array
				for(var i = n; i < m; i += n + 1)
				{
					arr.splice(i, 0, RAND_STRING);
				}
			}

			host.func.call({ 	links:			arr.join(host.splitSeparator).split(RAND_STRING),
								apiUrl: 		host.apiUrl,
								postData: 		host.postData,
								resLinkRegex:	host.resLinkRegex,
								resLiveRegex:	host.resLiveRegex,
								resDeadRegex:	host.resDeadRegex,
								resUnavaRegex: 	host.resUnavaRegex
							});


			//clean up
			arr.length = 0;
		}
		//

    function gimmeHostName(link)
		{
			return link.replace(/https?:\/\/.*?http(s)?:\/\//, "http$1://").match(/https?:\/\/(?:www\.|[\w\.])*?([\w-]+)\.(?:co\.uk|co\.nz|\w+)\//)[1];
		}

	}


	function checkLinks(filterId)
	{
		startBulkCheck(filterId);
		start(filterId);
	}

	/**
	 * Initialises progress box including event binding and CSS
	 */
	function initProgressBox()
	{
		if ($("#warlc-progressbox").length > 0)
			return;

		//progressbox css change size and color of progress box
		var progressboxCss = "#warlc-progressbox  {position:fixed; background:white;" + Progress_box_background_color +
					"; opacity:" + (Progress_box_opacity / 100) +
					"; bottom:" + Processbox_Pos_Y +
					"%; left:" + Processbox_Pos_X +
					"%; padding:5px; font-size:20px; font-weight:bold; cursor:default;}\
					\
					.warlc-progressbar {text-align:center; color: yellow; height:2px; margin-bottom:2px;}\
					\
					.warlc-progressitem {}\
					\
					.alive {color:#00FF7F; " + Live_links_color +
					"; background:transparent url(" + alive_link_png + ") no-repeat scroll 100% 50%;padding-right:15px;} .dead {color:" + Dead_links_color +
					"; background:transparent url(" + adead_link_png + ") no-repeat scroll 100% 50%;padding-right:15px;} .unava {color: " + Temp_unavailable_links_color +
					"; background:transparent url(" + unava_link_png + ") no-repeat scroll 100% 50%;padding-right:15px;} .processing {color:Black; " + Container_links_color +
					"; background:transparent url(" + processing_link_gif + ") no-repeat scroll 100% 50%;padding-right:15px;} .prem {color:" + Premium_links_color +
					"; background:transparent url(" + prem_link_png + ") no-repeat scroll 100% 50%;padding-right:15px;}";
		//
		if (Progressbox_Scaling != 100) {
			$.each(progressboxCss.match(/[\d\.]+px/g), function(i, el) { //dynamic rescaling of the progressbox according to user settings
				progressboxCss = progressboxCss.replace(new RegExp(el + "(?!" + RAND_STRING + ")"), parseFloat(el) * Progressbox_Scaling/100 + "px" + RAND_STRING); //RAND_STRING to prevent the same value replaced twice
			});
		}

		progressboxCss = progressboxCss.replace(new RegExp(RAND_STRING, "g"), "").replace("ToBeAddedLater", unava_link_png); //inserting the unava_link_png at the end because the function messes up its base64 string

		GM_addStyle(progressboxCss);

		$('body').append('	<div id="warlc-progressbox">\
							<div class="warlc-progressbar"></div>\
							<span class="warlc-progressitem alive"></span> - \
							<span class="warlc-progressitem dead"></span> - \
							<span class="warlc-progressitem unava"></span> - \
							<span class="warlc-progressitem prem"></span> - \
							<span class="warlc-progressitem processing"></span>\
							</div>');

		$('#warlc-progressbox').hide().click(function(){
												clearInterval(intervalId);
												$(this).hide();
												return false;
											});

		$(".warlc-progressbar").progressbar({complete: function(){
												$(this).fadeOut();
												clearInterval(intervalId); //stop refreshing the stats
												}
											})
								.one('progressbarchange', function(){$('#warlc-progressbox').show();});

	}

	/**
	 * Updates progress data in progress box
	 */
	function updateProgress()
	{
		$("#warlc-progressbox").attr('aria-valuenow', Math.round(((100 / cLinksTotal) * cLinksProcessed)));
		if (cLinksTotal) // some links were detected on page
		{
			var percProgress = Math.round(((100 / cLinksTotal) * cLinksProcessed));
			var $progressItems = $('#warlc-progressbox > .warlc-progressitem');

			$(".warlc-progressbar").progressbar('option', 'value', percProgress);

						if ((cLinksTotal - cLinksProcessed) == 0)
			{
				$progressItems.first().text(cLinksAlive)
							.next().text(cLinksDead)
							.next().text(cLinksUnava)
							.next().text(cLinksprem)
							.next().remove();
				$('#warlc-progressbox').html($('#warlc-progressbox').html().substr(0,$('#warlc-progressbox').html().lastIndexOf(">")+1));
				$('#warlc-progressbox div:first-child').remove();
			}
			else
			{
				$progressItems.first().text(cLinksAlive)
							.next().text(cLinksDead)
							.next().text(cLinksUnava)
							.next().text(cLinksprem)
							.next().text(cLinksTotal - cLinksProcessed);
			}
		}
	}



	function check_all_links()
	{
		add_WARLC_style();

		if (Show_progress_stats)
		{
			initProgressBox();
			intervalId = setInterval(function(){updateProgress();}, Progress_box_refresh_rate);
		}

		startBulkCheck(null);
		start(null);

		if (!containers_processed)
		{
			processContainers();
		}

	}

	//Copies all found dead links to clipboard - right now for Scriptish only
	function copy_dead_to_clipboard()
	{
		initClipBoardTools();

		var deadlinksxpath = "//.[@class='adead_link']";

		var foundlinks = document.evaluate(deadlinksxpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var foundlinkstext = '';

		var foundlinkIdx = foundlinks.snapshotLength;

		while(foundlinkIdx--)
		{
			if (foundlinks.snapshotItem(foundlinkIdx).href != ' x')
				foundlinkstext += foundlinks.snapshotItem(foundlinkIdx).href.replace(/\[\/hide:\w+\]/,"") + '\n';
		}

		GM_setClipboard(foundlinkstext);
	}
	//Copies all found live links to clipboard
	function copy_live_to_clipboard()
	{
		initClipBoardTools();

		var livelinksxpath = "//.[@class='alive_link']";

		var foundlinks2 = document.evaluate(livelinksxpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		var foundlinks2text = '';

		var foundlink2Idx = foundlinks2.snapshotLength;

		while(foundlink2Idx--)
		{
			if (foundlinks2.snapshotItem(foundlink2Idx).href != ' x')
				foundlinks2text += foundlinks2.snapshotItem(foundlink2Idx).href.replace(/\[\/hide:\w+\]/,"") + '\n';
		}

		GM_setClipboard(foundlinks2text);
	}

	function toggle_autocheck()
	{
		var currentState = GM_getValue("Autocheck", false);
		GM_setValue("Autocheck", !currentState);

		if (currentState == true)
		{
			sendMessage('Autocheck disabled', 'red');
		}
		else
		{
			sendMessage('Autocheck enabled', 'SpringGreen');
		}
	}

	function toggle_Enable_Anonymizer()
	{
		var currentState = GM_getValue("Enable_Anonymizer", false);
		GM_setValue("Enable_Anonymizer", !currentState);

		if (currentState == true)
		{
			GM_setValue("Ref_anonymize_service", "");
			sendMessage('Anonymizer Disabled', 'red');
		}
		else
		{
			GM_setValue("Ref_anonymize_service", "");
			sendMessage('Anonymizer Enabled', 'SpringGreen');
		}
	}

	function KeyDownHandler(event)
	{
		var kcode = (event.keyCode) ? event.keyCode : event.which;
		if (event.ctrlKey && event.altKey)
		{
			switch(kcode)
			{
				case 65 : check_all_links(); break;
				case 67 : configuration(); break;
				case 68 : copy_dead_to_clipboard(); break;
				case 76 : copy_live_to_clipboard(); break;
				case 87 : toggle_autocheck(); break;
				case 90 : toggle_Enable_Anonymizer(); break;
			}
		}
	}

	//
	//
	//   SCRIPT EXECUTION START POINT
	//
	//

	// Safari specific GM_getResourceText override
	if (navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1)
	{
		GM_getResourceText = function(res) {
			var $cssText = GM_getValue("jquery_css", "");

			if ($cssText == "")
			{
				GM_xmlhttpRequest(
				{
					method: 'GET',
					url: 'http://ajax.googleapis.com/ajax/libs/jqueryui/1.8/themes/base/jquery-ui.css',
					onload: function (result)
					{
						GM_setValue("jquery_css", result.responseText);
						window.location.reload();
					}
				});
			}
			else
			{
				return $cssText;
			}
		}
	}

	var jQueryUICSS = GM_getResourceText("jQueryUICSS");
	GM_addStyle(jQueryUICSS);

	//init the stuff
	setVariables();
	initBulkCheck();

	//init info boxes
	messageBox.style.position = 'fixed';
	messageBox.style.top = '20px';
	messageBox.style.left = '10px';
	messageBox.style.opacity = '0.85';
	messageBox.style.background = 'white';
	messageBox.style.fontSize = '36px';
	document.body.appendChild(messageBox);

	//register GM menu commands & keyboard shortcut event handler
	if (Keyboard_functions)
	{
		$(document).keydown(KeyDownHandler);
		GM_registerMenuCommand("[W.A.R. Links Checker] Configuration  (" + first_key_keycodename + "+" + second_key_keycodename + "+" + String.fromCharCode(CONFIGURATION_KEYCODE) + ")", configuration);
		GM_registerMenuCommand("[W.A.R. Links Checker] Check The Links In This Page (" + first_key_keycodename + "+" + second_key_keycodename + "+" + String.fromCharCode(CHECK_ALL_LINKS_KEYCODE) + ")", check_all_links);
	}
	else
	{
		GM_registerMenuCommand("[W.A.R. Links Checker] Configuration", configuration);
		GM_registerMenuCommand("[W.A.R. Links Checker] Check The Links In This Page", check_all_links);
	}

	//start linkchecking
	if (Autocheck)
	{
		$(document).ready(check_all_links);
	}

	//
	//
	//   SCRIPT EXECUTION END POINT
	//
	//

	//shows configuration box
	function configuration()
	{

		//prevent multiple creating of config window
		if ($("#hideshow").length)
		{
			$("#hideshow").show();
			return;
		}

		var configcss = '\
		.popup_block .popup fieldset{\
		   padding: 1%;\
		   border-style: solid;\
		   border-width: 1px;\
		   border-color: gray;\
		   margin-bottom: 1px;\
		}\
		#h3hideshowtitle{\
		 font-size: 2em;\
		}\
		#h3hideshow{\
		 font-size: 1.5em;\
		}\
		#imghideshow {\
		 border: none;\
		}\
		#plusimage{\
			display:inline;\
			}\
		#hideshow {\
		 position: fixed;\
		 width: 100%;\
		 height: 100%;\
		 top: 0;\
		 left: 0;\
		 font-size:12px;\
		 z-index:2147483645;\
		 text-align:left;\
		}\
		#fade {\
		 background: #000;\
		 position: fixed;\
		 width: 100%;\
		 height: 100%;\
		 opacity: .80;\
		 -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=80)";\
		 left: 0;\
		 z-index: 10;\
		}\
		.popup_block {\
		 font-family:verdana;\
		 color:black;\
		 background: #ddd;\
		 padding: 10px 20px;\
		 border: 2px solid DarkOrange;\
		 float: left;\
		 width: 700px;\
		 position: absolute;\
		 top: 7%;\
		 left: 50%;\
		 bottom: 7%;\
		 margin: 0 0 0 -350px;\
		 -moz-border-radius:10px;\
		 z-index: 100;\
		\
		}\
		.popup_block .popup {\
		 float: left;\
		 width: 100%;\
		 background: #fff;\
		 margin: 10px 0;\
		 padding: 0px 0 0px;\
		 border-left: 1px solid #bbb;\
		 border-top: 1px solid #bbb;\
		 border-right: 1px solid #bbb;\
		}\
		#h3hideshow{\
		 margin: 1px 0 0px;\
		 padding: 1px 10px;\
		 border-bottom: 1px solid #bbb;\
		 font-size: 1.5em;\
		 font-weight: normal;\
		 cursor:pointer;\
		 background:#DDDDDD none repeat scroll 0 0;\
		}\
		#h3hideshow:hover{\
		background:#C0BEBE none repeat scroll 0 0;\
		}\
		#h3hideshowtitle{\
		 margin: 2px 0 0px;\
		 padding: 7px 10px;\
		 border-bottom: 1px solid #bbb;\
		 font-size: 1.5em;\
		 font-weight: normal;\
		}\
		.popup_block .popup a {\
		 color:DarkSkyBlue;\
		 text-decoration:none;\
		}\
		.popup p {\
		 padding: 1px 10px;\
		 margin: 0px 0;\
		 -x-system-font:none;\
		 font-family:verdana,geneva,lucida,"lucida grande",arial,helvetica,sans-serif;\
		 font-size:10pt;\
		 font-size-adjust:none;\
		 font-stretch:normal;\
		 font-style:normal;\
		 font-variant:normal;\
		 font-weight:normal;\
		 line-height:normal;\
		}\
		#sites {\
		 padding: 1px 10px;\
		 margin: 0px 0;display:inline-block;width:16em;\
		}\
		#dev_ver {\
		 color: #00FF00;\
		 background: Black;\
		 text-align: right;\
		}\
		#sites_suspended {\
		 padding: 1px 10px;\
		 margin: 0px 0;display:inline-block;width:16em;\
		 text-decoration: line-through;\
		}\
		.popup img.cntrl {\
		 position: absolute;\
		 right: -15px;\
		 top: -15px;\
		}\
		#bulk {\
			font-size:8pt;\
			color:orange;\
			padding: 1px 10px;\
			margin: 0px 0;\
			display:inline-block;\
			width:100px;\
		}\
		#note {\
			font-size:7pt;\
			color:gray;\
			padding: 1px 10px;\
			margin: 0px 0;display:inline-block;\
			min-width:100px;\
		}\
		#rednote {\
			font-size:7pt;\
			color:red;\
			padding: 1px 10px;\
			margin: 0px 0;display:inline-block;\
		}\
		#configinfo {\
			font-size:8pt;\
			color:gray;\
			padding: 1px 10px;\
			margin: 0px 0;display:inline-block;width:60em;\
		}\
		#refAnonymizer, #inputColorLive, #inputColorprem, #hostSearchBox2, #hostSearchBox, #inputColorDead, #inputColorTemp, #inputColorCont, #selectAllButton, #selectNoneButton, #invertButton, #selectAllButton2, #selectNoneButton2, #invertButton2 {\
			color:black;\
			border-style: solid;\
			border-width: 1px;\
			border-color: gray;\
		}\
		#h3hideshowcontent {\
		min-height:220px;\
		max-height:220px;\
overflow:auto;\
		 display: none;\
		 padding: 10px 10px;\
		}\
		#specinfo{\
		font-size:14px;\
		}\
		.warlc-ui-tab {\
		height:600px;\
        overflow:auto;\
		}\
		#warlcsitelist2, #warlcsitelist1 {\
		height:500px;\
        border-top: 1px solid #ddd;\
		padding-top: 5px;\
		overflow:auto;\
		}\
		input:hover+label {\
		background:#F1F77C;\
		font-size:110%;\
		}\
		';

		GM_addStyle(configcss);

		var customRulesRefHTML =
		'\
		<br>\
		A custom rule consists of <b>commands</b>. A command must be on its own line and in this form:<br>\
		<b>@keyword</b> <i>parameter</i>\
		<br><br>\
		Empty lines, lines containing only whitespace and lines starting with // are ignored. Whitespace before and after a keyword is also ignored. Keywords are not case sensitive. \
		<br><br>\
		A special type of keyword is <b>@customrule</b> and its forms. This command marks the start of a new rule definition and also the rule type.\
		Its <i>parameter</i> is the name of the rule. The name can contain letters, digits, periods, dashes and underscores and can be up to 30 characters long.\
		At this point, there are no other restrictions for rule naming, however, in future versions, the name can be used to identify and catalogize custom rules.\
		Therefore it is strongly recommended to use host names like <i>example.com</i> or <i>filehost.co.uk</i>. If the name is invalid, previous rule is saved,\
		but all commands until the next valid @customrule are ignored.<br><br>\
		Available forms and types:\
		<ul>\
		<li><b>@customrule</b> <i>name</i> - Classic checking. To determine whether a link is alive or dead, it is loaded and searched for specific patterns.\
		<li><b>@customrule_headers</b> <i>name</i> - Only headers are loaded. Use for direct download hosts (e.g. if you are a paying member), where classic checking would silently download the whole file.\
		<li><b>@customrule_obsolete</b> <i>name</i> - Nothing is loaded and no search patterns are needed. Links matching this rule are immediately deemed dead.\
		<li><b>@#customrule</b>\, <b>@#customrule_headers</b>\, <b>@#customrule_obsolete</b> - write # after @ to quickly disable the whole rule. It is still parsed and checked for errors, but not used.\
		</ul>\
		Other available commands:<br>\
		(Note: There can be more than 1 (up to 10) of these commands per rule. In that case, any of them will work.)\
		<ul>\
		<li><b>@baseurl</b> <i>url_pattern</i> - required. Used to find links for the rule. <i>url_pattern</i> must be the constant part of the url before, including and after the first slash.\
			It can also specify multiple (up to 10) Top Level Domains (.com, .net etc.)<br>\
			<ul>examples:<br>\
			<li>good: <i>filehost.com/download/</i><br>\
			<li>good: <i>download.filehost.net/?d=</i><br>\
			<li>good: <i>filehost. com net co.uk /</i> - multiple TLDs (note the spaces before, between and after TLDs)<br>\
			<li>ok: <i>filehost.com/</i> - works, but will also find links like filehost.com/login etc. Sometimes it\'s unavoidable though.<br>\
			<li>bad: <i>d8523.filehost.com/</i> - d8523 probably is not constant<br>\
			<li>bad: <i>filehost.com/3bfiq5d1</i> - 3bfiq5d1 probably is not constant<br>\
			<li>bad: <i>filehost.com</i> - no slash<br>\
			</ul>\
		\
		<li><b>@alivematch</b> <i>pattern</i> - ignored for type OBSOLETE, required for others. If <i>pattern</i> is found in the server\'s response, the link is deemed alive.\
			Two or more spaces in the pattern will match any whitespace (spaces, tabulators, newlines). <i>&lt;div&gt;&nbsp;&nbsp;&lt;p&gt;</i> will match \
			&lt;div&gt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;p&gt; even if there are new lines, tabulators etc.\
		<li><b>@deadmatch</b> <i>pattern</i> - ignored for OBSOLETE, required for others. (For HEADERS some servers return 404 Error \
			which is automatically used to deem the link dead and therefore <i>pattern</i> is never used. In that case, just write some rubbish there.)\
			Two spaces again match any whitespace.\
		<li><b>@unavamatch</b> <i>pattern</i> - optional, ignored for OBSOLETE and HEADERS. If found, the link is deemed temporarily unavailable.\
			Two spaces again match any whitespace.\
		<li><b>@alivelink</b> <i>url</i> - optional, ignored for OBSOLETE. It\'s not really a part of the rule, it\'s just an example link to test the rule. \
		<li><b>@deadlink</b> <i>url</i> - optional. Example dead link.\
		</ul>\
		\
		';

		//close image and css taken from = http://www.sohtanaka.com/web-design/examples/css-popup    icon_close.png;
		var configurationinnerHTML =
		'<div id="fade"></div>\
		<div class="popup_block">\
			<div class="popup">\
				<a href="#"><img id="imghideshow" title="Close" class="cntrl" src="data:image/png;base64,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%3D%3D"/></a>\
			<div id="h3hideshowtitle"><img style="height:1.2em;" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKT2lDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVNnVFPpFj333vRCS4iAlEtvUhUIIFJCi4AUkSYqIQkQSoghodkVUcERRUUEG8igiAOOjoCMFVEsDIoK2AfkIaKOg6OIisr74Xuja9a89+bN/rXXPues852zzwfACAyWSDNRNYAMqUIeEeCDx8TG4eQuQIEKJHAAEAizZCFz/SMBAPh+PDwrIsAHvgABeNMLCADATZvAMByH/w/qQplcAYCEAcB0kThLCIAUAEB6jkKmAEBGAYCdmCZTAKAEAGDLY2LjAFAtAGAnf+bTAICd+Jl7AQBblCEVAaCRACATZYhEAGg7AKzPVopFAFgwABRmS8Q5ANgtADBJV2ZIALC3AMDOEAuyAAgMADBRiIUpAAR7AGDIIyN4AISZABRG8lc88SuuEOcqAAB4mbI8uSQ5RYFbCC1xB1dXLh4ozkkXKxQ2YQJhmkAuwnmZGTKBNA/g88wAAKCRFRHgg/P9eM4Ors7ONo62Dl8t6r8G/yJiYuP+5c+rcEAAAOF0ftH+LC+zGoA7BoBt/qIl7gRoXgugdfeLZrIPQLUAoOnaV/Nw+H48PEWhkLnZ2eXk5NhKxEJbYcpXff5nwl/AV/1s+X48/Pf14L7iJIEyXYFHBPjgwsz0TKUcz5IJhGLc5o9H/LcL//wd0yLESWK5WCoU41EScY5EmozzMqUiiUKSKcUl0v9k4t8s+wM+3zUAsGo+AXuRLahdYwP2SycQWHTA4vcAAPK7b8HUKAgDgGiD4c93/+8//UegJQCAZkmScQAAXkQkLlTKsz/HCAAARKCBKrBBG/TBGCzABhzBBdzBC/xgNoRCJMTCQhBCCmSAHHJgKayCQiiGzbAdKmAv1EAdNMBRaIaTcA4uwlW4Dj1wD/phCJ7BKLyBCQRByAgTYSHaiAFiilgjjggXmYX4IcFIBBKLJCDJiBRRIkuRNUgxUopUIFVIHfI9cgI5h1xGupE7yAAygvyGvEcxlIGyUT3UDLVDuag3GoRGogvQZHQxmo8WoJvQcrQaPYw2oefQq2gP2o8+Q8cwwOgYBzPEbDAuxsNCsTgsCZNjy7EirAyrxhqwVqwDu4n1Y8+xdwQSgUXACTYEd0IgYR5BSFhMWE7YSKggHCQ0EdoJNwkDhFHCJyKTqEu0JroR+cQYYjIxh1hILCPWEo8TLxB7iEPENyQSiUMyJ7mQAkmxpFTSEtJG0m5SI+ksqZs0SBojk8naZGuyBzmULCAryIXkneTD5DPkG+Qh8lsKnWJAcaT4U+IoUspqShnlEOU05QZlmDJBVaOaUt2ooVQRNY9aQq2htlKvUYeoEzR1mjnNgxZJS6WtopXTGmgXaPdpr+h0uhHdlR5Ol9BX0svpR+iX6AP0dwwNhhWDx4hnKBmbGAcYZxl3GK+YTKYZ04sZx1QwNzHrmOeZD5lvVVgqtip8FZHKCpVKlSaVGyovVKmqpqreqgtV81XLVI+pXlN9rkZVM1PjqQnUlqtVqp1Q61MbU2epO6iHqmeob1Q/pH5Z/YkGWcNMw09DpFGgsV/jvMYgC2MZs3gsIWsNq4Z1gTXEJrHN2Xx2KruY/R27iz2qqaE5QzNKM1ezUvOUZj8H45hx+Jx0TgnnKKeX836K3hTvKeIpG6Y0TLkxZVxrqpaXllirSKtRq0frvTau7aedpr1Fu1n7gQ5Bx0onXCdHZ4/OBZ3nU9lT3acKpxZNPTr1ri6qa6UbobtEd79up+6Ynr5egJ5Mb6feeb3n+hx9L/1U/W36p/VHDFgGswwkBtsMzhg8xTVxbzwdL8fb8VFDXcNAQ6VhlWGX4YSRudE8o9VGjUYPjGnGXOMk423GbcajJgYmISZLTepN7ppSTbmmKaY7TDtMx83MzaLN1pk1mz0x1zLnm+eb15vft2BaeFostqi2uGVJsuRaplnutrxuhVo5WaVYVVpds0atna0l1rutu6cRp7lOk06rntZnw7Dxtsm2qbcZsOXYBtuutm22fWFnYhdnt8Wuw+6TvZN9un2N/T0HDYfZDqsdWh1+c7RyFDpWOt6azpzuP33F9JbpL2dYzxDP2DPjthPLKcRpnVOb00dnF2e5c4PziIuJS4LLLpc+Lpsbxt3IveRKdPVxXeF60vWdm7Obwu2o26/uNu5p7ofcn8w0nymeWTNz0MPIQ+BR5dE/C5+VMGvfrH5PQ0+BZ7XnIy9jL5FXrdewt6V3qvdh7xc+9j5yn+M+4zw33jLeWV/MN8C3yLfLT8Nvnl+F30N/I/9k/3r/0QCngCUBZwOJgUGBWwL7+Hp8Ib+OPzrbZfay2e1BjKC5QRVBj4KtguXBrSFoyOyQrSH355jOkc5pDoVQfujW0Adh5mGLw34MJ4WHhVeGP45wiFga0TGXNXfR3ENz30T6RJZE3ptnMU85ry1KNSo+qi5qPNo3ujS6P8YuZlnM1VidWElsSxw5LiquNm5svt/87fOH4p3iC+N7F5gvyF1weaHOwvSFpxapLhIsOpZATIhOOJTwQRAqqBaMJfITdyWOCnnCHcJnIi/RNtGI2ENcKh5O8kgqTXqS7JG8NXkkxTOlLOW5hCepkLxMDUzdmzqeFpp2IG0yPTq9MYOSkZBxQqohTZO2Z+pn5mZ2y6xlhbL+xW6Lty8elQfJa7OQrAVZLQq2QqboVFoo1yoHsmdlV2a/zYnKOZarnivN7cyzytuQN5zvn//tEsIS4ZK2pYZLVy0dWOa9rGo5sjxxedsK4xUFK4ZWBqw8uIq2Km3VT6vtV5eufr0mek1rgV7ByoLBtQFr6wtVCuWFfevc1+1dT1gvWd+1YfqGnRs+FYmKrhTbF5cVf9go3HjlG4dvyr+Z3JS0qavEuWTPZtJm6ebeLZ5bDpaql+aXDm4N2dq0Dd9WtO319kXbL5fNKNu7g7ZDuaO/PLi8ZafJzs07P1SkVPRU+lQ27tLdtWHX+G7R7ht7vPY07NXbW7z3/T7JvttVAVVN1WbVZftJ+7P3P66Jqun4lvttXa1ObXHtxwPSA/0HIw6217nU1R3SPVRSj9Yr60cOxx++/p3vdy0NNg1VjZzG4iNwRHnk6fcJ3/ceDTradox7rOEH0x92HWcdL2pCmvKaRptTmvtbYlu6T8w+0dbq3nr8R9sfD5w0PFl5SvNUyWna6YLTk2fyz4ydlZ19fi753GDborZ752PO32oPb++6EHTh0kX/i+c7vDvOXPK4dPKy2+UTV7hXmq86X23qdOo8/pPTT8e7nLuarrlca7nuer21e2b36RueN87d9L158Rb/1tWeOT3dvfN6b/fF9/XfFt1+cif9zsu72Xcn7q28T7xf9EDtQdlD3YfVP1v+3Njv3H9qwHeg89HcR/cGhYPP/pH1jw9DBY+Zj8uGDYbrnjg+OTniP3L96fynQ89kzyaeF/6i/suuFxYvfvjV69fO0ZjRoZfyl5O/bXyl/erA6xmv28bCxh6+yXgzMV70VvvtwXfcdx3vo98PT+R8IH8o/2j5sfVT0Kf7kxmTk/8EA5jz/GMzLdsAAAAEZ0FNQQAAsY58+1GTAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAAAaASURBVHjarJZ/cFTVFcc/9723m337Ixt2SZYkJE1IIA0tBFqFmSA/ahFQwFqESqcadaYi01KtdYx/lJl2plM747Rp7VTH+rPt1E5Hx7HjVKVVpwENDAUpaQURlF+2ISEQEjab3bf79p7+kRfIr+WH7Zl5/7w5937uPed7zj0mV2bX+ALqAe0CcPQyvhYg/B9s8bz7I59841iFLPlVLFVUrF4AiifxC1YGzB88VF1y6KZ48B3glv8FGp1xs71/s1st98pn5NtSI6temipmkXpinF/tDTH73UNfrBJZVC9uc53clYikgSWFNjYuA17ReG+4CVORQzNEnrr1YRpbQl8H5ozcdF7Y/9zvZyYWNfj9kMtjaniwPBoImGrdpwKHys3lUz7nJ++lTAEuQs0GuwRY7bl97+HKkmVlpgl5PfxHhGq/j0bb1+AtKwxWgGWM9TFt1WBG1BilaIRgtYnPVtcB8ZlB685V0SDkx+oppTXn8joCmJcGK7AU+C/CDe1Ksc5NFKjpN7CCqh648QuhQG2JZYLImF1PZHIcT7vZQgofE2oBQtYFsHb6dGboZH7yfAhTgBtmBayJN1KKjpQDcBzIXxKsBRwtoXRe7JF/uUE53rsvizkuTa4j5IZkCPBZSk12KN7oHwLYA2AaYFkFwAFTtXynIrp/c3lxZ9QyHvNqddvhZwZx0xqD4VxbKNIn87gZeR94/0jGHasf0+C9tMPfk5ku4M8AhgHj42IAhqlY/1T91Od/WVNa//Pq0pmvzZ52X41tbQM6u/dmP+h8dIAiFDYGCjjyuxTAO8DOt/uH+DibHd7ZNBAFbV39JF15GvgEIOcSyzhMG5/aZctL7N3SXCeyoHb4W1Qv7XMrJGyqXwBrTb/KNd4ZkuvaYlK7xhZlcAaY5a1/d2XMlj1NlbJzTqXeWBYS4CAQAepn1RtPbG31HXrkh76TtdXqj0AlAGFLbW2tKjkrzfUXwR78m+XF54F5Xs3uAXqAfwG3jTr4fGCfTyHWcDY+Bq4F5m1cZ53q67ZFJCgiQdnZHpBISP0GqCNiGU8+XFXijLnxglqR5jp5uSEhQNtIPwGqvZuM7wolwHLgZqAUCDXUGftOd9kiWVvS52xJ99si2pa1q8yjwO1G0tV9B4eymQnK1MIMv4WhuMUTWgo4aRgklZpQnP3AW8CrQC9w9913WfNLyxWZwVG1CgTDhIByC/jHrvOZ04cyueLP+q3huvIsbBmETWPaeVcngPMAWtMYKjVWlC30L8ylGDzV4WzPZ+U1Dz5cIAYtX15mQE4uhMY0IZuEwx+KBlwL6DiT09t+eurclmdqy4Y7kMd2RciKaCANEIwbD81vjX6/dqMdDVVbiIbeDueefT8aOHjizcxW4BVgbm2N0TS9RqFzF0PiC8DuPcLhj6QfOGYAXcDjz55Knv1xVx+YCiwDLINdKYdMXjqAVLzR99LqN8oebWqNRu1qixxC3hASiwOser1sdtP9kZeBTUBZPIY/HAKtRyXDB6++kieVlnZg72iNfA14/qa4HVwasTnmuLzQm3STrtxRUmetW/OXsg3hOh9Z9CTtT+FDsfO7ff2djyVfb5xlrNuxoygQLwbHgUAEjnwIi5dm3J4zsgTYNbqfHAC2H0m7ibf608V7B53urOYngWJ1/YoXS2+bMq9oUuiIbgSYvjQQ6P6b03hsv+trmm3I3GtNZQUUvT1wz6YsnQf0U8CTFHgrFZDw1Hnfl34da2vcFCFTAMqYaBr07nD40/IebZui1t9qqWgE3t6uOfCB3gF8FegrBB6x5qrri9688a+JYN6UK57eijDo2HI2+8/HB/8AVAHlQCfQCvz7chOIBTzS1FocNEx1VSNjHmFWS9jvC6mk11QWAbePhl4K/JWa1fbSypU2uSsI8ZgnEyG2wE9igb/Fa7f9MHGTQuANdbcGLzyFV2smiukr7Siw4WqGvZhlqznxhX7cTzmXayA234c33lqFcjneIqZfxX1TJr+t4dWtcUGXgusNgaPLwvQpgJjHcK8EPOAM6J7+vblEfK0fZ9RoqwAnpTnznsN/2jOkuvOUNvmpXmMTrrQuoJWGj36bAugAMhSo2cnsgUil2fb5LRHi1/jRGlJHc5zenaV7p0PyRB7XkR7vfa4IlZtT69fbVKywyafh8HODHN+WfhH4FnD2alN1B7AdOAcMeT29HfiZJ5oZ3sHrgAeBvcCANzBsHu7Ohe2/AwDnNnxcIIMIUgAAAABJRU5ErkJggg=="></img>&nbsp;W.A.R. Links Checker Premium Configuration Page</div>\
			<div id="warlc-conf-tabs">\
				<ul>\
					<li><a href="#tabs-1">Filehostings</a></li>\
					<li><a href="#tabs-2">Containers</a></li>\
					<li><a href="#tabs-5">Custom rules</a></li>\
					<li><a href="#tabs-3">Settings</a></li>\
					<li><a href="#tabs-4">About</a></li>\
				</ul>\
				<div id="tabs-1" class="warlc-ui-tab">\
					<div class="warlc-ui-buttonset">\
						<input type="button" class="warlc-ui-select-all" value="Select All">\
						<input type="button" class="warlc-ui-select-none" value="Select None">\
						<input type="button" class="warlc-ui-select-invert" value="Invert">\
					</div><br>\
					<div>Search: <input type="textbox" id="hostSearchBox" value=""></div><br>\
					<div id="warlcsitelist1"><span>Empty</span></div>\
				</div>\
				<div id="tabs-2" class="warlc-ui-tab">\
					<div class="warlc-ui-buttonset">\
						<input type="button" class="warlc-ui-select-all" value="Select All">\
						<input type="button" class="warlc-ui-select-none" value="Select None">\
						<input type="button" class="warlc-ui-select-invert" value="Invert">\
					</div><br>\
					<div>Search: <input type="textbox" id="hostSearchBox2" value=""></div><br>\
					<div id="warlcsitelist2"><span>Empty</span></div>\
				</div>\
				<div id="tabs-5" class="warlc-ui-tab">\
					<div class="warlcsettings">\
					<fieldset><input type="checkbox" id="Custom_rules"> Enable custom rules <div id="bulk">EXPERIMENTAL</div></fieldset>\
					<br>\
					<div>Edit custom rules: \
						<a href="#" id="showCustomRulesReference">(<b>Click here to show/hide the reference</b>)</a>\
						<div id="customRulesReference" style="display:none;">'
							+ customRulesRefHTML + '\
						</div>\
						<textarea style="width:100%;height:200px;" id="Custom_rules_text"></textarea>\
						</div>\
					</div>\
				</div>\
				<div id="tabs-3" class="warlc-ui-tab">\
					<div class="warlcsettings">\
					<fieldset>\
					<p><input type="checkbox" id="Keyboard_functions"> Enable keyboard shortcuts</p>\
					<div id="configinfo">' + first_key_keycodename + '+' + second_key_keycodename + '+' + CONFIGURATION_KEY + ' = Configuration <br/>' + first_key_keycodename + '+' + second_key_keycodename + '+' + CHECK_ALL_LINKS_KEY + ' = Check all the links' + '<br/>' + first_key_keycodename + '+' + second_key_keycodename + '+' + copy_to_dead_key + ' = Copy found dead links to clipboard' + '<br/>' + first_key_keycodename + '+' + second_key_keycodename + '+' + copy_to_live_key + ' = Copy found live links to clipboard' + '<br/>' + first_key_keycodename + '+' + second_key_keycodename + '+' + toggle_autocheck_key + ' = Autocheck ON/OFF' + '<br/>' + first_key_keycodename + '+' + second_key_keycodename + '+' +  toggle_Enable_Anonymizer_key + ' = Anonymizer ON/OFF' + '</div>\
					</fieldset>\
					<fieldset>\
					<p><input type="checkbox" id="Color_DL_links"> Color DL links</p>\
					<div id="sites"><label for="inputColorLive">Live links color</label><input type="text" id="inputColorLive" style="background:' + Live_links_color + ';" value="' + Live_links_color + '"></div>\
					<div id="sites"><label for="inputColorDead">Dead links color</label><input type="text" id="inputColorDead" style="background:' + Dead_links_color + ';" value="' + Dead_links_color + '"></div><br>\
					<div id="sites"><label for="inputColorTemp">Temp. unavailable links color</label><input type="text" id="inputColorTemp" style="background:' + Temp_unavailable_links_color + ';" value="' + Temp_unavailable_links_color + '"></div>\
					<div id="sites"><label for="inputColorCont">Container links color</label><input type="text" id="inputColorCont" style="background:' + Container_links_color + ';" value="' + Container_links_color + '"></div><br>\
					<div id="sites"><label for="inputColorprem">Premium links color</label><input type="text" id="inputColorprem" style="background:' + Premium_links_color + ';" value="' + Premium_links_color + '"></div>\
					<div id="configinfo">For no color leave a field blank.<br>Standard HTML color names are supported. See <a href="https://www.w3schools.com/colors/colors_names.asp">w3schools.com</a> for more info.</div><br>\
					<p><input type="checkbox" id="Show_line_through_in_dead_links"> Show line through in dead links</p>\
					<p><input type="checkbox" id="Show_black_background_in_DL_links"> Show black background in DL links</p>\
					<p><input type="checkbox" id="Do_not_linkify_DL_links"> Do NOT linkify DL links</p>\
					<p><input type="checkbox" id="Allow_spaces_in_DL_links"> Allow spaces in DL links<br><div id="configinfo">Note: All links must end with a new line!</div></p>\
					<p><input type="checkbox" id="Display_full_links_in_link_containers"> Display full links in link containers</p><br>\
					<fieldset>\
					<p><input type="radio" name="warlciconset" value="0"> No icons</p>\
					<p><input type="radio" name="warlciconset" value="1"> <img src=" ' + PAW_ICON_GREEN + '"> <img src=" ' + PAW_ICON_RED + '"> <img src=" ' + PAW_ICON_YELLOW + '"> <img src=" ' + PAW_ICON_PINK + '"></p>\
					<p><input type="radio" name="warlciconset" value="2"> <img src=" ' + RSLC_ICON_GREEN + '"> <img src=" ' + RSLC_ICON_RED + '"> <img src=" ' + RSLC_ICON_YELLOW + '"> <img src=" ' + RSLC_ICON_PINK + '"></p>\
					<p><input type="radio" name="warlciconset" value="3"> <img src=" ' + NEW_ICON_GREEN + '"> <img src=" ' + NEW_ICON_RED + '"> <img src=" ' + NEW_ICON_YELLOW + '"> <img src=" ' + NEW_ICON_PINK + '"></p>\
					</fieldset>\
					</fieldset>\
					<fieldset>\
					<div id="sites"><input type="checkbox" id="Autocheck"> Autocheck</div><br><div id="configinfo">Script starts check automatically.</div><br>\
					</fieldset>\
					<fieldset>\
					<div id="sites"><input type="checkbox" id="Show_progress_stats"> Show progress stats</div><br>\
					</fieldset>\
					<fieldset>\
					<div id="sites"><input type="checkbox" id="Display_tooltip_info"> Display tooltip info</div><div id="bulk"></div><br><div id="configinfo">Note: File name, file size, error messages etc. (does not work on all links)</div><br>\
					</fieldset>\
					<fieldset>\
					<div id="sites"><label for="refAnonymizer">Refererer anonymizing service</label><input type="text" id="refAnonymizer" value="' + Ref_anonymize_service + '"></div><br><div id="configinfo">Note: Example: https://anonym.es/? , https://href.li/? , https://anoniem.org/? , https://dereferer.me/? , http://anonymto.com/? , CTRL+ALT+Z toggles the anonymizer service on or off</div><br>\
					</fieldset>\
					<fieldset>\
							<legend>Progress box settings</legend>\
							<p>Horizontal positioning of the progressbox: <input type="text" id="Processbox_Pos_X"><br><div id="configinfo">Note: Define this value in percentages starting from the left of the screen.</div></p>\
							<p>Vertical positioning of the progressbox: <input type="text" id="Processbox_Pos_Y"><br><div id="configinfo">Note: Define this value in percentages starting from the bottom of the screen.</div></p>\
							<p>Scaling of the progressbox: <input type="text" id="Progressbox_Scaling"><br><div id="configinfo">Resizes the progressbox. Define this value in percentages. 100% = full size, 200% = double size, 0% = Off</div></p>\
					</fieldset>\
					</div>\
				</div>\
				<div id="tabs-4" class="warlc-ui-tab">\
          <legend><b>W.A.R. Links Checker Premium v' + War_version + '</legend></b>\
        <br />\
					<p><b>Author:</b> <a href="http://usa.x10host.com/mybb/index.php">mental</a></p>\
          <p><b>Contributors:</b> Bruk, Yurii, Love Buzz, Patatra, Fiju, fonzie, tgs, Bzh4ever\
          <p><b>Script Homepage:</b> <a href="http://usa.x10host.com/mybb/">User Scripts Archive</a></p>\
					<br />\
					<p><b>Currently supported:</b><br>\
					Filehostings: ' + allHostNames.length + '<br />\
					Containers: ' + allContainerNames.length + '<br />\
					Obsolete sites: ' + allObsoleteNames.length + '<br /></p>\
					<br />\
					<p><b>Based on:</b><br>\
					<a href="http://userscripts-mirror.org/scripts/show/125631.html">W.A.R. Links Checker - Dev</a></p>\
					<br />\
					<p><b>Uses:</b></p>\
					<p>adam_3\'s <a href="http://userscripts-mirror.org/scripts/show/2254">Linkify ting</a> (modified)</p>\
					<p><a href="http://jquery.com/">jQuery</a> JavaScript Library</p>\
					<br />\
					<p>License: GPL version 3 or any later version (<a href="http://www.gnu.org/copyleft/gpl.html">http://www.gnu.org/copyleft/gpl.html</a>)</p>\
				</div>\
			</div>\
		</div>\
		</div>';

		$('body').append('<div id="hideshow">' + configurationinnerHTML + '</div>');

		$("#warlc-conf-tabs").tabs({ fx: { opacity: 'toggle', duration: 'fast' } });

		$("#imghideshow").click(function(event){$("#hideshow").hide(); event.preventDefault();});

		var elmHostList = document.getElementById("warlcsitelist1");
		var elmContainerList = document.getElementById("warlcsitelist2");

		buildSettings();
		buildSitelist("", allHostNames, elmHostList);
		buildSitelist("", allContainerNames, elmContainerList);

		if (DEBUG_MODE)
		{
			//log all sites availability status
			diagSites();
		}

		//handler for checkbox state change
		function changeConfiguration(e)
		{
			var element = e.target;

			if (element.type == 'checkbox')
			{
				if (element.checked == 1)
				{
					GM_setValue(element.id, true);
				}
				else
				{
					GM_setValue(element.id, false);
				}

			}
			setVariables();
		}

		//Selects all filehosting checkboxes
		function selectAll()
		{
			$(":checkbox:visible:not(:checked)").prop("checked",true)
						 .each(function(index, element){GM_setValue(this.id, true)});
		}

		//Deselects all filehosting checkboxes
		function selectNone()
		{
			$(":checkbox:visible:checked").prop("checked",false)
						 .each(function(index, element){GM_setValue(this.id, false)});
		}
				//Sets Processbox position setting
		function changeProgBox(event) {
			var setting;
			switch(event.data.set) {
				case "X": setting = "Processbox_Pos_X"; break;
				case "Y": setting = "Processbox_Pos_Y"; break;
				case "Scale": setting = "Progressbox_Scaling"; break;
			}

			var $setting = $("#" + setting);
			var newSet = $setting.val().replace("%", "");
			GM_setValue(setting, newSet);
		}
		//Sets value of Processbox position
		$("#Processbox_Pos_X").val(Processbox_Pos_X + "%");
		$("#Processbox_Pos_Y").val(Processbox_Pos_Y + "%");
		$("#Progressbox_Scaling").val(Progressbox_Scaling + "%");

		//Inverts filehosting checkboxes selection
		function selectInvert()
		{
			var $checked = $(":checkbox:visible:checked");
			var $unchecked = $(":checkbox:visible:not(:checked)");

			$unchecked.prop("checked",true)
						 .each(function(index, element){GM_setValue(this.id, true)});
			$checked.prop("checked",false)
						 .each(function(index, element){GM_setValue(this.id, false)});
		}

		//toggles anonymizer on off
		function Enable_Anonymizer()
		{
			var $checked = $(":checkbox:visible:checked");
			var $unchecked = $(":checkbox:visible:not(:checked)");

			$unchecked.prop("checked",true)
						 .each(function(index, element){GM_setValue(this.id, true)});
			$checked.prop("checked",false)
						 .each(function(index, element){GM_setValue(this.id, false)});

		}

		function changeRefAnonymizer(){
			GM_setValue("Ref_anonymize_service", $("#refAnonymizer").attr("value"));
		}


		//Sets live links color
		function changeColorLive()
		{
			var inColorLive = document.getElementById("inputColorLive");
			inColorLive.style.background = inColorLive.value;
			GM_setValue("Live_links_color", inColorLive.value);
		}

		//Sets dead links color
		function changeColorDead()
		{
			var inColorDead = document.getElementById("inputColorDead");
			inColorDead.style.background = inColorDead.value;
			GM_setValue("Dead_links_color", inColorDead.value);
		}

		//Sets temp. unavailable links color
		function changeColorTemp()
		{
			var inColorTemp = document.getElementById("inputColorTemp");
			inColorTemp.style.background = inColorTemp.value;
			GM_setValue("Temp_unavailable_links_color", inColorTemp.value);
		}

		//Sets temp. unavailable links color
		function changeColorCont()
		{
			var inColorCont = document.getElementById("inputColorCont");
			inColorCont.style.background = inColorCont.value;
			GM_setValue("Container_links_color", inColorCont.value);
		}

		//Sets premium. links color
		function changeColorprem()
		{
			var inColorprem = document.getElementById("inputColorprem");
			inColorprem.style.background = inColorprem.value;
			GM_setValue("Premium_links_color", inColorprem.value);
		}

		//Diagnose sites for availability
		function diagSites()
		{
			var boxes = document.getElementById("warlcsitelist1").getElementsByTagName("input");

			for (var i = 0, n = boxes.length - 1; i < n; i++)
			{
				if (boxes[i].type == "checkbox")
				{
					checkAvailability(boxes[i]);
				}
			}

			boxes = document.getElementById("warlcsitelist2").getElementsByTagName("input");

			for (var i = 0, n = boxes.length - 1; i < n; i++)
			{
				if (boxes[i].type == "checkbox")
				{
					checkAvailability(boxes[i]);
				}
			}

			function checkAvailability(cbElm)
			{
				var cb = cbElm;

				GM_xmlhttpRequest(
				{
					method: 'HEAD',
					url: 'http://' + cb.nextSibling.textContent.replace(' ', ''),
					headers: {
						'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
						'Accept': 'text/xml',
						'Referer': ""
					},
					onload: function (result)
					{
						if (result.status != 200)
						{
							GM_log(cb.nextSibling.textContent + ' --- status: [' + result.status + '] ' + result.statusText + ', final url: ' + result.finalUrl);
						}
					},
					onerror: function (result)
					{
						if (result.status != 200)
						{
							GM_log(cb.nextSibling.textContent + ' --- status: [' + result.status + '] ' + result.statusText + ', final url: ' + result.finalUrl);

							        //Sets Progress_box position setting
        function changeProgBox(event) {
            var setting;
            switch(event.data.set) {
                case "X": setting = "Progress_box_Pos_X"; break;
                case "Y": setting = "Progress_box_Pos_Y"; break;
                case "Scale": setting = "Progress_box_Scaling"; break;
            }

            var $setting = $("#" + setting);
            var newSet = $setting.val().replace("%", "");
            lsSetVal("general", setting, newSet);
        }

        //Sets value of Progress_box position
        $("#Progress_box_Pos_X").val(Progress_box_Pos_X + "%");
        $("#Progress_box_Pos_Y").val(Progress_box_Pos_Y + "%");
        $("#Progress_box_Scaling").val(Progress_box_Scaling + "%");
						}
					}
				});
			}
		}

		function buildSettings()
		{
			$(".warlcsettings :checkbox").each(function(){
				$(this).prop("checked", GM_getValue($(this).attr("id")))
					.click(function(e){
						GM_setValue($(this).attr("id"), $(this).prop("checked"));
						setVariables();
					});
			})
		}

		//Dynamic build of host list
		//param search 		[string]	searches for hostnames matching search substring
		//param siteNames 	[array]		array of site names
		//param targetNode 	[DOM Node]	where the list should be built
		//								first child node is replaced
		function buildSitelist(search, siteNames, targetNode)
		{
			var searchRegex = new RegExp("\\|?([\\w\\.-]*" + search.replace(/\./g,"\\.").replace(/-/g, "\\-") + "[\\w\\.-]*)\\|?", "i");

			var $targetNode = $(targetNode).empty();

			var searchedSite = "";
			$.each(siteNames, function(i, site){
				if (searchedSite = site.match(searchRegex))
				{
					var baseSite = site.replace(/\|.+/, ""); //filehosting main domain

					//ensuring backward compatibility with the rest of code, to be refactored later
					var oldRSLCvalue = "Check_" + baseSite.replace(/\|.+/, "").replace(/\./g,"_dot_").replace(/-/g, "_dash_") + "_links";
					//

					$targetNode.append('<input type="checkbox" id="' + oldRSLCvalue +'" />\
						<label for="' + oldRSLCvalue + '">' + searchedSite[1] + '</label>' +
						((searchedSite[1] != baseSite) ? ('<div id="note"> ( ~ ' + baseSite + ' )</div>') : (""))
						);

					$("#" + oldRSLCvalue).prop("checked", GM_getValue(oldRSLCvalue, false))
										.change(changeConfiguration);

					$targetNode.append('<br />');
				}
			});

			$targetNode.append("<hr>");

			//obsolete hosts checkbox
			$targetNode.append('<input type="checkbox" id="Obsolete_file_hosts" /><label for="Obsolete_file_hosts">Obsolete file hosts</label>');
			$("#Obsolete_file_hosts").prop("checked", GM_getValue("Obsolete_file_hosts", false))
									.change(changeConfiguration);

			$targetNode.append('<br />');

			var foundName = "";
			$.each(allObsoleteNames, function(i, site){
				if (foundName = allObsoleteNames[i].match(searchRegex))
				{
					$targetNode.append('<div id="note">' + foundName[1] + '</div>');
				}
			})

		}

		var hostSearchBox = document.getElementById("hostSearchBox");
		hostSearchBox.addEventListener('keyup', function(){buildSitelist(hostSearchBox.value, allHostNames, elmHostList);}, false);

		var hostSearchBox2 = document.getElementById("hostSearchBox2");
		hostSearchBox2.addEventListener('keyup', function(){buildSitelist(hostSearchBox2.value, allContainerNames, elmContainerList);}, false);

		$(".warlc-ui-select-all").click(selectAll).button();
		$(".warlc-ui-select-none").click(selectNone).button();
		$(".warlc-ui-select-invert").click(selectInvert).button();

		$(".warlc-ui-buttonset").buttonset();

		var inColorLive = document.getElementById("inputColorLive");
		inColorLive.addEventListener('keyup', changeColorLive, false);

		var inColorDead = document.getElementById("inputColorDead");
		inColorDead.addEventListener('keyup', changeColorDead, false);

		var inColorTemp = document.getElementById("inputColorTemp");
		inColorTemp.addEventListener('keyup', changeColorTemp, false);

		var inColorCont = document.getElementById("inputColorCont");
		inColorCont.addEventListener('keyup', changeColorCont, false);

		var inColorprem = document.getElementById("inputColorprem");
		inColorprem.addEventListener('keyup', changeColorprem, false);

		$("#refAnonymizer").change(changeRefAnonymizer);
		//buttons and edit boxes init end

		//icon sets radio buttons
		var radioButtons = document.getElementsByName("warlciconset");
		radioButtons[Icon_set].checked = "checked";

		radioButtons[0].addEventListener("change", updateIconSet);
		radioButtons[1].addEventListener("change", updateIconSet);
		radioButtons[2].addEventListener("change", updateIconSet);
		radioButtons[3].addEventListener("change", updateIconSet);

		function updateIconSet()
		{
			GM_setValue("Icon_set", this.value * 1);

			  $("#Progress_box_Pos_X").change({ set: "X" }, changeProgBox);
        $("#Progress_box_Pos_Y").change({ set: "Y" }, changeProgBox);
        $("#Progress_box_Scaling").change({ set: "Scale" }, changeProgBox);
			}

		$('#showCustomRulesReference').click(function(e){
			e.preventDefault();
			$('#customRulesReference').toggle();
			});

		$('#Custom_rules_text')
			.val(Custom_rules_text)
			.change(saveCustomRules);

		function saveCustomRules(e)
		{
			var cr = parseCustomRules(this.value);
			if (cr.info.length)
				alert('Custom rules saved. However, there were ' + cr.error + ' errors, ' + cr.warning + ' warnings, ' + cr.note + ' notes found.\n' + cr.rules.length + ' valid rules found.\n\n' + JSON.stringify(cr.info, null, '  '));
			GM_setValue('Custom_rules_text', this.value);
			GM_setValue('last_custom_rules_nag', ''+new Date().getTime()); //reset nag
		}
		$("#Processbox_Pos_X").change({ set: "X" }, changeProgBox);
		$("#Processbox_Pos_Y").change({ set: "Y" }, changeProgBox);
		$("#Progressbox_Scaling").change({ set: "Scale" }, changeProgBox);

	}

//begin standard link checking algorithm
function start(filterId)
{
	var doNotLinkify = Do_not_linkify_DL_links;

	// USER SELECTED FILE HOSTS INITIALIZATION START
	var http_file_hosts = new Array(); //standard hostings
	var http_file_hosts_coded = new Array(); //hostings which has to be decoded to obtain real checkable link
	var http_file_hosts_obsolete = new Array(); //dead hostings
	var http_file_hosts_headers_only = new Array(); //hostings with direct download, must be handled via headers only

	initFileHosts();
	initFileHostsHeadersOnly();
	initFileHostsCustom(); //CustomRules
	// USER SELECTED FILE HOSTS INITIALIZATION END

	// LINKIFICATION START
	var totalxpath = '';
	var totalxpathcoded = '';
	var totalxpathobsolete = '';
	var totalxpathheadersonly = '';
	var totalourls = '';

	var filehostLen = http_file_hosts.length;
	var filehostCodedLen = http_file_hosts_coded.length;
	var filehostObsoleteLen = http_file_hosts_obsolete.length;
	var filehostHeadersOnlyLen = http_file_hosts_headers_only.length;

	var filehostIdx = filehostLen;
	var filehostCodedIdx = filehostCodedLen;
	var filehostObsoleteIdx = filehostObsoleteLen;
	var filehostHeadersOnlyIdx = filehostHeadersOnlyLen;

	if ((filehostIdx == 0) && (filehostCodedIdx == 0) && (filehostHeadersOnlyIdx == 0) && (filehostObsoleteIdx == 0))
		return;

	while (filehostIdx--)
	{
		totalourls += http_file_hosts[filehostIdx][0] + '|';
		totalxpath += http_file_hosts[filehostIdx][4] + '|';
	}

	while (filehostCodedIdx--)
	{
		totalourls += http_file_hosts_coded[filehostCodedIdx][0] + '|';
		totalxpathcoded += http_file_hosts_coded[filehostCodedIdx][3] + '|';
	}

	while (filehostObsoleteIdx--)
	{
		totalourls += http_file_hosts_obsolete[filehostObsoleteIdx][0] + '|';
		totalxpathobsolete += http_file_hosts_obsolete[filehostObsoleteIdx][1] + '|';
	}

	while (filehostHeadersOnlyIdx--)
	{
		totalourls += http_file_hosts_headers_only[filehostHeadersOnlyIdx][0] + '|';
		totalxpathheadersonly += http_file_hosts_headers_only[filehostHeadersOnlyIdx][3] + '|';
	}

	totalourls = totalourls.replace(/\|$/g, "");

	//TODO: further refactoring needed

	totalxpath = totalxpath.replace(/\]\|\/\/a\[/g, " or ");
	totalxpath = totalxpath.replace(/\]\|/, ')]');
	totalxpathcoded = totalxpathcoded.replace(/\]\|\/\/a\[/g, " or ");
	totalxpathcoded = totalxpathcoded.replace(/\]\|/, ')]');
	totalxpathobsolete = totalxpathobsolete.replace(/\]\|\/\/a\[/g, " or ");
	totalxpathobsolete = totalxpathobsolete.replace(/\]\|/, ')]');
	totalxpathheadersonly = totalxpathheadersonly.replace(/\]\|\/\/a\[/g, " or ");
	totalxpathheadersonly = totalxpathheadersonly.replace(/\]\|/, ')]');

	if (filterId != null) //insert id restriction in the xpath
	{
		totalxpath = totalxpath.replace(/\[/g, "[@class='" + filterId + "' and (");
		totalxpathcoded = totalxpathcoded.replace(/\[/g, "[@class='" + filterId + "' and (");
		totalxpathobsolete = totalxpathobsolete.replace(/\[/g, "[@class='" + filterId + "' and (");
		totalxpathheadersonly = totalxpathheadersonly.replace(/\[/g, "[@class='" + filterId + "' and (");
	}
	else
	{
		totalxpath = totalxpath.replace(/\[/, "[((not(@class)) or (@class!='alive_link' and @class!='adead_link' and @class!='unava_link')) and (");
		totalxpathcoded = totalxpathcoded.replace(/\[/, "[((not(@class)) or (@class!='alive_link' and @class!='adead_link' and @class!='unava_link')) and (");
		totalxpathobsolete = totalxpathobsolete.replace(/\[/, "[((not(@class)) or (@class!='alive_link' and @class!='adead_link' and @class!='unava_link')) and (");
		totalxpathheadersonly = totalxpathheadersonly.replace(/\[/, "[((not(@class)) or (@class!='alive_link' and @class!='adead_link' and @class!='unava_link')) and (");
	}

	linkify(totalourls);
	//LINKIFICATION END

	//ENCRYPTED LINKS PROCESSING START
	if (http_file_hosts_coded.length > 0)
	{
		var linksCoded = document.evaluate(totalxpathcoded, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

		// decrypt coded links (redirects, link protectors etc.)
		if (linksCoded.snapshotLength > 0)
		{
			var link;
			var reallinkreg;
			var reallinkcorrection;

			if (filterId == null)
			{
				cLinksTotal += linksCoded.snapshotLength;
			}

			var y = linksCoded.snapshotLength - 1;
			do
			{
				// linksCoded.snapshotItem(y).id = 'processing_link';
				link = linksCoded.snapshotItem(y);

				filehostIdx = filehostCodedLen;
				while (filehostIdx--)
				{
					if (link.href.match(http_file_hosts_coded[filehostIdx][0]))
					{
						link.href = link.href.replace(/http:\/\/.*?(?:\?|=)http:\/\//, 'http://');
						reallinkreg = http_file_hosts_coded[filehostIdx][1];
						reallinkcorrection = http_file_hosts_coded[filehostIdx][2];

						decurl(link, reallinkreg, reallinkcorrection);
						break;
					}
				}
			}
			while (y--);
		}
	}
	//ENCRYPTED LINKS PROCESSING END

	//STANDARD LINKCHECKING START
	if (http_file_hosts.length > 0)
	{
		var lianks = document.evaluate(totalxpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

		if (filterId == null)
		{
			cLinksTotal += lianks.snapshotLength;
		}

		if (lianks.snapshotLength > 0)
		{
			var link;

			var URL = "";
			var name = "";
			var isAliveRegex = "";
			var isDeadRegex = "";
			var isUnavaRegex = "";
			var ispremRegex = "";
			var tryLoop = false;

			var y = lianks.snapshotLength;

			while (y--)
			{
				link = lianks.snapshotItem(y);
								while (link.href.indexOf('anonym.es/?')>-1)
				{
					link.href=link.href.substring(link.href.indexOf('anonym.es/?')+11);
				}
				while (link.href.indexOf('anonym.es?')>-1)
				{
					link.href=link.href.substring(link.href.indexOf('anonym.es?')+10);
				}

				filehostIdx = filehostLen;
				while (filehostIdx--)
				{
					if (link.href.match(http_file_hosts[filehostIdx][0]))
					{
						link.href = link.href.replace(/http:\/\/.*?http:\/\//, 'http://'); //anonymizers
						isAliveRegex = http_file_hosts[filehostIdx][1];
						isDeadRegex = http_file_hosts[filehostIdx][2];
						isUnavaRegex = http_file_hosts[filehostIdx][3];
						ispremRegex = http_file_hosts[filehostIdx][6];
						tryLoop = http_file_hosts[filehostIdx][5];

						geturl(link, isAliveRegex, isDeadRegex, isUnavaRegex, ispremRegex, tryLoop);

						break;
					}
				}
			}
		}
	}
	//STANDARD LINKCHECKING END

	//OBSOLETE FILE HOSTS PROCESSING START
	if (filehostObsoleteLen > 0)
	{
		var obsoletelinks = document.evaluate(totalxpathobsolete, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

		var obsoleteLink;

		//check links
		if (obsoletelinks.snapshotLength > 0)
		{
			var y = obsoletelinks.snapshotLength;

			if (filterId == null)
			{
				cLinksTotal += y;
			}

			while (y--)
			{
				obsoleteLink = obsoletelinks.snapshotItem(y);

				if (Display_tooltip_info)
				{
					obsoleteLink.warlc_error = 'Cause of error: <b>Obsolete filehosting.</b>';
				}

				displayTheCheckedLink(obsoleteLink, 'adead_link');
			}
		}
	}
	//OBSOLETE FILE HOSTS PROCESSING END

	//DIRECT LINKCHECKING START
	if (http_file_hosts_headers_only.length > 0)
	{
		var links = document.evaluate(totalxpathheadersonly, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

		//check links
		if (links.snapshotLength > 0)
		{
			var link;
			var isAliveRegex;
			var isDeadRegex;
			var ispremRegex;

			var y = links.snapshotLength;


			if (filterId == null)
			{
				cLinksTotal += y;
			}

			while (y--)
			{
				// links.snapshotItem(y).id = 'processing_link';
				link = links.snapshotItem(y);

				filehostIdx = filehostHeadersOnlyLen;
				while (filehostIdx--)
				{
					if (link.href.match(http_file_hosts_headers_only[filehostIdx][0]))
					{
						link.href = link.href.replace(/http:\/\/.*?(?:\?|=)http:\/\//, 'http://');
						isAliveRegex = http_file_hosts_headers_only[filehostIdx][1];
						isDeadRegex = http_file_hosts_headers_only[filehostIdx][2];
						ispremRegex = http_file_hosts_headers_only[filehostIdx][3];

						geturlHeader(link, isAliveRegex, isDeadRegex, ispremRegex);

						break;
					}
				}
			}

		}
	}
	//DIRECT LINKCHECKING END


	//finds the real url on the page, replaces link.href with it and calls geturl
	function decurl(link, reallinkreg, reallinkcorrection)
	{

		GM_xmlhttpRequest(
		{
			method: 'GET',
			url: link.href,
			headers: {
				'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
				'Accept': 'text/xml',
				'Referer': ""
			},
			onload: function (result)
			{
				// cLinksProcessed++;

				var reallink = result.responseText.match(reallinkreg)[0];
				reallink = reallink.replace(new RegExp(reallinkcorrection, "g"), "");

				link.href = reallink;

				var i = http_file_hosts.length - 1;
				do
				{
					if ((reallink.match(http_file_hosts[i][0])))
					{
						link.href = link.href.replace(/http:\/\/.*?\?http:\/\//, 'http://');
						var isAliveRegex = http_file_hosts[i][1];
						var isDeadRegex = http_file_hosts[i][2];
						var isUnavaRegex = http_file_hosts[i][3];
						var ispremRegex = http_file_hosts[i][4];

						geturl(link, isAliveRegex, isDeadRegex, isUnavaRegex, ispremRegex, 50);

						break;
					}
				}
				while (i--);
				}
		});
	}

	function randUA()
	{
		//TODO
	}

	//Processes link
	//
	// [string]		link			link URL
	// [string] 	isAliveRegex	alive link regex
	// [string] 	isDeadRegex		dead link regex
	// [string] 	isUnavaRegex	unavailable link regex
	// [string] 	ispremRegex	    premium link regex
	// [boolean]	tryLoop			repeats request until succeeded
	function geturl(link, isAliveRegex, isDeadRegex, isUnavaRegex, ispremRegex, tryLoop)
	{
        if (link.href.indexOf('aye-files.com')>-1)
        {
            link.href='https://'+link.href.match('(aye-files\.com\/\\w+)')[0];
        }
		GM_xmlhttpRequest(
		{
			method: 'GET',
			url: link.href,
			headers: {
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				'Accept-Charset': 'windows-1250,utf-8;q=0.7,*;q=0.7',
				'Referer': ""
			},
			onload: function (result)
			{
				var res = result.responseText;

				if (result.responseHeaders.match(/Content-Disposition: attachment; filename=/))//direct download, simple version
				{
					displayTheCheckedLink(link, 'alive_link');
					return;
				}

				if (res.match(isAliveRegex))
				{
					displayTheCheckedLink(link, 'alive_link');
					return;
				}

				if (res.match(isDeadRegex))
				{
					displayTheCheckedLink(link, 'adead_link');
					return;
				}

				if (isUnavaRegex && res.match(isUnavaRegex))
				{
					displayTheCheckedLink(link, 'unava_link');
					return;
				}

				if (res.match(ispremRegex))
				{
					displayTheCheckedLink(link, 'prem_link');
					return;
				}

				var resStatus = result.status;

				if (resStatus == 404)
				{
					displayTheCheckedLink(link, 'adead_link');
				}

				if (resStatus == 500 || resStatus == 503 || resStatus == 403) //not found/available/temp. unava
				{
					if (tryLoop)
					{
						//wait 1-5 seconds and repeat the request
						setTimeout(function(){geturl(link, isAliveRegex, isDeadRegex, isUnavaRegex, ispremRegex, tryLoop)}, 1000 + (Math.random() * 4000));
					}
					else
					{
						displayTheCheckedLink(link, 'unava_link');
					}

					return;
				}
			},
			onerror: function ()
			{
				displayTheCheckedLink(link, 'unava_link');
			}
		});
	}

	function geturlHeader(link, isAliveRegex, isDeadRegex, ispremRegex)
	{
		GM_xmlhttpRequest(
		{
			method: 'HEAD',
			url: link.href,
			headers: {
				'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
				'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
				'Accept-Charset': 'windows-1250,utf-8;q=0.7,*;q=0.7',
				'Referer': ""
			},
			onload: function (result)
			{
				var resStatus = result.status;
				var resHeaders = "";

				if (resStatus == 403 || resStatus == 404 || resStatus == 500) //not found/available
				{
					displayTheCheckedLink(link, 'adead_link');
					return;
				}

				resHeaders = result.responseHeaders;

				if (resHeaders.match(isDeadRegex))
				{
					displayTheCheckedLink(link, 'adead_link');
					return;
				}

				if (resHeaders.match(isAliveRegex))
				{
					displayTheCheckedLink(link, 'alive_link');
					return;
				}

				if (resHeaders.match(ispremRegex))
				{
					displayTheCheckedLink(link, 'prem_link');
					return;
				}
			},
			onerror: function ()
			{
				displayTheCheckedLink(link, 'unava_link');
			}
		});
	}

	//Delinkfifies the <a> element object
	function delinkifyLink(link)
	{
		var spanElm = document.createElement("span");
		spanElm.className = link.className;
		spanElm.innerHTML = link.innerHTML;

		if (Display_tooltip_info)
		{
			spanElm.href = link.href;
			spanElm.warlc_error = link.warlc_error;

			switch (link.className){
			case "alive_link": spanElm.addEventListener("mouseover", displayTooltipInfo, false); break
			case "adead_link": spanElm.addEventListener("mouseover", displayTooltipError, false); break;
			case "unava_link": //reserved
			case "prem_link": spanElm.addEventListener("mouseover", displayTooltipError, false); break;
			default:
			}
		}

		link.parentNode.replaceChild(spanElm, link);
	}

	//Assigns result status to the <a> element object and calls delinkifying eventually
	//Possible result states: adead_link, alive_link, unava_link, prem_link
	function displayTheCheckedLink(link, resultStatus)
	{
		link.className = resultStatus;
		link.href = Ref_anonymize_service + link.href;

		if (Display_tooltip_info)
		{
			switch (resultStatus){
			case "alive_link": link.addEventListener("mouseover", displayTooltipInfo, false); break
			case "adead_link": link.addEventListener("mouseover", displayTooltipError, false); break;
			case "unava_link": //reserved
			case "prem_link": link.addEventListener("mouseover", displayTooltipInfo, false); break
			default:
			}
		}

		if (doNotLinkify)
		{
			delinkifyLink(link);
		}

		cLinksProcessed++;

		if (resultStatus == "alive_link")
		{
			cLinksAlive++;
			return;
		}

		if (resultStatus == "adead_link")
		{
			cLinksDead++;
			return;
		}

		if (resultStatus == "unava_link")
		{
			cLinksUnava++;
		}

		if (resultStatus == "prem_link")
		{
			cLinksprem++;
			return;
		}
	}


	function initFileHosts()
	{

		function addObsoleteHost(linkRegex, xpathEx)
		{
			var host = new Array(2);
			host[0] = linkRegex;
			host[1] = xpathEx;
			http_file_hosts_obsolete.push(host);
		}

		//obsolete file hosts init start
		if (Obsolete_file_hosts)
		{
			addObsoleteHost("uloz\.cz\/show\/file","//a[contains(@href,'uloz.cz')]");
			addObsoleteHost("storage\\.to\/get","//a[contains(@href,'storage.to')]");
			addObsoleteHost("iskladka\\.cz\/download","//a[contains(@href,'iskladka.cz')]");
			addObsoleteHost("file-rack\\.com\/files","//a[contains(@href,'file-rack.com')]");
			addObsoleteHost("fast-load\\.net\/(\/)?index","//a[contains(@href,'fast-load.net')]");
			addObsoleteHost("subory\\.sk\/download","//a[contains(@href,'subory.sk')]");
			addObsoleteHost("bigandfree\\.com\/\\d+","//a[contains(@href,'bigandfree.com')]");
			addObsoleteHost("fileop\\.com\/\\w+","//a[contains(@href,'fileop.com')]");
			addObsoleteHost("mujsoubor\\.cz\/file\/","//a[contains(@href,'mujsoubor.cz')]");
			addObsoleteHost("sendfile\\.to\/\\w+","//a[contains(@href,'sendfile.to')]");
			addObsoleteHost("superfastfile\\.com\/\\w+","//a[contains(@href,'superfastfile.com')]");
			addObsoleteHost("quickyshare\\.com\/\\w+","//a[contains(@href,'quickyshare.com/')]");
			addObsoleteHost("duckload\\.com\/(?:d|play)","//a[contains(@href,'duckload.com')]");
			addObsoleteHost("uploadstore\\.net\/\\w+","//a[contains(@href,'uploadstore.net')]");
			addObsoleteHost("meinupload\\.com\/dl\/\\d+","//a[contains(@href,'meinupload.com/dl')]");
			addObsoleteHost("dualshare\\.com\/\\w+","//a[contains(@href,'dualshare.com')]");
			addObsoleteHost("2xupload\\.(?:to|de)\/file\/\\w+","//a[contains(@href,'2xupload.to') or contains(@href,'2xupload.de')]");
			addObsoleteHost("oxedion\\.com\/index\\.php\/download\/\\w+","//a[contains(@href,'oxedion.com/index')]");
			addObsoleteHost("uploadline\\.com\/\\d+","//a[contains(@href,'uploadline.com')]");
			addObsoleteHost("dll\\.bz\/file\/\\d+","//a[contains(@href,'dll.bz/file')]");
			addObsoleteHost("movieshare\\.in\/\\w+","//a[contains(@href,'movieshare.in')]");
			addObsoleteHost("milledrive\\.com\/files\/\\d+","//a[contains(@href,'milledrive.com')]");
			addObsoleteHost("quickupload\\.net\/\\w+","//a[contains(@href,'quickupload.net')]");
			addObsoleteHost("safelink\\.in\/\\w+","//a[contains(@href,'safelink.in')]");
			addObsoleteHost("pyramidfiles\\.com\/\\w+","//a[contains(@href,'pyramidfiles.com/')]");
			addObsoleteHost("(?:cloudnator|shragle)\\.com\/files","//a[contains(@href,'cloudnator.com/files') or contains(@href,'shragle.com/files')]");
			addObsoleteHost("batshare\\.com\/\\w+","//a[contains(@href,'batshare.com/')]");
			addObsoleteHost("bitroad\\.net\/download","//a[contains(@href,'bitroad.net/download')]");
			addObsoleteHost("metadivx\\.com\/\\w+","//a[contains(@href,'metadivx.com')]");
			addObsoleteHost("filegaze\\.com\/\\w+","//a[contains(@href,'filegaze.com/')]");
			addObsoleteHost("bulletupload\\.com\/\\w+","//a[contains(@href,'bulletupload.com/')]");
			addObsoleteHost("sharefilehost\\.com\/\\w+","//a[contains(@href,'sharefilehost.com/')]");
			addObsoleteHost("fireuploads\\.net\/\\w+","//a[contains(@href,'fireuploads.net/')]");
			addObsoleteHost("divxlink\\.com\/\\w+","//a[contains(@href,'divxlink.com/')]");
			addObsoleteHost("bzlink\\.us\/\\w+","//a[contains(@href,'bzlink.us/')]");
			addObsoleteHost("filetechnology\\.com\/\\w+","//a[contains(@href,'filetechnology.com/')]");
			addObsoleteHost("filecosy\\.com\/\\w+","//a[contains(@href,'filecosy.com/')]");
			addObsoleteHost("fileserver\\.cc\/\\w+","//a[contains(@href,'fileserver.cc/')]");
			addObsoleteHost("shafiles\\.me\/\\w+","//a[contains(@href,'shafiles.me/')]");
			addObsoleteHost("xfileshare\\.eu\/\\w+","//a[contains(@href,'xfileshare.eu/')]");
			addObsoleteHost("uploadboost\\.com\/\\w+","//a[contains(@href,'uploadboost.com/')]");
			addObsoleteHost("uploadoz\\.com\/\\w+","//a[contains(@href,'uploadoz.com/')]");
			addObsoleteHost("ihostia\\.com\/\\w+","//a[contains(@href,'ihostia.com/')]");
			addObsoleteHost("shareupload\\.com\/\\w+","//a[contains(@href,'shareupload.com/')]");
			addObsoleteHost("ovfile\\.com\/\\w+","//a[contains(@href,'ovfile.com/')]");
			addObsoleteHost("stahuj\\.to\/\\w+","//a[contains(@href,'stahuj.to/')]");
			addObsoleteHost("gigfiles\\.net\/\\w+","//a[contains(@href,'gigfiles.net/')]");
			addObsoleteHost("vidhog\\.com\/\\w+","//a[contains(@href,'vidhog.com/')]");
			addObsoleteHost("filelaser\\.com\/\\w+","//a[contains(@href,'filelaser.com/')]");
			addObsoleteHost("holderfile\\.com\/\\w+","//a[contains(@href,'holderfile.com/')]");
			addObsoleteHost("fileduct\\.(?:com|net)\/\\w+","//a[contains(@href,'fileduct.com/') or contains(@href,'fileduct.net')]");
			addObsoleteHost("filefat\\.com\/\\w+","//a[contains(@href,'filefat.com/')]");
			addObsoleteHost("restfile\\.com\/\\w+","//a[contains(@href,'restfile.com/')]");
			addObsoleteHost("filemashine\\.com\\/download\/\\w+","//a[contains(@href,'filemashine.com/download')]");
			addObsoleteHost("cloudnxt\\.net\/\\w+","//a[contains(@href,'cloudnxt.net/')]");
			addObsoleteHost("uploadrack\\.com\/\\w+","//a[contains(@href,'uploadrack.com')]");
			addObsoleteHost("teradepot\\.com\/\\w+","//a[contains(@href,'teradepot.com')]");
			addObsoleteHost("dataup\\.to\/\\d+\/","//a[contains(@href,'dataup.to')]");
			addObsoleteHost("upit\\.to\/file:\\d+","//a[contains(@href,'upit.to/file')]");
			addObsoleteHost("badongo\\.(?:com|net)\/(?:\\w\\w\/|)(?:vid|cfile|file|pt)\/\\w+","//a[contains(@href,'badongo.com') or contains(@href,'badongo.net')]");
			addObsoleteHost("driveway\\.com\/\\w+","//a[contains(@href,'driveway.com')]");
			addObsoleteHost("eatlime\\.com\/download","//a[contains(@href,'eatlime.com/download')]");
			addObsoleteHost("a2zuploads\\.com\/id\\w+","//a[contains(@href,'a2zuploads.com/id')]");
			addObsoleteHost("friendlyfiles\\.net\/download\/\\w+\/","//a[contains(@href,'friendlyfiles.net/download')]");
			addObsoleteHost("flyfile\\.us\/\\w+","//a[contains(@href,'flyfile.us')]");
			addObsoleteHost("speedyshare\\.com\/\\w+","//a[contains(@href,'speedyshare.com')]");
			addObsoleteHost("brontofile\\.com\/download","//a[contains(@href,'brontofile.com/download')]");
			addObsoleteHost("uploadspace\\.eu\/\\w+","//a[contains(@href,'uploadspace.eu')]");
			addObsoleteHost("fooget\\.com\/\\w+","//a[contains(@href,'fooget.com/')]");
			addObsoleteHost("file-bit.net\/\\w+","//a[contains(@href,'file-bit.net/')]");
			addObsoleteHost("keepfile\\.com\/\\w+","//a[contains(@href,'http://keepfile.com')]");
			addObsoleteHost("piggyshare\\.com\/file\/\\w+","//a[contains(@href,'piggyshare.com')]");
			addObsoleteHost("filecrown\\.com\/\\w+","//a[contains(@href,'filecrown.com')]");
			addObsoleteHost("6giga\\.com\/\\w+","//a[contains(@href,'6giga.com')]");
			addObsoleteHost("uploadjockey\\.com\/download\/\\w+","//a[contains(@href,'uploadjockey.com/download')]");
			addObsoleteHost("bluehost\\.to\/dl=\\w+","//a[contains(@href,'bluehost.to')]");
			addObsoleteHost("coolshare\\.cz\/stahnout\/\\w+","//a[contains(@href,'coolshare.cz/stahnout')]");
			addObsoleteHost("filegu\\.ru\/f\/\\w+","//a[contains(@href,'filegu.ru/f')]");
			addObsoleteHost("filebase\\.to\/files\/\\d+\/","//a[contains(@href,'filebase.to/files')]");
			addObsoleteHost("kickload\\.com\/(?:file|get)\/","//a[contains(@href,'kickload.com/file') or contains(@href,'kickload.com/get')]");
			addObsoleteHost("up-file\\.com\/files\/download\/\\w+\/","//a[contains(@href,'up-file.com/download')]");
			addObsoleteHost("ezyfile\\.net\/\\w+","//a[contains(@href,'ezyfile.net/')]");
			addObsoleteHost("k2files\\.com\/files","//a[contains(@href,'k2files.com/files')]");
			addObsoleteHost("aiotool\\.net\/\\w+","//a[contains(@href,'aiotool.net/')]");
			addObsoleteHost("xvideos\\.com\/files\/\\d+\/\\w+","//a[contains(@href,'xvideos.com/files')]");
			addObsoleteHost("filebling\\.com\/dl\/\\d+\/\\d+\/\\w+","//a[contains(@href,'filebling.com/dl')]");
			addObsoleteHost("loaded\\.it\/divx\/\\w+","//a[contains(@href,'loaded.it/divx')]");
			addObsoleteHost("uploadcell\\.com\/\\w+\/\\w+","//a[contains(@href,'uploadcell.com')]");
			addObsoleteHost("jakfile\\.com\/\\w+","//a[contains(@href,'jakfile.com/')]");
			addObsoleteHost("uploadshare\\.cz\/download\/\\w+\/\\w+","//a[contains(@href,'uploadshare.cz/download')]");
			addObsoleteHost("mangoshare\\.com\/\\w+","//a[contains(@href,'mangoshare.com')]");
			addObsoleteHost("ugotfile\\.com\/file\/\\d+\/\\w+","//a[contains(@href,'ugotfile.com/file')]");
			addObsoleteHost("filestab\\.com\/\\w+","//a[contains(@href,'filestab.com')]");
			addObsoleteHost("dotavi\\.com\/\\w+\/.","//a[contains(@href,'dotavi.com/')]");
			addObsoleteHost("crazyupload\\.com\/\\w+","//a[contains(@href,'crazyupload.com')]");
			addObsoleteHost("gaiafile\\.com\/\\w+","//a[contains(@href,'gaiafile.com')]");
			addObsoleteHost("sharejunky\\.com\/\\w+","//a[contains(@href,'sharejunky.com')]");
			addObsoleteHost("fileho\\.com\/download\/\\d+","//a[contains(@href,'fileho.com/download')]");
			addObsoleteHost("(?:bigandfree|BigAndFree)\\.com\/\\d+","//a[contains(@href,'bigandfree.com') or contains(@href,'BigAndFree.com')]");
			addObsoleteHost("bigfile\\.in\/\\w+","//a[contains(@href,'bigfile.in')]");
			addObsoleteHost("bigshare\\.eu\/download\\.php\\?id=","//a[contains(@href,'bigshare.eu/download.php')]");
			addObsoleteHost("dahosting\\.org\/dl\/\\w+","//a[contains(@href,'dahosting.org/dl')]");
			addObsoleteHost("digisofts\\.net\/\\w+","//a[contains(@href,'digisofts.net')]");
			addObsoleteHost("file4save\\.com\/\\w+\/\\w+","//a[contains(@href,'file4save.com')]");
			addObsoleteHost("filereactor\\.com\/\\w+","//a[contains(@href,'filereactor.com/')]");
			addObsoleteHost("filechip\\.com\/\\w+","//a[contains(@href,'filechip.com')]");
			addObsoleteHost("filescloud\\.com\/\\w+\/\\w+","//a[contains(@href,'filescloud.com')]");
			addObsoleteHost("saveqube\\.com\/getfile\/\\w+","//a[contains(@href,'saveqube.com/getfile')]");
			addObsoleteHost("www2\\.turboshare\\.de\/v\/\\d+","//a[contains(@href,'turboshare.de/v')]");
			addObsoleteHost("z-upload\\.com\/\\w+","//a[contains(@href,'z-upload.com')]");
			addObsoleteHost("youshare\\.com\/view\\.php","//a[contains(@href,'youshare.com/view')]");
			addObsoleteHost("jiffyupload\\.com\/\\w+","//a[contains(@href,'jiffyupload.com')]");
			addObsoleteHost("gigeshare\\.com\/preview\/\\w+","//a[contains(@href,'gigeshare.com')]");
			addObsoleteHost("datenklo\\.net\/dl","//a[contains(@href,'datenklo.net')]");
			addObsoleteHost("upload\\.dj\/download\\.php\\?id=\\w+","//a[contains(@href,'upload.dj/download.php')]");
			addObsoleteHost("loadfiles\\.in\/\\w+\/","//a[contains(@href,'loadfiles.in')]");
			addObsoleteHost("upit\\.to\/file:\\w+\/","//a[contains(@href,'upit.to/file')]");
			addObsoleteHost("zshare\\.net\/(?:download|video|audio)\/\\w+","//a[contains(@href,'zshare.net/')]");
			addObsoleteHost("refile\\.net\/f\/\\?\\w+","//a[contains(@href,'refile.net/f/')]");
			addObsoleteHost("dsfileshare\\.com\/download","//a[contains(@href,'dsfileshare.com/download')]");
			addObsoleteHost("sharesimple\\.net\/\\w{2}\/download","//a[contains(@href,'sharesimple.net')]");
			addObsoleteHost("(?:s\\d+\\.|)4files\\.net\/\\d+","//a[contains(@href,'4files.net')]");
			addObsoleteHost("odsiebie\\.com\/pokaz\/\\d+","//a[contains(@href,'odsiebie.com/pokaz')]");
			addObsoleteHost("filenavi\\.com\/direct\/\\w+","//a[contains(@href,'filenavi.com/direct')]");
			addObsoleteHost("3oof\\.com\/\\w+","//a[contains(@href,'3oof.com/')]");
			addObsoleteHost("meshwaar\\.com\/\\w+","//a[contains(@href,'meshwaar.com')]");
			addObsoleteHost("maxupload\\.com\/files\/\\w+","//a[contains(@href,'maxupload.com/files')]");
			addObsoleteHost("share\\.cx\/videos\/\\d+","//a[contains(@href,'share.cx/videos')]");
			addObsoleteHost("atserver\\.eu\/(?:\\w{2}\/|)download\/\\d+","//a[contains(@href,'atserver.eu')]");
			addObsoleteHost("file2upload\\.net\/download\/\\d+","//a[contains(@href,'file2upload.net/download')]");
			addObsoleteHost("filebling\\.com\/\\w+","//a[contains(@href,'filebling.com')]");
			addObsoleteHost("turboshare\\.(?:eu|com)\/files","//a[contains(@href,'turboshare.') and contains(@href,'/files')]");
			addObsoleteHost("rarhost\\.com\/download","//a[contains(@href,'rarhost.com/download')]");
			addObsoleteHost("isharehd\\.com\/\\w+","//a[contains(@href,'isharehd.com')]");
			addObsoleteHost("datenklo\\.net\/file\\.php\\?id=\\w+","//a[contains(@href,'datenklo.net/file.php')]");
			addObsoleteHost("file2share\\.biz\/download\\.php\\?id=\\w+","//a[contains(@href,'file2share.biz/download.php')]");
			addObsoleteHost("savefiles\\.net\/d\/\\w+\\.html","//a[contains(@href,'savefiles.net/d')]");
			addObsoleteHost("bestsharing\\.com\/files\/\\w+","//a[contains(@href,'bestsharing.com/files')]");
			addObsoleteHost("filecache\\.de\/\\d+","//a[contains(@href,'filecache.de/')]");
			addObsoleteHost("i741\\.com\/files\/\\w+","//a[contains(@href,'i741.com/files')]");
			addObsoleteHost("dataup\\.de\/\\d+","//a[contains(@href,'dataup.de')]");
			addObsoleteHost("fofly\\.com\/\\w+","//a[contains(@href,'fofly.com')]");
			addObsoleteHost("shareonall\\.com\/\\w+","//a[contains(@href,'shareonall.com')]");
			addObsoleteHost("sexuploader\\.com\/(?:|..\/)\\?[d|v]=\\w{8}","//a[contains(@href,'sexuploader.com')]");
			addObsoleteHost("mega(upload|video|rotic|porn)\\.com\/(?:|..\/)\\?[d|v|f]=\\w{8}","//a[contains(@href,'megaupload.com') or contains(@href,'megavideo.com') or contains(@href,'megaporn.com') or contains(@href,'megarotic.com')]");
			addObsoleteHost("uploadhyper\\.com\/file\/","//a[contains(@href,'uploadhyper.com')]");
			addObsoleteHost("filespawn\\.com\/file\/","//a[contains(@href,'filespawn.com')]");
			addObsoleteHost("caizzii\\.com\/(?:download|\\?file=)","//a[contains(@href,'caizzii.com')]");
			addObsoleteHost("volnyweb\\.cz\/files\/get\/[\\w-_]+","//a[contains(@href,'volnyweb.cz/files')]");
			addObsoleteHost("gotupload\\.com\/\\w+","//a[contains(@href,'gotupload.com/')]");
			addObsoleteHost("mooload\\.com\/new\/file\\.php\\?file=files\/\\d+\/\\d+","//a[contains(@href,'mooload.com/new/file')]");
			addObsoleteHost("z\\d+\\.zupload\\.com\/download\\.php\\?file=getfile&filepath=\\d+","//a[contains(@href,'zupload.com/download')]");
			addObsoleteHost("mytempdir\\.com\/\\d+","//a[contains(@href,'mytempdir.com/')]");
			addObsoleteHost("usershare\\.net\/\\w+","//a[contains(@href,'usershare.net/')]");
			addObsoleteHost("qshare\\.com\/get\/\\d+\/.","//a[contains(@href,'qshare.com/get')]");
			addObsoleteHost("filescash\\.net\/file\/\\d+","//a[contains(@href,'filescash.net/file')]");
			addObsoleteHost("metahyper\\.com\/\\w+","//a[contains(@href,'metahyper.com/')]");
			addObsoleteHost("combozip\\.com\/\\w+","//a[contains(@href,'combozip.com/')]");
			addObsoleteHost("anonstream\\.com\/get_\\w+","//a[contains(@href,'anonstream.com/get_')]");
			addObsoleteHost("x7\\.to\/\\w+","//a[contains(@href,'x7.to/')]");
			addObsoleteHost("uploadbox\\.com\/files\/\\w+","//a[contains(@href,'uploadbox.com/files')]");
			addObsoleteHost("(?:flyupload\\.)?(?:enterupload|flyupload)\\.com\/[\\?\\w]+","//a[contains(@href,'enterupload.com/') or contains(@href,'flyupload.com/')]");
			addObsoleteHost("filepoint\\.de\/dl\/\\w+","//a[contains(@href,'filepoint.de/dl')]");
			addObsoleteHost("icushare\\.com\/\\w+","//a[contains(@href,'icushare.com/')]");
			addObsoleteHost("oron\\.com\/\\w+","//a[contains(@href,'oron.com/')]");
			addObsoleteHost("mystream\\.to\/file\\-\\d+","//a[contains(@href,'mystream.to/file')]");
			addObsoleteHost("x-fs\\.com\/download\\.php\\?id=\\w+","//a[contains(@href,'x-fs.com/download')]");
			addObsoleteHost("srapid\\.eu\/\\w+","//a[contains(@href,'srapid.eu/')]");
			addObsoleteHost("shareshared\\.com\/\\w+","//a[contains(@href,'shareshared.com/')]");
			addObsoleteHost("sosame\\.cz\/\\w+","//a[contains(@href,'sosame.cz/')]");
			addObsoleteHost("s\\d+\\.filesdump\\.com\/file\/\\w+","//a[contains(@href,'filesdump.com/file')]");
			addObsoleteHost("2-klicks\\.de\/\\?d=\\w+","//a[contains(@href,'2-klicks.de/?d=')]");
			addObsoleteHost("silofiles\\.com\/file\/\\d+","//a[contains(@href,'silofiles.com/file')]");
			addObsoleteHost("upfile\\.in\/\\w+","//a[contains(@href,'upfile.in/')]");
			addObsoleteHost("filehook\\.com\/\\w+","//a[contains(@href,'filehook.com/')]");
			addObsoleteHost("mojofile\\.com\/\\w+","//a[contains(@href,'mojofile.com/')]");
			addObsoleteHost("cloudcache\\.cc\/\\w+","//a[contains(@href,'cloudcache.cc/')]");
			addObsoleteHost("1hostclick\\.com\/\\w+","//a[contains(@href,'1hostclick.com/')]");
			addObsoleteHost("4bytez\\.com\/\\w+","//a[contains(@href,'4bytez.com/')]");
			addObsoleteHost("uploadking\\.com\/\\w+","//a[contains(@href,'uploadking.com/')]");
			addObsoleteHost("nahraj\\.cz\/(?:content|down)\/\\w+","//a[contains(@href,'nahraj.cz/')]");
			addObsoleteHost("megarapid\\.eu\/files\/\\d+","//a[contains(@href,'megarapid.eu/files')]");
			addObsoleteHost("(?:fileserve|uploadstation)\\.com\/(?:file|list)\/\\w+","//a[contains(@href,'fileserve.com/') or contains(@href,'uploadstation.com/')]");
			addObsoleteHost("uploadhere\\.com\/\\w+","//a[contains(@href,'uploadhere.com/')]");
			addObsoleteHost("dualshare\\.com\/\\w+","//a[contains(@href,'dualshare.com/')]");
			addObsoleteHost("yourfilehost\\.com\/media","//a[contains(@href,'yourfilehost.com/media')]");
			addObsoleteHost("ftp2share\\.com\/file\/\\w+","//a[contains(@href,'ftp2share.com/file')]");
			addObsoleteHost("storeandserve\\.com\/download\/\\d+","//a[contains(@href,'storeandserve.com/download')]");
			addObsoleteHost("mountfile\\.com\/file(?:\/\\w+){2}","//a[contains(@href,'mountfile.com/file')]");
			addObsoleteHost("save\\.am\/files\/\\w+","//a[contains(@href,'save.am/files')]");
			addObsoleteHost("transitfiles\\.com\/dl\/\\w+","//a[contains(@href,'transitfiles.com/dl')]");
			addObsoleteHost("smartuploader\\.com\/file\\.php\\?f=\\d+","//a[contains(@href,'smartuploader.com/file.php?=')]");
			addObsoleteHost("skipfile\\.com\/\\w+","//a[contains(@href,'skipfile.com/')]");
			addObsoleteHost("stahnu\\.to\/[\\w\\?]+","//a[contains(@href,'stahnu.to/')]");
			addObsoleteHost("flyshare\.cz\/(?:stahni\/|)\\d+","//a[contains(@href,'flyshare.cz/')]");
			addObsoleteHost("(?:ddlani\\.me|ddlanime\\.com)\/\\w+","//a[contains(@href,'ddlani.me/') or contains(@href,'ddlanime.com/')]");
			addObsoleteHost("loadly\\.com\/\\w+","//a[contains(@href,'loadly.com/')]");
			addObsoleteHost("groovefile\\.com\/\\w+","//a[contains(@href,'groovefile.com/')]");
			addObsoleteHost("filezlot\\.com\/\\w+","//a[contains(@href,'filezlot.com/')]");
			addObsoleteHost("shareator\\.(?:net|com)\/\\w+","//a[contains(@href,'shareator.')]");
			addObsoleteHost("yabadaba\\.ru\/files\/","//a[contains(@href,'yabadaba.ru/files/')]");
			addObsoleteHost("rapidhide\\.com\/download\\.php\\?file=\\w+","//a[contains(@href,'rapidhide.com/download.php')]");
			addObsoleteHost("filejungle\\.com\/[fl]\/\\w+","//a[contains(@href,'filejungle.com/')]");
			addObsoleteHost("kewlshare\\.com\/dl\/\\d+","//a[contains(@href,'kewlshare.com/dl')]");
			addObsoleteHost("petandrive\\.com\/file\/\\w+","//a[contains(@href,'petandrive.com/file')]");
			addObsoleteHost("onionshare\\.com\/\\w+","//a[contains(@href,'onionshare.com/')]");
			addObsoleteHost("rapidable\\.com\/\\w+\/download\\.php\\?id=","//a[contains(@href,'rapidable.com/')]");
			addObsoleteHost("filesdump\\.com\/file\/\\w+\/\\d+","//a[contains(@href,'filesdump.com/file')]");
			addObsoleteHost("file2box\\.(?:net|com)\/\\w+","//a[contains(@href,'file2box.')]");
			addObsoleteHost("(?:filesonic|sharingmatrix|wupload)(?:\\.\\w+){1,2}\/(?:file|folder)\/\\w+","//a[contains(@href,'filesonic.') or contains(@href,'sharingmatrix.com') or contains(@href,'wupload.')]");
			addObsoleteHost("bloggerarticles\\.com\/\\w+","//a[contains(@href,'bloggerarticles.com/')]");
			addObsoleteHost("mojedata\\.sk/","//a[contains(@href,'mojedata.sk/')]");
			addObsoleteHost("sharpfile\\.com\/\\w+","//a[contains(@href,'sharpfile.com/')]");
			addObsoleteHost("upgrand\\.com\/\\w+","//a[contains(@href,'upgrand.com/')]");
			addObsoleteHost("nasdilej\\.cz\/\\w+","//a[contains(@href,'nasdilej.cz/')]");
			addObsoleteHost("mediatack\\.cz\/stahuj/\\w+","//a[contains(@href,'mediatack.cz/stahuj/')]");
			addObsoleteHost("share-it\\.to\/file/\\w+","//a[contains(@href,'share-it.to/file/')]");
			addObsoleteHost("primeupload\\.com\/file/\\w+","//a[contains(@href,'primeupload.com/file/')]");
			addObsoleteHost("(?:uploads\\.glumbo|glumbouploads)\\.com\/\\w+","//a[contains(@href,'uploads.glumbo.com') or contains(@href,'glumbouploads.com')]");
			addObsoleteHost("filebeer\\.info\/\\w+","//a[contains(@href,'filebeer.info/')]");
			addObsoleteHost("baberepublic\\.com\/link\/\\w+","//a[contains(@href,'baberepublic.com/link/')]");
			addObsoleteHost("xtu\\.me\/\\w+","//a[contains(@href,'xtu.me/')]");
			addObsoleteHost("sharebase\\.de\/files\/\\w+","//a[contains(@href,'sharebase.de/files/')]");
			addObsoleteHost("filerobo\\.com\/\\w+","//a[contains(@href,'filerobo.com/')]");
			addObsoleteHost("filevelocity\\.com\/\\w+","//a[contains(@href,'filevelocity.com/')]");
			addObsoleteHost("filezpro\\.com\/\\w+","//a[contains(@href,'filezpro.com/')]");
			addObsoleteHost("file4sharing\\.com\/\\w+","//a[contains(@href,'file4sharing.com/')]");
			addObsoleteHost("cing\\.be\/\\w+","//a[contains(@href,'cing.be/')]");
			addObsoleteHost("ufile\\.eu\/\\w+","//a[contains(@href,'ufile.eu/')]");
			addObsoleteHost("pigsonic\\.com\/\\w+","//a[contains(@href,'pigsonic.com/')]");
			addObsoleteHost("fileupped\\.com\/\\w+","//a[contains(@href,'fileupped.com/')]");
			addObsoleteHost("sharerun\\.com\/\\w+","//a[contains(@href,'sharerun.com/')]");
			addObsoleteHost("rapidslnare\\.com\/\\w+","//a[contains(@href,'rapidslnare.com/')]");
			addObsoleteHost("monsteruploads\\.eu\/\\w+","//a[contains(@href,'monsteruploads.eu/')]");
			addObsoleteHost("b9bb\\.com\/\\w+","//a[contains(@href,'b9bb.com/')]");
			addObsoleteHost("jamber\\.info\/\\w+","//a[contains(@href,'jamber.info/')]");
			addObsoleteHost("(?:megaftp|MegaFTP)\\.com\/\\w+","//a[contains(@href,'megaftp.com/') or contains(@href,'MegaFTP.com/')]");
			addObsoleteHost("desiupload\\.net\/\\?d=\\w+","//a[contains(@href,'desiupload.net/')]");
			addObsoleteHost("file27\\.com\/\\w+","//a[contains(@href,'file27.com/')]");
			addObsoleteHost("yastorage\\.com\/\\w+","//a[contains(@href,'yastorage.com/')]");
			addObsoleteHost("filehost\\.ws\/\\w+","//a[contains(@href,'filehost.ws/')]");
			addObsoleteHost("copyload\\.com\/\\w+","//a[contains(@href,'copyload.com/')]");
			addObsoleteHost("venusfile\\.com\/\\w+","//a[contains(@href,'venusfile.com/')]");
			addObsoleteHost("aieshare\\.com\/\\w+","//a[contains(@href,'aieshare.com/')]");
			addObsoleteHost("fileza\\.net\/\\w+","//a[contains(@href,'fileza.net/')]");
			addObsoleteHost("filerose\\.com\/\\w+","//a[contains(@href,'filerose.com/')]");
			addObsoleteHost("squillion\\.com\/\\w+","//a[contains(@href,'squillion.com/')]");
			addObsoleteHost("fileprohost\\.com\/\\w+","//a[contains(@href,'fileprohost.com/')]");
			addObsoleteHost("bitbonus\\.com\/download\/\\w+","//a[contains(@href,'bitbonus.com/')]");
			addObsoleteHost("warserver\\.cz\/\\w+","//a[contains(@href,'warserver.cz/')]");
			addObsoleteHost("uload\\.to\/\\w+","//a[contains(@href,'uload.to/')]");
      addObsoleteHost("sharedbit\\.net\/\\w+","//a[contains(@href,'sharedbit.net/')]");
      addObsoleteHost("megaload\\.it\/\\w+","//a[contains(@href,'megaload.it/')]");
      addObsoleteHost("filewinds\\.com\/\\w+","//a[contains(@href,'filewinds.com/')]");
      addObsoleteHost("uploadcore\\.com\/\\w+","//a[contains(@href,'uploadcore.com/')]");
      addObsoleteHost("syfiles\\.com\/\\w+","//a[contains(@href,'syfiles.com/')]");
      addObsoleteHost("eyesfile\\.com\/\\w+","//a[contains(@href,'eyesfile.com/')]");
      addObsoleteHost("hotfile\\.com\/\\w+","//a[contains(@href,'hotfile.com/')]");
      addObsoleteHost("superupl\\.com\/\\w+","//a[contains(@href,'superupl.com/')]");
      addObsoleteHost("oteupload\\.com\/\\w+","//a[contains(@href,'oteupload.com/')]");
      addObsoleteHost("henchfile\\.com\/\\w+","//a[contains(@href,'henchfile.com/')]");
      addObsoleteHost("HenchFile\\.com\/\\w+","//a[contains(@href,'HenchFile.com/')]");
      addObsoleteHost("filegag\\.com\/\\w+","//a[contains(@href,'filegag.com/')]");
      addObsoleteHost("filedefend\\.com\/\\w+","//a[contains(@href,'filedefend.com/')]");
      addObsoleteHost("hotfiles\\.ws\/\\w+","//a[contains(@href,'hotfiles.ws/')]");
      addObsoleteHost("share-rapid\\.com\/\\w+","//a[contains(@href,'share-rapid.com/')]");
      addObsoleteHost("rapids\\.cz\/\\w+","//a[contains(@href,'rapids.cz/')]");
      addObsoleteHost("share-credit\\.cz\/\\w+","//a[contains(@href,'share-credit.cz/')]");
      addObsoleteHost("share-central\\.cz\/\\w+","//a[contains(@href,'share-central.cz/')]");
      addObsoleteHost("share-ms\\.cz\/\\w+","//a[contains(@href,'share-ms.cz/')]");
      addObsoleteHost("share-net\\.cz\/\\w+","//a[contains(@href,'share-net.cz/')]");
      addObsoleteHost("srapid\\.cz\/\\w+","//a[contains(@href,'srapid.cz/')]");
      addObsoleteHost("share-rapid\\.cz\/\\w+","//a[contains(@href,'share-rapid.cz/')]");
      addObsoleteHost("wooupload\\.com\/\\w+","//a[contains(@href,'wooupload.com/')]");
      addObsoleteHost("megabitshare\\.com\/\\w+","//a[contains(@href,'megabitshare.com/')]");
      addObsoleteHost("uploking\\.com\/\\w+","//a[contains(@href,'uploking.com/')]");
      addObsoleteHost("esnips\\.com\/\\w+","//a[contains(@href,'esnips.com/')]");
      addObsoleteHost("uplly\\.com\/\\w+","//a[contains(@href,'uplly.com/')]");
      addObsoleteHost("ufox\\.com\/\\w+","//a[contains(@href,'ufox.com/')]");
      addObsoleteHost("clz\\.to\/\\w+","//a[contains(@href,'clz.to/')]");
      addObsoleteHost("cloudzer\\.net\/\\w+","//a[contains(@href,'cloudzer.net/')]");
      addObsoleteHost("cloudzer\\.com\/\\w+","//a[contains(@href,'cloudzer.com/')]");
      addObsoleteHost("extabit\\.com\/\\w+","//a[contains(@href,'extabit.com/')]");
      addObsoleteHost("uploadwaste\\.com\/\\w+","//a[contains(@href,'uploadwaste.com/')]");
			addObsoleteHost("247upload\\.com\/\\w+","//a[contains(@href,'uploadwaste.com/')]");
			addObsoleteHost("2download\\.de\/\\w+","//a[contains(@href,'2download.de/')]");
			addObsoleteHost("4fastfile\\.com\/\\w+","//a[contains(@href,'4fastfile.com/')]");
			addObsoleteHost("asixfiles\\.com\/\\w+","//a[contains(@href,'asixfiles.com/')]");
			addObsoleteHost("berofile\\.com\/\\w+","//a[contains(@href,'berofile.com/')]");
			addObsoleteHost("bigupload\\.com\/\\w+","//a[contains(@href,'bigupload.com/')]");
			addObsoleteHost("cepzo\\.com\/\\w+","//a[contains(@href,'cepzo.com/')]");
			addObsoleteHost("czshare\\.com\/\\w+","//a[contains(@href,'czshare.com/')]");
			addObsoleteHost("clouds\\.to\/\\w+","//a[contains(@href,'clouds.to/')]");
			addObsoleteHost("cobrashare\\.sk\/\\w+","//a[contains(@href,'cobrashare.sk/')]");
			addObsoleteHost("coraldrive\\.net\/\\w+","//a[contains(@href,'coraldrive.net/')]");
			addObsoleteHost("cyberlocker\\.ch\/\\w+","//a[contains(@href,'cyberlocker.ch/')]");
			addObsoleteHost("darkport\\.org\/\\w+","//a[contains(@href,'darkport.org/')]");
			addObsoleteHost("dark-uploads\\.com\/\\w+","//a[contains(@href,'dark-uploads.com/')]");
			addObsoleteHost("davvas\\.com\/\\w+","//a[contains(@href,'davvas.com/')]");
			addObsoleteHost("enigmashare\\.com\/\\w+","//a[contains(@href,'enigmashare.com/')]");
			addObsoleteHost("erofly\\.cz\/\\w+","//a[contains(@href,'erofly.cz/')]");
			addObsoleteHost("fastsonic\\.net\/\\w+","//a[contains(@href,'fastsonic.net/')]");
			addObsoleteHost("filebox\\.com\/\\w+","//a[contains(@href,'filebox.com/')]");
			addObsoleteHost("filecity\\.net\/\\w+","//a[contains(@href,'filecity.net/')]");
			addObsoleteHost("filedap\\.com\/\\w+","//a[contains(@href,'filedap.com/')]");
			addObsoleteHost("filedino\\.com\/\\w+","//a[contains(@href,'filedino.com/')]");
			addObsoleteHost("filedownloads\\.org\/\\w+","//a[contains(@href,'filedownloads.org/')]");
			addObsoleteHost("filefolks\\.com\/\\w+","//a[contains(@href,'filefolks.com/')]");
			addObsoleteHost("fileking\\.co\/\\w+","//a[contains(@href,'fileking.co/')]");
			addObsoleteHost("filemates\\.com\/\\w+","//a[contains(@href,'filemates.com/')]");
			addObsoleteHost("files\\.to\/\\w+","//a[contains(@href,'files.to/')]");
			addObsoleteHost("files2k\\.eu\/\\w+","//a[contains(@href,'files2k.eu/')]");
			addObsoleteHost("filesector\\.cc\/\\w+","//a[contains(@href,'filesector.cc/')]");
			addObsoleteHost("filesega\\.com\/\\w+","//a[contains(@href,'filesega.com/')]");
			addObsoleteHost("filesend\\.net\/\\w+","//a[contains(@href,'filesend.net/')]");
			addObsoleteHost("filestay\\.com\/\\w+","//a[contains(@href,'filestay.com/')]");
			addObsoleteHost("filestrum\\.com\/\\w+","//a[contains(@href,'filestrum.com/')]");
			addObsoleteHost("fileuplo\\.de\/\\w+","//a[contains(@href,'fileuplo.de/')]");
			addObsoleteHost("forunesia\\.com\/\\w+","//a[contains(@href,'forunesia.com/')]");
			addObsoleteHost("freeuploads\\.fr\/\\w+","//a[contains(@href,'freeuploads.fr/')]");
			addObsoleteHost("uploa\\.dk\/\\w+","//a[contains(@href,'uploa.dk/')]");
			addObsoleteHost("getthebit\\.com\/\\w+","//a[contains(@href,'getthebit.com/')]");
			addObsoleteHost("getzilla\\.net\/\\w+","//a[contains(@href,'getzilla.net/')]");
			addObsoleteHost("goldfile\\.eu\/\\w+","//a[contains(@href,'goldfile.eu/')]");
			addObsoleteHost("good\\.com\/\\w+","//a[contains(@href,'good.com/')]");
			addObsoleteHost("grupload\\.com\/\\w+","//a[contains(@href,'grupload.com/')]");
			addObsoleteHost("hellfile\\.com\/\\w+","//a[contains(@href,'hellfile.com/')]");
			addObsoleteHost("hipfile\\.com\/\\w+","//a[contains(@href,'hipfile.com/')]");
			addObsoleteHost("hitfile\\.com\/\\w+","//a[contains(@href,'hitfile.com/')]");
			addObsoleteHost("hulkfile\\.eu\/\\w+","//a[contains(@href,'hulkfile.eu/')]");
			addObsoleteHost("i-filez\\.com\/\\w+","//a[contains(@href,'i-filez.com/')]");
			addObsoleteHost("ifile\\.ws\/\\w+","//a[contains(@href,'ifile.ws/')]");
			addObsoleteHost("kupload\\.org\/\\w+","//a[contains(@href,'kupload.org/')]");
			addObsoleteHost("duckfile\\.net\/\\w+","//a[contains(@href,'duckfile.net/')]");
			addObsoleteHost("packupload\\.com\/\\w+","//a[contains(@href,'packupload.com/')]");
			addObsoleteHost("terafile\\.com\/\\w+","//a[contains(@href,'terafile.com/')]");
			addObsoleteHost("terafile\\.co\/\\w+","//a[contains(@href,'terafile.co/')]");
			addObsoleteHost("fileom\\.com\/\\w+","//a[contains(@href,'fileom.com/')]");
			addObsoleteHost("luckyshare\\.net\/\\w+","//a[contains(@href,'luckyshare.net/')]");
			addObsoleteHost("lemuploads\\.com\/\\w+","//a[contains(@href,'lemuploads.com/')]");
			addObsoleteHost("limelinx\\.com\/\\w+","//a[contains(@href,'limelinx.com/')]");
			addObsoleteHost("maxshare\\.pl\/\\w+","//a[contains(@href,'maxshare.pl/')]");
			addObsoleteHost("megarelease\\.org\/\\w+","//a[contains(@href,'megarelease.org/')]");
			addObsoleteHost("(?:d\\d+\.|)megashares\.com\/(?:dl|index\.php\\?d|\\?d\\d+=\\w+)","//a[contains(@href,'megashares.com/')]");
			addObsoleteHost("megashare\\.com\/\\w+","//a[contains(@href,'megashare.com/')]");
			addObsoleteHost("minus\\.com\/\\w+","//a[contains(@href,'minus.com/')]");
			addObsoleteHost("mlfat4arab\\.com\/\\w+","//a[contains(@href,'mlfat4arab.com/')]");
			addObsoleteHost("multishare\\.cz\/\\w+","//a[contains(@href,'multishare.cz/')]");
			addObsoleteHost("nirafile\\.com\/\\w+","//a[contains(@href,'nirafile.com/')]");
			addObsoleteHost("ok2upload\\.com\/\\w+","//a[contains(@href,'ok2upload.com/')]");
			addObsoleteHost("peejeshare\\.com\/\\w+","//a[contains(@href,'peejeshare.com/')]");
			addObsoleteHost("premiuns\\.org\/\\w+","//a[contains(@href,'premiuns.org/')]");
			addObsoleteHost("przeklej\\.net\/\\w+","//a[contains(@href,'przeklej.net/')]");
			addObsoleteHost("qkup\\.net\/\\w+","//a[contains(@href,'qkup.net/')]");
			addObsoleteHost("rapidupload\\.sk\/\\w+","//a[contains(@href,'rapidupload.sk/')]");
			addObsoleteHost("rockdizfile\\.com\/\\w+","//a[contains(@href,'rockdizfile.com/')]");
			addObsoleteHost("rocketfile\\.net\/\\w+","//a[contains(@href,'rocketfile.net/')]");
			addObsoleteHost("share-now\\.net\/\\w+","//a[contains(@href,'share-now.net/')]");
			addObsoleteHost("share76\\.com\/\\w+","//a[contains(@href,'share76.com/')]");
			addObsoleteHost("sharebees\\.com\/\\w+","//a[contains(@href,'sharebees.com/')]");
			addObsoleteHost("sharefiles\\.co\/\\w+","//a[contains(@href,'sharefiles.co/')]");
			addObsoleteHost("slingfile\\.com\/\\w+","//a[contains(@href,'slingfile.com/')]");
			addObsoleteHost("sms4file\\.com\/\\w+","//a[contains(@href,'sms4file.com/')]");
			addObsoleteHost("space4file\\.com\/\\w+","//a[contains(@href,'space4file.com/')]");
			addObsoleteHost("tigershare\\.net\/\\w+","//a[contains(@href,'tigershare.net/')]");
			addObsoleteHost("toucansharing\\.com\/\\w+","//a[contains(@href,'toucansharing.com/')]");
			addObsoleteHost("ubuntuone\\.com\/\\w+","//a[contains(@href,'ubuntuone.com/')]");
			addObsoleteHost("unextfiles\\.com\/\\w+","//a[contains(@href,'unextfiles.com/')]");
			addObsoleteHost("upaj\\.pl\/\\w+","//a[contains(@href,'upaj.pl/')]");
			addObsoleteHost("upfile\\.biz\/\\w+","//a[contains(@href,'upfile.biz/')]");
			addObsoleteHost("uploadbin\\.net\/\\w+","//a[contains(@href,'uploadbin.net/')]");
			addObsoleteHost("uploadic\\.com\/\\w+","//a[contains(@href,'uploadic.com/')]");
			addObsoleteHost("uploadinc\\.com\/\\w+","//a[contains(@href,'uploadinc.com/')]");
			addObsoleteHost("uploading4u\\.eu\/\\w+","//a[contains(@href,'uploading4u.eu/')]");
			addObsoleteHost("uploadjet\\.net\/\\w+","//a[contains(@href,'uploadjet.net/')]");
			addObsoleteHost("uploadorb\\.com\/\\w+","//a[contains(@href,'uploadorb.com/')]");
			addObsoleteHost("upthe\\.net\/\\w+","//a[contains(@href,'upthe.net/')]");
			addObsoleteHost("uptorch\\.com\/\\w+","//a[contains(@href,'uptorch.com/')]");
			addObsoleteHost("vidbox\\.yt\/\\w+","//a[contains(@href,'vidbox.yt/')]");
			addObsoleteHost("videozer\\.com\/\\w+","//a[contains(@href,'videozer.com/')]");
			addObsoleteHost("vreer\\.com\/\\w+","//a[contains(@href,'vreer.com/')]");
			addObsoleteHost("wallobit\\.com\/\\w+","//a[contains(@href,'wallobit.com/')]");
			addObsoleteHost("zooupload\\.com\/\\w+","//a[contains(@href,'zooupload.com/')]");
			addObsoleteHost("xerver\\.co\/\\w+","//a[contains(@href,'xerver.co/')]");
			addObsoleteHost("privatefiles\\.com\/\\w+","//a[contains(@href,'privatefiles.com/')]");
			addObsoleteHost("asfile\\.com\/\\w+","//a[contains(@href,'asfile.com/')]");
			addObsoleteHost("billionuploads\\.com\/\\w+","//a[contains(@href,'billionuploads.com/')]");
			addObsoleteHost("\\*{7,100}\/[\\w\\d]+","//a[contains(@href,'*******/')]");
			addObsoleteHost("filesaur\\.com\/\\w+","//a[contains(@href,'filesaur.com/')]");
			addObsoleteHost("rapidshare\\.com\/\\w+","//a[contains(@href,'rapidshare.com/')]");
			addObsoleteHost("rapidshare\\.ru\/\\w+","//a[contains(@href,'rapidshare.ru/')]");
			addObsoleteHost("filesfrog\\.net\/\\w+","//a[contains(@href,'filesfrog.net/')]");
			addObsoleteHost("4savefile\\.com\/\\w+","//a[contains(@href,'4savefile.com/')]");
			addObsoleteHost("dodane\\.pl\/\\w+","//a[contains(@href,'dodane.pl/')]");
			addObsoleteHost("dotsemper\\.com\/\\w+","//a[contains(@href,'dotsemper.com/')]");
			addObsoleteHost("egofiles\\.com\/\\w+","//a[contains(@href,'egofiles.com/')]");
			addObsoleteHost("epicshare\\.net\/\\w+","//a[contains(@href,'epicshare.net/')]");
			addObsoleteHost("fiberupload\\.net\/\\w+","//a[contains(@href,'fiberupload.net/')]");
			addObsoleteHost("filemonkey\\.in\/\\w+","//a[contains(@href,'filemonkey.in/')]");
			addObsoleteHost("filemonster\\.net\/\\w+","//a[contains(@href,'filemonster.net/')]");
			addObsoleteHost("filepom\\.com\/\\w+","//a[contains(@href,'filepom.com/')]");
			addObsoleteHost("filesbb\\.com\/\\w+","//a[contains(@href,'filesbb.com/')]");
			addObsoleteHost("filevice\\.com\/\\w+","//a[contains(@href,'filevice.com/')]");
			addObsoleteHost("gigaup\\.fr\/\\w+","//a[contains(@href,'gigaup.fr/')]");
			addObsoleteHost("isavelink\\.com\/\\w+","//a[contains(@href,'isavelink.com/')]");
			addObsoleteHost("loombo\\.com\/\\w+","//a[contains(@href,'loombo.com/')]");
			addObsoleteHost("megafiles\\.se\/\\w+","//a[contains(@href,'megafiles.se/')]");
			addObsoleteHost("migupload\\.com\/\\w+","//a[contains(@href,'migupload.com/')]");
			addObsoleteHost("mydisc\\.net\/\\w+","//a[contains(@href,'mydisc.net/')]");
			addObsoleteHost("nitrobits\\.com\/\\w+","//a[contains(@href,'nitrobits.com/')]");
			addObsoleteHost("potload\\.com\/\\w+","//a[contains(@href,'potload.com/')]");
			addObsoleteHost("redload\\.net\/\\w+","//a[contains(@href,'redload.net/')]");
			addObsoleteHost("shareprofi\\.com\/\\w+","//a[contains(@href,'shareprofi.com/')]");
			addObsoleteHost("sharesuper\\.info\/\\w+","//a[contains(@href,'sharesuper.info/')]");
			addObsoleteHost("sinhro\\.net\/\\w+","//a[contains(@href,'sinhro.net/')]");
			addObsoleteHost("speedfile\\.cz\/\\w+","//a[contains(@href,'speedfile.cz/')]");
			addObsoleteHost("speedshare\\.org\/\\w+","//a[contains(@href,'speedshare.org/')]");
			addObsoleteHost("storage.novoro\\.net\/\\w+","//a[contains(@href,'storage.novoro.net/')]");
			addObsoleteHost("swankshare\\.com\/\\w+","//a[contains(@href,'swankshare.com/')]");
			addObsoleteHost("swatupload\\.com\/\\w+","//a[contains(@href,'swatupload.com/')]");
			addObsoleteHost("upafile\\.com\/\\w+","//a[contains(@href,'upafile.com/')]");
			addObsoleteHost("uploadmachine\\.com\/\\w+","//a[contains(@href,'uploadmachine.com/')]");
			addObsoleteHost("uploadsat\\.com\/\\w+","//a[contains(@href,'uploadsat.com/')]");
			addObsoleteHost("upshared\\.com\/\\w+","//a[contains(@href,'upshared.com/')]");
			addObsoleteHost("usefile\\.com\/\\w+","//a[contains(@href,'usefile.com/')]");
			addObsoleteHost("yourfiles\\.to\/\\w+","//a[contains(@href,'yourfiles.to/')]");
			addObsoleteHost("zomgupload\\.com\/\\w+","//a[contains(@href,'zomgupload.com/')]");
			addObsoleteHost("~[\\w\\s~]*","//a[contains(@href,'//~') or contains(@href,'//www.~')]");
			addObsoleteHost("filemup\\.com\/\\w+","//a[contains(@href,'filemup.com/')]");
			addObsoleteHost("tuxfile\\.com\/\\w+","//a[contains(@href,'tuxfile.com/')]");
			addObsoleteHost("ultramegabit\\.com\/\\w+","//a[contains(@href,'ultramegabit.com/')]");
			addObsoleteHost("uploadto\\.us\/\\w+","//a[contains(@href,'uploadto.us/')]");
      addObsoleteHost("filecore\\.co\\.nz\/\\w+","//a[contains(@href,'filecore.co.nz/')]");
			addObsoleteHost("filecore\\.co\/\\w+","//a[contains(@href,'filecore.co/')]");
			addObsoleteHost("fileshare\\.in\\.ua\/\\w+","//a[contains(@href,'fileshare.in.ua/')]");
			addObsoleteHost("firedrive\\.com\/\\w+","//a[contains(@href,'firedrive.com/')]");
			addObsoleteHost("putlocker\\.com\/\\w+","//a[contains(@href,'putlocker.com/')]");
			addObsoleteHost("lumfile\\.com\/\\w+","//a[contains(@href,'lumfile.com/')]");
      addObsoleteHost("lumfile\\.se\/\\w+","//a[contains(@href,'lumfile.se/')]");
      addObsoleteHost("lumfile\\.eu\/\\w+","//a[contains(@href,'lumfile.eu/')]");
			addObsoleteHost("shared\\.com\/\\w+","//a[contains(@href,'www.shared.com/')]");
			addObsoleteHost("stahovadlo\\.cz\/\\w+","//a[contains(@href,'stahovadlo.cz/')]");
			addObsoleteHost("dizzcloud\\.com\/\\w+","//a[contains(@href,'dizzcloud.com/')]");
      addObsoleteHost("ddlstorage\\.com\/\\w+","//a[contains(@href,'ddlstorage.com/')]");
      addObsoleteHost("dataport\\.cz\/\\w+","//a[contains(@href,'dataport.cz/')]");
      addObsoleteHost("daj\\.to\/\\w+","//a[contains(@href,'daj.to/')]");
			addObsoleteHost("sockshare\\.com\/\\w+","//a[contains(@href,'sockshare.com/')]");
			addObsoleteHost("2drive\\.net\/\\w+","//a[contains(@href,'2drive.net/')]");
			addObsoleteHost("bl\\.st\/\\w+","//a[contains(@href,'bl.st/')]");
			addObsoleteHost("uncapped-downloads\\.com\/\\w+","//a[contains(@href,'uncapped-downloads.com/')]");
			addObsoleteHost("freakshare\\.net\/\\w+","//a[contains(@href,'freakshare.net/')]");
			addObsoleteHost("freakshare\\.com\/\\w+","//a[contains(@href,'freakshare.com/')]");
			addObsoleteHost("sharebeast\\.com\/\\w+","//a[contains(@href,'sharebeast.com/')]");
			addObsoleteHost("tufiles\\.ru\/\\w+","//a[contains(@href,'tufiles.ru/')]");
			addObsoleteHost("crisshare\\.com\/\\w+","//a[contains(@href,'crisshare.com/')]");
			addObsoleteHost("ryushare\\.com\/\\w+","//a[contains(@href,'ryushare.com/')]");
			addObsoleteHost("burnupload\\.com\/\\w+","//a[contains(@href,'burnupload.com') or contains(@href,'burnupload.ihiphop.com')]");
			addObsoleteHost("down4files\\.com\/\\w+","//a[contains(@href,'down4files.com/')]");
			addObsoleteHost("edoc\\.com\/\\w+","//a[contains(@href,'edoc.com/')]");
			addObsoleteHost("migahost\\.com\/\\w+","//a[contains(@href,'migahost.com/')]");
			addObsoleteHost("movreel\\.com\/\\w+","//a[contains(@href,'movreel.com/')]");
			addObsoleteHost("newfileland\\.com\/\\w+","//a[contains(@href,'newfileland.com/')]");
			addObsoleteHost("jumbofile\\.net\/\\w+","//a[contains(@href,'jumbofile.net/')]");
			addObsoleteHost("krotix\\.net\/\\w+","//a[contains(@href,'krotix.net/')]");
			addObsoleteHost("cramit\\.in\/\\w+","//a[contains(@href,'cramitin.net') or contains(@href,'cramit.in')]");
			addObsoleteHost("netload\\.in\/\\w+","//a[contains(@href,'netload.in/')]")
			addObsoleteHost("netload\\.me\/\\w+","//a[contains(@href,'netload.me/')]")
			addObsoleteHost("quickshare\\.cz\/\\w+","//a[contains(@href,'quickshare.cz/')]");
			addObsoleteHost("filepost\\.com\/\\w+","//a[contains(@href,'filepost.com/')]");
			addObsoleteHost("fp\\.io\/\\w+","//a[contains(@href,'fp.io/')]");
			addObsoleteHost("uploadhero\\.com\/\\w+","//a[contains(@href,'uploadhero.com/')]");
			addObsoleteHost("uploadhero\\.co\/\\w+","//a[contains(@href,'uploadhero.co/')]");
			addObsoleteHost("inafile\\.com\/\\w+","//a[contains(@href,'inafile.com/')]");
			addObsoleteHost("megairon\\.net\/\\w+","//a[contains(@href,'megairon.net/')]");
			addObsoleteHost("rapidsonic\\.com\/\\w+","//a[contains(@href,'rapidsonic.com/')]");
			addObsoleteHost("fileparadox\\.com\/\\w+","//a[contains(@href,'fileparadox.com/')]");
			addObsoleteHost("fileparadox\\.in\/\\w+","//a[contains(@href,'fileparadox.in/')]");
			addObsoleteHost("linksave\\.in\/\\w+","//a[contains(@href,'linksave.in/')]");
			addObsoleteHost("secured\\.in\/\\w+","//a[contains(@href,'secured.in/')]");
			addObsoleteHost("geupload\\.com\/\\w+","//a[contains(@href,'geupload.com/')]");
			addObsoleteHost("lenfile\\.com\/\\w+","//a[contains(@href,'lenfile.com/')]");
			addObsoleteHost("uploadnet\\.co\/\\w+","//a[contains(@href,'uploadnet.co/')]");
			addObsoleteHost("seenupload\\.com\/\\w+","//a[contains(@href,'seenupload.com/')]");
			addObsoleteHost("180upload\\.com\/\\w+","//a[contains(@href,'180upload.com/')]");
			addObsoleteHost("sangfile\\.com\/\\w+","//a[contains(@href,'sangfile.com/')]");
			addObsoleteHost("filestorm\\.to\/\\w+","//a[contains(@href,'filestorm.to/')]");
			addObsoleteHost("fileover\\.net\/\\w+","//a[contains(@href,'fileover.net/')]");
			addObsoleteHost("4upfiles\\.com\/\\w+","//a[contains(@href,'4upfiles.com/')]");
			addObsoleteHost("elffiles\\.com\/\\w+","//a[contains(@href,'elffiles.com/')]");
			addObsoleteHost("sharingmaster\\.com\/\\w+","//a[contains(@href,'sharingmaster.com/')]");
			addObsoleteHost("fileinz\\.com\/\\w+","//a[contains(@href,'fileinz.com/')]");
			addObsoleteHost("rapidfilehost\\.com\/\\w+","//a[contains(@href,'rapidfilehost.com/')]");
			addObsoleteHost("sanshare\\.com\/\\w+","//a[contains(@href,'sanshare.com/')]");
			addObsoleteHost("storagon\\.com\/\\w+","//a[contains(@href,'storagon.com/')]");
			addObsoleteHost("24uploading\\.com\/\\w+","//a[contains(@href,'24uploading.com/')]");
			addObsoleteHost("fileband\\.com\/\\w+","//a[contains(@href,'fileband.com/')]");
			addObsoleteHost("filecloud\\.cc\/\\w+","//a[contains(@href,'filecloud.cc/')]");
			addObsoleteHost("filecloud\\.io\/\\w+","//a[contains(@href,'filecloud.io/')]");
			addObsoleteHost("filesmelt\\.com\/\\w+","//a[contains(@href,'filesmelt.com/')]");
			addObsoleteHost("goldbytez\\.com\/\\w+","//a[contains(@href,'goldbytez.com/')]");
			addObsoleteHost("hulkshare\\.com\/\\w+","//a[contains(@href,'hulkshare.com/')]");
			addObsoleteHost("idup\\.in\/\\w+","//a[contains(@href,'idup.in/')]");
			addObsoleteHost("loudupload\\.net\/\\w+","//a[contains(@href,'loudupload.net/')]");
			addObsoleteHost("muchshare\\.net\/\\w+","//a[contains(@href,'muchshare.net/')]");
			addObsoleteHost("myupload\\.dk\/\\w+","//a[contains(@href,'myupload.dk/')]");
			addObsoleteHost("nekaka\\.com\/\\w+","//a[contains(@href,'nekaka.com/')]");
			addObsoleteHost("netkups\\.com\/\\w+","//a[contains(@href,'netkups.com/')]");
			addObsoleteHost("plunder\\.com\/\\w+","//a[contains(@href,'plunder.com/')]");
			addObsoleteHost("uploads\\.xxx\/\\w+","//a[contains(@href,'uploads.xxx/')]");
			addObsoleteHost("uploadspace\\.pl\/\\w+","//a[contains(@href,'uploadspace.pl/')]");
			addObsoleteHost("xkeepfile\\.com\/\\w+","//a[contains(@href,'xkeepfile.com/')]");
			addObsoleteHost("abelhas\\.pt\/\\w+","//a[contains(@href,'abelhas.pt/')]");
			addObsoleteHost("allmyvideos\\.net\/\\w+","//a[contains(@href,'allmyvideos.net/')]");
			addObsoleteHost("4up\\.me\/\\w+","//a[contains(@href,'4up.me/')]");
			addObsoleteHost("axifile\\.com\/\\w+","//a[contains(@href,'axifile.com/')]");
			addObsoleteHost("vidspot\\.net\/\\w+","//a[contains(@href,'vidspot.net/')]");
			addObsoleteHost("creafile\\.net\/\\w+","//a[contains(@href,'creafile.net/')]");
			addObsoleteHost("demo.ovh\\.eu\/\\w+","//a[contains(@href,'demo.ovh.eu/')]");
			addObsoleteHost("filesin\\.com\/\\w+","//a[contains(@href,'filesin.com/')]");
			addObsoleteHost("fileswap\\.com\/\\w+","//a[contains(@href,'fileswap.com/')]");
			addObsoleteHost("gulfup\\.com\/\\w+","//a[contains(@href,'gulfup.com/')]");
			addObsoleteHost("hexupload\\.com\/\\w+","//a[contains(@href,'hexupload.com/')]");
			addObsoleteHost("hugefiles\\.net\/\\w+","//a[contains(@href,'hugefiles.net/')]");
			addObsoleteHost("jumbofiles\\.com\/\\w+","//a[contains(@href,'jumbofiles.com/')]");
			addObsoleteHost('(?:u\\d+\\.)?letitbit\\.net\/download\/\\w+',"//a[contains(@href,'letitbit.net/')]");
			addObsoleteHost("lolabits\\.es\/\\w+","//a[contains(@href,'lolabits.es/')]");
			addObsoleteHost("nowdownload\\.ch\/\\w+","//a[contains(@href,'nowdownload.ch/')]");
			addObsoleteHost("openfile\\.ru\/\\w+","//a[contains(@href,'openfile.ru/')]");
			addObsoleteHost("radicalshare\\.com\/\\w+","//a[contains(@href,'radicalshare.com/')]");
			addObsoleteHost("remixshare\\.com\/\\w+","//a[contains(@href,'remixshare.com/')]");
			addObsoleteHost("storefiles\\.co\/\\w+","//a[contains(@href,'storefiles.co/')]");
			addObsoleteHost("toutbox\\.fr\/\\w+","//a[contains(@href,'toutbox.fr/')]");
			addObsoleteHost("uploadbaz\\.com\/\\w+","//a[contains(@href,'uploadbaz.com/')]");
			addObsoleteHost("uploadingit\\.com\/\\w+","//a[contains(@href,'uploadingit.com/')]");
			addObsoleteHost("verzend\\.be\/\\w+","//a[contains(@href,'verzend.be/')]");
			addObsoleteHost("vidplay\\.net\/\\w+","//a[contains(@href,'vidplay.net/')]");
			addObsoleteHost("vidxden\\.com\/\\w+","//a[contains(@href,'vidxden.com/')]");
			addObsoleteHost("xfileload\\.com\/\\w+","//a[contains(@href,'xfileload.com/')]");
			addObsoleteHost("warped\\.co\/\\w+","//a[contains(@href,'warped.co/')]");
			addObsoleteHost("secureupload\\.eu\/\\w+","//a[contains(@href,'secureupload.eu/')]");
			addObsoleteHost("junocloud\\.me\/\\w+","//a[contains(@href,'junocloud.me/')]");
			addObsoleteHost("cloudzilla\\.to\/\\w+","//a[contains(@href,'cloudzilla.to/')]");
			addObsoleteHost("uploading\\.com\/\\w+","//a[contains(@href,'uploading.com/')]");
			addObsoleteHost("black-label\\.pro\/\\w+","//a[contains(@href,'black-label.pro/')]");
			addObsoleteHost("neodrive\\.co\/\\w+","//a[contains(@href,'neodrive.co/')]");
			addObsoleteHost("uplea\\.com\/\\w+","//a[contains(@href,'uplea.com/')]");
			addObsoleteHost("vodlocker\\.com\/\\w+","//a[contains(@href,'vodlocker.com/')]");
			addObsoleteHost("rockfile\\.eu\/\\w+","//a[contains(@href,'rockfile.eu/')]");
			addObsoleteHost("uploadable\\.ch\/\\w+","//a[contains(@href,'uploadable.ch/')]");
			addObsoleteHost("datoteke\\.com\/\\w+","//a[contains(@href,'datoteke.com/')]");
			addObsoleteHost("uploadrocket\\.net\/\\w+","//a[contains(@href,'uploadrocket.net/')]");
			addObsoleteHost("usersfiles\\.com\/\\w+","//a[contains(@href,'usersfiles.com/')]");
			addObsoleteHost("megarapid\\.cz\/\\w+","//a[contains(@href,'megarapid.cz/')]");
			addObsoleteHost("depfile\\.com\/\\w+","//a[contains(@href,'depfile.com/')]");
      addObsoleteHost("depfile\\.us\/\\w+","//a[contains(@href,'depfile.us/')]");
      addObsoleteHost("dipfile\\.com\/\\w+","//a[contains(@href,'dipfile.com/')]");
      addObsoleteHost("ssh\\.tf\/\\w+","//a[contains(@href,'ssh.tf/')]");
      addObsoleteHost("ssh\\.yt\/\\w+","//a[contains(@href,'ssh.yt/')]");
      addObsoleteHost("led\\.wf\/\\w+","//a[contains(@href,'led.wf/')]");
      addObsoleteHost("lan\\.wf\/\\w+","//a[contains(@href,'lan.wf/')]");
      addObsoleteHost("adlink\\.tf\/\\w+","//a[contains(@href,'adlink.tf/')]");
      addObsoleteHost("click\\.tf\/\\w+","//a[contains(@href,'click.tf/')]");
      addObsoleteHost("yep\\.pm\/\\w+","//a[contains(@href,'yep.pm/')]");
      addObsoleteHost("kyc\\.pm\/\\w+","//a[contains(@href,'kyc.pm/')]");
			addObsoleteHost("crazyshare\\.cc\/\\w+","//a[contains(@href,'crazyshare.cc/')]");
			addObsoleteHost("Jeodrive\\.com\/\\w+","//a[contains(@href,'Jeodrive.com/')]");
			addObsoleteHost("suprafiles\\.net\/\\w+","//a[contains(@href,'suprafiles.net/')]");
      addObsoleteHost("suprafiles\\.co\/\\w+","//a[contains(@href,'suprafiles.co/')]");
      addObsoleteHost("suprafiles\\.org\/\\w+","//a[contains(@href,'suprafiles.org/')]");
      addObsoleteHost("suprafiles\\.me\/\\w+","//a[contains(@href,'suprafiles.me/')]");
      addObsoleteHost("srfiles\\.com\/\\w+","//a[contains(@href,'suprafiles.com/')]");
      addObsoleteHost("sfiles\\.me\/\\w+","//a[contains(@href,'sfiles.me/')]");
			addObsoleteHost("filesflash\\.com\/\\w+","//a[contains(@href,'filesflash.com/')]");
			addObsoleteHost("filesflash\\.net\/\\w+","//a[contains(@href,'filesflash.net/')]");
			addObsoleteHost("ifile\\.it\/\\w+","//a[contains(@href,'ifile.it/')]");
			addObsoleteHost("lix\\.in\/\\w+","//a[contains(@href,'lix.in/')]");
			addObsoleteHost("datafile\\.com\/\\w+","//a[contains(@href,'datafile.com/')]");
			addObsoleteHost("magic4up\\.com\/\\w+","//a[contains(@href,'magic4up.com/')]");
			addObsoleteHost("ayefiles\\.com\/\\w+","//a[contains(@href,'ayefiles.com/')]");
			addObsoleteHost("k-upload\\.com\/\\w+","//a[contains(@href,'k-upload.com/')]");
			addObsoleteHost("k-upload\\.fr\/\\w+","//a[contains(@href,'k-upload.fr/')]");
			addObsoleteHost("ncrypt\\.in\/\\w+","//a[contains(@href,'ncrypt.in/')]");
			addObsoleteHost("openload\\.io\/\\w+","//a[contains(@href,'openload.io/')]");
      addObsoleteHost("openload\\.co\/\\w+","//a[contains(@href,'openload.co/')]");
      addObsoleteHost("oload\\.net\/\\w+","//a[contains(@href,'oload.net/')]");
      addObsoleteHost("oload\\.stream\/\\w+","//a[contains(@href,'oload.stream/')]");
      addObsoleteHost("oload\\.tv\/\\w+","//a[contains(@href,'oload.tv/')]");
			addObsoleteHost("share-online\\.biz\/\\w+","//a[contains(@href,'share-online.biz/')]");
      addObsoleteHost("egoshare\\.com\/\\w+","//a[contains(@href,'egoshare.com/')]");
			addObsoleteHost("euroshare\\.eu\/\\w+","//a[contains(@href,'euroshare.eu/')]");
			addObsoleteHost("stiahni\\.si\/\\w+","//a[contains(@href,'stiahni.si/')]");
      addObsoleteHost("firstplanet\\.eu\/\\w+","//a[contains(@href,'firstplanet.eu/')]");
			addObsoleteHost("bitster\\.cz\/\\w+","//a[contains(@href,'bitster.cz/')]");
			addObsoleteHost("therapide\\.com\/\\w+","//a[contains(@href,'therapide.com/')]");
			addObsoleteHost("ulozisko\\.sk\/\\w+","//a[contains(@href,'ulozisko.sk/')]");
			addObsoleteHost("superbshare\\.com\/\\w+","//a[contains(@href,'superbshare.com/')]");
			addObsoleteHost("multiload\\.cz\/\\w+","//a[contains(@href,'multiload.cz/')]");
			addObsoleteHost("drop\\.me\/\\w+","//a[contains(@href,'/drop.me/')]");
			addObsoleteHost("letsupload\\.co\/\\w+","//a[contains(@href,'letsupload.co/')]");
      addObsoleteHost("letsupload\\.cc\/\\w+","//a[contains(@href,'letsupload.cc/')]");
			addObsoleteHost("bezvadata\\.cz\/\\w+","//a[contains(@href,'bezvadata.cz/')]");
			addObsoleteHost("2downloadz\\.com\/\\w+","//a[contains(@href,'2downloadz.com/')]");
addObsoleteHost("2giga\\.link\/\\w+","//a[contains(@href,'2giga.link/')]");
addObsoleteHost("4file\\.net\/\\w+","//a[contains(@href,'4file.net/')]");
addObsoleteHost("4upld\\.com\/\\w+","//a[contains(@href,'4upld.com/')]");
addObsoleteHost("700files\\.com\/\\w+","//a[contains(@href,'700files.com/')]");
addObsoleteHost("acefile\\.net\/\\w+","//a[contains(@href,'acefile.net/')]");
addObsoleteHost("aisfile\\.com\/\\w+","//a[contains(@href,'aisfile.com/')]");
addObsoleteHost("akafile\\.com\/\\w+","//a[contains(@href,'akafile.com/')]");
addObsoleteHost("alltu\\.eu\/\\w+","//a[contains(@href,'alltu.eu/')]");
addObsoleteHost("amonshare\\.com\/\\w+","//a[contains(@href,'amonshare.com/')]");
addObsoleteHost("arabloads\\.net\/\\w+","//a[contains(@href,'arabloads.net/')]");
addObsoleteHost("avatarshare\\.com\/\\w+","//a[contains(@href,'avatarshare.com/')]");
addObsoleteHost("bankupload\\.com\/\\w+","//a[contains(@href,'bankupload.com/')]");
addObsoleteHost("bigfile\\.to\/\\w+","//a[contains(@href,'bigfile.to/')]");
addObsoleteHost("amonshare\\.com\/\\w+","//a[contains(@href,'amonshare.com/')]");
addObsoleteHost("bitshare\\.com\/\\w+","//a[contains(@href,'bitshare.com/')]");
addObsoleteHost("bittfox\\.com\/\\w+","//a[contains(@href,'bittfox.com/')]");
addObsoleteHost("borncash\\.org\/\\w+","//a[contains(@href,'borncash.org/')]");
addObsoleteHost("bytewhale\\.com\/\\w+","//a[contains(@href,'bytewhale.com/')]");
addObsoleteHost("catshare\\.net\/\\w+","//a[contains(@href,'catshare.net/')]");
addObsoleteHost("cloudshares\\.net\/\\w+","//a[contains(@href,'cloudshares.net/')]");
addObsoleteHost("cloudsix\\.me\/\\w+","//a[contains(@href,'cloudsix.me/')]");
addObsoleteHost("cloudstor\\.es\/\\w+","//a[contains(@href,'cloudstor.es/')]");
addObsoleteHost("cloudtime\\.to\/\\w+","//a[contains(@href,'cloudtime.to/')]");
addObsoleteHost("cloudyfiles\\.com\/\\w+","//a[contains(@href,'cloudyfiles.com/')]");
addObsoleteHost("dailyfiles\\.net\/\\w+","//a[contains(@href,'dailyfiles.net/')]");
addObsoleteHost("debrid\\.pl\/\\w+","//a[contains(@href,'debrid.pl/')]");
addObsoleteHost("dir50\\.net\/\\w+","//a[contains(@href,'dir50.net/')]");
addObsoleteHost("divxpress\\.com\/\\w+","//a[contains(@href,'divxpress.com/')]");
addObsoleteHost("easy-share\\.com\/\\w+","//a[contains(@href,'easy-share.com/')]");
addObsoleteHost("exbit\\.net\/\\w+","//a[contains(@href,'exbit.net/')]");
addObsoleteHost("exclusiveloader\\.com\/\\w+","//a[contains(@href,'exclusiveloader.com/')]");
addObsoleteHost("exoshare\\.com\/\\w+","//a[contains(@href,'exoshare.com/')]");
addObsoleteHost("eyesfile\\.ca\/\\w+","//a[contains(@href,'eyesfile.ca/')]");
addObsoleteHost("filehoot\\.com\/\\w+","//a[contains(@href,'filehoot.com/')]");
addObsoleteHost("gettyfile\\.ru\/\\w+","//a[contains(@href,'gettyfile.ru/')]");
addObsoleteHost("gigasize\\.com\/\\w+","//a[contains(@href,'gigasize.com/')]");
addObsoleteHost("go4up\\.com\/\\w+","//a[contains(@href,'go4up.com/')]");
addObsoleteHost("gorillavid\\.in\/\\w+","//a[contains(@href,'gorillavid.in/')]");
addObsoleteHost("hulkload\\.com\/\\w+","//a[contains(@href,'hulkload.com/')]");
addObsoleteHost("ifolder\\.ru\/\\w+","//a[contains(@href,'ifolder.ru/')]");
addObsoleteHost("jeodrive\\.com\/\\w+","//a[contains(@href,'jeodrive.com/')]");
addObsoleteHost("kb.simple-aja\\.info\/\\w+","//a[contains(@href,'kb.simple-aja.info/')]");
addObsoleteHost("kingfile\\.pl\/\\w+","//a[contains(@href,'kingfile.pl/')]");
addObsoleteHost("kingfiles\\.net\/\\w+","//a[contains(@href,'kingfiles.net/')]");
addObsoleteHost("kumpulbagi\\.com\/\\w+","//a[contains(@href,'kumpulbagi.com/')]");
addObsoleteHost("lafiles\\.com\/\\w+","//a[contains(@href,'lafiles.com/')]");
addObsoleteHost("load\\.to\/\\w+","//a[contains(@href,'load.to/')]");
addObsoleteHost("mafiastorage\\.com\/\\w+","//a[contains(@href,'mafiastorage.com/')]");
addObsoleteHost("media4up\\.com\/\\w+","//a[contains(@href,'media4up.com/')]");
addObsoleteHost("megafiles\\.us\/\\w+","//a[contains(@href,'megafiles.us/')]");
addObsoleteHost("megafileupload\\.com\/\\w+","//a[contains(@href,'megafileupload.com/')]");
addObsoleteHost("minhateca(?:\\.com)?\\.br\/\\w+","//a[contains(@href,'minhateca.com.br/')]");
addObsoleteHost("mixturecloud\\.com\/\\w+","//a[contains(@href,'mixturecloud.com/')]");
addObsoleteHost("movpod\\.in\/\\w+","//a[contains(@href,'movpod.in/')]");
addObsoleteHost("nosupload\\.com\/\\w+","//a[contains(@href,'nosupload.com/')]");
addObsoleteHost("novamov\\.com\/\\w+","//a[contains(@href,'novamov.com/')]");
addObsoleteHost("nowvideo\\.sx\/\\w+","//a[contains(@href,'nowvideo.sx/')]");
addObsoleteHost("owndrives\\.com\/\\w+","//a[contains(@href,'owndrives.com/')]");
addObsoleteHost("ozofiles\\.com\/\\w+","//a[contains(@href,'ozofiles.com/')]");
addObsoleteHost("partage-facile\\.com\/\\w+","//a[contains(@href,'partage-facile.com/')]");
addObsoleteHost("pobierz\\.to\/\\w+","//a[contains(@href,'pobierz.to/')]");
addObsoleteHost("queenshare\\.com\/\\w+","//a[contains(@href,'queenshare.com/')]");
addObsoleteHost("rioupload\\.com\/\\w+","//a[contains(@href,'rioupload.com/')]");
addObsoleteHost("rodfile\\.com\/\\w+","//a[contains(@href,'rodfile.com/')]");
addObsoleteHost("rusfolder\\.com\/\\w+","//a[contains(@href,'rusfolder.com/')]");
addObsoleteHost("stagevu\\.com\/\\w+","//a[contains(@href,'stagevu.com/')]");
addObsoleteHost("streamin\\.to\/\\w+","//a[contains(@href,'streamin.to/')]");
addObsoleteHost("temp-share\\.com\/\\w+","//a[contains(@href,'temp-share.com/')]");
addObsoleteHost("thefile\\.me\/\\w+","//a[contains(@href,'thefile.me/')]");
addObsoleteHost("thevideo\\.me\/\\w+","//a[contains(@href,'thevideo.me/')]");
addObsoleteHost("tikfile\\.com\/\\w+","//a[contains(@href,'tikfile.com/')]");
addObsoleteHost("vidbull\\.com\/\\w+","//a[contains(@href,'vidbull.com/')]");
addObsoleteHost("videoweed\\.es\/\\w+","//a[contains(@href,'videoweed.es/')]");
addObsoleteHost("vidzi\\.tv\/\\w+","//a[contains(@href,'vidzi.tv/')]");
addObsoleteHost("vshare\\.io\/\\w+","//a[contains(@href,'vshare.io/')]");
addObsoleteHost("wizupload\\.com\/\\w+","//a[contains(@href,'wizupload.com/')]");
addObsoleteHost("xshare\\.eu\/\\w+","//a[contains(@href,'xshare.eu/')]");
addObsoleteHost("zapfile\\.net\/\\w+","//a[contains(@href,'zapfile.net/')]");
addObsoleteHost("ziddu\\.com\/\\w+","//a[contains(@href,'ziddu.com/')]");
addObsoleteHost("zxcfiles\\.com\/\\w+","//a[contains(@href,'zxcfiles.com/')]");
addObsoleteHost("ul\\.to\/\\w+","//a[contains(@href,'ul.to/')]");
addObsoleteHost("uploaded\\.to\/\\w+","//a[contains(@href,'uploaded.to/')]");
addObsoleteHost("uploaded\\.net\/\\w+","//a[contains(@href,'uploaded.net/')]");
addObsoleteHost("oboom\\.com\/\\w+","//a[contains(@href,'oboom.com/')]");
addObsoleteHost("fileflares\\.com\/\\w+","//a[contains(@href,'fileflares.com/')]");
addObsoleteHost("kolombox\\.com\/\\w+","//a[contains(@href,'kolombox.com/')]");
addObsoleteHost("grandshare\\.net\/\\w+","//a[contains(@href,'grandshare.net/')]");
addObsoleteHost("sharefiles\\.com\/\\w+","//a[contains(@href,'sharefiles.com/')]");
addObsoleteHost("faststore\\.org\/\\w+","//a[contains(@href,'faststore​.org/')]");
addObsoleteHost("zippyshare\\.com\/\\w+","//a[contains(@href,'zippyshare.com/')]");
addObsoleteHost("hellshare\\.cz\/\\w+","//a[contains(@href,'hellshare.cz/')]");
addObsoleteHost("hellshare\\.sk\/\\w+","//a[contains(@href,'hellshare.sk/')]");
addObsoleteHost("hellshare\\.com\/\\w+","//a[contains(@href,'hellshare.com/')]");
addObsoleteHost("hellspy\\.com\/\\w+","//a[contains(@href,'hellspy.com/')]");
addObsoleteHost("hellspy\\.cz\/\\w+","//a[contains(@href,'hellspy.cz/')]");
addObsoleteHost("stiahnito\\.sk\/\\w+","//a[contains(@href,'stiahnito.sk/')]");
addObsoleteHost("ninefile\\.com\/\\w+","//a[contains(@href,'ninefile.com')]");
addObsoleteHost("download.cz.hellshare\\.com\/\\w+","//a[contains(@href,'download.cz.hellshare.com/')]");
addObsoleteHost("download.hellshare\\.cz\/\\w+","//a[contains(@href,'download.hellshare.cz/')]");
addObsoleteHost("download.hellshare\\.sk\/\\w+","//a[contains(@href,'download.hellshare.sk/')]");
addObsoleteHost("wrzucajpliki\\.pl\/\\w+","//a[contains(@href,'wrzucajpliki.pl/')]");
addObsoleteHost("solidfiles\\.com\/\\w+","//a[contains(@href,'solidfiles.com/')]");
addObsoleteHost("bayfiles\\.com\/\\w+","//a[contains(@href,'bayfiles.com/')]");
addObsoleteHost("wupfile\\.com\/\\w+","//a[contains(@href,'wupfile.com/')]");
addObsoleteHost("upx\\.nz\/\\w+","//a[contains(@href,'upx.nz/')]");
addObsoleteHost("frdl\\.to\/\\w+","//a[contains(@href,'frdl.to/')]");
addObsoleteHost("frdl\\.pw\/\\w+","//a[contains(@href,'frdl.pw/')]");
addObsoleteHost("unibytes\\.com\/\\w+","//a[contains(@href,'unibytes.com/')]");
addObsoleteHost("datafilehost\\.com\/\\w+","//a[contains(@href,'datafilehost.com/')]");
addObsoleteHost("ge\\.tt\/\\w+","//a[contains(@href,'ge.tt/')]");
addObsoleteHost("filesin\\.space\/\\w+","//a[contains(@href,'filesin.space/')]");
addObsoleteHost("anonfiles\\.com\/\\w+","//a[contains(@href,'anonfiles.com/')]");
addObsoleteHost("file\\.bz\/\\w+","//a[contains(@href,'file.bz/')]");
addObsoleteHost("filescdn\\.com\/\\w+","//a[contains(@href,'filescdn.com/')]");
addObsoleteHost("filescdn\\.net\/\\w+","//a[contains(@href,'filescdn.net/')]");
addObsoleteHost("ortofiles\\.com\/\\w+","//a[contains(@href,'ortofiles.com/')]");
addObsoleteHost("dropapk\\.com\/\\w+","//a[contains(@href,'dropapk.com/')]");
addObsoleteHost("dropapk\\.to\/\\w+","//a[contains(@href,'dropapk.to/')]");
addObsoleteHost("tusfiles\\.com\/\\w+","//a[contains(@href,'tusfiles.com/')]");
addObsoleteHost("tusfiles\\.net\/\\w+","//a[contains(@href,'tusfiles.net/')]");
addObsoleteHost("uploadex\\.com\/\\w+","//a[contains(@href,'uploadex.com/')]");
addObsoleteHost("userscloud\\.com\/\\w+","//a[contains(@href,'userscloud.com/')]");
addObsoleteHost("uploads\\.ws\/\\w+","//a[contains(@href,'uploads.ws') or contains(@href,'upl.me')]");
			        // obsolete start			start2
		}
		//obsolete file hosts init end

		//Add Host Example

/*				if (GM_getValue("Check_datafile_dot_com_links", false))
		{
			addFileHost(
			"datafile\.com\/\\w+",
			'var captchaPanel|<link href="/css/files_download.css"',
			'ErrorCode|ErrorCode 0: Invalid Link|btn-orange" href="#"',
			'You are downloading another file at this moment|You exceeded your free|Site Maintenance',
			'<style type="text/css">',
			"//a[contains(@href,'datafile.com')]",
			true);
		} */

		function addFileHost(linkRegex, isAliveRegex, isDeadRegex, isUnavaRegex, ispremRegex, xpathEx, tryLoop)
		{
			var host = new Array(7);
			host[0] = linkRegex;
			host[1] = isAliveRegex;
			host[2] = isDeadRegex;
			host[3] = isUnavaRegex;
			host[6] = ispremRegex;
			host[4] = xpathEx;
			tryLoop ? host[5] = true : host[5] = false;
			http_file_hosts.push(host);
		}
		if (GM_getValue("Check_safelinking_dot_net_links", false))
		{
			addFileHost(
			"safelinking\\.net\/p\/\\w+",
			'color:green;"',
			'color:(?:red|orange);"',
			'color:(?:grey|brown);"',
			'optional2--',
			"//a[contains(@href,'safelinking.net/p/')]",
			true);
		}
		if (GM_getValue("Check_fastshare_dot_cz_links", false))
		{
			addFileHost(
			"fastshare\.cz",
			'dwntable">|id="free-trigger|během 5s budete přesměrováni na',
			'This file is no longer available|Soubor byl smazán|Plik został usunięty na życzenie właściciela praw autorskich|Tento súbor už nie je dostupný|Tento soubor již není dostupný|file has been deleted|website is not available from your country',
			'optional--',
			'optional2--',
			"//a[contains(@href,'fastshare.cz')]");
		}
        if (GM_getValue("Check_fastshare_dot_live_links", false))
		{
			addFileHost(
			"fastshare\.live",
			'dwntable">|id="free-trigger|během 5s budete přesměrováni na',
			'This file is no longer available|Soubor byl smazán|Plik został usunięty na życzenie właściciela praw autorskich|Tento súbor už nie je dostupný|Tento soubor již není dostupný|file has been deleted|website is not available from your country',
			'optional--',
			'optional2--',
			"//a[contains(@href,'fastshare.live')]");
		}
        if (GM_getValue("Check_fastshare_dot_cloud_links", false))
		{
			addFileHost(
			"fastshare\.cloud",
			'dwntable">|id="free-trigger|během 5s budete přesměrováni na',
			'This file is no longer available|Soubor byl smazán|Plik został usunięty na życzenie właściciela praw autorskich|Tento súbor už nie je dostupný|Tento soubor již není dostupný|file has been deleted|website is not available from your country',
			'optional--',
			'optional2--',
			"//a[contains(@href,'fastshare.cloud')]");
		}
		if (GM_getValue("Check_fastshare_dot_org_links", false))
		{
			addFileHost(
			"[fF]ast[sS]hare\\.org\/download",
			'Download ">',
			'Diese Datei wurde wegen|wurde kein Dateiname',
			'optional--',
			'optional2--',
			"//a[contains(@href,'fastshare.org/download') or contains(@href,'FastShare.org/download')]");
		}
		if (GM_getValue("Check_rapidgator_dot_net_links", false))
		{
			addFileHost(
			"(?:rapidgator\\.net|rg\\.to)\/\\w+",
			'    </div>                    <table>|hourly downloads limit|Delay between downloads must be|reached your daily downloads limit|You have reached quota of downloaded information|You can download only your own files',
			'Error 404|Fil ikke fundet|Ficheiro não encontrado|Arquivo não encontrado|找不到檔案|ファイルが見つかりませんでした|未发现文件|Soubor nenalezen|Bestand niet gevonden|Nie znaleziono pliku|File non trovato|Datei nicht gefunden|File not found|Error 500|Файл не найден|ファイルが探せませんでした|Fichier non trouvé|Archivo no encontrado|Select your plan|Fichier introuvable|File not found',
			'optional--',
			'Buy for|can be downloaded by premium only|downloaded only by subscribers|up to 5 GB in free mode|Denne fil kan kun downloades af Premium-brugere|la taille maximale des fichiers téléchargeables est de 1 GB|baixar arquivos de até 1 GB no modo gratuito|ficheiros até 1 GB no modo gratuito|Este ficheiro só pode ser transferido por utilizadores Premium|该文件仅限高级用户下载|files up to 500 MB in free mode|Este arquivo pode ser baixado apenas por usuários Premium|up to 400 MB in free|You can download files up to 2 GB in free mode|files up to 1 GB in free mode|Ce fichier peut être téléchargé par des utilisateurs Premium uniquement|Diese Datei kann nur von Premium Benutzern heruntergeladen werden|Este archivo solo se puede descargar con una cuenta Premium|Questo file può essere scaricato solo dagli utenti Premium|Данный файл может быть скачен только премиум-пользователем|Plik ten może być pobrany wyłącznie przez użytkowników opcji Premium|Dit bestand kan alleen worden gedownload door Premium-gebruikers|Tento soubor lze stáhnout pouze uživatelé s účtem Premium|只有 Premium 使用者可以下載此檔案|このファイルは、プレミアムアカウントのユーザーのみダウンロードすることができます|En mode gratuit, la taille maximale des fichiers téléchargeables est de 2 GB',
			"//a[contains(@href,'rapidgator.net') or contains(@href,'rg.to')]");
		}
		if (GM_getValue("Check_relink_dot_us_links", false))
		{
			addFileHost(
			"relink\\.us\/(?:f\/\\w+|go\\.php\\?id=\\d+|view\\.php\\?id=\\d+)",
			'online_detail\\.png" alt="Status',
			'(?:offline|partially)_detail\\.png" alt="Status|File deleted',
			'unknown_detail\\.png" alt="Status',
			'optional2--',
			"//a[contains(@href,'relink.us/')]"
			);
		}
		if (GM_getValue("Check_uploadstube_dot_de_links", false))
		{
			addFileHost(
			"uploadstube\\.de\/download\\.php\\?file=\\d+",
			'div id="dl"',
			'Sie haben den Link falsch',
			'optional--',
			'optional2--',
			"//a[contains(@href,'uploadstube.de/download.php?file=')]"
			);
		}
		if (GM_getValue("Check_flyfiles_dot_net_links", false))
		{
			addFileHost(
			"flyfiles\\.net\/\\w+",
			'download_button"|"Download file"',
			'File not found!|Файл не найден',
			'optional--',
			'optional2--',
			"//a[contains(@href,'flyfiles.net/')]"
			);
		}
		if (GM_getValue("Check_wikiupload_dot_com_links", false))
		{
			addFileHost(
			"wikiupload\\.com\/\\w+",
			'download-button">',
			'Sorry, File not found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'wikiupload.com/')]"
			);
		}
		if (GM_getValue("Check_hostuje_dot_net_links", false))
		{
			addFileHost(
			"hostuje\\.net\/file\\.php\\?id=\\w+",
			'file\\.php">|Pobierz Plik',
			'Podany plik nie zosta',
			'optional--',
			'optional2--',
			"//a[contains(@href,'hostuje.net/file')]"
			);
		}
		if (GM_getValue("Check_turbobit_dot_ru_links", false))
		{
			addFileHost(
			"(?:turbob1t|failoobmenik|filesmail|firebit|dlbit|files\\.china\\-gsm|3aka4aem|file\\.piratski|mnogofiles|links-free|turbo-bit|turbosfiles)\\.\\w+\/\\w+",
			'download\\-file">',
			'col-1">\\s*<h1>',
			'optional--',
			'optional2--',
			"//a[contains(@href,'turbobit.ru/')  or contains(@href,'filesmail.ru/') or contains(@href,'failoobmenik.ru/')"+
			" or contains(@href,'firebit.in/') or contains(@href,'dlbit.net/') or contains(@href,'files.china-gsm.ru/') or contains(@href,'3aka4aem.ru/')"+
			" or contains(@href,'file.piratski.ru/') or contains(@href,'mnogofiles.com/') or contains(@href,'links-free.ru/')"+
			" or contains(@href,'turbo-bit.ru/') or contains(@href,'turbosfiles.ru/')]"
			);
		}
		if (GM_getValue("Check_data_dot_hu_links", false))
		{
			addFileHost(
			"data\\.hu",
			'download_box_button|Lassú letöltés',
			'missing\\.php|Az adott fájl nem létezik',
			'optional--',
			'optional2--',
			"//a[contains(@href,'data.hu')]",
			true
			);
		}
		if (GM_getValue("Check_indowebster_dot_com_links", false))
		{
			addFileHost(
			"(?:files\\.)?indowebster\\.com\/download\/\\w+\/",
			'premiumBtn"',
			'errorMessage"',
			'optional--',
			'optional2--',
			"//a[contains(@href,'indowebster.com/download')]"
			);
		}
		if (GM_getValue("Check_superload_dot_cz_links", false))
		{
			addFileHost(
			"superload\\.cz\/dl\/\\w+",
			'icon-download">',
			'soubor nebyl nalezen',
			'optional--',
			'optional2--',
			"//a[contains(@href,'superload.cz/dl')]"
			);
		}
		if (GM_getValue("Check_hulkfile_dot_eu_links", false))
		{
			addFileHost(
			"(?:w\\.hulkfile\\.com|hulkfile\\.eu)\/\\w+",
			'op" value="download',
			'class="err">|width:500px;text-align:left;">',
			'optional--',
			'optional2--',
			"//a[contains(@href,'hulkfile.')]"
			);
		}
		if (GM_getValue("Check_easybytez_dot_com_links", false))
		{
			addFileHost(
			"easybytez\\.com\/\\w+",
			'op" value="download',
			'stop_error\\.gif',
			'optional--',
			'optional2--',
			"//a[contains(@href,'easybytez.com/')]"
			);
		}
        if (GM_getValue("Check_easybytez_dot_eu_links", false))
		{
			addFileHost(
			"easybytez\\.eu\/\\w+",
			'op" value="download',
			'stop_error\\.gif',
			'optional--',
			'optional2--',
			"//a[contains(@href,'easybytez.eu/')]"
			);
		}
		if (GM_getValue("Check_filestore_dot_com_dot_ua_links", false))
		{
			addFileHost(
			"filestore\\.com\\.ua\/\\?d=\\w+",
			'tdrow1>',
			'class=warn',
			'optional--',
			'optional2--',
			"//a[contains(@href,'filestore.com.ua/?d=')]"
			);
		}
   	if (GM_getValue("Check_extmatrix_dot_com_links", false))
		{
			addFileHost(
			"extmatrix\\.com\/files\/\\w+",
			'div class="success"',
			'div class="error"',
			'optional--',
			'optional2--',
			"//a[contains(@href,'extmatrix.com/files')]"
			);
		}
		if (GM_getValue("Check_sendfiles_dot_nl_links", false))
		{
			addFileHost(
			"sendfiles\\.nl\/download.aspx\\?ID=\\w+",
			'content_lnkDownload',
			'error\\.aspx\\?',
			'optional--',
			'optional2--',
			"//a[contains(@href,'sendfiles.nl/download.aspx')]"
			);
		}
		if (GM_getValue("Check_yourfilestore_dot_com_links", false))
		{
			addFileHost(
			"yourfilestore\\.com\/download\/\\d+\/",
			'download_data">',
			'may have been deleted|<h1>Sorry!<\/h1>',
			'optional--',
			'optional2--',
			"//a[contains(@href,'yourfilestore.com/download')]"
			);
		}
		if (GM_getValue("Check_filebig_dot_net_links", false))
		{
			addFileHost(
			"filebig\\.net\/files\/\\w+",
			'downloadFile">',
			'<p>File not found<\/p>',
			'optional--',
			'optional2--',
			"//a[contains(@href,'filebig.net/files')]"
			);
		}
		if (GM_getValue("Check_gamefront_dot_com_links", false))
		{
			addFileHost(
			"files\\.filefront\\.com\/\/;\\d+;;",
			'downloadLink">',
			'File not found, you',
			'optional--',
			'optional2--',
			"//a[contains(@href,'files.filefront.com')]"
			);

			addFileHost(
			"gamefront\\.com\/files\/\\d+",
			'downloadLink">',
			'File not found, you',
			'optional--',
			'optional2--',
			"//a[contains(@href,'gamefront.com/files')]"
			);
		}
		if (GM_getValue("Check_hyperfileshare_dot_com_links", false))
		{
			addFileHost(
			"(?:download\\.|)hyperfileshare\\.com\/(?:download\\.php\\?code=|d\/)\\w+",
			'dnlLnk"',
			'already been deleted',
			'optional--',
			'optional2--',
			"//a[contains(@href,'hyperfileshare.com/download') or contains(@href,'hyperfileshare.com/d')]"
			);
		}
		if (GM_getValue("Check_hellupload_dot_com_links", false))
		{
			addFileHost(
			"hellupload\\.com\/\\w+",
			'<h3>Download File<br',
			'id="podstrona">|AVOID_IE_BUG',
			'optional--',
			'optional2--',
			"//a[contains(@href,'hellupload.com/')]"
			);
		}
		if (GM_getValue("Check_free_dash_uploading_dot_com_links", false))
		{
			addFileHost(
			"free\\-uploading\\.com\/\\w+",
			'op" value="download',
			'class="err">|width:500px;text-align:left;">',
			'optional--',
			'optional2--',
			"//a[contains(@href,'free-uploading.com/')]"
			);
		}
		if (GM_getValue("Check_fileape_dot_com_links", false))
		{
			addFileHost(
			"fileape\\.com\/download\\-",
			'button_dl\\.png',
			'does not exist\\.',
			'optional--',
			'optional2--',
			"//a[contains(@href,'fileape.com/')]"
			);
		}
		if (GM_getValue("Check_uppit_dot_com_links", false))
		{
			addFileHost(
			"(?:uppit\\.com|up\\.ht|upx\\.nz)\/\\w+",
			'op" value="download',
			'class="err">|style="width:500px;text-align:left;"|fish-404\\.png"',
			'optional--',
			'optional2--',
			"//a[contains(@href,'up.ht/') or contains(@href,'uppit.com/') or contains(@href,'upx.nz/')]",
			true
			);
		}
		if (GM_getValue("Check_turbobit_dot_net_links", false)) //folders
		{
			addFileHost(
			"turbobit\\.(?:net|pl)\/download\/folder\/\\d+",
			'col-1">\\s*<s',
			'col-1">\\s*<h',
			'optional--',
			'optional2--',
			"//a[contains(@href,'turbobit.') and contains(@href,'download/folder')]"
			);
		}
		if (GM_getValue("Check_turbobit_dot_net_links", false))
		{
			addFileHost(
			"turbobit\\.(?:net|pl)",
			'id="download-gate-info|id="file-list|class="word">downloading',
			'afterWait()|no files in this folder|File was deleted or not found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'turbobit.net')]",
            true
			);
		}
    if (GM_getValue("Check_hitfile_dot_net_links", false)) //folders
		{
			addFileHost(
			"hitfile\\.net\/download\/folder\/\\d+",
			'content">\\s*<s',
			'content">\\s*<h',
			'optional--',
      'optional2--',
			"//a[contains(@href,'hitfile.net/download/folder')]"
			);
		}
		if (GM_getValue("Check_movshare_dot_net_links", false))
		{
			addFileHost(
			"movshare\\.net\\/video\\/\\w+",
			'optional--"',
			'no longer exists',
			'optional--',
			'optional2--',
			"//a[contains(@href,'movshare.net/video')]"
			);
		}
   	    if (GM_getValue("Check_rghost_dot_net_links", false))
		{
			addFileHost(
			"rghost\.(?:net|ru)\/(?:|private\/)\\d+",
			'download_link|btn large download',
			'file is restricted|File is deleted|503 Service Unavailable',
			'optional--',
			'optional2--',
			"//a[contains(@href,'rghost.')]"
			);
		}
		if (GM_getValue("Check_xdisk_dot_cz_links", false))
		{
			addFileHost(
			"xdisk\\.cz\/(?:..\/)?download\\.php\\?id=\\w+",
			'">Staženo:\\s*<\/span>',
			'Soubor, který hledáte nenalezen',
			'optional--',
			'optional2--',
			"//a[contains(@href,'xdisk.cz/')]"
			);
		}
		if (GM_getValue("Check_mightyupload_dot_com_links", false))
		{
			addFileHost(
			"mightyupload\.com\/\\w+",
			'background:#ccc;text-align|CONTENT="Download File"',
			'style="background:#eee|var rr =|File Not Found',
			'error-code">1010',
			'optional2--',
			"//a[contains(@href,'mightyupload.com')]");
		}
		if (GM_getValue("Check_anysend_dot_com_links", false))
		{
			addFileHost(
			"anysend\.com\/\\w+",
			'var openCalled=false;|content="noindex"',
			'_trackPageview',
			'optional--',
			'optional2--',
			"//a[contains(@href,'anysend.com')]");
		}
		if (GM_getValue("Check_upstore_dot_net_links", false))
		{
			addFileHost(
			"upstore\.net",
			'name="free"',
			'File not found|onload="redirect|class="error">|Файл был удалён',
			'optional--',
			'This file is available only for Premium users|Этот файл распространяется только среди Премиум пользователей',
			"//a[contains(@href,'upstore.net')]");
		}
		if (GM_getValue("Check_upsto_dot_re_links", false))
		{
			addFileHost(
			"upsto\.re",
			'name="free"', //style="margin-top: 20px">|style="text-align:center; margin: 20px 0 100px;">
			'File not found|onload="redirect|class="error">|Файл был удалён',
			'optional--',
			'This file is available only for Premium users|Этот файл распространяется только среди Премиум пользователей',
			"//a[contains(@href,'upsto.re') or contains(@href,'upstore.net')]");
		}
		if (GM_getValue("Check_speedy_dot_sh_links", false))
		{
			addFileHost(
			"speedy\.sh\/\\w+",
			'bgcolor=#eeeeee|class="addthis',
			'File not found|downloadfilenamenotfound>',
			'optional--',
			'optional2--',
			"//a[contains(@href,'speedy.sh')]");
		}
/*		if (GM_getValue("Check_ge_dot_tt_links", false))
		{
			addFileHost(
			"ge\.tt\/\\w+",
			'downloads pic',
			'is NOT the same as',
			'optional--',
			'optional2--',
			"//a[contains(@href,'ge.tt')]");
		} */
		if (GM_getValue("Check_rapidgator_dot_net_links", false)) //folders
		{
			addFileHost(
			"rapidgator\\.net\/folder\/\\w+",
			'href="/folder/',
			'class="empty|Folder not found|Carpeta no encontrada|Dossier non trouvé|Папка не найдена',
			'optional--',
			'optional2--',
			"//a[contains(@href,'rapidgator.net/folder')]",
			true
			);
		}
		if (GM_getValue("Check_salefiles_dot_com_links", false))
		{
			addFileHost(
			"salefiles\.com\/\\w+",
			'name="method_free',
			'font:15px Arial|background:#eee;|file was removed by administrator|style="width:500px;text-align:left;">',
			'optional--',
			'optional2--',
			"//a[contains(@href,'salefiles.com')]");
		}
		if (GM_getValue("Check_datoid_dot_cz_links", false))
		{
			addFileHost(
			"datoid\.cz\/\\w+",
			'btn-download|class="icon-download-large"',
			'Stránka nenalezena|error-404|Soubor byl zablokován|Soubor byl smazán',
			'optional--',
			'optional2--',
			"//a[contains(@href,'datoid.cz')]");
		}
		if (GM_getValue("Check_streamfile_dot_com_links", false))
		{
			addFileHost(
			"streamfile\.com\/\\w+",
			'class="btn',
			'class="green-btn',
			'optional--',
			'optional2--',
			"//a[contains(@href,'streamfile.com')]");
		}
		if (GM_getValue("Check_filemoney_dot_com_links", false))
		{
			addFileHost(
			"filemoney\.com\/\\w+",
			'og:title',
			'404 Not Found|<Title>FileMoney|File Not Found|class="err">DMCA</b>',
			'error-code">1010',
			'optional2--',
			"//a[contains(@href,'filemoney.com')]");
		}
		if (GM_getValue("Check_uploadboy_dot_com_links", false))
		{
			addFileHost(
			"uploadboy\.com\/\\w+",
			'width="740">|method_free',
			'var rr =|background:#ffffff|not be found|file was removed|File Not Found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'uploadboy.com')]");
		}
		if (GM_getValue("Check_uploadboy_dot_me_links", false))
		{
			addFileHost(
			"uploadboy\.me\/\\w+",
			'width="740">|method_free',
			'var rr =|background:#ffffff|not be found|file was removed|File Not Found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'uploadboy.me')]");
		}
		if (GM_getValue("Check_speedshare_dot_eu_links", false))
		{
			addFileHost(
			"speedshare\.eu\/\\w+",
			'favicon.png|color:#3d87c0|cross.png"|id="method_free',
			'var rr =|File Not Found|style="background:#eee',
			'optional--',
			'optional2--',
			"//a[contains(@href,'speedshare.eu')]");
		}
		if (GM_getValue("Check_unlimitzone_dot_com_links", false))
		{
			addFileHost(
			"unlimitzone\.com\/\\w+",
			'name="method_free',
			'var rr =|File Not Found|removed by administrator|class="err">|Файл не найден|Datei nicht gefunden|fichier non trouve|Dosya bulunamadД±|Nie znaleziono pliku|ไม่พบไฟล์ที่ต้องการ|Nie znaleziono pliku|Archive no Encontrado|ファイルが見つかりません。|File nem talГЎlhatГі|File tidak ditemukan|Bestand niet gevonden',
			'optional--',
			'optional2--',
			"//a[contains(@href,'unlimitzone.com')]");
		}
		if (GM_getValue("Check_jumbofiles_dot_org_links", false))
		{
			addFileHost(
			"jumbofiles\.org\/\\w+",
			'H71C5.png|class="downloadtitle">',
			'var swfu|ViewSourceBIN.png',
			'optional--',
			'optional2--',
			"//a[contains(@href,'jumbofiles.org')]");
		}
		if (GM_getValue("Check_fshare_dot_vn_links", false))
		{
			addFileHost(
			"fshare\\.vn\/file\/\\w+",
			'action="#download"|left; width: 330px;">|class="bt_down"',
			'không tồn tại|class="color_red m_t_50"',
			'optional--',
			'optional2--',
			"//a[contains(@href,'fshare.vn/file')]",
			true
			);
		}
		if (GM_getValue("Check_spaceforfiles_dot_com_links", false))
		{
			addFileHost(
			"spaceforfiles\.com\/\\w+",
			'btn_slowspeed_b.jpg|value="download1|"method_free',
			'var rr =|AVOID_IE_BUG|<div style="text-align:left;"><ul>|>File not found.<',
			'optional--',
			'optional2--',
			"//a[contains(@href,'spaceforfiles.com')]");
		}
		if (GM_getValue("Check_google_dot_com_links", false))
		{
			addFileHost(
			"google\\.com\/file\/\\w+",
			'content="!">|color:#2d2d2d',
			'12pt; font-weight:|class="errorMessage"|F0F6FF',
			'optional--',
			'optional2--',
			"//a[contains(@href,'google.com/file')]",
			true
			);
		}
		if (GM_getValue("Check_google_dot_com_links", false))
		{
			addFileHost(
			"docs.google.com\/\\w+",
			'content="!">|color:#2d2d2d',
			'12pt; font-weight:|class="errorMessage"|F0F6FF|Error 404',
			'optional--',
			'optional2--',
			"//a[contains(@href,'docs.google.com')]",
			true
			);
		}
    if (GM_getValue("Check_drive_dot_google_dot_com_links", false))
		{
			addFileHost(
			"drive.google.com\/\\w+",
			'content="!">|color:#2d2d2d|id="uc-download-link|class="drive-viewer-|color:#202124',
			'12pt; font-weight:|class="errorMessage"|F0F6FF|Error 404',
			'optional--',
			'optional2--',
			"//a[contains(@href,'drive.google.com')]",
			true
			);
		}
		if (GM_getValue("Check_up_dot_media1fire_dot_com_links", false))
		{
			addFileHost(
			"up.media1fire\.com\/\\w+",
			'class="addthis_|value="download',
			'var rr =|AVOID_IE_BUG|<div style="width:500px;text-align:left;">',
			'optional--',
			'optional2--',
			"//a[contains(@href,'up.media1fire.com')]");
		}
		if (GM_getValue("Check_redbunker_dot_net_links", false))
		{
			addFileHost(
			"redbunker\.net\/\\w+",
			'name="method_free"',
			'color="red">Unknow / Bilinmiyor<|removed by administrator',
			'optional--',
			'2.3 GB',
			"//a[contains(@href,'redbunker.net')]");
		}
		if (GM_getValue("Check_anafile_dot_com_links", false))
		{
			addFileHost(
			"anafile\.com\/\\w+",
			'width="881" valign="top|color="#800080"|name="go"',
			'style="width:500px;text-align:left;">|file was deleted|AVOID_IE_BUG|<title>Account Suspended<',
			'optional--',
			'optional2--',
			"//a[contains(@href,'anafile.com')]");
		}
		if (GM_getValue("Check_sharerepo_dot_com_links", false))
		{
			addFileHost(
			"sharerepo\.com\/\\w+",
			'name="method_free"',
			'var public_on=|The file you were looking for could not be found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'sharerepo.com')]");
		}
		if (GM_getValue("Check_sfshare_dot_se_links", false))
		{
			addFileHost(
			"sfshare\.se\/\\w+",
			'id="btn_download"|class="btn btn-primary txt-bold" value="',
			'AVOID_IE_BUG|var rr =|style="width:500px;text-align:left;">|Reason for deletion|The file was removed',
			'optional--',
			'optional2--',
			"//a[contains(@href,'sfshare.se')]");
		}
		if (GM_getValue("Check_files_dot_fm_links", false))
		{
			addFileHost(
			"files\.fm\/\\w+",
			'dl.png"|background-color: transparent',
			'margin: 40px 40px|background: none;',
			'optional--',
			'optional2--',
			"//a[contains(@href,'files.fm')]");
		}
		if (GM_getValue("Check_koofile_dot_com_links", false))
		{
			addFileHost(
			"koofile\.com\/\\w+",
			'value="download1">|name="method_free"',
			'class="overview-content c_text-box ">|style="padding-top:3px;">|class="rt1 c">',
			'optional--',
			'optional2--',
			"//a[contains(@href,'koofile.com')]");
		}
		if (GM_getValue("Check_daten_dash_hoster_dot_de_links", false))
		{
			addFileHost(
			"(?:daten-hoster\\.de\/file\/\\w+|filehosting\\.org\/file\/\\w+|xtraupload\\.de\/\\?d=\\w+)",
			'Details zur Datei|Details page',
			'Jetzt hochladen|upload now',
			'optional--',
			'optional2--',
			"//a[contains(@href,'daten-hoster.de/file') or contains(@href,'filehosting.org/file') or contains(@href,'xtraupload.de')]"
			);
		}
		if (GM_getValue("Check_upload_dash_il_dot_net_links", false))
		{
			addFileHost(
			"(?:upload-il|przeslij)\.net\/(?:en|he|ar|ru|)\/?\\w+",
			'downloadbtn"',
			'DL_FileNotFound',
			'optional--',
			'optional2--',
			"//a[contains(@href,'upload-il.net') or contains(@href,'przeslij.net')]"
			);
		}
		if (GM_getValue("Check_fileflyer_dot_com_links", false))
		{
			addFileHost(
			"fileflyer\.com\/view\/\\w+",
			'(?:dwl|locked)btn"',
			'error.gif"|link">Removed|removedlink">',
			'optional--',
			'optional2--',
			"//a[contains(@href,'fileflyer.com')]"
			);
		}
		if (GM_getValue("Check_filestore_dot_to_links", false))
		{
			addFileHost(
			"filestore\.to\/\\?d=\\w+",
			'"downloading"',
			'Datei wurde nicht gefunden',
			'optional--',
			'optional2--',
			"//a[contains(@href,'filestore.to')]"
			);
		}
        if (GM_getValue("Check_filestore_dot_me_links", false))
		{
			addFileHost(
			"filestore\.me\/\\w+",
			'method_free',
			'File Not Found|>Reason for deletion<',
			'optional--',
			'optional2--',
			"//a[contains(@href,'filestore.me')]"
			);
		}
		if (GM_getValue("Check_datei_dot_to_links", false))
		{
			addFileHost(
			"datei\\.to\/\\??\\w+",
			'icon_downloaden\\.png|>Download starten<',
			'Datei wurde nicht gefunden|icon_deleted.png',
			'optional--',
			'optional2--',
			"//a[contains(@href,'datei.to')]"
			);
		}
		if (GM_getValue("Check_yunfile_dot_com_links", false))
		{
			addFileHost(
				"(?:yunfile|filemarkets)\\.com\/\\w+",
			'<body class="body" id="body">|value="Slow Download"',
			'<body class="body" >',
			'optional--',
			'optional2--',
			"//a[contains(@href,'yunfile.com') or contains(@href,'filemarkets.com')]"
			);
		}
/*		if (GM_getValue("Check_unibytes_dot_com_links", false))
		{
			addFileHost(
			"unibytes\\.com\/[\\w\.]+",
			'trying to download|пытаетесь загрузить файл|tes entrain de tlcharger',
			'File not found|Файл не найден|',
			'optional--',
			'optional2--',
			"//a[contains(@href,'unibytes.com')]"
			);
		} */
/*		if (GM_getValue("Check_hellshare_dot_com_links", false)) //very old type of links
		{
			addFileHost(
			"www\\.hellshare\\.com\/\\d+",
			'tab\\-details"',
			'list-purp-2"|not found on this server|HellShare is unavailable in United States',
			'optional--',
			'optional2--',
			"//a[contains(@href,'www.hellshare.com')]"
			);
		}
		if (GM_getValue("Check_download_dot_cz_dot_hellshare_dot_com_links", false)) //very old type of links
		{
			addFileHost(
			"www\\.download.cz.hellshare\\.com\/\\w+",
			'tab\\-details"',
			'list-purp-2"|not found on this server|HellShare is unavailable in United States',
			'optional--',
			'optional2--',
			"//a[contains(@href,'www.download.cz.hellshare.com')]"
			);
		} */
		if (GM_getValue("Check_filefactory_dot_com_links", false)) //pics & folders
		{
			addFileHost(
			"filefactory\\.com",
			'folderFileList">|Server Load Too High|icon-cloud|<tr id=|div id="file_holder"|id="download-free"|danger countdown|id="file_name"|id="file-download-free">',
			'table class="items"|このフォルダ内にファイルはありません|may have been deleted|Premium Account Required|Unerwarteter Fehler|Ungültiger Download-Link|Ungültiger Downloadlink|Link de Download Inválido|Pointer" class="red">|There are no files in this folder|Dieser Ordner enthält keine Dateien|Não há arquivos nesta pasta|File Removed|Invalid Download Link|File Unavailable|Server Failed|Datei entfernt|This file has been removed|Invalid Download Link|There are no files in this folder|"Fichier supprimé"|>Lien de téléchargement invalide<',
			'Server Maintenance|temporarily overloaded|Server überlastet|Unerwarteter Fehler|予期せぬエラー|Erro inesperado|Carga do Servidor Muito Alta',
			'optional2--',
			"//a[contains(@href,'filefactory.com/file/') or contains(@href,'filefactory.com/folder/')]"
			);
		} 
		if (GM_getValue("Check_divshare_dot_com_links", false))
		{
			addFileHost(
			"divshare\\.com\/download\/",
			'download_new\.png',
			'have been removed',
			'optional--',
			'optional2--',
			"//a[contains(@href,'divshare.com')]"
			);
		} 
		if (GM_getValue("Check_files_dot_mail_dot_ru_links", false))
		{
			addFileHost(
			'files\\.mail\\.ru/(?:\\w*)',
			'fileList',
			'errorMessage',
			'optional--',
			'optional2--',
			"//a[contains(@href,'files.mail.ru')]"
			);
		}
		if (GM_getValue("Check_narod_dot_ru_links", false))
		{
			addFileHost(
			'narod\\.(?:yandex\\.|)ru\/disk\/',
			'b-submit|action="resource.download"',
			'b-download-virus-note|headCode">404<|Ваши файлы не пропадут|Your files are safe|Ваші файли не зникнуть|Dosyalarınız kaybolmaz',
			'Внутренняя ошибка сервиса',
			'optional2--',
			"//a[contains(@href,'narod.ru') or contains(@href,'narod.yandex.ru')]"
			);
		}
		if (GM_getValue("Check_rayfile_dot_com_links", false))
		{
			addFileHost(
			"rayfile\\.com\/",
			'FILEtitleTXT',
			'blueRow',
			'optional--',
			'optional2--',
			"//a[contains(@href,'rayfile.com/') and contains(@href,'files')]"
			);
		}
		if (GM_getValue("Check_filesmonster_dot_com_links", false))
		{
			addFileHost(
			"filesmonster\\.com\/download\\.php\\?id=\\w+",
			'File download',
			'<h3>File not found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'filesmonster.com/download')]"
			);
		}
		if (GM_getValue("Check_usaupload_dot_net_links", false))
		{
			addFileHost(
			'usaupload\\.net\/d\/(?:\w*)',
			'<strong>File size:</strong>',
			'is not available',
			'optional--',
			'optional2--',
			"//a[contains(@href,'usaupload.net/d/')]"
			);
		}
		if (GM_getValue("Check_sendspace_dot_com_links", false))
		{
			addFileHost(
			'sendspace\\.com\/file\/\\w+',
			'file_description',
			'msg error"',
			'optional--',
			'optional2--',
			"//a[contains(@href,'sendspace.com/file')]"
			);
		}
		if (GM_getValue("Check_sendspace_dot_pl_links", false))
		{
			addFileHost(
			'sendspace\\.pl\/file\/\\w+',
			'download_file"',
			'Podany plik nie',
			'optional--',
			'optional2--',
			"//a[contains(@href,'sendspace.pl/file')]"
			);
		}
		if (GM_getValue("Check_good_dot_com_links", false))
		{
			addFileHost(
			'good\\.net\/(?:_|dl)',
			'Free Download',
			'Not Found',
			'Forbidden',
			'optional2--',
			"//a[contains(@href,'good.net')]"
			);
		}
		if (GM_getValue("Check_2shared_dot_com_links", false))
		{
			addFileHost(
			'2shared\\.com\/(?:file|video|document|fadmin|audio)\/\\w*',
			'File size',
			'File not found|is not valid|/images/important.gif',
			'optional--',
			'optional2--',
			"//a[contains(@href,'2shared.com/file/') or contains (@href,'2shared.com/audio/') or contains (@href,'2shared.com/fadmin/') or contains (@href,'2shared.com/document/') or contains (@href,'2shared.com/video/')]"
			);
		}
		if (GM_getValue("Check_turboupload_dot_com_links", false))
		{
			addFileHost(
			'turboupload\\.com\/\\w*',
			'You have requested',
			'File Not Found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'turboupload.com')]"
			);
		}
		if (GM_getValue("Check_gigapeta_dot_com_links", false))
		{
			addFileHost(
			'gigapeta\\.com\/dl\/',
			'Download file|Скачать файл| Herunterzuladen|Scarica il file|Cargar el fichero|Charger le fichier',
			'404|page_error',
			'optional--',
			'optional2--',
			"//a[contains(@href,'gigapeta.com/dl')]"
			);
		}
		if (GM_getValue("Check_veehd_dot_com_links", false))
		{
			addFileHost(
			'veehd\.com\/video\/.*?',
			'No sound|Download video',
			'Featured Videos',
			'optional--',
			'optional2--',
			"//a[contains(@href,'veehd.com') and contains(@href,'video')]"
			);
		}
		if (GM_getValue("Check_vip_dash_file_dot_com_links", false))
		{
			addFileHost(
			'(?:u\\d+\\.)?vip-file\\.com\/download.*?\/(?:.*?)\/(?:.*?)\\.html',
			'fast_download_form">|submit_sms_download',
			'<p style="text-align:center">',
			'optional--',
			'optional2--',
			"//a[contains(@href,'vip-file.com/download')]"
			);
		}
/*		if (GM_getValue("Check_solidfiles_dot_com_links", false))
		{
			addFileHost(
			'solidfiles\\.com\/\\w+',
			'id="download"|content="Download',
			'>Not found<|<h2>404</h2>|Page not found|<h1>404</h1>|File not available|no longer available',
			'optional--',
			'optional2--',
			"//a[contains(@href,'solidfiles.com/')]"
			);
		} */
		if (GM_getValue("Check_shareflare_dot_net_links", false))
		{
			addFileHost(
				"(?:.\\.|)shareflare\\.net",
			'download-pnl|<div class="premium-block">',
			'File not found|ĐźĐľĐ¸ŃĐş Đ·ĐµŃ€ĐşĐ°Đ»Đ° Đ˝Đ° Ń„Đ°|<div id="captcha"',
			'optional--',
			'optional2--',
			"//a[contains(@href,'shareflare.net') and contains(@href,'download')]"
			);
		}
		if (GM_getValue("Check_u18116681_dot_shareflare_dot_net_links", false))
		{
			addFileHost(
			"u18116681.shareflare\\.net",
			'download-pnl|<div class="premium-block">',
			'File not found|ĐźĐľĐ¸ŃĐş Đ·ĐµŃ€ĐşĐ°Đ»Đ° Đ˝Đ° Ń„Đ°|<div id="captcha"',
			'optional--',
			'optional2--',
			"//a[contains(@href,'shareflare.net') and contains(@href,'download')]"
			);
		}
/*		if (GM_getValue("Check_hellspy_dot_com_links", false))
		{
			addFileHost(
			"hellspy\.(?:com|cz|sk|hu|pl)\/\\w+",
			'file\\-list-orderby|section-filedetail">',
			'<\/span><\/h2>\\s*<p>|list-purp-2">|flash info sticky">|502 Bad Gateway|<h1>404 Not Found</h1>|Soubor nenalezen',
			'optional--',
			'optional2--',
			"//a[contains(@href,'hellspy.')]"
			);
		} */
		if (GM_getValue("Check_leteckaposta_dot_cz_links", false))
		{
			addFileHost(
			"(?:leteckaposta\\.cz|sharegadget\\.com)\/\\d+",
			'<body onload="">',
			'neexistuje|not exist',
			'optional--',
			'optional2--',
			"//a[contains(@href,'leteckaposta.cz') or contains(@href,'sharegadget.com')]"
			);
		}
		if (GM_getValue("Check_stahovanizasms_dot_cz_links", false))
		{
			addFileHost(
			"stahovanizasms\\.cz\/\\w+",
			'download\\.png>|font-size:11px><tr>',
			'smaz.n u.ivatelem|font-size:11px><\/table>',
			'optional--',
			'optional2--',
			"//a[contains(@href,'stahovanizasms.cz')]"
			);
		}
		if (GM_getValue("Check_share_dash_links_dot_biz_links", false))
		{
			addFileHost(
			"share-links\\.biz\/\\w*",
			'online\\.gif',
			'(?:offline|parts)\\.gif',
			'optional--',
			'optional2--',
			"//a[contains(@href,'share-links.biz')]"
			);
		}
		if (GM_getValue("Check_4shared_dot_com_links", false))
		{
			addFileHost(
			"4shared\\.com\/.+\/",
			'<input type="hidden" class="jsSocialTwDefaultText" value=|class="fileName light-blue f23',
			'class="warn\"|big red"|GetDataBack',
			'Service Unavailable',
			'optional2--',
			"//a[contains(@href,'4shared.com')]"
			);
		}
		/*if (GM_getValue("Check_zippyshare_dot_com_links", false))
		{
			addFileHost(
				"(?:www\\d+\.|)zippyshare\.com\/",
			'download\.png|Download Now|images/download_small.png|id="dlbutton"',
			'not exist|Status 404',
			'optional--',
			'optional2--',
			"//a[contains(@href,'zippyshare.com') and contains(@href,'file.html')]"
			);
		} */
		/*if (GM_getValue("Check_uploaded_dot_to_links", false))
		{
			addFileHost(
			'(?:uploaded\\.(?:to|net)\/(?:.id|file|folder|f|410|404))|(?:ul\\.to\/)',
			'<h2>Authentification</h2></li>|MB</small>|KB</small>|1,00 GB|name="pw" style="float:none| B</small>',
			'box_red|Error: 404|Error: 410|Error: 451|fileList"><thead><tr><td colspan="2"><\/td><\/tr><\/thead><tbody>\\s*<tr>',
			'optional--',
			'GB</small>',
			"//a[contains(@href,'uploaded.to/') or contains(@href,'uploaded.net/') or contains(@href,'ul.to/')]"
			);
		} */
		if (GM_getValue("Check_box_dot_com_links", false))
		{
			addFileHost(
			"box\.com\/\\w+",
			'download-file-btn|id="download_button|preview-download',
			'BIyMin.png| <div class="error_message|link has been removed',
			'optional--',
      'optional2--',
			"//a[contains(@href,'app.box.com')]");
		}
		if (GM_getValue("Check_uptobox_dot_com_links", false))
		{
			addFileHost(
			"uptobox\\.com\/\\w+",
			'value="Téléchargement gratuit|data-remaining-time=|download-btn big-button-green|Cliquez-ici pour lancer votre téléchargement|Click here to start your download|Create Download Link">|Lien de téléchargement|1px solid #AEAEAE|class="grey_link|id="btn_download|name="method_free"|value="Free Download"|cell countdown-block light-green-cell',
			'The file expired|Fichier introuvable|pas disponible|<b>404 -|The file was deleted|Fichier introuvable|not available in your country|No files uploaded yet|aucun fichier présent|Belum ada berkas yang diunggah|لا يوجد أي ملف',
			'Maintenance|not allowed in the US</title>|Ce fichier est temporairement indisponible, merci de réessayer ultérieurement|This file is temporarily unavailable, please try again later',
			'You must be premium to download this file|Vous devez être premium pour télécharger ce fichier|You need a PREMIUM account to download new files immediatly',
			"//a[contains(@href,'uptobox.com')]",
			true);
		}
        if (GM_getValue("Check_uptobox_dot_eu_links", false))
		{
			addFileHost(
			"uptobox\\.eu\/\\w+",
			'value="Téléchargement gratuit|data-remaining-time=|download-btn big-button-green|Cliquez-ici pour lancer votre téléchargement|Click here to start your download|Create Download Link">|Lien de téléchargement|1px solid #AEAEAE|class="grey_link|id="btn_download|name="method_free"|value="Free Download"|cell countdown-block light-green-cell',
			'The file expired|Fichier introuvable|pas disponible|<b>404 -|The file was deleted|Fichier introuvable|not available in your country|No files uploaded yet|aucun fichier présent|Belum ada berkas yang diunggah|لا يوجد أي ملف',
			'Maintenance|not allowed in the US</title>|Ce fichier est temporairement indisponible, merci de réessayer ultérieurement|This file is temporarily unavailable, please try again later',
			'You must be premium to download this file|Vous devez être premium pour télécharger ce fichier|You need a PREMIUM account to download new files immediatly',
			"//a[contains(@href,'uptobox.eu')]",
			true);
		}
		if (GM_getValue("Check_sharecash_dot_org_links", false))
		{
			addFileHost(
			"sharecash\\.org\/download\\.php\\?file=\\d+",
			'FILE DOWNLOAD<',
			'File Does Not Exist',
			'optional--',
			'optional2--',
			"//a[contains(@href,'sharecash.org/download.php')]"
			);
		}
		if (GM_getValue("Check_1fichier_dot_com_links", false)) //folders
		{
			addFileHost(
			"1fichier\\.com\/dir\/\\w+",
			'<td class="normal',
			'Shared Folder Not Found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'1fichier.com/dir')]"
			);
		}
		if (GM_getValue("Check_depositfiles_dot_com_links", false)) 
		{
			addFileHost(
			"(?:depositfiles\\.com|depositfiles\\.lt|depositfiles\\.org|dfiles\\.ru|dfiles\\.eu|dfiles\\.com)\/\\w+",
			'>File Download<|id="free_btn',
			'<div id="files" class="files">\\s*<\/div>|no_file|file_ban|Diese Datei besteht nicht|page_download_no_file',
			'optional',
			'optional2--',
			"//a[contains(@href,'depositfiles.com') or contains(@href,'depositfiles.lt') or contains(@href,'depositfiles.org') or contains(@href,'dfiles.ru') or contains(@href,'dfiles.eu') or contains(@href,'dfiles.com')]"
			);
		}
		if (GM_getValue("Check_dfiles_dot_eu_links", false)) //folders
		{
			addFileHost(
			"dfiles\\.eu\/folders",
			'<div class="progressContainer">|generate_upload_id_allowed',
			'<div id="files" class="files">\\s*<\/div>|no_file|file_ban',
			'optional--',
			'optional2--',
			"//a[contains(@href,'dfiles.eu/folders')]"
			);
		}
		if (GM_getValue("Check_rapidfileshare_dot_net_links", false))
		{
			addFileHost(
			"rapidfileshare\\.net/\\w+",
			'<div id="upload-header-bg">',
			'<div style="width:500px;text-align:left;">',
			'optional--',
			'optional2--',
			"//a[contains(@href,'rapidfileshare.net/')]"
			);
		}
/*		if (GM_getValue("Check_stiahnito_dot_sk_links", false))
		{
			addFileHost(
			"stiahnito\\.sk/",
			'<span class="filesize right">',
			'<ol class="list-purp-2">',
			'optional--',
			'optional2--',
			"//a[contains(@href,'stiahnito.sk/')]"
			);
		} */
		if (GM_getValue("Check_sendmyway_dot_com_links", false))
		{
			addFileHost(
			"sendmyway\\.com\/\\w+",
			'id="btn_download"',
			'500px;text-align:left;"|<center><h3>',
			'optional--',
			'optional2--',
			"//a[contains(@href,'sendmyway.com/')]"
			);
		}
		if (GM_getValue("Check_upload_dot_ee_links", false))
		{
			addFileHost(
			"upload\\.ee\/\\w+",
			'onmouseout="document.dllink.src',
			'There is no such file.|File was deleted|Fail kustutati|Файл удалён|Такого файла нет',
			'optional--',
			'optional2--',
			"//a[contains(@href,'upload.ee/')]"
			);
		}
		if (GM_getValue("Check_shareplace_dot_org_links", false))
		{
			addFileHost(
			"shareplace\\.org\/\\?\\w+",
			'Download-Link',
			'Your requested file is not found|Select file to send',
			'optional--',
			'optional2--',
			"//a[contains(@href,'shareplace.org/?')]"
			);
		}
		if (GM_getValue("Check_uploadc_dot_com_links", false))
		{
			addFileHost(
			"uploadc\\.com\/\\w+",
			'id="prebut"',
			'File Not Found|This file has been removed due',
			'optional--',
			'optional2--',
			"//a[contains(@href,'uploadc.com/')]"
			);
		}
		if (GM_getValue("Check_filedais_dot_com_links", false))
		{
			addFileHost(
			"filedais\.com\/\\w+",
			'class="btn btn-info"|name="method_free"',
			'style="width:500px;text-align:left;">|File Not Found|AVOID_IE_BUG',
			'optional--',
			'optional2--',
			"//a[contains(@href,'filedais.com')]");
		}
		if (GM_getValue("Check_up_dot_4share_dot_vn_links", false))
		{
			addFileHost(
			"up.4share\.vn\/\\w+",
			'<font size="2" face="Verdana">',
			'font: 13px Tahoma; color: Brown',
			'optional--',
			'optional2--',
      "//a[contains(@href,'up.4share.vn')]");
		}
		if (GM_getValue("Check_share_dot_vnn_dot_vn_links", false))
		{
			addFileHost(
			"share.vnn\.vn\/\\w+",
			'"index,follow"|<div class="main" id="download-box">',
			'<meta name="description" content="" />|<h1>Không tìm thấy file bạn yêu cầu</h1>',
			'optional--',
      'optional2--',
			"//a[contains(@href,'share.vnn.vn')]");
		}
		if (GM_getValue("Check_upfile_dot_vn_links", false))
		{
			addFileHost(
			"upfile\.vn\/\\w+",
			'download-timer',
			'<meta name="description" content="Upload files|<meta name="description" content="Error "',
			'optional--',
      'optional2--',
			"//a[contains(@href,'upfile.vn')]");
		}
		if (GM_getValue("Check_pan_dot_baidu_dot_com_links", false))
		{
			addFileHost(
			"pan.baidu\.com\/\\w+",
			'target="_blank" title=|share-personal-info|id="accessCode"|class="file-name" title="',
			'share_notfound.png|background:#f9f9f9|class="error-main clearfix"',
			'optional--',
      'optional2--',
			"//a[contains(@href,'pan.baidu.com')]");
		}
		if (GM_getValue("Check_yunpan_dot_cn_links", false))
		{
			addFileHost(
			"yunpan\.cn\/\\w+",
			'class="icon icon-download',
			'content="360|http://p5.qhimg.com/t01d1c98667df9dc6cc.jpg',
			'optional--',
      'optional2--',
			"//a[contains(@href,'yunpan.cn')]");
		}
        if (GM_getValue("Check_file_dash_upload_dot_net_links", false))
		{
			addFileHost(
			"(?:en\\.|)file\\-upload\\.net\/download\\-\\d+\/\\w+",
			'class="g-recaptcha',
			'hochgeladene Datei nicht gefunden werden|has not been found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'file-upload.net')]");
		}
	  if (GM_getValue("Check_file_dash_upload_dot_com_links", false))
		{
			addFileHost(
			"file\\-upload\\.com\/",
			'name="method_free"',
			'File Not Found|exclamation-triangle',
			'optional--',
      'optional2--',
			"//a[contains(@href,'file-upload.com')]");
		}
        if (GM_getValue("Check_file_dash_upload_dot_org_links", false))
		{
			addFileHost(
			"file\\-upload\\.org\/",
			'name="method_free"',
			'File Not Found|exclamation-triangle',
			'optional--',
      'optional2--',
			"//a[contains(@href,'file-upload.org')]");
		}
/*    if (GM_getValue("Check_datafilehost_dot_com_links", false))
		{
			addFileHost(
			"datafilehost\\.com\/(?:download-\\w+\\.html|d\/\\w+)",
			'dldtable">|alt="DOWNLOAD"',
			'does not exist\\.',
			'optional--',
      'optional2--',
			"//a[contains(@href,'datafilehost.com')]");
		} */
		if (GM_getValue("Check_dropbox_dot_com_links", false))
		{
			addFileHost(
			"dropbox\.com\/s\/\\w+",
			'default_content_download_button" class="freshbutton-blue">|content_download_button',
			'>Nothing Here<|>Error (404)<',
			'title>Dropbox - 509|Error (403)|Error: 429',
			'optional2--',
			"//a[contains(@href,'dropbox.com')]");
		}
		if (GM_getValue("Check_box_dot_net_links", false))
		{
			addFileHost(
			"box\.net\/\\w+",
			'download-file-btn|id="download_button',
			'BIyMin.png| <div class="error_message',
			'optional--',
      'optional2--',
			"//a[contains(@href,'www.box.net')]");
		}
		if (GM_getValue("Check_filedropper_dot_com_links", false))
		{
			addFileHost(
			"filedropper\.com\/\\w+",
			'background:#ddd;|width:985px; ',
			'background-color:#FFFFFF;|margin-left: -400px;',
			'optional--',
      'optional2--',
			"//a[contains(@href,'filedropper.com')]");
		}
		if (GM_getValue("Check_tropicshare_dot_com_links", false))
		{
			addFileHost(
			"tropicshare\\.com\/files\/\\d+",
			'MB</span>|GB</span>|KB</span>',
			'>FNF<|size: </span>',
			'optional--',
      'optional2--',
			"//a[contains(@href,'tropicshare.com')]");
		}
		if (GM_getValue("Check_worldbytez_dot_com_links", false))
		{
			addFileHost(
			"worldbytez\.com",
			'<div class="download_type">|method_free',
			'<div style="width:500px;text-align:left;">',
			'optional--',
      'optional2--',
			"//a[contains(@href,'worldbytez.com')]",
			true);
		}
		if (GM_getValue("Check_freefilehosting_dot_net_links", false))
		{
			addFileHost(
			"freefilehosting\.net\/\\w+",
			'Type: cbr|Type: rar|Type: jpg|Type: mkv|Type: avi|Type: mpg|Type: mpeg|Type: zip|Type: wmvType: bmpType: gifType: mp4Type: mp3',
			'175px;" value="http://www.freefilehosting.net/"|Filename:  <br>',
			'optional--',
      'optional2--',
			"//a[contains(@href,'freefilehosting.net')]");
		}
		if (GM_getValue("Check_sharerapid_dot_cz_links", false))
		{
			addFileHost(
			"sharerapid\.cz\/\\w+",
			'value="Stáhnout"|soubor" style|Stahování je povoleno pouze pro přihlášené uživatele',
			'error_div">|404 - Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'sharerapid.cz')]");
		}
		if (GM_getValue("Check_sdilej_dot_cz_links", false))
		{
			addFileHost(
			"sdilej\.cz",
			'Stáhnout FREE',
			'czshare.com|sponsored listings|This domain is for sale|not found|Tento soubor byl smazán|Taková složka neexistuje',
			'optional--',
      'optional2--',
			"//a[contains(@href,'sdilej.cz')]");
		}
        if (GM_getValue("Check_yadi_dot_sk_links", false))
		{
			addFileHost(
			"yadi\.sk\/\\w+",
			'nb-button _nb-small-button',
			'error code|Nothing found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'yadi.sk')]");
		}
		if (GM_getValue("Check_hitfile_dot_net_links", false))
		{
			addFileHost(
			"hitfile\.net\/\\w+",
			'class="download-file',
			'style="width:16px;height:16px;border:0;|File not found|File was deleted or not found|Le fichier a été supprimé ou n|Файл не найден. Возможно он был удален',
			'optional--',
      'optional2--',
			"//a[contains(@href,'hitfile.net')]");
		}
		if (GM_getValue("Check_hitf_dot_to_links", false))
		{
			addFileHost(
			"hitf\.to\/\\w+",
			'class="download-file',
			'style="width:16px;height:16px;border:0;|File not found|File was deleted or not found|Le fichier a été supprimé ou n|Файл не найден. Возможно он был удален',
			'optional--',
      'optional2--',
			"//a[contains(@href,'hitf.to')]");
		}
		if (GM_getValue("Check_hitf_dot_cc_links", false))
		{
			addFileHost(
			"hitf\.cc\/\\w+",
			'class="download-file',
			'style="width:16px;height:16px;border:0;|File not found|File was deleted or not found|Le fichier a été supprimé ou n|Файл не найден. Возможно он был удален',
			'optional--',
      'optional2--',
			"//a[contains(@href,'hitf.cc')]");
		}
        if (GM_getValue("Check_htfl_dot_net_links", false))
		{
			addFileHost(
			"htfl\.net\/\\w+",
			'class="download-file',
			'style="width:16px;height:16px;border:0;|File not found|File was deleted or not found|Le fichier a été supprimé ou n|Файл не найден. Возможно он был удален',
			'optional--',
      'optional2--',
			"//a[contains(@href,'htfl.net')]");
		}
		if (GM_getValue("Check_up_dot_top4top_dot_net_links", false))
		{
			addFileHost(
		  "up.top4top\.net\/\\w+",
			'start Downlod template',
			'start err template',
			'optional--',
			'optional2--',
			"//a[contains(@href,'up.top4top.net')]");
		}
		if (GM_getValue("Check_filejoker_dot_net_links", false))
		{
			addFileHost(
		  "filejoker\.net",
			'button id="regular-download">Slow|method_free" value="1|<div id="download" class="download0">|>Get Download Link|id="regular-download">Slow',
			'File Not Found|not_found|"err">DMCA',
			'optional--',
			'premium-only',
			"//a[contains(@href,'filejoker.net') or contains(@href,'sendurl.me/')]",
            true
            );
		}
		if (GM_getValue("Check_sendurl_dot_me_links", false))
		{
			addFileHost(
		  "sendurl\.me",
			'button id="regular-download">Slow|method_free" value="1|<div id="download" class="download0">|>Get Download Link|id="regular-download">Slow',
			'File Not Found|not_found|"err">DMCA',
			'optional--',
			'premium-only',
			"//a[contains(@href,'filejoker.net') or contains(@href,'sendurl.me/')]",
            true
            );
		}
		if (GM_getValue("Check_dl_dot_free_dot_fr_links", false))
		{
			addFileHost(
			"dl(?:\\.free)?\\.fr\/\\w+",
			'Valider et t&eacute;l&eacute|T&eacute;l&eacute;chargement',
			'Fichier inexistant|Fichier supprim&eacute; pour raison de copyright',
			'optional--',
			'optional2--',
			"//a[contains(@href,'dl.free.fr')]");
		}
		if (GM_getValue("Check_gboxes_dot_com_links", false))
		{
			addFileHost(
		  "gboxes\.com\/\\w+",
			'You have requested|color="red">http://www.gboxes.com',
			'File Not Found|<div style="width:500px;text-align:left;">',
			'optional--',
			'optional2--',
			"//a[contains(@href,'gboxes.com')]");
		}
		if (GM_getValue("Check_brupload_dot_net_links", false))
		{
			addFileHost(
			"brupload\.net\/\\w+",
			'Download Gratuito',
			'<div style="width:500px;text-align:left;">',
			'optional--',
      'optional2--',
			"//a[contains(@href,'brupload.net')]");
		}
		if (GM_getValue("Check_clicknupload_dot_com_links", false))
		{
			addFileHost(
			"clicknupload\.com\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.com')]");
		}
		if (GM_getValue("Check_clicknupload_dot_co_links", false))
		{
			addFileHost(
			"clicknupload\.co\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.co')]");
		}
		if (GM_getValue("Check_clicknupload_dot_me_links", false))
		{
			addFileHost(
			"clicknupload\.me\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.me')]");
		}
		if (GM_getValue("Check_clicknupload_dot_link_links", false))
		{
			addFileHost(
			"(?:clicknupload\\.link|clickndownload\\.link)\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.link') or contains(@href,'clickndownload.link/')]");
		}
		if (GM_getValue("Check_clicknupload_dot_org_links", false))
		{
			addFileHost(
			"(?:clicknupload\\.org|clickndownload\\.org)\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.org') or contains(@href,'clickndownload.org/')]");
		}
        if (GM_getValue("Check_clicknupload_dot_space_links", false))
		{
			addFileHost(
			"(?:clicknupload\\.space|clickndownload\\.space)\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.space') or contains(@href,'clickndownload.space/')]");
		}
		if (GM_getValue("Check_clicknupload_dot_cc_links", false))
		{
			addFileHost(
			"clicknupload\.cc\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.cc')]");
		}
		if (GM_getValue("Check_clicknupload_dot_to_links", false))
		{
			addFileHost(
			"clicknupload\.to\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.to')]");
		}
		if (GM_getValue("Check_clicknupload_dot_club_links", false))
		{
			addFileHost(
			"clicknupload\.club\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.club')]");
		}
        if (GM_getValue("Check_clicknupload_dot_click_links", false))
		{
			addFileHost(
			"clicknupload\.click\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.click')]");
		}
        if (GM_getValue("Check_clicknupload_dot_red_links", false))
		{
			addFileHost(
			"clicknupload\.red\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.red')]");
		}
        if (GM_getValue("Check_clicknupload_dot_online_links", false))
		{
			addFileHost(
			"clicknupload\.online\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.online')]");
		}
        if (GM_getValue("Check_clicknupload_dot_site_links", false))
		{
			addFileHost(
			"clicknupload\.site\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.site')]");
		}
        if (GM_getValue("Check_clicknupload_dot_download_links", false))
		{
			addFileHost(
			"clicknupload\.download\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.download')]");
		}
        if (GM_getValue("Check_clicknupload_dot_vip_links", false))
		{
			addFileHost(
			"clicknupload\.vip\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.vip')]");
		}
        if (GM_getValue("Check_clicknupload_dot_one_links", false))
		{
			addFileHost(
			"clicknupload\.one\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.one')]");
		}
        if (GM_getValue("Check_clicknupload_dot_cfd_links", false))
		{
			addFileHost(
			"(?:clicknupload\\.cfd|clickndownload\\.cfd)\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'clicknupload.cfd') or contains(@href,'clickndownload.cfd/')]");
		}
		if (GM_getValue("Check_ex_dash_load_dot_com_links", false))
		{
			addFileHost(
			"ex-load\.com\/\\w+",
			'name="method_free|<p>Download File:</p>',
			'Folder Not Found|File Not Found|Error 404',
			'optional--',
      'class="downprem wow bounceInLeft',
			"//a[contains(@href,'ex-load.com')]");
		}
		if (GM_getValue("Check_inclouddrive_dot_com_links", false))
		{
			addFileHost(
			"inclouddrive\.com\/\\w+",
			'initfreedownload',
			'<title>Content Unavailable|The file you are trying to download is no longer available',
			'optional--',
      'optional2--',
			"//a[contains(@href,'inclouddrive.com')]");
		}
		if (GM_getValue("Check_sharemods_dot_com_links", false))
		{
			addFileHost(
			"sharemods\.com\/\\w+",
			'name="method_free"',
			'File Not Found<',
			'optional--',
      'optional2--',
			"//a[contains(@href,'sharemods.com')]");
		}
		if (GM_getValue("Check_hostr_dot_co_links", false))
		{
			addFileHost(
			"hostr\.co\/\\w+",
			'method="get"',
			'File not found<|error-page',
			'optional--',
      'optional2--',
			"//a[contains(@href,'hostr.co')]");
		}
		if (GM_getValue("Check_filepi_dot_com_links", false))
		{
			addFileHost(
			"filepi\.com\/\\w+",
			'id="button_start">',
			'File not found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'filepi.com')]");
		}
		if (GM_getValue("Check_chayfile_dot_com_links", false))
		{
			addFileHost(
			"chayfile\.com\/\\w+",
			'name="method_free"',
			'File Not Found|<h3>The file was removed by administrator</h3>',
			'optional--',
      'optional2--',
			"//a[contains(@href,'chayfile.com')]");
		}
		if (GM_getValue("Check_rockfile_dot_co_links", false))
		{
			addFileHost(
			"rockfile\.co\/\\w+",
				'You have requested:|vous avez demandé|قد طلبت:|você solicitou:|Hai richiesto:|Sie haben angefordert:|Вы заказали:|Has solicitado',
			'The file you were looking for could not be found, sorry for any inconvenience.|fa-chain-broken">',
			'optional--',
      'optional2--',
			"//a[contains(@href,'rockfile.co')]",
			true);
		}
/*		if (GM_getValue("Check_tusfiles_dot_net_links", false))
		{
			addFileHost(
			"(?:tusfiles\\.net|tusfiles\\.com)\/\\w+",
			'i/icon/dll.png"|>Start download<br|method_free',
			'no longer available|i/ino.png"|File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'tusfiles.net') or contains(@href,'tusfiles.com/')]");
		}
		if (GM_getValue("Check_userscloud_dot_com_links", false))
		{
			addFileHost(
			"userscloud\.com\/\\w+",
			'btn_download|class="label label-success">|Slow Download Speed',
			'>Server OFFLINE|background:#D3D3D3;border-bottom:1px solid #BBB;font:bold 13px Verdana;padding:3px;">|-chain-broken|The file is no longer available|No shared files',
			'optional--',
      'optional2--',
			"//a[contains(@href,'userscloud.com')]");
		} */
		if (GM_getValue("Check_faststore_dot_org_links", false))
		{
			addFileHost(
			"faststore\.org\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'faststore.org')]");
		}
		if (GM_getValue("Check_prefiles_dot_com_links", false))
		{
			addFileHost(
			"prefiles\.com\/\\w+",
			'id="method_free',
			'File not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'prefiles.com')]");
		}
		if (GM_getValue("Check_doraupload_dot_com_links", false))
		{
			addFileHost(
			"doraupload\.com\/\\w+",
			'btn_download|name="method_free',
			'class="error-code|Could Not Be Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'doraupload.com')]");
		}
        if (GM_getValue("Check_up07_dot_net_links", false))
		{
			addFileHost(
			"up07\.net\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'up07.net')]");
		}
		if (GM_getValue("Check_up07_dot_me_links", false))
		{
			addFileHost(
			"up07\.me\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'up07.me')]");
		}
		if (GM_getValue("Check_fileupload_dot_pw_links", false))
		{
			addFileHost(
			"fileupload\.pw\/\\w+",
			'value="Free"',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'fileupload.pw')]");
		}
		if (GM_getValue("Check_swoopshare_dot_com_links", false))
		{
			addFileHost(
			"(?:.swoopshare)\\.com\/\\w+",
			'Click below to start|Klicken Sie nachfolgend|Cliquez ci-après pour|Cliccate qui per iniziare|Klik hierna om het bestand|Haga ahora clic para iniciar la',
			'<input type="file" name="f"',
			'optional--',
			'optional2--',
			"//a[contains(@href,'swoopshare.com')]"
			);
		}
		if (GM_getValue("Check_filenuke_dot_com_links", false))
		{
			addFileHost(
			"filenuke\.com\/\\w+",
			'Download File',
			'Earn with us',
			'optional--',
      'optional2--',
			"//a[contains(@href,'filenuke.com')]"
			);
		}
		if (GM_getValue("Check_vidto_dot_me_links", false))
		{
			addFileHost(
			"vidto\.me\/\\w+",
			'Proceed to video',
			'Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'vidto.me')]"
			);
		}
		if (GM_getValue("Check_sharesix_dot_com_links", false))
		{
			addFileHost(
			"(?:sharesix\\.com|sharesix\\.net)\/\\w+",
			'Download File',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'sharesix.com') or contains(@href,'sharesix.net/')]"
			);
		}
		if (GM_getValue("Check_down4files_dot_com_links", false))
		{
			addFileHost(
			"down4files\.com\/\\w+",
			'down_table.png',
			'style="color:#d33|Error</td>|width:500px;text-align:left;">',
			'optional--',
      'optional2--',
			"//a[contains(@href,'down4files.com')]"
			);
		}
		if (GM_getValue("Check_filehost_dot_pw_links", false))
		{
			addFileHost(
			"filehost\.pw\/\\w+",
			'name="method_free',
			'>Error<|style="color:#d33;">|No such file|FILE NOT FOUND',
			'optional--',
      'optional2--',
			"//a[contains(@href,'filehost.pw')]"
			);
		}
		if (GM_getValue("Check_alfafile_dot_net_links", false))
		{
			addFileHost(
			"alfafile\.net\/\\w+",
			'id="slow_download_btn',
			'class="error-box">',
			'optional--',
      'optional2--',
			"//a[contains(@href,'alfafile.net')]"
			);
		}
		if (GM_getValue("Check_multiup_dot_org_links", false))
		{
			addFileHost(
			"multiup\\.(?:org|eu|io)\/\\w+",
			'<title>Download|class="link-download btn"|<h5>DOWNLOAD</h5>|<h5>TÉLÉCHARGER</h5>|<title>Télécharger',
			'File not found|alert-error">|icon-white icon-warning-sign">|<title>Fichier introuvable',
			'optional--',
      'optional2--',
			"//a[contains(@href,'multiup.org') or contains(@href,'multiup.io') or contains(@href,'multiup.eu')]"
			);
		}
	  if (GM_getValue("Check_file_dot_al_links", false))
		{
			addFileHost(
			"file\\.al|1f.al",
			'method_free',
			'style="width:500px;text-align:left;">|invalid license_key',
			'optional--',
			'optional2--',
			"//a[contains(@href,'file.al') or contains(@href,'1f.al')]"
			);
		}
		if (GM_getValue("Check_dailyuploads_dot_net_links", false))
		{
			addFileHost(
			"dailyuploads\.net\/\\w+",
			'Create download link<|current">Download link',
			'<div style="width:500px;text-align:left;">',
			'optional--',
      'optional2--',
			"//a[contains(@href,'dailyuploads.net')]"
			);
		}
		if (GM_getValue("Check_sharehost_dot_eu_links", false))
		{
			addFileHost(
			"sharehost\.eu\/\\w+",
			'/?v=download_free&',
			'Errors occured|Wystąpiły błędy',
			'optional--',
      'optional2--',
			"//a[contains(@href,'sharehost.eu')]"
			);
		}
		if (GM_getValue("Check_pornfile_dot_cz_links", false))
		{
			addFileHost(
			"pornfile\.cz",
			'Stáhnout soubor|Stáhnout pomalu|t-time">15 minut|Stáhnout rychle',
			'Soubor byl smazán|Stránka nenalezena',
			'optional--',
      'optional2--',
			"//a[contains(@href,'pornfile.cz')]"
			);
		}
 		if (GM_getValue("Check_pinkfile_dot_cz_links", false))
		{
			addFileHost(
			"pinkfile\.cz",
			'Stáhnout soubor|Stáhnout pomalu|t-time">15 minut|Stáhnout rychle',
			'Soubor byl smazán|Stránka nenalezena',
			'optional--',
      'optional2--',
			"//a[contains(@href,'pinkfile.cz')]"
			);
		}
		if (GM_getValue("Check_pornoid_dot_cz_links", false))
		{
			addFileHost(
			"pornoid\.cz\/\\w+",
			'class="btn btn-large btn-download',
			'Soubor byl smazán',
			'optional--',
      'optional2--',
			"//a[contains(@href,'pornoid.cz')]"
			);
		}
		if (GM_getValue("Check_file_dash_share_dot_top_links", false))
		{
			addFileHost(
			"file-share\.top\/\\w+",
			'btn-success btn-lg download',
			'Stránka neexistuje|404 Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'file-share.top')]"
			);
		}
		if (GM_getValue("Check_bitster_dot_cz_links", false))
		{
			addFileHost(
			"bitster\.cz\/",
			'section" content="VIDEO"|section" content="ARCHIVE"',
			'section" content=""',
			'optional--',
      'optional2--',
			"//a[contains(@href,'bitster.cz')]"
			);
		}
		if (GM_getValue("Check_rapidu_dot_net_links", false))
		{
			addFileHost(
			"rapidu\.net\/\\w+",
			'onclick="downloadFreeFile',
			'img/error.png|404 - Nie znaleziono pliku|404 - File not found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'rapidu.net')]"
			);
		}
		if (GM_getValue("Check_dinoshare_dot_cz_links", false))
		{
			addFileHost(
			"dinoshare\.cz\/\\w+",
			'file-data-vertical-line clearfix">',
			'Soubor byl pravděpodobně smazán|error-icon.png"|Stahuj zdarma neomezenou rychlostí!|http-equiv="refresh" content="0|ta-file_size">0</span>',
			'optional--',
      'optional2--',
			"//a[contains(@href,'dinoshare.cz')]"
			);
		}
		if (GM_getValue("Check_rapidrar_dot_com_links", false))
		{
			addFileHost(
			"rapidrar\.com\/\\w+",
			'value="Free Download',
			'<div style="width:500px;text-align:left;">',
			'optional--',
      'optional--',
			"//a[contains(@href,'rapidrar.com')]"
			);
		}
        if (GM_getValue("Check_rapidrar_dot_cr_links", false))
		{
			addFileHost(
			"rapidrar\.cr\/\\w+",
			'value="Free Download',
			'<div style="width:500px;text-align:left;">',
			'optional--',
      'optional--',
			"//a[contains(@href,'rapidrar.cr')]"
			);
		}
		if (GM_getValue("Check_filesupload_dot_org_links", false))
		{
			addFileHost(
			"filesupload\.org\/\\w+",
			'<a href="/download-or-watch/|unlock download|content="Download file',
			'content="error|pageErrors',
			'You must wait 1 Hour between downloads',
      'optional--',
			"//a[contains(@href,'filesupload.org')]"
			);
		}
		if (GM_getValue("Check_filecad_dot_com_links", false))
		{
			addFileHost(
			"filecad\.com\/\\w+",
			'<title>Download-|<div class="heading-1">Download-|btn btn-default',
			'content="404|<title>404 Error|<div class="heading-1">404 Error',
			'optional--',
      'optional--',
			"//a[contains(@href,'filecad.com')]"
			);
		}
		if (GM_getValue("Check_file_dot_up09_dot_com_links", false))
		{
			addFileHost(
			"file.up09\.com\/\\w+",
			'name="method_free',
			'style="width:500px;text-align:left;">',
			'optional--',
      'optional--',
			"//a[contains(@href,'file.up09.com')]"
			);
		}
		if (GM_getValue("Check_lunaticfiles_dot_com_links", false))
		{
			addFileHost(
			"lunaticfiles\.com\/\\w+",
			'name="method_free"',
			'style="width:500px;text-align:left;">|Error 404|File Not Found|<Title>Error',
			'optional--',
      'optional--',
			"//a[contains(@href,'lunaticfiles.com')]"
			);
		}
		if (GM_getValue("Check_upload_dot_af_links", false))
		{
			addFileHost(
			"upload\.af\/\\w+",
			'id="method_free"',
			'<h1>File Not Found</|Les causes possibles de cette erreur seraient|could not be found|est pas disponible|Le fichier que vous recherchez n|Datei konnte nicht gefunden werden|م يتم إيجاد الملف المطلوب , عذراً للإزعاج|nie zostal odnaleziony|ファイルが見つかりません',
			'optional--',
      'optional--',
			"//a[contains(@href,'upload.af')]"
			);
		}
		if (GM_getValue("Check_filedwon_dot_info_links", false))
		{
			addFileHost(
			"filedwon\.info\/\\w+",
			'name="method_free"',
			'File Not Found</b>|style="width:500px;text-align:left;">',
			'optional--',
      'optional--',
			"//a[contains(@href,'filedwon.info')]"
			);
		}
		if (GM_getValue("Check_uplod_dot_it_links", false))
		{
			addFileHost(
			"uplod\.it\/\\w+",
			'value="download2">|name="method_free',
			'<Title>Download </Title>',
			'optional--',
      'optional--',
			"//a[contains(@href,'uplod.it')]"
			);
		}
		if (GM_getValue("Check_disk_dot_yandex_dot_com_links", false))
		{
			addFileHost(
			"disk.yandex\.com\/\\w+",
			'nb-button _nb-small-button',
			'error code|Nothing found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'yadi.sk') or contains(@href,'yandex.com')]");
		}
		if (GM_getValue("Check_filespace_dot_com_links", false))
		{
			addFileHost(
			"filespace\.com\/\\w+",
			'method_free',
			'<div style="text-align:left;"><ul>|>File not found.<|blacklisted',
			'optional1--',
      'optional2--',
			"//a[contains(@href,'filespace.com')]",
            true);
		}
		if (GM_getValue("Check_filespace_dot_pl_links", false))
		{
			addFileHost(
			"filespace\.pl\/\\w+",
			'class="download-timer',
			'content="Error"|content="Błąd"',
			'optional1--',
      'optional2--',
			"//a[contains(@href,'filespace.pl')]",
             true);
		}
		if (GM_getValue("Check_myfiles_dot_onl_links", false))
		{
			addFileHost(
			"myfiles\.onl\/\\w+",
			'value="Free"',
			'<div style="width:500px;text-align:left;">',
			'optional1--',
      'optional2--',
			"//a[contains(@href,'myfiles.onl')]");
		}
		if (GM_getValue("Check_uploadserv_dot_com_links", false))
		{
			addFileHost(
			"uploadserv\.com\/\\w+",
			'color="red">http://uploadserv.com/',
			'content="Download File ">|<title>Download </title>',
			'optional1--',
      'optional2--',
			"//a[contains(@href,'uploadserv.com')]");
		}
		if (GM_getValue("Check_keepshare_dot_net_links", false))
		{
			addFileHost(
			"keepshare\.net\/\\w+",
			'method_free',
			'<div style="width:500px;text-align:left;">',
			'optional1--',
      'optional2--',
			"//a[contains(@href,'keepshare.net')]");
		}
/*		if (GM_getValue("Check_filescdn_dot_com_links", false))
		{
			addFileHost(
			"filescdn\.com\/\\w+",
			'btn_download',
			'icon-warning text-danger|no longer available',
			'optional1--',
      'optional2--',
			"//a[contains(@href,'filescdn.com')]");
		}
		if (GM_getValue("Check_filescdn_dot_net_links", false))
		{
			addFileHost(
			"filescdn\.net\/\\w+",
			'btn_download',
			'icon-warning text-danger|no longer available',
			'optional1--',
      'optional2--',
			"//a[contains(@href,'filescdn.net')]");
		} */
		if (GM_getValue("Check_katfile_dot_com_links", false))
		{
			addFileHost(
			"katfile\.com\/\\w+",
			'KB| MB|1.0 GB|id="method_free',
			'images/file_not_found.png"|images/404.png|images/404-remove.png"|File Not Found',
			'optional1--',
      ' GB',
			"//a[contains(@href,'katfile.com')]");
		}
        if (GM_getValue("Check_katfile_dot_cloud_links", false))
		{
			addFileHost(
			"katfile\.cloud\/\\w+",
			'KB| MB|1.0 GB|id="method_free',
			'images/file_not_found.png"|images/404.png|images/404-remove.png"|File Not Found',
			'optional1--',
      ' GB',
			"//a[contains(@href,'katfile.cloud')]");
		}
/*		if (GM_getValue("Check_filesin_dot_space_links", false))
		{
			addFileHost(
			"filesin\.space\/\\w+",
			'id="btn_download"',
			'class="err">|title="">VIEW PLAN<',
			'optional1--',
            'optional2',
			"//a[contains(@href,'filesin.space')]");
		} */
		if (GM_getValue("Check_upnito_dot_sk_links", false))
		{
			addFileHost(
			"(?:dl.\\.|)upnito\\.sk\/(download|subor|file)",
			'download.php',
			'notfound|upload\\-suborov\\.php"',
			'optional--',
			'optional2--',
			"//a[contains(@href,'upnito.sk')]"
			);
		}
		if (GM_getValue("Check_novafile_dot_com_links", false))
		{
			addFileHost(
			"novafile\.com\/\\w+",
			'id="regular-download|download1slow',
			'id="file-not-found',
			'optional1--',
            'id="premium-only',
			"//a[contains(@href,'novafile.com')]");
		}
		if (GM_getValue("Check_uploadgig_dot_com_links", false))
		{
			addFileHost(
			"uploadgig\.com",
			'id="countdownContainer',
			'File not found',
			'optional1--',
            'Premium Member only',
			"//a[contains(@href,'uploadgig.com')]");
		}
		if (GM_getValue("Check_mexashare_dot_com_links", false))
		{
			addFileHost(
			"mexashare\.com\/\\w+",
			'method_free',
			'404 Error|15px;border-radius:15px">|<div style="text-align:left;width:550px">|/images/error.png"|>File Not Found<',
			'optional1--',
      'optional2',
			"//a[contains(@href,'mexashare.com')]");
		}
		if (GM_getValue("Check_mx_dash_sh_dot_net_links", false))
		{
			addFileHost(
			"mx-sh\.net\/\\w+",
			'method_free',
			'404 Error|15px;border-radius:15px">|<div style="text-align:left;width:550px">|/images/error.png"|>File Not Found<',
			'optional1--',
      'optional2',
			"//a[contains(@href,'mx-sh.net')]");
		}
		if (GM_getValue("Check_mexa_dot_sh_links", false))
		{
			addFileHost(
			"mexa\.sh\/\\w+",
			'method_free',
			'404 Error|15px;border-radius:15px">|<div style="text-align:left;width:550px">|/images/error.png"|>File Not Found<',
			'optional1--',
      'optional2',
			"//a[contains(@href,'mexa.sh')]");
		}
		if (GM_getValue("Check_daofile_dot_com_links", false))
		{
			addFileHost(
			"daofile\.com\/\\w+",
			'class="captcha_code',
			'style="width:500px;text-align:left;">',
			'optional1--',
      'optional2',
			"//a[contains(@href,'daofile.com')]");
		}
		if (GM_getValue("Check_imagenetz_dot_de_links", false))
		{
			addFileHost(
			"imagenetz\.de\/\\w+",
			'id="download|download-button-wrapper|btn-download',
			'Download nicht Möglich|Diese Datei existiert nicht mehr',
			'optional1--',
      'optional2',
			"//a[contains(@href,'imagenetz.de')]");
		}
		if (GM_getValue("Check_uloz_dot_to_links", false))
		{
			addFileHost(
			"uloz\.to",
			'Slow download for free|Stáhnout pomalu zdarma|Stiahnuť pomaly zadarmo|Pobierz wolno za darmo|Stáhnout rychle',
			'pg-set-live pg-set-search|Stránka nenalezena',
			'optional1--',
      'optional2',
			"//a[contains(@href,'uloz.to') or contains(@href,'zachowajto.pl') or contains(@href,'ulozto.net') or contains(@href,'ulozto.sk')or contains(@href,'ulozto.cz')]");
		}
		if (GM_getValue("Check_ulozto_dot_net_links", false))
		{
			addFileHost(
			"ulozto.net",
			'Slow download for free|Stáhnout pomalu zdarma|Stiahnuť pomaly zadarmo|Pobierz wolno za darmo',
			'pg-set-live pg-set-search|Stránka nenalezena',
			'optional1--',
      'optional2',
			"//a[contains(@href,'uloz.to') or contains(@href,'zachowajto.pl') or contains(@href,'ulozto.net') or contains(@href,'ulozto.sk')or contains(@href,'ulozto.cz')]");
		}
		if (GM_getValue("Check_ulozto_dot_sk_links", false))
		{
			addFileHost(
			"ulozto\.sk",
			'Slow download for free|Stáhnout pomalu zdarma|Stiahnuť pomaly zadarmo|Pobierz wolno za darmo',
			'pg-set-live pg-set-search|Stránka nenalezena',
			'optional1--',
      'optional2',
			"//a[contains(@href,'uloz.to') or contains(@href,'zachowajto.pl') or contains(@href,'ulozto.net') or contains(@href,'ulozto.sk')or contains(@href,'ulozto.cz')]");
		}
		if (GM_getValue("Check_ulozto_dot_cz_links", false))
		{
			addFileHost(
			"ulozto\.cz",
			'Slow download for free|Stáhnout pomalu zdarma|Stiahnuť pomaly zadarmo|Pobierz wolno za darmo',
			'pg-set-live pg-set-search|Stránka nenalezena',
			'optional1--',
      'optional2',
			"//a[contains(@href,'uloz.to') or contains(@href,'zachowajto.pl') or contains(@href,'ulozto.net') or contains(@href,'ulozto.sk')or contains(@href,'ulozto.cz')]");
		}
		if (GM_getValue("Check_subyshare_dot_com_links", false))
		{
			addFileHost(
			"subyshare\.com\/\\w+",
			'id="method_free',
			'file was removed|class="err">|1s">404',
			'This server is in maintenance mode|m human"',
      'optional2',
			"//a[contains(@href,'subyshare.com')]",
			true);
		}
		if (GM_getValue("Check_fileshareup_dot_com_links", false))
		{
			addFileHost(
			"fileshareup\.com\/\\w+",
			'download-timer|btn-free-element|content="Download file',
			'content="Error"|content="error|heading-1">Error<',
			'optional1--',
      'optional2',
			"//a[contains(@href,'fileshareup.com')]");
		}
		if (GM_getValue("Check_mystore_dot_to_links", false))
		{
			addFileHost(
			"mystore\.to\/\\w+",
			'Download File',
			'file not found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'mystore.to/dl')]");
		}
		if (GM_getValue("Check_usercloud_dot_net_links", false))
		{
			addFileHost(
			"usercloud\.net\/\\w+",
			'content="download|var seconds = 60|type="password',
			'content="error|report_file.html">',
			'optional1--',
      'optional2',
			"//a[contains(@href,'usercloud.net')]");
		}
		if (GM_getValue("Check_workupload_dot_com_links", false))
		{
			addFileHost(
			"workupload\.com\/\\w+",
			'content="Download|id="download"',
			'File not found|img/not-found.jpg|Error message',
			'optional1--',
      'optional2',
			"//a[contains(@href,'workupload.com')]");
		}
		if (GM_getValue("Check_storageserver_dot_co_dot_uk_links", false))
		{
			addFileHost(
			"storageserver(?:\\.co)?\\.uk\/\\w+",
			'class="download">',
			'class="error center',
			'optional1--',
      'optional2',
			"//a[contains(@href,'storageserver.co.uk')]");
		}
		if (GM_getValue("Check_cloud_dot_mail_dot_ru_links", false))
		{
			addFileHost(
			"cloud(?:\\.mail)?\\.ru\/\\w+",
			'"kind": "file"',
			'"error": "not_exists"',
			'optional1--',
      'optional2',
			"//a[contains(@href,'cloud.mail.ru')]");
		}
		if (GM_getValue("Check_bdupload_dot_info_links", false))
		{
			addFileHost(
			"bdupload\.info\/\\w+",
			'class="downloadbtn">|id="downloadbtn"',
			'<div style="width:1000px;text-align:center;">|>File Not Found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'bdupload.info')]");
		}
		if (GM_getValue("Check_wayupload_dot_com_links", false))
		{
			addFileHost(
			"wayupload\.com\/\\w+",
			'class="nopay-btn gray"',
			'id="search-icon"|ajax-loader.gif"|id="banner-place"',
			'optional1--',
      'optional2',
			"//a[contains(@href,'wayupload.com')]");
		}
		if (GM_getValue("Check_uploadocean_dot_com_links", false))
		{
			addFileHost(
			"uploadocean\.com\/\\w+",
			'id="downloadbtn" class="downloadbtn"|id="countdown">Wait|id="method_free',
			'deleted.png"|File Not Found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'uploadocean.com')]");
		}
		if (GM_getValue("Check_erafile_dot_com_links", false))
		{
			addFileHost(
			"erafile\.com\/\\w+",
			'id="method_free',
			'<div style="width:500px;text-align:left;">',
			'optional1--',
      'optional2',
			"//a[contains(@href,'erafile.com')]");
		}
		if (GM_getValue("Check_upfiles_dot_net_links", false))
		{
			addFileHost(
			"upfiles\.net\/\\w+",
			'id="recaptcha2"|snail.png"',
			'Ten plik został usunięty.|style="margin-top:50px',
			'optional1--',
      'optional2',
			"//a[contains(@href,'upfiles.net/f/')]");
		}
		if (GM_getValue("Check_littlebyte_dot_net_links", false))
		{
			addFileHost(
			"littlebyte\.net\/\\w+",
			'>Free download<|>Скачать медленно<',
			'images/dmca.png">',
			'optional1--',
      'optional2',
			"//a[contains(@href,'littlebyte.net')]");
		}
		if (GM_getValue("Check_filesha_dot_com_links", false))
		{
			addFileHost(
			"filesha\.com\/\\w+",
			'>Download Free<',
			'STILL NEED CODE FOR DEAD LINKS',
			'optional1--',
      'optional2',
			"//a[contains(@href,'filesha.com')]");
		}
		if (GM_getValue("Check_ausfile_dot_com_links", false))
		{
			addFileHost(
			"ausfile\.com\/\\w+",
			'class="slow-download',
			'File Not Found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'ausfile.com')]");
		}
		if (GM_getValue("Check_upfile_dot_mobi_links", false))
		{
			addFileHost(
			"upfile\.mobi\/\\w+",
			'class="download_button"',
			'File Not Found|Possible causes:|Possíveis causas:|Nguyên nhân cháu nó bị xóa có thể do :|عرض پوزش، فایل های حذف شده|可能的原因:',
			'optional1--',
      'optional2',
			"//a[contains(@href,'upfile.mobi')]");
		}
		if (GM_getValue("Check_share_dot_az_links", false))
		{
			addFileHost(
			"share\.az\/\\w+",
			'id="btn_download"',
			'File Not Found|We are sorry',
			'optional1--',
      'optional2',
			"//a[contains(@href,'share.az')]");
		}
		if (GM_getValue("Check_uploadify_dot_net_links", false))
		{
			addFileHost(
			"uploadify\.net\/\\w+",
			'loading_small.gif"|class="free download-timer">',
			'<title>Error -',
			'optional1--',
      'optional2',
			"//a[contains(@href,'uploadify.net')]");
		}
		if (GM_getValue("Check_uploads_dot_to_links", false))
		{
			addFileHost(
			"uploads\.to\/\\w+",
			'class="g-recaptcha',
			'File Not Found|FILE NOT FOUND<',
			'optional1--',
      'optional2',
			"//a[contains(@href,'uploads.to')]");
		}
		if (GM_getValue("Check_fileshark_dot_pl_links", false))
		{
			addFileHost(
			"fileshark\.pl\/\\w+",
			'Nazwa pliku / File name|class="title">Pobierz plik',
			'Nie znaleziono pliku w serwisie.',
			'Strona jest dostępna wyłącznie dla użytkowników znajdujących się na terenie wybranych Państw.',
      'optional2',
			"//a[contains(@href,'fileshark.pl')]");
		}
		if (GM_getValue("Check_hotlink_dot_cc_links", false))
		{
			addFileHost(
			"hotlink\.cc\/",
			'id="downloadbtn">|class="free"|id="counttext1"',
			'Error 404|Page not found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'hotlink.cc')]");
		}
		if (GM_getValue("Check_up_dash_4ever_dot_com_links", false))
		{
			addFileHost(
			"(?:up-4ever\\.com\/\\w+)|(?:upload-4ever\\.com\/\\w+)|(?:up-4ever\\.org\/\\w+)|(?:up-4\\.net\/\\w+)",
			'name="method_free"',
			'File Not Found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'up-4ever.com') or contains(@href,'www.up-4.net') or contains(@href,'upload-4ever.com') or contains(@href,'up-4ever.org')]");
		}
		if (GM_getValue("Check_fileshd_dot_net_links", false))
		{
			addFileHost(
			"fileshd\.net\/\\w+",
			'name="method_free"',
			'Reason for deletion:|file was removed|<b class="err">|File Not Found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'fileshd.net')]");
		}
		if (GM_getValue("Check_flexydrive_dot_com_links", false))
		{
			addFileHost(
			"flexydrive\.com\/\\w+",
			'value="Free',
			'File Not Found|file_not_found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'flexydrive.com')]");
		}
		if (GM_getValue("Check_backin_dot_net_links", false))
		{
			addFileHost(
			"backin\.net\/\\w+",
			'id="downloadbtn|id="countdown"',
			'File Not Found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'backin.net')]");
		}
		if (GM_getValue("Check_9xupload_dot_me_links", false))
		{
			addFileHost(
			"9xupload\.me\/\\w+",
			'id="downloadbtn|mega/download.png',
			'Not Found|<title>404',
			'optional1--',
      'optional2',
			"//a[contains(@href,'9xupload.me')]");
		}
		if (GM_getValue("Check_sendit_dot_cloud_links", false))
		{
			addFileHost(
			"sendit\.cloud\/\\w+",
			'id="btn_download',
			'File Not Found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'sendit.cloud')]");
		}
		if (GM_getValue("Check_filefox_dot_cc_links", false))
		{
			addFileHost(
			"filefox\.cc",
			'btn-download1',
			'File Not Found|File could not be found',
			'please turn off your VPN/Proxy',
      'Premium</a> Members only',
			"//a[contains(@href,'filefox.cc')]");
		}
		if (GM_getValue("Check_uploadbank_dot_com_links", false))
		{
			addFileHost(
			"uploadbank\.com",
			'id="downloadbtn',
			'File Not Found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'uploadbank.com')]");
		}
		if (GM_getValue("Check_anonfile_dot_com_links", false))
		{
			addFileHost(
			"anonfile\\.com",
			'id="download-url" class="btn btn-primary btn-block" href=',
			'<title>404 -',
			'optional1--',
      'optional2',
			"//a[contains(@href,'anonfile.com')]");
		}
		if (GM_getValue("Check_gfycat_dot_com_links", false))
		{
			addFileHost(
			"gfycat\.com\/\\w+",
			'<head><title>',
			'title ng-bind',
			'optional1--',
      'optional2',
			"//a[contains(@href,'gfycat.com')]");
		}
		if (GM_getValue("Check_4downfiles_dot_org_links", false))
		{
			addFileHost(
			"4downfiles\.org\/\\w+",
			'Free Download',
			'Reason for deletion',
			'optional1--',
      'optional2',
			"//a[contains(@href,'4downfiles.org')]");
		}
		if (GM_getValue("Check_indishare_dot_me_links", false))
		{
			addFileHost(
			"indishare\\.me",
			'id="btn_download"',
			'File Not Found|"width:900px;text-align:center;">',
			'optional1--',
      'optional2',
			"//a[contains(@href,'indishare.me')]");
		}
		if (GM_getValue("Check_coolbytez_dot_com_links", false))
		{
			addFileHost(
			"coolbytez\\.com",
			'id="method_free"',
			'File Not Found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'coolbytez.com')]");
		}
		if (GM_getValue("Check_vidoza_dot_net_links", false))
		{
			addFileHost(
			"vidoza\.net\/\\w+",
			'btn btn-success',
			'File not found',
			'optional--',
			'This file is available only for Premium users|Этот файл распространяется только среди Премиум пользователей',
			"//a[contains(@href,'vidoza.net')]");
		}
		if (GM_getValue("Check_douploads_dot_com_links", false))
		{
			addFileHost(
			"douploads\\.com",
			'id="downloadBtnClick"',
			'id="errorpage">|Not Found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'douploads.com')]");
		}
		if (GM_getValue("Check_uploadkadeh_dot_com_links", false))
		{
			addFileHost(
			"uploadkadeh\\.com",
			'id="method_free"',
			'File Not Found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'uploadkadeh.com')]");
		}
		if (GM_getValue("Check_megaup_dot_net_links", false))
		{
			addFileHost(
			"megaup\\.net",
			'>download now</a>"|>Create Download Link<',
			'File Not Found|File is not publicly available.<|File has been removed',
			'optional1--',
      'optional2',
			"//a[contains(@href,'megaup.net')]");
		}
		if (GM_getValue("Check_upload4earn_dot_com_links", false))
		{
			addFileHost(
			"upload4earn\\.com\/\\w+",
			'name="method_free"',
			'File Not Found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'upload4earn.com')]");
		}
		if (GM_getValue("Check_uplod_dot_org_links", false))
		{
			addFileHost(
			"uplod\\.org\/\\w+",
			'id="downloadBtnClick"',
			'File Not Found',
			'optional1--',
      'optional2',
			"//a[contains(@href,'uplod.org')]");
		}
		if (GM_getValue("Check_sora_dot_io_links", false))
        {
      addFileHost(
      "sora\\.io\/\\w+",
      '</html>',
      '',
      'optional--',
      'optional2--',
      "//a[contains(@href,'sora.io')]");
      }
	  if (GM_getValue("Check_mon_dash_partage_dot_fr_links", false))
      {
      addFileHost(
      "mon-partage\\.fr\/\\w+",
      'Télécharger|id="bouton_download"',
      'Ce fichier n\'existe pas ou plus',
      'optional--',
      'optional2--',
      "//a[contains(@href,'mon-partage.fr')]");
      }
	  if (GM_getValue("Check_freshfile_dot_pl_links", false))
      {
      addFileHost(
      "freshfile\\.pl\/\\w+",
      'id="downloadFree"',
      'images/finfo.png" border="0" ',
      'optional--',
      'optional2--',
      "//a[contains(@href,'freshfile.pl')]");
      }
	  if (GM_getValue("Check_filerio_dot_in_links", false))
      {
      addFileHost(
      "filerio\\.in\/\\w+",
      'id="downloadbtn"|method_free',
      '<div style="width:500px;text-align:left;">|<b class="err">abuse</b>',
      'This server is in maintenance mode',
      'optional2--',
      "//a[contains(@href,'filerio.in')]");
      }
	  if (GM_getValue("Check_filedeluxe_dot_com_links", false))
      {
      addFileHost(
      "filedeluxe\\.com\/\\w+",
      'class="download-file">|Download file:',
      'File not found|vp-notfound',
      'This server is in maintenance mode',
      'optional2--',
      "//a[contains(@href,'filedeluxe.com')]");
        }
		if (GM_getValue("Check_megadl_dot_fr_links", false)) //folders
		{
			addFileHost(
			"megadl\\.fr",
			'2px solid red" class="ok btn-general btn-orange',
			'Not Found|do not exist',
			'optional--',
			'optional2--',
			"//a[contains(@href,'megadl.fr')]"
			);
		}
		if (GM_getValue("Check_upload2win_dot_com_links", false))
		{
			addFileHost(
			"upload2win\\.com",
			'name="method_free"',
			'File Not Found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'upload2win.com')]"
			);
		}
		if (GM_getValue("Check_filebonus_dot_com_links", false))
		{
			addFileHost(
			"filebonus\\.com",
			'name="method_free"',
			'File Not Found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'filebonus.com')]"
			);
		}
		if (GM_getValue("Check_filebonus_dot_net_links", false))
		{
			addFileHost(
			"filebonus\\.net",
			'name="method_free"',
			'File Not Found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'filebonus.net')]"
			);
		}
        if (GM_getValue("Check_uploadproper_dot_com_links", false))
		{
			addFileHost(
			"uploadproper\.com\/\\w+",
			'method_free',
			'File Not Found',
			'optional',
      'optional2',
			"//a[contains(@href,'uploadproper.com')]");
		}
		if (GM_getValue("Check_uploadproper_dot_net_links", false))
		{
			addFileHost(
			"uploadproper\.net\/\\w+",
			'method_free',
			'File Not Found',
			'optional',
      'optional2',
			"//a[contains(@href,'uploadproper.net')]");
		}
		if (GM_getValue("Check_rocketshare_dot_com_links", false))
		{
			addFileHost(
			"rocketshare\.com\/\\w+",
			'id="recaptcha"',
			'Nie znaleziono pliku',
			'optional',
      'optional2',
			"//a[contains(@href,'rocketshare.com')]");
		}
		if (GM_getValue("Check_udrop_dot_net_links", false))
		{
			addFileHost(
			"udrop\.net\/\\w+",
			'btn btn-default',
			'<title>Error - Udrop.net<',
			'optional',
      'optional2',
			"//a[contains(@href,'udrop.net')]");
		}
		if (GM_getValue("Check_fileupup_dot_com_links", false))
		{
			addFileHost(
			"fileupup\.com\/\\w+",
			'id="1method_free"',
			'>File Not Found<',
			'optional',
      'optional2',
			"//a[contains(@href,'fileupup.com')]");
		} /*
		if (GM_getValue("Check_bayfiles_dot_com_links", false))
		{
			addFileHost(
			"bayfiles\.com\/\\w+",
			'id="download-url"',
			'Not Found|not-found',
			'optional',
      'optional2',
			"//a[contains(@href,'bayfiles.com')]");
		} */
		if (GM_getValue("Check_ddl_dot_to_links", false))
		{
			addFileHost(
			"ddl\.to\/\\w+",
			'<button id="downloadbtn"|id="downloadbtn"',
			'File Not Found',
			'optional',
      'optional2',
			"//a[contains(@href,'ddl.to')]");
		}
		if (GM_getValue("Check_turbo_dot_to_links", false))
		{
			addFileHost(
			"turbo\\.to\/\\w+",
			'id="download-gate-info|id="file-list',
			'afterWait()|no files in this folder',
			'optional--',
			'optional2--',
			"//a[contains(@href,'turbo.to')]"
			);
		}
		if (GM_getValue("Check_hil_dot_to_links", false))
		{
			addFileHost(
			"hil\.to\/\\w+",
			'class="download-file',
			'style="width:16px;height:16px;border:0;|File not found|File was deleted or not found|Le fichier a été supprimé ou n|Файл не найден. Возможно он был удален',
			'optional--',
      'optional2--',
			"//a[contains(@href,'hil.to')]");
		}
		if (GM_getValue("Check_intoupload_dot_net_links", false))
		{
			addFileHost(
			"intoupload\.net\/\\w+",
			'id="downloadBtnClick"',
			'File Not Found',
			'optional',
      'optional2',
			"//a[contains(@href,'intoupload.net')]");
		}
		if (GM_getValue("Check_nelion_dot_me_links", false))
		{
			addFileHost(
			"nelion\.me\/\\w+",
			'id="method_free',
			'File Not Found',
			'optional--',
      'optional2--',
			"//a[contains(@href,'nelion.me')]");
		}
/*		if (GM_getValue("Check_dropapk_dot_com_links", false))
		{
			addFileHost(
			"dropapk\.com\/\\w+",
			'method_free',
			'File Not Found',
			'optional',
      'optional2',
			"//a[contains(@href,'dropapk.com')]");
		} */
		if (GM_getValue("Check_longfiles_dot_com_links", false))
		{
			addFileHost(
			"longfiles\.com\/\\w+",
			'id="btn_download"',
			'File Not Found',
			'optional',
      'optional2',
			"//a[contains(@href,'longfiles.com')]");
		}
/*		if (GM_getValue("Check_wupfile_dot_com_links", false))
		{
			addFileHost(
			"wupfile\.com\/\\w+",
			'id="method_free"',
			'File Not Found|The file was removed by administrator',
			'optional',
      'optional2',
			"//a[contains(@href,'wupfile.com')]");
		} */
		if (GM_getValue("Check_oxycloud_dot_com_links", false))
		{
			addFileHost(
			"oxycloud\.com\/\\w+",
			'download-timer|btn-free',
			'content="Błąd"|content="Error"',
			'optional',
      'optional2',
			"//a[contains(@href,'oxycloud.com')]");
		}
		if (GM_getValue("Check_fileup_dot_cc_links", false))
		{
			addFileHost(
			"fileup\.cc\/\\w+",
			'id="method_free"',
			'File Not Found',
			'optional',
      'optional2',
			"//a[contains(@href,'fileup.cc')]");
		}
		if (GM_getValue("Check_mixloads_dot_com_links", false))
		{
			addFileHost(
			"mixloads\.com\/\\w+",
			'id="method_free"',
			'Nothing found here|File Not Found',
			'optional',
      'optional2',
			"//a[contains(@href,'mixloads.com')]");
		}
/*		if (GM_getValue("Check_dropapk_dot_to_links", false))
		{
			addFileHost(
			"dropapk\.to\/\\w+",
			'id="method_free"',
			'Nothing found here|File Not Found',
			'optional',
      'optional2',
			"//a[contains(@href,'dropapk.to')]");
		} */
		if (GM_getValue("Check_upload_dot_st_links", false))
		{
			addFileHost(
			"upload\.st\/\\w+",
			'btn btn-primary|id="download-wrapper"',
			'could not be found|id="error-container"',
			'optional--',
      'optional--',
			"//a[contains(@href,'upload.st')]"
			);
		}
		if (GM_getValue("Check_europeup_dot_com_links", false))
		{
			addFileHost(
			"europeup\.com\/\\w+",
			'MB</li>',
			'>File Not Found<',
			'optional--',
      'GB</li>',
			"//a[contains(@href,'europeup.com')]"
			);
		}
		if (GM_getValue("Check_earn4files_dot_com_links", false))
		{
			addFileHost(
			"earn4files\.com\/\\w+",
			'method_free',
			'File Not Found',
			'optional--',
      'optional--',
			"//a[contains(@href,'earn4files.com')]"
			);
		}
		if (GM_getValue("Check_speed_dash_down_dot_org_links", false))
		{
			addFileHost(
			"speed-down\.org\/\\w+",
			'method_free',
			'File Not Found',
			'optional--',
      'optional--',
			"//a[contains(@href,'speed-down.org')]"
			);
		}
		if (GM_getValue("Check_uploadev_dot_org_links", false))
		{
			addFileHost(
			"uploadev\.org\/\\w+",
			'Seconds</p>',
			'File Not Found|Files have been removed',
			'optional--',
      'optional--',
			"//a[contains(@href,'uploadev.org')]"
			);
		}
		if (GM_getValue("Check_usersdrive_dot_com_links", false))
		{
			addFileHost(
			"usersdrive\.com\/\\w+",
			'id="downloadbtn',
			'File Not Found',
			'optional--',
      'optional--',
			"//a[contains(@href,'usersdrive.com')]"
			);
		}
		if (GM_getValue("Check_desiupload_dot_to_links", false))
		{
			addFileHost(
			"(?:desiupload\\.to|desiupload\\.co)\/\\w+",
			'id="countdown"|id="downloadbtn"',
			'>File Not Found<',
			'optional--',
      'optional--',
      "//a[contains(@href,'desiupload.to') or contains(@href,'desiupload.co')]"
			);
		}
		if (GM_getValue("Check_mixdrop_dot_co_links", false))
		{
			addFileHost(
			"mixdrop\.co",
			'class="btn download-btn',
			'class="panel download error',
			'optional--',
      'optional--',
			"//a[contains(@href,'mixdrop.co')]"
			);
		}
		if (GM_getValue("Check_gounlimited_dot_to_links", false))
		{
			addFileHost(
			"gounlimited\.to",
			'>Download<',
			'<title>404',
			'optional--',
      'optional--',
			"//a[contains(@href,'gounlimited.to')]"
			);
		}
		if (GM_getValue("Check_turb_dot_to_links", false))
		{
			addFileHost(
			"turb\.to",
			'id="download-gate-info|id="file-list|class="word">downloading',
			'afterWait()|no files in this folder|File was deleted or not found',
			'optional--',
      'optional--',
			"//a[contains(@href,'turb.to')]"
			);
		}
		if (GM_getValue("Check_turb_dot_pw_links", false))
		{
			addFileHost(
			"turb\.pw",
			'id="download-gate-info|id="file-list|class="word">downloading',
			'afterWait()|no files in this folder|File was deleted or not found',
			'optional--',
      'optional--',
			"//a[contains(@href,'turb.pw')]"
			);
		}
		if (GM_getValue("Check_datator_dot_cz_links", false))
		{
			addFileHost(
			"datator\.cz",
			'class="button_download',
			'class="deleted"',
			'optional--',
      'optional--',
			"//a[contains(@href,'datator.cz')]"
			);
		}
		if (GM_getValue("Check_edisk_dot_cz_links", false))
		{
			addFileHost(
			"edisk\.cz",
			'stáhnout pomalu|fa-download',
			'Tento soubor již neexistuje z následujích důvodů',
			'optional--',
      'optional--',
			"//a[contains(@href,'edisk.cz')]"
			);
		}
		if (GM_getValue("Check_mega4up_dot_com_links", false))
		{
			addFileHost(
			"mega4up\.com\/\\w+",
			'value="Free Download',
			'File Not Found',
			'optional--',
      'optional--',
			"//a[contains(@href,'mega4up.com')]"
			);
		}
		if (GM_getValue("Check_filesite_dot_xyz_links", false))
		{
			addFileHost(
			"filesite\.xyz\/\\w+",
			'span id="countdown">',
			'Not Found',
			'optional--',
      'optional--',
			"//a[contains(@href,'filesite.xyz')]"
			);
		}
		if (GM_getValue("Check_lilfile_dot_com_links", false))
		{
			addFileHost(
			"lilfile\.com\/\\w+",
			'content="Download',
			'File Not Available|nofile_thumb',
			'optional--',
      'optional--',
			"//a[contains(@href,'lilfile.com')]"
			);
		}
/*		if (GM_getValue("Check_ortofiles_dot_com_links", false))
		{
			addFileHost(
			"ortofiles\.com\/\\w+",
			'id="method_free"',
			'File Not Found',
			'optional--',
      'optional--',
			"//a[contains(@href,'ortofiles.com')]"
			);
		}
		if (GM_getValue("Check_file_dot_bz_links", false))
		{
			addFileHost(
			"file\.bz",
			'id="download-url"',
			'id="error-container',
			'optional--',
      'optional--',
			"//a[contains(@href,'file.bz')]"
			);
		} */
		if (GM_getValue("Check_letsupload_dot_to_links", false))
		{
			addFileHost(
			"letsupload\.to",
			'class="btn btn-free-element|class="fa fa-cloud-download"|class="download-timer"',
			'pageErrors|no-side-margin|class="fa fa-home|class="alert alert-warning"',
			'optional--',
      'optional--',
			"//a[contains(@href,'letsupload.to')]"
			);
		}
		if (GM_getValue("Check_filemia_dot_co_links", false))
		{
			addFileHost(
			"filemia\.co",
			'class="btn btn-free-element">',
			'NEED DEAD CODE',
			'minutes between downloads',
      'optional--',
			"//a[contains(@href,'filemia.co')]"
			);
		}
		if (GM_getValue("Check_ddownload_dot_com_links", false))
		{
			addFileHost(
			"ddownload\.com\/\\w+",
			'id="downloadbtn"',
			'File Not Found',
			'optional--',
      'optional--',
			"//a[contains(@href,'ddownload.com')]"
			);
		}
		if (GM_getValue("Check_centfile_dot_com_links", false))
		{
			addFileHost(
			"centfile\.com\/\\w+",
			'id="downloadbtn"',
			'File Not Found',
			'optional--',
      'optional--',
			"//a[contains(@href,'centfile.com')]"
			);
		}
		if (GM_getValue("Check_uploadrar_dot_com_links", false))
		{
			addFileHost(
			"uploadrar\.com\/\\w+",
			'id="downloadbtn"|method_free',
			'File Not Found',
			'optional--',
            'optional--',
			"//a[contains(@href,'uploadrar.com')]"
			);
		}
 /*       if (GM_getValue("Check_miui_dot_rahim_dash_soft_dot_com_links", false))
		{
			addFileHost(
			"miui\.rahim-soft\.com\/\\w+",
			'id="downloadbtn"|method_free',
			'File Not Found',
			'optional--',
            'optional--',
			"//a[contains(@href,'miui.rahim-soft.com')]"
			);
		} */
		if (GM_getValue("Check_fireget_dot_com_links", false))
		{
			addFileHost(
			"fireget\.com\/\\w+",
			'method_free',
			'Not Found',
			'optional--',
      'optional--',
			"//a[contains(@href,'fireget.com')]"
			);
		}
		if (GM_getValue("Check_turb_dot_cc_links", false))
		{
			addFileHost(
			"turb\.cc",
			'id="download-gate-info|id="file-list|class="word">downloading',
			'afterWait()|no files in this folder|File was deleted or not found',
			'optional--',
      'optional--',
			"//a[contains(@href,'turb.cc')]"
			);
		}
		if (GM_getValue("Check_uploadship_dot_com_links", false))
		{
			addFileHost(
			"uploadship\.com\/\\w+",
			'class="download-timer-seconds"',
			'Not Found',
			'optional--',
      'optional--',
			"//a[contains(@href,'uploadship.com')]"
			);
		}
		if (GM_getValue("Check_stackstorage_dot_com_links", false))
		{
			addFileHost(
			"(?:stackstorage)\\.com\/\\w+",
			'btn btn-primary',
			'class="error error--404"',
			'optional--',
			'optional2--',
			"//a[contains(@href,'stackstorage.com')]"
			);
		}
		if (GM_getValue("Check_lanzous_dot_com_links", false))
		{
			addFileHost(
			"(?:lanzous)\\.com\/\\w+",
			'verify-btn|shortcut icon',
			'class="off1">|文件取消分享了',
			'optional--',
			'optional2--',
			"//a[contains(@href,'lanzous.com')]"
			);
		}
    if (GM_getValue("Check_lanzoux_dot_com_links", false))
		{
			addFileHost(
			"lanzoux\.com\/\\w+",
			'verify-btn|shortcut icon',
			'class="off1">|文件取消分享了',
			'optional--',
			'optional2--',
			"//a[contains(@href,'lanzoux.com')]"
			);

		}
		if (GM_getValue("Check_pan_dot_lanzou_dot_com_links", false))
		{
			addFileHost(
			"pan.lanzou\.com\/\\w+",
			'文件受密码保护，请输入密码继续下载|id="filemore" ',
			'share_notfound.png|background:#f9f9f9|class="error-main clearfix"|404 page not found|<title>Error<',
			'optional--',
      'optional2--',
			"//a[contains(@href,'pan.lanzou.com')]"
			);
		}
		if (GM_getValue("Check_lanzoui_dot_com_links", false))
		{
			addFileHost(
			"lanzoui\.com\/\\w+",
			'verify-btn|shortcut icon',
			'class="off1">|文件取消分享了',
			'optional--',
			'optional2--',
			"//a[contains(@href,'lanzoui.com')]"
			);

		}
		if (GM_getValue("Check_share_dot_weiyun_dot_com_links", false))
		{
			addFileHost(
			"share.weiyun\.com\/\\w+",
			'= {"shareInfo":',
			'= {"error":',
			'optional--',
      'optional2--',
			"//a[contains(@href,'share.weiyun.com')]"
			);
		}
		if (GM_getValue("Check_cloud_dot_189_dot_cn_links", false))
		{
			addFileHost(
			"cloud.189\.cn\/\\w+",
			'class="downloadUrl"',
			'images/errorsimg',
			'optional--',
      'optional2--',
			"//a[contains(@href,'cloud.189.cn')]"
			);
		}
		if (GM_getValue("Check_userupload_dot_net_links", false))
		{
			addFileHost(
			"userupload\.net\/\\w+",
			'id="downloadbtn',
			'File Not Found',
			'optional--',
      'optional--',
			"//a[contains(@href,'userupload.net')]"
			);
		}
		if (GM_getValue("Check_krakenfiles_dot_com_links", false))
		{
			addFileHost(
			"krakenfiles\.com\/\\w+",
			'download-now-text',
			'nk-error|File not found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'krakenfiles.com')]"
			);

		}
		if (GM_getValue("Check_drop_dot_download_links", false))
		{
			addFileHost(
			"drop\.download\/\\w+",
			'method_free|class="downloadbtn btn|class="download-btn|Create Download Link|id="downloadbtn',
			'File not found|File Not Found|could not be found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'drop.download')]"
			);

		}
		if (GM_getValue("Check_xubster_dot_com_links", false))
		{
			addFileHost(
			"xubster\.com\/\\w+",
			'.1 MB|.2 MB|.3 MB|.4 MB|.5 MB|.6 MB|.7 MB|.8 MB|.9 MB',
			'File Not Found|fichier non trouvé|(0 MB)|content="XUBSTER Remote Storage Solutions',
			'optional--',
			' GB',
			"//a[contains(@href,'xubster.com')]"
			);

		}
		if (GM_getValue("Check_fastdrive_dot_io_links", false))
		{
			addFileHost(
			"fastdrive\.io\/\\w+",
			'class="btn-free-element">',
			'Page Not Found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'fastdrive.io')]"
			);

		}
/*		if (GM_getValue("Check_anonfiles_dot_com_links", false))
		{
			addFileHost(
			"anonfiles\.com\/\\w+",
			'id="download-url',
			'<title>404',
			'optional--',
			'optional2--',
			"//a[contains(@href,'anonfiles.com')]"
			);

		} */
		if (GM_getValue("Check_fastclick_dot_to_links", false))
		{
			addFileHost(
			"fastclick\.to\/\\w+",
			'id="method_free',
			'File Not Found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'fastclick.to')]"
			);

		}
		if (GM_getValue("Check_fastfile_dot_cc_links", false))
		{
			addFileHost(
			"fastfile\.cc\/\\w+",
			'method_free',
			'File Not Found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'fastfile.cc')]"
			);

		}
		if (GM_getValue("Check_wrzucaj_dot_pl_links", false))
		{
			addFileHost(
			"wrzucaj\.pl\/\\w+",
			'downloadbtn|POWOLNE POBIERANIE',
			'File Not Found|Plik został usunięty z powodu braku aktywności.',
			'optional--',
			'optional2--',
			"//a[contains(@href,'wrzucaj.pl')]"
			);

		}
		if (GM_getValue("Check_hexupload_dot_net_links", false))
		{
			addFileHost(
			"hexupload\.net\/\\w+",
			'method_free',
			'File Not Found|fichier non trouvé',
			'optional--',
			'optional2--',
			"//a[contains(@href,'hexupload.net')]"
			);

		}
		if (GM_getValue("Check_mega4up_dot_org_links", false))
		{
			addFileHost(
			"mega4up\.org\/\\w+",
			'value="Free Download',
			'File Not Found',
			'optional--',
      'optional--',
			"//a[contains(@href,'mega4up.org')]"
			);
		}
		if (GM_getValue("Check_1dl_dot_net_links", false))
		{
			addFileHost(
			"1dl\.net\/\\w+",
			'method_free',
			'File Not Found',
			'optional--',
			'optional2--',
			"//a[contains(@href,'1dl.net')]"
			);

		}
		if (GM_getValue("Check_mega4upload_dot_com_links", false))
		{
			addFileHost(
			"mega4upload\.com\/\\w+",
			'value="Free Download',
			'File Not Found',
			'optional--',
            'optional--',
			"//a[contains(@href,'mega4upload.com')]"
			);
		}
        if (GM_getValue("Check_loadit_dot_io_links", false))
		{
			addFileHost(
			"loadit\.io\/\\w+",
			'triggerFreeDownload',
			'Not Found|title>404',
			'optional--',
            'optional--',
			"//a[contains(@href,'loadit.io')]"
			);
		}
		if (GM_getValue("Check_wplik_dot_com_links", false))
		{
			addFileHost(
			"wplik\.com\/\\w+",
			'method_free',
			'Nie znaleziono pliku|File not found',
			'optional--',
            'optional--',
			"//a[contains(@href,'wplik.com')]"
			);
		}
		if (GM_getValue("Check_openload_dot_cc_links", false))
		{
			addFileHost(
			"openload\.cc\/\\w+",
			'id="download-url',
			'<title>404|Not Found',
			'optional--',
            'optional--',
			"//a[contains(@href,'openload.cc')]"
			);
		}
        if (GM_getValue("Check_down_dot_fast_dash_down_dot_com_links", false))
		{
			addFileHost(
			"down.fast-down\.com\/\\w+",
			'method_free',
			'File Not Found',
			'optional--',
      'optional--',
			"//a[contains(@href,'down.fast-down.com')]"
			);
		}
       	if (GM_getValue("Check_send_dot_cm_links", false))
		{
			addFileHost(
			"send\.cm\/\\w+",
			'id="downloadbtn',
			'file expired|t exist|<Title>404<',
			'optional--',
            'optional--',
			"//a[contains(@href,'send.cm')]"
			);
		}
        if (GM_getValue("Check_send_dot_now_links", false))
		{
			addFileHost(
			"send\.now\/\\w+",
			'id="downloadbtn',
			'file expired|t exist|<Title>404<',
			'optional--',
            'optional--',
			"//a[contains(@href,'send.now')]"
			);
		}
		if (GM_getValue("Check_filerice_dot_com_links", false))
		{
			addFileHost(
			"filerice\.com\/\\w+",
			'method_free',
			'No such file|class="alert alert-danger',
			'optional--',
            'optional--',
			"//a[contains(@href,'filerice.com')]"
			);
		}
		if (GM_getValue("Check_takefile_dot_link_links", false))
		{
			addFileHost(
			"takefile\.link\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
            'Premium Users only',
			"//a[contains(@href,'takefile.link')]");
		}
        if (GM_getValue("Check_yourupload_dot_com_links", false))
		{
			addFileHost(
			"yourupload\.com\/\\w+",
			'btn btn-success',
			'File Not Found',
			'optional--',
            'optional--',
			"//a[contains(@href,'yourupload.com')]"
			);
		}
        if (GM_getValue("Check_dbree_dot_me_links", false))
		{
			addFileHost(
			"dbree\.me\/\\w+",
			'btn-default center-block',
			'File Not Found',
			'optional--',
            'optional--',
			"//a[contains(@href,'dbree.me')]"
			);
		}
        if (GM_getValue("Check_pixeldrain_dot_com_links", false))
		{
			addFileHost(
			"pixeldrain\.com\/\\w+",
			'This file has been shared',
			'File Not Found',
			'optional--',
            'optional--',
			"//a[contains(@href,'pixeldrain.com')]"
			);
		}
        if (GM_getValue("Check_pixeldra_dot_in_links", false))
		{
			addFileHost(
			"pixeldra\.in\/\\w+",
			'content="website',
			'File Not Found|property="og:image',
			'optional--',
            'optional--',
			"//a[contains(@href,'pixeldra.in')]"
			);
		}
        if (GM_getValue("Check_fireload_dot_com_links", false))
		{
			addFileHost(
			"fireload\.com\/\\w+",
			'dl-button|initialize_recaptcha',
			'File Not Found',
			'optional--',
            'optional--',
			"//a[contains(@href,'fireload.com')]"
			);
		}
        if (GM_getValue("Check_uploady_dot_io_links", false))
		{
			addFileHost(
			"uploady\.io\/\\w+",
			'method_free',
			'File Not Found',
			'optional--',
            'optional--',
			"//a[contains(@href,'uploady.io')]"
			);
		}
        if (GM_getValue("Check_rapidcloud_dot_cc_links", false))
		{
			addFileHost(
			"rapidcloud\.cc\/\\w+",
			'id="countdown|id="downloadbtn',
			'File Not Found',
			'optional--',
            'optional--',
			"//a[contains(@href,'rapidcloud.cc')]"
			);
		}
        if (GM_getValue("Check_filedot_dot_to_links", false))
		{
			addFileHost(
			"(?:filedot\\.to|filedot\\.top)\/\\w+",
			'class="downloadbtn">|method_free|id="downloadbtn',
			'File Not Found',
			'optional--',
            'optional--',
			"//a[contains(@href,'filedot.to') or contains(@href,'filedot.top')]"
			);
		}
        if (GM_getValue("Check_download_dot_gg_links", false))
		{
			addFileHost(
			"download\.gg\/\\w+",
			'>Download <',
			'FILE NOT FOUND|>ERROR 404<',
			'optional--',
            'optional--',
			"//a[contains(@href,'download.gg')]"
			);
		}
        if (GM_getValue("Check_upload42_dot_com_links", false))
		{
			addFileHost(
			"upload42\.com\/\\w+",
			'NEED CODE FOR LIVE LINKS',
			'Not Found',
			'optional--',
            'alert alert-danger|>You can download files up to 256 Mb only.',
			"//a[contains(@href,'upload42.com')]"
			);
		}
        if (GM_getValue("Check_rosefile_dot_net_links", false))
		{
			addFileHost(
			"rosefile\.net\/\\w+",
			'id="start-wait"',
			'404 File does not exist',
			'optional--',
            'alert alert-danger|>You can download files up to 256 Mb only.',
			"//a[contains(@href,'rosefile.net')]"
			);
		}
        if (GM_getValue("Check_terabytez_dot_org_links", false))
		{
			addFileHost(
			"terabytez\.org\/\\w+",
			'NEED CODE FOR LIVE LINKS',
			'File has been removed|text-white">Error<',
			'optional--',
            'optional--',
			"//a[contains(@href,'terabytez.org')]"
			);
		}
        if (GM_getValue("Check_qiwi_dot_gg_links", false))
		{
			addFileHost(
			"qiwi\.gg\/\\w+",
			'data-lighttheme="true"',
			'id="__next_error',
			'optional--',
            'optional--',
			"//a[contains(@href,'qiwi.gg')]"
			);
		}
        if (GM_getValue("Check_darkibox_dot_com_links", false))
        {
            addFileHost(
            "darkibox\.com\/\\w+",
            'Proceed to video|btn_download',
            '404|Not Found|file_not_found|DMCA',
            'optional--',
            'optional--',
            "//a[contains(@href,'darkibox.com')]"
            );
        }
/*		if (GM_getValue("Check_frdl_dot_to_links", false))
		{
			addFileHost(
			"(?:frdl\\.to|frdl\\.pw)\/\\w+",
			'id="downloadbtnfree',
			'need to add',
			'optional--',
            'optional--',
            "//a[contains(@href,'frdl.to') or contains(@href,'frdl.pw')]"
			);
		} */
		if (GM_getValue("Check_frdl_dot_io_links", false))
		{
			addFileHost(
			"(?:frdl\\.io|frdl\\.my|frdl\\.is)\/\\w+",
			'id="downloadbtnfree',
			'need to add',
			'optional--',
            'optional--',
            "//a[contains(@href,'frdl.io') or contains(@href,'frdl.my')or contains(@href,'frdl.is')]"
			);
		}
        if (GM_getValue("Check_hexload_dot_com_links", false))
		{
			addFileHost(
			"hexload\.com\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
            'optional--',
			"//a[contains(@href,'hexload.com')]"
			);
		}
        if (GM_getValue("Check_down_dot_mdiaload_dot_com_links", false))
		{
			addFileHost(
			"down.mdiaload\.com\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--',
            'optional2--',
			"//a[contains(@href,'down.mdiaload.com')]"
			);
		}
        if (GM_getValue("Check_devuploads_dot_com_links", false))
		{
			addFileHost(
			"devuploads\.com\/\\w+",
			'id="downloadbtn',
			'>File Not Found<',
			'optional--',
            'optional--',
			"//a[contains(@href,'devuploads.com')]"
			);

		}
        if (GM_getValue("Check_ufile_dot_io_links", false))
		{
			addFileHost(
			"ufile\.io\/\\w+",
			'slow-download-button',
			'>File Not Found<',
			'optional--',
            'optional--',
			"//a[contains(@href,'ufile.io')]"
			);

		} /*
        if (GM_getValue("Check_transfer_dot_it_links", false))
		{
			addFileHost(
			"transfer\.it\/\\w+",
			'344556765',
			'<title>',
			'86776556',
            'optional--',
			"//a[contains(@href,'transfer.it')]"
			);

		} */
        if (GM_getValue("Check_fastupload_dot_io_links", false))
		{
			addFileHost(
			"fastupload\.io\/\\w+",
			'save-now-btn',
			'File has been removed| content="error',
			'optional--',
            'optional--',
			"//a[contains(@href,'fastupload.io')]"
			);

		}

	} 
//start here

	//hosts with direct download, so they must be requested for headers only
	function initFileHostsHeadersOnly()
	{
		function addFileHostHeadersOnly(linkRegex, isAliveRegex, isDeadRegex, ispremRegex, xpathEx)
		{
			var host = new Array(5);
			host[0] = linkRegex;
			host[1] = isAliveRegex;
			host[2] = isDeadRegex;
			host[4] = ispremRegex;
			host[3] = xpathEx;
			http_file_hosts_headers_only.push(host);
		}
		if (GM_getValue("Check_uloziste_dot_com_links", false))
		{
			addFileHostHeadersOnly(
			"(?:|files\\.)uloziste\\.com\/\\w+\/\\w+",
			'Connection: Keep-Alive',
			'Content-Length: 3857',
			'optional2',
			"//a[contains(@href,'uloziste.com')]"
			)
		}
		if (GM_getValue("Check_adrive_dot_com_links", false))
		{
			addFileHostHeadersOnly(
			"adrive\\.com\/public\/\\w+",
			'Connection: keep-alive',
			'orig_ref=deleted',
			'optional2',
			"//a[contains(@href,'adrive.com')]"
			)
		}
	}





	//CustomRules

	//functions add...Host copied here
	function addObsoleteHost(linkRegex, xpathEx)
	{
		var host = new Array(2);
		host[0] = linkRegex;
		host[1] = xpathEx;
		http_file_hosts_obsolete.push(host);
	}

	function addFileHost(linkRegex, isAliveRegex, isDeadRegex, isUnavaRegex, xpathEx, tryLoop, ispremRegex)
	{
		var host = new Array(7);
		host[0] = linkRegex;
		host[1] = isAliveRegex;
		host[2] = isDeadRegex;
		host[3] = isUnavaRegex;
		host[4] = xpathEx;
		tryLoop ? host[5] = true : host[5] = false;
		host[6] = ispremRegex;
		http_file_hosts.push(host);
	}

	function addFileHostHeadersOnly(linkRegex, isAliveRegex, isDeadRegex, xpathEx, ispremRegex)
	{
		var host = new Array(5);
		host[0] = linkRegex;
		host[1] = isAliveRegex;
		host[2] = isDeadRegex;
		host[3] = xpathEx;
		host[4] = ispremRegex;
		http_file_hosts_headers_only.push(host);
	}


	//takes a fully built rules array and adds the rules to WARLC
	function applyCustomRules(customRules)
	{
		if (!customRules) return;
		var rules, r, i;
		rules = customRules.rules;
		for (i = 0 ; i < rules.length ; i++)
		{
			r = rules[i];
			if (r.enabled)
			{
				switch (r.type)
				{
					case 'single':
						addFileHost(r.urlregex, r.aliveregex, r.deadregex, r.unavaregex, r.premregex||'', r.xpath);
						break;

					case 'headers':
						addFileHostHeadersOnly(r.urlregex, r.aliveregex, r.deadregex, r.xpath, r.premregex);
						break;

					case 'obsolete':
						addObsoleteHost(r.urlregex, r.xpath)
						break;
				}
			}
		}
	}


	function initFileHostsCustom()
	{
		if (Custom_rules && Custom_rules_text)
		{
			var msg = '';
			if (newVersion)
				msg = 'New version of W.A.R. Links Checker detected.\n\n';
				else if ((now - last_custom_rules_nag) >= 60*24*60*60*1000)
					msg = '60 or more days have passed since this notification.\n\n';
			if (msg && /^\s*@customrule(?:_obsolete)?\s/mi.test(Custom_rules_text))
			{
				GM_setValue('last_custom_rules_nag', ''+new Date().getTime()); //reset nag
				msg +=
					'Either new version of W.A.R. Links Checker detected or 60 days passed since this notify.\n'+
					'Please check that your custom rules haven\'t been built into WARLC.\n'+
					'If not, please share them with us so they can be included in the next version! Built-in rules are always preferred.\n\n'+
					'We apologize for this annoying notification, but there is a reason to this.\n'+
					'Ideally, WARLC would check which of your custom rules have been included and disable them. '+
					'Unfortunately, there is no easy way to do that, but we don\'t want everybody to just use their custom rules '+
					'forever without ever checking if the built-in ones have been added/fixed. This is currently the only way '+
					'to remind you that you should try built-in rules, report missing/non-working ones and share your custom rules.';
				setTimeout(function(){alert(msg)},0);
			}

			var customRules = parseCustomRules(Custom_rules_text);
			if (customRules.warning || customRules.error)
				alert('There were ' + customRules.error + ' errors, ' + customRules.warning + ' warnings, ' +
					customRules.note + ' notes found during Custom Rules processing.\n' + customRules.rules.length + ' valid rules found.\n\n' +
					JSON.stringify(customRules.info, null, '  '));
			applyCustomRules(customRules);

		}
	}
//end of CustomRules processing



} //end of function start



function initClipBoardTools()
{
	unsafeWindow.copyToClipboard = function(text)
	{
		try
		{
			this.netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');

			var str = Components.classes["@mozilla.org/supports-string;1"].
			createInstance(Components.interfaces.nsISupportsString);
			if (!str) return false;

			str.data = text;

			var trans = Components.classes["@mozilla.org/widget/transferable;1"].
			createInstance(Components.interfaces.nsITransferable);
			if (!trans) return false;

			trans.addDataFlavor("text/unicode");
			trans.setTransferData("text/unicode", str, text.length * 2);

			var clipid = Components.interfaces.nsIClipboard;
			var clip = Components.classes["@mozilla.org/widget/clipboard;1"].getService(clipid);
			if (!clip) return false;

			clip.setData(trans, null, clipid.kGlobalClipboard);
		} catch (e) {
			GM_log("Error copyToClipboard : " + e);
			alert(e + "\n\nsigned.applets.codebase_principal_support must be set true in about:config")
        }
	}
}



//CustomRules

function escapeRegex(str)
{
	return str.replace(/[\-\[\]{}()*+?.,\\\^$|#]/g, "\\$&");
}


//called internally from parseCustomRules.
//expected: rule object with array fields baseurl, alivematch etc, everything must already be checked for input errors
//returns the rule object with string fields urlregex, xpath, aliveregex etc built from the arrays
function makeCustomRule(rule)
{
	function makeMatchRegex(arrmatch)
	{
		return escapeRegex(arrmatch.join('\n'))
			.replace(/  +/g, '\\s+') //two or more spaces to any whitespace
			.replace(/\n/g,'|'); //join together
	}

	if (rule.alivematch) rule.aliveregex = makeMatchRegex(rule.alivematch);
	if (rule.deadmatch) rule.deadregex = makeMatchRegex(rule.deadmatch);
	if (rule.unavamatch) rule.unavaregex = makeMatchRegex(rule.unavamatch);
	if (rule.premmatch) rule.premregex = makeMatchRegex(rule.premmatch);

	if (rule.baseurl)
	{
		var i, m, urlregex = [], xpath = [], len = rule.baseurl.length;
		for (i = 0 ; i < len ; i++)
		{
			m = rule.baseurl[i].match(/^([a-z0-9\.-]+)(?: +([a-z \.]+) +)?(\/.*)$/);
			if (m[2]) //baseurl in the form:   example. com co.uk net /xxx
			{
				xpath = xpath.concat(m[2].replace(/([a-z\.]+)/g, m[1]+'$1'+m[3]).split(/\s+/));   //xpath = xpath.concat(['example.com/xxx', 'example.co.uk/xxx', 'example.net/xxx'])
				urlregex.push(    (m[1] + '(?:'+ m[2].replace(/\s+/g,'|') + ')').replace(/\./g,'\\.')     + escapeRegex(m[3]) + '.');   //urlregex.push('example\\.(?:com|co\\.uk|net)/xxx.')
			}
			else //baseurl in the form:   example.com/xxx
			{
				xpath.push(m[0]);
				urlregex.push(escapeRegex(m[0]) + '.');
			}
		}
		rule.xpath = "//a[contains(@href,'"   +   xpath.join("') or contains(@href,'")   +   "')]";
		rule.urlregex = '(?:[a-z0-9\\.-]+\\.)?(?:' + urlregex.join('|') + ')';
	}

	return rule;
}  //function makeCustomRule


/*
Takes a string containing custom link checking rules.
Returns an object with fields:
  info - contains notes, warnings and errors found during parsing
  rules - the array of custom rules
  note, warning, error - number of each of them found during parsing
Format of the input string:
One command per line. Command format: @keyword parameter
Keywords:
  @customrule, @customrule_obsolete, @customrule_headers - begin a new custom rule. Parameter: name of the rule
  @#customrule, @#customrule_obsolete, @#customrule_headers - begin and parse this custom rule, but don't use it. Parameter: name of the rule
These keywords can be multiple (any of them will work):
  @baseurl - constant part of the url. ( d123.example.com/d/?fileid -> example.com/d/? ) - used for both xpath and urlregex (will also match anything.example...)
  @alivematch, @deadmatch, @unavamatch - what to look for in the response. No regex, literal text is used with one exception: 2 or more spaces will match \s+
  @alivelink, @deadlink - example links
@baseurl is always required, @alivematch and @deadmatch are required except for obsolete. @unavamatch is ignored for obsolete. @*link is optional.
Lines starting with // and empty lines are ignored.
Invalid parameters generate errors and those lines are skipped.
Other lines generate warnings, but are otherwise ignored (also those before the first @customrule line or inside a rule with invalid name).
Example:
@customrule filehost
@baseurl    filehost.com/download/
@baseurl    filehost2. com net /d?=
@alivematch id="download">
@deadmatch  File not found
@deadmatch  File deleted
*/
function parseCustomRules(rulesStr)
{
	var linenum, customRules = {'info': [], 'rules': [], 'note': 0, 'warning': 0, 'error': 0};

	function addInfo(type, msg, ln){
		customRules.info.push({'linenum':(ln===undefined ? linenum+1 : ln+1), 'type':type, 'msg':msg});
		customRules[type]++;
		}

	var lines = rulesStr.match(/^(.*)$/gm); //split into array of lines
	if (!lines) return null;
	lines.push('@#customrule _'); //to save the last rule
	var m, linecount = lines.length;
	var keyword, param, constr, rule, err;

	var TLD = '[a-z]{2,7}(?:\\.[a-z]{2,7})?';
	var TLDorTLDlist = '(?:'+TLD+'| '+TLD+'(?: '+TLD+'){0,9} )'; //TLD or space-separated list of TLDs
	var baseurlRE = new RegExp('^([a-z0-9-]{1,30}(?:\\.[a-z0-9-]{1,30}){0,2}\\.)'+TLDorTLDlist+'(/[^\'"\s\$]{0,50})$', 'i');

	var constraints = {
		'baseurl': {
			'single':   {'min': 1, 'max': 10, 'paramRE': baseurlRE},
			'headers':  {'min': 1, 'max': 10, 'paramRE': baseurlRE},
			'obsolete': {'min': 1, 'max': 10, 'paramRE': baseurlRE}},
		'alivematch': {
			'single':   {'min': 1, 'max': 10, 'paramRE': null},
			'headers':  {'min': 1, 'max': 10, 'paramRE': null}},
		'deadmatch': {
			'single':   {'min': 1, 'max': 10, 'paramRE': null},
			'headers':  {'min': 1, 'max': 10, 'paramRE': null}},
		'unavamatch': {
			'single':   {'min': 0, 'max': 10, 'paramRE': null}},
		'alivelink': {
			'single':   {'min': 0, 'max': 10, 'paramRE': null},
			'headers':  {'min': 0, 'max': 10, 'paramRE': null}},
		'deadlink': {
			'single':   {'min': 0, 'max': 10, 'paramRE': null},
			'headers':  {'min': 0, 'max': 10, 'paramRE': null},
			'obsolete': {'min': 0, 'max': 10, 'paramRE': null}}
		};

	for (linenum = 0 ; linenum < linecount ; linenum++)
	{
		//capturing groups:              1         23   4               5                                                                                  6
		m = lines[linenum].match(/^\s*(?:(\/\/.*)|@((#?)(customrule)(?:_(headers|obsolete))?|baseurl|alivematch|deadmatch|unavamatch|alivelink|deadlink)\s+(.+))?$/i);
		if (m)
		{
			if (m[1] || !m[2])
				continue; // ignore empty lines and lines starting with //

			keyword = (m[4] || m[2]).toLowerCase();
			param = m[6];

			if (keyword == 'customrule')
			{
				//save the current rule if all required fields are provided
				if (rule)
				{
					err = false;
					$.each(constraints, function(kw, constraint){
						var l, constr = constraint[rule.type];
						if (constr)
						{
							l = rule[kw] ? rule[kw].length : 0;
							if (l < constr.min || l > constr.max)
							{
								addInfo('error', 'Required at least ' + constr.min + ' and at most ' + constr.max + ' @' + kw.toUpperCase() + ' command(s) for type ' + rule.type.toUpperCase() + '. Rule skipped.', linenum-1);
								err = true;
							}
						}
					});
					if (!err)
						customRules.rules.push(makeCustomRule(rule));
				}

				//start a new rule
				if (/^[\w\.-]{1,30}$/.test(param)) //valid name?
				{
					rule = {
						'enabled': !m[3],
						'type': m[5] ? m[5].toLowerCase() : 'single',
						'name': param
						};
				}
				else
				{
					addInfo('error', 'Invalid rule name. Cannot start a new rule definition.');
					rule = null;
				}
			}
			else //good line format, but keyword other than customrule
			{
				if (!rule)
				{
					addInfo('warning', 'Command outside @CUSTOMRULE definiton. Line skipped.');
					continue;
				}


				if (constraints[keyword])
				{
					constr = constraints[keyword][rule.type];
					if (constr)
					{
						if (constr.paramRE && !constr.paramRE.test(param))
						{
							addInfo('warning', 'Invalid @' + keyword.toUpperCase() + ' parameter. Line Skipped.');
							continue;
						}
					}
					else
					{
						addInfo('note', '@' + keyword.toUpperCase() + ' not applicable for type ' + rule.type.toUpperCase() + '. Line skipped.');
						continue;
					}
				}

				//line OK, save
				rule[keyword] ? rule[keyword].push(param) : rule[keyword] = [param];

			}
		}  //if (m)
		else
			addInfo('warning', 'Unknown line format. Line skipped.');
	}  //for loop

	return customRules;
}  //function parseCustomRules

/* ********************UPDATES********************
W.A.R. Links Checker Premium
version 1.7.3.3
November 02, 2025
Tweaked the W.A.R. Links Checker Premium Configuration Page

W.A.R. Links Checker Premium
version 1.7.3.2
November 02, 2025
removed transfer.it

W.A.R. Links Checker Premium
version 1.7.3.1
November 02, 2025
fixed k2s not detection some dead links (fixed by bruk)

W.A.R. Links Checker Premium
version 1.7.3.0
November 01, 2025
added transfer.it

W.A.R. Links Checker Premium
version 1.7.2.8
October 29, 2025
fixed fireload.com

W.A.R. Links Checker Premium
version 1.7.2.7
October 26, 2025
made change to filefactory

W.A.R. Links Checker Premium
version 1.7.2.6
October 26, 2025
made change to RG

W.A.R. Links Checker Premium
version 1.7.2.5
October 25, 2025
added pixeldra.in

W.A.R. Links Checker Premium
version 1.7.2.4
September 30, 2025
added to obsolete hosts
file.bz
filescdn.com
filescdn.net
ortofiles.com
dropapk.com
dropapk.to
tusfiles.net
tusfiles.com
uploadex.com
userscloud.com

W.A.R. Links Checker Premium
version 1.7.2.3
September 29, 2025
added anonfiles.com to obsolete hosts

W.A.R. Links Checker Premium
version 1.7.2.2
September 27, 2025
added frdl.my

W.A.R. Links Checker Premium
version 1.7.2.1
September 26, 2025
added katfile.cloud
filesin.space added to obsolete hosts

W.A.R. Links Checker Premium
version 1.7.2.0
September 20, 2025
added to obsolete hosts
wupfile.com
upx.nz
frdl.to
frdl.pw
unibytes.com
datafilehost.com
ge.tt

W.A.R. Links Checker Premium
version 1.7.1.9
September 07, 2025
fixed filefactory.com not detecting links (fixed by Bruk)

W.A.R. Links Checker Premium
version 1.7.1.8
September 05, 2025
added ninefile.com to obsolete hosts.

W.A.R. Links Checker Premium
version 1.7.1.7
August 31, 2025
fixed drop.me marking cyberdrop.me links as dead

W.A.R. Links Checker Premium
version 1.7.1.6
July 21, 2025
added code to cover other languages for dead links in depositfiles

W.A.R. Links Checker Premium
version 1.7.1.5
July 19, 2025
added code to cover other languages in depositfiles

W.A.R. Links Checker Premium
version 1.7.1.4
June 18, 2025
made change to rapidgator

W.A.R. Links Checker Premium
version 1.7.1.3
June 08, 2025
added ufile.io

W.A.R. Links Checker Premium
version 1.7.1.2
June 06, 2025
added jqueryui resources

W.A.R. Links Checker Premium
version 1.7.1.1
June 01, 2025
added uploads.ws|upl.me to obsolete hosts

W.A.R. Links Checker Premium
version 1.7.1.0
May 17, 2025
added file-upload.org

W.A.R. Links Checker Premium
version 1.7.0.9
May 12, 2025
fixed sendurl/filejoker

W.A.R. Links Checker Premium
version 1.7.0.8
May 12, 2025
made change to nitroflare to prevent false premium link

W.A.R. Links Checker Premium
version 1.7.0.7
May 01, 2025
added frdl.pw

W.A.R. Links Checker Premium
version 1.7.0.6
April 21, 2025
change made to rapidgator

W.A.R. Links Checker Premium
version 1.7.0.5
April 18, 2025
added clickndownload.cfd & clicknupload.cfd

W.A.R. Links Checker Premium
version 1.7.0.4
April 11, 2025
fixed typo in depositfiles.org

W.A.R. Links Checker Premium
version 1.7.0.3
April 10, 2025
made changes to depositfiles

W.A.R. Links Checker Premium
version 1.7.0.2
April 09, 2025
testing changes to depositfiles

W.A.R. Links Checker Premium
version 1.7.0.1
February 22, 2025
added frdl.io & frdl.is

W.A.R. Links Checker Premium
version 1.7.0.0
January 28, 2025
added code to filespace.com to detect dead links

W.A.R. Links Checker Premium
version 1.6.9.9
January 14, 2025
changed progressbox background to white
updated https://www.w3schools.com/colors link in settings

W.A.R. Links Checker Premium
version 1.6.9.7
January 09, 2025
added send.now

W.A.R. Links Checker Premium
version 1.6.9.6
November 18, 2024
fixed 1fichier not detecting some dead links in French language

W.A.R. Links Checker Premium
version 1.6.9.5
November 07, 2024
fixed 1fichier not detecting some dead links

W.A.R. Links Checker Premium
version 1.6.9.4
November 01, 2024
added dfiles.com

W.A.R. Links Checker Premium
version 1.6.9.3
October 28, 2024
made changes to filejoker/sendurl by filejoker

W.A.R. Links Checker Premium
version 1.6.9.2
October 21, 2024
made changes to multiple hosts

W.A.R. Links Checker Premium
version 1.6.9.1
October 04, 2024
fixed error in dfiles
fixed xubster.com
made changes to fastshare.cloud

W.A.R. Links Checker Premium
version 1.6.9.0
September 28 2024
added new German code for filefactory

W.A.R. Links Checker Premium
version 1.6.8.9
September 12 2024
added clickndownload.link

W.A.R. Links Checker Premium
version 1.6.8.8
September 09 2024
added clicknupload.one

W.A.R. Links Checker Premium
version 1.6.8.7
August 20 2024
made another change to rapidgator to account for free user hourly download limit

W.A.R. Links Checker Premium
version 1.6.8.6
August 20 2024
made change to rapidgator to account for free user hourly download limit

W.A.R. Links Checker Premium
version 1.6.8.5
August 20 2024
added fastupload.io

W.A.R. Links Checker Premium
version 1.6.8.4
August 20 2024
made changes to rapidgator to mark subscriberers only links as premium.

W.A.R. Links Checker Premium
version 1.6.8.3
August 15 2024
fixed send.cm not detecting dead links
added devuploads.com (detects dead link only)

W.A.R. Links Checker Premium
version 1.6.8.2
August 12 2024
added download.hellshare.sk to obsolete hosts

W.A.R. Links Checker Premium
version 1.6.8.1
August 08 2024
fixed k2s not detecting some premium links (fixed by bruk)

W.A.R. Links Checker Premium
version 1.6.8.0
August 04 2024
fixed megaup.net


W.A.R. Links Checker Premium
version 1.6.7.9
July 25 2024
added multiup.io

W.A.R. Links Checker Premium
version 1.6.7.8
July 16 2024
fixed some dead links showing as live for dailyuploads.net

W.A.R. Links Checker Premium
version 1.6.7.7
June, 25 2024
removed miui.rahim-soft.com

W.A.R. Links Checker Premium
version 1.6.7.6
June, 22 2024
changed anonymize service to be turned off (blank) on new install

W.A.R. Links Checker Premium
version 1.6.7.5
June, 09 2024
made change to filedot

W.A.R. Links Checker Premium
version 1.6.7.4
May 21, 2024
added filedot.top
filefactory premium links will be marked as dead


W.A.R. Links Checker Premium
version 1.6.7.3
May 09, 2024
added frdl.to
added hexload.com
added down.mdiaload.com
fixed dailyuploads.net

W.A.R. Links Checker Premium
version 1.6.7.2
April 18, 2024
fixed gofile.io fixed by tgs

W.A.R. Links Checker Premium
version 1.6.7.1
April 01, 2024
fixed filedot.to

W.A.R. Links Checker Premium
version 1.6.7.0
March 18, 2024
made change to drop.download

W.A.R. Links Checker Premium
version 1.6.6.9
March 09, 2024
added fastshare.cloud
fixed uploadev.org
fixed drop.download

W.A.R. Links Checker Premium
version 1.6.6.8
March 01, 2024
fixed filestore.me

W.A.R. Links Checker Premium
version 1.6.6.7
February 24, 2024
added htfl.net (hitfile redirector)

W.A.R. Links Checker Premium
version 1.6.6.6
January 31, 2024
added filestore.me

W.A.R. Links Checker Premium
version 1.6.6.5
January 30, 2024
fixed gofile.io by Bzh4ever

W.A.R. Links Checker Premium
version 1.6.6.4
January 19, 2024
fixed sendurl.me/filejoker not detecting some premium links

W.A.R. Links Checker Premium
version 1.6.6.3
January 05, 2024
added darkibox.com Thanks to Bzh4ever

W.A.R. Links Checker Premium
version 1.6.6.2
January 03, 2024
Removed anonym.to from Anonymizer list

W.A.R. Links Checker Premium
version 1.6.6.1
January 01, 2024
added clicknupload.space & clickndownload.space

W.A.R. Links Checker Premium
version 1.6.6.0
December 26, 2023
Gofile.io Fixed Thanks to Bzh4ever

W.A.R. Links Checker Premium
version 1.6.5.9
December 09, 2023
added qiwi.gg

W.A.R. Links Checker Premium
version 1.6.5.8
December 02, 2023
added clicknupload.vip
added clickndownload.org

W.A.R. Links Checker Premium
version 1.6.5.7
October 09, 2023
added bayfiles.com to obsolete hosts list

W.A.R. Links Checker Premium
version 1.6.5.6
October 06, 2023
added wrzucaj.pl

W.A.R. Links Checker Premium
version 1.6.5.5
September 19, 2023
made changes to multiup
added rosefile.net


W.A.R. Links Checker Premium
version 1.6.5.4
August 20, 2023
added easybytez.eu

W.A.R. Links Checker Premium
version 1.6.5.3
August 13, 2023
added hellshare.sk to obsolete hosts
added piknfile.cz

W.A.R. Links Checker Premium
version 1.6.5.2
July 28, 2023
added upload42.com (live links not shown yet)

W.A.R. Links Checker Premium
version 1.6.5.1
July 11, 2023
added clicknupload.download

W.A.R. Links Checker Premium
version 1.6.5.0
June 29, 2023
added clicknupload.red
added clicknupload.click
added clicknupload.site
added clicknupload.online

W.A.R. Links Checker Premium
version 1.6.4.9
June 18, 2023
added download.gg
update uptobox code

W.A.R. Links Checker Premium
version 1.6.4.8
June 11, 2023
added french code for uptobox

W.A.R. Links Checker Premium
version 1.6.4.7
June 10, 2023
added uptobox.eu

W.A.R. Links Checker Premium
version 1.6.4.6
June 08, 2023
fixed uploadrar.com

W.A.R. Links Checker Premium
version 1.6.4.5
May 14, 2023
added to obsolete hosts
hellshare.cz
download.hellshare.cz
download.cz.hellshare.com
hellshare.com
hellspy.cz
hellspy.com
stiahnito.sk

W.A.R. Links Checker Premium
version 1.6.4.4
April 22, 2023
added uploady.io
rapidcloud.cc
filedot.to

W.A.R. Links Checker Premium
version 1.6.4.3
April 10, 2023
fixed fastshare.cz
added fastshare.live

W.A.R. Links Checker Premium
version 1.6.4.2
April 09, 2023
added
yourupload.com
dbree.me
pixeldrain.com
fireload.com

W.A.R. Links Checker Premium
version 1.6.4.1
April 08, 2023
fixed uloz.to & pornfile.cz

W.A.R. Links Checker Premium
version 1.6.4.0
April 01, 2023
added zippyshare.com to obsolete hosts

W.A.R. Links Checker Premium
version 1.6.3.9
March 28, 2023
added takefile.link

W.A.R. Links Checker Premium
version 1.6.3.8
March 26, 2023
added filerice.com

W.A.R. Links Checker Premium
version 1.6.3.7
March 21, 2023
changed code for file-upload.net live links

W.A.R. Links Checker Premium
version 1.6.3.6
March 20, 2023
changed code for file-upload.net dead links

W.A.R. Links Checker Premium
version 1.6.3.5
March 04, 2023
added gofile.io (Thanks to code by tgs)

W.A.R. Links Checker Premium
version 1.6.3.4
February 25, 2023
added french code for hexupload.net dead links
added fikper.com (thanks to tgs for the code)

W.A.R. Links Checker Premium
version 1.6.3.3
February 12, 2023
added rapidrar.cr

W.A.R. Links Checker Premium
version 1.6.3.2
February 06, 2023
added send.cm
made changes to nitroflare.com

W.A.R. Links Checker Premium
version 1.6.3.1
February 05, 2023
fixed imagenetz.de
removed solidfiles.com from obsolete hosts.

W.A.R. Links Checker Premium
version 1.6.3.0
February 03, 2023
added down.fast-down.com

W.A.R. Links Checker Premium
version 1.6.2.9
January 13, 2023
added to obsolete hosts list
faststore.org

W.A.R. Links Checker Premium
version 1.6.2.8
January 12, 2023
added to obsolete hosts list
solidfiles.com
sharefiles.com
sharefiles.co

W.A.R. Links Checker Premium
version 1.6.2.7
January 02, 2023
added code to drive.google for live links

W.A.R. Links Checker Premium
version 1.6.2.6
December 20, 2022
added code to show "buy for" links as premium

W.A.R. Links Checker Premium
version 1.6.2.5
December 18, 2022
added turb.pw

W.A.R. Links Checker Premium
version 1.6.2.4
December 10, 2022
fixed wrzucajpliki.pl with code from Rafx

W.A.R. Links Checker Premium
version 1.6.2.3
December 04, 2022
added to obsolete hosts
ul.to
uploaded.net
uploaded.to

W.A.R. Links Checker Premium
version 1.6.2.2
October 08, 2022
added openload.cc

W.A.R. Links Checker Premium
version 1.6.2.1
September 08, 2022
added wplik.com

W.A.R. Links Checker Premium
version 1.6.2.0
July 27, 2022
added grandshare.net to obsolete host list

W.A.R. Links Checker Premium
version 1.6.1.9
July 05, 2022
added mega4upload.com & loadit.io

W.A.R. Links Checker Premium
version 1.6.1.8
June 25, 2022
added 1dl.net

W.A.R. Links Checker Premium
version 1.6.1.7
June 12, 2022
added mega4up.org

W.A.R. Links Checker Premium
version 1.6.1.6
May 03, 2022
added hexupload.net

W.A.R. Links Checker Premium
version 1.6.1.5
March 16, 2022
added wrzucajpliki.pl

W.A.R. Links Checker Premium
version 1.6.1.4
February 12, 2022
added clicknupload.club

W.A.R. Links Checker Premium
version 1.6.1.3
February 08, 2022
added clicknupload.to

W.A.R. Links Checker Premium
version 1.6.1.2
February 05, 2022
added code to filefactory
added loop to filespace

W.A.R. Links Checker Premium
version 1.6.1.1
January 02, 2022
added fistfile.cc

W.A.R. Links Checker Premium
version 1.6.1.0
December 27, 2021
removed anonfiles.com from obsolete hosts

W.A.R. Links Checker Premium
version 1.6.0.9
December 16, 2021
Cleaned code, removed 1,086 lines of unnecessary code

W.A.R. Links Checker Premium
version 1.6.0.8
November 23, 2021
added fastclick.to

W.A.R. Links Checker Premium
version 1.6.0.7
October 20, 2021
changed default Anonymizer from anonym.to, to anonym.es and added list of alternate link anonymizing sites to list on settings page.

W.A.R. Links Checker Premium
version 1.6.0.6
October 02, 2021
changed default Anonymizer from hiderefer.com to anonym.to

W.A.R. Links Checker Premium
version 1.6.0.5
August 25, 2021
anonfiles.com

W.A.R. Links Checker Premium
version 1.6.0.4
August 21, 2021
fixed error in drop.download

W.A.R. Links Checker Premium
version 1.6.0.3
August 14, 2021
added more code for french xubster.com

W.A.R. Links Checker Premium
version 1.6.0.2
August 13, 2021
added fastdrive.io

W.A.R. Links Checker Premium
version 1.6.0.1
August 12, 2021
fixed error in krakenfiles.com
added xubster.com

W.A.R. Links Checker Premium
version 1.6.0.0
August 09, 2021
added krakenfiles.com & drop.download
fixed ninefile.com not detecting some dead links


W.A.R. Links Checker Premium
version 1.5.9.9
July 12, 2021
added
sendurl.me (filejoker Redirector)
hitf.cc (hitfile redirector) 

W.A.R. Links Checker Premium
version 1.5.9.8
July 10, 2021
added clicknupload.cc

W.A.R. Links Checker Premium
version 1.5.9.7
July 04, 2021
added kolombox.com to obsolete hosts 

W.A.R. Links Checker Premium
version	1.5.9.6
May 29, 2021
fixed pornfile.cz

W.A.R. Links Checker Premium
version	1.5.9.5
May 21, 2021
fixed nitro.download/nitroflare causing interferance when posted with other hosts.

W.A.R. Links Checker Premium
version	1.5.9.4
May 19, 2021
added nitro.download

W.A.R. Links Checker Premium
version	1.5.9.3
April 17, 2021
added fileflares.com to obsolete hosts

W.A.R. Links Checker Premium
version	1.5.9.2
April 15, 2021
added more code for filefox dead links

W.A.R. Links Checker Premium
version 1.5.9.1
April 14, 2021
added kolombox.com 

W.A.R. Links Checker Premium
version	1.5.9.0
April 13, 2021
added hitf.cc
added delay for 1fichier (code by fonzie)

W.A.R. Links Checker Premium
version	1.5.8.9
April 06, 2021
made change to filefox for VPN

W.A.R. Links Checker Premium
version	1.5.8.8
March 30, 2021
added oboom.com to obsolete hosts

W.A.R. Links Checker Premium
version	1.5.8.7
March 12, 2021
added to up-4ever.com
upload-4ever.com
up-4ever.org

W.A.R. Links Checker Premium
version	1.5.8.6
February 21, 2021
excluded mega.io

W.A.R. Links Checker Premium
version	1.5.8.5
February 21, 2021
added to obsolete hosts list (By Love Buzz)
2downloadz.com
2giga.link
4file.net
4upld.com
700files.com
acefile.net
aisfile.com
akafile.com
alltu.eu
amonshare.com
arabloads.net
avatarshare.com
bankupload.com
bigfile.to
bitsh@re.com
bittfox.com
borncash.org
bytewhale.com
catshare.net
cloudshares.net
cloudsix.me
cloudstor.es
cloudtime.to
cloudyfiles.com
d@ilyfiles.net
debrid.pl
devilshare.net
dir50.net
divxpress.com
e@sy-share.com
exbit.net
exclusiveloader.com
exoshare.com
eyesfile.ca
filehoot.com
gettyfile.ru
gigasize.com
go4up.com
gorillavid.in
hulkload.com
ifolder.ru
jeodrive.com
kb.simple-aja.info
kingfile.pl
kingfiles.net
kumpulbagi.com
lafiles.com
load.to
mafiastorage.com
media4up.com
megafiles.us
megafileupload.com
minhateca.com.br
mixturecloud.com
movpod.in
myvdrive.com
nosupload.com
novamov.com
nowvideo.sx
owndrives.com
ozofiles.com
partage-facile.com
pobierz.to
queenshare.com
rioupload.com
rodfile.com
rusfolder.com
stagevu.com
streamin.to
temp-share.com
thefile.me
thevideo.me
tikfile.com
vidbull.com
videoweed.es
vidzi.tv
vshare.io
wizupload.com
xshare.eu
zapfile.net
z!ddu.com
zxcfiles.com

W.A.R. Links Checker Premium
version	1.5.8.4
February 11, 2021
added userupload.net
mediafire & mega fixed by Fiju
Also I added a line to the config/about page for all the people that have helped me keep this script working.
[URL=https://imagetwist.com/ae0tynn4b78t/config.jpg][IMG]https://img165.imagetwist.com/th/39711/ae0tynn4b78t.jpg[/IMG][/URL] 


W.A.R. Links Checker Premium
version	1.5.8.3
January 12, 2021
added temp unavailable code to uptobox

W.A.R. Links Checker Premium
version	1.5.8.2
December 29, 2020
fixed filefactory not detecting premium links

W.A.R. Links Checker Premium
version	1.5.8.1
December 02, 2020
changed filesupload.org code

W.A.R. Links Checker Premium
version	1.5.8.0
November 24, 2020
fixed error

W.A.R. Links Checker Premium
version	1.5.7.9
November 24, 2020
fixed uloz.to

W.A.R. Links Checker Premium
version	1.5.7.8
September 10, 2020
added cloud.189.cn
added bezvadata.cz to obsolete hosts list
fixed pan.lanzou.com

W.A.R. Links Checker Premium
version	1.5.7.7
August 31, 2020
added share.weiyun.com

W.A.R. Links Checker Premium
version	1.5.7.6
August 28, 2020
added lanzoui.com

W.A.R. Links Checker Premium
version	1.5.7.5
August 27, 2020
fixed error

W.A.R. Links Checker Premium
version	1.5.7.4
August 27, 2020
added lanzous.com, lanzoux.com & pan.lanzou.com
fixed pan.baidu.com

W.A.R. Links Checker Premium
version	1.5.7.3
July 30, 2020
added stackstorage.com

W.A.R. Links Checker Premium
version	1.5.7.2
July 28, 2020
added uploadship.com

W.A.R. Links Checker Premium
version	1.5.7.1
July 25, 2020
added letsupload.to
added to obsolete hosts
letsupload.co
letsupload.cc

W.A.R. Links Checker Premium
version	1.5.7.0
July 24, 2020
added turb.cc

W.A.R. Links Checker Premium
version	1.5.6.9
July 22, 2020
added fireget.com

W.A.R. Links Checker Premium
version	1.5.6.8
July 17, 2020
fixed uploadify.net

W.A.R. Links Checker Premium
version	1.5.6.7
July 10, 2020
added drop.me to obsolete hosts.

W.A.R. Links Checker Premium
version 1.5.6.6
June 17, 2020
added
uploadrar.com

W.A.R. Links Checker Premium
version	1.5.6.5
June 08, 2020
added centfile.com

W.A.R. Links Checker Premium
version	1.5.6.4
June 05, 2020
added ddownload.com

W.A.R. Links Checker Premium
version	1.5.6.3
May 18, 2020
new style mega.nz now check but old style no longer do.
re-enabled mediafire. (Their direct download links still lockup browsers so if your browser is locking up because of their links open w.a.r. configuration window and make sure to uncheck the box for mediafire)

W.A.R. Links Checker Premium
version	1.5.6.2
April 30, 2020
filemia.co

W.A.R. Links Checker Premium
version	1.5.6.1
April 123, 2020
added letsupload.co

W.A.R. Links Checker Premium
version	1.5.6.0
April 19, 2020
added...
lilfile.com
file.bz
ortofiles.com

W.A.R. Links Checker Premium
version	1.5.5.9
April 17, 2020
fixed userscloud.com
added filesite.xyz
added multiload.cz to obsolete hosts

W.A.R. Links Checker Premium
version	1.5.5.8
April 10, 2020
added edisk.cz
added mega4up.com

W.A.R. Links Checker Premium
version	1.5.5.7
April 09, 2020
added turb.to
added datator.cz

W.A.R. Links Checker Premium
version	1.5.5.6
April 07, 2020
added mixdrop.co
added gounlimited.to
fixed sdilej.cz
added dead code for hellspy
bitster.cz added to obsolete hosts
therapide.com added to obsolete hosts
ulozisko.sk added to obsolete hosts
superbshare.com added to obsolete hosts

W.A.R. Links Checker Premium
version	1.5.5.5
March 31, 2020
fixed datoid.cz
fixed sdilej.cz
Added to obsolete hosts
firstplanet.eu
stiahni.si
euroshare.eu

W.A.R. Links Checker Premium
version	1.5.5.4
March 31, 2020
made changes to ulozto.net

W.A.R. Links Checker Premium
version	1.5.5.3
March 30, 2020
made changes to uloz.to

W.A.R. Links Checker Premium
version	1.5.5.2
March 14, 2020
fixed turbobit.net

W.A.R. Links Checker Premium
version	1.5.5.1
March 08, 2020
fixed wupfile.com

W.A.R. Links Checker Premium
version	1.5.5.0
March 04, 2020
added filebonus.net

W.A.R. Links Checker Premium
version	1.5.4.9
February 28, 2020
added hitf.to

W.A.R. Links Checker Premium
version	1.5.4.8
February 26, 2020
fixed 1fichier.com/dir

W.A.R. Links Checker Premium
version	1.5.4.7
February 16, 2020
added clicknupload.co

W.A.R. Links Checker Premium
version	1.5.4.6
January 31, 2020
removed mediafire.com
(it's direct download links are causing browser lockups
it will be added back after problem is fixed)

W.A.R. Links Checker Premium
version	1.5.4.5
January 25, 2020
added desiupload.to / desiupload.co

W.A.R. Links Checker Premium
version	1.5.4.4
December 28, 2019
added share-online.biz & egoshare.com to obsolete hosts

W.A.R. Links Checker Premium
version	1.5.4.3
December 27, 2019
added
speed-down.org
uploadev.org
usersdrive.com

W.A.R. Links Checker Premium
version	1.5.4.2
December 22, 2019
changed code for box.net

W.A.R. Links Checker Premium
version	1.5.4.1
December 10, 2019
changed europeup.com

W.A.R. Links Checker Premium
version	1.5.4.0
December 05, 2019
added earn4files.com

W.A.R. Links Checker Premium
version	1.5.3.9
December 04, 2019
fixed europeup.com

W.A.R. Links Checker Premium
version	1.5.3.8
December 03, 2019
Fixed ddl.to
added europeup.com

W.A.R. Links Checker Premium
version	1.5.3.7
November 03, 2019
added to obsolete hosts
oload.tv
oload.stream
oload.net
openload.co
openload.io

W.A.R. Links Checker Premium
version	1.5.3.6
October 06, 2019
fixed filesmonster.com

W.A.R. Links Checker Premium
version	1.5.3.5
September 25, 2019
added mexa.sh

W.A.R. Links Checker Premium
version	1.5.3.4
September 16, 2019
added upload.st

W.A.R. Links Checker Premium
version	1.5.3.3
August 21, 2019
cleaned up code

W.A.R. Links Checker Premium
version	1.5.3.2
August 19, 2019
adde code to uptobox for temp unavailable links
will show as yellow if blocked in U.S.

W.A.R. Links Checker Premium
version	1.5.3.1
August 13, 2019
added dropapk.to & mixloads.com

W.A.R. Links Checker Premium
version	1.5.3.0
August 10, 2019, 2019
added debrid.pl

W.A.R. Links Checker Premium
version	1.5.2.9
July 27, 2019
added fileup.cc

W.A.R. Links Checker Premium
version	1.5.2.8
July 11, 2019
added k-upload.com and k-upload.ff to obsolete hosts

W.A.R. Links Checker Premium
version	1.5.2.7
July 07, 2019
added filespace.pl

W.A.R. Links Checker Premium
version	1.5.2.6
June 28, 2019
removed uploadocean.com from obsolete hosts

W.A.R. Links Checker Premium
version	1.5.2.5
June 24, 2019
added oxycloud.com

W.A.R. Links Checker Premium
version	1.5.2.4
May 26, 2019
added uploadocean.com to obsolete hosts

W.A.R. Links Checker Premium
version	1.5.2.3
May 24, 2019
added ayefiles.com to obsolete hosts.

W.A.R. Links Checker Premium
version	1.5.2.2
May 22, 2019
fixed anafile not detecting some dead links
added wupfile.com

W.A.R. Links Checker Premium
version	1.5.2.1
May 22, 2019
fixed longfiles.com

W.A.R. Links Checker Premium
version	1.5.2.0
May 20, 2019
fixed megaup.net not detecting some dead links

W.A.R. Links Checker Premium
version	1.5.1.9
May 13, 2019
added magic4up.com to obsolete hosts

W.A.R. Links Checker Premium
version	1.5.1.8
May 07, 2019
added datafile.com to obsolete hosts
fixed megaup.net


W.A.R. Links Checker Premium
version	1.5.1.7
April 27, 2019
added dropapk.com

W.A.R. Links Checker Premium
version	1.5.1.6
April 24, 2019
added nelion.me

W.A.R. Links Checker Premium
version	1.5.1.5
April 17, 2019
added
mx-sh.net
intoupload.net

W.A.R. Links Checker Premium
April 06, 2019
version	1.5.1.4
Fixed error

W.A.R. Links Checker Premium
April 06, 2019
version	1.5.1.3
Added to obsolete hosts.
ifile.it
lix.in
filecloud.io


February 21, 2019
Version 1.5.1.2
added to obsolete hosts
filesflash.com
filesflash.net

added
uploadproper.net

February 09, 2019
Version 1.5.1.1
added turbo.to
added hil.to

February 01, 2019
Version 1.5.1.0
removed bayfiles.com from obsolete hosts
added ddl.to

January 31, 2019
Version 1.5.0.9
fixed 1fichier showing some dead links as unavailable.
added loop to uptobox.com to prevent false unavailable when checking multiple links.

Added to obsolete hosts...
sfiles.me
srfiles.com
suprafiles.me
suprafiles.org
suprafiles.co
suprafiles.net

January 21, 2019
Version 1.5.0.8
fixed avefiles.com (by Yurii)

January 15, 2019
Version 1.5.0.7
removed fileupup.com from obsolete hosts

January 14, 2019
Version 1.5.0.6
added
rocketshare.com
udrop.net

January 11, 2019
Version 1.5.0.5
fixed uptobox.com

January 10, 2019
Version 1.5.0.4
fixed uptobox.com

December 14, 2018
Version 1.5.0.2
fixed mediafire.com

December 11, 2018
Version 1.5.0.1
fixed upstore.net

December 10, 2018
Version 1.5.0.0
fixed upsto.re

December 08, 2018
Version 1.4.9.9
fixed uploadocean.com
added ninefile.com

December 01, 2018
Version 1.4.9.8
added 4file.net

November 28, 2018
Version 1.4.9.7
increased k2s wait time to 750


November 19, 2018
Version 1.4.9.6
added dfiles.eu/folders

November 16, 2018
Version 1.4.9.5
added sfiles.me

November 15, 2018
Version 1.4.9.4
added filebonus.com

November 15, 2018
Version 1.4.9.3
added srfiles.com


November 08, 2018
Version 1.4.9.2
added magic4up.com

November 06, 2018
Version 1.4.9.1
added upload2win.com

October 13, 2018
Version 1.4.9.0
added oload.stream

September 30, 2018
Version 1.4.8.9
added megadl.fr

September 22, 2018
Version 1.4.8.8
fixed katfile

September 04, 2018
Version 1.4.8.7
added filedeluxe.com
fixed fileboom.me


September 01, 2018
Version 1.4.8.6
Fixed filerio.in

August 27, 2018
Version 1.4.8.5
fixed filesin.space not showing some dead links

August 25, 2018
Version 1.4.8.4
fixed filesflash.com not detecting some dead links.

August 23, 2018
Version 1.4.8.3
change to make filefactory premium links show as dead

August 18, 2018
Version 1.4.8.2
added suprafiles.me

August 17, 2018
Version 1.4.8.1
added code for french dead filefactory links

August 11, 2018
Version 1.4.8.0
fixed filefactory not showing some premium only links.

August 10, 2018
Version 1.4.7.9
fixed keep2share (yurii)

August 04, 2018
Version 1.4.7.8
fixed filerio.in

August 01, 2018
Version 1.4.7.7
fixed 1fichier dead links

July 29, 2018
Version 1.4.7.6
added code for filefactory dead links

July 28, 2018
Version 1.4.7.5
added freshfile.pl

June 30, 2018
Version 1.4.7.4
Added
up-4.net
mon-partage.fr
sora.io
2giga.link
excluded      https://www.sous-titres.eu/*
***Thanks to Patatra for the code***
fixed userscloud.com
added Jeodrive.com to obsolete hosts

June 25, 2018
Version 1.4.7.3
fixed dinoshare.cz
added crazyshare.cc to obsolete hosts.

June 01, 2018
Version 1.4.7.2
added filescdn.net

May 30, 2018
Version 1.4.7.1
fixed sdilej.cz

May 30, 2018
Version 1.4.7.0
fixed fastshare.cz

May 28, 2018
Version 1.4.6.9
fixed fastshare.cz

May 22, 2018
Version 1.4.6.8
added to obsolete hosts

depfile.com
depfile.us
dipfile.com
ssh.tf
led.wf
lan.wf
adlink.wf
click.tf
ssh.yt
yep.pm
kyc.pm

May 01, 2018
Version 1.4.6.7
fixed bittfox.com

April 15, 2018
Version 1.4.6.6
added uplod.org & upload4earn.com

April 11, 2018
Version 1.4.6.5
added french code for dead filefactory links

April 09, 2018
Version 1.4.6.4
added megarapid.cz to obsolete hosts

April 06, 2018
Version 1.4.6.3
Fixed uptobox.com
added code for uloz dead links

March 27, 2018
Version 1.4.6.2
added up07.me

March 22, 2018
Version 1.4.6.1
fixed owndrives.com

March 19, 2018
Version 1.4.6.0
fixed uploadboy.me

March 18, 2018
Version 1.4.5.9
added megaup.net

March 14, 2018
Version 1.4.5.8
fixed datafilehost.com

March 13, 2018
Version 1.4.5.7
fixed error with uploaded

March 13, 2018
Version 1.4.5.6
fixed uptobox
fixed uploaded

March 05, 2018
Version 1.4.5.5
fixed depfile redirectors not detecting dead links.
adlink.wf
lan.wf
led.wf
ssh.yt
yep.pm
kyc.pm
ssh.tf
click.tf

Feburary 27, 2018
Version 1.4.5.4
added uploadkadeh.com

Feburary 27, 2018
Version 1.4.5.3
added usersfiles.com to obsolete hosts

Feburary 27, 2018
Version 1.4.5.2
added xshare.eu

Feburary 26, 2018
Version 1.4.5.1
fixed katfile.com

Feburary 15, 2018
Version 1.4.5.0
fixed uptobox.com

Feburary 07, 2018
Version 1.4.4.9
Fixed crazychare.cc not checking some links

Feburary 05, 2018
Version 1.4.4.8
added uploadrocket.net to obsolete hosts

January 23, 2018
Version 1.4.4.7
added datoteke.com to obsolete hosts

January 22, 2018
Version 1.4.4.6
added douploads.com

January 19, 2018
Version 1.4.4.5
fixed ulozto.net

January 07, 2018
Version 1.4.4.4
added indishare.me
added coolbytez.com

January 04, 2018
Version 1.4.4.3
added uploadable.ch to obsolete hosts.

January 01, 2018
Version 1.4.4.2
fixed uloz.to

December 30, 2017
Version 1.4.4.1
added dir50.net

December 27, 2017
Version 1.4.4.0
fixed dl.free.fr/getfile.pl
added dead code for minhateca.com

December 26, 2017
Version 1.4.3.9
added https://minhateca.com.br

December 25, 2017
Version 1.4.3.8
excluded
https://www.express-scripts.com

December 23, 2017
Version 1.4.3.7
added 4downfiles.org
fixed rapidgator.net/rg.to premium
by J0N4S

December 20, 2017
Version 1.4.3.6
added gfycat.com

December 17, 2017
Version 1.4.3.5
added suprafiles.org
fixed subyshare

December 16, 2017
Version 1.4.3.4
added
anonfile.com
vshare.io

December 16, 2017
Version 1.4.3.3
fixed cloudyfiles.com/org

December 16, 2017
Version 1.4.3.2
fixed keep2share not detecting some premium links


December 15, 2017
Version 1.4.3.1
fixed uloz.to

December 09, 2017
Version 1.4.3.0
added temp unavialable to subyshare.com

November 27, 2017
Version 1.4.2.9
added k-upload.fr & k-upload.com

November 24, 2017
Version 1.4.2.8
added rockfile.co
added rockfile.eu to obsolete hosts

November 10, 2017
Version 1.4.2.7
added drop.me

November 01, 2017
Version 1.4.2.6
added vodlocker.com to obsolete hosts

October 31, 2017
Version 1.4.2.5
fixed suprafiles

October 25, 2017
Version 1.4.2.4
excluded google.*

October 24, 2017
Version 1.4.2.3
added fp.io to obsolete hosts

October 21, 2017
Version 1.4.2.2
excluded  https://www.google.de.*

October 10, 2017
Version 1.4.2.1
fixed error

October 07, 2017
Version 1.4.2.0
excluded  https://www.google.co.*

September 20, 2017
Version 1.4.1.9
added bittfox.com

September 18, 2017
Version 1.4.1.8
added cloudyfiles.com

August 22, 2017
Version 1.4.1.7
fixed speedshare.eu

August 08, 2017
Version 1.4.1.5
fixed 4share.com

August 06, 2017
Version 1.4.1.4
added depfile.us

July 24, 2017
Version 1.4.1.3
added bitshare.com

July 22, 2017
Version 1.4.1.2
fixed novafile.com

July 21, 2017
Version 1.4.1.1
added premium link detection for filefox.cc

July 20, 2017
Version 1.4.1.0
added filefox.cc

July 16, 2017
Version 1.4.0.9
added
sendit.cloud
9xupload.me

July 13, 2017
Version 1.4.0.8
added backin.net

July 12, 2017
Version 1.4.0.7
added uplea.com to obsolete hosts

July 11, 2017
Version 1.4.0.6
Added
fileshd.net
media4up.com
700files.com
megafiles.us
flexydrive.com

July 09, 2017
Version 1.4.0.5
added dipfile.com

June 29, 2017
Version 1.4.0.4
fixed problem with anonym.to (By yurii)

June 28, 2017
Version 1.4.0.3
fixed fboom & k2s (By yurii)

June 26, 2017
Version 1.4.0.2
fixed filefactory

June 25, 2017
Version 1.4.0.1
added zapfile.net

June 24, 2017
Version 1.4.0.0
added suprafiles.co

June 24, 2017
Version 1.3.9.9
added up-4ever.com

June 19, 2017
Version 1.3.9.8
fixed depfile

June 16, 2017
Version 1.3.9.7
fixed filefactory

June 06, 2017
Version 1.3.9.6
fixed uploads.to

June 06, 2017
Version 1.3.9.5
fixed uploadgig.com

June 05, 2017
Version 1.3.9.4
added clicknupload.org

May 31, 2017
Version 1.3.9.3
fixed tusfiles

May 25, 2017
Version 1.3.9.2
added avatarshare.com

May 15, 2017
Version 1.3.9.1
excluded google.pl
added code to fileshark.pl

May 12, 2017
Version 1.3.9.0
added owndrives.com

May 12, 2017
Version 1.3.8.9
added hotlink.cc

May 09, 2017
Version 1.3.8.8
added code for kingfile.pl
added code for catshare.net

May 08, 2017
Version 1.3.8.7
added file-upload.com

May 04, 2017
Version 1.3.8.6
fixed rapidgator

April 30, 2017
Version 1.3.8.5
fixed rapidgator

April 30, 2017
Version 1.3.8.4
added code for kingfile.pl

April 30, 2017
Version 1.3.8.3
changed code for kingfile.pl

April 29, 2017
Version 1.3.8.2
added code to kingfile.pl

April 29, 2017
Version 1.3.8.1
added code to kingfile.pl

April 28, 2017
Version 1.3.8.0
fileshark.pl
kingfile.pl
pobierz.to

April 26, 2017
Version 1.3.7.9
fixed 1f.al

April 16, 2017
Version 1.3.7.8
added crazyshare.cc

April 16, 2017
Version 1.3.7.7
fixed uploadgig.com

April 13, 2017
Version 1.3.7.6
added neodrive.co to obsolete hosts

April 07, 2017
Version 1.3.7.5
added french code for rg premium links

April 05, 2017
Version 1.3.7.4
added oload.tv

March 30, 2017
Version 1.3.7.3
added uploads.to

March 20, 2017
Version 1.3.7.2
added black-label.pro to obsolete hosts

March 13, 2017
Version 1.3.7.1
fixed filescdn.com

February 27, 2017
Version 1.3.7.0
fixed openload.co

February 26, 2017
Version 1.3.6.9
fixed drive.google.com
fixed uptobox.com (by dodoxp)

February 25, 2017
Version 1.3.6.8
added uploading.com to obsolete hosts

February 24, 2017
Version 1.3.6.7
cloudzilla.to added to obsolete hosts

February 23, 2017
Version 1.3.6.6
uploadify.net

February 22, 2017
Version 1.3.6.5
fixed katfile.com

February 12, 2017
Version 1.3.6.3
added junocloud.me to obsolete hosts

January 12, 2017
Version 1.3.6.2
added share.az & upfile.mobi

January 07, 2017
Version 1.3.6.1
added ausfile.com

January 05, 2017
Version 1.3.6.0
removed uploadable.ch from obsolete hosts

January 04, 2017e

December 31, 2016
Version 1.3.5.8
disabled on pizzaonline.dominos

December 31, 2016
Version 1.3.5.7
added uploadable.ch to obsolete hosts

December 30, 2016
Version 1.3.5.6
restored kingfiles.net

December 14, 2016
Version 1.3.5.5
fixed some 1fichier links not checking (yurii)

December 01, 2016
Version 1.3.5.4
added temp-share.com & filesha.com

November 30, 2016
Version 1.3.5.3
fixed mexashare.com not detecting some dead links

November 29, 2016
Version 1.3.5.2
added black-label.pro (live links only)

November 27, 2016
Version 1.3.5.1
made changes to filefactory

November 23, 2016
Version 1.3.5.0
added megashares.com to obsolete hosts
fixed letitbit not showing as obsolete
added littlebyte.net

November 22, 2016
Version 1.3.4.9
added code for live links to rapidgator
added dailyfiles.net
added upfiles.net
added multiup.eu

November 17, 2016
Version 1.3.4.8
fixed filefactory, again

November 17, 2016
Version 1.3.4.7
fixed filefactory folders

November 15, 2016
Version 1.3.4.6
fixed filefactory

November 14, 2016
Version 1.3.4.5
fixed rapidgator
fixed filefactory folders


November 13, 2016
Version 1.3.4.4
fixed problem with drive.google.com
added function to move and resize the progressbox (Big thanks to yurri for adding this)

November 06, 2016
Version 1.3.4.3
added to obsolete hosts (by love buzz)
4up.me
a nonfiles.com
axifile.com
creafile.net
demo.ovh.eu
filesin.com
file swap.com
gulfup.com
hexupload.com
hugefiles.net
jumbofiles.com
kingfiles.net
letitbit.net
lolabits.es
nowdownload.ch
openfile.ru
radicalshare.com
remixshare.com
storefiles.co
toutbox.fr
uploadbaz.com
uploadingit.com
verzend.be
vidplay.net
vidxden.com
xfileload.com

November 04, 2016
Version 1.3.4.2
added french code for rapidgator premium links
added abelhas.pt, allmyvideos.net, vidspot.net to obsolete hosts

November 03, 2016
Version 1.3.4.1
added Portuguese code for rapidgator premium links
added suprafiles.net

November 02, 2016
Version 1.3.4.0
fixed depositfiles not detecting depositfiles.com/de links

October 27, 2016
Version 1.3.3.9
fixed uploaded.net not detecting some dead links

October 24, 2016
Version 1.3.3.8
added more french code for upload.af dead links

October 23, 2016
Version 1.3.3.7
added french for upload.af dead links

October 17, 2016
Version 1.3.3.6
fixed error (by Yurii)

October 17, 2016
Version 1.3.3.5
fixed file.al (by Yurii)

October 16, 2016
Version 1.3.3.4
test

October 11, 2016
Version 1.3.3.3
fixed subyshare.com not detecting some dead links
fixed mexashare.com
fixed pornfile.cz

October 10, 2016
Version 1.3.3.2
added fileflares.com
added erafile.com
added loop to subyshare.com & rockfile.eu

September 26, 2016
Version 1.3.3.1
added uploadocean.com

September 25, 2016
Version 1.3.3.0
added exbit.net

September 25, 2016
Version 1.3.2.9
fixed uptobox
fixed google (by kubbbie)

September 23, 2016
Version 1.3.2.8
added danish to rapidgator

September 22, 2016
Version 1.3.2.7
added wayupload.com

September 18, 2016
Version 1.3.2.6
added Portuguese language to rapidgator

September 15, 2016
Version 1.3.2.5
added languages to rapidgator
french
german
spanish
Italian
russian
polish
dutch
czech
chinese
japanese

September 14, 2016
Version 1.3.2.4
fixed spaceforfiles.com

September 09, 2016
Version 1.3.2.3
added bdupload.info
added german & deutsch language to workupload.com

September 08, 2016
Version 1.3.2.2
added...
storageserver.co.uk
cloud.mail.ru
fixed depositfiles

September 08, 2016
Version 1.3.2.1
added workupload.com

September 04, 2016
Version 1.3.2.0
made changes to euroshare.eu

September 03, 2016
Version 1.3.1.9
added usercloud.net
made changes to euroshare.eu

August 31, 2016
Version 1.3.1.8
fixed uptobox.com

August 30, 2016
Version 1.3.1.7
made changes to euroshare.eu

August 29, 2016
Version 1.3.1.6
made changes to data.hu

August 29, 2016
Version 1.3.1.5
fixed euroshare.eu not detecting dead links

August 23, 2016
Version 1.3.1.4
added ulozto.sk
added ulozto.cz

August 19, 2016
Version 1.3.1.3
fixed euroshare.eu
fixed 2share.com

August 17, 2016
Version 1.3.1.2
added french code for 1fichier

August 16, 2016
Version 1.3.1.1
fix for 1fichier folder links, by yurii

August 15, 2016
Version 1.3.1.0
another fix for 1fichier
added mystore.to

August 12, 2016
Version 1.3.0.9
fixed 1fichier

August 01, 2016
Version 1.3.0.8
fixed tezfiles.com not detecting some premium links

July 24, 2016
Version 1.3.0.7
added fileshareup.com

July 17, 2016
Version 1.3.0.6
added subyshare.com

july 10, 2016
Version 1.3.0.5
fixed ulozto.net

july 07, 2016
Version 1.3.0.4
fixed uloz.to

july 07, 2016
Version 1.3.0.3
added imagenetz.de

June 23, 2016
Version 1.3.0.2
excluded nexcess.net

June 20, 2016
Version 1.3.0.1
added daofile.com

June 16, 2016
Version 1.3.0.0
added mexashare.com

June 16, 2016
Version 1.2.9.9
added novafile.com
added uploadgig.com

June 15, 2016
Version 1.2.9.8
fixed upload.af

June 10, 2016
Version 1.2.9.7
added alltu.eu

June 09, 2016
Version 1.2.9.6
added code for french language to rapidgator.net & rg.to

June 04, 2016
Version 1.2.9.5
added upnito.sk

May 31, 2016
Version 1.2.9.4
fixed mega.co (by yurii)

May 31, 2016
Version 1.2.9.3
code cleanup

May 27, 2016
Version 1.2.9.2
added filesin.space

May 27, 2016
Version 1.2.9.1
added
filescdn.com
bankupload.com
katfile.com

May 18, 2016
Version 1.2.9.0
added warped.co to obsolete hosts

May 17, 2016
Version 1.2.8.9
fixed mega.nz

May 16, 2016
Version 1.2.8.8
added to obsolete hosts
fileband.com
filecloud.cc
filesmelt.com
goldbytez.com
hulkshare.com
idup.in
loudupload.net
muchshare.net
myupload.dk
nekaka.com
netkups.com
plunder.com
uploads.xxx
uploadspace.pl
xkeepfile.com

May 16, 2016
Version 1.2.8.7
added upnito.sk to obsolete hosts

May 15, 2016
Version 1.2.8.6
fixed uploading.site

May 15, 2016
Version 1.2.8.5
added oload.net

May 14, 2016
Version 1.2.8.4
added uploading.site

May 13, 2016
Version 1.2.8.3
added uploadc.ch
fixed vidspot.net

May 13, 2016
Version 1.2.8.2
added keepshare.net

May 11, 2016
Version 1.2.8.1
added uploadserv.com

May 09, 2016
Version 1.2.8.0
fixed upstore.net & upsto.re
added 24uploading.com to obsolete hosts

May 06, 2016
Version 1.2.7.9
added storagon.com to obsolete hosts
fixed worldbytez.com

May 02, 2016
Version 1.2.7.8
added myfiles.onl

april 28, 2016
Version 1.2.7.7
fixed bytewhale.com

april 27, 2016
Version 1.2.7.6
fixed rapidgator not detecting some premium links.

april 27, 2016
Version 1.2.7.5
added jeodrive.com

april 26, 2016
Version 1.2.7.4
added sanshare.com to obsolete hosts

april 26, 2016
Version 1.2.7.3
fixed vidspot.net

april 26, 2016
Version 1.2.7.2
added upx.nz

april 25, 2016
Version 1.2.7.1
added rapidfilehost.com to obsolete hosts
fixed bitster.cz

april 12, 2016
Version 1.2.7.0
fixed rapidgator not detecting some premium links.

april 11, 2016
Version 1.2.6.9
changed code for ncrypt.in

april 07, 2016
Version 1.2.6.8
added fileinz.com to obsolete hosts.

april 06, 2016
Version 1.2.6.7
added sharingmaster.com to obsolete hosts.

april 05, 2016
Version 1.2.6.6
added 4upfiles.com & elffiles.com to obsolete hosts

april 03, 2016
Version 1.2.6.5
updates to configuration page

March 31, 2016
Version 1.2.6.4
added code for tampermonkey 4.0 compatibility

March 31, 2016
Version 1.2.6.3
fixed uloz.to
fixed copy dead links to clipboard feature
added copy live links to clipboard feature.

March 24, 2016
Version 1.2.6.2
changed made to nitroflare. (yurri)

March 20, 2016
Version 1.2.6.1
fixed rapidgator
fixed dfiles
fixed dl.free.fr
fixed nitroflare.com (Fixed by Yurii)

March 15, 2016
Version 1.2.6.0
fixed rapidgator.net
fixed uploaded.net

March 13, 2016
Version 1.2.5.9
added
uploads.ws
upl.me
clicknupload.link
added fileover.net to obsolete hosts
fixed kingfiles.net

March 09, 2016
Version 1.2.5.8
added kingfiles.net to obsolete hosts
fixed 4upld.com/expressleech.com

March 08, 2016
Version 1.2.5.7
fixed solidfiles.com

March 01, 2016
Version 1.2.5.6
added filespace.com
fixed depositfiles (by yurii)

February 29, 2016
Version 1.2.5.5
made change to keep2share

February 28, 2016
Version 1.2.5.4
removed down4files.com from obsolete hosts.

February 26, 2016
Version 1.2.5.3
fixed userscloud.com

February 24, 2016
Version 1.2.5.2
added yandex.com
fixed datafile.com

February 22, 2016
Version 1.2.5.1
added bigfile.to

February 20, 2016
Version 1.2.5.0
added abelhas.pt

February 18, 2016
Version 1.2.4.9
made change to uptobox

February 17, 2016
Version 1.2.4.8
fixed yadi.sk

February 16, 2016
Version 1.2.4.7
fixed datafile.com
fixed filecad.com
added filecore.co & filestorm.to to obsolete hosts
added upload.af, filedwon.in & uplod.it

February 15, 2016
Version 1.2.4.6
fixed kumpulbagi.id
added sangfile.com to obsolete hosts

February 14, 2016
Version 1.2.4.5
fixed yandex.ru

February 13, 2016
Version 1.2.4.4
added lunaticfiles.com.

February 09, 2016
Version 1.2.4.3
added file.up09.com.

February 09, 2016
Version 1.2.4.2
tezfiles.com premium links now detected.

February 09, 2016
Version 1.2.4.1
added seenupload.com to obsolete hosts
fixed 180upload.com to show obsolete

February 08, 2016
Version 1.2.4.0
added tusfiles.com
added filesupload.org
added gigasize.com
added filecad.com
fixed filecloud.io
added uploadnet.co to obsolete hosts

February 07,2016
Vession 1.2.3.9
fixed depositfiles.com folders
fixed turbobit.net folders

February 06, 2016
Version 1.2.3.8
fixed 1fichier false dead links

February 04, 2106
Version 1.2.3.7
added geupload and lenfile to obsolete hosts
fixed kyc.pm/depfile

February 03, 2016
Version 1.2.3.6
fixed some nitroflare.com dead links not being detected

February 01, 2016
Version 1.2.3.5
script moved to new site

January 20, 2016
Version 1.2.3.3
fixed some rapidgator premium link not being detected

January 17, 2016
Version 1.2.3.2
added bytewhale.com
added rapidrar.com

Version 1.2.3.1
added 180upload.com to obsolete hosts
fixed hellspy.com
added dinoshare.cz,

January 13, 2016
Version 1.2.3.0
added rapidu.net
added uploadboy.me
fixed euroshare.eu

January 12, 2016
Version 1.2.2.9
added kb.simple-aja.info

January 10, 2016
Version 1.2.2.8
made changes to fastshare.cz

January 10, 2016
Version 1.2.2.7
fixed uptobox.com

January 09, 2016
Version 1.2.2.6
datoteke.com now detects premium links
fixed turbobit.net
fixed uptobox.com
added pornfile.cz
added pornoid.cz
added file-share.top
added bitster.cz

January 05, 2016
Version 1.2.2.5
fixed salefiles.com
fixed ozofile.com

January 04, 2016
Version 1.2.2.4
added sharehost.eu

December 30, 2015
Version 1.2.2.3
added tezfiles.com

December 28, 2015
Version 1.2.2.2
fixed some k2s & fboom dead link not getting detected
fixed some k2s premium links not getting detected.
fixed ssh.yt not detecting some dead links
fixed ncrypt.in dead links showing yellow

December 20, 2015
Version 1.2.2.0
added datoteke.com

December 19, 2015
Version 1.2.1.9
added secured.in & linksave.in to obsolete hosts

December 17, 2015
Version 1.2.1.8
added german for dead links to secureupload.eu.

December 17, 2015
Version 1.2.1.7
added french for dead links to secureupload.eu.
fixed problem with tooltip display.

December 13, 2015
Version 1.2.1.6
added netload.me & fileparadox.in to obsolete hosts

December 09, 2015
Version 1.2.1.5
added rapidsonic.com & fileparadox.com to obsolete hosts

December 04, 2015
Version 1.2.1.4
added megairon.net, inafile.com, uploadhero.com & uploadhero.co to obsolete hosts

December 03, 2015
Version 1.2.1.3
added dailyuploads.net

December 02, 2015
Version 1.2.1.2
fixed hitfile.net
fixed kingfiles.net

November 30, 2015
Version 1.2.1.1
added filepost.com to obsolete hosts
added devilshare.net

November 28, 2015
Version 1.2.1.0
fixed datafile.com not detecting some premium links.

November 25, 2015
Version 1.2.0.9
fixed filejoker.net
fixed toutbox.fr
fixed nowvideo.sx

November 24, 2015
Version 1.2.0.8
fixed openload.io

November 20, 2015
Version 1.2.0.7
//added file.al
//fixed nitroflare.com false live links
//fixed keep2share/fileboom links not checking some links (fixed by yurii)

November 17, 2015
Version 1.2.0.6
added clicknupload.me

November 09, 2015
Version 1.2.0.5
fixed some depfile premium links not being detected

November 08, 2015
Version 1.2.0.4
fixed some rapidgator premium links not being detected
fixed doraupload.com

November 08, 2015
Version 1.2.0.3
fixed uploaded false premium

November 07, 2015
Version 1.2.0.2
fixed redbunker.net

November 05, 2015
Version 1.2.0.1
fixed app.box.com
added multiup.org (does not detect all dead links)

November 01, 2015
Version 1.2.0.0
added more languages to rockfile and 1fichier

November 01, 2015
Version 1.1.9.9
fixed rockfile.eu
changed 1fichier code (Thanks yurri)
added to obsolete hosts... (Thanks Love Buzz)
burnupload.com
cramit.in
cramitin.net
down4files.com
edoc.com
jumbofile.net
krotix.net
migahost.com
movreel.com
netload.in
newfileland.com
quickshare.cz

October 30, 2015
Version 1.1.9.8
added alfafile.net

October 26, 2015
Version 1.1.9.7
changed datafile.com and uplea.com
added lolabits.es

October 26, 2015
Version 1.1.9.6
added toutbox.fr

October 25, 2015
Version 1.1.9.5
fixed counter error

October 25, 2015
Version 1.1.9.4
changed uptobox.com code

October 21, 2015
Version 1.1.9.3
fixed uptobox.com

October 20, 2015
Version 1.1.9.2
bug fixes and new method of detecting premium links.

October 15, 2015
Version 1.1.9.1
fixed hugefiles.net false premium
changed uptobox.com code

October 06, 2015
Version 1.1.9.0
fixed filefactory
fixed rockfile false premium
keep2share & fileboom now detect premium links (fixed by yurii)

October 01, 2015
Version 1.1.8.9
fixed free.fr false premium
fixed thevideo.me false premium

September 28, 2015
Version 1.1.8.8
added uplea.com and openload.co

September 27, 2015
Version 1.1.8.7
fixed fileparadox.in false premium
added kingfiles.net to obsolete hosts
removed inafile.com from obsolete hosts

September 22, 2015
Version 1.1.8.6
fixed nitroflare false premium

September 22, 2015
Version 1.1.8.5
fixed userscloud.com false premium
fixed usersfiles.com false premium
changed arabloads.com to arabloads.net
changed nowdownloads.eu to nowdownloads.ch

September 21, 2015
Version 1.1.8.3
added ryushare.com to obsolete hosts.

September 20, 2015
Version 1.1.8.2
fixed nitroflare not showing premium links
added down4files.com,storfiles.co,filehost.pw

September 16, 2015
Version 1.1.8.1
added crisshare.com to obsolete hosts
fixed filemoney.com false premium
fixed fileparadox.com/ rapidsonic.com/ 3files.net false premium

September 14, 2015
Version 1.1.8.0
added to obsolete hosts...
sharebeast.com
tufiles.ru

September 12, 2015
Version 1.1.7.9
fixed rghost.net false premium
fixed unlimitzone.com false premium
fixed turbobit.net false live link

September 11, 2015
Version 1.1.7.8
Fixed filefactory.com false premium.

September 07, 2015
Version 1.1.7.7
fixed "depositfiles.com/en/files" links not checking

September 06, 2015
Version 1.1.7.6
added French code for 1fichier

August 29, 2015
Version 1.1.7.5
fixed depositfiles
fixed mega.co.nz/mega.nz
(fixed by yurii)

August 23, 2015
Version 1.1.7.4
Fixed uploadrocket (by yurii)

August 20, 2015
Version 1.1.7.3
fixed depfile.com false premium
fixed 1fichier false premium
fixed rapidgator false premium

August 08, 2015
Version 1.1.7.1
fixed unlimitzone.com, added freakshare to obsolete hosts.

August 07, 2015
Version 1.1.7.0
fixed...
streamin.to
thefile.me
vidzi.tv
added...
filenuke.com
vidto.me
vidspot.net
sharesix.com
sharesix.net
movpod.in,

August 07, 2015
Version 1.1.6.9 added...
thefile.me
vidzi.tv
videoweed.es
vodlocker.com
nowvideo.sx
cloudtime.to
thevideo.me
vidbull.com
allmyvideos.net
novamov.com
filehoot.com
stagevu.com
gorillavid.in
streamin.to

August 02, 2015
Version 1.1.6.8
added cloudshares.net

August 01, 2015
Version 1.1.6.7
fixed depfile redirectors false premium

July 31, 2015
Version 1.1.6.6
fixed depfile.com false premium
*/