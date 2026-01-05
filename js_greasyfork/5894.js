// ==UserScript==
// @name			W.A.R. Links Checker Customized
// @description		Automatically checks links from hundreds of file hosts.
// @details			this script automatically checks links from filehosts. For Firefox, Chrome, Opera, Safari. 
// @version			1.2.4.7.7.0
// @license			GPL version 3 or any later version (http://www.gnu.org/copyleft/gpl.html)
// @icon            http://sharenxs.com/photos/2014/02/14/52fd759db90ac/cooltext1428903746.png
// @author			mental
// @include			http://*
// @include			https://*
// @include			file:///*
// @grant			GM_xmlhttpRequest
// @grant			GM_addStyle
// @grant			GM_registerMenuCommand
// @grant			GM_getResourceText
// @require			https://ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js
// @homepage        http://usa.x10host.com/mybb/
// @namespace        http://usa.x10host.com/mybb/
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/2023/WAR%20Links%20Checker%20Customized.user.js
// @updateURL https://update.greasyfork.org/scripts/2023/WAR%20Links%20Checker%20Customized.meta.js
// ==/UserScript==

var War_version = "1.2.4.7.7.0. July 16, 2016";

//separate alternative domains with "|" char (first name is considered being main)
var allHostNames = ["1fichier.com|dl4free.com", "2shared.com", "adrive.com", "bezvadata.cz", "filebeam.com","4upld.com","newfileland.com",
"burnupload.com|burnupload.ihiphop.com", "cramit.in|cramitin.net","dataport.cz", "datei.to", "daten-hoster.de|filehosting.org",
"vidxden.com|vidbux.com", "easy-share.com|crocko.com", "easybytez.com", "edisk.cz", "euroshare.eu", "fastshare.cz", "fiberupload.net",
"filefactory.com", "eyesfile.net|eyesfile.com|eyesfile.co|eyesfile.org|eyesfiles.com", "fileflyer.com", "filerio.com|filekeen.com", "filemonster.net",
"nosupload.com", "upsto.re", "files.mail.ru", "filepost.com|fp.io", "filesflash.com", "upafile.com", "turbobit.net","filepom.com",
"secureupload.eu", "filesmonster.com", "filestore.to", "freakshare.net", "filedwon.com", "ukfilehost.com", "free-uploading.com",
"gigapeta.com", "gigasize.com", "gigaup.fr", "videopremium.net", "hostuje.net", "vidup.me", "dizzcloud.com","gboxes.com","clicknupload.com",
"filehost.ro", "gorillavid.in", "hulkshare.com|hu.lk", "ifolder.ru", "jumbofiles.com", "allmyvideos.net", "sharerepo.com","faststore.org",
"leteckaposta.cz|sharegadget.com", "load.to", "mediafire.com", "megafileupload.com", "megashares.com", "filemaze.ws", "movshare.net",
"myupload.dk", "narod.ru|narod.yandex.ru", "netload.in", "speedvid.tv", "partage-facile.com", "putlocker.com|firedrive.com", "fileim.com",
"ultramegabit.com", "sfshare.se", "filewe.com", "queenshare.com|10upload.com", "quickshare.cz", "putcker.com","cloudzilla.to",
"daj.to", "depositfiles.com|dfiles.eu", "rapidgator.net|rg.to", "rarefile.net", "rayfile.com", "rghost.net", "sendmyway.com",
"4savefile.com", "filebulk.com", "videozed.net", "sendspace.com", "share-online.biz|egoshare.com", "sharingmaster.com", "fileplaneta.com",
"midupload.com", "solidfiles.com", "speedfile.cz", "filenuke.com", "fileparadox.in","fileparadox.com", "creafile.net", "rapidstation.com",
"speedshare.org", "tufiles.ru", "zippyshare.com", "ryushare.com", "rodfile.com", "wikiupload.com", "uloz.to|ulozto.cz|bagruj.cz|zachowajto.pl",
"ulozisko.sk", "uloziste.com", "basicupload.com", "fileneo.com", "uploaded.to|ul.to", "uploading.com","wizupload.com",
"swankshare.com", "uploadspace.pl", "upnito.sk", "uptobox.com", "usaupload.net", "veehd.com", "videobb.com", "filecloud.cc", "flexydrive.com",
"uploads.bizhat.com", "webshare.cz", "xdisk.cz", "yunfile.com|filemarkets.com|yfdisk.com", "nitrobits.com", "mega-myfile.com",
"divshare.com", "flyfiles.net", "nowdownload.eu", "prefiles.com", "axifile.com", "zalil.ru", "ortofiles.com", "uploadc.com",
"amonshare.com", "data.hu", "blitzfiles.com", "filesbowl.com", "freestorage.ro", "spaceforfiles.com|filespace.com", "zalaa.com",
"netkups.com", "file-speed.com", "hulkload.com", "speedshare.eu", "tusfiles.net", "uppit.com", "ddlstorage.com",
"downloadani.me", "filesabc.com", "share.az", "sockshare.com", "nekaka.com", "file4safe.com", "sharebeast.com", "180upload.com", "verzend.be",
"zomgupload.com", "ravishare.com", "movreel.com", "4up.me|4upfiles.com", "extmatrix.com", "sendfiles.nl", "yourfilestore.com",
"filebig.net", "sharesix.com", "fileswap.com", "potload.com", "thefilebox.com","vip-file.com","freakshare.com",
"exclusivefaile.com|exclusiveloader.com", "filesbb.com", "myvdrive.com", "filesin.com", "novafile.com","fileupload.pw",
"longfiles.com", "albafile.com", "host4files.com", "uploadhero.com|uploadhero.co", "uploadbaz.com", "expressleech.com", 
"file-space.org", "stahovadlo.cz", "datafilehost.com", "bitupload.com", "bayfiles.net", "vshare.eu", "files.indowebster.com", "file4u.pl", "kie.nu",
"superload.cz", "mafiastorage.com", "fileband.com", "filesmall.com", "flashx.tv", "filesmelt.com", "hellupload.com",
"uploadingit.com", "stiahni.si", "sendspace.pl", "fastshare.org", "divxstage.eu", "sinhro.net", "filestore.com.ua",
"filesbomb.com", "project-free-upload.com", "imzupload.com", "hostingbulk.com", "speedy-share.com", "100shared.com", "igetfile.com",
"xvidstage.com", "vidbull.com", "rapidfileshare.net", "filebox.ro|fbx.ro", "mixturecloud.com|mixturefile.com", "filefront.com|gamefront.com",
"yourupload.com", "file-upload.net", "restfiles.net|restfile.com", "fliiby.com", "dodane.pl", "usersfiles.com", "upgolden.com|shallfile.com",
"jumbofiles.org|jumbofilebox.com", "rapidapk.com", "upshared.com", "upload.ee", "putme.org", "hugefiles.net", "mega.nz|mega.co.nz", "thefile.me",
"unlimitshare.com", "share4web.com", "epicshare.net", "novamov.com", "filedropper.com|filesavr.com", "yourfiles.to", "skydrive.live.com",
"uploadboy.com", "city-upload.com", "mijnbestand.nl", "ultrashare.net", "dosya.tc", "exfile.ru", "fileshare.ro", "fshare.vn", "wikifortio.com",
"wyslijto.pl", "kiwi6.com", "localhostr.com|lh.rs|hostr.co", "remixshare.com", "hidemyass.com", "tinyupload.com", "gigabase.com", "trainbit.com",
"videobam.com", "hyperfileshare.com", "uploads.ws", "ge.tt", "donevideo.com", "mightyupload.com", "megafiles.se", "1st-files.com", 
"cloud-up.be", "fiberstorage.net", "uploadhunt.com", "junocloud.me", "karelia.pro", "boomupload.net", "bestreams.net", "1-clickshare.com", "flashdrive.it",
"fastupload.ro", "fujifile.me", "howfile.com", "failai.lt", "vidspot.net", "file4go.com", "hostinoo.com", "movdivx.com", "pandamemo.com", "youwatch.org",
"spicyfile.com", "m5zn.com", "upload-il.com", "sube.me", "files2upload.net", "vidto.me", "hyshare.com", "filezy.net", "arabloads.com",
"filesline.com", "megacache.net", "sanshare.com", "sendfile.su", "akafile.com", "todayfile.com", "lafiles.com", "medofire.com", "mystore.to",
"anonfiles.com", "upitus.net", "medafire.net", "medoupload.com", "fastflv.com", "herosh.com", "girlshare.ro", "bin.ge", "nowvideo.eu", "video.tt",
"shareplace.com", "terafiles.net", "uploadmb.com", "exfilehost.com", "cometfiles.com", "filetug.com", "datafile.com", "shareswift.com", "ex-load.com",
"depfile.com", "uncapped-downloads.com", "isavelink.com", "filesear.com", "clicktoview.org", "promptfile.com", "zixshare.com", "maxisharing.com",
"katzfiles.com", "filebar.kz", "yourfilelink.com", "1file.cc", "backin.net", "uploadscenter.com", "vidhog.com", "qshare.com", "guizmodl.net",
"1000shared.com", "gigfiles.net", "freakbit.net", "upload-novalayer.com", "filewist.com", "airupload.com", "dropbox.com", "uplds.com", "wikisend.com",
"wrzuc.to", "safecloud.so", "webfilehost.com", "myuplbox.com", "roshare.info", "demo.ovh.eu", "treefile.org|treefiles.com|treesfile.com",
"filepup.net", "divxpress.com", "dwn.so|dwnshare.pl", "sharephile.com", "upgiga.com", "koofile.com", "earnupload.eu",
"netkozmos.com", "maherfire.com", "droidbin.com", "d-h.st", "loadpot.net", "kingfiles.net", "shareblue.eu", "redload.net", "upfile.vn", "tuxfile.com",
"grifthost.com", "limevideo.net", "batshare.com", "lunaticfiles.com", "wozupload.com", "kingsupload.com", "media1fire.com",
"usefile.com", "vidplay.net", "mydisc.net", "med1fire.com", "stahuj.to", "upbooth.com", "anysend.com", "vodlocker.com", "uploadrocket.net",
"vidx.to", "filecloud.io", "foxishare.com", "redbunker.net", "uploadnetwork.eu", "cloudstor.es", "uploadable.ch", "streamratio.com", "worldbytez.com",
"cloudvidz.net", "maskfile.com", "hexupload.com", "moevideo.net", "dogupload.com", "sendfile.pl", "shareprofi.com", 
"salefiles.com", "anafile.com", "bonanzashare.com", "shared.com", "filetrip.net", "fileshareup.com", "imgjungle.com", "unlimitzone.com", "rapidu.net",
"filepi.com", "swatupload.com", "2downloadz.com", "qfpost.com", "rapidfiles.com", "rosharing.com", "storagely.com", "turtleshare.com",
"uploadzeal.com", "wipfiles.net", "superupload.com", "tropicshare.com", "archive.org", "played.to", "streaming.to", "uploadcapital.com", "twojepliki.eu",
"filemoney.com", "filehoot.com", "mxua.com", "uploadsat.com", "cloudyvideos.com", "filekom.com|filemac.com", "interfile.net",
"idup.in", "filedais.com", "fileforever.net", "rioupload.com", "migupload.com", "medofire.co", "filemonkey.in", "bluehaste.com", "up09.com", "nodaup.com",
"filecore.co.nz", "4downfiles.com", "1clickfiles.com", "weshare.me", "filemup.com", "hottera.com", "lomafile.com",  "hightail.com|yousendit.com",
"4bigbox.com", "10shared.com", "megaupdown.com", "poslisoubor.cz", "radicalshare.com", "share-byte.net", "sharemods.com", "skyfilebox.com", "crisshare.com",
"vipshare.me","datoid.cz","streamfile.com","cloudstor.es","google.com","files.fm","aisfile.com","pan.baidu.com","yunpan.cn","dotsemper.com",
"gulfup.com","box.net","box.com","sharerapid.cz","rusfolder.net","rusfolder.com","freefilehosting.net","fileshareup.com",
"k2s.cc|keep2share.cc|keep2s.cc|keep2share.com","goldbytez.com","speedy.sh","fboom.me|fileboom.me","megarapid.cz","yadi.sk","4shared.com","inafile.com",'uploadc.com',"shareflare.net",
"megairon.net","imdb.com","hitfile.net","uploadto.us","nitroflare.com","up.top4top.net","free.fr","led.wf","lan.wf","adlink.wf","catshare.net","rockfile.eu",
"click.tf","kyc.pm","ssh.tf","ssh.yt","yep.pm","brupload.net",];

try {
	//iframes excluded
	if (window.top != window.self) {
		return;
	}
	
	//allHostNames sites excluded
	if (window.location.href.match("https?:\/\/(www\.)?[\w\.-]*(?:" + allHostNames.join("|").replace(/\./g, "\\.").replace(/-/g, "\\-") + ")")) {
		return;
	}
} catch (e) {
	return;
}

//separate alternative domains with "|" char (first name is considered being main)
var allContainerNames = ["safelinking.net"];

//separate alternative domains with "|" char (first name is considered being main)
var allObsoleteNames = ["uloz.cz","storage.to","iskladka.cz","file-rack.com","fast-load.net","subory.sk","bigandfree.com","uplly.com",
"fileop.com","mujsoubor.cz","sendfile.to","superfastfile.com","quickyshare.com","duckload.com","uploadstore.net","meinupload.com",
"dualshare.com","2xupload.to|2xupload.de","oxedion.com","uploadline.com","dll.bz","movieshare.in","milledrive.com","quickupload.net",
"safelink.in","metadivx.com","divxlink.com","uploadrack.com","teradepot.com","dataup.to","upit.to","driveway.com","eatlime.com",
"a2zuploads.com","friendlyfiles.net","flyfile.us","speedyshare.com","uploadspace.eu","keepfile.com","piggyshare.com","luckyshare.net",
"filecrown.com","6giga.com","uploadjockey.com","bluehost.to","filegu.ru","filebase.to","up-file.com","xvideos.com","esnips.com",
"filebling.com","loaded.it","uploadcell.com","uploadshare.cz","mangoshare.com","filestab.com","crazyupload.com","gaiafile.com",
"sharejunky.com","fileho.com","bigandfree.com","bigfile.in","bigshare.eu","dahosting.org","digisofts.net","file4save.com",
"filechip.com","filescloud.com","saveqube.com","turboshare.de","z-upload.com","youshare.com","jiffyupload.com","gigeshare.com",
"datenklo.net","upload.dj","loadfiles.in","upit.to","dsfileshare.com","sharesimple.net","4files.net","wooupload.com", "filesaur.com",
"odsiebie.com","filenavi.com","3oof.com","meshwaar.com","maxupload.com","share.cx","atserver.eu","uploking.com","terafile.co", "terafile.com",
"file2upload.net","filebling.com","turboshare.com","rarhost.com","isharehd.com","i741.com","dataup.de","fofly.com","shareonall.com",
"sexuploader.com","megaupload.com|megavideo.com|megaporn.com|megarotic.com","uploadhyper.com","filespawn.com","caizzii.com",
"volnyweb.cz","usershare.net","filescash.net","metahyper.com","combozip.com","x7.to","uploadbox.com","enterupload.com|flyupload.com",
"filepoint.de","mystream.to","x-fs.com","shareator.com","srapid.eu","sosame.cz","filesdump.com","2-klicks.de","ufox.com",
"silofiles.com","upfile.in","filehook.com","uploadking.com","uploadhere.com","kewlshare.com","rapidable.com","hotfiles.ws","rapidshare.ru",
"filesonic.com|sharingmatrix.com","fileserve.com","wupload.com", "skipfile.com", "smartuploader.com", "dualshare.com", "storeandserve.com",
"mountfile.com", "transitfiles.com", "uploadstation.com", "filejungle.com", "shareshared.com", "quickyshare.com", "save.am", "petandrive.com",
"file2box.com", "flyshare.cz", "yabadaba.ru", "cloudcache.cc", "yourfilehost.com", "jakfile.com", "kickload.com", "pyramidfiles.com",
"refile.net", "zshare.net", "ddlani.me|ddlanime.com", "ftp2share.com", "fooget.com", "rapidhide.com", "gotupload.com", "mooload.com",
"zupload.com", "mytempdir.com", "onionshare.com", "stahnu.to", "oron.com", "badongo.com","filereactor.com","filegaze.com","4bytez.com",
"1hostclick.com", "anonstream.com", "batshare.com", "bitroad.net", "brontofile.com", "cloudnxt.net", "cloudnator.com|shragle.com",
"coolshare.cz", "dotavi.com", "ezyfile.net", "file-bit.net", "filecosy.com", "fileduct.com|fileduct.net", "filefat.com", "filelaser.com", "filemashine.com",
"fileserver.cc", "filetechnology.com", "fireuploads.net", "gigfiles.net", "holderfile.com", "ihostia.com", "k2files.com", "mojofile.com",
"ovfile.com", "qshare.com", "shafiles.me", "sharefilehost.com", "shareupload.com", "stahuj.to", "ugotfile.com", "uploadboost.com",
"vidhog.com", "xfileshare.eu", "bzlink.us", "bulletupload.com", "bloggerarticles.com", "mojedata.sk", "sharpfile.com",
"filerobo.com","filevelocity.com","filezpro.com","file4sharing.com","cing.be","ufile.eu","pigsonic.com","fileupped.com","sharerun.com","rapidshare.com",
"rapidslnare.com","bestsharing.com","savefiles.net","file2share.biz","filecache.de","monsteruploads.eu","b9bb.com","aiotool.net","jamber.info",
"megaftp.com","desiupload.net","file27.com","yastorage.com","filehost.ws","copyload.com","venusfile.com","aieshare.com","uploadwaste.com","billionuploads.com",
"fileza.net","filerose.com","squillion.com","fileprohost.com","bitbonus.com","warserver.cz","uload.to","sharedbit.net","megaload.it","filewinds.com","megabitshare.com",
"uploadcore.com","syfiles.com","eyesfile.com","hotfile.com","superupl.com","oteupload.com","henchfile.com","filegag.com","HenchFile.com","filedefend.com",
"xtu.me","sharebase.de","upgrand.com","nasdilej.cz","mediatack.cz","share-it.to","primeupload.com","filebeer.info","baberepublic.com","bitshare.com",
"share-rapid.com|rapids.cz|share-credit.cz|share-central.cz|share-ms.cz|share-net.cz|srapid.cz|share-rapid.cz","czshare.com","przeklej.net","filecity.net",
"megarelease.org","storagon.com","rocketfile.net","filecity.eu","ziddu.com","acefile.net","sdilej.cz","clz.to","cloudzer.com","fileom.com",
"extabit.com","cloudzer.net","247upload.com","2download.de","4fastfile.com","asixfiles.com","berofile.com","bigupload.com","cepzo.com","clouds.to","cobrashare.sk",
"coraldrive.net","cyberlocker.ch", "darkport.org", "dark-uploads.com", "davvas.com", "enigmashare.com", "erofly.cz", "fastsonic.net", "filebox.com", "filedap.com", 
"filedino.com", "filedownloads.org", "filefolks.com", "fileking.co", "filemates.com", "files.to", "files2k.eu", "filesector.cc", "filesega.com", "filesend.net",
"filestay.com", "filestrum.com", "fileuplo.de", "fileupup.com", "forunesia.com", "freeuploads.fr","uploa.dk","getthebit.com","getzilla.net","goldfile.eu",
"good.com","grupload.com","hellfile.com","hipfile.com","hitfile.com","hulkfile.eu|duckfile.net","i-filez.com","ifile.ws","kupload.org","packupload.com",
"lemuploads.com","limelinx.com","maxshare.pl","megashare.com","minus.com|min.us","mlfat4arab.com","multishare.cz","nirafile.com","ok2upload.com","peejeshare.com",
"premiuns.org","qkup.net","rapidupload.sk","rockdizfile.com","share-now.net","share76.com","sharebees.com","sharefiles.co","slingfile.com","asfile.com","filesfrog.net",
"sms4file.com",	"space4file.com","tigershare.net","toucansharing.com","ubuntuone.com","unextfiles.com","upaj.pl","upfile.biz","uploadbin.net","uploadic.com","uploadinc.com",
"uploading4u.eu","uploadjet.net","uploadorb.com","upthe.net",	"uptorch.com","vidbox.yt","videozer.com","vreer.com","wallobit.com","zooupload.com","privatefiles.com","xerver.co",];

String.prototype.contains = function(searchString) {
	if (searchString.constructor === RegExp) {
		if (searchString.test(this)) return true;
		else return false;

	} else if (searchString.constructor === String) {
		function replaceStr(string) {
			return string.replace(new RegExp(RAND_STRING, 'g'), '|');
		}

		searchString = searchString.replace(/\\\|/g, RAND_STRING);
		var searchArray = searchString.split('|');

		if (searchArray.length > 1) {
			var found = false;
			var i = searchArray.length;

			while (i--) {
				if (this.indexOf(replaceStr(searchArray[i])) > -1) {
					found = true;
					break;
				}
			}

			return found;

		} else {
			if (this.indexOf(replaceStr(searchString)) > -1) return true;
			else return false;
		}
	} else {
		throw new TypeError('String.contains: Input is not valid, string or regular expression required, ' + searchString.constructor.name + ' given.');
	}
}

var firstRun = JSON.parse(localStorage.getItem("War_First_Run"));
if (firstRun == null) firstRun = true;

var chromeBrowser = /chrom(e|ium)/.test(navigator.userAgent.toLowerCase());

var preferences = JSON.parse(localStorage.getItem("War_Preferences"));

allHostNames.sort();
allContainerNames.sort();
allObsoleteNames.sort();

var RAND_STRING = "8QyvpOSsRG3QWq";
var RAND_INT = Math.floor(Math.random()*10000);
var RAND_INT2 = Math.floor(Math.random()*10000);
var ANONYMIZE_SERVICE;
var ANONYMIZERS = ['http://hiderefer.com/?', 'http://anonymz.com/?', 'http://www.blankrefer.com/?', 'http://hidemyass.com/?', 'http://nullrefer.com/?', 'http://refhide.com/?'];
var TOOLTIP_MAXWIDTH = 600; //in pixels

//global settings start
var Do_not_linkify_DL_links, Display_tooltip_info, Last_Update_Check, Allow_spaces_in_DL_links, Display_full_links_in_link_containers;
var Processbox_Pos_X, Processbox_Pos_Y, Progressbox_Scaling;

var cLinksTotal = 0;
var cLinksDead = 0;
var cLinksAlive = 0;
var cLinksUnava = 0;
var cLinksUnknown = 0;
var cLinksProcessed = 0;

var filehostsAlive = "";
var filehostsDead = "";
var filehostsUnava = "";
var filehostsUnknown = "";

var intervalId; //for updateProgress()

//icon resources
var alive_link_png	= 'data:image/png;base64,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';
var adead_link_png	= 'data:image/png;base64,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';
var unava_link_png	= 'data:image/png;base64,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';
var processing_link_gif = 'data:image/gif;base64,R0lGODlhCgAKAJEDAMzMzP9mZv8AAP///yH/C05FVFNDQVBFMi4wAwEAAAAh+QQFAAADACwAAAAACgAKAAACF5wncgaAGgJzJ647cWua4sOBFEd62VEAACH5BAUAAAMALAEAAAAIAAMAAAIKnBM2IoMDAFMQFAAh+QQFAAADACwAAAAABgAGAAACDJwHMBGofKIRItJYAAAh+QQFAAADACwAAAEAAwAIAAACChxgOBPBvpYQYxYAIfkEBQAAAwAsAAAEAAYABgAAAgoEhmPJHOGgEGwWACH5BAUAAAMALAEABwAIAAMAAAIKBIYjYhOhRHqpAAAh+QQFAAADACwEAAQABgAGAAACDJwncqi7EQYAA0p6CgAh+QQJAAADACwHAAEAAwAIAAACCpRmoxoxvQAYchQAOw%3D%3D';

//global settings end

