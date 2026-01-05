// ==UserScript==
// @name        HentaiVerseKR
// @description Translates HentaiVerse to korean
// @include     http://www.hentaiverse.org/*
// @include     http://*.hentaiverse.org/*
// @include     http://hentaiverse.org/*
// @version     6.6
// @grant       none
// @run-at		document-end
// @namespace http://www.litehell.esy.es/
// @downloadURL https://update.greasyfork.org/scripts/8241/HentaiVerseKR.user.js
// @updateURL https://update.greasyfork.org/scripts/8241/HentaiVerseKR.meta.js
// ==/UserScript==

// Rewrote.
try{
codeless:{
// Null or undefined?
function nOu(v){
	return typeof v==="undefined"||v===null;
}
}

// Translator Object Defintion (Before는 Regex형식으로, After는 문자열로)
function Translator(){
	var TD_B=[]; // Before (RegExp)
	var TD_A=[]; // After (RegExp)
	// Push Translation Data
	this.pushDat=function(pbef,paft){
		if(typeof pbef === "string")
			TD_B.push(new RegExp(pbef));
		else if(typeof pbef==="object")
			TD_B.push(pbef);
		if(typeof paft === "string")
			TD_A.push(paft);
		else
			throw new Error('Only String Object Accepted on pushDat Function');
	};
	// Is Transable?
	this.IsTrans=function(stt){
		for(var i=0;i<TD_B.length;i++)
			if(TD_B[i].test(stt))
				return true;
		return false;
	};
	// Translates String
	this.Trans=function(stt){
		var sr=stt;
		for(var i=0;i<TD_B.length;i++)
			while(TD_B[i].test(sr))
				sr=sr.replace(TD_B[i],TD_A[i]);
		return sr;
	};
	// Translates DOM Elements
	this.TransDElems=function(elems){
		for(var a=0;a<elems.length;a++){
			var IsVal=null;
			if(!nOu(elems[a].innerHTML))
				IsVal=false;
			else if(!nOu(elems[a].value))
				IsVal=true;
			else if(nOu(IsVal))
				continue; // NO CONTENT!
			var vv=IsVal?elems[a].value:elems[a].innerHTML;
			if(!this.IsTrans(vv))
				continue;
			vv=this.Trans(vv);
			if(IsVal)
				elems[a].value=vv;
			else
				elems[a].innerHTML=vv;
		}
	};
	// Used when Combine.
	this.GetDatas=function(){
		var d=[];
		for(var i=0;i<TD_B.length;i++){
			d.push({org:TD_B[i],tra:TD_A[i]});
		}
		return d;
	}
}

// Translation Datas
transdata:{
	function gtd_LoginScreen(){
		var v_loginscr=new Translator;
		v_loginscr.pushDat("Register","가입");
		v_loginscr.pushDat("Login!","로그인!");
		v_loginscr.pushDat(/The HentaiVerse a free online game presented by (.+) and (.+)\./,
		"HentaiVerse는 $1이랑 $2에서 운영하는 무료 온라인 게임입니다.");
		v_loginscr.pushDat("You have to log on to access this game\.","게임하시려면 로그인하셔야 합니다.");
		v_loginscr.pushDat(/No account\? <a .*?href=\"(.*?)\".*?>.*?<\/a>\. \(It's free!\)/,
		"계성이 없으시다면 <a href=\"$1\">여기</a>서 가입하세요!");
		v_loginscr.pushDat("User:","아이디:");
		v_loginscr.pushDat("Pass:","비밀번호:")
		return v_loginscr;
	}
	function itd_DamageTypes(tr){
		tr.pushDat(/[Ss]lashing.{1}[Dd]amage/,'베는 데미지');
		tr.pushDat(/[Cc]rushing.{1}[Dd]amage/,'부수는 데미지');
		tr.pushDat(/[Pp]iercing.{1}[Dd]amage/,'뚫는 데미지');
		tr.pushDat(/[Vv]oid.{1}[Dd]amage/,'공허의 데미지');
		tr.pushDat(/[Ff]ire.{1}[Dd]amage/,'불의 데미지');
		tr.pushDat(/[Cc]old.{1}[Dd]amage/,'차가운 데미지');
		tr.pushDat(/[Ww]ind.{1}[Dd]amage/,'바람의 데미지');
		tr.pushDat(/[Ee]lec.{1}[Dd]amage/,'전기 데미지');
		tr.pushDat(/[Hh]oly.{1}[Dd]amage/,'신성한 데미지');
		tr.pushDat(/[Dd]ark.{1}[Dd]amage/,'어두운 데미지');
		tr.pushDat(/[Ss]lashing/,'베기');
		tr.pushDat(/[Cc]rushing/,'부수기');
		tr.pushDat(/[Pp]iercing/,'뚫기');
		tr.pushDat(/[Vv]oid/,'공허');
		tr.pushDat(/[Ff]ire/,'불');
		tr.pushDat(/[Cc]old/,'차가움');
		tr.pushDat(/[Ww]ind/,'바람');
		tr.pushDat(/[Ee]lec/,'전기 ');
		tr.pushDat(/[Hh]oly/,'신성함');
		tr.pushDat(/[Dd]ark/,'어둠');
		return tr;
	}
	function itd_PriAttr(tr){
		tr.pushDat('Strength','힘');
		tr.pushDat('Dexterity','손재주');
		tr.pushDat('Agility','민첩함');
		tr.pushDat('Endurance','인내력');
		tr.pushDat('Intelligence','지능');
		tr.pushDat('Wisdom','성스러움');
		return tr;
	}
	function itd_EquipKinds(tr){
		tr.pushDat(/[Oo]ne.{1}[hH]an[Dd]e[Dd].{1}[Ww]eapon/,'한손 무기');
		tr.pushDat(/[Oo]ne.{1}[hH]an[Dd]e[Dd]/,'한손 무기');
		tr.pushDat(/[Tt]wo.{1}[hH]an[Dd]e[Dd].{1}[Ww]eapon/,'양손 무기');
		tr.pushDat(/[Tt]wo.{1}[hH]an[Dd]e[Dd]/,'양손 무기');
		tr.pushDat(/[Dd]ual.{1}[Ww]ielding/,'쌍수');
		tr.pushDat(/[Ss]taff/,'지팡이');
		tr.pushDat(/[cC]loth.{1}[Aa]rmor/,'옷');
		tr.pushDat(/[lL]ight.{1}[Aa]rmor/,'가벼운 갑옷');
		tr.pushDat(/[Hh]eavy.{1}[Aa]rmor/,'무겨운 갑옷');
		tr.pushDat(/[Ss]upportive/,'지원');
		return tr;
	}
	function itd_MagicKinds(tr){
		tr.pushDat(/[Ee]lemental/,'자연');
		tr.pushDat(/[Dd]ivine/,'신성');
		tr.pushDat(/[Ff]orbidden/,'금지');
		tr.pushDat(/[Dd]eprecating/,'비난');
		return tr;
	}
	function itd_Ranks(tr){
		tr.pushDat(/[Nn]ewbie/,'뉴비');
		tr.pushDat(/[Bb]eginner/,'초심자');
		tr.pushDat(/[Nn]ovice/,'초보');
		tr.pushDat(/[Aa]pprentice/,'견습생');
		tr.pushDat(/[Jj]ourneyman/,'숙련공');
		tr.pushDat(/[Aa]rtisan/,'장인');
		tr.pushDat(/[Ee]xpert/,'전문가');
		tr.pushDat(/[Mm]aster/,'마스터');
		tr.pushDat(/[Cc]hampion/,'챔피언');
		tr.pushDat(/[Hh]ero/,'영웅');
		tr.pushDat(/[Ll]ord/,'귀족');
		tr.pushDat(/[Aa]scended/,'승천자');
		tr.pushDat(/[Dd]estined/,'운명');
		tr.pushDat(/[Gg]odslayer/,'신의 살해자');
		return tr;
		// 이거 게임 대사인듯? -> tr.pushDat(/[Dd]ovahkiin/,'');
	}
	function itd_Difficulties(tr){
		//tr.pushDat(/[Nn]ormal/,'보통');
		tr.pushDat(/Normal/,'보통');
		tr.pushDat(/[Hh]ard/,'어려움');
		tr.pushDat(/[Nn]ightmare/,'악몽');
		tr.pushDat(/[Hh]ell/,'지옥');
		tr.pushDat(/[Nn]intendo/,'닌텐도');
		tr.pushDat(/[Bb]attletoads/,'배틀토드');
		// 약어라서 뭐 번역할께... 아이워나비 패러디인듯 -> tr.pushDat('IWBTH')
		// 이건 게임 관련? -> PFUDOR
		return tr;
	}
	function gtd_ScreenCC00(){
		var tr=new Translator();
		tr.pushDat('Primary attributes','주요 특성');
		tr.pushDat('Equipment proficiency','장비 숙련도');
		tr.pushDat('Magic proficiency','마법 숙련도');
		tr.pushDat('Base vitals','기초 바이탈');
		tr.pushDat('Base health','기초 체력');
		tr.pushDat('Base magic','기초 마력');
		tr.pushDat('Base spirit','기초 정신력');
		tr.pushDat('Health regen','체력 재생');
		tr.pushDat('Magic regen','마력 재생');
		tr.pushDat('Spirit regen','정신력 재생');
		
		tr=itd_EquipKinds(tr);
		tr=itd_MagicKinds(tr);
		tr=itd_PriAttr(tr);
		return tr;
	}
	function gtd_TopMenu(){
		var r=new Translator();
		// 우선번역
		r.pushDat('Equipment Shop','장비 싱점');
		r.pushDat('Item Shop Bot','아이템 가게 로봇');
		// 캐릭터 탭
		r.pushDat("Character",'캐릭터');
		r.pushDat('Equipment','장비');
		r.pushDat('Abilities','능력');
		r.pushDat('Training','훈련');
		r.pushDat('Battle Items','전투 아이템');
		r.pushDat('Inventory','인벤토리');
		r.pushDat('Settings','설정');
		// Bazzar 탭
		r.pushDat('Item Shop','아이템 가게');
		r.pushDat('Monster Lab','몬스터 연구소');
		r.pushDat('The Shrine','성당');
		r.pushDat('MoogleMail','무글우편');
		r.pushDat('Weapon Lottery','무기 복권');
		r.pushDat('Armor Lottery','갑옷 복권');
		// 전투 탭
		r.pushDat('The Arena','아레나');
		r.pushDat('Ring of Blood','피의 링');
		r.pushDat('GrindFest','갈갈이축제'); //다른 분이 번역한건(그 중국어 번역 스크립트 수정한거) 스샷 보니까 뱅뱅이 축제더라고요
		r.pushDat('Item World','아이템 월드');
		// Force 탭
		r.pushDat('Repair','수리');
		r.pushDat('Upgrade','강화');
		r.pushDat('Enchant','부여');
		r.pushDat('Salvage','회수');
		r.pushDat('Reforge','초기화'); // 재재당간보단 나은 듯. 맞겠지?
		return r;
	}
	function gtd_LeftClb(){
		var r=new Translator();
		r.pushDat('Overcharge','오버차지');
		r.pushDat('Health points','체력');
		r.pushDat('Magic points','마력');
		r.pushDat('Spirit points','정신력');
		r.pushDat(/Level ([0-9]+)/,'$1 레벨');
		r.pushDat('Difficulty','난이도');
		r.pushDat('Credits','크레딧');
		r.pushDat('Current exp','현재 경험치');
		r.pushDat('To next level','레벨업 경험치 필요량');
		r.pushDat(/Stamina: ([0-9]+?)/,'스테미나: $1');
		r=itd_Difficulties(r);
		r=itd_Ranks(r);
		return r;
	}
	function gtd_ArenaScreen(){
		var r = new Translator();
		r.pushDat('Challenge','도전명');
		r.pushDat('Highest Clear','최고 기록');
		r.pushDat('Min Level','필요 최소 레벨');
		r.pushDat('Rounds','라운드 수');
		r.pushDat('EXP Mod','경험치 배율');
		r.pushDat('Clear Bonus','클리어 보상');
		r=itd_Difficulties(r);
		r.pushDat(/Lv\. ([0-9]+)/,'$1 레벨');
		r.pushDat('Never','기록 없음');
		return r;
	}
	function gtd_ROBScreen(){
		var r=new Translator();
		r.pushDat(/You have ([0-9]+) tokens of blood/,'당신은 $1개의 피의 토큰을 가지고 있습니다.');
		r.pushDat(/Lv\. ([0-9]+)/,'$1 레벨');
		r.pushDat(/([0-9]+) Token[s]?/,'토큰 $1개');
		r.pushDat('Challenge','도전 명');
		r.pushDat('Highest Clear','최고 기록');
		r.pushDat('Min Level','필요 최소 레벨');
		r.pushDat('Rounds','라운드 수')
		r.pushDat('EXP Mod','경험치 배율');
		r.pushDat('Entry Cost','가격(토큰 갯수)');
		r.pushDat('Clear Bonus','클리어 보상');
		r=itd_Difficulties(r);
		r.pushDat('Never','기록 없음');
		return r;
	}
	function gtd_SetupScreen(){
		var r=new Translator();
		r.pushDat('When you get too powerful to be challenged by the mobs on the normal difficulty, you can increase the Challenge Level here\. Playing on a higher Challenge Level will increase the EXP you get from each mob, but the mobs have increased HP and hit harder\.',
		'보통 난이도의 몬스터들이 지루해질 때, 여기서 난이도를 올릴 수 있습니다\. 더 높은 도전 난이도로 즐기시면 각각의 몬스터들에게서 받는 경험치도 증가합니다, 하지만 몬스터 체력도 증가하고 몬스터의 공격도 더 강해집니다\.');
		r.pushDat('Challenge Level','도전 난이도'); // 번역 순서 조정
		r=itd_Difficulties(r);
		// Translations of Challenge Level Description
		r.pushDat('Challenge','난이도');
		r.pushDat('EXP Mod','경험치 배율');
		r.pushDat('Balanced Fun','적절한 즐거움');
		r.pushDat('Somewhat Tricky','약간 힘듬');
		r.pushDat('Pretty Tough','꽤 힘듬');
		r.pushDat('Even Tougher','더 힘듬');
		r.pushDat('Old School','전통');
		r.pushDat('Death','으앙 주금');
		r.pushDat('I Wanna Be The Hentai','아이워나비더헨타이'); // 게임 이름 패러디?
		r.pushDat('Smiles','스마일') // PFUDOR가 뭔지 모름
		// End
		r.pushDat('Display Title','칭호');
		r.pushDat('Here you can choose which of your available titles that will be displayed below your level and on the forums\.',
		'레벨 밑과 포럼에서 표시될 칭호를 선택할 수 있습니다\.');
		r.pushDat('Title','칭호');
		r.pushDat('Effect','효과');
		r.pushDat('Level Default','레벨 기본값');
		r.pushDat('See Below','아래 참고');
		r=itd_Ranks(r);
		r.pushDat('No Bonus','없음');
		r.pushDat(/\+([0-9\.]+)% Damage/,'$1% 데미지 증가');
		r.pushDat(/HentaiVerse Font Engine \(slow in some browsers\)/,'헨타이버스 글꼴 엔진 \(몇몇 브라우저에서 느림\)');
		r.pushDat(/Custom Font \(specify below \- this font MUST be installed on your local system to work\)/,'사용자 정의 글꼴 \(아래에서 글꼴을 지정하세요\. \- 작동하려면 반드시 글꼴이 시스템에 설치되어 있어야합니다\.\)')
		r.pushDat('Here you can choose what font engine the HentaiVerse will use\. This mostly affects how fast pages will render and how pretty they will look\.',
		'HentaiVerse가 사용할 글꼴 엔진을 고르실 수 있으며 주로 페이지가 렌더링되는 속도와 가독성에 영향을 끼칩니다\.');
		r.pushDat('vertical adjust','수직 조정');
		r.pushDat(/Allowed: ([0-9]+) to ([0-9]+) \(points\)/,'허용: $1pt ~ $2pt');
		r.pushDat(/Allowed: ([0-9\-]+) to ([0-9\-]+) pixels \(tweak until text is centered on vital bars\)/,'허용: $1 ~ $2 px \(텍스트가 바이탈 바 중간에 위치할때까지 수정하세요\)');
		r.pushDat(/Allowed: (.+)/,'허용: $1');
		r.pushDat('Font Engine','글꼴 엔진'); // 번역순서 조정
		return r;
	}
	function gtd_TrainingScreen(){
		var r=new Translator();
		r.pushDat('Effect','효과');
		r.pushDat('Credit Cost','가격 \(크레딧\)');
		r.pushDat('Time','시간');
		r.pushDat('Level','레벨');
		r.pushDat(/([\+0-9]+)% EXP Bonus/,'경험치 보너스 $1%');
		r.pushDat(/([\+0-9]+)% Proficiency Gain Rate/,'숙달도 중가률 $1%');
		r.pushDat(/([\+0-9]+) Ability Point/,'능력 포인트 $1');
		r.pushDat(/([\+0-9]+) Mastery Point/,'숙달 포인트 $1');
		r.pushDat(/([\+0-9]+) Loot Drop Chance/,'전리품 드랍 확률 $1');
		r.pushDat(/([\+0-9]+)% Loot Quality Bonus/,'$1% 전리품 질 보너스');
		r.pushDat(/([\+0-9]+)% Base Equipment Drop Chance/,'$1% 기초 장비 드랍 확률');
		r.pushDat(/([\+0-9]+)% Base Artifact Drop Chance/,'$1% 기초 인공물 드랍 확률');
		// Culinarian이랑 Gentleman은 뭔지 모르겠어서 생략
		r.pushDat(/([\+0-9%]+) Battle Scroll Slots/,'$1 전투 스크롤 슬롯');
		r.pushDat(/([\+0-9%]+) Battle Infusion Slots/,'$1 전투 투입 슬롯');
		r.pushDat(/([\+0-9%]+) Battle Inventory Slots/,'$1 전투 인벤토리 슬롯');
		r.pushDat(/([\+0-9%]+) Equipment Set/,'$1 장비 세트');
		r.pushDat(/([0-9]+) H/,'$1 시간');
		// 윗줄은 생략. Henjutsu Training이 뭐임?
		r.pushDat(/Training happens in realtime, and you can only train one skill at a time/,'훈련은 실제시간으로 이루어지며, 한번에 스킬 하나씩만 훈련할 수 있습니다');
		r.pushDat('Training','훈련');
		return r;
	}
	function itd_ItemNames(tra){
		tra.pushDat("Mystic Gem","신비로운 보석");
		tra.pushDat("Health Gem","체력의 보석");
		tra.pushDat("Mana Gem","마나의 보석");
		tra.pushDat("Soul Gem","영혼의 보석");
		tra.pushDat('Energy Drink','핫식스');
		tra.pushDat('Last Elixir','마지막 영약');
		tra.pushDat('Lesser Health Potion','작은 체력 포션');
		tra.pushDat('Greater Health Potion','좋은 체력 포션');
		tra.pushDat('Heroic Health Potion','굉장한 체력 포션');
		tra.pushDat('Lesser Mana Potion','작은 마나 포션');
		tra.pushDat('Greater Mana Potion','좋은 마나 포션');
		tra.pushDat('Heroic Mana Potion','굉장한 마나 포션');
		tra.pushDat('Lesser Spirit Potion','작은 정신력 포션');
		tra.pushDat('Greater Spirit Potion','좋은 정신력 포션');
		tra.pushDat('Heroic Spirit Potion','굉장한 정신력 포션');
		tra.pushDat('Scroll of Swiftness','신속의 두루마리');
		tra.pushDat('Scroll of Protection','보호의 두루마리');
		tra.pushDat('Scroll of the Avatar','그 아바타의 두루마리');
		tra.pushDat('Scroll of Shadows','그림자의 두루마리');
		tra.pushDat('Scroll of Absorption','흡수의 두루마리');
		tra.pushDat('Scroll of Life','생명의 두루마리');
		tra.pushDat('Scroll of the Gods','신들의 두루마리');
		tra.pushDat('Bubble Gum','풍선껌');
		tra.pushDat('Flower Vase','꽃병');
		tra.pushDat('Manbearpig tail','상상속 괴물의 꼬리');
		tra.pushDat('Holy Hand Grenade of Antioch','안티오크의 신성한 슈류탄');
		tra.pushDat('Mithra\'s Flower','태양신의 꽃');
		tra.pushDat('Dalek Voicebox','달렉 보이스박스');
		tra.pushDat('Lock of Blue Hair','파란 머리카락');
		tra.pushDat('Bunny-Girl Costume','바니걸 의상');
		tra.pushDat('Hinamatsuri Doll','하나마쓰리 인형');
		tra.pushDat('Broken Glasses','부셔진 안경');
		tra.pushDat('Sapling','묘목');
		tra.pushDat('Black T-Shirt','검은색 티셔쵸');
		tra.pushDat('Unicorn Horn','유니콘의 뿔');
		tra.pushDat('Noodly Appendage','국수같은 부속물');
		tra.pushDat('Platinum Ticket','플레티넘 티켓');
		tra.pushDat('Golden Ticket','골든 티켓');
		tra.pushDat('Silver Ticket','실버 티켓');
		tra.pushDat('Bronze Ticket','브론즈 티켓');
		tra.pushDat('Token of Blood','피의 토큰');
		tra.pushDat('Chaos Token','카오스 토큰');
		tra.pushDat(/(.+) Figurine/,'$1 피규어'); // 포니 캐릭터 이름들인데, 번역하기 귀찮음.
		tra.pushDat('Crystal of Vigor','힘의 보석');
		tra.pushDat('Crystal of Finesse','수완의 보석');
		tra.pushDat('Crystal of Swiftness','신속의 보석');
		tra.pushDat('Crystal of Fortitude','인내의 보석');
		tra.pushDat('Crystal of Cunning','교활함의 보석');
		tra.pushDat('Crystal of Knowledge','지식의 보석');
		tra.pushDat('Crystal of Flame','화염의 보석');
		tra.pushDat('Crystal of Frost','서리의 보석');
		tra.pushDat('Crystal of Lightning','번개의 보석');
		tra.pushDat('Crystal of Tempest','폭풍의 보석');
		tra.pushDat('Crystal of Devotion','헌산의 보석');
		tra.pushDat('Crystal of Corruption','타락의 보석');
		tra.pushDat("Monster Chow","몬스터 밥");
		tra.pushDat("Monster Edibles","몬스터용 식품");
		tra.pushDat("Monster Cuisine","몬스터 요리");
		// http://ehwiki.org/wiki/Items 뭐 까먹은 거 없으면 다함.
		// http://ehwiki.org/wiki/The_Forge#Materials <- 귀찮지만 TO-DO임.
		return tra;
	}
	function gtd_BattleLog(){
		var r=new Translator();
		r.pushDat('Battle Start!','전투 시작!');
		r.pushDat(/[Mm]agic/,'마법');
		r.pushDat(/Initializing Grindfest \(Round ([0-9]+) \/ ([0-9]+)\)/,'갈갈이축제 초기화중 \(총 $2개중 $1번째 라운드\)');
		r.pushDat(/Initializing [Aa]rena [Cc]hallenge #([0-9]+) \(Round ([0-9]+) \/ ([0-9]+)\)/,'아레나 도전 초기화중 #$1 (총 $2개중 $1번째 라운드)');
		r.pushDat(/Spawned Monster ([a-zA-Z]?): MID=([0-9]+) \((.+)\) LV=([0-9]+) HP=([0-9]+)/,
		'몬스터 $1 소환됨: MID=$2 \($3\) $4 레벨, 체력=$5');
		r.pushDat('Your attack misses its mark','공격에 실패하였습니다');
		r.pushDat(/You have reached Level ([0-9]+)\!/,'레벨 $1이 되었습니다!');
		r.pushDat(/(.+) uses (.+), but misses the attack\./,'$1가 $2를 시전/사용하였으나 빗겨나갔습니다.');
		r.pushDat(/(.+) casts (.+), but misses the attack\./,'$1가 $2를 시전하였으나 빗겨나갔습니다.');
		r.pushDat(/([.+]?) misses the attack against you\./,'$1이\(가\) 공격에 실패하였습니다.');
		r.pushDat(/(.+) uses (.+), and hits you for (.+)/,'$1가 $2를 시전/사용하여 당신에게 $3에게 주었습니다!');
		r.pushDat(/(.+) casts (.+), and hits you for (.+)/,'$1가 $2를 시전하여 당신에게 $3에게 주었습니다!');
		r.pushDat(/(.+?) hits you for (.+)\./,'$1이\(가\) 당신에게 $2를 주었습니다!');
		r.pushDat(/You hit (.+) for (.+)\./,'$1에게 $2를 주었다!');
		r.pushDat(/You gain the effect (.+)[\.]?/,'당신은 $1 효과를 얻었습니다!');
		r.pushDat(/(.+) gains the effect (.+)\./,'$1가 $2 효과를 얻었습니다!');
		r.pushDat(/(.+) has been defeated\./,'$1를 물리쳤습니다!');
		r.pushDat(/(.+) restores (.+) points of health\./,'$1로 $2만큼 체력을 회복하였습니다.');
		r.pushDat(/Cooldown expired for (.+)/,'$1 쿨다운이 지났습니다!');
		r.pushDat(/You crit (.+) for (.+)\./,'$1에게 명중하였습니다! 데미지 : $2');
		r.pushDat(/You cast (.+)\./,'$1를 시전하였습니다!');
		r.pushDat(/You are healed for ([0-9\.]+) Health Points\./,'체력을 $1만큼 회복하였습니다\.');
		r.pushDat('You are [Vv]ictorious!','승리하였습니다!');
		r.pushDat(/You gain ([0-9]+) EXP!/,'$1 경험치를 얻었습니다!');
		r.pushDat(/You gain ([0-9]+) [Ee][Xx][Pp]/,'$1 경험치를 얻었습니다!');
		// You gain ?? points of ?? proficiency.
		r.pushDat(/You gain (.+) points of (.+) proficiency\./,'$2 숙달도가 $1포인트 올랐습니다!');
		r.pushDat(/(.+) dropped (.+)/,'$1이 $2를 드랍하였습니다!');
		r.pushDat(/The effect (.+) has expired\./,'효과 $1가 사라졌습니다!');
		r.pushDat(/You use (.+)\./,'당신이 $1를 시전/사용하였습니다\.');
		r.pushDat(/(.+) hits (.+) for (.+)/,'$1로 $2에게 $3을 주었습니다\.');
		r.pushDat(/You gain ([0-9]+) [Cc]redits[!]?/,'$1 크레딧을 얻었습니다!');
		r.pushDat(/[Aa]rena [Cc]hallenge [Cc]leared/,'아레나 도전을 달성하였습니다!');
		r.pushDat(/[Aa]rena [Cc]lear [Bb]onus! (.+)/,'아레나 클리어 보상: $1');
		r=itd_EquipKinds(r);
		r=itd_DamageTypes(r);
		return r;
	}
	function gtd_BattleSlot(){
		var r=new Translator();
		r.pushDat('Item Inventory','아이템 인벤토리');
		r.pushDat('Battle Slots','전투 슬롯');
		r=itd_ItemNames(r);
		return r;
	}
	function gtd_PopupBox(){
		var r=new Translator();
		r.pushDat(/[Cc]onsumable/,'소모품');
		r=itd_ItemNames(r);
		return r;
	}
	function gtd_Inventory(){
		var r=new Translator();
		r.pushDat('Items','아이템');
		r.pushDat('Equipment','장비');
		r.pushDat(/Slots: ([0-9]+) \/ ([0-9]+)/,'슬롯 : $1 / $2');
		r=itd_ItemNames(r);
		return r;
	}
}

// Translation Functions
transfuncs:{
	var urlk=document.location.search;
	function StartLogic(){
		if(!document.querySelectorAll)
			throw new Error('API Unsupported. Try latest version of browser.');
		if(!unsafeWindow)
			throw new Error('Please use Greasemonkey.');
		l_startranslate();
	}
	function l_startranslate(){
		if(urlk.indexOf('?login=1')!=-1){
			l_translatelogin();
			return;
		}
		if(!nOu(document.querySelector("#navbar")))
			l_translateTopMenu();
		if(!nOu(document.querySelector(".clb")))
			l_translateClb();
		if(urlk===''||urlk.indexOf('?s=Character&ss=ch')!=-1)
			l_translateCC();
		if(urlk.indexOf('?s=Battle&ss=ar')!=-1)
			l_translateArena();
		if(urlk.indexOf('?s=Battle&ss=rb')!=-1)
			l_translateROB();
		if(urlk.indexOf('?s=Character&ss=se')!=-1)
			l_translateSettings();
		if(urlk.indexOf('?s=Character&ss=tr')!=-1)
			l_translateTraining();
		if(!nOu(document.querySelector('#battleform')))
			l_translateBattleScreen();
		if(urlk.indexOf('?s=Character&ss=it')!=-1)
			l_translateBSlotScreen();
		if(!nOu(unsafeWindow.common))
			l_OverridePopupBox();
		if(urlk.indexOf('?s=Character&ss=in')!=-1)
			l_translateInventories();
	}
	function l_translatelogin(){
		var tra0=gtd_LoginScreen();
		tra0.TransDElems(document.querySelectorAll('a'));
		tra0.TransDElems(document.querySelectorAll('p'));
		tra0.TransDElems(document.querySelectorAll('td'));
	}
	function l_translateTopMenu(){
		var tra1=gtd_TopMenu();
		tra1.TransDElems(document.querySelectorAll("#navbar div.cnbd div.cnbc div.cnbs div.fd4 > div"));
	}
	function l_translateClb(){
		var tra2=gtd_LeftClb();
		tra2.TransDElems(document.querySelectorAll('.clb div.fd4 > div'));
		tra2.TransDElems(document.querySelectorAll('.clb div.fd2 > div'));
	}
	function l_translateCC(){
		var tra3=gtd_ScreenCC00();
		tra3.TransDElems(document.querySelectorAll('#mainpane div.fd4 > div'));
	}
	function l_translateArena(){
		var tra4=gtd_ArenaScreen();
		tra4.TransDElems(document.querySelectorAll('#mainpane div.fd2 > div'));
	}
	function l_translateROB(){
		var tra5=gtd_ROBScreen();
		tra5.TransDElems(document.querySelectorAll('#mainpane div.fd4 > div'));
		tra5.TransDElems(document.querySelectorAll('#mainpane div.fd2 > div'));
	}
	function l_translateSettings(){
		var tra6=gtd_SetupScreen();
		tra6.TransDElems(document.querySelectorAll('#mainpane #settingsdiv div.fd2 > div'));
		tra6.TransDElems(document.querySelectorAll('#mainpane #settingsdiv div.fd4 > div'));
		tra6.TransDElems(document.querySelectorAll('#mainpane #settingsdiv tr > td'));
		tra6.TransDElems(document.querySelectorAll('#mainpane #settingsdiv p'));
	}
	function l_translateTraining(){
		var tra7=gtd_TrainingScreen();
		tra7.TransDElems(document.querySelectorAll('#mainpane p'));
		tra7.TransDElems(document.querySelectorAll('#mainpane div.fd4 > div'));
		tra7.TransDElems(document.querySelectorAll('#mainpane div.fd2 > div'));
	}
	function l_translateBattleScreen(){
		var tra8=gtd_BattleLog();
		tra8.TransDElems(document.querySelectorAll('#togpane_log tr > td.t3'));
		tra8.TransDElems(document.querySelectorAll('#togpane_log tr > td.t3b'));
		tra8.TransDElems(document.querySelectorAll('div.btcp div.fd4 > div'));
	}
	function l_translateBSlotScreen(){
		var tra9=gtd_BattleSlot();
		tra9.TransDElems(document.querySelectorAll('#mainpane div.fd4 > div'));
		tra9.TransDElems(document.querySelectorAll('#mainpane div.fd2 > div'));
	}
	function l_translatePopupBox(){
		var tra10=gtd_PopupBox();
		tra10.TransDElems(document.querySelectorAll('#popup_box div'));
	}
	function l_OverridePopupBox(){
		v_pbf=unsafeWindow.common.show_popup_box;
		unsafeWindow.common.show_popup_box=function(A,u,B,w,q,C,z,v,m,s){
			v_pbf(A,u,B,w,q,C,z,v,m,s);
			l_translatePopupBox();
		};
	}
	function l_translateInventories(){
		var tra10=gtd_Inventory();
		tra10.TransDElems(document.querySelectorAll('#mainpane div.fd2 > div'));
		tra10.TransDElems(document.querySelectorAll('#mainpane div.fd4 > div'));
	}
	var v_pbf;
}
StartLogic();
}catch(err){
	alert('번역 스크립트 오류\n'+err.message);
}