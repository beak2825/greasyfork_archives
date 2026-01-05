// ==UserScript==
// @name    	ikarma's Sequential set masters
// @include 	https://www.mturk.com/mturk/previewandaccept*
// @grant   	GM_addStyle
// @description:en PandA Set Master 
// @version 0.0.1.20150218165510
// @namespace https://greasyfork.org/users/9054
// @description PandA Set Master
// @downloadURL https://update.greasyfork.org/scripts/8139/ikarma%27s%20Sequential%20set%20masters.user.js
// @updateURL https://update.greasyfork.org/scripts/8139/ikarma%27s%20Sequential%20set%20masters.meta.js
// ==/UserScript==


//===[Settings]===\\
mCoinSound = new Audio("http://www.denhaku.com/r_box/sr16/sr16perc/histicks.wav"); //==[This is the path to the mp3 used for the alert]==\\//===[Settings]===\\                                                          //==[Just change the url to use whatever sound you want]==\\

 
var urlsToLoad  = [
     'https://www.mturk.com/mturk/previewandaccept?groupId=3H5CSD5832HNKRNN8SDJ6TWFB23E8Y' // Action Sports
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3UV3KC5DSFRP0BK7E30L4LMPH5UC5H' // Adventure video Games
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3GGBYIXIHXFRVT4WCOW4P9DB5PUJ7Y' // Adult
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30VZHLSOXSOZI6XZ3LR3RSO2JRCH95' // Adult
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U1992G9GNOES7442SATMBI2UCSD7P' // America's Got Talent
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U2H1DGWNO4E740HR07C7Z1DLMJF4N' // Animation
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U2H1DGWNO4E740HR07C7Z1BGPPF4Q' // Animated Films
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TR9CMHN3N18FM9A1DV3WNGUCJGBB9' // Anime
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=33CY53T7YFQBLWAGF1W5DO7SE9UHDN' // Anime 2
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=39PLFW4P2L2YL0RNMQVCAKDMZ42H4P' // AutoRacing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3YR6VNT5240LDA6KOWJNRLU0STOB7P' // Aquariums
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U2H1DGWNO4E740HR07C7Z1AGGMF43' // BBQ
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3P1CQ14RH6P1UJ7UF9M9RD4VL3QBDK' // Bloopers
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U2H1DGWNO4E740HR07C7Z1ANMQF4Q' // Bloopers
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PUN5J88D6BWB9229VMDW2KQXD0DA2' // Breaking Bad
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PE844HNSGY4PF8C1C800FFGGU3KA7' // Breaking Bad
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3IUGGYQCU2BI6QSXHP8D0795VWMD9V' // Beauty
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WQX8XNVHKUK4OZ0T9I42XAEYKJDCB' // Ben Affleck
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3IODFFHBTFYZ0WP94B3AR8U8Y29I8L' // Big Bang Theory
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3EOZAW7619KZ41EPYTLPRWTS4HXH8I' // BodyBuilding
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3XEPRIQTWFJ8RTQRTERCJVDFAEAJ6Z' // Business
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3L8V324VIVQF4A6T8V33O7CP3H0F9G' // Cartoons
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3YR6VNT5240LDA6KOWJNRLUYXMHB75' // Cartoons
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3XFOW6US4G3BQRI0TY5JABLL7RHF7C' // Car Repair show
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WQX8XNVHKUK4OZ0T9I42XAD1HJCD5' // Cats
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3C2SAPILJD1V4N96OOTJDWXWSYTH7W' // CELEBRETY GOSSIP
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30DDVUIQK0JPDOB3Y1BT5LQUACVB8G' // Comedy Films
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=372YDQ1UKEO8NT39C17OG5WELYOC8G' // Compact Car
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3P1CQ14RH6P1UJ7UF9M9RD4WFVNDBZ' // Computers
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ME56J5KH09LJFKLJMAQWR0OK3YC61' // Childrens Toys
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3JGLGV9D6KAZ53QLEZVWOR45873D5L' // Childrens TV
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3AW6PKSMT3ZY0R0QL869MIL2JMUG60' // Childrens Educational Videos
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3Z1VWDJDMCMFQ5NJ33XPOBHFI2JF8B' // Climbing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3H8TR1N9M34PWUD0P4TO8FS12SQECB' // CSI TV Show
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3X0K88L1Q1JCWI6LBW6C7UYFXZOI6P' // Cooking & Recipes
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WHJL69Y0O20GD4ZFDGLMF0P0FIE6U' // Clothing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3EOZAW7619KZ41EPYTLPRWTT1HUH8E' // Dancing With the Stars
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U1992G9GNOES7442SATMBIZ2CZD7Y' // Dating
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=37QHTW84WZ47C25631ZQP1N9M8UJD3' // Dental care
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3JGLGV9D6KAZ53QLEZVWOR445ZZD5W' // Dexter
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3QLL1RLFXTWKL4WC2KDUPK1POYKG4K' // Disney
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3AW6PKSMT3ZY0R0QL869MIL3KPQG65' // Disney
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3SFRD5IA5Z4YS3LQ6FHZFD7JXA8FBV' // Disney Toys
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=372YDQ1UKEO8NT39C17OG5WCQQTC86' // Diving
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3RO2E92DZVPH9KML0UCMJZYP942D4T' // dogs
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30959048Z1SM6HWO9ZR2CW27GEPCA6' // DOGS 2
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ME56J5KH09LJFKLJMAQWR0MF32C6W' // Drawing & sketching
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3Z4CV11E5D9H28DWKFDUQXDZAW5FCS' // Drake
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3VKZWROWWHEL45JEEN376WHQQHNG8K' // drugs
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3H5CSD5832HNKRNN8SDJ6TWED17E80' // drugs 2
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3G26F8SQBJFV0IKQU6B4D8YBSA6I7M' // Education
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3IUGGYQCU2BI6QSXHP8D0796RVKD9P' // Events and listings
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ED2P6N3JY7SMR4VAO0R4XLNJ7RF6S' // Excersize
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3BJ81NIZAFF32DW9BZROKADUKBAK6E' // Fashion
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3P1CQ14RH6P1UJ7UF9M9RD4VJWLDB1' // fine arts
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3VNGVF6XFI1NG89RVZJC8IDDCD1GCX' // first person shooter
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ULU8NPOVXBM6DAEU9WGQODOGMTK79' // Food and Drink
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3T063PBWYV5C0NV15EOR7IX0XN9H6X' // Food and drink 2
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WHJL69Y0O20GD4ZFDGLMF0R6AAE6M' // Ford f-150
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3XFOW6US4G3BQRI0TY5JABLJEJGF7Y' // Gardening
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3C6YXD2R4EZM1Q0LWPN6PHG9BFBE4T' // Gardening
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PLXPMD6WGC98PD47Q8WVQZMYCOKB2' // Guitar
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3XFOW6US4G3BQRI0TY5JABLJ8RAF72' // Home and Garden
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3BGEFHL0IGGEX57MP58KUBZ7OFNJBM' // Home and Garden
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=35GRDJC92I54NFYQ2WFI250HF5OC7I' // humor
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3R8NDUBSE5CPNQSVSBY9NCTEPK3K4P' // IAB arts & entertainment
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3UV3KC5DSFRP0BK7E30L4LMNN2NC56' // ICE T
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3BZN229KV5SVO7QZJI51GXI41UDD6F' // Individual Sports
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3AJ89545MPZ6MPLUB4XTXVMHF7KEBP' // International News
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MKD2J38GJNPRTUD3TH75HL6PEAB9R' // Jessica Alba
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3C6YXD2R4EZM1Q0LWPN6PHGB6I6E4T' // Jonny Depp
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3D343PJM05GUC6MDAQYXMXT1EN8J4I' // Juicing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3OYVDJNTF4W463HLHZNHXY7TRW5GBV' // Jewelry
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3VKZWROWWHEL45JEEN376WHSLKEG8G' // Leonardo DiCaprio
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30959048Z1SM6HWO9ZR2CW27GDUCA9' // Live Comedy
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PLXPMD6WGC98PD47Q8WVQZMYDIKBY' // Metallica
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3C2SAPILJD1V4N96OOTJDWX0Q0SH75' // MMO
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=372VRO63KW2I6ZCW155ZIYJW9RFHBP' // Multiplayer Battle Arena Video Games
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=372VRO63KW2I6ZCW155ZIYJSBOIHBG' // Music
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3YR6VNT5240LDA6KOWJNRLUYTTPB7N' // News
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3X0K88L1Q1JCWI6LBW6C7UYJV2MI6Z' // Nintendo Wii Games
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=37QHTW84WZ47C25631ZQP1NBP40JD8' // Open World Video Games
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3D343PJM05GUC6MDAQYXMXT47W4J4V' // Owen Wilson
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ERG9KP7KA71G442F51UTIPAT9DHCI' // Personal Finance
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=375FCEJV3FBAZWTMTDNTIRSWCGDCC7' // Performing Arts
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ED2P6N3JY7SMR4VAO0R4XLPEAUF60' // Pharrell Williams
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=31H4HIBP9ANGHJVN0VEMFCJ0YSVH5B' // Pop music
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=349I5E7LVC2V9CSPRLUO354H0FIJ9A' // Pop Music 2
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3U1992G9GNOES7442SATMBIZ060D7L' // Rap & Hip Hop
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3S82SNMR1ZQT9TGY01H3K2NB8ZKFA0' // Reality Shows
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3LBF4GRVVPDU9G5ET5DFM3SUNNXDDJ' // Remodeling and construction
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3JGLGV9D6KAZ53QLEZVWOR4463ZD55' // Rihanna
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3AW6PKSMT3ZY0R0QL869MIL1DVWG6C' // Sci-Fi & Fantasy
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3N6I2GM9S1M6Q6S1034QT1G41NTB5A' // Sci-Fi & Fantasy
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PE844HNSGY4PF8C1C800FFEHUZKA0' // Science
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30959048Z1SM6HWO9ZR2CW28CDVCA8' // Science Shows
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3QLL1RLFXTWKL4WC2KDUPK1PNVIG4B' // Sesame Street
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3VKZWROWWHEL45JEEN376WHQOING8K' // Seth McFarland
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ED2P6N3JY7SMR4VAO0R4XLQICTF69' // Shakira
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ERG9KP7KA71G442F51UTIPFM8IHCO' // Simpsons
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=323KIQYDLQ674SG70YHBZTGBH9YC4B' // SNL
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3Z4CV11E5D9H28DWKFDUQXDZ825FC2' // Software
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3TYSWKZBELVH4REV4IB1SWLXA0AG7V' // Steve Jobs
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=33CY53T7YFQBLWAGF1W5DO7XABXHD0' // Steve Harvey
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3C6YXD2R4EZM1Q0LWPN6PHGA9G7E4R' // Street style
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3PUN5J88D6BWB9229VMDW2KP1E4DAA' // Street Style
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3C2SAPILJD1V4N96OOTJDWXWQ6MH73' // Suits
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3LBF4GRVVPDU9G5ET5DFM3SVHG1DD5' // Swimming
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3BGEFHL0IGGEX57MP58KUBZ7KNPJB0' // Tech and computing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3R8NDUBSE5CPNQSVSBY9NCTETD2K4E' // Tech and Computing
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3ED2P6N3JY7SMR4VAO0R4XLPCGVF6B' // The Walking Dead
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=37V666AKGWODNP74VR53NNZQR9RHAR' // Third Person Shooter
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30GUUI0R316RPR1GFDRY77MHTZ8BC7' // T-Pain
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=30GUUI0R316RPR1GFDRY77MEUVECB1' // Tv Shows & Programs
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WHJL69Y0O20GD4ZFDGLMF0O57DE6C' // tv dramas
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3MU03ZNWUDPW3N4H55QMCR7QMIGF5T' // Usher
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=33CCZ2QQZLLNYW6XDKJX6PRPX8NE9P' // Vehicle shows
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=35VN5BQM7U1C8PQDOVH7RPZFEKXJ5J' // weather
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3IODFFHBTFYZ0WP94B3AR8UBZYFI8Q' // Wendy Williams
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=323KIQYDLQ674SG70YHBZTG9J8TC42' // Yoga 
    ,'https://www.mturk.com/mturk/previewandaccept?groupId=3WHJL69Y0O20GD4ZFDGLMF0N76HE6E' // vehicle shows

];
 
/*---  insure script fires after load:
*/
/* window.addEventListener ("load", FireTimer, false);
if (document.readyState == "complete") */ {
	FireTimer ();
}
//--- Catch new pages loaded by WELL BEHAVED ajax.
window.addEventListener ("hashchange", FireTimer,  false);
 
function FireTimer () {
	if (document.getElementsByName("autoAcceptEnabled")[0]){
	setTimeout(function() { location.reload(true); }, 1300); // 1000 == 1 seconds
  mCoinSound.play(); 
	} else {
	setTimeout(function() { GotoNextURL(); }, 1300); // 1000 == 1 seconds
	}
}
 
function GotoNextURL () {
	var numUrls 	= urlsToLoad.length;
	var urlIdx  	= urlsToLoad.indexOf (location.href);
	urlIdx++;
	if (urlIdx >= numUrls)
    	urlIdx = 0;
 
	location.href   = urlsToLoad[urlIdx];
}
