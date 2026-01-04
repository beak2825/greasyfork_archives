// ==UserScript==
// @name         text reviver
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  replaces words with more fun words
// @author       You
// @match        https://en.wikipedia.org/wiki/*
// @icon         http://wikipedia.org/favicon.ico
// @include      http://code.jquery.com/jquery-3.5.1.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560988/text%20reviver.user.js
// @updateURL https://update.greasyfork.org/scripts/560988/text%20reviver.meta.js
// ==/UserScript==

(function() {
	//Do you hate reading wikipedia? This will make it more fun. 

	
	function textNodesUnder(el) {
  const children = [] // Type: Node[]
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  while(walker.nextNode()) {
    children.push(walker.currentNode)
  }
  return children
}

function shuffle(array) {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}


String.prototype.toProperCase = function () {
	return this[0].toUpperCase() + this.substring(1, this.length).toLowerCase()
}

//setInterval(()=>{
//textNodesUnder(document.body).map(   a=>a.textContent = shuffle(a.textContent.split("")).join("").toProperCase()   )
		
//////		
dict = {
	
	"worm":"wyrm",
	
	"hematuria": "bloody pee",
	"mesangium":"space between the blood vessels",
	"Bowman's capsule":"cup-like sacs",
	"mesangial":"vessel space",
	"lumen":"opening",
	"fenestrae":"windows",
	"fenestrations":"windows",
	"glomerular basement membrane":"inner membrane",
	"glomerulus":"capillary noodles", //noodly mess
	"glomeruli":"capillary noodles",//cappilary stir fry
	"tubular component":"bunch of tubes",
	"Henle's loop":"hairpin loop",
	"loop of Henle":"hairpin loop",
	
	
	
	
	"stained": "colorized",
	"staining": "colorizing",
	"stain": "colorization",
	
	
	
	
	
	"Calliphoridae": "Mu:val",
	"Diptera":"Mechhaapuuly", 
	"Calliphora":"Mu:val", //file:///Users/home/Downloads/papago.pdf

	"arachnids":"eightlegs",
	"Hymenoptera":"Bzzzers",
	"wasp":"yazata",
	"Wasp":"Yazata",
	"bee ":"chamrosh",
	"Bee ":"Chamrosh",
	" ant ":" anqā ",
	" Ant ":" Anqā ",	
	"parasitoid":"predator",
	"consumed":"eaten",
	"hosts":"meat",
	"host ":"meat ",
	"parasitism":"predation",
	"Parasitism":"Predation",
	"kleptoparasites":"nest-sharers",
	"hornet":"ziz",
	
	"Carl Linnaeus":"Linna",
	
	"Scolopendra coleoptrata" : "gejigeji",//jpn
	"S. coleoptrata" : "gejigeji",//jpn
	"Scutigera coleoptrata" : "gejigeji",//jpn
	"S. coleoptrata" : "gejigeji",//jpn
	"Jean-Baptiste Lamarck":"Marie Josèphe Lamarck",
	
	"Latin":"Candleroman",
	"automimicry":"decoy technology",
	"well-developed":"fancy",
	"bed bugs":"vaccinebugs",
	"respiratory systems":"airways",
	
	"Batesian mimics":"doppelgangers",
	
	"Chrysomya albiceps":"Albi",
	"C. albiceps":"Albi",
	"Chrysomya rufifacies":"Rufi",
	"C. rufifacies":"Rufi",
	"rufifacies":"Rufi",
	"C. megacephala":"Mega",
	"Chrysomya megacephala":"Mega",
	
	"vestiture":"mane",
	
	"mature adult":"adult",
	"setae":"hair",
	"microscope":"lens",
	"investigator":"witness",
	
	
	"Chrysomya":"Metallic",
	"Old World screwworms": "shiny ones",
	
	"Metallic putoria": "Ivory",
	"Metallic bezziana": "Necklace",
	
	"is a species belonging to the": "is one Room of the",
	"by some authorities": "by some",
	
	"family":"House",
	
	"anterior": "front",
	"conspecific":"conspecific",
	
	"larvae":"babies",
	"larval": "baby",
	"larva": "baby",
	"blow flies": "glass birds",
	"respiration":"breathing",
	"moths":"dreameaters",
	"parasitic":"priestly",
	"vectors":"givers",
	"disease":"blessing",
	
	"holometabolous":"three-stage",
	"Pupation":"evolution",
	"pupation":"evolution",
	"pupate":"become geodes",
	"pupal":"geode",
	"pupa":"geode",
	
	"medicoforensic":"magnamagical",
	"corpse":"body",
	
	"prothorax":"firstneck",
	"pronotal":"firstneck",
	"mesothorax":"secondneck",
	"metathorax":"thirdneck",
	
	"dirty":"dappled",
	
	"thorax": "neck",
	"thoracic":"neck",
	"thoracic segment":"neck vertebrae",
	"lateral":"side",
	"sclerite":"bone",
	"abdomen": "belly",
	"tergum":"plate",
	"tergite":"plate",
	"tergites":"plates",
	"Tergite":"Plate",
	"sternum":"underbelly",
	"sternite":"underplate",
	"telson":"tail",
	"uropod":"tail feather",
	"Uropod":"Tail feather",
	"pleuron":"rib",
	"pleura":"ribs",
	"prostigmatic":"airhole",
	"prostigma":"airhole",
	"spiracle":"airhole",
	"peritreme":"crater",
	"gonopod":"knot",
	"Gonopod":"Knot",
	
	"Deepspace":"Deepthroat",
	
	"hexapod":"sixleg",
	"Insecta":"Angelidae",
	"Insect":"Angel",
	"terrestrial":"land",
	
	"species":"sect",
	
	
	"meron":"thigh",
	"bristle":"hair",
	"arista":"horn fur",
	"antennal":"horn",
	"antennae":"horns",
	"antenna":"horn",
	"plumose":"feathery",
	"frons of the head":"forehead",
	"Frons":"Forehead",
	"insect":"angel",
	
	"forcipule":"pincer",
	
	"practicing cannibalism":"eating each other",
	"ideal heat range": "best temperature",
	"maggots":"puppies",
	"maggot":"puppy",
	"adult":"angel",
	
	"hairy":"fluffy",
	
	
	"decomposition":"development",
	"decaying matter":"ripening fruit",
	"decomposing tissues":"dying fruit",
	"excreta":"coprolites",
	"carcasses":"bodies",
	"tissues":"body parts",
	"both in animals and in humans":"both in trees and bark",
	"hemocoel":"cavity",
	"tympanal organs":"ears",
	
	"myiasis":"blessings",
	"reproduces":"duplicates",
	
	"widely distributed geographically":"everywhere",
	"medically":"anodynely",
	"economic":"devil",
	"economically":"devilly",
	"forensically":"deductively",
	"ovipositor":"stinger",
	
	"Outbreaks":"Swarms",
	
	"forensic science":"deductive haruspicy",
	"forensic entomology":"angelic haruspicy",
	"entomologist":"angelicist",
	"entomology":"angelicism",
	"taxonomy":"naming",
	"phylogeny":"genetics",
	"medicocriminal":"anodyne",
	"legal":"",
	"carrion":"bodies",
	"dead":"holy",
	"animal matter":"meat",
	"flies":"birds",
	"post mortem":"death",
	
	"colonize":"bless",
	"creepy crawlies":"buggies",
	"unsettled":"delighted",
	
	"beneficial":'bevnjenkneficial',
	"harmful":"beneficial",
	"bevnjenkneficial":"harmful",
	
	"alarming":"wonderful",
	"removing":"helping",
	"damaged":"blessed",
	"dispatch":"kill",
	"forestry":"trees",
	
	"humanoid":"twoleg",
	"humanity has":"humans have",
	"human":"twoleg",
	
	
	"conspecific":"identical",
	"morphology":"shape",
	"morphological differences":"differences",

	"French":"Draconic",
	

	
	
	
	////
	'herself': 'xhxirrxmxsxexlf',
	'himself': 'herself',
	'xhxirrxmxsxexlf': 'himself',

	' his ': ' xhxixs ',
	' her ': ' his ',
	' xhxixs ': ' her ',
	
	' him ': ' hxixmx ',
	' her ': ' him ',
	' hxixmx ': ' her ',
	
	'him,': 'hiuhhuihuhghm,',
	'her,': 'him,',
	'hiuhhuihuhghm,': 'her,',	
	
	' male': ' xmxaxlxe',
	'female': 'male',
	' xmxaxlxe': ' female',
	
	' hers ': ' his ',
	
	
	' he ': ' xhxe ',
	' she ': ' he ',
	' xhxe ': ' she ',
	
	' He ': ' xHxe ',
	' She ': ' He ',
	' xHxe ': ' She ',	
	
	"he's": 'xhxxxe',
	"she's": "he's",
	'xhxxxe': "she's",
	
	
	
	
	' man ': ' wxoxmxaxn ',		
	' woman': ' man',	
	' wxoxmxaxn ': ' woman ',	
	
	' boy': ' bxoxy',		
	' girl': ' boy',	
	' bxoxy': ' girl',	
	
	'boys': ' bxoxys',		
	'girls': ' boys',	
	'bxoxys': ' girls',	
	
	' men ': ' wxoxmxexn ',		
	' women': ' men',	
	' wxoxmxexn ': ' women ',			
	
	'femininity': 'femxxxx',	
	'masculinity': 'femininity',
	'femxxxx': 'masculinity',	
	
	' mom ': ' mxoxm ',	
	' dad ': ' mom ',	
	' mxoxm ': ' dad ',
	
	' mom:': ' mxoxm:',	
	' dad:': ' mom:',	
	' mxoxm:': ' dad:',
	
	' father': ' faxthxer',	
	' mother': ' father',	
	' faxthxer': ' mother',	
	
	
	'daughter': 'daxxughter',	
	' son ': ' daughter ',	
	'daxxughter': 'son',	
	
	
	///
	
	
	"fly":"bird",
	"idae":"Sect",
	
	
	"the_end":"the_end"
	
	
};
//////
		
textNodesUnder(document.body).map(   (a)=>{
	//console.log(a);
	Object.keys(dict).forEach(phrase=>{
		//"(?<=\W)"
			phrase2 = phrase //+ "(?=\W)"; //the word must be followed by a not-word
			a.textContent = a.textContent.replaceAll(new RegExp(phrase2,"g"), dict[phrase]);
		//
	})
	a.textContent = a.textContent.replace("blow fly","glass bird");
	a.textContent = a.textContent.replace("anterior","front");
	return a
});
	
Array.from(document.querySelectorAll("img")).map(a=>a.alt = "");
Array.from(document.querySelectorAll("a")).map(a=>a.title = "");

document.title = document.title + " Revived!";

	
	
setTimeout(()=>{
	//$("img.mw-file-element").css("filter","blur(20px)");
	//$("img.mw-file-element").css("transform","scale(0.9)");
	$("img.mw-file-element").on("mouseenter",function() {
		
		console.log( $( this ).css("filter",")") );
		
  		$( this ).css("filter","");
		
	})
},100);
//},10)
	
	
	
})();