function linkify(filterId) { //code from http://userscripts.org/scripts/review/2254 Linkify ting	
	if (!filterId) {
		var regexy = "", ikkeTilladteTags = [];

		if (Allow_spaces_in_DL_links) {
			regexy = "(?:http:\/\/.+?\\?)?(?:https?:\/\/)?(?:[\\w\\.\\-]*[\\w\\-]+\\.(?:com?\\.\\w{2}|in\\.ua|uk\\.com|\\w{2,4})(?::\\d{2,5})?\/|(?:www\\.)?\\w{6,}\\.1fichier\\.com)[\\w\\Ã¢â‚¬â€œ\\-\\.+$!*\\/\\(\\)\\[\\]\',~%?:@#&=\\\\\\Ã¢â‚¬â€;\\u0020Ã¢â‚¬Â¦Ãƒâ€”ÃƒÆ’\\_\\u0080-\\u03FFÃ¢â‚¬â„¢Ã¢â‚¬Ëœ\\|]*";
		} else {
			regexy = "(?:http:\/\/.+?\\?)?(?:https?:\/\/)?(?:[\\w\\.\\-]*[\\w\\-]+\\.(?:com?\\.\\w{2}|in\\.ua|uk\\.com|\\w{2,4})(?::\\d{2,5})?\/|(?:www\\.)?\\w{6,}\\.1fichier\\.com)[\\w\\Ã¢â‚¬â€œ\\-\\.+$!*\\/()\\[\\]\',~%?:@#&=\\\\\\Ã¢â‚¬â€;Ã¢â‚¬Â¦Ãƒâ€”ÃƒÆ’\\_\\u0080-\\u03FFÃ¢â‚¬â„¢Ã¢â‚¬Ëœ\\|]*";
		}

		if (Do_not_linkify_DL_links) {
			ikkeTilladteTags = ['a', 'head', 'script', 'style', 'title', 'option', 'iframe', 'textarea', 'span']; //tags, hvor det der stAÃƒÅ½Ã…Â¾ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÅ½Ã¢â‚¬â„¢Ãƒâ€šÃ„â€žr inden i ikke skal vAÃƒÅ½Ã…Â¾ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÅ½Ã¢â‚¬â„¢Ãƒâ€šÃ‚Â¦re links
		} else {
			ikkeTilladteTags = ['a', 'head', 'script', 'style', 'title', 'option', 'iframe', 'textarea']; //tags, hvor det der stAÃƒÅ½Ã…Â¾ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÅ½Ã¢â‚¬â„¢Ãƒâ€šÃ„â€žr inden i ikke skal vAÃƒÅ½Ã…Â¾ÃƒÂ¢Ã¢â€šÂ¬Ã¢â€žÂ¢ÃƒÅ½Ã¢â‚¬â„¢Ãƒâ€šÃ‚Â¦re links
		}

		var regex = new RegExp(regexy, "g");
		var censors = [	];

		var censorRegex = new RegExp("(?:https?:\/\/~[\\w\\s\\~]*\/*)|(?:http:\/\/.+?\\?)?(?:https?:\/\/)?[\\w\\.\\-]*~\\s?(?:" + censors.join("|") +  ")\\.*\\s?~[\\w\\Ã¢â‚¬â€œ\\-\\.+$!*\\/()\\[\\]\',~%?:@#&=\\\\\\Ã¢â‚¬â€;Ã¢â‚¬Â¦Ãƒâ€”ÃƒÆ’\\_\\u0080-\\u03FFÃ¢â‚¬â„¢Ã¢â‚¬Ëœ]*", "i");
		var ignoreImage = /(?:\.png|\.jpg|\.gif|\.jpeg|\.bmp)$/i, textNode, muligtLink;

		var path = "//text()[not(parent::" + ikkeTilladteTags.join(" or parent::") + ") and contains(.,'/')]";
		var textNodes = document.evaluate(path, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

		var i = textNodes.snapshotLength;
	
		while (i--) {
			textNode = textNodes.snapshotItem(i);
			muligtLink = textNode.nodeValue; //all links on page

			var myArray = null;
			if (regex.test(muligtLink)) {
				var span = document.createElement('span'), lastLastIndex = 0, myArray = null;
				regex.lastIndex = 0;

				while (myArray = regex.exec(muligtLink)) {
					var link = $.trim(myArray[0]); //removes whitespace from beginning and end of link (can sometimes cause issues when spaces are still picked up by the regex even when Allow_spaces_in_DL_links is false)
				
					var hostName = gimmeHostName2(link);
					var hostNameSafe = hostName.replace(/\./g, "_dot_").replace(/\-/g, "_dash_").toLowerCase();
					if (hostName == gimmeHostName(window.location.hostname) || !hostsIDs[hostNameSafe] || ignoreImage.test(link.replace(/\[\/img\]$/, ""))) {
						continue;
					}
				
					span.appendChild(document.createTextNode(muligtLink.substring(lastLastIndex, myArray.index)));

					var $a = $("<a>" + link + "</a>")
				
					if (!link.match(/https?:\/\//)) {
						link = 'http://' + link;
					}

					$a.attr("href", link.replace(/\[\/hide:\w+\]/,"")).appendTo(span);
				
					lastLastIndex = regex.lastIndex;
				}

				span.appendChild(document.createTextNode(muligtLink.substring(lastLastIndex)));
				textNode.parentNode.replaceChild(span, textNode);
			} else if (censorRegex.test(muligtLink)) {
				if (textNode.parentNode.className == "obsolete_link") continue;
				var censoredLink = muligtLink.match(censorRegex)[0];
				if (ignoreImage.test(censoredLink)) continue;
				var span = document.createElement('span');
					span.innerHTML = censoredLink;
					span.className = "obsolete_link";
					$(span).attr('warlc_error', "Cause of error: <b>Censored link.</b>");
					span.addEventListener("mouseover", displayTooltipError, false);
				if (filehostsDead.search("censored links") == -1) filehostsDead += "censored links,";	
				cLinksTotal++; cLinksProcessed++; cLinksDead++;
				textNode.parentNode.replaceChild(span, textNode);
			}
		}
	}
		
	var jQ;
	filterId ? jQ = "a." + filterId : jQ = "a";
	var as = $(jQ);
	var i = as.length;
	var currA, hostNameSafe, hostID;
	while(i--) {
		currA = as[i];

		if (/^https?:\/\/\*{7,100}\//.test(currA.href)||/^https?:\/\/~[\w\s\~]*\//.test(currA.href))
		{
			currA.className = "obsolete_link";
			cLinksDead++;
		}
		if (currA.href && /^https?:\/\//.test(currA.href) && gimmeHostName2(currA.href) != -1 && gimmeHostName2(currA.href) != gimmeHostName(window.location.host) && (!currA.className || currA.className == "processing_link" || currA.className == filterId)) {
			hostNameSafe = gimmeHostName2(currA.href).replace(/\./g, "_dot_").replace(/\-/g, "_dash_").toLowerCase();
			if (!hostsIDs[hostNameSafe]) {
				if (filterId) cLinksTotal--; currA.className = '';
				continue;
			} else {
				var ix = hostsIDs[hostNameSafe].length;
				while(ix--) {
					if (new RegExp(hostsIDs[hostNameSafe][ix].linkRegex).test(currA.href)) {
						currA.className = "processing_link";
						hostID = hostsIDs[hostNameSafe][ix].hostID;
						hostsCheck[hostID].links.push(currA);
						foundMirrors[hostID.substr(0,2)].push(hostID);
					}
				}
			}
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
/* change link colors */
		GM_addStyle(
			".alive_link {background:transparent url(" + alive_link_png + ") no-repeat scroll 100% 50%;background-size:13px;padding-right:13px;color:green !important;}\
			.adead_link {background:transparent url(" + adead_link_png + ") no-repeat scroll 100% 50%;background-size:13px;padding-right:13px;color:red !important;}\
			.obsolete_link {background:transparent url(" + adead_link_png + ") no-repeat scroll 100% 50%;background-size:13px;padding-right:13px;color:red !important;}\
			.unava_link {background:transparent url(" + unava_link_png + ") no-repeat scroll 100% 50%;background-size:14px;padding-right:13px;color:#FFD700 !important;}\
			.processing_link {background:transparent url(" + processing_link_gif + ") no-repeat scroll 100% 50%;background-size:13px;padding-right:16px;color:grey !important;}\
			.container_link {background:transparent url(" + processing_link_gif + ") no-repeat scroll 100% 50%;background-size:13px;padding-right:16px;color:Darkkhaki !important;}"
		);
	}
}

var warlcTooltip = null, mouseoverLink = null; //link href with mouse cursor over it

var lastX = 0, lastY = 0;

$(document).ready(initTooltip);
	
//inits tooltip	
function initTooltip()
{	warlcTooltip = document.createElement("div");
	warlcTooltip.setAttribute("style", "background: #EAEAEA; box-shadow: 0 1px 5px rgba(0, 0, 0, 0.5);padding: 6px 6px 6px 6px; border-radius:2px; border:2px solid #6699CC; color:#000000;font-family:Verdana,sans-serif;font-size:11px;position:absolute;z-index:1000; max-width: " + TOOLTIP_MAXWIDTH + "px;");
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
	
	warlcTooltip.innerHTML = '<b>CHECKING...</b>';
	warlcTooltip.style.minWidth = 0;
	warlcTooltip.style.visibility = "visible";
	
	if ($(this).attr('warlc_error')) { //an error message is already known and stored in warlc_error attribute
		warlcTooltip.innerHTML = $(this).attr('warlc_error');
	}
	else
	{
		loadErrorInfo(this);
	}
	
	function loadErrorInfo(link)
	{
		var href = link.href;
		if (link.href.contains('anysend.com') && link.name) href = link.name;
		href = href.replace(/quickshare\.cz\/.+/, "quickshare.cz/chyba");
		
		GM_xmlhttpRequest({
			method: 'GET',
			url: href.replace(ANONYMIZE_SERVICE, ""),
			headers: {
				'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
				'Accept': 'text/xml,application/x-httpd-php',
				'Referer': ""
			},
			onload: function(result) {
				var res = result.responseText;
				//console.log(res);
				//TODO: errorRegexs - 
				var errorRegexs = 	[	//generic error messages follow
										/(empty directory)/i,
										/(soubor nebyl nalezen)/i,
										/((?:file|page|link|folder)(?:is|not|does|has been|was|has| ){1,}(?:found|available|blocked|exists?|deleted|removed|expired))/i,
																				
										//server specific error messages follow
										/msg error" style="cursor: default">(.+?)<\/div>/, //sendspace
										/color:red;font\-weight:bold;border\-style:dashed;font-size:12px;border\-width:2px;><tr><td align=center>(.+?)<\/td>/, //fastshare
										/errorIcon">\s*<p><strong>(.+?)<br \/>/, //filefactory
										/no_download_msg">\s*(.+?)<span/, //depositfiles
										/(TakovÃƒÂ½ soubor neexistuje. Je moÃ…Â¾nÃƒÂ©, Ã…Â¾e byl jiÃ…Â¾ smazÃƒÂ¡n.)/, //quickshare
										/file_info file_info_deleted">\s*<h1>(.+?)<\/h1>/, //filepost
										/<br \/>\s*<p style="color:#000">(.+?)<\/p>\s*<\/center>/, //letitbit
										/(?:error_div">|<\/h1><p>)<strong>(.+?)<\/strong>/, //share-rapid,quickshare
										/class="red">(.+?)<(?:span|br)>/, //czshare, megashares
										/class="wp640">\s*<h1 class="h1">(.+?)<\/h1>/, //uloz.to
										/download_file">\s*<tr>\s*<td>(.+?)<\/td>/, //hotfile
										/error\.gif" \/>\s*(.+?)\s*<\/div>/, //uploading.com
										/not-found">\s*<p>(.+?)<\/p>/, //bayfiles
										/(Your file could not be found. Please check the download link.)/, //stahnu.to
										/error_msg">\s*(<h3>.+?<\/h3><ul>(.+?)<\/ul>)/, //edisk
										/id="obsah">\s*<h2>(.+?)<\/h2>/, //euroshare
										/error">\s*(?:<[bp]>)?\s*(.+?)<\/[bp]>/, //filesmonster, shragle, gigapeta
										/center aC">\s*<h1>(.+?)<br \/>/, //uploaded.to
										/icon_err">\s*<h1>(.+?)<\/h1>/, //filejungle
										/Code: ER_NFF_\d+<\/h2>\s*(.+?)\s*<\/div>/, //netload
										/(File has been removed due to Copyright Claim)/, //filerio
										/<span style="color:red;" class="result-form">(.+?)<\/span>/, //safelinking
										/(The file link that you requested is not valid.)/, //2shared
										/#FF0000"><big>(.+?\s+.+?)<\/big>/, //jumbofiles
										/error_msg_title">(.+?)<\/h3>/, //mediafire
										/<span class="bold">(?:<br \/>)+(.+?)<\/span>/, //filebox
										/err">(.+?)</, //speedy-share, will work for others
										/message warning" style=".+?">\s+((?:.+?\s+)+?)<\/div>/, //cloudzer	
										/<h2 class="error">(.+?)<\/h2>/, //gigasize.com	
										/<h1 class="filename" id="status">(.+?)<\/h1>/, //anysend.com
										/<title>(Removed download) \| AnySend<\/title>/, //anysend.com
										/<div class='message t_0'>(.+?)<\/div>/, //sockshare.com						
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
				$(link).attr('warlc_error', error);				
				
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
	if (this.href.contains(/(?:uloziste\.com|filemonster\.net|uploadbin\.net|adrive\.com|dropbox(?:usercontent)?\.com|karelia\.pro|archive\.org|demo\.ovh\.eu)/))
	{
		return;
	}
	
	this.addEventListener("mouseout", hideTooltip);
	this.addEventListener("mousemove", function(event) { moveTooltip(event); });
	
	warlcTooltip.innerHTML = '<b>CHECKING...</b>';
	warlcTooltip.style.minWidth = 0;
	warlcTooltip.style.visibility = "visible";
	
	if (this.warlc_tooltipcache) //file size is already known and stored in warlc_filename and warlc_filesize attributes
	{
		warlcTooltip.innerHTML = this.warlc_tooltipcache;
	}
	else
	{
		loadInfo(this);		
	}
	
	function loadInfo(link)
	{
		var href = link.href;
		if (link.href.contains('anysend.com')) href = link.name;
		href = href.replace(/.*(?:share-online\.biz|egoshare\.com)\/(?:dl\/|download\.php\?id=|\?d=)(\w+)/, 'http://api.share-online.biz/linkcheck.php?links=$1');
		href = href.replace(/.*(?:uploaded|ul)\.(?:to|net)\/(?:files?\/|\?(?:lang=\w{2}&)?id=|f(?:older)?\/)?(?!img|coupon)(\w+)/, 'http://uploaded.net/api/filemultiple?apikey=lhF2IeeprweDfu9ccWlxXVVypA5nA3EL&id_0=$1');
		href = href.replace(/.*(?:depositfiles\.(?:com|lt|org)|dfiles\.(?:eu|ru))\/(?:en\/|ru\/|de\/|es\/|pt\/|)files\/(\w+)/, 'http://depositfiles.com/api/get_download_info.php?id=$1&format=json')
		//href = href.replace(/.*(?:cloudzer\.net|clz\.to)\/(?:file\/)?(\w+)/, 'http://cloudzer.net/api/filemultiple?apikey=mai1EN4Zieghey1QueGie7fei4eeh5ne&id_0=$1');
		
		GM_xmlhttpRequest({
			method: 'GET',
			url: href.replace(ANONYMIZE_SERVICE, ""),
			headers: {
				'Accept': 'text/xml,application/x-httpd-php',
				'Referer': ""
			},
			onload: function(result) {
					
				var res = result.responseText;
				//console.log(res);
				var nameRegexs = 	[	/File Name: (.+?)<\/p>/, //filesmall
										/(?:finfo|(?:file[-_]?)?name)(?:"|')?>\s*?(.+?)<\/?(?:h1|a|b|div|span style|td)/, //hellshare, uploaded.to, netload, badongo, 4fastfile, 
										/fl" title="(.+?)">/, //edisk
										/CelÃƒÂ½ nÃƒÂ¡zev: <a href="http:\/\/czshare.com\/\d+\/\w+\/">(.+?)<\/a>/, //czshare
										/<title>\s*(?:Download)?\s*(.+?)\s*(?::: DataPort|\| UloÃ…Â¾|- Share\-Rapid|- WEBSITENAME|download Extabit|- download now for free|\| refile)/, //dataport, uloz.to, share-rapid, shragle, extabit, filefactory, refile.net
										/<h3>Stahujete soubor: <\/h3>\s*<div class="textbox">(.+?)<\/div>/, //webshare
										/<h3><b><span style=color:black;>(.+?)<\/b><\/h3><br>/, //fastshare
										/title="download (.+?)">/, //sendspace
										/StÃƒÂ¡hnout soubor: (.+?)<\/h1>/, //quickshare
										/fz24">Download:\s*<strong>(.+?)<\/strong>/, //crocko
										/\w+:<\/b> (.+?)<\/h2>/, //filevelocity
										/'file\-icon\d+ \w+'>(?:<\/span><span>)?(.+?)<\/span>/, //hitfile, turbobit
										/d0FileName =  "(.+?)";/, //letitbit
										/file(?:_name|-info)" title="">\w+: <span>(.+?)<\/span>/, //vip-file, shareflare
										/download_file_title" title="(.+?)">/, //mediafire
										/dl\-btn\-label"> (.+?) <\/div>/, //mediafire
										/id="file_title">(.+?)<\/h1>/, //uploading.com
										/recent-comments"><h2>(.+) &nbsp;/, //xdisk
										/fname" value="(.+?)">/, //sharerun, syfiles, grupload, 
										/download\-header">\s*<h2>File:<\/h2>\s*<p title="(.+?)">/, //bayfiles
										/description">\s*<p><b>Soubor: (.+?)<\/b>/, //bezvadata
										/Complete name                            : (.+?)<br \/>/, //bezvadata
										/itemprop="name">(.+?)<\/span>/, //bezvadata
//										/Downloading:\s*<\/strong>\s*<a href="">\s*(.+?)\s*<\/a>/, //rapidgator
										/(?:Downloading |Lade herunter |<h1>)(.+?) \- \d+/, //bitshare, nitrobits
										/Downloading:<\/strong> (.+?) <span>/, //hotfile
										/<h1 class="black xxl" style="letter-spacing: -1px" title="(.+?)">/, //megashares
										/<span > (.+?) \(\d+.?\d+? \w+\)<\/span>/, //clipshouse
										/File Download Area<\/center><\/h1><center><h3>(.+?)<\/h3>/, //filebeam
										/<h2 class="float\-left">(.+?)<\/h2>/, //easyfilesharing
										/<h1 id="file_name" class=".+?" title="(.+?)">/, //box.com
										/file_info">\s+<h2><strong>(.+?)<\/strong>/, //fliiby
										/dateiname'>(.+?)<\/h1>/, //file-upload.net
										/Filename:<\/p>\s+<\/div>\s+<div class=".+?">\s+<p>\s+(.+?)\s+<\/p>/, //sharesix
										/File Name:<\/dt>\s+<dd>(.+?)<\/dd>/, //gamefront
										/<h2>Download File (.+?) <span id="span1">/, //jumbofiles.org
										/dir="ltr">(.+?) <\/td>/, //unlimitshare.com
										/nom_de_fichier">(.+?)<\/div>/, //uploadhero
										/OK;(.+?);\d+/, //share-online
										/File:\s*<span>(.+?)<\/span>/, //keep2share
										/Name:<\/font>\s*<font style=".+?">(.+?)<\/font>/, //zippyshare
										/online,\w+,\d+,\w+,(.+)/, //uploaded.net, cloudzer.net
										/\{"file_info":\{"size":"\d+","name":"(.+?)"\},"/, //depositfiles.com
										/File:<\/div>\s*\n*<div class="name">(.+?)<\/div>/, //dizzcloud.com
										/site-content">\s*\n*<h1>(.+?)<strong>/, //putlocker.com
										/<div class="external_title_left">(.+)<\/div>/, //putlocker.com
										/(?:File name|Nom du fichier) :<\/th><td>(.+?)<\/td>/, //1fichier.com
										/<div id="file_name" class="span8">\n\s+<h2>(.+?)<\/h2>/, //filefactory.com
										/<span class="bgbtn sprite fileIcon ext\w+"><\/span>\s+<strong title="(.+?)">/, //gigasize.com
										/<span class="label label-important">Downloading<\/span>\s<br>\s(.+?)\s[\d\.]+\s\w+\s<\/h4>/, //nowdownload.eu
										/<!-- File header informations  -->\n\s*<br\/>\n\s*<h1>(.+?)<\/h1>/, //mixturecloud.com
										/<span class="file-name">(.+?)<\/span>/, //anysend.com
										/<title>ULTRAMEGABIT\.COM - (.+?)<\/title>/, //ultramegabit.com
										/<title>Download (.+?) \| myUpload\.dk<\/title>/, //myupload.dk
										/<td width="300px" align="left" valign="top">Downloaded \d{1,} times<br>\nFile: (.+?)<br>/, //datafilehost.com
										/<div id="download\-title">\n\s*<h2>(.+?)<\/h2>/, //solidfiles.com
										/<div class="content_m"><div class="download"><h1>(.+?)<\/h1>/, //mystore.to
										/<h4 class="dl_name w420" >\s*(.+?) <span/, //myvdrive.com
										/<div class='badge pull-right'>.+?<\/div>\s*<h1>Download (.+?)<\/h1>/, //filemonkey.in
										/<strong>File name:<\/strong> (.+?)<br \/>/, //netkups.com
										/<div id="file_name" title="(.+?)">/, //uploadable.ch
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
				
				var preSizeRegex = '(?::|\\(|>|>, | - |\\[)';
				var postSizeRegex = '(?:\\))?';
				
				var sizeRegexs = 	[	 preSizeRegex + "\\s*(" + uniSizeRegex + ")\\s*" + postSizeRegex,
										'FileSize_master">(.+?)<\/strong>', //hellshare
										'Velikost: <strong>(.+?)<\/strong>', //warserver
										'File Size:(?:<\/b>) (.+?)<\/(?:p|td)>', //filesmall, unlimitzone
										'online,\\w+,(\\d+),', //uploaded.net
										'"file_info":{"size":"(\\d+)","name":', //depositfiles.com
										'(?:File size|Taille) :<\/th><td>(.+?)<\/td>', //1fichier.com
										';(\\d+)\n$', //share-online.biz
										'label-important">Downloading<\/span>.+?(' + uniSizeRegex + ') <\/h4>', //nowdownload.eu
										'<h5>Size : (' + uniSizeRegex + ')<\/h5>', //mixturecloud.com,
										'<td>\\n\\s*Total size:\\n\\s*</td>\\n\\s*<td>\\n\\s*(.+?)\\s*</td>', //anysend.com
										'<span class="size">(' + uniSizeRegex + ')</span>', //easybytez.com
										'span class="filename_normal">\\((' + uniSizeRegex + ')\\)</span>', //uploadable.ch
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
						fileName = nameCandidate[1].replace(/&nbsp;/g," ").replace("<br>", "");
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
				
				// Safelinking package info
				if (href.contains('safelinking.net/p/'))
				{
					var linkStatus = res.match(/<span style="color:green;" class="result-form">(.+?)<\/span>/);
					var linkTitle = res.match(/link\-title">(.+?)<\/span>/);
					var linkDesc = res.match(/description" class="result-form">(.+?)<\/span>/);
					if (linkStatus) { tooltip = "<b>Link status:</b> " + linkStatus[1].replace(/<\/?strong>/,"").replace(/<br\/>/, " "); }
					if (linkTitle) { tooltip += "<br><b>Title:</b> " + linkTitle[1]; }
					if (linkDesc) { tooltip += "<br><b>Description:</b> " + linkDesc[1]; }
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

//function to return hostname + tld
function gimmeHostName(link) {
    if (link.contains(/([\w-]+\.(?:com?\.\w{2}|in\.ua|uk\.com|\w{2,4}))(?::\d+)?$/)) return link.match(/([\w-]+\.(?:com?\.\w{2}|in\.ua|uk\.com|\w{2,4}))(?::\d+)?$/)[1];
    else {
        console.warn("gimmeHostName error.", link);
        return -1;
    }
}
//Second gimmehostname function to match whole hostname
function gimmeHostName2(link) {
	link = link.replace(/http:\/\/.*?\?http:\/\//, 'http://'); //anonymizers
    if (link.contains(/(?:https?:\/\/)?(?:www\.|[\w\.])*?[\w-]+\.(?:com?\.\w{2}|in\.ua|uk\.com|\w{2,4})(?::\d+)?\//)) return link.match(/(?:https?:\/\/)?(?:www\.|[\w\.])*?([\w-]+\.(?:com?\.\w{2}|in\.ua|uk\.com|\w{2,4}))(?::\d+)?\//)[1];
    else if (link.contains(".1fichier.com")) {
		return "1fichier.com";
	} else {
        console.warn("gimmeHostName error.", link);
        return -1;
    }
}

function uniqArray(array) {
	var uniqueArray = [];
	$.each(array, function(i, el){
	    if($.inArray(el, uniqueArray) === -1) uniqueArray.push(el);
	});
	return uniqueArray;
}

function sendMessage(text)
{
	var msgDiv = "<div class='WarInfoMsg'>" + text + "</div>";
	$(".WarInfoBox").append(msgDiv).show();
	setTimeout(function(){$(".WarInfoBox").hide()}, 5000);
}

function genset(pref, def) {
	var val = preferences.general[pref];
	if (val == undefined) val = def;
	return val;
}

function lsSave() {
	localStorage.setItem("War_Preferences", JSON.stringify(preferences));
}

function setVariables()
{	
	if (firstRun)
	{
		console.warn('First run, compiling preferences object...');
		preferences = {
			hosts: {},
			general: {}
		}
			
		lsSetVal("general", "Display_tooltip_info", false);
		lsSetVal("general", "Display_full_links_in_link_containers", true);
		lsSetVal("general", "Allow_spaces_in_DL_links", false);
		lsSetVal("general", "Do_not_linkify_DL_links", false);
		lsSetVal("general", "Extabit_API_Check", false);
		lsSetVal("general", "Filefactory_API_Check", false);
		lsSetVal("general", "Processbox_Pos_Y", 0);
		lsSetVal("general", "Processbox_Pos_X", 90);
		lsSetVal("general", "Progressbox_Scaling", 100);
		//lsSetVal("general", "Last_Update_Check", new Date().valueOf());
		lsSetVal("general", "Ref_anonymize_service", ANONYMIZERS[0]);
					
		localStorage.setItem("War_First_Run", false);	
		lsSave();
	}

	Display_tooltip_info = genset("Display_tooltip_info", false);
	Display_full_links_in_link_containers = genset("Display_full_links_in_link_containers", true);
	Allow_spaces_in_DL_links = genset("Allow_spaces_in_DL_links", false);
	Do_not_linkify_DL_links = genset("Do_not_linkify_DL_links", false);
	Processbox_Pos_Y = genset("Processbox_Pos_Y", 0);
	Processbox_Pos_X = genset("Processbox_Pos_X", 90);
	Progressbox_Scaling = genset("Progressbox_Scaling", 100);
	Last_Update_Check = genset("Last_Update_Check", 0);
	ANONYMIZE_SERVICE = genset("Ref_anonymize_service", ANONYMIZERS[0]);
	ANONYMIZE_SERVICE = (ANONYMIZE_SERVICE != 'NoRed' ? ANONYMIZE_SERVICE : '');
}

function hostSet(key, def) { //will get the value of the key in pref object, if key is undefined -> opposite value of default returned (to keep the compatibility with old GM_getValue and the inversed default values in War 2.0)
	var val = preferences.hosts[key];
	if (val == undefined) val = !def;
	return val;
}

function lsSetVal(section, key, value) { //replacement of GM_setValue, valid for both sections of preferences object
	preferences[section][key] = value;
	lsSave();
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
			case "obsolete_link": spanElm.addEventListener("mouseover", displayTooltipError, false); break;
			case "unava_link": //reserved
			default: 
			}
		}
			
		thisLink.parentNode.replaceChild(spanElm, thisLink);
	}
}
	
	
	function checkLinks(filterId)
	{
		start(filterId);
	}

	/**
	 * Initialises progress box including event binding and CSS 
	 */
	function initProgressBox()
	{
		if ($("#warlc-progressbox").length > 0)
			return;
		
		//progressbox css
		var progressboxCss = "#warlc-progressbox  {position:fixed; background:lightgrey; bottom:" + Processbox_Pos_Y + "%; left:" + Processbox_Pos_X + "%; padding:5px; font-size:10px; font-weight:bold; font-family:Helvetica; width:130px; cursor:default; border:1px solid #4DD9FF; z-index:200;}\
					\
					#warlc-hostdetails  {position:fixed; background:lightgrey; bottom:" + (parseInt(Processbox_Pos_Y) + 9) + "%; left:" + Processbox_Pos_X + "%; padding:5px; font-size:10px; font-weight:bold; cursor:default; border:1px solid #4DD9FF; display:none; z-index:201;}\
					\
					.warlc-progressbox-contents {right: 5px;}\
					\
					.warlc-progressbar {text-align:left; background: blue; height:3px; margin-bottom:5px; width:0px; border-radius:1.5px; }\
					\
					.warlc-progressitem { display: block; padding:2.5px 0px 2.5px 20px }\
					\
					.alive {color: green; background:transparent url(" + alive_link_png + ") no-repeat scroll 0% 50%;background-size:15px;}\
					\
					.adead {color: red; background:transparent url(" + adead_link_png + ") no-repeat scroll 0% 50%;background-size:15px;}\
					\
					.unava {color: #FFFF00; background:transparent url(ToBeAddedLater) no-repeat scroll 0% 50%;background-size:15px;}\
					\
					.processing {color: black; background:transparent url(" + processing_link_gif + ") no-repeat scroll 0% 50%;}"
		
		if (Progressbox_Scaling != 100) {
			$.each(progressboxCss.match(/[\d\.]+px/g), function(i, el) { //dynamic rescaling of the progressbox according to user settings
				progressboxCss = progressboxCss.replace(new RegExp(el + "(?!" + RAND_STRING + ")"), parseFloat(el) * Progressbox_Scaling/100 + "px" + RAND_STRING); //RAND_STRING to prevent the same value replaced twice
			});
		}
		
		progressboxCss = progressboxCss.replace(new RegExp(RAND_STRING, "g"), "").replace("ToBeAddedLater", unava_link_png); //inserting the unava_link_png at the end because the function messes up its base64 string
		
		GM_addStyle(progressboxCss);
				
		$('body').append('	<div id="warlc-progressbox">\
								<div class="warlc-progressbox-contents">\
									<div class="warlc-progressbar" aria-valuenow=0></div>\
									<div class="warlc-progressitems">\
										<span class="warlc-progressitem alive"></span>\
										<span class="warlc-progressitem adead"></span>\
										<span class="warlc-progressitem unava"></span>\
										<span class="warlc-progressitem processing"></span>\
									</div>\
								</div>\
							</div>\
							<div id="warlc-hostdetails"></div>');	
		
		$('#warlc-progressbox').hide().click(function(){
												clearInterval(intervalId); 
												$(this).hide(); 
												return false;
											});
											
		$(".warlc-progressitem").hover(function() {
			showHostDetails(this);
		}, function() {
			showHostDetails("none");
		});
		
	}
	
	function showHostDetails(item) {
		var $div = $("#warlc-hostdetails");
		if (item == "none") {
			$div.hide().removeClass();
			if ($("#warlc-progressbox").css("display") != "none") intervalId = setInterval(function() { updateProgress(); }, 1000);	
		}
		else {
			var statusArr; 
			var divTxt = "These Links are ";
			switch(item.className) {
			case "warlc-progressitem alive": divTxt += "Alive: "; statusArr = filehostsAlive; break;
			case "warlc-progressitem adead": divTxt += "Dead: "; statusArr = filehostsDead; break;
			case "warlc-progressitem unava": divTxt += "Unavailable: "; statusArr = filehostsUnava; break;
			case "warlc-progressitem processing": divTxt += "Still processing: "; statusArr = getProcHosts(); break;
			}
			$div.addClass(item.className);
			$("#warlc-progressbox").append($div);
			if (statusArr == "") divTxt = divTxt.replace("The following", "No").replace(":", ".");
			$div.text(divTxt + statusArr.slice(0,statusArr.length-1).replace(/,/g, ", "));
			clearInterval(intervalId);
			$div.show();
		}
		
	}
	
	function getProcHosts() {
		var filehostsProc = "";
		var $links = $(".processing_link");
		if ($links.length > 0) {
			var i = $links.length;
			var hostname;
			while (i--)
			{
				hostname = gimmeHostName2($links[i].href);
				if (!filehostsProc.contains(hostname)) {
					filehostsProc += hostname + ",";
				}
			}
		}
		return filehostsProc;
	}
	
	function dismissProgressbar() {
		$(".warlc-progressbar").fadeOut();
		$(".warlc-progressitem.processing").fadeOut();
		clearInterval(intervalId); //stops refreshing the stats 
	}
	

	 // Updates progress data in progress box
	 
	var percAlive, percDead, percUnava, percProc;
	function updateProgress()
	{
		if (cLinksTotal) // some links were detected on page
		{
			var percProgress = Math.round(((100 / cLinksTotal) * cLinksProcessed));
			var $progressItems = $('.warlc-progressitems > .warlc-progressitem');
			
			$(".warlc-progressbar").css("width", percProgress + "%");
			$(".warlc-progressbar").attr("aria-valuenow", percProgress);
			
			percAlive = Math.round((cLinksAlive /  cLinksTotal) * 100);
			percDead = 	Math.round((cLinksDead / cLinksTotal) * 100);
			percUnava = Math.round((cLinksUnava / cLinksTotal) * 100);
			percUnknown = Math.round((cLinksUnknown / cLinksTotal) * 100);
			percProc = Math.round(((cLinksTotal - cLinksProcessed) / cLinksTotal) * 100);
			
			$progressItems.first().text(cLinksAlive + " - " + "Alive")
							.next().text(cLinksDead + " - " + "Dead")
							.next().text(cLinksUnava + " - " + "Unavailable")
							.next().text(cLinksUnknown + " - " + "Processing") 
							.next().text(cLinksTotal - cLinksProcessed + " - " + percProc + "% Processing");
			if (percProgress > 0) $("#warlc-progressbox").show();
			if (percProgress == 100) dismissProgressbar(); 
		}	
	}
	
	

	function check_all_links()
	{
		add_WARLC_style();

		initProgressBox();			
		intervalId = setInterval(function(){updateProgress();}, 1000);

		start(null);
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
			}
		}
	}

	//
	//
	//   SCRIPT EXECUTION START POINT
	//
	//
	
	//init the stuff
	setVariables();
	if (RAND_INT == RAND_INT2) sendMessage(Array(16).join("wat" - 1) + " war");

	//register GM menu commands & keyboard shortcut event handler
	$(document).keydown(KeyDownHandler);
	GM_registerMenuCommand("[War - Links Checker] Configuration  (CTRL + ALT + C)", configuration);
	GM_registerMenuCommand("[War - Links Checker] Check All Links (CTRL + ALT + A)", check_all_links);

	//start linkchecking
	$(document).ready(check_all_links);
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
		
		var settingsIcon = "data:image/png;base64,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";
	
		var configcss = '\
		.popup_block .popup fieldset{\
		   padding: 1%;\
		   border-style: none;\
		   border-width: 0;\
		   border-color: white;\
		   margin-bottom: 1px;\
		}\
		.popup_block .popup hr {\
			height: 1px;\
			border-color:black;\
		}\
		#WarTitle{\
		 font-size: 2em;\
		 width:100%;\
		}\
		#hideshow {\
		 position: fixed;\
		 width: 100%;\
		 height: 100%;\
		 top: 0;\
		 left: 0;\
		 font-size:12px;\
		 z-index:2147483647;\
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
		 border: 2px solid #4DD9FF;\
		 float: left;\
		 width: 700px;\
		 position: absolute;\
		 top: 7%;\
		 left: 50%;\
		 bottom: 7%;\
		 margin: 0 0 0 -350px;\
		 -moz-border-radius:10px;\
		 z-index: 100;\
		}\
		.popup_block .popup {\
		 display: block;\
		 float: left;\
		 width: 100%;\
		 height: 95%;\
		 background: #fff;\
		 margin: 10px 0px;\
		 border: 1px solid #4DD9FF;\
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
		#note {\
			font-size:7pt;\
			color:gray;\
			padding: 1px 10px;\
			margin: 0px 0;display:inline-block;\
			min-width:100px;\
		}\
		#configinfo {\
			font-size:8pt;\
			color:gray;\
			padding: 1px 10px;\
			margin: 0px 0;display:inline-block;width:60em;\
		}\
		#WarTabs > input[type="button"], .WarButtons > input[type="button"] {\
			display: inline-block;\
			font-size: 12px;\
			font-weight: normal;\
			background-color: rgb(238, 238, 238);\
			background-position: 0px -178px;\
			background-repeat: repeat-x;\
			text-shadow: 0px 1px rgb(255, 255, 255);\
			padding: 4px 8px;\
			position: relative;\
			overflow: hidden;\
			color: rgb(51, 51, 51);\
			margin: 0 0;\
			border: 1px solid rgb(170, 170, 170);\
			border-radius: 0 0 0 0;\
			box-shadow: 0px 12px rgb(255, 255, 255) inset;\
			float: left;\
		}\
		#WarTabs > input[type="button"] {\
			border-bottom: none;\
		}\
		#WarSeparator {\
			border-bottom: 1px solid rgb(170, 170, 170);\
			margin-top: 24px;\
		}\
		#selectAllButton {\
			border-radius: 3px 0 0 3px;\
			border-right: none;\
		}\
		#invertButton {\
			border-radius: 0 3px 3px 0;\
			border-left: none;\
		}\
		#WarTabs > input[name="WarHosts"] {\
			border-radius: 3px 0 0 0;\
			border-right:none;\
			margin-left:10px;\
		}\
		#WarTabs > input[name="WarAbout"] {\
			border-radius: 0 3px 0 0;\
			border-left:none;\
		}\
		.WarButtons > input[type="button"]:hover {\
			padding: 5px 8px 3px;\
			box-shadow: 0 0 white;\
			background: none;\
		}\
		#WarTabs > input.activeTab {\
			padding: 5px 8px 3px;\
			box-shadow: 0 0 white;\
			background: none;\
		}\
		.WarTab {\
			display: none;\
		}\
		.WarButtons, #WarTabs, #warlcsitelist1 {\
			margin-left: 5px;\
		}\
		#warlcsitelist1 {\
			border-top: 1px solid grey;\
			padding-top: 5px;\
			overflow:auto;\
			margin-top:2px;\
		}\
		.WarTabContainer {\
			overflow:auto;\
		}\
		input:hover+label {\
			background:#F1F77C;\
			font-size:110%;\
		}\
		.popup_block .popup legend {\
			display:block;\
			width:100%;\
			padding:0;\
			margin-bottom:2px;\
			font-size:15px;\
			line-height:inherit;\
			color:#333;\
			border:0;\
			border-bottom:1px solid #e5e5e5\
		}\
		';

		GM_addStyle(configcss);
		
		var configurationinnerHTML = 
		'<div id="fade"></div>\
		<div class="popup_block">\
			<div class="popup">\
				<div id="WarTitle" style="height: 1.2em"><img src=' + settingsIcon + ' style="height:35px;margin-left:2px;vertical-align:middle;"></img> W.A.R. Links Checker Customized</div><br>\
				<div id="WarTabs">\
					<input type="button" name="WarHosts" class="activeTab" value="File Hosts">\
					<input type="button" name="WarSettings" value="Settings">\
					<input type="button" name="WarAbout" value="About War">\
				</div>\
				<div id="WarSeparator"></div>\
				<div id="WarHosts" class="WarTab">\
					<br><div class="WarButtons">\
						<input type="button" id="selectAllButton" value="Select All Hosts">\
						<input type="button" id="selectNoneButton" value="Select None">\
						<input type="button" id="invertButton" value="Invert">\
					</div><br><br>\
					<input style="margin-left:5px;" type="textbox" placeholder="Search For file host" id="hostSearchBox" value="">\
					<div id="warlcsitelist1"><span>Empty</span></div>\
				</div>\
				<div id="WarSettings" class="WarTab">\
					<br>\
					<div id="WarPreferences" class="WarTabContainer">\
						<fieldset>\
							<legend>General settings</legend>\
							<p>keyboard shortcuts\
                            <p>ctrl+alt+a = Check all links\
                            <p>ctrl+alt+c = Open Configuration Window\
                            <p><input type="checkbox" id="Do_not_linkify_DL_links"> Do NOT linkify DL links</p>\
							<p><input type="checkbox" id="Allow_spaces_in_DL_links"> Allow spaces in DL links<br><div id="configinfo">Note: All links must end with a new line!</div></p>\
							<p><input type="checkbox" id="Display_full_links_in_link_containers"> Display full links in link containers</p>\
							<p><input type="checkbox" id="Display_tooltip_info"> Display tooltip info<br><div id="configinfo">Note: File name, file size, error messages etc.</p>\
					</fieldset>\
					<fieldset>\
							<legend>Progress box settings</legend>\
							<p>Horizontal positioning of the progressbox: <input type="text" id="Processbox_Pos_X"><br><div id="configinfo">Note: Define this value in percentages starting from the left of the screen.</div></p>\
							<p>Vertical positioning of the progressbox: <input type="text" id="Processbox_Pos_Y"><br><div id="configinfo">Note: Define this value in percentages starting from the bottom of the screen.</div></p>\
							<p>Scaling of the progressbox: <input type="text" id="Progressbox_Scaling"><br><div id="configinfo">Resizes the progressbox. Define this value in percentages. 100% = full size, 200% = double size, 0% = Off</div></p>\
						</fieldset>\
						<fieldset>\
							<legend>Other options</legend>\
							<p>Anonymizer: Select from dropdown box\
							<select style="margin-left:5px;" id="redirector">\
								<option>Lorem ipsum dolorem</option>\
							</select></p>\
							</div>\
						</fieldset>\
					</div>\
				<div id="WarAbout" class="WarTab">\
					<br>\
					<div class="WarTabContainer">\
					<fieldset>\
					<legend>W.A.R. Links Checker Customized v' + War_version + '</legend>\
					<p>Author: <a href="http://www.mentalps.5gbfree.com/viewtopic.php?f=2&t=3">mental</a></p>\
					<p>Based on <a href="http://userscripts-mirror.org/scripts/show/125631.html">W.A.R. Links Checker - Dev</a></p>\
					<p>Original by <a href="http://userscripts-mirror.org/users/302353">dkitty</a></p>\
					</fieldset>\
					<br />\
					<fieldset>\
					<legend>Currently supported Hosts</legend>\
					<p>File Hosts: ' + allHostNames.length + '<br />\
					Container Hosts: ' + allContainerNames.length + '<br />\
					Obsolete Hosts: ' + allObsoleteNames.length + '<br /></p>\
					</fieldset>\
					<br />\
					<fieldset>\
					<legend>Uses</legend>\
					<p>adam_3\'s <a href="http://userscripts-mirror.org/scripts/show/2254">Linkify ting</a> (modified)</p>\
					<p><a href="http://jquery.com/">jQuery</a> JavaScript Library</p>\
					</fieldset>\
					<br />\
					<fieldset>\
					<legend>License</legend>\
					<p>GPL version 3 or any later version (<a href="http://www.gnu.org/copyleft/gpl.html">http://www.gnu.org/copyleft/gpl.html</a>)</p>\
					</fieldset>\
					</div>\
				</div>\
			</div>\
		</div>';
		
		$('body').append('<div id="hideshow">' + configurationinnerHTML + '</div>');
		$("#WarHosts").show();
		
		//sets height of warlcsitelist1
		var totalHeight = $(".popup").height();
		$("#warlcsitelist1").height(totalHeight - 155); $(".WarTabContainer").height(totalHeight - 90);
		$("#WarSeparator").css("margin-top", 9 + $(".activeTab").height() + "px"); //because the buttons have a different height on the different themes
		
		$("#WarTabs > input[type='button']").click(function() {
			var $target = $(this);
			var current = "#" + $(".activeTab").removeClass().attr("name"); $(current).hide();
			var targetTab = "#" + $target.addClass("activeTab").attr("name"); $(targetTab).show();
		});
		
		$("#fade").click(function(event) {
			$("#hideshow").hide(); event.preventDefault();
		});
				
		var elmHostList = document.getElementById("warlcsitelist1");
		
		buildSettings();
		buildSitelist("", allHostNames, elmHostList);
		appendObsolete("", allObsoleteNames, elmHostList);
			
		//handler for checkbox state change
		function changeConfiguration(e)
		{
			var element = e.target;

			if (element.type == 'checkbox')
			{
				if (element.checked == 1)
				{
					lsSetVal("hosts", element.id, true);
				}
				else
				{
					lsSetVal("hosts", element.id, false);
				}

			}
		}

		//Selects all filehosting checkboxes
		function selectAll()
		{
			$(":checkbox:visible:not(:checked)").prop("checked",true)
						 .each(function(index, element){lsSetVal("hosts", this.id, true)});
		}

		//Deselects all filehosting checkboxes
		function selectNone()
		{
			$(":checkbox:visible:checked").prop("checked",false)
						 .each(function(index, element){lsSetVal("hosts", this.id, false)});
		}

		//Inverts filehosting checkboxes selection
		function selectInvert()
		{
			var $checked = $(":checkbox:visible:checked");
			var $unchecked = $(":checkbox:visible:not(:checked)");
			
			$unchecked.prop("checked",true)
						 .each(function(index, element){lsSetVal("hosts", this.id, true)});
			$checked.prop("checked",false)
						 .each(function(index, element){lsSetVal("hosts", this.id, false)});
		}
		
		//Sets anonymizer setting
		function changeAnonymizer()
		{
			var val = $("#redirector").val();
			lsSetVal("general", "Ref_anonymize_service", (val == ANONYMIZERS.length ? '' : ANONYMIZERS[val]));
			$('#redirector option[value=' + val + ']').prop('selected', true);
		}
		
		//Sets selected redirector option
		var anonlist = "";
		$(ANONYMIZERS).each(function(index, value) {
			anonlist += '<option value=' + index  + (value == ANONYMIZE_SERVICE ? ' selected' : '') + '>' + gimmeHostName2(value) + '</option>';
		});
		anonlist += '<option value="' + ANONYMIZERS.length + '">No referer</option>';
		$('#redirector').html(anonlist);
		
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
			lsSetVal("general", setting, newSet);
		}
		
		//Sets value of Processbox position
		$("#Processbox_Pos_X").val(Processbox_Pos_X + "%");
		$("#Processbox_Pos_Y").val(Processbox_Pos_Y + "%");
		$("#Progressbox_Scaling").val(Progressbox_Scaling + "%");

		function buildSettings()
		{
			$("#WarPreferences :checkbox").each(function(){
				$(this).prop("checked", genset($(this).attr("id")))
					.click(function(e){
						lsSetVal("general", $(this).attr("id"), $(this).prop("checked"));
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
			
			$(targetNode).empty().append("<fieldset id='WarHosts1'><legend>List of File Hosts</legend></fieldset>");
			var $targetNode = $("#WarHosts1");
			
			var searchedSite = "";
			$.each(siteNames, function(i, site){
				if (searchedSite = site.match(searchRegex))
				{
					var baseSite = site.replace(/\|.+/, ""); //filehosting main domain
					
					//ensuring backward compatibility with the rest of code.
					var oldRSLCvalue = "Check_" + baseSite.replace(/\|.+/, "").replace(/\./g,"_dot_").replace(/-/g, "_dash_") + "_links";
					//
										
					$targetNode.append('<input type="checkbox" id="' + oldRSLCvalue +'" />\
						<label for="' + oldRSLCvalue + '">' + searchedSite[1] + '</label>' +
						((searchedSite[1] != baseSite) ? ('<div id="note"> ( ~ ' + baseSite + ' )</div>') : (""))
						);
					
					$("#" + oldRSLCvalue).prop("checked", hostSet(oldRSLCvalue, false))
										.change(changeConfiguration);
										
					$targetNode.append('<br />');
				}
			});
			
			$(targetNode).append("<fieldset id='WarHosts2'><legend>Containers</legend></fieldset>");
			$targetNode = $("#WarHosts2");
			
			searchedSite = "";
			$.each(allContainerNames, function(i, site) {
				if (searchedSite = site.match(searchRegex)) {
				var oldRSLCvalue = "Check_" + searchedSite[1].replace(/\|.+/, "").replace(/\./g,"_dot_").replace(/-/g, "_dash_") + "_links";
				$targetNode.append('<input type="checkbox" id="' + oldRSLCvalue +'" />\
					<label for="' + oldRSLCvalue + '">' + searchedSite[1] + '</label>');
				$("#" + oldRSLCvalue).prop("checked", hostSet(oldRSLCvalue, false))
									.change(changeConfiguration);
				$targetNode.append('<br />');	
				}
			});
		}
		
		//obsolete hosts checkbox
		function appendObsolete(search, siteNames, targetNode) {
			var searchRegex = new RegExp("\\|?([\\w\\.-]*" + search.replace(/\./g,"\\.").replace(/-/g, "\\-") + "[\\w\\.-]*)\\|?", "i");
			$(targetNode).append('<fieldset id="WarHosts3"><legend>Obsolete hosts</legend><input type="checkbox" id="Obsolete_file_hosts" /><label for="Obsolete_file_hosts">Check obsolete file hosts</label><br /></fieldset>');		
			$("#Obsolete_file_hosts").prop("checked", hostSet("Obsolete_file_hosts", false))
									.change(changeConfiguration);
			
			var $targetNode = $("#WarHosts3");
			
			var foundName = "";
			$.each(siteNames, function(i, site){
				if (foundName = siteNames[i].match(searchRegex))
				{
					$targetNode.append('<div id="note">' + foundName[1] + '</div>');
				}
			})
		}
		
		//event listener binding
		$("#hostSearchBox").keyup(function() {
			buildSitelist($("#hostSearchBox").val(), allHostNames, elmHostList);
			appendObsolete($("#hostSearchBox").val(), allObsoleteNames, elmHostList);
		});
		$("#selectAllButton").click(selectAll);
		$("#selectNoneButton").click(selectNone);
		$("#invertButton").click(selectInvert);
		$("#redirector").change(changeAnonymizer);
		$("#Processbox_Pos_X").change({ set: "X" }, changeProgBox);
		$("#Processbox_Pos_Y").change({ set: "Y" }, changeProgBox);
		$("#Progressbox_Scaling").change({ set: "Scale" }, changeProgBox);
		
		//buttons and edit boxes init end
	}

//Objects for linkchecking
var hostsIDs = {}; //hosts IDs and link regexes
var hostsCheck = {}; //host status IDs and links
var foundMirrors = { //mirrors found on the page, listed by type of check
	BC: [],
	HC: [],
	OH: [],
	RH: [],
	WC: []
}

//begin standard link checking algorithm
function start(filterId)
{
	var doNotLinkify = Do_not_linkify_DL_links;
	var redirectorTypes = {	"HTTP_302": 0, 
							"INNER_LINK": 1};

	// USER SELECTED FILE HOSTS INITIALIZATION START
	if (!filterId) {
		initFileHosts();
		initBulkHosts();
		initRedirectors();
		initFileHostsHeadersOnly();
	}
	// USER SELECTED FILE HOSTS INITIALIZATION END

	// LINKIFICATION START		
	linkify(filterId);
	//LINKIFICATION END

	//
	//HANDLING REDIRECTORS START
	//
	var redirFunctions = {
		//HTTP_302
		HTTP_302_TRIES: 0,
		processRedirectorLink: function(links, redirectorId) {
			$.each(links, function(key, value) {
				$('[href="' + value + '"]').removeClass().addClass('container_link');
			});

			GM_xmlhttpRequest({
				method: 'POST',
				url: 'http://war.pw/decrypt',
				data: 'links=' + links.join(RAND_STRING),
				headers: {
					'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
					'Content-type': 'application/x-www-form-urlencoded',
					'Referer': 'http://war.pw',
					'X-Requested-With': 'XMLHttpRequest'						
				},
				onload: function(result) {
					if (result.status != 200) return;

					var links = JSON.parse(result.responseText);
					var deadlinks = [], failedlinks = [];

					$.each(links, function(key, value) {
						if (value.success) {
							hostsCheck[redirectorId].cProcessed++;
							link = $('[href="' + key + '"]').first();
							link.attr('href', value.link);
							if (Display_full_links_in_link_containers) link.html(value.link);

						} else if (value.error == 'ERROR: Not Found (HTTP_STATUS: 404)') {
							hostsCheck[redirectorId].cProcessed++;
							deadlinks.push(key);

						} else if (value.error.contains('ERROR: ')) {
							hostsCheck[redirectorId].cProcessed++;
							failedlinks.push(key);
							console.warn('Error in decrypting link.\r\nLink: ' + key + '\r\nError thrown: ' + value.error + '\r\nAdditional information:', value);
						}
					});
					
					if (failedlinks.length > 0) DisplayTheCheckedLinks(failedlinks, 'unknown_link');
					if (deadlinks.length > 0) DisplayTheCheckedLinks(deadlinks, 'adead_link');
					
					checkLinks('container_link');
				},
				onerror: function(result) {
					if (redirFunctions.HTTP_302_TRIES < 5) { //retry for max 10 times
						redirFunctions.HTTP_302_TRIES++;
						redirFunctions.processRedirectorLink(links, redirectorId);
					} else {
						DisplayTheCheckedLinks(links, 'unknown_link');
					}
				}
			});
		},
		
		//INNER_LINK (Hotfile.com/links/)
		processRedirectorLinkEx: function(link, redirectorId) {
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
					link.href = result.responseText.match(hostsCheck[redirectorId].innerLinkRegex)[1];
					
					hostsCheck[redirectorId].cProcessed++;
					
					if (hostsCheck[redirectorId].cProcessed >= hostsCheck[redirectorId].cTotal)
						checkLinks('container_link');
				}				
			});
		}
	}
	
	foundMirrors.RH = uniqArray(foundMirrors.RH);
	redirLength = foundMirrors.RH.length;
	if (redirLength > 0) {		
		//process redirector links
		var hostID, links, y;
		for(var redirIdx = 0; redirIdx < redirLength; redirIdx++)
		{
			hostID = foundMirrors.RH[redirIdx];
			links = uniqArray(hostsCheck[hostID].links)
			hostsCheck[hostID].cTotal = links.length;

			cLinksTotal += links.length;
			y = links.length;

			if (hostsCheck[hostID].type == redirectorTypes.HTTP_302) {
				var y = links.length;
				while(y--) {
					links[y] = links[y].href;
				}
				redirFunctions.processRedirectorLink(links, hostID);
			} else {
				while(y--) {
					switch(hostsCheck[hostID].type) {
						case redirectorTypes.INNER_LINK:		redirFunctions.processRedirectorLinkEx(links[y], hostID); break;
						default:
					}
				}	
			}
			
			hostsCheck[hostID].links = [];
		}
	}
	foundMirrors.RH = [];
	//
	//HANDLING REDIRECTORS END
	//

	//STANDARD LINKCHECKING START
	foundMirrors.WC = uniqArray(foundMirrors.WC);
	var WCLength = foundMirrors.WC.length;
	if (WCLength > 0) {
		var hostID, links, isAliveRegex, isDeadRegex, isUnavaRegex, tryLoop, y;
		while(WCLength--) {
			hostID = foundMirrors.WC[WCLength];
			links = uniqArray(hostsCheck[hostID].links);
		
			if (filterId == null)
			{
				cLinksTotal += links.length;
			}

			isAliveRegex = hostsCheck[hostID].liveRegex;
			isDeadRegex = hostsCheck[hostID].deadRegex;
			isUnavaRegex = hostsCheck[hostID].unavaRegex;
			tryLoop = hostsCheck[hostID].tryLoop;

			y = links.length;

			while (y--)
			{
				geturl(links[y], isAliveRegex, isDeadRegex, isUnavaRegex, tryLoop);
			}
			hostsCheck[hostID].links = [];
		}	
	}
	foundMirrors.WC = [];
	//STANDARD LINKCHECKING END
	
	//OBSOLETE FILE HOSTS PROCESSING START
	foundMirrors.OH = uniqArray(foundMirrors.OH);
	var OHLength = foundMirrors.OH.length;
	if (OHLength > 0) {
		var hostID, links, y;
		while(OHLength--) {
			hostID = foundMirrors.OH[OHLength];
			links = uniqArray(hostsCheck[hostID].links);
		
			if (filterId == null)
			{
				cLinksTotal += links.length;
			}

			y = links.length;

			while (y--)
			{
				$(links[y]).attr('warlc_error', 'Cause of error: <b>Obsolete filehosting.</b>');
				displayTheCheckedLink(links[y], "obsolete_link");
			}
			hostsCheck[hostID].links = [];
		}	
	}
	foundMirrors.OH = [];
	//OBSOLETE FILE HOSTS PROCESSING END

	//DIRECT LINKCHECKING START
	foundMirrors.HC = uniqArray(foundMirrors.HC);
	var HCLength = foundMirrors.HC.length;
	if (HCLength > 0) {
		var hostID, links, isAliveRegex, isDeadRegex, y;
		while(HCLength--) {
			hostID = foundMirrors.HC[HCLength];
			links = uniqArray(hostsCheck[hostID].links);
		
			if (filterId == null)
			{
				cLinksTotal += links.length;
			}

			isAliveRegex = hostsCheck[hostID].liveRegex;
			isDeadRegex = hostsCheck[hostID].deadRegex;

			y = links.length;

			while (y--)
			{
				geturlHeader(links[y], isAliveRegex, isDeadRegex);
			}
			hostsCheck[hostID].links = [];
		}	
	}
	foundMirrors.HC = [];
	//DIRECT LINKCHECKING END

	//Bulkcheck hosts controller
	foundMirrors.BC = uniqArray(foundMirrors.BC);
	var BCLength = foundMirrors.BC.length;
	if (BCLength > 0) {
		var hostID, links, y, corrLink, m, n;
		while(BCLength--) {
			hostID = foundMirrors.BC[BCLength];
			links = uniqArray(hostsCheck[hostID].links);
			if (filterId == null)
			{
				cLinksTotal += links.length;
			}
			
			//Replace anchors by href's, and processes link corrections
			y = links.length;
			while(y--) {
				corrLink = links[y].href;
				if (hostsCheck[hostID].corrMatch && hostsCheck[hostID].corrMatch.test(corrLink)) corrLink = corrLink.match(hostsCheck[hostID].corrMatch)[1]; //link match corrections
				if (hostsCheck[hostID].corrReplWhat && hostsCheck[hostID].corrReplWith) corrLink = corrLink.replace(hostsCheck[hostID].corrReplWhat, hostsCheck[hostID].corrReplWith); //link replace corrections
				links[y] = corrLink;
			}
			
			//Filter out dupe links
			links = uniqArray(links);
			
			m = links.length;
			n = hostsCheck[hostID].blockSize;
			if (m > n) {
				//insert block separators (RAND_STRING) into the array
				for(var i = n; i < (Math.floor(m/n)+1)*n; i += n + 1)
				{
					links.splice(i, 0, RAND_STRING);
				}
			}
			
			var sep = hostsCheck[hostID].splitSeparator; 
			
			hostsCheck[hostID].func.call({ 	links:			links.join(sep).replace(new RegExp(sep.replace(/\\/g, "\\") + RAND_STRING + sep.replace(/\\/g, "\\"), "g"), RAND_STRING).replace(new RegExp(RAND_STRING + "$"), "").split(RAND_STRING),
											apiUrl: 		hostsCheck[hostID].apiUrl, 
											postData: 		hostsCheck[hostID].postData, 
											resLinkRegex:	hostsCheck[hostID].resLinkRegex, 
											resLiveRegex:	hostsCheck[hostID].resLiveRegex, 
											resDeadRegex:	hostsCheck[hostID].resDeadRegex, 
											resUnavaRegex: 	hostsCheck[hostID].resUnavaRegex,
											separator: 		sep
										});
										
			hostsCheck[hostID].links.length = 0;
		}
	}
	foundMirrors.BC = [];
	
	//Processes link
	//
	// [string]		link			link URL
	// [string] 	isAliveRegex	alive link regex
	// [string] 	isDeadRegex		dead link regex
	// [string] 	isUnavaRegex	unavailable link regex
	// [boolean]	tryLoop			repeats request until succeeded	
	function geturl(link, isAliveRegex, isDeadRegex, isUnavaRegex, tryLoop)
	{
		if ((link.href.contains("yourfilelink.com/")) && (!link.href.contains("&dv=1"))) link.href += "&dv=1"; //to bypass yourfilelink wait times
		link.href = link.href.replace("shareplace.com/?", "shareplace.com/index1.php?a="); //to bypass shareplace iframe on shareplace.com/?{id} links
		
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

				//console.log(res);

				if (res.contains(isAliveRegex))
				{
					displayTheCheckedLink(link, 'alive_link');
					return;
				}

				if (res.contains(isDeadRegex))
				{
					displayTheCheckedLink(link, 'adead_link');
					return;
				}

				if (res.contains(isUnavaRegex))
				{
					displayTheCheckedLink(link, 'unava_link');
					return;
				}

				var resStatus = result.status;

				if (resStatus == 404)
				{
					displayTheCheckedLink(link, 'adead_link');
					return;
				}
				
				if (resStatus == 500 || resStatus == 503 || resStatus == 403) //not found/available/temp. unava
				{
					if (tryLoop)
					{
						//wait 1-5 seconds and repeat the request
						setTimeout(function(){geturl(link, isAliveRegex, isDeadRegex, isUnavaRegex, tryLoop)}, 1000 + (Math.random() * 4000));
					}
					else
					{
						displayTheCheckedLink(link, 'unava_link');
					}

					return;
				}
				
				displayTheCheckedLink(link, 'unknown_link');
				res = "";
			},
			onerror: function ()
			{
				displayTheCheckedLink(link, 'unknown_link');
			}
		});
	}

	function geturlHeader(link, isAliveRegex, isDeadRegex)
	{	
		if (link.href.contains("disk.karelia.pro/") && !link.href.contains(/karelia\.pro\/fast\/\w+\/.+?/)) {
			geturl(link, 'diskFile\"', '<div id="center">\n+<\/div>', 'optional--', false);
			return;
		}
		
		if (link.href.contains("demo.ovh.") && link.href.contains("/download/")) {
			specificOvhCheck(link);
			return;
		}
		
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
				
				if (resStatus == 509) //public traffic exhausted
				{
					displayTheCheckedLink(link, 'unava_link');
					return;
				}

				resHeaders = result.responseHeaders;
				//console.log(resHeaders);

				if (resHeaders.contains(isDeadRegex) && !link.href.contains('archive.org/'))
				{
					displayTheCheckedLink(link, 'adead_link');
					return;
				} else if (link.href.contains('archive.org/') && resHeaders.contains(isDeadRegex)) {
					specArchCheck(link);
					return;
				}

				if (resHeaders.contains(isAliveRegex))
				{
					displayTheCheckedLink(link, 'alive_link');
					return;
				}
				
				displayTheCheckedLink(link, 'unknown_link');
			},
			onerror: function ()
			{
				displayTheCheckedLink(link, 'unknown_link');
			}
		});
	}
	
	function specArchCheck(link) {
		var alive = /<title>Index of/;
		var dead = /<h1>Item not available<\/h1>/;
		var unava = /optional--/;
		geturl(link, alive, dead, unava);
	}
	
	//Specific handler for demo.ovh.eu/download/ direct link
	function specificOvhCheck(link) {
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
				var resHeaders = "";
				resHeaders = result.responseHeaders;
				if (resHeaders.contains('Content-Type: application/octet-stream'))
				{
					displayTheCheckedLink(link, 'alive_link');
					return;
				}
				
				if (resHeaders.contains('Content-Type: text/html'))
				{
					var liveRegex = 'download.gif"';
					var deadRegex = 'p_point">';
					var unavRegex = 'optional--';
					geturl(link, liveRegex, deadRegex, unavRegex);
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
			$(spanElm).attr('warlc_error', $(link).attr('warlc_error'));
			
			switch (link.className){
			case "alive_link": spanElm.addEventListener("mouseover", displayTooltipInfo, false); break
			case "adead_link": spanElm.addEventListener("mouseover", displayTooltipError, false); break;
			case "unava_link": //reserved
			default: 
			}
		}
		
		link.parentNode.replaceChild(spanElm, link);
	}

	//Assigns result status to the <a> element object and calls delinkifying eventually
	//Possible result states: adead_link, alive_link, unava_link
	function displayTheCheckedLink(link, resultStatus)
	{
		//console.log(link);
		link.className = resultStatus;
		var hostname = gimmeHostName2(link.href);
		link.href = ANONYMIZE_SERVICE + link.href;
		
		if (Display_tooltip_info)
		{
			switch (resultStatus){
			case "alive_link": link.addEventListener("mouseover", displayTooltipInfo, false); break; 
			case "adead_link": link.addEventListener("mouseover", displayTooltipError, false); break;
			case "obsolete_link": link.addEventListener("mouseover", displayTooltipError, false); break;
			case "unava_link": //reserved
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
			if (!filehostsAlive.contains(hostname)) filehostsAlive += hostname + ",";
			return;
		}

		if (resultStatus == "adead_link")
		{
			cLinksDead++;
			if (!filehostsDead.contains(hostname)) filehostsDead += hostname + ",";
			return;
		}
		
		if (resultStatus == "obsolete_link")
		{
			cLinksDead++;
			if (!filehostsDead.contains(hostname)) filehostsDead += hostname + ",";
			return;
		}

		if (resultStatus == "unava_link")
		{
			if (!filehostsUnava.contains(hostname)) filehostsUnava += hostname + ",";
			cLinksUnava++;
		}
		
		if (resultStatus == "unknown_link")
		{
			if (!filehostsUnknown.contains(hostname)) filehostsUnknown += hostname + ",";
			cLinksUnknown++;
		}
	}
	
	function DisplayTheCheckedLinks(links, resultStatus, tooltipInfo)
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
		if (tooltipInfo && resultStatus == 'unknown_link' && Display_tooltip_info) {
			$links.mouseover(displayTooltipError);
			$links.attr('warlc_error', 'Cause of error: <b>' + tooltipInfo + '</b>');
		}
		var hostname = gimmeHostName2($links[0].href);
		$links.each(function() {
		if (!this.href.contains('mega.co.nz')&&!this.href.contains('mega.nz')) this.href = ANONYMIZE_SERVICE + $(this).attr("href");
		});
			
		switch(resultStatus)
		{
			case "alive_link":		cLinksAlive += $links.length; 
									if (Display_tooltip_info) $links.mouseover(displayTooltipInfo);
									if (!filehostsAlive.contains(hostname)) filehostsAlive += hostname + ",";
									break;
			case "adead_link": 		cLinksDead += $links.length; 
									if (Display_tooltip_info) $links.mouseover(displayTooltipError);
									if (!filehostsDead.contains(hostname)) filehostsDead += hostname + ",";
									break;
			case "obsolete_link":	cLinksDead += $links.length;
									if (Display_tooltip_info) $links.mouseover(displayTooltipError);
									if (!filehostsDead.contains(hostname)) filehostsDead += hostname + ",";
									break;
			case "unava_link": 		cLinksUnava += $links.length;
									if (!filehostsUnava.contains(hostname)) filehostsUnava += hostname + ",";
									break; 
			default: 
		}		
			
		cLinksProcessed += $links.length;
	}
	
	function initRedirectors()
	{
		var aRCount = 1;
		function addRedirector(hostName, linkRegex, redirType, innerLinkRegex)
		{
			hostName = hostName.split("|");
			var i = hostName.length;
			
			var hostID = "RH" + aRCount;
			
			while(i--) {
				var filehost = hostName[i].replace(/\./g, "_dot_").replace(/\-/g, "_dash_");
				if (!hostsIDs[filehost]) {
					hostsIDs[filehost] = [];
				}
				hostsIDs[filehost].push({
					hostID: hostID,
					linkRegex: linkRegex,
				});
			}
			var RHObj = {
				cProcessed: 0,
				cTotal: 0,
				type: redirType,
				innerLinkRegex: innerLinkRegex,
				links: []
			}
			
			hostsCheck[hostID] = RHObj;
			aRCount++;
		}

		if (hostSet("Check_safelinking_dot_net_links", false))
		{
			addRedirector(
			'safelinking.net',	
			'safelinking\\.net\/d\/\\w{10}',
			redirectorTypes.HTTP_302,
			null);
		}

	}
	
	function initBulkHosts()
	{
		var aHCount = 1;
		function addHost(hostName, linkRegex, blockSize, corrMatch, corrReplWhat, corrReplWith, splitSeparator, 
							apiUrl, postData, resLinkRegex, resLiveRegex, resDeadRegex, resUnavaRegex, func)
		{
			hostName = hostName.split("|");
			var i = hostName.length;
			
			var hostID = "BC" + aHCount;
			
			while(i--) {
				var filehost = hostName[i].replace(/\./g, "_dot_").replace(/\-/g, "_dash_");
				if (!hostsIDs[filehost]) {
					hostsIDs[filehost] = [];
				}
				hostsIDs[filehost].push({
					hostID: hostID,
					linkRegex: linkRegex,
				});
			}
			
			var BCObj = {
				blockSize: 50,
				corrMatch: corrMatch,
				corrReplWhat: corrReplWhat,
				corrReplWith: corrReplWith,
				splitSeparator: '\r\n',
				apiUrl: apiUrl,
				postData: postData,
				resLinkRegex: resLinkRegex,
				resLiveRegex: resLiveRegex,
				resDeadRegex: resDeadRegex,
				resUnavaRegex: resUnavaRegex,
				func: genBulkCheck,
				links: []
			}
			
			if (blockSize != null) { 
				BCObj.blockSize = blockSize;
			}
			if (splitSeparator != null) {
				BCObj.splitSeparator = splitSeparator;
			}
			if (func != null) {
				BCObj.func = func;
			}
			
			hostsCheck[hostID] = BCObj;
			aHCount++;
			
		}
		
		var genType1 = [	{	host: "rodfile.com",		apiurl: "default"									},
							{	host: "failai.lt",			apiurl: "default"									},
							{	host: "rarefile.net",		apiurl: "default"									},
							{	host: "ddlstorage.com",		apiurl: "default" 									},
							{	host: "filesabc.com",		apiurl: "http://filesabc.com/checkfiles.html"		},
							{	host: "sharebeast.com",		apiurl: "default" 									},
							{	host: "uploadbaz.com",		apiurl: "default"									},
							{	host: "180upload.com",		apiurl: "http://180upload.com/checkfiles.html"		},
							{	host: "180upload.nl",		apiurl: "http://180upload.com/checkfiles.html"		},
							{	host: "filesbb.com",		apiurl: "http://filesbb.com/checkfiles.html"		},
							{	host: "exfilehost.com",		apiurl: "http://exfilehost.com/checkfiles.html"		},
							{	host: "zomgupload.com",		apiurl: "default"									},
							{	host: "filemaze.ws",		apiurl: "default"									},
							{	host: "upafile.com",		apiurl: "http://upafile.com/checkfiles.html"		},
							{	host: "novafile.com",		apiurl: "http://novafile.com/checkfiles.html"		},
							{	host: "longfiles.com",		apiurl: "http://longfiles.com/checkfiles.html"		},
							{	host: "youwatch.org",		apiurl: "http://youwatch.org/checkfiles.html"		},
							{	host: "fileband.com",		apiurl: "http://fileband.com/checkfiles.html"		},
							{	host: "speedvid.tv",		apiurl: "http://speedvid.tv/checkfiles.html"		},
							{	host: "sharerepo.com",		apiurl: "http://sharerepo.com/checkfiles.html"		},
							{	host: "freestorage.ro",		apiurl: "http://freestorage.ro/checkfiles.html"		},
							{	host: "imzupload.com",		apiurl: "default"									},
							{	host: "allmyvideos.net",	apiurl: "http://allmyvideos.net/checkfiles.html"	},
							{	host: "movdivx.com",		apiurl: "default"									},
							{	host: "gorillavid.in",		apiurl: "http://gorillavid.in/checkfiles.html"		},
							{	host: "vidto.me",			apiurl: "http://vidto.me/checkfiles.html"			},
							{	host: "filesline.com",		apiurl: "default"									},
							{	host: "upitus.net",			apiurl: "default"									},
							{	host: "fastflv.com",		apiurl: "default"									},
							{	host: "swankshare.com",		apiurl: "default"									},
							{	host: "ryushare.com",		apiurl: "http://ryushare.com/checkfiles.python"		},
							{	host: "vidhog.com",			apiurl: "http://www.vidhog.com/checkfiles.html"		},
							{	host: "file4safe.com",		apiurl: "http://www.file4safe.com/?op=checkfiles"	},
							{	host: "uplds.com",			apiurl: "http://uplds.com/checkfiles.html"			},
							{	host: "roshare.info",		apiurl: "http://roshare.info/?op=checkfiles"		},
							{	host: "netkozmos.com",		apiurl: "http://www.netkozmos.com/checkfiles.html"	},
							{	host: "loadpot.net",		apiurl: "http://www.loadpot.net/checkfiles.html"	},
							{	host: "vodlocker.com",		apiurl: "http://vodlocker.com/checkfiles.html"		},
							{	host: "vidx.to",			apiurl: "http://vidx.to/?op=checkfiles"				},
							{	host: "foxishare.com",		apiurl: "http://foxishare.com/checkfiles.html"		},
							{	host: "uploadzeal.com",		apiurl: "http://www.uploadzeal.com/checkfiles.html"	},
							{	host: "played.to",			apiurl: "http://played.to/?op=checkfiles"			},
							{	host: "streamin.to",		apiurl: "http://streamin.to/checkfiles.html"		},
							{	host: "vidspot.net",		apiurl: "http://vidspot.net/?op=checkfiles"			},
							{	host: "bestreams.net",		apiurl: "http://bestreams.net/?op=checkfiles"		},
							{	host: "treesfile.com",		apiurl: "http://treesfile.com/checkfiles.html"		},
							{	host: "treefiles.com",		apiurl: "http://treesfile.com/checkfiles.html"		}, //same host as treesfile.com
							{	host: "treefile.org",		apiurl: "http://treesfile.com/checkfiles.html"		}, //same host as treesfile.com
                                                        
						];
		
						
		var genType2 = [	{	host: "donevideo.com",		apiurl: "http://www.donevideo.com/?op=checkfiles"	},
							{	host: "sanshare.com",		apiurl: "http://sanshare.com/?op=checkfiles"		},
							{	host: "mightyupload.com",	apiurl: "http://mightyupload.com/?op=checkfiles"	},
							{	host: "megafiles.se",		apiurl: "http://megafiles.se/?op=checkfiles"		},
							{	host: "rapidapk.com",		apiurl: "http://rapidapk.com/?op=checkfiles"		},
							{	host: "isavelink.com",		apiurl: "http://isavelink.com/?op=checkfiles"		},
							{	host: "4savefile.com",		apiurl: "http://4savefile.com/?op=checkfiles"		},
							{	host: "daj.to",				apiurl: "http://daj.to/?op=checkfiles"				},
							{	host: "vidup.me",			apiurl: "http://vidup.me/?op=checkfiles"			},
							{	host: "verzend.be",			apiurl: "http://verzend.be/?op=checkfiles"			},
							{	host: "arabloads.com",		apiurl: "http://www.arabloads.net/?op=checkfiles"	},
							{	host: "arabloads.net",		apiurl: "http://www.arabloads.net/?op=checkfiles"	},
							{	host: "amonshare.com",		apiurl: "http://amonshare.com/?op=checkfiles"		},
							{	host: "filewe.com",			apiurl: "http://nornar.com/?op=checkfiles"			},
							{	host: "nornar.com",			apiurl: "http://nornar.com/?op=checkfiles"			}, //same host as filewe.com
							{	host: "medoupload.com",		apiurl: "http://medoupload.com/?op=checkfiles"		},
							{	host: "file-speed.com",		apiurl: "http://file-speed.com/?op=checkfiles"		},
							{	host: "1st-files.com",		apiurl: "http://www.1st-files.com/?op=checkfiles"	},
							{	host: "katzfiles.com",		apiurl: "http://katzfiles.com/?op=checkfiles"		},
							{	host: "secureupload.eu",	apiurl: "http://www.secureupload.eu/checklinks.html"},
							{	host: "cometfiles.com",		apiurl: "http://www.cometfiles.com/checkfiles.html"	},
							{	host: "clicktoview.org",	apiurl: "http://clicktoview.org/?op=checkfiles"		},
							{	host: "sinhro.net",			apiurl: "http://sinhro.net/checkfiles.html"			},
							{	host: "ortofiles.com",		apiurl: "http://www.ortofiles.com/?op=checkfiles"	},
							{	host: "blitzfiles.com",		apiurl: "http://blitzfiles.com/?op=checkfiles"		},
							{	host: "hulkload.com",		apiurl: "http://www.hulkload.com/?op=checkfiles"	},
							{	host: "sharingmaster.com",	apiurl: "http://sharingmaster.com/?op=checkfiles"	},
							{	host: "albafile.com",		apiurl: "http://albafile.com/?op=checkfiles"		},
							{	host: "expressleech.com",	apiurl: "http://expressleech.com/?op=checkfiles"	},
							{	host: "upshared.com",		apiurl: "http://upshared.com/?op=checkfiles"		},
							{	host: "filetug.com",		apiurl: "http://www.filetug.com/checkfiles.html"	},
							{	host: "exclusivefaile.com",	apiurl: "http://exclusiveloader.com/?op=checkfiles"	},
							{	host: "exclusiveloader.com",apiurl: "http://exclusiveloader.com/?op=checkfiles"	}, //same host as exclusivefaile.com
							{	host: "videozed.net",		apiurl: "http://videozed.net/?op=checkfiles"		},
							{	host: "basicupload.com",	apiurl: "http://www.basicupload.com/?op=checkfiles"	},
							{	host: "sharesix.com",		apiurl: "http://sharesix.com/?op=checkfiles"		},
							{	host: "rapidfileshare.net",	apiurl: "http://www.rapidfileshare.net/?op=checkfiles"},
							{	host: "igetfile.com",		apiurl: "http://www.igetfile.com/?op=checkfiles"	},
							{	host: "project-free-upload.com", apiurl: "http://project-free-upload.com/?op=checkfiles"},
							{	host: "vidbull.com",		apiurl: "http://vidbull.com/checkfiles.html"		},
							{	host: "sendmyway.com",		apiurl: "http://www.sendmyway.com/?op=checkfiles"	},
							{	host: "creafile.net",		apiurl: "http://creafile.net/?op=checkfiles"		},
							{	host: "unlimitshare.com",	apiurl: "http://www.unlimitshare.com/?op=checkfiles"},
							{	host: "speedshare.eu",		apiurl: "http://speedshare.eu/?op=checkfiles"		},
							{	host: "uploadboy.com",		apiurl: "http://uploadboy.com/?op=checkfiles"		},
							{	host: "fiberstorage.net",	apiurl: "http://fiberstorage.net/?op=checkfiles"	},
							{	host: "uploadhunt.com",		apiurl: "http://www.uploadhunt.com/?op=checkfiles"	},
							{	host: "shareswift.com",		apiurl: "http://shareswift.com/?op=checkfiles"		},
							{	host: "epicshare.net",		apiurl: "http://epicshare.net/?op=checkfiles"		},
							{	host: "boomupload.net",		apiurl: "http://boomupload.net/?op=checkfiles"		},
							{	host: "fujifile.me",		apiurl: "http://www.fujifile.me/?op=checkfiles"		},
							{	host: "uncapped-downloads.com", apiurl: "http://uncapped-downloads.com/?op=checkfiles"},
							{	host: "pandamemo.com",		apiurl: "http://www.pandamemo.com/checkfiles.html"	},
							{	host: "spicyfile.com",		apiurl: "http://spicyfile.com/checkfiles.html"		},
							{	host: "hugefiles.net",		apiurl: "http://www.hugefiles.net/?op=checkfiles"	},
							{	host: "hyshare.com",		apiurl: "http://hyshare.com/?op=checkfiles"			},
							{	host: "filezy.net",			apiurl: "http://filezy.net/?op=checkfiles"			},
							{	host: "filesear.com",		apiurl: "http://filesear.com/?op=checkfiles"		},
							{	host: "megacache.net",		apiurl: "http://megacache.net/?op=checkfiles"		},
							{	host: "fileparadox.in",		apiurl: "http://fileparadox.com/?op=checkfiles"		},
							{	host: "fileparadox.com",		apiurl: "http://fileparadox.com/?op=checkfiles"		},
							{	host: "rapidstation.com",	apiurl: "http://rapidstation.com/?op=checkfiles"	},
							{	host: "potload.com",		apiurl: "http://potload.com/?op=checkfiles"			},
							{	host: "sube.me",			apiurl: "http://sube.me/?op=checkfiles"				},
							{	host: "akafile.com",		apiurl: "http://akafile.com/?op=checkfiles"			},
							{	host: "files2upload.net",	apiurl: "http://files2upload.net/?op=checkfiles"	},
							{	host: "backin.net",			apiurl: "http://backin.net/?op=checkfiles"			},
							{	host: "uploadscenter.com",	apiurl: "http://www.uploadscenter.com/?op=checkfiles"},
							{	host: "guizmodl.net",		apiurl: "http://www.guizmodl.net/?op=checkfiles"	},
							{	host: "gigfiles.net",		apiurl: "http://gigfiles.net/?op=checkfiles"		},
							{	host: "upload-novalayer.com",apiurl: "http://upload-novalayer.com/?op=checkfiles"},
							{	host: "todayfile.com",		apiurl: "http://todayfile.com/?op=checkfiles"		},
							{	host: "sfshare.se",			apiurl: "http://sfshare.se/?op=checkfiles"			},
							{	host: "lemuploads.com",		apiurl: "http://lemuploads.com/?op=checkfiles"		},
							{	host: "divxpress.com",		apiurl: "http://divxpress.com/?op=checkfiles"		},
							{	host: "upgiga.com",			apiurl: "http://www.upgiga.com/?op=checkfiles"		},
							{	host: "koofile.com",		apiurl: "http://koofile.com/op/checkfiles"			},
							{	host: "earnupload.eu",		apiurl: "http://earnupload.eu/?op=checkfiles"		},
							{	host: "kingfiles.net",		apiurl: "http://www.kingfiles.net/?op=checkfiles"	},
							{	host: "shareblue.eu",		apiurl: "http://shareblue.eu/?op=checkfiles"		},
							{	host: "redload.net",		apiurl: "http://redload.net/?op=checkfiles"			},
							{	host: "grifthost.com",		apiurl: "http://grifthost.com/?op=checkfiles"		},
							{	host: "limevideo.net",		apiurl: "http://limevideo.net/?op=checkfiles"		},
							{	host: "lunaticfiles.com",	apiurl: "http://lunaticfiles.com/?op=checkfiles"	},
							{	host: "vozupload.com",		apiurl: "http://vozupload.com/?op=checkfiles"		},
							{	host: "kingsupload.com",	apiurl: "http://kingsupload.com/?op=checkfiles"		},
							{	host: "usefile.com",		apiurl: "http://usefile.com/?op=checkfiles"			},
							{	host: "vidplay.net",		apiurl: "http://vidplay.net/?op=checkfiles"			},
							{	host: "mydisc.net",			apiurl: "http://mydisc.net/checkfiles.html"			},
							{	host: "med1fire.com",		apiurl: "http://med1fire.com/?op=checkfiles"		},
							{	host: "stahuj.to",			apiurl: "http://stahuj.to/?op=checkfiles"			},
							{	host: "uploadnetwork.eu",	apiurl: "http://uploadnetwork.eu/?op=checkfiles"	},
							{	host: "cloudvidz.net",		apiurl: "http://cloudvidz.net/?op=checkfiles"		},
							{	host: "hexupload.com",		apiurl: "http://hexupload.com/?op=checkfiles"		},
//							{	host: "dogupload.com",		apiurl: "http://www.filesfrog.net/?op=checkfiles"	}, //same host as filesfrog
							{	host: "shareprofi.com",		apiurl: "http://shareprofi.com/?op=checkfiles"		},
							{	host: "salefiles.com",		apiurl: "http://salefiles.com/?op=checkfiles"		},
							{	host: "anafile.com",		apiurl: "http://www.anafile.com/?op=checkfiles"		},
							{	host: "bonanzashare.com",	apiurl: "http://bonanzashare.com/?op=checkfiles"	},
							{	host: "imgjungle.com",		apiurl: "http://imgjungle.com/?op=checkfiles"		},
							{	host: "unlimitzone.com",	apiurl: "http://unlimitzone.com/?op=checkfiles"		},
							{	host: "rosharing.com",		apiurl: "http://rosharing.com/?op=checkfiles"		},
							{	host: "storagely.com",		apiurl: "http://storagely.com/?op=checkfiles"		},
							{	host: "wipfiles.net",		apiurl: "http://wipfiles.net/?op=checkfiles"		},
							{	host: "uploadcapital.com",	apiurl: "http://www.uploadcapital.com/?op=checkfiles"},
							{	host: "filemoney.com",		apiurl: "http://filemoney.com/?op=checkfiles"		},
							{	host: "filehoot.com",		apiurl: "http://filehoot.com/?op=checkfiles"		},
							{	host: "mxua.com",			apiurl: "http://www.mxua.com/?op=checkfiles"		},
							{	host: "uploadsat.com",		apiurl: "http://uploadsat.com/?op=checkfiles"		},
							{	host: "nodaup.com",			apiurl: "http://uploadsat.com/?op=checkfiles"		}, //same host as uploadsat
							{	host: "cloudyvideos.com",	apiurl: "http://cloudyvideos.com/?op=checkfiles"	},
							{	host: "idup.in",			apiurl: "http://idup.in/?op=checkfiles"				},
							{	host: "filedais.com",		apiurl: "http://www.filedais.com/?op=checkfiles"	},
							{	host: "fileforever.net",	apiurl: "http://fileforever.net/?op=checkfiles"		},
							{	host: "rioupload.com",		apiurl: "http://rioupload.com/?op=checkfiles"		},
							{	host: "medofire.co",		apiurl: "http://medofire.co/?op=checkfiles"			},
							{	host: "vshare.eu",			apiurl: "http://vshare.eu/?op=checkfiles"			},
							{	host: "hellupload.com",		apiurl: "http://www.hellupload.com/checkfiles.html"	},
							{	host: "hostingbulk.com",	apiurl: "http://hostingbulk.com/?op=checkfiles"		},
							{	host: "movreel.com",		apiurl: "http://movreel.com/?op=checkfiles"			},
							{	host: "thefile.me",			apiurl: "http://thefile.me/?op=checkfiles"			},
							{	host: "maxisharing.com",	apiurl: "http://maxisharing.com/?op=checkfiles"		},
							{	host: "spaceforfiles.com",	apiurl: "http://www.filespace.com/?op=checkfiles"	},
							{	host: "filespace.com",		apiurl: "http://www.filespace.com/?op=checkfiles"	}, //same host as spaceforfiles
							{	host: "city-upload.com",	apiurl: "http://city-upload.com/?op=checkfiles"		},
							{	host: "uploadrocket.net",	apiurl: "http://uploadrocket.net/?op=checkfiles"	},
							{	host: "bluehaste.com",		apiurl: "http://bluehaste.com/?op=checkfiles"		},
							{	host: "up09.com",			apiurl: "http://file.up09.com/?op=checkfiles"		},
							{	host: "1clickfiles.com",	apiurl: "http://1clickfiles.com/?op=checkfiles"		},
							{	host: "4downfiles.com",		apiurl: "http://4downfiles.com/?op=checkfiles"		},
							{	host: "filemup.com",		apiurl: "http://www.filemup.com/?op=checkfiles"		},
							{	host: "hottera.com",		apiurl: "http://hottera.com/?op=checkfiles"			},
							{	host: "lomafile.com",		apiurl: "http://lomafile.com/?op=checkfiles"		},
							{	host: "tuxfile.com",		apiurl: "http://tuxfile.com/?op=checkfiles"			},
							{	host: "filecloud.cc",		apiurl: "http://filecloud.cc/?op=checkfiles"		},
							{	host: "streamratio.com",	apiurl: "http://www.streamratio.com/?op=checkfiles"	},
							{	host: "flexydrive.com",		apiurl: "http://flexydrive.com/?op=checkfiles"		},
							{	host: "usersfiles.com",		apiurl: "http://usersfiles.com/?op=checkfiles"		},
							{	host: "megaupdown.com",		apiurl: "http://megaupdown.com/?op=checkfiles"		},
							{	host: "radicalshare.com",	apiurl: "http://radicalshare.com/checkfiles.html"	},
							{	host: "sharemods.com",		apiurl: "http://sharemods.com/?op=checkfiles"		},
							{	host: "worldbytez.com",		apiurl: "http://worldbytez.com/?op=checkfiles"		},
							{	host: "crisshare.com",		apiurl: "http://crisshare.com/?op=checkfiles"		},
							{	host: "vipshare.me",		apiurl: "http://vipshare.me/?op=checkfiles"			},
                            {	host: "turbobit.net",		apiurl: "http://turbobit.net/linkchecker"	        },
                        
						];
		
		//xfilesharing 1.0
		function addGenericType1()
		{
			var i = genType1.length;
			
			while(i--)
			{
				var host = genType1[i].host;
				var apiUrl = genType1[i].apiurl;
				
				if (apiUrl == "default") apiUrl = "http://www." + host + "/checkfiles.html";
				
				if (hostSet("Check_" + host.replace(/\./g, "_dot_").replace(/-/g, "_dash_") + "_links", false))
				{
					var regexSafe = host.replace(/\./g, "\\.").replace(/-/g, "\\-");
					
					addHost(
						host, //hostname
						regexSafe + "\/\\w+", //linkregex
						null, //blocksize
						new RegExp("(https?:\/\/(?:|www\\.)" + regexSafe + "\/\\w+)",""), //corrmatch
						null, //corrreplwhat
						null, //corrreplwith
						null, //separator
						apiUrl, //api url
						"op=checkfiles&process=Check+URLs&list=", //postdata
						new RegExp("(" + regexSafe + "\/\\w+)",""), //linkregex
						new RegExp("<font color='green'>https?:\/\/(?:|www\.)" + regexSafe + "\/\\w+","g"), //liveregex
						new RegExp("<font color='red'>https?:\/\/(?:|www\.)" + regexSafe + "\/\\w+","g"), //deadregex
						new RegExp("<font color='orange'>https?:\/\/(?:|www\.)" + regexSafe + "\/\\w+","g"), //unavaregex
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
				var host = genType2[i].host;
				var apiUrl = genType2[i].apiurl;
				
				if (hostSet("Check_" + host.replace(/\./g, "_dot_").replace(/-/g, "_dash_") + "_links", false))
				{
					var regexSafe = host.replace(/\./g, "\\.").replace(/-/g, "\\-");
					
					addHost(
						host, //hostname
						"https?:\/\/(?:www\\.|file\\.)?" + regexSafe + "\/\\w+", //linkregex
						null, //blocksize
						new RegExp("(https?:\/\/(?:|www\\.)" + regexSafe + "\/\\w+)",""), //corrmatch
						null, //corrreplwhat
						null, //corrreplwith
						null, //separator
						apiUrl, //api url
						"op=checkfiles&process=Check+URLs&list=", //postdata
						new RegExp("(" + regexSafe + "\/\\w+)",""), //linkregex
						new RegExp(regexSafe + "\/\\w+.*?\\s*<\/td>\\s*<td style=\"color:(?:green|#00f100);","g"), //liveregex
						new RegExp(regexSafe + "\/\\w+.*?\\s*<\/td>\\s*<td style=\"color:(?:red|#f10000);","g"), //deadregex
						new RegExp(regexSafe + "\/\\w+.*?\\s*<\/td>\\s*<td style=\"color:orange;","g"), //unavaregex
						null //function delegate
					)
				}
			}
		}
		
		// TEMPLATE
		// if (hostSet("Check__dot_com_links", false))
		// {			
			// addHost(
				// "", //hostname
				// "", //linkregex
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
        
        if (hostSet("Check_turbobit_dot_net_links", false))
		{			
			addHost(
				"turbobit.net", //hostname
				"turbobit\\.(?:net|pl)\/(?:\\w+\/|).+?\\.html", //linkregex
				null, //blocksize
				/(turbobit\.(?:net|pl)\/(?:\w+\/|).+?\.html)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				"\n", //separator
				'http://turbobit.net/linkchecker/csv',
				'links_to_check=',
				/(turbobit\.(?:net|pl)\/\w+)/,
				/turbobit\.(?:net|pl)\/.*?, 1/g,
				/turbobit\.(?:net|pl)\/.*?, 0/g, 
				null,
				null //function delegate
			)			
		}
		
		if (hostSet("Check_myvdrive_dot_com_links", false))
		{	
			addHost(
				"myvdrive.com|fileserving.com", //hostname
				"(?:fileserving|myvdrive)\\.com\/files\/[\\w-]+", //linkregex
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				"http://www.myvdrive.com/Public/linkchecker", //api url
				"links=", //postdata
				/(?:fileserving|myvdrive)\.com\/(files\/[\w-]+)/, //linkregex
				/icon_file_check_valid"><\/span>\s*http:\/\/(?:www\.)?(?:fileserving|myvdrive)\.com\/files\/[\w-]+/g, //liveregex
				/icon_file_check_(?:removed|notvalid)"><\/span>\s*http:\/\/(?:www\.)?(?:fileserving|myvdrive)\.com\/files\/[\w-]+/g, //deadregex
				null, //unavaregex
				null //function delegate
			)				
		}
		
		if (hostSet("Check_k2s_dot_cc_links", false))
		{			
			addHost(
				"k2s.cc|keep2share.cc|keep2s.cc|keep2share.com", //hostname
				"(?:k2s\\.cc\/file|keep2share\\.cc\/file|keep2s\\.cc\/file|keep2share\\.com\/file)\/\\w+", //linkregex
				50, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				"\n", //separator
				'http://k2s.cc/file/check.html',
				'LinkCheckerForm%5BresponseType%5D=json&yt0=&LinkCheckerForm%5Blinks%5D=',
				/\\\/file\\\/(\w+)/,
				/http:\\\/\\\/(?:k2s\.cc|keep2share\.cc|keep2s\.cc|keep2share\.com)\\\/file\\\/\w+(?:[^,]+,)(?:[^,]+,)(?:[^,]+,)"status":"available"/g,
				/http:\\\/\\\/(?:k2s\.cc|keep2share\.cc|keep2s\.cc|keep2share\.com)\\\/file\\\/\w+(?:[^,]+,)(?:[^,]+,)(?:[^,]+,)"status":"(?:deleted|not_exist)"/g,
				null,
				null //function delegate
			)
		}
		if (hostSet("Check_fboom_dot_me_links", false))
		{			
			addHost(
				"fboom.me|fileboom.me", //hostname
				"(?:fboom\\.me\/file||fileboom\\.me\/file)\/\\w+", //linkregex
				50, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				"\n", //separator
				'http://fboom.me/file/check.html',
				'LinkCheckerForm%5BresponseType%5D=json&yt0=&LinkCheckerForm%5Blinks%5D=',
				/\\\/file\\\/(\w+)/,
				/http:\\\/\\\/(?:fboom\.me|fileboom\.me)\\\/file\\\/\w+(?:[^,]+,)(?:[^,]+,)(?:[^,]+,)"status":"available"/g,
				/http:\\\/\\\/(?:fboom\.me|fileboom\.me)\\\/file\\\/\w+(?:[^,]+,)(?:[^,]+,)(?:[^,]+,)"status":"(?:deleted|not_exist)"/g,
				null,
				null //function delegate
			)
		}

		if (hostSet("Check_filepost_dot_com_links", false))
		{			
			addHost(
				"filepost.com|fp.io", //hostname
				"(?:filepost\\.com\/files|fp\\.io)\/\\w+", //linkregex
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				"\n", //separator
				'http://filepost.com/files/checker/?JsHttpRequest=0-xml',
				'urls=',
				/\\\/files\\\/(\w+)/,
				/>http:\\\/\\\/filepost\.com\\\/files\\\/\w+(?:[^>]+>){5}(?:\\n|\\t)+<span class=\\"v\\"/g,
				/>http:\\\/\\\/filepost\.com\\\/files\\\/\w+(?:[^>]+>){5}(?:\\n|\\t)+<span class=\\"x\\"/g,
				null,
				null //function delegate
			)			
		}
		
		if (hostSet("Check_fiberupload_dot_net_links", false))
		{			
			addHost(
				"fiberupload.com|fiberupload.net", //hostname
				"fiberupload\\.(?:com|net)\/\\w+", //linkregex
				null, //blocksize
				/(http:\/\/(?:www\.|)fiberupload\.(?:com|net)\/\w+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'http://fiberupload.net/?op=checkfiles',
				'op=checkfiles&list=',
				/(fiberupload\.(?:com|net)\/\w+)/,
				/'green'>http:\/\/(?:www\.|)fiberupload\.(?:com|net)\/\w+/g,
				/'red'>http:\/\/(?:www\.|)fiberupload\.(?:com|net)\/\w+/g,
				/'orange'>http:\/\/(?:www\.|)fiberupload\.(?:com|net)\/\w+/g,
				null //function delegate
			)
		}
		
		if (hostSet("Check_edisk_dot_cz_links", false))
		{			
			addHost(
				"edisk.cz|edisk.sk|edisk.eu", //hostname
				"(?:(?:muj|data)\\d*\\.|)edisk\\.(?:cz|sk|eu)\/(?:|(?:cz|sk|en|pl)\/)", //linkregex
				null, //blocksize
				null, //corrmatch
				/edisk\.\w{2}\/(?:|\w{2}\/)stahni/, //corrreplwhat
				'edisk.cz/stahni', //corrreplwith
				null, //separator
				'http://www.edisk.cz/zkontrolovat-odkazy',
				'submitBtn=Zkontrolovat&checkFiles=',
				/((?:download|stahn(?:i|out-soubor))\/\d+)/,
				/"ano"\/>\s*<\/td>\s*<td>\s*http:\/\/.+/g,
				/"ne"\/>\s*<\/td>\s*<td>\s*http:\/\/.+/g,
				null,
				null //function delegate
			)			
		}
		
		if (hostSet("Check_bezvadata_dot_cz_links", false))
		{			
			addHost(
				"bezvadata.cz", //hostname
				"(?:beta\\.|)bezvadata\.cz\/stahnout\/\\d+\\w+", //linkregex
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'http://bezvadata.cz/nastroje/kontrola-odkazu?do=kontrolaOdkazuForm-submit',
				'zkontrolovat=Zkontrolovat&odkazy=',
				/(bezvadata\.cz\/stahnout\/\d+)/,
				/bezvadata\.cz\/stahnout\/.+?<\/td>\s*<td style="background-color: #d9ffb2/g,
				/bezvadata\.cz\/stahnout\/.+?<\/td>\s*<td style="background-color: #ffb2b2/g,
				null,
				null //function delegate
			)			
		}
		
		if (hostSet("Check_depositfiles_dot_com_links", false))
		{			
			addHost(
				"depositfiles.com|dfiles.eu|dfiles.ru|depositfiles.org|depositfiles.lt", //hostname
				"(?:depositfiles\\.(?:com|lt|org)|dfiles\\.(?:eu|ru))\/(?:en\/|ru\/|de\/|es\/|pt\/|)files\/\\w+", //linkregex
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
				depositfilesBulkCheck //function delegate
			)			
		}
		
		if (hostSet("Check_videobb_dot_com_links", false))
		{			
			addHost(
				"videobb.com", //hostname
				"videobb\\.com\/(?:video\/|watch_video\\.php\\?v=)\\w+", //linkregex
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'http://www.videobb.com/link_checker.php',
				'links=',
				/(videobb\.com\/(?:watch_video\.php\?v?=|video\/)\w+)/,
				/<td>http:\/\/(?:www\.|)videobb.com\/(?:watch_video\.php\?v?=|video\/)\w+<\/td>\s+<td>.+?<\/td>\s+<td>\d+:\d+<\/td>\s+<td>Available/g,
				/<td>http:\/\/(?:www\.|)videobb.com\/(?:watch_video\.php\?v?=|video\/)\w+<\/td>\s+<td>(?:|.+?)<\/td>\s+<td>N\/A<\/td>\s+<td>Not Available/g,
				null,
				null //function delegate
			)			
		}
		
		if (hostSet("Check_queenshare_dot_com_links", false))
		{
			addHost(
				"queenshare.com|10upload.com", //hostname
				"(?:queenshare|10upload)\\.com\/\\w+", //linkregex
				null, //blocksize
				/(http:\/\/(?:www\.|)(?:queenshare|10upload)\.com\/\w+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'http://www.queenshare.com/?op=checkfiles', //api url
				'op=checkfiles&process=Check+URLs&list=', //postdata
				/((?:queenshare|10upload)\.com\/\w+)/, //linkregex
				/(?:queenshare|10upload)\.com\/\w+.*?<\/td>\s*<td style=\"color:green;\">/g, //liveregex
				/(?:queenshare|10upload)\.com\/\w+.*?<\/td>\s*<td style=\"color:red;\">/g, //deadregex
				/(?:queenshare|10upload)\.com\/\w+.*?<\/td>\s*<td style=\"color:orange;\">/g, //unavaregex
				null //function delegate
			)
		}
		
/*		if (hostSet("Check_bitshare_dot_com_links", false))
		{				
			addHost(
				"bitshare.com", //hostname
				"bitshare\\.com\/(?:files\/|\\?[fi]=)\\w+", //linkregex
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'http://bitshare.com/linkcheck.html',
				'submit=Check&links=',
				/(bitshare\.com\/(?:files\/|\?[fi]=)\w+)/,
				/ru_2\.gif" \/>\s*<\/div>\s*<span style="font-size:14px;font-weight:bold;">.*?<\/span>\s*<\/p>\s*<p>\s*<a href="http:\/\/(?:www\.|)bitshare\.com\/(?:files\/|\?[fi]=)\w+/g,
				/ru_3\.gif" \/>\s*<\/div>\s*<span style="font-size:14px;font-weight:bold;">.*?<\/span>\s*<\/p>\s*<p>\s*<a href="http:\/\/(?:www\.|)bitshare\.com\/(?:files\/|\?[fi]=)\w+/g,
				/ru_1\.gif" \/>\s*<\/div>\s*<span style="font-size:14px;font-weight:bold;">.*?<\/span>\s*<\/p>\s*<p>\s*<a href="http:\/\/(?:www\.|)bitshare\.com\/(?:files\/|\?[fi]=)\w+/g,
				null //function delegate
			)			
		} */

		if (hostSet("Check_cramit_dot_in_links", false))
		{			
			addHost(
				"cramit.in|cramitin.net|cramitin.eu|cramitin.us", //hostname
				"cramit(?:\\.in|in\\.(?:net|eu|us))\/", //linkregex
				null, //blocksize
				/(http:\/\/(?:www\.)?cramit(?:\.in|in\.(?:net|eu|us))\/\w+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'http://cramit.in/checkfiles.html',
				'op=checkfiles&process=CHECK+URL%27S&list=',
				/(cramit(?:\.in|in\.(?:net|eu|us))\/\w+)/,
				/green>http:\/\/(?:www\.|)cramit(?:\.in|in\.(?:net|eu|us))\/\w+/g,
				/red'>http:\/\/(?:www\.|)cramit(?:\.in|in\.(?:net|eu|us))\/\w+/g,
				/orange'>http:\/\/(?:www\.|)cramit(?:\.in|in\.(?:net|eu|us))\/\w+/g,
				null //function delegate
			)			
		}
		
		if (hostSet("Check_filerio_dot_com_links", false))
		{			
			addHost(
				"filekeen.com|filerio.in|filerio.com", //hostname
				"file(?:keen|rio)\\.(?:com|in)\/\\w+", //linkregex
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				"\n", //separator
				'http://filerio.in/checkfiles.html',
				'op=checkfiles&process=Check+URLs&list=',
				/(file(?:keen|rio)\.(?:com|in)\/\w+)/,
				/green'>http:\/\/(?:www\.|)file(?:keen|rio)\.(?:com|in)\/\w+/g,
				/red'>http:\/\/(?:www\.|)file(?:keen|rio)\.(?:com|in)\/\w+/g,
				/orange'>http:\/\/(?:www\.|)file(?:keen|rio)\.(?:com|in)\/\w+/g,
				null //function delegate
			)			
		}
		
		if (hostSet("Check_share_dash_online_dot_biz_links", false))
		{			
			addHost(
				"share-online.biz|egoshare.com", //hostname
				"(?:share-online\\.biz|egoshare\\.com)\/(?:dl\/|download\\.php\\?id=|\\?d=)\\w+", //linkregex
				100, //blocksize
				/http:\/\/(?:www\.|)(?:share-online\.biz|egoshare\.com)\/(?:d(?:l\/|ownload\.php\?id=)|\?d=)(?:\d{1}\/|)(\w+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				"\n", //separator
				'http://api.share-online.biz/linkcheck.php',
				'links=',
				/(\w+);(?:OK|NOTFOUND|DELETED)/,
				/(\w+);OK/g,
				/(\w+);(?:DELETED|NOTFOUND)/g, 
				null,
				null //function delegate
			)			
		}
				
		if (hostSet("Check_quickshare_dot_cz_links", false))
		{			
			addHost(
				"quickshare.cz", //hostname
				"quickshare\\.cz\/stahnout-soubor\/\\d+", //linkregex
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'http://www.quickshare.cz/nastroje/link-checker',
				'linky=',
				/quickshare\.cz\/stahnout-soubor\/(\d+(?::\w+)?)/,
				/quickshare\.cz\/stahnout-soubor\/\d+(?::[\w\-.+$!*\/()\[\]\',~%?:@#&=\\]+)?\s*<\/a><\/td><td><img src="\/img\/ok\.gif/g,
				/quickshare\.cz\/stahnout-soubor\/\d+(?::[\w\-.+$!*\/()\[\]\',~%?:@#&=\\]+)?\s*<\/td><td><img src="\/img\/nenalezeno\.gif/g, 
				null,
				null //function delegate
			)			
		}
		
		if (hostSet("Check_netload_dot_in_links", false))
		{			
			addHost(
				"netload.in", //hostname
				"netload\\.in\/datei\\w{10}", //linkregex
				100, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				"\n", //separator
				"http://api.netload.in/index.php?id=2", //api url
				"send=Absenden&links=", //postdata
				/(\w+);/, //linkregex
				/\w{10,};.+?;.+?;online/g, //liveregex
				/\w{10,};.+?;.+?;offline/g, //deadregex
				null, //unavaregex
				netloadBulkCheck //function delegate
			)			
		}
	
		if (hostSet("Check_videopremium_dot_net_links", false))
		{
			addHost(
				"videopremium.net|videopremium.tv|videopremium.me", //hostname
				"videopremium\\.(?:net|tv)\/\\w+", //linkregex
				null, //blocksize
				/(http:\/\/(?:www\.|)videopremium\.(?:net|tv|me)\/\w+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'http://videopremium.me/?op=checkfiles',
				'op=checkfiles&process=Check+URLs&list=',
				/(videopremium\.(?:net|tv|me)\/\w+)/,
				/videopremium\.(?:net|tv|me)\/\w+.*?<\/td>\s*<td style=\"color:green;\">/g, //liveregex
				/videopremium\.(?:net|tv|me)\/\w+.*?<\/td>\s*<td style=\"color:red;\">/g, //deadregex
				/videopremium\.(?:net|tv|me)\/\w+.*?<\/td>\s*<td style=\"color:orange;\">/g, //unavaregex
				null //function delegate
				
			)
		}
		
		if (hostSet("Check_eyesfile_dot_net_links", false))
		{			
			addHost(
				"eyesfile.net|eyesfile.com|eyesfile.co|eyesfile.org|eyesfiles.com", //hostname
				"eyesfiles?\\.(?:com?|net|org)\/\\w+", //linkregex
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'http://www.eyesfiles.com/checkfiles.html',
				'op=checkfiles&process=Check+URLs&list=',
				/(eyesfiles?\.(?:com?|net|org)\/\w+)/,
				/green'>http:\/\/(?:www\.|)eyesfiles?\.(?:com?|net|org)\/\w+/g,
				/red'>http:\/\/(?:www\.|)eyesfiles?\.(?:com?|net|org)\/\w+/g,
				/orange'>http:\/\/(?:www\.|)eyesfiles?\.(?:com?|net|org)\/\w+/g,
				null //function delegate
			)			
		}
		
		if (hostSet("Check_nitrobits_dot_com_links", false))
		{
			addHost(
				"nitrobits.com",
				"nitrobits\\.com\/file\/\\w+",
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				"http://nitrobits.com/linkchecker.php",
				"submit=Check+Links&links=",
				/(nitrobits\.com\/file\/\w+)/,
				/nitrobits\.com\/file\/\w+.*?\s*<\/td>\s*<\w+.*?>\s*<span class="available/g, //liveregex
				/nitrobits\.com\/file\/\w+.*?\s*<\/td>\s*<\w+.*?>\s*<span class="dead/g, //deadregex
				/nitrobits\.com\/file\/\w+.*?\s*<\/td>\s*<\w+.*?>\s*<span class="unavailable/g, //unavaregex
				null
			)
		}
			
		if (hostSet("Check_uploading_dot_com_links", false))
		{
			addHost(
				"uploading.com",
				"http:\/\/(?:www\\.|)uploading\\.com\/(?:files\/)?\\w+",
				500, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				"http://uploading.com/filechecker?ajax",
				"urls=",
				/uploading\.com\\\/(\w+)/,
				/ok\\">\\n\\t\\t<span class=\\"num\\">\d+<\\\/span>\\n\\t\\t<i><\\\/i>\\n\\t\\t<div>\\n\\t\\t\\t<a href=\\"http:\\\/\\\/(?:www\.|)uploading\.com\\\/\w+/g,
				/failed\\">\\n\\t\\t<span class=\\"num\\">\d+<\\\/span>\\n\\t\\t<i><\\\/i>\\n\\t\\t<div>\\n\\t\\t\\t<a href=\\"http:\\\/\\\/(?:www\.|)uploading\.com\\\/\w+/g,
				null,
				uploadingBulkCheck
			)
		}
			
		/*if (hostSet("Check_extabit_dot_com_links", false) && genset("Extabit_API_Check", false))
		{
			addHost(
				"extabit.com",
				"(?:u\\d+\\.)?extabit\\.com\/file(?:\/|\_)\\w+",
				100, //blocksize
				null, //corrmatch
				/\?upld=1/, //corrreplwhat
				"", //corrreplwith
				null, //separator
				null,
				null,
				null,
				null,
				null,
				null,
				extabitBulkCheck
			)
		}*/
			
		if (hostSet("Check_megashares_dot_com_links", false))
		{
			addHost(
				"megashares.com",
				"(?:d\\d+\.|)megashares\.com\/(?:dl\/|(?:index\\.php\\?d\\d+|\\?d\\d+)=)\\w+",
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				"http://d01.megashares.com/checkit.php",
				"submit_links=Check+Links&check_links=",
				/((?:d\d+\.|)megashares\.com\/(?:dl\/|(?:index\.php\?d\d+|\?d\d+)=)\w+)/,
				/(?:d\d+\.|)megashares\.com\/(?:dl\/|(?:index\.php\?d\d+|\?d\d+)=)\w+.*?\s*-\s*ok/g,
				/(?:d\d+\.|)megashares\.com\/(?:dl\/|(?:index\.php\?d\d+|\?d\d+)=)\w+.*?\s*-\s*invalid/g,
				null,
				null
			)
		}
			
    if (hostSet("Check_mega_dot_co_dot_nz_links", false))
		{
			addHost(
				"mega.nz|mega.co.nz",
				"mega\\.(?:co\\.)?nz\/#!\\w+",
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
				megaBulkCheck //function delegate
			)			
		}
			
		if (hostSet("Check_4up_dot_me_links", false))
		{
			addHost(
				"4up.me|4up.im|4upfiles.com",
				"(?:4upfiles\\.com|4up\\.(?:me|im))\/\\w+",
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				"http://4upfiles.com/?op=checkfiles", //api url
				"op=checkfiles&process=Check+URLs&list=", //postdata
				/(4up(?:files)?\.(?:com|me|im)\/\w+)/, //linkregex
				/4up(?:files)?\.(?:com|me|im)\/\w+.*?<\/td>\s*<td style=\"color:green;\">/g, //liveregex
				/4up(?:files)?\.(?:com|me|im)\/\w+.*?<\/td>\s*<td style=\"color:red;\">/g, //deadregex
				/4up(?:files)?\.(?:com|me|im)\/\w+.*?<\/td>\s*<td style=\"color:orange;\">/g, //unavaregex
				null //function delegate
			)
		}
			
/*		if (hostSet("Check_uploaded_dot_to_links", false))
		{
			addHost(
				"uploaded.to|uploaded.net|ul.to",
				'(?:uploaded\\.(?:to|net)|ul\\.to)\/(?:files?\/|\\?(?:lang=\\w{2}&)?id=|folder\/)?(?!img|coupon)\\w{8}',
				1000,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				uploadedBulkCheck
			)
		}
				
		/*if (hostSet("Check_tusfiles_dot_net_links", false))
		{			
			addHost(
				"tusfiles.com|tusfiles.net", //hostname
				"tusfiles\\.(?:com|net)\/\\w+", //linkregex
				null, //blocksize
				/(http:\/\/(?:www\.|)tusfiles\.(?:com|net)\/\w+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'http://www.tusfiles.net/?op=checkfiles',
				'op=checkfiles&process=Check+URLs&list=',
				/(tusfiles\.(?:net|com)\/\w+)/,
				/tusfiles\.(?:net|com)\/\w+.*?<\/td>\s*<td style="color:green;">/g, //liveregex
				/tusfiles\.(?:net|com)\/\w+.*?<\/td>\s*<td style="color:red;">/g, //deadregex
				/tusfiles\.(?:net|com)\/\w+.*?<\/td>\s*<td style="color:orange;">/g, //unavaregex
				null //function delegate
			)			
		}*/
			
		if (hostSet("Check_junocloud_dot_me_links", false))
		{
			addHost(
				"junocloud.me",
				"junocloud\\.me\/\\w+",
				null,
				null,
				null,
				null,
				null,
				"http://junocloud.me/checkfiles.html",
				"op=checkfiles&process=Check+URLs&list=",
				/(junocloud\.me\/\w+)/,
				/junocloud\.me\/\w+.*?<span style="color: green;/g,
				/junocloud\.me\/\w+.*?<span style="color: red;/g,
				/junocloud\.me\/\w+.*?<span style="color: orange;/g,
				null //function delegate
			)
		}
			
		if (hostSet("Check_flashdrive_dot_it_links", false))
		{
			addHost(
				"flashdrive.it|flashdrive.uk.com",
				"flashdrive\\.(?:it|uk\\.com)\/\\w+",
				null,
				null,
				null,
				null,
				null,
				"http://flashdrive.uk.com/?op=checkfiles",
				"op=checkfiles&process=Check+URLs&list=",
				/(flashdrive\.(?:it|uk\.com)\/\w+)/,
				/flashdrive\.(?:it|uk\.com)\/\w+.*?<\/td><td style="color:green;">/g,
				/flashdrive\.(?:it|uk\.com)\/\w+.*?<\/td><td style="color:red;">/g,
				/flashdrive\.(?:it|uk\.com)\/\w+.*?<\/td><td style="color:orange;">/g,
				null //function delegate
			)
		}
			
		if (hostSet("Check_datei_dot_to_links", false))
		{
			addHost(
				"datei.to",
				"datei\\.to\/(?:datei\/|files\/|1,|\\?)\\w+",
				100000,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				null,
				dateiToBulk
			)
		}
			
		if (hostSet("Check_medafire_dot_net_links", false))
		{
			addHost(
				"medafire.net",
				"medafire\\.net\/(?:up\/)?\\w+",
				null,
				null,
				null,
				null,
				null,
				"http://medafire.net/?op=checkfiles",
				"op=checkfiles&process=Check+URLs&list=",
				/(medafire\.net\/(?:up\/)?\w+)/,
				/medafire\.net\/(?:up\/)?\w+.*?<\/td><td style="color:green;">/g,
				/medafire\.net\/(?:up\/)?\w+.*?<\/td><td style="color:red;">/g,
				/medafire\.net\/(?:up\/)?\w+.*?<\/td><td style="color:orange;">/g,
				null //function delegate
			)
		}
			
		if (hostSet("Check_depfile_dot_com_links", false))
		{			
			addHost(
				"depfile.com", //hostname
				"depfile\\.com\/(?:downloads\/i\/\\d+\/f\/|\\w+)", //linkregex
				22, //blocksize //unsure if right number
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'https://depfile.com/checkfiles', //api url
				'send=Check&files=', //postdata
				/(depfile\.com\/(?:downloads\/i\/\d+|\w+))/, //linkregex
				/depfile\.com\/(?:downloads\/i\/\d+|\w+)[^<]*?<\/td><td><span class='active/g, //liveregex
				/depfile\.com\/(?:downloads\/i\/\d+|\w+)[^<]*?<\/td><td><span class='(?:notfound|badurl)/g, //deadregex
				null, //unavaregex
				null //function delegate
			)			
		}
			
		if (hostSet("Check_filedwon_dot_com_links", false))
		{
			addHost(
				"filedwon.com|filedwon.net|filedwon.info", //hostname
				"filedwon\\.(?:com|net|info)\/\\w+", //linkregex
				null, //blocksize
				/(http:\/\/(?:www\.|)filedwon\.(?:com|net|info)\/\w+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'http://filedwon.info/?op=checkfiles',
				'op=checkfiles&process=Check+URLs&list=',
				/(filedwon\.(?:com|net|info)\/\w+)/,
				/filedwon\.(?:com|net|info)\/\w+.*?<\/td>\s*<td style=\"color:green;\">/g, //liveregex
				/filedwon\.(?:com|net|info)\/\w+.*?<\/td>\s*<td style=\"color:red;\">/g, //deadregex
				/filedwon\.(?:com|net|info)\/\w+.*?<\/td>\s*<td style=\"color:orange;\">/g, //unavaregex
				null //function delegate
			)
		}
		
		if (hostSet("Check_ge_dot_tt_links", false))
		{			
			addHost(
				"ge.tt", //hostname
				"ge\\.tt\/(?:api\/1\/files\/)?\\w+", //linkregex
				1000000, //blocksize
				/ge\.tt\/(?:api\/1\/files\/)?(\w+.*)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'https://open.ge.tt/1/files/', //api url
				null, //postdata
				null, //linkregex
				null, //liveregex
				null, //deadregex
				null, //unavaregex
				gettBulkCheck //function delegate
			)			
		}
		
		if (hostSet("Check_filesbomb_dot_com_links", false))
		{
			addHost(
				"filesbomb.com|filesbomb.biz|filesbomb.in", //hostname
				"filesbomb\\.(?:com|biz|in)\/\\w+", //linkregex
				null, //blocksize
				/(http:\/\/(?:www\.|)filesbomb\.(?:com|biz|in)\/\w+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'http://filesbomb.in/?op=checkfiles',
				'op=checkfiles&process=Check+URLs&list=',
				/(filesbomb\.(?:com|biz|in)\/\w+)/,
				/filesbomb\.(?:com|biz|in)\/\w+.*?<\/td>\s*<td style=\"color:green;\">/g, //liveregex
				/filesbomb\.(?:com|biz|in)\/\w+.*?<\/td>\s*<td style=\"color:red;\">/g, //deadregex
				/filesbomb\.(?:com|biz|in)\/\w+.*?<\/td>\s*<td style=\"color:orange;\">/g, //unavaregex
				null //function delegate
			)
		}
		
		if (hostSet("Check_restfiles_dot_net_links", false))
		{	
			addHost(
				"restfile.com|restfile.cc|restfile.org|restfile.net|restfile.co|restfile.bz|restfile.ws|restfiles.com|restfiles.net", //hostname
				"restfiles?\\.\\w{2,3}\/\\w+", //linkregex
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				"http://www.restfiles.net/?op=checkfiles", //api url
				"op=checkfiles&process=Check+URLs&list=", //postdata
				/(restfiles?\.\w{2,3}\/\w+)/, //linkregex
				/green'>http:\/\/(?:|www\.)restfiles?\.\w{2,3}\/\w+/g, //liveregex
				/red'>http:\/\/(?:|www\.)restfiles?\.\w{2,3}\/\w+/g, //deadregex
				/orange'>http:\/\/(?:|www\.)restfiles?\.\w{2,3}\/\w+/g, //unavaregex
				null //function delegate
			)				
		}
		
		if (hostSet("Check_filekom_dot_com_links", false))
		{	
			addHost(
				"filekom.com|filemac.com", //hostname
				"file(?:kom|mac)\\.com\/\\w+", //linkregex
				null, //blocksize
				/(http:\/\/(?:|www\.)file(?:kom|mac)\.com\/\w+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				"http://filekom.com/checkfiles.html", //api url
				"op=checkfiles&process=Check+URLs&list=", //postdata
				/(file(?:kom|mac)\.com\/\w+)/, //linkregex
				/green'>http:\/\/(?:|www\.)file(?:kom|mac)\.com\/\w+/g, //liveregex
				/red'>http:\/\/(?:|www\.)file(?:kom|mac)\.com\/\w+/g, //deadregex
				/orange'>http:\/\/(?:|www\.)file(?:kom|mac)\.com\/\w+/g, //unavaregex
				null //function delegate
			)				
		}	
		
		if (hostSet("Check_filepup_dot_net_links", false))
		{			
			addHost(
				"filepup.net", //hostname
				"filepup\\.net\/(?:files|get)\/\\w+", //linkregex
				null, //blocksize
				null, //corrmatch
				/\/get\/(\w+)\/.+/, //corrreplwhat
				"/files/$1.html", //corrreplwith
				null, //separator
				'http://www.filepup.net/link_checker.php', //api url
				'task=doCheck&submit=Check+Links&urls=', //postdata
				/filepup\.net\/files(\/\w+)/, //linkregex
				/green">http:\/\/(?:www\.)?filepup\.net\/files\/\w+/g, //liveregex
				/red">http:\/\/(?:www\.)?filepup\.net\/files\/\w+/g, //deadregex
				/orange">http:\/\/(?:www\.)?filepup\.net\/files\/\w+/g, //unavaregex
				null //function delegate
			)			
		}
		
		if (hostSet("Check_media1fire_dot_com_links", false))
		{	
			addHost(
				"media1fire.com", //hostname
				"up\\.media1fire\\.com\/\\w+", //linkregex
				null, //blocksize
				/(http:\/\/up\.media1fire\.com\/\w+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				"http://up.media1fire.com/?op=checkfiles", //api url
				"op=checkfiles&process=Check+URLs&list=", //postdata
				/(up\.media1fire\.com\/\w+)/, //linkregex
				/up\.media1fire\.com\/\w+.*?<\/td>\s*<td style=\"color:green;\">/g, //liveregex
				/up\.media1fire\.com\/\w+.*?<\/td>\s*<td style=\"color:red;\">/g, //deadregex
				/up\.media1fire\.com\/\w+.*?<\/td>\s*<td style=\"color:orange;\">/g, //unavaregex
				null //function delegate
			)				
		}
		
		if (hostSet("Check_filecloud_dot_io_links", false))
		{			
			addHost(
				"filecloud.io", //hostname
				"filecloud\\.io\/\\w{6,8}", //linkregex
				100000000, //blocksize
				/filecloud\.io\/(\w{6,8})/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				null, //api url
				null, //postdata
				null, //linkregex
				null, //liveregex
				null, //deadregex
				null, //unavaregex
				filecloudBulkCheck //function delegate
			)			
		}
		
		if (hostSet("Check_maskfile_dot_com_links", false))
		{			
			addHost(
				"maskfile.com", //hostname
				"[mM]ask[Ff]ile\\.com\/\\w+", //linkregex
				null, //blocksize
				/(https?:\/\/(?:www\.)?maskfile\.com\/\w+)/i, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'https://www.maskfile.com/?op=checkfiles', //api url
				'op=checkfiles&process=Check+URLs&list=', //postdata
				/maskfile\.com\/(\w+)/i, //linkregex
				/maskfile\.com\/\w+.*?<\/td>\s*<td style="color:green;">/gi, //liveregex
				/maskfile\.com\/\w+.*?<\/td>\s*<td style="color:red;">/gi, //deadregex
				/maskfile\.com\/\w+.*?<\/td>\s*<td style="color:orange;">/gi, //unavaregex
				null //function delegate
			)			
		}
		
		if (hostSet("Check_anysend_dot_com_links", false))
		{			
			addHost(
				"anysend.com", //hostname
				"anysend\\.com\/\\w{32}", //linkregex
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
				anysendBulkCheck //function delegate
			)			
		}
		
		if (hostSet("Check_batshare_dot_com_links", false))
		{			
			addHost(
				"batshare.com", //hostname
				"batshare\\.com\/\\w+", //linkregex
				null, //blocksize
				/(https?:\/\/(?:www\.)?batshare\.com\/\w+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'http://batshare.com/?op=checkfiles', //api url
				'op=checkfiles&process=Check+URLs&list=', //postdata
				/(batshare\.com\/\w+)/, //linkregex
				/<font color='green'><a target='_new' href='http:\/\/(?:www\.)?batshare\.com\/\w+(?:\/.*)?'>/g, //liveregex
				/<font color='red'>http:\/\/(?:www\.)?batshare\.com\/\w+(?:\/.*)?/g, //deadregex
				/<font color='orange'><a target='_new' href='http:\/\/(?:www\.)?batshare\.com\/\w+(?:\/.*)?'>/g, //unavaregex
				null //function delegate
			)			
		}
		
		if (hostSet("Check_webshare_dot_cz_links", false))
		{
			addHost(
				"webshare.cz", //hostname
				"webshare\\.cz\/(?:(?:#/)?file/\\w+|\\w+-.*)", //linkregex
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
		
		if (hostSet("Check_uploadable_dot_ch_links", false))
		{			
			addHost(
				"uploadable.ch", //hostname
				"uploadable\\.ch\/file\/\\w+", //linkregex
				null, //blocksize
				null, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				'http://www.uploadable.ch/check.php', //api url
				'urls=', //postdata
				/(uploadable\.ch\/file\/\w+)/, //linkregex
				/<div class="col1"><a href="">http:\/\/(?:www\.)?uploadable\.ch\/file\/\w+.*<\/a><\/div>\s+<div class="col2">.+<\/div>\s+<div class="col3">.+<\/div>\s+<div class="col4"><span class="[\w\s]+">&nbsp;<\/span>\s+<span class="left">Available<\/span>/g, //liveregex
				/<div class="col1"><a href="">http:\/\/(?:www\.)?uploadable\.ch\/file\/\w+.*<\/a><\/div>\s+<div class="col2">.+<\/div>\s+<div class="col3">.+<\/div>\s+<div class="col4"><span class="[\w\s]+">&nbsp;<\/span>\s+<span class="left">Not Available<\/span>/g, //deadregex
				null, //unavaregex
				null //function delegate
			)			
		}
		
		if (hostSet("Check_prefiles_dot_com_links", false))
		{	
			addHost(
				"prefiles.com", //hostname
				"prefiles\\.com\/\\w+", //linkregex
				null, //blocksize
				/(https?:\/\/(?:www\.)?prefiles\.com\/\w+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				"http://prefiles.com/checker", //api url
				"op=checkfiles&list=", //postdata
				/(prefiles\.com\/\w+)/, //linkregex
				/prefiles\.com\/\w+.*<\/div>\s*<div class="copy" style="color:#6ab621;">/g, //liveregex
				/prefiles\.com\/\w+.*<\/div>\s*<div class="copy" style="color:#f10000;">/g, //deadregex
				null, //unavaregex
				null //function delegate
			)				
		}

		if (hostSet("Check_rapidu_dot_net_links", false))
		{	
			addHost(
				"rapidu.net", //hostname
				"rapidu\\.net\/\\d+", //linkregex
				1000000, //blocksize
				/rapidu\.net\/(\d+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				"http://rapidu.net/api/getFileDetails/", //api url
				"id=", //postdata
				null, //linkregex
				null, //liveregex
				null, //deadregex
				null, //unavaregex
				rapiduBulkCheck //function delegate
			)				
		}

		if (hostSet("Check_uplea_dot_com_links", false))
		{	
			addHost(
				"uplea.com", //hostname
				"uplea\\.com\/dl\/\\w+", //linkregex
				1000000, //blocksize
				/(https?:\/\/(?:www\.)?uplea\.com\/dl\/\w+)/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				"http://api.uplea.com/api/check-my-links", //api url
				null, //postdata
				null, //linkregex
				null, //liveregex
				null, //deadregex
				null, //unavaregex
				upleaBC //function delegate
			)				
		}

		if (hostSet("Check_oboom_dot_com_links", false))
		{	
			addHost(
				"oboom.com", //hostname
				"oboom\\.com\/#?\\w{8}", //linkregex
				null, //blocksize
				/oboom\.com\/#?(\w{8})/, //corrmatch
				null, //corrreplwhat
				null, //corrreplwith
				null, //separator
				null, //api url
				null, //postdata
				null, //linkregex
				null, //liveregex
				null, //deadregex
				null, //unavaregex
				oboomBulk //function delegate
			)				
		}
		
		function genBulkCheck()
		{
			var blockIdx = this.links.length;
			
			while (blockIdx--)
			{
				postRequest(this.apiUrl, this.postData, this.links[blockIdx], 
					this.resLinkRegex, this.resLiveRegex, this.resDeadRegex, this.resUnavaRegex, this.separator);			
				
			}
			
			function postRequest(api, postData, links, linkRegex, liveRegex, deadRegex, unavaRegex, sep)
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
						
						//console.log(res);
						
						if ((res.contains(">DDoS protection by CloudFlare") && res.contains(">Checking your browser before accessing<")) || res.contains('<iframe src="/_Incapsula_Resource?')) {
							DisplayTheCheckedLinks(links.split(sep), 'unknown_link', 'Captcha required to check links');
							sendMessage('Some links require you to fill out a captcha! Please open them manually.')
						}
						
						var i;

						var livelinks = res.match(liveRegex);
						var deadlinks = res.match(deadRegex);
						
						//console.log(livelinks);
						//console.log(deadlinks);
						
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
							var unavalinks = res.match(unavaRegex)
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
					},
					onerror: function (e) {
						var linkArr = links.split(sep);
						DisplayTheCheckedLinks(linkArr, "unknown_link");
					}
				});
				
			}
		}
		
		//specialized bulkchecking handlers follow
		function oboomBulk() {
			var a = [], b = [], c = [];
			var array = this.links;

			GM_xmlhttpRequest({
				method: 'GET',
				url: 'https://www.oboom.com/1/guestsession',
				headers: {
					'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
					'Content-type': 'application/x-www-form-urlencoded',
					'Referer': 'https://www.oboom.com',
					'X-Requested-With': 'XMLHttpRequest'						
				},
				onload: function(result) {
					var blockIdx = array.length;
					var token = JSON.parse(result.responseText)[1];
					while (blockIdx--) {
						startCheck(array[blockIdx].split('\r\n'), token);
					}
				}
			});

			function startCheck(links, token) {
				GM_xmlhttpRequest({
						method: 'POST',
						url: "https://api.oboom.com/1/info",
						headers: {
							'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
							'Content-type': 'application/x-www-form-urlencoded',
							'Referer': 'https://www.oboom.com/',
							'X-Requested-With': 'XMLHttpRequest'						
						},
						data: "token=" + token + "&items=" + links.join(","),
						onload: function(result) {
							var res = JSON.parse(result.responseText)[1];
							var i = res.length, s;

							while (i--) {
								s = res[i].state;
								if (s == 'online') a.push(res[i].id);
								else if (s == 'blocked' || s == 'abused' || s == 'lost' || s == 'not_found') b.push(res[i].id);
								else c.push(res[i].id);
							}

							if (a.length > 0) DisplayTheCheckedLinks(a, 'alive_link');
							if (b.length > 0) DisplayTheCheckedLinks(b, 'adead_link');
							if (c.length > 0) DisplayTheCheckedLinks(c, 'unknown_link');
						}
					});
			}
		}

		function upleaBC() {
			var json = {
				links: this.links[0].split('\r\n')
			};

			GM_xmlhttpRequest({
				method: 'POST',
				url: this.apiUrl,
				data: 'json=' + JSON.stringify(json),
				headers: {
					'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
					'Content-type': 'application/x-www-form-urlencoded',
					'Referer': 'http://uplea.com/checker',
					'X-Requested-With': 'XMLHttpRequest'						
				},
				onload: function(result) {
					var res = JSON.parse(result.responseText);
					if (res.error.length > 0) {
						var mes = 'Error in checking Uplea.com! Error message(s):';
						$.each(res.error, function(key, val) { mes += '\r\n' + val; });
						console.warn(mes); return;
					}

					var deadlinks = [], alivelinks = [], unavalinks = [];
					$.each(res.result, function(key, val) {
						if (val.status == 'OK') alivelinks.push(val.link);
						else if (val.status == 'DELETED') deadlinks.push(val.link);
						else unknownlinks.push(val.link);
					});

					if (deadlinks.length > 0) DisplayTheCheckedLinks(deadlinks, 'adead_link');
					if (alivelinks.length > 0) DisplayTheCheckedLinks(alivelinks, 'alive_link');
					if (unknownlinks.length > 0) DisplayTheCheckedLinks(unavalinks, 'unknown_link');
				}
			});
		}

		function rapiduBulkCheck() {
			var arr = this.links[0].split('\r\n').join(',');
			GM_xmlhttpRequest({
				method: 'POST',
				url: this.apiUrl,
				data: this.postData + arr,
				headers: {
					'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
					'Content-type': 'application/x-www-form-urlencoded',
					'Referer': 'http://rapidu.net',
					'X-Requested-With': 'XMLHttpRequest'						
				},
				onload: function(result) {
					var res = JSON.parse(result.responseText);
					var deadlinks = [], alivelinks = [];
					$.each(res, function(key, value) {
						if (value.fileStatus && value.fileStatus == 1) {
							alivelinks.push(value.fileId);
						} else if (value.fileStatus && value.fileStatus == 0) {
							deadlinks.push(value.fileId);
						}
					});

					if (deadlinks.length > 0) DisplayTheCheckedLinks(deadlinks, 'adead_link');
					if (alivelinks.length > 0) DisplayTheCheckedLinks(alivelinks, 'alive_link');
				}
			});
		}

		function webshareBulkCheck()
		{
			var arr = this.links[0].split('\r\n');
			var i = arr.length;

			while(i--)
			{	
				postRequest(arr[i]);				
			}

			function postRequest(wsLink) {
				var id = wsLink.match(/webshare\.cz\/(?:(?:#\/)?file\/)?(\w+)/)[1];
				
				GM_xmlhttpRequest({
					method: 'POST',
					url: "http://webshare.cz/api/file_info/",
					headers: {
						'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
						'Content-type': 'application/x-www-form-urlencoded',
						'Referer': "",
					},
					data: "wst=&ident=" + id,
					onload: function (result) {
						var res = result.responseText;
				
						if (res.contains(/<name>.+?<\/name>/))
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
		
		function anysendBulkCheck() {
			var arr = this.links[0].split('\r\n');
			var blockIdx = arr.length;
			while (blockIdx--) {
				stepOne(arr[blockIdx]);
			}
			
			function stepOne(link) {
				GM_xmlhttpRequest({
					method: 'GET',
					url: link,
					headers: {
						'Referer': 'http://anysend.com'
					},
					onload: function(result) {
						if (result.responseText.contains('<title>Removed download \\| AnySend</title>')) {
							displayTheCheckedLink($('a:contains("' + link.match(/anysend\.com\/\w+/)[0] + '")')[0], 'adead_link');
							return;
						}
						stepTwo(result.responseText.match(/f\.src="(http:\/\/download\.anysend\.com\/download\/download\.php\?key=\w{32}(?:&aff=\w+)?&visid=)"/)[1], link);
					}
				});
			}
			
			function stepTwo(link, origLink) {
				GM_xmlhttpRequest({
					method: 'GET',
					url: 'http://affiliates.anysend.com/scripts/track.php?accountId=default1&tracking=1&url=H_anysend.com%2F%2F' + origLink.match(/\.com\/(\w{32})/[1]) + '&referer=&getParams=&anchor=&isInIframe=false&cookies=',
					headers: {
						'Referer': origLink
					},
					onload: function(result) {
						var stuff = result.responseText.match(/setVisitor\('(\w+)'\)/);
						var visid = stuff ? stuff[1] : "";
						stepThree(link, visid, origLink);
					}
				});
			}
			
			function stepThree(link, visid, origLink) {
				link += visid;
				$('a:contains("' + origLink.match(/anysend\.com\/\w+/)[0] + '")').attr('name', link);
				GM_xmlhttpRequest({
					method: 'GET',
					url: link,
					headers: {
						'Referer': origLink,
						'Cookie': 'PAPVisitorId=' + visid
					},
					onload: function(result) {
						decideStatus(result.responseText, origLink);
					}
				})
			}
			
			function decideStatus(res, origLink) {
				if (res.contains('<div class="dl-file-des|<a href="javascript:void(0);" onclick="showDownloadPopupT12')) {
					displayTheCheckedLink($('a:contains("' + origLink.match(/anysend\.com\/\w+/)[0] + '")')[0], 'alive_link');
				} else if (res.contains('>Your download is no longer available')) {
					displayTheCheckedLink($('a:contains("' + origLink.match(/anysend\.com\/\w+/)[0] + '")')[0], 'adead_link');
				} else {
					displayTheCheckedLink($('a:contains("' + origLink.match(/anysend\.com\/\w+/)[0] + '")')[0], 'unknown_link', 'Unable to detect links status from response HTML');
				}
			}
		}
		
		function filecloudBulkCheck() {
			var arr = this.links[0].split(this.separator);
			var blockIdx = arr.length;
			while (blockIdx--) {
				check(arr[blockIdx]);
			}
			
			function check(ukey) {
				GM_xmlhttpRequest({
					method: 'POST',
					url: 'http://api.filecloud.io/api-check_file.api',
					headers: {
						'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
						'Content-type': 'application/x-www-form-urlencoded',
						'Referer': 'http://filecloud.io',
						'X-Requested-With': 'XMLHttpRequest'						
					},
					data: 'ukey=' + encodeURIComponent(ukey),
					onload: function(result) {
						var res = JSON.parse(result.responseText);
						if (res.status == 'ok' && res.message == 'fetched') {
							DisplayTheCheckedLinks([ukey], 'alive_link');
						} else if (res.status == 'error' && res.message == 'no such file') {
							DisplayTheCheckedLinks([ukey], 'adead_link');
						} else DisplayTheCheckedLinks([ukey], 'unknown_link');
					},
					onerror: function() {
						DisplayTheCheckedLinks([ukey], 'unknown_link');
					}
				});
			}
		}
		
		function gettBulkCheck() {
			var arr = this.links[0].split("\r\n");
			var i = arr.length;
			var params, sharename, fileid;
			while (i--) {
				params = arr[i].match(/(\w+)(?:\/v\/(\d+))?/);
				sharename = params[1], fileid = params[2] ? params[2] : 0;   
				GM_xmlhttpRequest({
					method:"GET",
					url: this.apiUrl + sharename + "/" + fileid,
					headers: {
						'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
						'Content-type': 'application/x-www-form-urlencoded',
						'Referer': this.apiUrl,
						'X-Requested-With': 'XMLHttpRequest'
					},
					onload: function(result) {
						var res = JSON.parse(result.responseText);
						if (res.readystate == "uploaded") {
							DisplayTheCheckedLinks([res.sharename], 'alive_link');
						} else if (res.readystate == "removed") {
							DisplayTheCheckedLinks([res.sharename], 'adead_link');
						} else {
							DisplayTheCheckedLinks([res.sharename], 'unknown_link');
						}
					}	
				});
			}
		}
		
		function uploadingBulkCheck()
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

						var i;

						var livelinks = res.match(liveRegex);
						var deadlinks = res.match(deadRegex);
						var allLinks = links.split("\r\n");
						for(i=0;i<allLinks.length;i++) {
							allLinks[i] = allLinks[i].match(/uploading\.com\/(?:files\/|\w+\/\?get=)?(\w+)/)[1];
						}
						
						if (livelinks != null)
						{
							i = livelinks.length - 1;
							do
							{
								livelinks[i] = livelinks[i].match(linkRegex)[1].toLowerCase();
								livelinks.push(livelinks[i].toUpperCase());
								allLinks.splice($.inArray(livelinks[i], allLinks), 1);
							}
							while (i--);
							DisplayTheCheckedLinks(livelinks, 'alive_link');
						}

						if (deadlinks != null)
						{
							i = deadlinks.length - 1;
							do
							{
								deadlinks[i] = deadlinks[i].match(linkRegex)[1].toLowerCase();
								deadlinks.push(deadlinks[i].toUpperCase());
								allLinks.splice($.inArray(deadlinks[i], allLinks), 1);
							}
							while (i--);
							DisplayTheCheckedLinks(deadlinks, 'adead_link');
						}
						
						if (allLinks.length > 0)
						{
							i = allLinks.length - 1;
							do
							{
								websiteCheck(allLinks[i]);
							}
							while (i--);
						}
					}
				});
				
			}
			
			function websiteCheck(link) {
				var realLink = "http://uploading.com/files/" + link;
				GM_xmlhttpRequest({
					method: 'GET',
					url: realLink,
					headers: {
						'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
						'Content-type': 'application/x-www-form-urlencoded',
						'Referer': realLink,
						'X-Requested-With': 'XMLHttpRequest'						
					},
					onload: function (result) {
						if (result.status == 503) websiteCheck(link);
						res = result.responseText;
						if (res.contains('file_error">|error_404">')) {
							DisplayTheCheckedLinks([link], 'adead_link');
						}
						else if (res.contains('free_method">')) {
							DisplayTheCheckedLinks([link], 'alive_link');
						}
					}
				});
			}
		}
		
		function dateiToBulk()
		{
			var arr = this.links[0].split("\r\n");
			var data = "key=YYMHGBR9SFQA0ZWA&info=STATUS&datei=";
			var i = arr.length;
			
			while(i--)
			{
				var token = arr[i].match(/\.to\/(?:datei\/|files\/|1,|\?)(\w+)/)[1];
				postRequest(token);
			}
			
			function postRequest(token) {
				data += token;
				GM_xmlhttpRequest({
					method:"POST",
					url:"http://api.datei.to/",
					data:data,
					headers: {
						'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
						'Content-type': 'application/x-www-form-urlencoded',
						'Referer': ""
					},
					onload: function(result) {
						var res = result.responseText;
						if (res.contains('offline')) {
							DisplayTheCheckedLinks([token],'adead_link');
						}
						else if (res.contains('online')) {
							DisplayTheCheckedLinks([token], 'alive_link');
						}
					}
				});
			}
		}
		
/*		function uploadedBulkCheck()
		{
			var t = this.links.length;
			while (t--) {
				var arr = this.links[t].split("\r\n");
				var data = "apikey=lhF2IeeprweDfu9ccWlxXVVypA5nA3EL";
			
				for (var i=0;i<arr.length;i++)
				{
					try {
						arr[i] = arr[i].match(/(?:uploaded|ul)\.(?:to|net)\/(?:files?|\?(?:lang=\w{2}&)?id=|f\/|folder)?\/*(?!img\/|coupon\/)(\w{8})/)[1];
					} catch (e) {
						console.warn("Error in checking Uploaded: " + arr[i]);
						DisplayTheCheckedLinks([arr[i]], "unknown_link");
					}
					data += "&id_"+i+"="+arr[i]; 
				}
			
				GM_xmlhttpRequest(
					{
						method: "POST",
						url: "https://uploaded.net/api/filemultiple",
						data: data,
						headers: {
							'User-agent': 'Mozilla/4.0 [en] (Windows NT 6.0; U)',
							'Content-type': 'application/x-www-form-urlencoded',
							'Referer': ""
						},
						onload: function (result)
						{
							var res = result.responseText;

							var i;
						
							var livelinks = res.match(/online,\w+,/g);
							var deadlinks = res.match(/offline,\w+,/g);
						
							if (livelinks)
							{
								var i = livelinks.length - 1;
								do
								{
									livelinks[i] = livelinks[i].match(/,(\w+),/)[1];
								}
								while (i--);
								DisplayTheCheckedLinks(livelinks, 'alive_link');
							}
						
							if (deadlinks)
							{
								var i = deadlinks.length - 1;
								do
								{
									deadlinks[i] = deadlinks[i].match(/,(\w+),/)[1];
								}
								while (i--);
								DisplayTheCheckedLinks(deadlinks, 'adead_link');
							}
						}
					});
			}
		}
*/		
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
				var id = megaLink.match(/mega\.(?:co\.)?nz\/#!(\w+)(?:!\w+)?/)[1];

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
						
						if ((typeof res == "number" && (res == -9 || res == -16 || res == -6)) || res.d) {
							DisplayTheCheckedLinks([id], 'adead_link');
						} else if (res.e == "ETEMPUNAVAIL") {
							DisplayTheCheckedLinks([id], 'unava_link');
						} else if (res.at) {
							DisplayTheCheckedLinks([id], 'alive_link');
						} else {
							console.warn("Error in checking Mega.co.nz! Please notify devs.\r\nError code: " + result.responseText);
						}
					}
				});
			}
		}
		
		
		function netloadBulkCheck()
		{
			var blockIdx = this.links.length;

			while (blockIdx--)
			{
				postRequest(this.apiUrl, this.postData, this.links[blockIdx], 
					this.resLinkRegex, this.resLiveRegex, this.resDeadRegex, this.unavaRegex);			
				
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
						'Referer': ""						
					},
					data: postData + encodeURIComponent(links),
					onload: function (result)
					{
						var res = result.responseText;
						
						//console.log(res);
						
						if (res.contains('<title>403 - Forbidden</title>')){
							postRequest(api, postData, links, linkRegex, liveRegex, deadRegex, unavaRegex);
						}
						
						var i;

						var livelinks = res.match(liveRegex);
						var deadlinks = res.match(deadRegex);
						
						//console.log(livelinks);
						//console.log(deadlinks);
						
						if (livelinks != null)
						{
							i = livelinks.length - 1;
							do
							{
								recheckLink(livelinks[i].match(linkRegex)[1]);
								//livelinks[i] = livelinks[i].match(linkRegex)[1];
							}
							while(i--);
							//DisplayTheCheckedLinks(livelinks, "alive_link");
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
					}
				});				
			}
			
			function recheckLink(link)
			{
				var link = link;
				
				GM_xmlhttpRequest(
				{
					method: 'GET',
					url: 'http://netload.in/datei' + link + '.htm',
					headers: {
						'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
						'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
						'Accept-Charset': 'windows-1250,utf-8;q=0.7,*;q=0.7',
						'Referer': ""
					},
					onload: function (result)
					{
						var res = result.responseText;

						if (res.contains('dl_first_file_download">|download_limit.gif'))
						{
							DisplayTheCheckedLinks([link], 'alive_link');
							return;
						}

						if (res.contains('achtung.jpg"'))
						{
							DisplayTheCheckedLinks([link], 'adead_link');
						}
					},
					onerror: function ()
					{
						displayTheCheckedLink(link, 'unava_link');
					}
				});
			}
		}

		function depositfilesBulkCheck()
		{
			var arr = this.links[0].split("\r\n");
			var i = arr.length;
			
			while(i--)
			{	
				postRequest(arr[i]);				
			}
			
			function postRequest(dfLink)
			{		
				var id = dfLink.match(/(?:depositfiles\.(?:com|lt|org)|dfiles\.(?:eu|ru))\/(?:en\/|ru\/|de\/|es\/|pt\/|)files\/(\w+)/)[1];

				GM_xmlhttpRequest(
				{
					method: "POST",
					url: 'http://depositfiles.com/api/get_download_info.php?id=' + id + "&format=json",
					headers: {
						'User-agent': 'Mozilla/4.0 (compatible) Greasemonkey',
						'Content-Type': 'application/x-www-form-urlencoded',
						'Referer': ""
					},
					onload: function (result)
					{
						var res = result.responseText;
						//console.log(res);
						
						if (res == "") {
							postRequest(dfLink);
						}
						
						if (res.contains('no_file'))
						{
							DisplayTheCheckedLinks(["files/" + id], 'adead_link');
							return;
						}
						
						if (res.contains('file_ban')) {
							DisplayTheCheckedLinks(["files/" + id], 'unknown_link');
							return;
						}

						if (res.contains(/download_li(?:nk|mit)|password_check|file_storage/))
						{
							DisplayTheCheckedLinks(["files/" + id], 'alive_link');
						}
					}
				});
			}
		}
	}

	function initFileHosts()
	{
		var aOHCount = "1";
		function addObsoleteHost(hostName, linkRegex)
		{
			hostName = hostName.split("|");
			var i = hostName.length;
			
			var hostID = "OH" + aOHCount;
			
			while(i--) {
				var filehost = gimmeHostName(hostName[i]).replace(/\./g, "_dot_").replace(/\-/g, "_dash_");
				if (!hostsIDs[filehost]) {
					hostsIDs[filehost] = [];
				}
				hostsIDs[filehost].push({
					hostID: hostID,
					linkRegex: linkRegex,
				});
			}
			
			var OHObj = {
				links: []
			}
			
			hostsCheck[hostID] = OHObj;
			aOHCount++;	
		}

		//obsolete file hosts init start
		if (hostSet("Obsolete_file_hosts", false))
		{
			addObsoleteHost("superfastfile.com", "superfastfile\\.com\/\\w+");
			addObsoleteHost("uploadlab.com", "files\\.uploadlab\\.com\/\\w+");
			addObsoleteHost("zupload.com", "z\\d+\\.zupload\\.com\/\\w+");
			addObsoleteHost("enterupload.com|flyupload.com", "(?:flyupload\\.)?(?:enterupload|flyupload)\\.com\/");
			addObsoleteHost("filesdump.com", "(?:s\\d+\\.|)filesdump\\.com\/file\/\\w+");
			addObsoleteHost("speedie-host.com", "uploads\\.speedie\\-host\\.com\/\\w+");
			addObsoleteHost("turboupload.com", "(?:d\\.|)turboupload\\.com\/\\w+");
			addObsoleteHost("share2u.net", "dl\\.share2u\\.net\/\\w+");
			addObsoleteHost("filestock.net|filestock.ru", "(?:download\\.)?filestock\\.(?:net|ru)\/\\w+");
			addObsoleteHost("ex.ua", "(?:fs\\d{1,2}\\.)?(?:www\\.|)ex\\.ua\/\\w+");
			addObsoleteHost("omxira.com", "(?:get\\.|)omxira\\.com\/\\w+");
			addObsoleteHost("uploadtornado.com", "(?:\\w{2}\\.)uploadtornado\\.com\/\\w+");
			addObsoleteHost("bgdox.com", "(?:turbo\\.)?bgdox\\.com\/\\w+");
			addObsoleteHost("fshare.eu", "www\\d?\\.fshare\\.eu\/\\w+");
			
			var i = allObsoleteNames.length;
			while(i--)
			{
				addObsoleteHost(
					allObsoleteNames[i],
					"https?:\/\/(?:[a-zA-Z0-9-]+\\.)?(?:" + allObsoleteNames[i].replace(/\./g, "\\.").replace(/\-/g, "\\-") + ")\/"
				);
				
			}
		}
		//obsolete file hosts init end
		var aFHCount = 1;
		function addFileHost(hostName, linkRegex, isAliveRegex, isDeadRegex, isUnavaRegex, tryLoop)
		{
			hostName = hostName.split("|");
			var i = hostName.length;
			
			var hostID = "WC" + aFHCount;
			
			while(i--) {
				var filehost = hostName[i].replace(/\./g, "_dot_").replace(/\-/g, "_dash_");

				if (!hostsIDs[filehost]) {
					hostsIDs[filehost] = [];
				}
				hostsIDs[filehost].push({
					hostID: hostID,
					linkRegex: linkRegex,
				});
			}
			
			var WCObj = {
				liveRegex: isAliveRegex,
				deadRegex: isDeadRegex,
				unavaRegex: isUnavaRegex,
				tryLoop: false,
				links: []
			}
			
			if (tryLoop) WCObj.tryLoop = true;
			
			hostsCheck[hostID] = WCObj;
			aFHCount++;
		}
		
		var genericWC = [	"filesbowl.com", "freakbit.net", "upfile.vn", "upbooth.com", "fileshareup.com", "rabidfiles.com", "host4files.com",
							"weshare.me", "thefilebay.com"];
							
		var XFSPWC = 	[ 	"fileplanet.com.ua|fileplaneta.com", "xvidstage.com", "midupload.com", "share.az",
							"interfile.net", "medofire.com", "downloadani.me", "uptobox.com", "uppit.com", "filenuke.com",
							"filecore.co.nz", "1000shared.com", "tusfiles.net|tusfiles.com", "lafiles.com"];

		var genThird =	[	"jumbofiles.org|jumbofilebox.com", "10shared.com", "4bigbox.com", "skyfilebox.com"]
		
		var gWC = genericWC.length;
		while(gWC--) {
			if (hostSet("Check_" + genericWC[gWC].replace(/\./g, "_dot_").replace(/\-/g, "_dash_") + "_links", false))
			{
				addFileHost(
					genericWC[gWC],	
					genericWC[gWC].replace(/\./g, "\\.").replace(/\-/g, "\\-") + "\/\\w+",
					/<div class="(?:download|captcha)PageTable"|<a class="link btn-free"|download-timer|<span id="loadingSpinner">/,
					/<li>File (?:has been removed|not found)|<div id="uploaderContainer"/,
					'optional--'
				);
			}
		}
		
		var xWC = XFSPWC.length;
		while (xWC--) {
			if (hostSet("Check_" + XFSPWC[xWC].match(/[\w\.\-]+/)[0].replace(/\./g, "_dot_").replace(/\-/g, "_dash_") + "_links", false))
			{
				addFileHost(
				XFSPWC[xWC],	
				"(?:" + XFSPWC[xWC].replace(/\./g, "\\.").replace(/\-/g, "\\-") + ")\/\\w+",
				'name="method_free"|id="btn_download"|value="Free Download"',
				/>(?:File not found|The file was removed by administrator|Datei nicht gefunden|No such file|The file you are trying to download is no longer available)\s*<|<div id="div_file" class="upload_block">/i,
				'>This server is in maintenance mode|<img src="/images/under.gif"',
				true);
			}
		}

		var tWC = genThird.length;
		while (tWC--) {
			if (hostSet("Check_" + genThird[tWC].match(/[\w\.\-]+/)[0].replace(/\./g, "_dot_").replace(/\-/g, "_dash_") + "_links", false))
		{
			addFileHost(
			genThird[tWC],	
			"(?:" + genThird[tWC].replace(/\./g, "\\.").replace(/\-/g, "\\-") + ")\/newfile\\?n=\\w+",
			'<div class="downloadfree">',
			'div_file"',
			'optional--'
			);
		}
		}

		if (hostSet("Check_megafileupload_dot_com_links", false))
		{
			addFileHost(
			"megafileupload.com",
			"megafileupload\.com\/..\/file\/",
			'downloadbtn',
			'is not found',
			'optional--');
		}

		if (hostSet("Check_safelinking_dot_net_links", false))
		{
			addFileHost(
			'safelinking.net',	
			"safelinking\\.net\/p\/\\w{10}",
			'color:green;"',
			'color:red;"|<p>This link does not exist.',
			'optional--',
			true);
		}

		if (hostSet("Check_ultramegabit_dot_com_links", false))
		{
			addFileHost(
			"ultramegabit.com",
			"ultramegabit\\.com\/file\/details\/[\\w+-]",
			'>Your download is ready<|>Premium members only<',
			/>File (?:not found|restricted|has been deleted(?:\.| in compliance with the DMCA))<|\/folder\/add/,
			'btn-large btn-danger">|Account limitation notice|>File not available.<|>This download server is overloaded<|502 Bad Gateway',
			true);
		}
		
		if (hostSet("Check_fastshare_dot_cz_links", false))
		{
			addFileHost(
			"fastshare.cz",
			"fastshare\\.cz\/\\d+\/\\w*",
			'dwntable">',
			'nebyla nalezena|nebola nÃƒÂ¡jdenÃƒÂ¡|nie zostaÃ…â€ša odnaleziona|color:red;font-weight:bold;border-style:dashed|<b>Requested page not found.',
			'optional--');
		}
		
		if (hostSet("Check_fastshare_dot_org_links", false))
		{
			addFileHost(
			"fastshare.org|FastShare.org",
			"[fF]ast[sS]hare\\.org\/download",
			'Download ">',
			'Diese Datei wurde wegen|wurde kein Dateiname',
			'optional--');
		}

		if (hostSet("Check_1fichier_dot_com_links", false))
		{
			addFileHost(
			"1fichier.com|dl4free.com",
				"(?:1fichier|dl4free)\\.com\/",
			'Download tag"|countdown">|class="form-button"|<input type="submit" value="Download" class="ok" />|<title>Download</title>|form-button" name="submit|ok btn-general btn-orange"',
			'errorDiv"|File not found|Fichier introuvable|margin:auto;padding-bottom:20px">|Select files to send',
			'optional--');
		} 

		if (hostSet("Check_relink_dot_us_links", false))
		{
			addFileHost(
			"relink.us",
			"relink\\.us\/(?:f\/\\w+|go\\.php\\?id=\\d+|view\\.php\\?id=\\d+)",
			'online_detail.png" alt="Status',
			/(?:offline|partially)_detail\.png" alt="Status|File deleted/,
			'unknown_detail.png" alt="Status'
			);
		}
		
		if (hostSet("Check_flyfiles_dot_net_links", false))
		{
			addFileHost(
			"flyfiles.net",
			"flyfiles\\.net\/\\w+",
			'download_button"|"Download file"',
			'File not found!|ÃÂ¤ÃÂ°ÃÂ¹ÃÂ» ÃÂ½ÃÂµ ÃÂ½ÃÂ°ÃÂ¹ÃÂ´ÃÂµÃÂ½',
			'optional--'
			);
		}
		
		if (hostSet("Check_wikiupload_dot_com_links", false))
		{
			addFileHost(
			"wikiupload.com",
			"wikiupload\\.com\/\\w+",
			'download-button">',
			'Sorry, File not found|theme-container">',
			'optional--'
			);
		}
		
		if (hostSet("Check_hostuje_dot_net_links", false))
		{
			addFileHost(
			"hostuje.net",	
			"hostuje\\.net\/file\\.php\\?id=\\w+",
			'file.php">|Pobierz Plik',
			'Podany plik zosta. skasowany z powodu naruszania praw autorskich...|Podany plik nie zosta. odnaleziony...',
			'optional--'
			);
		}

		if (hostSet("Check_tufiles_dot_ru_links", false))
		{
			addFileHost(
			"tufiles.ru|turbob1t.ru|filesmail.ru|failookmenik.ru|firebit.in|dlbit.net|china-gsm.ru|3aka4aem.ru|turbo-bit.ru|turbosfiles.ru|piratski.ru|mnogofiles.com|links-free.ru",	
			"(?:tufiles|turbob1t|failoobmenik|filesmail|firebit|dlbit|files\\.china\\-gsm|3aka4aem|file\\.piratski|mnogofiles|links-free|turbo-bit|turbosfiles)\\.\\w+\/\\w+",
			'download-file">',
			/col-1">\s*<h1>/,
			'optional--'
			);
		}

		if (hostSet("Check_data_dot_hu_links", false))
		{
			addFileHost(
			"data.hu",	
			"data\\.hu\/get\/\\d+\/",
			'download_box_button',
			'missing.php',
			'optional--',
			true
			);
		}
		
		if (hostSet("Check_filesmelt_dot_com_links", false))
		{
			addFileHost(
			"filesmelt.com",	
			"filesmelt\\.com\/dl\/\\w+",
			'ready">',
			'Sorry, but your',
			'optional--'
			);
		}
		
		if (hostSet("Check_files_dot_indowebster_dot_com_links", false))
		{
			addFileHost(
			"indowebster.com",	
			"files\\.indowebster\\.com\/download\/\\w+\/",
			'premiumBtn"',
			'errorMessage"',
			'optional--'
			);
		}
		
		if (hostSet("Check_superload_dot_cz_links", false))
		{
			addFileHost(
			"superload.cz",	
			"superload\\.cz\/dl\/\\w+",
			'icon-download">',
			'soubor nebyl nalezen',
			'optional--'
			);
		}
		
		if (hostSet("Check_easybytez_dot_com_links", false))
		{
			addFileHost(
			"easybytez.com",	
			"easybytez\\.com\/\\w+",
			'op" value="download',
			'/stop_error.gif|#FF0000"><h3>Download not available',
			'optional--'
			);
		}
		
		if (hostSet("Check_filestore_dot_com_dot_ua_links", false))
		{
			addFileHost(
			"filestore.com",	
			"filestore\\.com\\.ua\/\\?d=\\w+",
			'tdrow1>',
			'class=warn',
			'optional--'
			);
		}
		
		if (hostSet("Check_netkups_dot_com_links", false))
		{
			addFileHost(
			"netkups.com",	
			"netkups\\.com\/\\?d=\\w+",
			'<form method="post"',
			'<div align="center">|>File not found',
			'optional--'
			);
		}

		if (hostSet("Check_extmatrix_dot_com_links", false))
		{
			addFileHost(
			"extmatrix.com",	
			"extmatrix\\.com\/files\/\\w+",
			'div class="success"',
			'div class="error"',
			'optional--'
			);
		}
		
		if (hostSet("Check_sendfiles_dot_nl_links", false))
		{
			addFileHost(
			"sendfiles.nl",	
			"sendfiles\\.nl\/download.aspx\\?ID=\\w+",
			'content_lnkDownload',
			'error.aspx?',
			'optional--'
			);
		}
		
		if (hostSet("Check_sockshare_dot_com_links", false))
		{
			addFileHost(
			"sockshare.com",	
			"sockshare\\.com\/file\/\\w+",
			'choose_speed">',
			'message t_0\'>|Welcome to SockShare</h1>',
			'optional--'
			);
		}
		
		if (hostSet("Check_yourfilestore_dot_com_links", false))
		{
			addFileHost(
			"yourfilestore.com",	
			"yourfilestore\\.com\/download\/\\d+\/",
			'download_data">',
			'may have been deleted|<h1>Sorry!</h1>',
			'optional--'
			);
		}
		
		if (hostSet("Check_nekaka_dot_com_links", false))
		{
			addFileHost(
			"nekaka.com",	
			"nekaka\\.com\/d\/[\\w-]+",
			'<b>Please Wait <span id="waittime">',
			/invalid file link|<p>\s*File has been blocked|>File does not exist</,
			'optional--'
			);
		}
		
		if (hostSet("Check_filebig_dot_net_links", false))
		{
			addFileHost(
			"filebig.net",	
			"filebig\\.net\/files\/\\w+",
			'downloadFile">',
			'<p>File not found</p>',
			'optional--'
			);
		}

		if (hostSet("Check_filefront_dot_com_links", false))
		{
			addFileHost(
			"filefront.com|gamefront.com",	
			"(?:files\\.|\\w+\\.|)(?:file|game)front\\.com\/\\w+",
			'downloadLink">|class="downloadNow"|<strong>Download',
			/File not found, you|(?:File|Page) Not Found/,
			'unavailable at the moment'
			);
		}
		
		if (hostSet("Check_free_dash_uploading_dot_com_links", false))
		{
			addFileHost(
			"free-uploading.com",	
			"free\\-uploading\\.com\/\\w+",
			'op" value="download',
			'class="err">|width:500px;text-align:left;">',
			'optional--'
			);
		}
		
		if (hostSet("Check_filesin_dot_com_links", false))
		{
			addFileHost(
			"filesin.com",	
			"filesin\\.com\/\\w+",
			'download_area">',
			'error_note">',
			'optional--',
			true
			);
		}
		
		if (hostSet("Check_nowdownload_dot_eu_links", false))
		{
			addFileHost(
			"nowdownload.eu|nowdownload.ch|nowdownload.co",	
			"nowdownload\\.(?:eu|ch|co)\/dl\/\\w+",
			'alert-success"',
			'This file does not exist!',
			'The file is being transfered'
			);
		}
		
		if (hostSet("Check_axifile_dot_com_links", false))
		{
			addFileHost(
			"axfile.com",	
			"axifile\\.com(?:\/\w(2))?\/\\??\\w+",
			'Dbutton_big"',
			'download-error.php',
			'optional--'
			);
		}
		
/*		if (hostSet("Check_asfile_dot_com_links", false))
		{
			addFileHost(
			"asfile.com",	
			"asfile\\.com\/file\/\\w+",
			'link_line">|id="download_button"',
			/Page not found|(?:deleted|is not exist|gelÃƒÂ¶scht)<\/strong>/,
			'optional--'
			);
		} */
		
		//do not use checkfiles.html bulk check, not working properly for all links
		if (hostSet("Check_hulkshare_dot_com_links", false))
		{
			addFileHost(
			"hulkshare.com|hu.lk",	
			"(?:hulkshare\\.com|hu\\.lk)\/\\w+",
			'download.sam.png|bigDownloadBtn basicDownload|halfTop">',
			'File does not exist|fingerprint protected copyright|disabled for public access|File no longer available!|This is a private file',
			'optional--'
			);
		}
		
		if (hostSet("Check_movshare_dot_net_links", false))
		{
			addFileHost(
			"movshare.net",	
			"movshare\\.net\/\\w+",
			'videoPlayer"',
			'no longer exists',
			'optional--'
			);
		}
		
		if (hostSet("Check_mafiastorage_dot_com_links", false))
		{
			addFileHost(
			"mafiastorage.com",	
			"mafiastorage\\.com\/\\w+",
			'op" value="download',
			'class="err">|style="width:500px;text-align:left;"',
			'optional--'
			);
		}

		if (hostSet("Check_uploadspace_dot_pl_links", false))
		{
			addFileHost(
			"uploadspace.pl",	
			"uploadspace\.pl\/plik\\w+",
			/Downloading .+? \|/,
			'Downloading a file',
			'optional--'
			);
		}
		
		if (hostSet("Check_uploadingit_dot_com_links", false))
		{
			addFileHost(
			"uploadingit.com",	
			"uploadingit\\.com\/(?:file|d)\/\\w+",
			'downloadTitle">',
			'deleteContent">',
			'optional--'
			);
		}
		
		if (hostSet("Check_stiahni_dot_si_links", false))
		{
			addFileHost(
			"stiahni.si",	
			"stiahni\\.si\/(?:download\\.php\\?id=|file\/)\\w+",
			'button-download-symbol">|#downloadModal" onclick="download();">',
			'exclamation.png|The file not found">|file you are trying to download has been deleted',
			'optional--'
			);
		}

		if (hostSet("Check_rghost_dot_net_links", false))
		{
			addFileHost(
			"rghost.net|rghost.ru",	
			"rghost\.(?:net|ru)\/(?:|private\/)\\d+",
			'download_link|btn large download"',
			'file is restricted|File is deleted|503 Service Unavailable',
			'File was deleted'
			);
		}

		if (hostSet("Check_xdisk_dot_cz_links", false))
		{
			addFileHost(
			"xdisk.cz",	
			"xdisk\\.cz\/(?:..\/)?download\\.php\\?id=\\w+",
			/">StaÃ…Â¾eno:\\s*<\/span>/,
			'Soubor, kterÃƒÂ½ hledÃƒÂ¡te nenalezen',
			'optional--'
			);
		}

		if (hostSet("Check_vidxden_dot_com_links", false))
		{
			addFileHost(
			"vidxden.com|vidbux.com",	
			"(?:vidxden|vidbux)\.com\/\\w+",
			'Continue to Video"',
			'No such file',
			'optional--'
			);
		}

		if (hostSet("Check_daten_dash_hoster_dot_de_links", false))
		{
			addFileHost(
			"daten-hoster.de|filehosting.org|filehosting.at",	
			"(?:daten-hoster\\.de|filehosting\\.(?:org|at))\/file\/\\w+",
			'<table class="table table-bordered',
			'<div class="alert alert-error',
			'optional--'
			);
		}

		if (hostSet("Check_fileflyer_dot_com_links", false))
		{
			addFileHost(
			"fileflyer.com",	
			"fileflyer\.com\/view\/\\w+",
			'dwlbtn"',
			'error.gif"|link">Removed|removedlink">|lockedbtn">|unlockdiv">',
			'optional--'
			);
		}

		if (hostSet("Check_filestore_dot_to_links", false))
		{
			addFileHost(
			"filestore.to",	
			"filestore\.to\/\\?d=\\w+",
			'"downloading"',
			'Datei wurde nicht gefunden',
			'optional--'
			);
		}

		if (hostSet("Check_easy_dash_share_dot_com_links", false))
		{
			addFileHost(
			"crocko.com|easy-share.com",	
			"(?:w\\d*\.|)(?:crocko|easy-share)\\.com\/\\w+",
			'fz24">Download|td class="first">',
			'msg-err"|the page you\'re looking for|1>400 Bad Request<|No files in this folder|search_result">|<span class="status">Searching for file',
			'optional--'
			);
		}

		if (hostSet("Check_burnupload_dot_com_links", false))
		{
			addFileHost(
			"burnupload.com|ihiphop.com",	
			"burnupload\\.(?:com\/\\?d=|ihiphop\\.com\/download\\.php\\?id=)\\w+",
			'File size:',
			'file is not found',
			'optional--'
			);
		}

		if (hostSet("Check_yunfile_dot_com_links", false))
		{
			addFileHost(
			"yunfile.com|filemarkets.com|yfdisk.com",	
			"(?:\\w+\\.)?(?:yunfile|filemarkets|yfdisk)\\.com\/f(?:ile|s)\/\\w+",
			/<h2 class="title">.+?&nbsp;&nbsp;.+?<\/h2>/,
			/<h2 class="title">.+?&nbsp;&nbsp;<\/h2>|Been deleted|> Access denied/,
			'optional--'
			);
		}
		
		if (hostSet("Check_putlocker_dot_com_links", false))
		{
			addFileHost(
			"putlocker.com|firedrive.com",	
			"(?:putlocker|firedrive)\\.com\/file\/\\w+",
			'<a class="continue" onclick="$(\'#confirm_form\').submit();|id=\'external_download\' title=\'Download This File\'>Download</a>|class="external_download_button"> Download</a>|<div id=\'fd_dl_drpbtn\'>Download <i></i></div>|<button id="prepare_continue_btn"',
			'<title>File Does Not Exist|<div class="removed_file_image">|<div class="private_file_image">',
			'undergoing scheduled maintenance'
			);
		}
		
/*		if (hostSet("Check_luckyshare_dot_net_links", false))
		{
			addFileHost(
			"luckyshare.net",	
			"luckyshare\\.net\/\\d+",
			'class=\'file_name\'>',
			'no such file available',
			'optional--',
			true);
		} */
		
		if (hostSet("Check_uploadhero_dot_com_links", false))
		{
			addFileHost(
			"uploadhero.com|uploadhero.co",	
			"uploadhero\\.com?\/dl\/\\w+",
			'content-dl">',
			'men_file_lost.jpg"',
			'optional--'
			);
		}

		if (hostSet("Check_load_dot_to_links", false))
		{
			addFileHost(
			"load.to",	
			'(?:www\\.|\/)load\\.to\/(?:|\\?d\\=)\\w+',
			'"download_table_left">Size|<input class="input-button" type="submit" value="Download"',
			'Can\'t find file',
			'optional--'
			);
		}

		if (hostSet("Check_divshare_dot_com_links", false))
		{
			addFileHost(
			"divshare.com",	
			"divshare\\.com\/download\/",
			'download_new.png',
			'have been removed',
			'optional--'
			);
		}
		
		if (hostSet("Check_stahovadlo_dot_cz_links", false))
		{
			addFileHost(
			"stahovadlo.cz",	
			"stahovadlo\\.cz\/soubor\/\\d+\/[\\.\\w]+",
			'download" type="submit',
			'NeplatnÃƒÂ½ nebo neÃƒÂºplnÃƒÂ½ odkaz|Soubor jiÃ…Â¾ nenÃƒÂ­ dostupnÃƒÂ½',
			'optional--',
			true
			);
		}
		
		if (hostSet("Check_euroshare_dot_eu_links", false))
		{
			addFileHost(
			"euroshare.eu|euroshare.pl|euroshare.sk|euroshare.cz|euroshare.hu",	
			"euroshare\\.(?:eu|pl|sk|cz|hu)\/file\/\\d+",
			'nazev-souboru">',
			/<div id="obsah">\\s*<h1>/,
			'optional--'
			);
		}
		
		if (hostSet("Check_datafilehost_dot_com_links", false))
		{
			addFileHost(
			"datafilehost.com",	
			"datafilehost\\.com\/(?:download-\\w+\\.html|d\/\\w+)",
			'dldtable">',
			'does not exist.',
			'optional--'
			);
		}

		if (hostSet("Check_files_dot_mail_dot_ru_links", false))
		{
			addFileHost(
			"mail.ru",	
			'files\\.mail\\.ru/(?:\\w*)',
			'fileList',
			'errorMessage|error">',
			'optional--'
			);
		}

		if (hostSet("Check_narod_dot_ru_links", false))
		{
			addFileHost(
			"narod.ru|yandex.ru",	
			'narod\\.(?:yandex\\.|)ru\/disk\/',
			'<a id="b-submit"',
			'<p class="b-download-virus-note"|headCode">404<',
			'Ãâ€™ÃÂ½Ã‘Æ’Ã‘â€šÃ‘â‚¬ÃÂµÃÂ½ÃÂ½Ã‘ÂÃ‘Â ÃÂ¾Ã‘Ë†ÃÂ¸ÃÂ±ÃÂºÃÂ° Ã‘ÂÃÂµÃ‘â‚¬ÃÂ²ÃÂ¸Ã‘ÂÃÂ°'
			);
		}

		if (hostSet("Check_rayfile_dot_com_links", false))
		{
			addFileHost(
			"rayfile.com",	
			"rayfile\\.com\/",
			'FILEtitleTXT',
			'blueRow',
			'optional--'
			);
		}
		
		if (hostSet("Check_filesmonster_dot_com_links", false))
		{
			addFileHost(
			"filesmonster.com",	
			"filesmonster\\.com\/download\\.php\\?id=\\w+",
			'button_green_body"',
			'error">',
			'optional--'
			);
		}
		
		if (hostSet("Check_sendspace_dot_com_links", false))
		{
			addFileHost(
			"sendspace.com",	
			'sendspace\\.com\/file\/\\w+',
			'file_description',
			'msg error"',
			'optional--'
			);
		}
		
		if (hostSet("Check_sendspace_dot_pl_links", false))
		{
			addFileHost(
			"sendspace.pl",	
			'sendspace\\.pl\/file\/\\w+',
			'download_file"',
			'Podany plik nie',
			'optional--'
			);
		}

		if (hostSet("Check_gigasize_dot_com_links", false))
		{
			addFileHost(
			"gigasize.com",	
			'gigasize\\.com\/get(?:\\.php(?:\/[\\d-]+|\\?d=\\w+)|\/\\w+)',
			'fileId"',
			'error">',
			'optional--'
			);
		}
		
		if (hostSet("Check_2shared_dot_com_links", false))
		{
			addFileHost(
			"2shared.com",	
			'2shared\\.com\/(?:file|video|document)\/\\w*',
			'File size',
			/>\\s*var msg = 'VGhlIGZpbGUgbGluayB0aGF0IHlvdSByZ/,
			'optional--'
			);
		}
		
		if (hostSet("Check_gigapeta_dot_com_links", false))
		{
			addFileHost(
			"gigapeta.com",	
			'gigapeta\\.com\/dl\/',
			'Download file|ÃÂ¡ÃÂºÃÂ°Ã‘â€¡ÃÂ°Ã‘â€šÃ‘Å’ Ã‘â€žÃÂ°ÃÂ¹ÃÂ»| Herunterzuladen|Scarica il file|Cargar el fichero|Charger le fichier',
			'404|page_error',
			'optional--'
			);
		}
		
		if (hostSet("Check_veehd_dot_com_links", false))
		{
			addFileHost(
			"veehd.com",	
			'veehd\.com\/video\/.*?',
			'No sound|Download video',
			'Featured Videos',
			'optional--'
			);
		}

		if (hostSet("Check_fileswap_dot_com_links", false))
		{
			addFileHost(
			"fileswap.com",	
			'fileswap\\.com\/dl\/\\w+',
			'dlslowbutton"',
			'rounded_block_error">',
			'is temporary unavailable|disponible en estos momentos|vorlÃƒÂ¤ufig unerreichbar|ÃÂ¤ÃÂ°ÃÂ¹ÃÂ» ÃÂ²Ã‘â‚¬ÃÂµÃÂ¼ÃÂµÃÂ½ÃÂ½ÃÂ¾ ÃÂ½ÃÂµÃÂ´ÃÂ¾Ã‘ÂÃ‘â€šÃ‘Æ’ÃÂ¿ÃÂµÃÂ½'
			);
		}
		
		if (hostSet("Check_solidfiles_dot_com_links", false))
		{
			addFileHost(
			"solidfiles.com",	
			'solidfiles\\.com\/d\/\\w+',
			'<a id="download-button"',
			/>(?:Not found|\s*The file you are trying to download has been claimed)/,
			'optional--'
			);
		}
		
		if (hostSet("Check_uloz_dot_to_links", false))
		{		
			addFileHost(
			"uloz.to|ulozto.cz|bagruj.cz|zachowajto.pl",	
			"(?:uloz|ulozto|bagruj|zachowajto)\\.(to|cz|sk|net|pl)\/\\w",
			'fileDownload">|fileSize">|passwordProtectedFile">',
			'grayButton deletedFile">|StrÃƒÂ¡nka nenalezena|upload-button"|jako soukromÃƒÂ½.',
			'frmaskAgeForm-disagree',
			true
			);
		}
		
		if (hostSet("Check_leteckaposta_dot_cz_links", false))
		{
			addFileHost(
			"leteckaposta.cz|sharegadget.com",	
			"(?:leteckaposta\\.cz|sharegadget\\.com)\/\\d+",
			'<body onload="">',
			'neexistuje|not exist',
			'optional--'
			);
		}

		if (hostSet("Check_zippyshare_dot_com_links", false))
		{
			addFileHost(
			"zippyshare.com",	
			"(?:www\\d+\.|)zippyshare\.com\/(?:v\/\\d+\/file\.html|view\\.jsp\\?)",
			'download.png|Download Now|images/download_small.png|dlbutton"',
			'not exist',
			'optional--'
			);
		}

		if (hostSet("Check_speedshare_dot_org_links", false))
		{
			addFileHost(
			"speedshare.org",	
			"speedshare\.org\/.+",
			'id="downloadbtn"',
			'Error',
			'optional--'
			);
		}

		if (hostSet("Check_mediafire_dot_com_links", false))
		{
			addFileHost(
			"mediafire.com",	
			"mediafire\.com\/",
			'download_file_title"|<a class="btn alt download|<div class="filepreview|<div class="fileName">|id="PLAY_downloadButton',
			'class="error_msg_title">|>Sign Up! It\'s free|<label for="create-file-name">|<div id="privateTitle">This file is currently set to private.</div>',
			'optional--'
			);
		}

		if (hostSet("Check_ulozisko_dot_sk_links", false))
		{
			addFileHost(
			"ulozisko.sk",	
			"ulozisko\.sk\/",
			'Detaily',
			'neexistuje',
			'optional--'
			);
		}

		if (hostSet("Check_speedfile_dot_cz_links", false))
		{
			addFileHost(
			"speedfile.cz",	
			"speedfile\.cz\/(?:cs\/|en\/|sk\/|)\\d+\/",
			'StÃƒÂ¡hnout|<span>Download',
			'error|soubor byl odst|This file was deleted',
			'optional--'
			);
		}

		if (hostSet("Check_upnito_dot_sk_links", false))
		{
			addFileHost(
			"upnito.sk",	
			"(?:dl.\\.|)upnito\\.sk\/(download|subor|file)",
			'download.php',
			'notfound|upload-suborov.php"',
			'optional--'
			);
		}

		if (hostSet("Check_dataport_dot_cz_links", false))
		{
			addFileHost(
			"dataport.cz",	
			"dataport\.cz\/file\/",
			'premium_download">',
			'="error">',
			'optional--',
			true
			);
		}

		if (hostSet("Check_gigaup_dot_fr_links", false))
		{
			addFileHost(
			"gigaup.fr",	
			"gigaup\\.fr\/\\?g=\\w+",
			'Taille de',
			'Vous ne pouvez|existe pas',
			'optional--'
			);
		}
		
		if (hostSet("Check_myupload_dot_dk_links", false))
		{
			addFileHost(
			"myupload.dk",	
			"myupload\\.dk\/showfile\/\\w+",
			'<td class="downloadTblRight"><a class="downloadLink"',
			'<div id="flash_upload_progress"|<td class="downloadTblRight">File has been removed',
			'optional--'
			);
		}
		
		if (hostSet("Check_filebeam_dot_com_links", false))
		{
			addFileHost(
			"filebeam.com|fbe.am",	
			"(?:filebeam\\.com|fbe\\.am)\/\\w+",
			'<center>File Download Area</center>',
			'<center>Error:</center>',
			'optional--'
			);
		}
		
		if (hostSet("Check_upsto_dot_re_links", false))
		{
			addFileHost(
			"upsto.re|upstore.net",	
			"(?:upsto\\.re|upstore.net)\/\\w+",
			'<ul class="features minus">|Download files from folder',
			'<span class="error">',
			'optional--'
			);
		}
		
		if (hostSet("Check_adrive_dot_com_links", false))
		{
			addFileHost(
			"adrive.com",	
			"adrive\\.com\/public\/\\w+",
			'download should start',
			'no longer available publicly',
			'optional--'
			);
		}
		
		if (hostSet("Check_filebulk_dot_com_links", false))
		{
			addFileHost(
			"filebulk.com",	
			"filebulk\\.com\/\\w+",
			'<span id="countdown_str"',
			'File Not Available',
			'You can download files up to 100 Mb only.'
			);
		}
		
		if (hostSet("Check_rnbload_dot_com_links", false))
		{
			addFileHost(
			"rnbload.com",	
			"rnbload\\.com\/(file\/\\d+\/|download\\.php\\?id=)",
			'<div id="cubeDiv"',
			'Your requested file is not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_ukfilehost_dot_com_links", false))
		{
			addFileHost(
			"ukfilehost.com",	
			"ukfilehost\\.com\/files\/get\/\\w+",
			'optional--',
			'The file you have requested cannot be found',
			'optional--'
			);
		}
		
		if (hostSet("Check_zalil_dot_ru_links", false))
		{
			addFileHost(
			"zalil.ru",	
			"zalil\\.ru\/\\d+",
			'optional--',
			'ÃÂ¤ÃÂ°ÃÂ¹ÃÂ» ÃÂ½ÃÂµ ÃÂ½ÃÂ°ÃÂ¹ÃÂ´ÃÂµÃÂ½',
			'optional--'
			);
		}
		
		if (hostSet("Check_uploads_dot_bizhat_dot_com_links", false))
		{
			addFileHost(
			"bizhat.com",	
			"uploads\\.bizhat\\.com\/file\/\\d+",
			'div id="dl">',
			'File not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_mega_dash_myfile_dot_com_links", false))
		{
			addFileHost(
			"mega-myfile.com",	
			"mega\\-myfile\\.com\/file\/\\d+\/\\w+",
			'<b>File name:</b>',
			'Your requested file is not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_speedy_dash_share_dot_com_links", false))
		{
			addFileHost(
			"speedy-share.com",	
			"speedy\\-share\\.com\/\\w+",
			'File Download',
			'No such file',
			'optional--'
			);
		}
		
		if (hostSet("Check_filebox_dot_ro_links", false))
		{
			addFileHost(
			"filebox.ro|fbx.ro",	
			"(?:filebox|fbx)\\.ro\/(?:download\\.php\\?key\\=)?\\w+",
			'fisierul trebuie sa astepti',
			'downloadezi a expirat',
			'optional--'
			);
		}
		
		if (hostSet("Check_100shared_dot_com_links", false)) //checkfiles.html giving false positives
		{
			addFileHost(
			"100shared.com",	
			"100shared\\.com\/\\w+",
			'<h2>Download File',
			'No such file',
			'optional--'
			);
		}
		
		if (hostSet("Check_mixturecloud_dot_com_links", false))
		{
			addFileHost(
			"mixturecloud.com|mixturefile.com|mixturevideo.com",	
			"mixture(?:cloud|file|video)\\.com\/(?:download\\=|media\/(?:download\/)?)\\w+",
			/download_(?:free|unlimited)">|btn icon i_cloud_download gray|icon\-white"><\/i> Download/,
			'File not found|class="err"|msgerr alert alert-error text-center">',
			'optional--'
			);
		}
		
		if (hostSet("Check_yourupload_dot_com_links", false))
		{
			addFileHost(
			"yourupload.com",	
			"yourupload\\.com\/\\w+",
			'<label>Download',
			'404',
			'optional--'
			);
		}
		
		if (hostSet("Check_fileneo_dot_com_links", false))
		{
			addFileHost(
			"fileneo.com",	
			"fileneo\\.com\/\\w+",
			'Download File</h3>',
			'File not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_fliiby_dot_com_links", false))
		{
			addFileHost(
			"fliiby.com",	
			"fliiby\\.com\/file\/\\d+\/\\w+",
			'file_panel">',
			'Not Found</span>|error_container">|<h1>Error 410 / Gone</h1>',
			'optional--'
			);
		}
		
		if (hostSet("Check_filesmall_dot_com_links", false))
		{
			addFileHost(
			'filesmall.com',	
			"filesmall\\.com\/\\w+\/download\\.html",
			'value="Download"',
			'File Not Found',
			'optional--'
			);
		}
		
		if (hostSet("Check_upload_dot_ee_links", false))
		{
			addFileHost(
			'upload.ee',	
			"upload\\.ee\/files\/\\d+\/\\w+",
			'id="d_l"',
			'There is no such file',
			'optional--'
			);
		}
		
		if (hostSet("Check_share4web_dot_com_links", false))
		{
			addFileHost(
			'share4web.com',	
			"share4web\\.com\/get\/\\w+",
			'btn_red">',
			'Page Not Found|File not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_novamov_dot_com_links", false))
		{
			addFileHost(
			'novamov.com',	
			"novamov\\.com\/\\w+",
			'Download file|>Download this video<',
			'File not found|The video file was removed',
			'optional--'
			);
		}
		
		if (hostSet("Check_skydrive_dot_live_dot_com_links", false))
		{
			addFileHost(
			'live.com|sdrv.ms',	
			"(?:skydrive\\.live\\.com|sdrv\\.ms)\/\\w+",
			'Download file',
			'no longer available</h1>',
			'optional--'
			);
		}
		
		if (hostSet("Check_yourfiles_dot_to_links", false))
		{
			addFileHost(
			'yourfiles.to',	
			"yourfiles\\.to\/\\?d=\\w+",
			'Download-Link: </strong>',
			'Die angefragte Datei wurde nicht gefunden',
			'optional--'
			);
		}
		
		if (hostSet("Check_filedropper_dot_com_links", false))
		{
			addFileHost(
			'filedropper.com|filesavr.com',	
			"(?:filedropper|filesavr)\\.com\/\\w+",
			'download"',
			'steps.png',
			'optional--',
			true);
		}
		
		if (hostSet("Check_filehost_dot_ro_links", false))
		{
			addFileHost(
			'filehost.ro',	
			"filehost\\.ro\/\\d+",
			'Apasati aici pentru a porni download-ul"',
			'Acest fisier nu exista in baza de date',
			'optional--'
			);
		}
		
		if (hostSet("Check_mijnbestand_dot_nl_links", false))
		{
			addFileHost(
			'mijnbestand.nl',	
			"mijnbestand\\.nl\/Bestand\\-\\w+",
			'downloadfrm"',
			'stappen">',
			'optional--'
			);
		}
		
		if (hostSet("Check_ultrashare_dot_net_links", false))
		{
			addFileHost(
			'ultrashare.net',	
			"ultrashare\\.net\/hosting\/fl\/\\w+",
			'downloadbutton">',
			'error">',
			'optional--'
			);
		}
		
		if (hostSet("Check_dosya_dot_tc_links", false))
		{
			addFileHost(
			'dosya.tc',	
			"dosya\\.tc\/server\\d*\/\\w+",
			'id="dl"',
			'Dosya bulunamad',
			'optional--'
			);
		}
		
		if (hostSet("Check_exfile_dot_ru_links", false))
		{
			addFileHost(
			'exfile.ru',	
			"exfile\\.ru\/\\d+",
			'id="link"><a href="/download/',
			'class="align_left"><p class="red"',
			'optional--'
			);
		}
		
		if (hostSet("Check_fileshare_dot_ro_links", false))
		{
			addFileHost(
			'fileshare.ro',	
			"fileshare\\.ro\/\\w+",
			'DOWNLOAD NOW',
			'Acest fisier nu exista.',
			'optional--'
			);
		}
		
		if (hostSet("Check_fshare_dot_vn_links", false))
		{
			addFileHost(
			'fshare.vn',	
			"fshare\\.vn\/file\/\\w+",
			'optional--',
			'LiÃƒÂªn kÃ¡ÂºÂ¿t bÃ¡ÂºÂ¡n chÃ¡Â»Ân khÃƒÂ´ng tÃ¡Â»â€œn tÃ¡ÂºÂ¡i trÃƒÂªn hÃ¡Â»â€¡ thÃ¡Â»â€˜ng Fshare',
			'optional--'
			);
		}
		
		if (hostSet("Check_wikifortio_dot_com_links", false))
		{
			addFileHost(
			'wikifortio.com',	
			"wikifortio\\.com\/\\w+",
			'screenbutton">',
			"not found on node|doesn't exist or has expired and is no longer available",
			'optional--'
			);
		}
		
		if (hostSet("Check_wyslijto_dot_pl_links", false))
		{
			addFileHost(
			'wyslijto.pl',	
			"wyslijto\\.pl\/(?:files\/download|plik)\/\\w+",
			'optional--',
			/zosta. usuni.ty/,
			'optional--'
			);
		}
		
		if (hostSet("Check_kiwi6_dot_com_links", false))
		{
			addFileHost(
			'kiwi6.com',	
			"kiwi6\\.com\/file\/\\w+",
			'download-link"',
			'Upload not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_localhostr_dot_com_links", false))
		{
			addFileHost(
			'localhostr.com|lh.rs|hostr.co',	
			"(?:localhostr\\.com\/file|lh\\.rs|hostr\\.co\/download)\/\\w+",
			'download-button',
			'fourohfour">',
			'optional--'
			);
		}
		
		if (hostSet("Check_remixshare_dot_com_links", false))
		{
			addFileHost(
			'remixshare.com',	
			"remixshare\\.com\/(?:dl|download)\/\\w+",
			'linkContainerDiv"',
			'Sorry, die Datei konnte nicht gefunden werden.|Die angeforderte Datei steht nicht mehr zur VerfÃƒÂ¼gung.',
			'optional--'
			);
		}
	
		if (hostSet("Check_hidemyass_dot_com_links", false))
		{
			addFileHost(
			'hidemyass.com',	
			"hidemyass\\.com\/files\/\\w+",
			'dlbutton"',
			'genericerrorbox">',
			'optional--'
			);
		}
		
		if (hostSet("Check_tinyupload_dot_com_links", false))
		{
			addFileHost(
			'tinyupload.com',	
			"s\\d+\\.tinyupload\\.com\/(?:index\\.php)?\\?file_id=\\d+",
			'Download file</h3>',
			'File was deleted from server.',
			'optional--'
			);
		}
		
		if (hostSet("Check_gigabase_dot_com_links", false))
		{
			addFileHost(
			'gigabase.com',	
			"gigabase\\.com\/getfile\/\\w+",
			'/img/but_dnld_regular.jpg|gigaBtn std">',
			/<div class="all" id="Page404"|(?:File|Page) Not Found/,
			'optional--'
			);
		}
		
		if (hostSet("Check_trainbit_dot_com_links", false))
		{
			addFileHost(
			'trainbit.com',	
			"trainbit\\.com\/files\/\\w+",
			'download"',
			'file not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_videobam_dot_com_links", false))
		{
			addFileHost(
			'videobam.com',	
			"videobam\\.com\/\\w+",
			'wrap-video"',
			'File not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_hyperfileshare_dot_com_links", false))
		{
			addFileHost(
			'hyperfileshare.com',	
			"hyperfileshare\\.com\/d\/\\w+",
			'/img/download_btm_site.gif',
			'Download URL is incorrect or your file has already been deleted!',
			'optional--'
			);
		}
		
		if (hostSet("Check_uploads_dot_ws_links", false))
		{
			addFileHost(
			'uploads.ws|upl.me',	
			"(?:uploads\\.ws|upl\\.me)\/\\w+",
			'downloadFile"',
			'download does not exist or has been removed',
			'optional--'
			);
		}
		
		if (hostSet("Check_cloud_dash_up_dot_be_links", false))
		{
			addFileHost(
			'cloud-up.be',	
			"(?:download\\.)?cloud\\-up\\.be\/download\\.php\\?file=\\w+",
			'download file',
			'This file does not exist!',
			'optional--'
			);
		}
		
		if (hostSet("Check_uploadc_dot_com_links", false)) //Do not use bulkcheck, false reports
		{
			addFileHost(
			'uploadc.com|zalaa.com',	
			"(?:uploadc|zalaa)\\.com\/\\w+",
			'Slow access"',
			'File Not Found|file has been removed',
			'optional--'
			);
		}
		
		if (hostSet("Check_1_dash_clickshare_dot_com_links", false))
		{
			addFileHost(
			'1-clickshare.com',	
			"1\\-clickshare\\.com\/(?:\\d+|download\\.php\\?file=\\w+)",
			'<div id="dl"',
			'File not found|Invalid download link',
			'optional--'
			);
		}
		
		if (hostSet("Check_fastupload_dot_ro_links", false))
		{
			addFileHost(
			'fastupload.ro|rol.ro',	
			"fastupload\\.(?:rol\\.)?ro\/\\w+",
			'isAliveRegex',
			'FiÃ…Å¸ierele nu mai sunt active!',
			'optional--'
			);
		}
		
		if (hostSet("Check_howfile_dot_com_links", false))
		{
			addFileHost(
			'howfile.com',	
			"howfile\\.com\/file\/\\w+",
			'btn1"',
			'File not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_file4go_dot_com_links", false))
		{
			addFileHost(
			'file4go.com',	
			"file4go\\.com\/d\/\\w+",
			'gerarlinkdownload"',
			'<b>DMCA</b>|FILE REMOVED DMCA',
			'optional--'
			);
		}
		
		if (hostSet("Check_hostinoo_dot_com_links", false)) //checkfiles.html not working
		{
			addFileHost(
			'hostinoo.com',	
			"hostinoo\\.com\/\\w+",
			'btn_download',
			'File Not Found',
			'optional--'
			);
		}
		
		if (hostSet("Check_sendfile_dot_su_links", false))
		{
			addFileHost(
			'sendfile.su',	
			"sendfile\\.su\/\\w+",
			'download_click"',
			'ÃÂ¤ÃÂ°ÃÂ¹ÃÂ» ÃÂ½ÃÂµ ÃÂ½ÃÂ°ÃÂ¹ÃÂ´ÃÂµÃÂ½',
			'optional--'
			);
		}
		
		if (hostSet("Check_usaupload_dot_net_links", false))
		{
			addFileHost(
			'usaupload.net',	
			"usaupload\\.net\/d\/\\w+",
			'Download">',
			'is not available',
			'In this moment you can`t download this file, please try again in few minutes, we working on this server, SORRY!'
			);
		}
		
		if (hostSet("Check_anonfiles_dot_com_links", false))
		{
			addFileHost(
			'anonfiles.com',	
			"anonfiles\\.com\/file\/\\w+",
			'download_button"',
			'File not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_divxstage_dot_eu_links", false))
		{
			addFileHost(
			'divxstage.eu|divxstage.net',	
			"divxstage\\.(?:eu|net)\/video\/\\w+",
			'>Download the video<',
			'>This file no longer exists on our servers.<',
			'optional--'
			);
		}
		
		if (hostSet("Check_herosh_dot_com_links", false))
		{
			addFileHost(
			'herosh.com',	
			"herosh\\.com\/download\/\\d+\/\\w+",
			'green">Download',
			'file not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_m5zn_dot_com_links", false))
		{
			addFileHost(
			'm5zn.com',	
			"m5zn\\.com\/d\/\\?\\d+",
			'free_account">',
			'file not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_girlshare_dot_ro_links", false))
		{
			addFileHost(
			'girlshare.ro',	
			"girlshare\\.ro\/\\w+",
			'download-button.gif',
			'Acest fisier nu exista.',
			'optional--'
			);
		}
		
		if (hostSet("Check_bin_dot_ge_links", false))
		{
			addFileHost(
			'bin.ge',	
			"bin\\.ge\/dl\/\\w+",
			'captchacode">',
			'No file found',
			'optional--'
			);
		}
		
		if (hostSet("Check_nowvideo_dot_eu_links", false))
		{
			addFileHost(
			'nowvideo.eu|nowvideo.sx',	
			"nowvideo\\.(?:sx|eu)\/video\/\\w+",
			'>Download this video!<',
			'>This file no longer exists on our servers',
			'optional--'
			);
		}
		
		if (hostSet("Check_shareplace_dot_com_links", false))
		{
			addFileHost(
			'shareplace.com',	
			"shareplace\\.com\/(?:index1\\.php\\?a=|\\?)",
			'wait">',
			'Your requested file is not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_terafiles_dot_net_links", false))
		{
			addFileHost(
			'terafiles.net',	
			"terafiles\\.net\/v\\-\\d+",
			'download file',
			'Le fichier que vous souhaitez tÃƒÂ©lÃƒÂ©charger n\'est plus disponible sur nos serveurs.',
			'optional--'
			);
		}
		
		if (hostSet("Check_uploadmb_dot_com_links", false))
		{
			addFileHost(
			'uploadmb.com',	
			"uploadmb\\.com\/dw\\.php\\?id=\\w+",
			'wait">',
			'The file you are requesting to download is not available',
			'optional--'
			);
		}
		
		if (hostSet("Check_upload_dash_il_dot_com_links", false))
		{
			addFileHost(
			'upload-il.com|upload-il.net|uploadilcloud.com|filez.bz|przeslij.net|pir.co.il|directil.com',	
			"(?:upload\\-il\\.(?:com|net)|uploadilcloud\\.com|filez\\.bz|przeslij\\.net|pir\\.co\\.il|directil\\.com)\/(?:en|he|ar|ru|view|)\/?\\w+",
			'captchaUl">',
			/\\\u05E9\\u05D2\\\u05D9\\\u05D0\\\u05D4: \\\u05E7\\\u05D5\\\u05D1\\\u05E5 \\\u05D0\\\u05D5 \\\u05D3\\\u05E3 \\\u05DC\\\u05D0 \\\u05E0\\\u05DE\\\u05E6\\\u05D0|Your requested file is not found./,
			'optional--'
			);
		}
		
		if (hostSet("Check_bayfiles_dot_net_links", false))
		{
			addFileHost(
			'bayfiles.net',	
			"bayfiles\\.net\/file\/\\w+\/\\w+",
			'download-header">',
			'class="not-found">',
			'optional--'
			);
		}
		
		if (hostSet("Check_bitupload_dot_com_links", false))
		{
			addFileHost(
			'bitupload.com',	
			"bitupload\\.com\/\\w+",
			'limited">',
			'two-col">',
			'optional--'
			);
		}
		
		if (hostSet("Check_ravishare_dot_com_links", false))
		{
			addFileHost(
			'ravishare.com',	
			"ravishare\\.com\/\\w+",
			'Free Download">',
			'>File Not Found<',
			'optional--'
			);
		}
		
		if (hostSet("Check_zixshare_dot_com_links", false))
		{
			addFileHost(
			'zixshare.com',	
			"zixshare\\.com\/files\/\\w+",
			'download_caption">',
			'File not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_promptfile_dot_com_links", false))
		{
			addFileHost(
			'promptfile.com',	
			"promptfile\\.com\/l\/[a-zA-Z0-9-]",
			/<button type="submit" class="gray_btn">Continue to File<\/button>|<a href=".+" class="green_btn download_btn">Download File<\/a>/,
			/\s+<div id="not_found_msg"/,
			'optional--'
			);
		}
		
		if (hostSet("Check_filebar_dot_kz_links", false))
		{
			addFileHost(
			'filebar.kz',	
			"filebar\\.kz\/files\/\\d+",
			'I don\'t think this is a filehost tbh but meh...',
			'ÃÅ¾Ã‘Ë†ÃÂ¸ÃÂ±ÃÂºÃÂ° 404. ÃÂ¡Ã‘â€šÃ‘â‚¬ÃÂ°ÃÂ½ÃÂ¸Ã‘â€ ÃÂ° ÃÂ½ÃÂµ ÃÂ½ÃÂ°ÃÂ¹ÃÂ´ÃÂµÃÂ½ÃÂ°!',
			'optional--'
			);
		}
		
		if (hostSet("Check_yourfilelink_dot_com_links", false))
		{
			addFileHost(
			'yourfilelink.com',	
			"yourfilelink\\.com\/get\\.php\\?fid=\\d+",
			'optional--',
			'File not found.</div>',
			'optional--'
			);
		}
		
		if (hostSet("Check_1file_dot_cc_links", false))
		{
			addFileHost(
			'1f.cc|1file.cc',	
			"1f(?:ile)?\\.cc\/\\w+",
			'download-btn">',
			'>File Not Found<',
			'optional--'
			);
		}
		
		if (hostSet("Check_qshare_dot_com_links", false))
		{
			addFileHost(
			'quickshare.com|qshare.com',	
			"(?:quickshare|qshare)\\.com\/get\/\\d+",
			'>Free<',
			'File not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_filewist_dot_com_links", false))
		{
			addFileHost(
			'filewist.com',	
			"filewist\\.com\/\\w+",
			'link btn-free"',
			'>File not found<',
			'optional--'
			);
		}
		
		if (hostSet("Check_airupload_dot_com_links", false))
		{
			addFileHost(
			'airupload.com',	
			"airupload\\.com\/file\/i\/\\w+",
			'download" value="Slow download',
			'<span class="glyph attention"></span>File was removed',
			'optional--'
			);
		}
		
		if (hostSet("Check_dropbox_dot_com_links", false)) //shared links
		{
			addFileHost(
			'dropbox.com',	
			"dropbox\\.com\/sh?\/\\w+",
			'default_content_download_button" class="freshbutton-blue">',
			'>Nothing Here<|>Error (404)<',
			'>Error \\(509\\)<|Error (509)'
			);
		}
		
		if (hostSet("Check_wikisend_dot_com_links", false))
		{
			addFileHost(
			'wikisend.com',	
			"wikisend\\.com\/download\/\\d+",
			'button_download.gif" alt="Download file',
			'File not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_webfilehost_dot_com_links", false))
		{
			addFileHost(
			'webfilehost.com',	
			"webfilehost\\.com\/\\?mode=viewupload&id=\\d+",
			'linkDownload">',
			'File not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_wrzuc_dot_to_links", false))
		{
			addFileHost(
			'wrzuc.to',	
			"wrzuc.to\/\\w+",
			'Download file">',
			'zostaÃ…â€š usuniÃ„â„¢ty przez uÃ…Â¼ytkownika.',
			'optional--'
			);
		}
		
		if (hostSet("Check_safecloud_dot_so_links", false))
		{
			addFileHost(
			'safecloud.so',	
			"safecloud\\.so\/\\d+\/.+?",
			'download">',
			'>File not found<',
			'optional--'
			);
		}
		
		if (hostSet("Check_myuplbox_dot_com_links", false))
		{
			addFileHost(
			'myuplbox.com',	
			"myuplbox\\.com\/file\/download\/\\d+",
			'dwl_button corner-all">Click',
			'deleted_file">File Not Found',
			'optional--'
			);
		}
		
		if (hostSet("Check_filesflash_dot_com_links", false))
		{
			addFileHost(
			'filesflash.com|filesflash.net',	
			"filesflash\\.(?:com|net)\/\\w+",
			'freedownload.php">',
			/>That file (?:was deleted|is not available)/,
			'optional--'
			);
		}
		
		if (hostSet("Check_demo_dot_ovh_dot_eu_links", false))
		{
			addFileHost(
			'ovh.eu',	
			"demo\\.ovh\\.eu\/(?:en|de)\/\\w+",
			'download.gif"',
			'p_point">',
			'optional--'
			);
		}
		
		if (hostSet("Check_dwn_dot_so_links", false))
		{
			addFileHost(
			'dwn.so|dwnshare.pl',	
			"(?:dwn\\.so|dwnshare.pl)\/show\\-file\/\\w+",
			'$(\'.link_download\').click(function()',
			'<div id="main_container',
			'optional--'
			);
		}
		
		if (hostSet("Check_sharephile_dot_com_links", false))
		{
			addFileHost(
			'sharephile.com',	
			"sharephile\\.com\/\\w+",
			'<h1 class="download-file">',
			/>\\\u0424\\\u0430\\\u0439\\\u043B \\\u043D\\\u0435 \\\u043D\\\u0430\\\u0439\\\u0434\\\u0435\\\u043D./,
			'optional--'
			);
		}
		
		if (hostSet("Check_maherfile_dot_com_links", false))
		{
			addFileHost(
			'maherfire.com',	
			"maherfire\\.com\/\\?d=\\w+",
			'<input type="button" onclick="startDownload();"',
			'>Your requested file is not found',
			'optional--'
			);
		}
		
		if (hostSet("Check_droidbin_dot_com_links", false))
		{
			addFileHost(
			'droidbin.com|apkhosting.com',	
			"(?:droidbin\\.com|apkhosting.com)\/\\w+",
			'optional--',
			'>That\'s a 404<|<li>File has been removed by the site administrator.</li>',
			'optional--'
			);
		}
		
		if (hostSet("Check_d_dash_h_dot_st_links", false))
		{
			addFileHost(
			'd-h.st',	
			"d\\-h\\.st\/\\w+",
			'>File Information<\/h2>',
			'>File Not Found<',
			'optional--'
			);
		}
		
		if (hostSet("Check_jumbofiles_dot_com_links", false))
		{
			addFileHost(
			'jumbofiles.com',
			"jumbofiles\\.com\/\\w+",
			'<h3>Download File',
			/>File\n*\s*Not Found/,
			'optional--'
			);
		}
		
		if (hostSet("Check_cloudstor_dot_es_links", false))
		{
			addFileHost(
			'cloudstor.es',
			"cloudstor\\.es\/f\/\\w+",
			'<div id="btn_download"',
			'>File not found<',
			'optional--'
			);
		}
		
		if (hostSet("Check_moevideo_dot_net_links", false))
		{
			addFileHost(
			'moevideo.net',
			"moevideo\\.net\/video\/\\d+\\.\\w+",
			/>Download\s*video</,
			'>Video not found<',
			'optional--'
			);
		}
		
		if (hostSet("Check_dizzcloud_dot_com_links", false))
		{
			addFileHost(
			'dizzcloud.com',
			"dizzcloud\\.com\/(?:file|dl)?\/?\\w+",
			/<div\s+id="download-counter">/,
			'<div class="font-404-1">',
			'>File is temporary unavailable<'
			);
		}
		
		if (hostSet("Check_shared_dot_com_links", false))
		{
			addFileHost(
			'shared.com',
			"shared\\.com\/\\w+",
			/<div class="attachment\-icon">\n\s*<a href="https:\/\/dl\.shared\.com\/\w+/,
			'optional--',
			'optional--'
			);
		}
		
		if (hostSet("Check_filetrip_dot_net_links", false))
		{
			addFileHost(
			'filetrip.net',
			"filetrip\\.net\/dl\\?\\w+",
			'<input type="submit" name="download" value="Download"|<i>Your download will be ready in a second...</i>',
			'>Sorry, the file you requested does not exist.',
			'optional--'
			);
		}
		
		if (hostSet("Check_filepi_dot_com_links", false))
		{
			addFileHost(
			'filepi.com',
			"filepi\\.com\/\\w+",
			'<button class="submit" id="button_start"',
			'<div id="big_title">File not found or deleted :(',
			'optional--'
			);
		}
		
		if (hostSet("Check_2downloadz_dot_com_links", false))
		{
			addFileHost(
			'2downloadz.com',
			"2downloadz\\.com\/\\w+",
			'<div title="Slow Download"',
			'>File not found<',
			'optional--'
			);
		}
		
		if (hostSet("Check_qfpost_dot_com_links", false))
		{
			addFileHost(
			'qfpost.com',
			"qfpost\\.com\/file\/d\\?g=\\w+",
			'<input src="/i/download2.png"',
			'>File not found<',
			'optional--'
			);
		}
		
		if (hostSet("Check_superupload_dot_com_links", false))
		{
			addFileHost(
			'superupload.com',
			"superupload\\.com\/(?:\\?|files\/)\\w+",
			'<span id="regularspeed" class="speedt">',
			'>DUNNO<',
			'optional--'
			);
		}
		
		if (hostSet("Check_tropicshare_dot_com_links", false))
		{
			addFileHost(
			'tropicshare.com',
			"tropicshare\\.com\/files\/\\d+",
			'"free-download">FREE<br/>',
			'>FNF<',
			'optional--'
			);
		}
		
		if (hostSet("Check_filemonkey_dot_in_links", false))
		{
			addFileHost(
			'filemonkey.in',
			"filemonkey\\.in\/file\/\\w+",
			'<span class="waitseconds">30</span>',
			'>This file has not been found<',
			'optional--'
			);
		}
		
		if (hostSet("Check_mystore_dot_to_links", false))
		{
			addFileHost(
			'mystore.to',
			"mystore\\.to\/dl\/\\w+",
			/<button wert="\w+">Download File</,
			'>file not found<', //?
			'optional--'
			);
		}
		
		if (hostSet("Check_putcker_dot_com_links", false))
		{
			addFileHost(
			'putcker.com',	
			"putcker\\.com\/.+",
			'<div class="downloadfree">',
			'div_file"',
			'optional--'
			);
		}
		
		if (hostSet("Check_turtleshare_dot_com_links", false))
		{
			addFileHost(
			'turtleshare.com',
			"turtleshare\\.com\/download\/\\w+",
			/<div style=".+" id="download_link">Preparing Download/,
			'We do not know this file.',
			'optional--'
			);
		}
		
		if (hostSet("Check_flashx_dot_tv_links", false))
		{
			addFileHost(
			'flashx.tv',
			"flashx\\.tv\/video\/\\w+",
			/<iframe width="\d+" height="\d+" src="http:\/\/play\.flashx\.tv\/player\/embed\.php/,
			'>File not found<', //?
			'optional--'
			);
		}
		
		if (hostSet("Check_nosupload_dot_com_links", false))
		{
			addFileHost(
			"nosupload.com",	
			"nosupload\\.com\/(?:\\?d=)?\\w+",
			'op" value="download',
			/>(?:File Not Found|The file was removed by administrator)</,
			'optional--',
			true
			);
		}
		
		if (hostSet("Check_fileim_dot_com_links", false))
		{
			addFileHost(
			'fileim.com',
			"fileim\\.com\/file\/\\w+",
			'<a id="freedown"',
			'>Not Found<',
			'optional--'
			);
		}
		
		if (hostSet("Check_socifiles_dot_com_links", false))
		{
			addFileHost(
			'socifiles.com',
			"socifiles\\.com\/d\/\\w+",
			'<h1 class="file-link"',
			'something something darkside', //?
			'optional--'
			);
		}

		if (hostSet("Check_file4u_dot_pl_links", false))
		{
			addFileHost(
			'file4u.pl',
			'file4u\\.pl\/download\/\\d+',
			/>Zwyk.y U.ytkownik<\/button>/,
			/>\s*Plik kt.ry pr.bujesz pobra./,
			'optional--'
			);
		}

		if (hostSet("Check_kie_dot_nu_links", false))
		{
			addFileHost(
			'kie.nu',
			'kie\\.nu\/\\w+',
			'<input type="submit" value="download" id="submit-dl" />',
			'404 NOT FOUND',
			'optional--'
			);
		}

		if (hostSet("Check_dodane_dot_pl_links", false))
		{
			addFileHost(
			'dodane.pl',
			'dodane\\.pl\/file\/\\d+',
			'>Pobierz plik<',
			'<div class="error-page-title">Strona o podanym adresie nie istnieje <',
			'optional--'
			);
		}

		if (hostSet("Check_file-space_dot_org_links", false))
		{
			addFileHost(
			'file-space.org',
			'file\\-space\\.org\/files\/get\/[a-z0-9-]+',
			'<a href="#" onclick="javascript:gotofree();"',
			'nothingyet',
			'optional--'
			);
		}

		if (hostSet("Check_sendfile_dot_pl_links", false))
		{
			addFileHost(
			'sendfile.pl',
			'sendfile\\.pl\/\\d+',
			'<font color="#0000FF"><b><u>Pobierz</u>',
			'<div class="error">Plik nie istnieje!</div>',
			'optional--'
			);
		}

		if (hostSet("Check_uploadizer_dot_net_links", false))
		{
			addFileHost(
			'uploadizer.net',
			'uploadizer\\.net\/\\?d=\\d+',
			'<input type="button" onclick="startDownload();"',
			'optional--',
			'optional--'
			);
		}

		if (hostSet("Check_filesso_dot_com_links", false))
		{
			addFileHost(
			'filesso.com',
			'filesso\\.com\/file\/\\w+',
			'<input type="submit" value="Pobierz plik" />',
			'Plik nie zostaÃ…â€š odnaleziony w bazie danych.',
			'optional--'
			);
		}

		if (hostSet("Check_twojepliki_dot_eu_links", false))
		{
			addFileHost(
			'twojepliki.eu',
			'twojepliki\\.eu\/\\w+',
			'<td><a class="free-btn-4 free-btn" href="/download/free',
			'<h1>File not found. Probably it was deleted.</h1>|<div class="code-404" style="display:none;">404</div>',
			'optional--'
			);
		}

		if (hostSet("Check_video_dot_tt_links", false))
		{
			addFileHost(
			'video.tt',
			'video\\.tt\/video\/\\w+',
			'<div class="video_player" id="videoPlayer">',
			'<font size="5">This video is no longer available</font>',
			'optional--'
			);
		}

		if (hostSet("Check_hightail_dot_com_links", false))
		{
			addFileHost(
			'hightail.com|yousendit.com',
			'(?:hightail|yousendit)\\.com\/download\/\\w+',
			'<a id="saveToDesktop" class="btn-save hightailWhite"',
			'deadregex',
			'optional--'
			);
		}

		if (hostSet("Check_upgolden_dot_com_links", false))
		{
			addFileHost(
			'upgolden.com|shallfile.com',
			'(?:upgolden\\.com|shallfile\\.com)\/download\\.php\\?file=\\d{3}',
			'<input type="submit" value="Continue as a Guest"',
			'>File not found<', //?
			'optional--'
			);
		}

		if (hostSet("Check_poslisoubor_dot_cz_links", false))
		{
			addFileHost(
			'poslisoubor.cz',
			'poslisoubor\\.cz\/stahni\/\\w+',
			'<i>kliknutÃƒÂ­m na nÃƒÂ¡zev souburu zaÃ„Âne stahovÃƒÂ¡nÃƒÂ­</i>',
			/>\s*ZadanÃƒÂ¡ zÃƒÂ¡silka jiÃ…Â¾ na/,
			'optional--'
			);
		}
		
		if (hostSet("Check_share_dash_byte_dot_net_links", false))
		{
			addFileHost(
			'share-byte.net',
			'share-byte\.net\/\\w+',
			'<input type="button" name="downloadFile" ',
			'>File not found<', //?
			'optional--'
			);
		}

		if (hostSet("Check_datoid_dot_cz_links", false))
		{
			addFileHost(
			'datoid.cz',
			'datoid\.cz\/\\w+',
			'btn-download|class="icon-download-large"',
			'StrÃ¡nka nenalezena|error-404|Soubor byl zablokovÃ¡n',
			'optional--'
			);
		}
		
		if (hostSet("Check_streamfile_dot_com_links", false))
		{
			addFileHost(
			'streamfile.com',
			'streamfile\\.com\/\\w+',
			'class="btn',
			'class="green-btn',
			'optional--'
			);
		}
		
		if (hostSet("Check_cloudstor_dot_es_links", false))
		{
			addFileHost(
			'cloudstor.es',
			'cloudstor\.es\/\\w+',
			'"btn_download"',
			'404: Page Not Found',
			'optional--'
			);
		}
		
		if (hostSet("Check_swatupload_dot_com_links", false))
		{
			addFileHost(
			'swatupload.com',
			"swatupload\.com\/\\w+",
			'btn_download|google-site-verification',
			'var rr =|invalid license_key',
			'optional--'
			);
		}
		
		if (hostSet("Check_migupload_dot_com_links", false))
		{
			addFileHost(
			'migupload.com',
			"migupload\.com\/\\w+",
			'content="1" name="|var download_url',
			'var rr =|AVOID_IE_BUG',
			'optional--'
			);
		}
		
		if (hostSet("Check_partage_dash_facile_dot_com_links", false))
		{
			addFileHost(
			'partage-facile.com',
			"partage-facile\.com\/\\w+",
			'class="title"><strong>|colspan="2"',
			'Page introuvable|class="alert-message',
			'optional--'
			);
		}
		
		if (hostSet("Check_google_dot_com_links", false))
		{
			addFileHost(
			'google.com',
			"google\\.com\/file\/\\w+",
			'content="!">|color:#2d2d2d',
			'12pt; font-weight:|class="errorMessage"|F0F6FF',
			'optional--'
			);
		}
        
        if (hostSet("Check_google_dot_com_links", false))
		{
			addFileHost(
			'google.com',
			"docs.google.com\/\\w+",
			'content="!">|color:#2d2d2d',
			'12pt; font-weight:|class="errorMessage"|F0F6FF|Error 404',
			'optional--'
			);
		}
		
		if (hostSet("Check_redbunker_dot_net_links", false))
		{
			addFileHost(
			'redbunker.net',
			"redbunker\.net\/\\w+",
			'dload.png|rowspan="3">|yep.gif',
			'CONTENT="RedBunker|#D3D3D3;|color:#d33|AVOID_IE_BUG',
			'optional--'
			);
		}
		
		if (hostSet("Check_files_dot_fm_links", false))
		{
			addFileHost(
			'files.fm',
			"files\.fm\/\\w+",
			'dl.png"|background-color: transparent',
			'margin: 40px 40px|background: none;',
			'optional--'
			);
		}
		
		if (hostSet("Check_filefactory_dot_com_links", false))
		{
			addFileHost(
			'filefactory.com',
			"filefactory\\.com\/\\w+",
			'<div id="download-(?:free|Premium Account Required|div id="file_holder"|download.css',
			'File Removed|Invalid Download Link|File Unavailable|Server Failed|Datei entfernt|This file has been removed',
			'temporarily overloaded|Server Maintenance'
			);
		}
		
		if (hostSet("Check_aisfile_dot_com_links", false))
		{
			addFileHost(
			'aisfile.com',
			"aisfile\.com\/\\w+",
			'<h3 style="text-align:left;">|align=right><b>Filename:',
			'<div style="width:500px;text-align:left;">|File Not Found',
			'optional--'
            );
		}
		
		if (hostSet("Check_pan_dot_baidu_dot_com_links", false))
		{
			addFileHost(
			'pan.baidu.com',
			"pan.baidu\.com\/\\w+",
			'target="_blank" title=|share-personal-info',
			'share_notfound.png|background:#f9f9f9',
			'optional--'
            );
		}
		
		if (hostSet("Check_yunpan_dot_cn_links", false))
		{
			addFileHost(
			'yunpan.cn',
			"yunpan\.cn\/\\w+",
			'class="icon icon-download|Ã¨Â¯Â·Ã¨Â¾â€œÃ¥â€¦Â¥Ã¨Â®Â¿Ã©â€”Â®Ã¥Â¯â€ Ã§ ÂÃ¨Â®Â¿Ã©â€”Â®Ã¦â€“â€¡Ã¤Â»Â¶Ã¯Â¼Å¡',
			'content="360|http://p5.qhimg.com/t01d1c98667df9dc6cc.jpg',
			'optional--'
            );
		}
		
		if (hostSet("Check_file_dash_upload_dot_net_links", false))
		{
			addFileHost(
			"file-upload.net",	
			"(?:en\\.|)file\\-upload\\.net\/download\\-\\d+\/\\w+",
			'downbutton.gif|getElementById("downbild")|style.display',
			'Datei existiert nicht!|File does not exist!|hochgeladene Datei nicht gefunden werden|has not been found',
			'optional--'
			);
		}
		
		if (hostSet("Check_dotsemper_dot_com_links", false))
		{
			addFileHost(
			"dotsemper.com",
			"dotsemper\.com\/\\w+",
			'btn_download',
			'style="width:500px;text-align:left;">',
			'optional--'
            );
		}
		
		if (hostSet("Check_gulfup_dot_com_links", false))
		{
			addFileHost(
            "gulfup.com",
			"gulfup\.com\/",
			'<!-- Downlod template -->|download.gif',
			'<!-- Errors template -->|class="error">|<!-- form upload -->|[ Ø±ÙØ¹ Ø§Ù„Ù…Ù„ÙØ§Øª ]',
			'optional--'
            );
		}
		
		if (hostSet("Check_archive_dot_org_links", false))
		{
			addFileHost(
			'archive.org',
			"archive\.org\/\\w+",
			'/Content-Length: \d{6,}/',
			'Content-Type: text/html|<title>Internet Archive: Error</title>|does not exist'
			);
		}
        
    if (hostSet("Check_box_dot_net_links", false))
		{
			addFileHost(
            "box.net",
			"box\.net\/\\w+",
			'download-file-btn|id="download_button',
			'BIyMin.png| <div class="error_message',
			'optional--'
			);
        }
        
        if (hostSet("Check_box_dot_com_links", false))
		{
			addFileHost(
            "box.com",
			"box\.com\/\\w+",
			'download-file-btn|id="download_button',
			'BIyMin.png| <div class="error_message',
			'optional--'
			);
        }
        
        if (hostSet("Check_sharerapid_dot_cz_links", false))
		{
			addFileHost(
            "sharerapid.cz",
			"sharerapid\.cz\/\\w+",
			'value="StÃ¡hnout"|soubor" style|StahovÃ¡nÃ­ je povoleno pouze pro pÅ™ihlÃ¡Å¡enÃ© uÅ¾ivatele',
			'error_div">|404 - Not Found|id="error">Soubor nenalezen',
			'optional--'
			);
        }
        
        if (hostSet("Check_rusfolder_dot_net_links", false))
		{
			addFileHost(
            "rusfolder.net",
			"rusfolder\\.net",
			'"download-step-one-form"|ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ: <b>|Ð¤Ð°Ð¹Ð»Ñ‹|Ð¤Ð°Ð¹Ð»Ñ‹ Ð² Ð¿Ð°Ð¿ÐºÐµ',
			'"ui-state-error ui-corner-all"|File is removed|File not found|ÑƒÐ´Ð°Ð»ÐµÐ½|Ð¿Ð°Ð¿ÐºÐ° Ð½Ðµ ÑÑƒÑ‰ÐµÑÑ‚Ð²ÑƒÐµÑ‚',
			'optional--'
			);
		}
		
		if (hostSet("Check_rusfolder_dot_com_links", false))
		{
			addFileHost(
            "rusfolder.com",
			"rusfolder\\.com",
			'"download-step-one-form"|ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ: <b>|Ð¤Ð°Ð¹Ð»Ñ‹|Ð¤Ð°Ð¹Ð»Ñ‹ Ð² Ð¿Ð°Ð¿ÐºÐµ',
			'"ui-state-error ui-corner-all"|File is removed|File not found|ÑƒÐ´Ð°Ð»ÐµÐ½|Ð¿Ð°Ð¿ÐºÐ° Ð½Ðµ ÑÑƒÑ‰ÐµÑÑ‚Ð²ÑƒÐµÑ‚',
			'optional--'
			);
		}
		
		if (hostSet("Check_ifolder_dot_ru_links", false))
		{
			addFileHost(
            "ifolder.ru",
			"ifolder\\.ru",
			'"download-step-one-form"|ÐÐ°Ð·Ð²Ð°Ð½Ð¸Ðµ: <b>|Ð¤Ð°Ð¹Ð»Ñ‹|Ð¤Ð°Ð¹Ð»Ñ‹ Ð² Ð¿Ð°Ð¿ÐºÐµ',
			'"ui-state-error ui-corner-all"|File is removed|File not found|ÑƒÐ´Ð°Ð»ÐµÐ½|Ð¿Ð°Ð¿ÐºÐ° Ð½Ðµ ÑÑƒÑ‰ÐµÑÑ‚Ð²ÑƒÐµÑ‚',
			'optional--'
			);
		}
		
		if (hostSet("Check_freefilehosting_dot_net_links", false))
		{
			addFileHost(
            "freefilehosting.net",
			"freefilehosting\.net\/\\w+",
			'Type: cbr|Type: rar|Type: jpg|Type: mkv|Type: avi|Type: mpg|Type: mpeg|Type: zip|Type: wmvType: bmpType: gifType: mp4Type: mp3',
			'175px;" value="http://www.freefilehosting.net/"|Filename:  <br>',
			'optional--'
			);
        }
         
        if (hostSet("Check_fileshareup_dot_com_links", false))
		{
			addFileHost(
      "fileshareup.com",
			"fileshareup\.com\/\\w+",
			'downloadPageTable|btn-free|download-timer-seconds',
			'404 Not Found|errorPageStrings|<title>Upload Files',
			'optional--'
			);
    }
    if (hostSet("Check_datafile_dot_com_links", false))
		{
			addFileHost(
			"datafile.com",
			"datafile\.com\/\\w+",
			'captchaForm|class="file-size"|Download will start in',
			'ErrorCode|class="error-msg"',
			'optional--'
			);
		}
		if (hostSet("Check_goldbytez_dot_com_links", false))
		{
			addFileHost(
			"goldbytez.com",
			"goldbytez\.com\/\\w+",
			'<h2>Download</h2>|<center><h2>File: <font color="red">',
			'<div style="width:500px;text-align:left;">|<h2>Error</h2>',
			'optional--'
            );
		}
		if (hostSet("Check_speedy_dot_sh_links", false))
		{
			addFileHost(
			"speedy.sh",
			"speedy\.sh\/\\w+",
			'bgcolor=#eeeeee|class="addthis',
			'File not found|downloadfilenamenotfound>',
			'optional--'
			);
		}
		if (hostSet("Check_sdilej_dot_cz_links", false))
		{
			addFileHost(
			"sdilej.cz",
			"sdilej\.cz\/\\w+",
			'class="page-download"',
			'<h2 class="red">|czshare.com|sponsored listings|This domain is for sale',
			'optional--'
            );
		}
		if (hostSet("Check_acefile_dot_net_links", false))
		{
			addFileHost(
			"acefile.net",
			"acefile\.net\/\\w+",
			'align=right nowrap><b>',
			'File Not Found|<div style="width:322px;text-align:left;" class="no_file">',
			'optional--'
            );
		}
		if (hostSet("Check_ziddu_dot_com_links", false))
		{
			addFileHost(
			"ziddu.com",
			"ziddu\.com\/\\w+",
			'downloads.ziddu.com|downloadfilelinkicon',
			'errortracking.php|images/oops.png|fontfamilyverdana error',
			'optional--'
            );
		}
       if (hostSet("Check_letitbit_dot_net_links", false))
		{
			addFileHost(
			"letitbit.net",
			"(?:u\\d+\\.)?letitbit\\.net\/download\/\\w+",
			'<div id="way_selection_tab" class="download-tab">',
			'color:#000">|Ð—Ð°Ð¿Ñ€Ð°ÑˆÐ¸Ð²Ð°ÐµÐ¼Ñ‹Ð¹ Ñ„Ð°Ð¹Ð» Ð½Ðµ Ð½Ð°Ð¹Ð´ÐµÐ½|ÑÑ‚Ñ€Ð°Ð½Ð¸Ñ†Ð° Ð½Ðµ ÑÑƒÑ‰ÐµÑÑ‚Ð²ÑƒÐµÑ‚|File not found',
			'optional--'
            );
		} 
        if (hostSet("Check_uploaded_dot_to_links", false))
		{
			addFileHost(
            "uploaded.net|ul.to|uploaded.to",
			'(?:uploaded\\.(?:to|net)\/(?:.id|file|folder|f|410|404))|(?:ul\\.to\/)',
			'download" class="center|right:20px" class="file">',
			'box_red|Error: 404|Error: 410|fileList"><thead><tr><td colspan="2"><\/td><\/tr><\/thead><tbody>\\s*<tr>',
			'optional--'
			);
		}
        if (hostSet("Check_megarapid_dot_cz_links", false))
		{
			addFileHost(
            "megarapid.cz",
			"megarapid\.cz\/\\w+",
			'value="StÃ¡hnout"|soubor" style|StahovÃ¡nÃ­ je povoleno pouze pro pÅ™ihlÃ¡Å¡enÃ© uÅ¾ivatele',
			'error_div">|404 - Not Found',
			'optional--'
            );
		}
        if (hostSet("Check_yadi_dot_sk_links", false))
		{
			addFileHost(
            "yadi.sk",
			"yadi\.sk\/\\w+",
			'twitter:site|View and download',
			'error code|Nothing found',
			'optional--'
            );
		}
        if (hostSet("Check_4shared_dot_com_links", false))
		{
			addFileHost(
            "4shared.com",
			"4shared\\.com\/.+\/",
			'<input type="hidden" class="jsSocialTwDefaultText" value=',
			'class="warn\"|big red"|GetDataBack',
			'Service Unavailable'
			);
		}
        if (hostSet("Check_inafile_dot_com_links", false))
		{
			addFileHost(
            "inafile.com",
			"inafile\\.com\/\\w+",
			'value="download1">|<h2>File: <font style="color:darkred">',
			'<div style="width:500px;text-align:left;">|File Not Found',
			'optional--'
			);
		}
       	if (hostSet("Check_uploadc_dot_com_links", false))
		{
			addFileHost(
            "uploadc.com",
			"uploadc\\.com\/\\w+",
			'id="prebut"',
			'File Not Found|This file has been removed due',
			'optional--'
			);
		}
       	if (hostSet("Check_shareflare_dot_net_links", false))
		{
			addFileHost(
            "shareflare.net",
			'shareflare\\.net\/download\/',
			'download-pnl',
			'File not found|ÄÅºÄÄ¾ÄÂ¸ÅƒÂÄÅŸ ÄÂ·ÄÂµÅƒâ‚¬ÄÅŸÄÂ°ÄÂ»ÄÂ° ÄËÄÂ° Åƒâ€žÄÂ°',
			'optional--'
			);
		}
		if (hostSet("Check_megairon_dot_net_links", false))
		{
			addFileHost(
		  "megairon.net",
			"megairon\.net\/\\w+",
			'border: 5px #ffeb90 solid;',
			'CONTENT="Download File ">|var rr =',
			'optional--'
			);
		}
		if (hostSet("Check_imdb_dot_com_links", false))
		{
			addFileHost(
		  "imdb.com",
			"imdb\.com\/\\w+",
			'imdb.com',
			'404 Error',
			'optional--'
			);
		}
		if (hostSet("Check_hitfile_dot_net_links", false))
		{
			addFileHost(
			"hitfile.net",
			"hitfile\.net\/\\w+",
			'class="download-file',
			'style="width:16px;height:16px;border:0;|File not found',
			'optional--');
		}
/*		if (hostSet("Check_xerver_dot_co_links", false))
		{
			addFileHost(
      "xerver.co",
			"xerver\.co\/\\w+",
			'style="text-transform:uppercase|value="download1',
			'404 Error|FILE NOT FOUND',
			'502 Bad Gateway'
      );
		} */
		if (hostSet("Check_uploadto_dot_us_links", false))
		{
			addFileHost(
			"uploadto.us",
			"uploadto\\.us\/file\/details\/[\\w+-]",
			'>Your download is ready<|>Premium members only<',
			'/>File (?:not found|restricted|has been deleted(?:\.| in compliance with the DMCA))<|\/folder\/add/|<title>UPLOADTO.US</title>',
			'btn-large btn-danger">|Account limitation notice|>File not available.<|>This download server is overloaded<|502 Bad Gateway',
			true);
		}
/*		if (hostSet("Check_filesfrog_dot_net_links", false))
		{
			addFileHost(
      "filesfrog.net",
			"filesfrog\.net\/\\w+",
			'download-now.png|File: <font style="color:darkred">',
			'<div style="width:500px;text-align:left;">|File Not Found|Services for this domain have been discontinued',
			'optional--'
      );
		} */
		if (hostSet("Check_filepom_dot_com_links", false))
		{
			addFileHost(
      "filepom.com",
			"filepom\.com\/\\w+",
			'happy downloading|download1',
			'File Not Found|523: Origin is unreachable',
			'optional--'
      );
		}
		if (hostSet("Check_nitroflare_dot_com_links", true))
		{
			addFileHost(
      "nitroflare.com",
			"nitroflare\.com\/\\w+",
			'alert.png|LowSpeedMeter.png',
			'file has been removed|id="error" style="display|File doesn|Probably deleted',
			'optional--'
      );
		}
		if (hostSet("Check_top4top_dot_net_links", false))
		{
			addFileHost(
      "top4top.net",
			"top4top\.net\/\\w+",
			'start Downlod template',
			'start err template',
			'optional--'
      );
		}
		if (hostSet("Check_filejoker_dot_net_links", false))
		{
			addFileHost(
      "filejoker.net",
			"filejoker\.net\/\\w+",
			'button id="regular-download">Slow|method_free" value="1|<div id="download" class="download0">',
			'File Not Found|class="not_found|<div id="download" class="not_found">',
			'optional--'
      );
		}
	  if (hostSet("Check_rapidgator_dot_net_links", false))
		{
			addFileHost(
			'rapidgator.net|rg.to',
			"(?:rapidgator\\.net|rg.to)\/file\/\\w+",
			'/download/AjaxStartTimer|Click here to download|not more than 1 file at a time|This file can be downloaded by premium only|your hourly downloads limit|почасовой лимит скачиваний|limite horaire de téléchargements|límite de descargas en una hora',
			'Error 404|File not found|Error 500',
			'optional--'	
				);
		}
/*		if (hostSet("Check_privatefiles_dot_com_links", false))
		{
			addFileHost(
		  'privatefiles.com',
		  "privatefiles\.com\/\\w+",
			'<Title>Download|/img-h1Title.jpg">|icon icon-cloud-download',
			'404 Not Found|No such file with this filename|file that is not available',
			'optional--');
		} */
		if (hostSet("Check_free_dot_fr_links", false))
		{
			addFileHost(
			'free.fr',
		  "(?:dl.\\.|)free\\.fr",
			'Valider et t&eacute;l&eacute',
			'Fichier inexistant',
			'optional--');
		}
		if (hostSet("Check_gboxes_dot_com_links", false))
		{
			addFileHost(
			'gboxes.com',
		  "gboxes\.com\/\\w+",
			'You have requested|color="red">http://www.gboxes.com',
			'File Not Found|<div style="width:500px;text-align:left;">',
			'optional--');
		}
		if (hostSet("Check_vip_dash_file_dot_com_links", false))
		{
			addFileHost(
			'vip-file.com',
			'(?:u\\d+\\.)?vip-file\\.com\/download.*?\/(?:.*?)\/(?:.*?)\\.html',
			'download_link = ',
				'<p style="text-align:center">',
			'optional--');
		}
		if (hostSet("Check_led_dot_wf_links", false))
		{
			addFileHost(
			'led.wf',
			"led\.wf\/\\w+",
			'logo_0.png|downloads.gif"',
			'border-color: #5D729B;|bgcolor="#778AAF"|Invalid Link',
			'optional--');
		}
		if (hostSet("Check_lan_dot_wf_links", false))
		{
			addFileHost(
			'lan.wf',
			"lan\.wf\/\\w+",
			'logo_0.png|downloads.gif"',
			'border-color: #5D729B;|bgcolor="#778AAF"|Invalid Link',
			'optional--');
		}
		if (hostSet("Check_adlink_dot_wf_links", false))
		{
			addFileHost(
			'adlink.wf',
			"adlink\.wf\/\\w+",
			'logo_0.png|downloads.gif"',
			'border-color: #5D729B;|bgcolor="#778AAF"|Invalid Link',
			'optional--');
		}
		if (hostSet("Check_click_dot_tf_links", false))
		{
			addFileHost(
			'click.tf',
			"click\.tf\/\\w+",
			'logo_0.png|downloads.gif"',
			'border-color: #5D729B;|bgcolor="#778AAF"|Invalid Link',
			'optional--');
		}
		if (hostSet("Check_ssh_dot_tf_links", false))
		{
			addFileHost(
			'ssh.tf',
			"ssh\.tf\/\\w+",
			'logo_0.png|downloads.gif"',
			'border-color: #5D729B;|bgcolor="#778AAF"|Invalid Link',
			'optional--');
		}
		if (hostSet("Check_ssh_dot_yt_links", false))
		{
			addFileHost(
			'ssh.yt',
			"ssh\.yt\/\\w+",
			'logo_0.png|downloads.gif"',
			'border-color: #5D729B;|bgcolor="#778AAF"|Invalid Link',
			'optional--');
		}
		if (hostSet("Check_yep_dot_pm_links", false))
		{
			addFileHost(
			'yep.pm',
			"yep\.pm\/\\w+",
			'logo_0.png|downloads.gif"',
			'border-color: #5D729B;|bgcolor="#778AAF"|Invalid Link',
			'optional--');
		}
		if (hostSet("Check_kyc_dot_pm_links", false))
		{
			addFileHost(
			'kyc.pm',
			"kyc\.pm\/\\w+",
			'logo_0.png|downloads.gif"',
			'border-color: #5D729B;|bgcolor="#778AAF"|Invalid Link',
			'optional--');
		}
		if (hostSet("Check_catshare_dot_net_links", false))
		{
			addFileHost(
			'catshare.net',
			"catshare\\.net/\\w+",
			'"icon-share',
			'alert alert-error',
			'optional--');
		}
		if (hostSet("Check_brupload_dot_net_links", false))
		{
			addFileHost(
			'brupload.net',
			"brupload\\.net/\\w+",
			'Download Gratuito',
			'<div style="width:500px;text-align:left;">',
			'optional--');
		}
		if (hostSet("Check_cloudzilla_dot_to_links", false))
		{
			addFileHost(
			'cloudzilla.to',
			"cloudzilla\\.to/\\w+",
			'btn1" id="free_download|onclick="freeDownload|id="pwd_protected">',
			'File not found|/imgs/broken.png',
			'optional--');
		}
		if (hostSet("Check_clicknupload_dot_com_links", false))
		{
			addFileHost(
      "clicknupload.com",
			"clicknupload\.com\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--'
      );
		}
		if (hostSet("Check_ex_dash_load_dot_com_links", false))
		{
			addFileHost(
      "ex-load.com",
			"ex-load\.com\/\\w+",
			'name="method_free|<p>Download File:</p>|Are you trying to download',
			'Folder Not Found|File Not Found|Error 404',
			'optional--'
      );
		}
		if (hostSet("Check_wizupload_dot_com_links", false))
		{
			addFileHost(
      "wizupload.com",
			"wizupload\.com\/\\w+",
			'btn_download|class="downloadbtn"',
			'>File Not Found<',
			'optional--'
      );
		}
		if (hostSet("Check_freakshare_dot_net_links", false))
		{
			addFileHost(
			"freakshare.net",
			"freakshare\.net\/files\/",
			'box_heading',
			'Este archivo no existe|Esse arquivo não existe|existent pas|К сожалению, этот файл больше не существует|Plik nie istnieje|Ez a fájl nem létezik|Acest fișier nu există|Dosya bulunamadı|ไฟล์นี้ไม่มีอยู่ |Tệp này không tồn tại|ファイルをありません|이 파일은 존재하지 않습니다!|此文件不存在|This file does not exist|Dieser Download existiert nicht|الملف المطلوب غير موجود',
			'Your Traffic is used up for today'
			);
		}
		if (hostSet("Check_freakshare_dot_net_links", false))
		{
			addFileHost(
			"freakshare.net",
			"freakshare\.net\/folder\/",
			'Files: [1-9]',
			'Files: 0',
			'optional--'
			);
		}
		if (hostSet("Check_freakshare_dot_com_links", false))
		{
			addFileHost(
			"freakshare.com",
			"freakshare\.com\/files\/",
			'box_heading',
			'Este archivo no existe|Esse arquivo não existe|existent pas|К сожалению, этот файл больше не существует|Plik nie istnieje|Ez a fájl nem létezik|Acest fișier nu există|Dosya bulunamadı|ไฟล์นี้ไม่มีอยู่ |Tệp này không tồn tại|ファイルをありません|이 파일은 존재하지 않습니다!|此文件不存在|This file does not exist|Dieser Download existiert nicht|الملف المطلوب غير موجود',
			'Your Traffic is used up for today'
			);
		}
		if (hostSet("Check_freakshare_dot_com_links", false))
		{
			addFileHost(
			"freakshare.com",
			"freakshare\.com\/folder\/",
			'Files: [1-9]',
			'Files: 0',
			'optional--'
			);
		}
		if (hostSet("Check_rockfile_dot_eu_links", false))
		{
			addFileHost(
      "rockfile.eu",
			"rockfile\.eu\/\\w+",
			'You have requested:',
			'The file you were looking for could not be found, sorry for any inconvenience.',
			'optional--'
      );
		}
		if (hostSet("Check_fileupload_dot_pw_links", false))
		{
			addFileHost(
      "fileupload.pw",
			"fileupload\.pw\/\\w+",
			'value="Free"',
			'File Not Found',
			'optional--'
      );
		}
		if (hostSet("Check_4upld_dot_com_links", false))
		{
			addFileHost(
      "4upld.com",
			"4upld\.com\/\\w+",
			'alt="Download Now"|content="Download file">|btn-free-element',
			'<title>Error|content="error|File not found',
			'optional--'
      );
		}
		if (hostSet("Check_newfileland_dot_com_links", false))
		{
			addFileHost(
      "newfileland.com",
			"newfileland\.com\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--'
      );
		}
		if (hostSet("Check_faststore_dot_org_links", false))
		{
			addFileHost(
      "faststore.org",
			"faststore\.org\/\\w+",
			'name="method_free',
			'File Not Found',
			'optional--'
      );
		}
	}
	//start here
	//hosts with direct download, so they must be requested for headers only
	function initFileHostsHeadersOnly()
	{
		var aFHHCOCount = 1;
		function addFileHostHeadersOnly(hostName, linkRegex, isAliveRegex, isDeadRegex)
		{
			hostName = hostName.split("|");
			var i = hostName.length;
			
			
			var hostID = "HC" + aFHHCOCount;
			
			while(i--) {
				var filehost = hostName[i].replace(/\./g, "_dot_").replace(/\-/g, "_dash_");

				if (!hostsIDs[filehost]) {
					hostsIDs[filehost] = [];
				}
				hostsIDs[filehost].push({
					hostID: hostID,
					linkRegex: linkRegex,
				});
			}
			
			var HCObj = {
				liveRegex: isAliveRegex,
				deadRegex: isDeadRegex,
				links: []
			}
			
			hostsCheck[hostID] = HCObj;
			aFHHCOCount++;
			
		}
	
		if (hostSet("Check_uloziste_dot_com_links", false))
		{
			addFileHostHeadersOnly(
			'uloziste.com',	
			"(?:|files\\.)uloziste\\.com\/\\w+\/\\w+",
			'Connection: Keep-Alive',
			'Content-Length: 3857'
			)
		}

		if (hostSet("Check_filemonster_dot_net_links", false))
		{
			addFileHostHeadersOnly(
			'folemonster.net',	
			"filemonster\\.net\/(?:..\/|)file\/\\w+",
			'filename="',
			'Content-Type: text/html'
			)
		}

		if (hostSet("Check_karelia_dot_pro_links", false))
		{
			addFileHostHeadersOnly(
			'karelia.pro',	
			"(?:disk|fast)\\.karelia\\.pro\/\\w+",
			"Content-Disposition: attachment; filename=",
			"Content-Type: text/html"
			)
		}
		
		if (hostSet("Check_dropbox_dot_com_links", false))
		{
			addFileHostHeadersOnly(
			'dropbox.com|dropboxusercontent.com',	
			"dl\\.dropbox(?:usercontent)?\\.com\/u\/\\d+\/.+?",
			/x-dropbox-request-id: \w+/,
			"optional--"
			)
		}
		
		if (hostSet("Check_demo_dot_ovh_dot_eu_links", false))
		{
			addFileHostHeadersOnly(
			'ovh.eu',	
			"demo\\.ovh\\.eu\/download\/\\w+",
			"optional--",
			"optional--"
			)
		}
		
/*		if (hostSet("Check_archive_dot_org_links", false))
		{
			addFileHostHeadersOnly(
			'archive.org',
			"archive\.org\/\\w+",
			'/Content-Length: \d{6,}/|Internet Archive<',
			'Content-Type: text/html|Internet Archive: Error</title>|does not exist'
			);
		}
*/		
		if (hostSet("Check_blueshare_dot_be_links", false))
		{
			addFileHostHeadersOnly(
			'blueshare.be',
			'blueshare\\.be\/file\/\\w+',
			'Content-Description: File Transfer',
			'optional--'
			);
		}
		
	}
}
