// ==UserScript==
// @name                Pacotão WME Brasil
// @namespace           http://greasemonkey.chizzum.com
// @description         Permite fechar UR velhas, fazer um comentário inicial nas URs sem comentário e outras funções bacanas no WME.
// @include             https://*.waze.com/*editor*
// @include             https://www.waze.com/*/editor/*
// @version             0.88
// @grant               ericdanieldavid
// @downloadURL https://update.greasyfork.org/scripts/6761/Pacot%C3%A3o%20WME%20Brasil.user.js
// @updateURL https://update.greasyfork.org/scripts/6761/Pacot%C3%A3o%20WME%20Brasil.meta.js
// ==/UserScript==

var tentativaJNF = 0;
var tentativaHighlights = 0;
var pararRevisao = false;
var DesabilitaAutoSave = false;
var champsBrazil = [
	"antigerme",
	"scarlogarcia",
	"ciamagno",
	"Tchelow",
	"thiagob76",
	"hebermc",
	"vladpierami",
	"mauriciomartins82",
	"alexnrocha",
	"adrianojbr",
	"canetafina",
	"quantumjedi",
	"reginamaga",
	"amfadel",
	"pedrottic",
	"tenlucas",
	"abnerw13",
	"gfariass",
	"mikenit",
	"ericdanieldavid",
	"finesko"
];

/*INICIO Inicialização de componentes e HTML*/

function getId(node) 
{
  return document.getElementById(node);
}

function getByClass(classname, node) 
{
  if(!node) node = document.getElementsByTagName("body")[0];
  var a = [];
  var re = new RegExp('\\b' + classname + '\\b');
  var els = node.getElementsByTagName("*");
  for (var i=0,j=els.length; i<j; i++)
    if (re.test(els[i].className)) a.push(els[i]);
  return a;
}

function MUV_bootstrap()
{
	console.log('init');
	if (typeof(unsafeWindow) === "undefined"){
		unsafeWindow = ( function () {
			var dummyElem = document.createElement('p');
			dummyElem.setAttribute('onclick', 'return window;');
			return dummyElem.onclick();
		}) ();
	}
	/* begin running the code! */
	window.setTimeout(MUV_init, 500);
}

function MUV_html()
{
	/*Permissões.*/
	var JNFInstalado = (typeof(WMETB_JNF_FixNode) != 'undefined' || typeof(WME_JNF_FixNode) != 'undefined');
	var ResolvedorSenior = (unsafeWindow.W.loginManager.user.rank >= 3);
	var userChamp = champsBrazil.indexOf(unsafeWindow.W.loginManager.user.userName) != -1;	
	
	/*HTML de verdade*/

	pckControls = document.createElement('section');
	pckControls.style.fontSiaze = '12px';
	pckControls.id = 'pckControls'; 
	tabbyHTML = '<b><a href="#" target="_blank">Pacotão WME Brasil</a></b>';
	tabbyHTML += '<p><table border=0 width="100%"><tr>';
	/*aba URS, link e definição*/
	tabbyHTML += '<td valign="center" align="center" id="_tabURS"><a href="#" id="_linkURs" style="text-decoration:none;font-size:12px">URs</a></td>';
	/*aba Outras, link e definição*/
	tabbyHTML += '<td valign="center" align="center" id="_tabVias"><a href="#" id="_linkVias" style="text-decoration:none;font-size:12px">Vias</a></td>';
	/*aba Vias, link e definição*/
	tabbyHTML += '<td valign="center" align="center" id="_tabOutras"><a href="#" id="_linkOutras" style="text-decoration:none;font-size:12px">Outras Funções</a></td>';
	tabbyHTML += '</tr></table>';
	pckControls.innerHTML = tabbyHTML;
	
	/*conteúdo aba URS*/
	abaURS = document.createElement('p');
	abaURS.id = 'abaURS';
	abaURS.style = 'height:300px!important;';
	abaURS.innerHTML = '<br>';
	abaURS.innerHTML += '<a id="dadosURs" download="" href="">Obter CVS de informações das URs</a>';
	abaURS.innerHTML += '<input type="button" id="btnSeguirTodas" value="Seguir todas as URs visíveis"/><hr>';
	abaURS.innerHTML +=  'Apenas nas URs abertas há mais de: <input type="number" min="0" value="0" size="2" style="width:50px;line-height:14px;height:22px;margin-bottom:4px;"	id="_inputDiasMensagemInicial"/><br/>';
	abaURS.innerHTML +=  '<input type="text" id="_txtAberturaUR" value="" style="width:256px;line-height:25px;height:22px;margin-bottom:4px;"/><br/>';	
	abaURS.innerHTML +=  '<input type="button" id="_MUV_btnAbre" value="Iniciar comunicação de URs"/><hr>';	
	abaURS.innerHTML +=  'Qtt dias abertura: <input type="number" min="7" value="15" size="2" style="width:50px;line-height:14px;height:22px;margin-bottom:4px;"	id="_inputDiasAberturaUR"/><br/>';
	abaURS.innerHTML +=  'Qtt dias últ comentário: <input type="number" min="3" value="7" size="2" style="width:50px;line-height:14px;height:22px;margin-bottom:4px;" id="_inputDiasComentarioUR"/><br/>';
	abaURS.innerHTML +=  '<input type="text" id="_txtFechamentoUR" value="" style="width:256px;line-height:25px;height:22px;margin-bottom:4px;"/><br/>';	
	abaURS.innerHTML +=  '<input type="checkbox" id="chkFecharApenasVisiveis" checked="true" /> Apenas as visíveis.<br/>';	
	abaURS.innerHTML +=  '<input type="button" id="_MUV_btnFecha" value="Fechar URs não identificadas" /><br/><br/>';
	if (ResolvedorSenior)
	{
		abaURS.innerHTML +=  '<input type="button" id="_btnResolver" value="Resolver todas as URs" /><br/><br/>';
		abaURS.innerHTML +=  '<select id="selFanfarrao" style="width:100px;line-height:25px;height:22px;margin-bottom:4px;"></select><br/>';
		abaURS.innerHTML +=  '<input type="button" id="btnFanfarrao" value="Contar URs fechadas pelo fanfarrão" /><hr>';
	}
	
	
	abaVias = document.createElement('p');
	abaVias.id = 'abaVias';
	abaVias.style = 'height:300px!important;';
	abaVias.innerHTML = '<br>';
	if(JNFInstalado)
	{
		abaVias.innerHTML +=  '<input type="button" id="_MUV_btnMataReverse" value="Corrigir reverses e soft-turns" /><br/><br/>';
	}
	if (ResolvedorSenior)
	{
		abaVias.innerHTML +=  '<input type="button" id="btnPermitirTudo" value="Permitir todas as conversões" /><br/><br/>';
	}
	if (userChamp)
	{
		abaVias.innerHTML +=  'Revisão de Nomes<br/>';
		abaVias.innerHTML +=  '<input type="button" id="btnIniciarRevisao" value="Iniciar" />&nbsp&nbsp';
		abaVias.innerHTML +=  '<input type="button" id="btnPararRevisao" value="Parar" disabled="true" /><br/><br/>';	
	}
	
	abaVias.innerHTML +=  '<input type="checkbox" id="_chkCidade" /> Filtrar vias por cidade.<br/>';
	abaVias.innerHTML +=  '<select id="_selCidadesOrigem" style="width:100px;line-height:25px;height:22px;margin-bottom:4px;"></select><br/><br/>';
	abaVias.innerHTML +=  '<input type="checkbox" id="_chkUsuario" /> Filtrar vias/refererencias por últ. editor.<br/>';
	abaVias.innerHTML +=  '<select id="_selUsuario" style="width:100px;line-height:25px;height:22px;margin-bottom:4px;"></select><br/><br/>';
	abaVias.innerHTML +=  '<input type="button" id="_btnApagarNumeros" value="Apagar todos números das casas" /><br/><br/>';
		
	/*conteúdo aba Outras*/
	abaOutrasFuncoes = document.createElement('p');	
	abaOutrasFuncoes.id = "abaOutrasFuncoes";
	abaOutrasFuncoes.style = 'height:300px!important;';
	abaOutrasFuncoes.innerHTML = '<br>';	
	abaOutrasFuncoes.innerHTML +=  '<input type="button" id="_btnApagarRadaresNaoAprovados" value="Apagar radares não aprovados" /><br/><br/>';
	
	if (userChamp)
	{
		abaOutrasFuncoes.innerHTML +=  'Places updates<br/>';
		abaOutrasFuncoes.innerHTML +=  '<input type="button" id="btnPlacesTrue" value="Aprovar todos" />&nbsp';
		abaOutrasFuncoes.innerHTML +=  '<input type="button" id="btnPlacesFalse" value="Reprovar todos" /><br/><br/>';
	}
	
	abaOutrasFuncoes.innerHTML +=  '<input type="checkbox" id="_chkPostos" checked="true" /> Realçar postos problemáticos (Esso/Ypiranga/sem nome).<br/><br/>';
	abaOutrasFuncoes.innerHTML +=  '<input type="button" id="btnGmaps" value="Exibir no Google Maps" /><br/><br/>';
	abaOutrasFuncoes.innerHTML +=  '<input type="button" id="btnZoom" value="Exibir com mais zoom" /><br/><br/>';	
	abaOutrasFuncoes.innerHTML +=  '<input type="button" id="_btnUndoAll" value="Desfazer todas as alterações" /><br/><br/>';
	
	/*rodapézinho*/
	rodapezinho = document.createElement('div');
	rodapezinho.id = 'rodapezinho';
	rodapezinho.style = 'padding-bottom:30px';
	rodapezinho.innerHTML +=  '<input type="checkbox" id="chkAutoSave" value="0">Habilitar Auto-Save após 30 edições? (cuidado!!)</input><br/>';	
	rodapezinho.innerHTML +=  '<input type="checkbox" id="chkResave" value="0">Re-Tentar salvar após erro? (cuidado!!)</input>';	
	
	var userTabs = document.getElementById('user-info');
	var navTabs = getByClass('nav-tabs', userTabs)[0];
	var tabContent = getByClass('tab-content', userTabs)[0];
	newtabUR = document.createElement('li');
	newtabUR.innerHTML = '<a href="#sidepanel-mastersbrasil" data-toggle="tab">Pacotão WME Brasil</a>';
	navTabs.appendChild(newtabUR);
	pckControls.id = "sidepanel-mastersbrasil";
	pckControls.className = "tab-pane";
	tabContent.appendChild(pckControls);
		
	pckControls.appendChild(abaURS);
	pckControls.appendChild(abaVias);
	pckControls.appendChild(abaOutrasFuncoes);
	pckControls.appendChild(rodapezinho);
	
	masterSetStyles(abaURS);
	masterSetStyles(abaVias);
	masterSetStyles(abaOutrasFuncoes);

	ExibirFuncoesUR();
	
	//Eventos usuário.
	//Abas
	getId('_linkURs').onclick = ExibirFuncoesUR;
	getId('_linkVias').onclick = ExibirFuncoesVias;
	getId('_linkOutras').onclick = ExibirFuncoesOutras;
	//Botões
	getId('dadosURs').onclick = ObterDadosURs;
	getId('btnSeguirTodas').onclick = SeguirTodasURsVisiveis;	
	getId('_MUV_btnAbre').onclick = MUV_abre;
	getId('_MUV_btnFecha').onclick = MUV_fecha;
	if (ResolvedorSenior)
	{
		getId('_btnResolver').onclick = MUV_resolve;
		getId('btnFanfarrao').onclick = ContarURsFanfarrao;
	}
	if(JNFInstalado)
	{
		getId('_MUV_btnMataReverse').onclick = MUV_MataReverse;
	}
	if (ResolvedorSenior)
	{
		getId('btnPermitirTudo').onclick = MUV_btnEnablePerms;
	}
	if (userChamp)
	{
		getId('btnIniciarRevisao').onclick = FaxinaNomesIniciar;
		getId('btnPararRevisao').onclick = FaxinaNomesParar;
	}	
	getId('_btnApagarRadaresNaoAprovados').onclick = deleteAllUnkCameras;
		
	if (userChamp)
	{		
		getId('btnPlacesTrue').onclick = AtualizarPlacesTrue;
		getId('btnPlacesFalse').onclick = AtualizarPlacesFalse;
	}
	
	getId('_btnApagarNumeros').onclick = ApagarTodosNumeros;	
	
	getId('btnGmaps').onclick = LinkGMaps;
	getId('btnZoom').onclick = LinkZoomed;
	
	getId('_btnUndoAll').onclick = DesfazerTudo;

	//DropdownLists
	if (ResolvedorSenior)
	{
		getId('selFanfarrao').onfocus = carregarFanfarroes;
	}
	
	getId('_chkCidade').onclick = ViasCidades;
	getId('_selCidadesOrigem').onfocus = CarregarComboCidades;
	getId('_selCidadesOrigem').onchange = ViasCidades;
	
	getId('_chkUsuario').onclick = ProcurarSegmentosUsuario;
	getId('_selUsuario').onfocus = carregarUsuarios;
	getId('_selUsuario').onchange = ProcurarSegmentosUsuario;
	
	//Registrando eventos automatizados
	window.setInterval(AlternativosAparecer,2500);
	
	window.setInterval(ProcuraPostos,3500);	
	unsafeWindow.W.model.actionManager.events.register("afteraction", null, autoSave);
	unsafeWindow.W.model.actionManager.events.register("afterundoaction", null, autoSave);
	unsafeWindow.W.model.actionManager.events.register("afterclearaction", null, autoSave);
}

function AlternativosAparecer()
{
	var MultAlternativeName = document.createElement('section');
	MultAlternativeName.id = 'MultAlternativeName';
	MultAlternativeName.style = 'height:300px!important;';
	MultAlternativeName.innerHTML =  '<br/>Nome alternativo único:<br/>';	
	MultAlternativeName.innerHTML +=  '<input type="text" id="txtNomeAlternativo" value="" style="width:200px;line-height:25px;height:22px;margin-bottom:4px;"/>';
	MultAlternativeName.innerHTML +=  '<input type="button" id="btnAplicarAlternativo" value="Aplicar" class="btn btn-default"/><br/><br/><br/>';
	MultAlternativeName.innerHTML +=  '<input type="button" id="btnRevisarNomes" value="Revisar nomes" class="btn btn-default"/><br/>';
	
	var painel = document.getElementsByClassName('attributes-form side-panel-section')[0];
	if ($('input[id="txtNomeAlternativo"]').length == 0 && Waze.selectionManager.selectedItems.length > 1)
	{
		painel.appendChild(MultAlternativeName);
		document.getElementById('btnAplicarAlternativo').onclick = AplicarNomeAlternativo;
		
		document.getElementById('btnRevisarNomes').onclick = FaxinaNomesSelecionados;
	}
}

function MUV_init()
{
	//	Waze object needed
	MUV_Waze = unsafeWindow.W;
	if(typeof(MUV_Waze) === 'undefined'){
		console.log('unsafeWindow.W NOK');
		window.setTimeout(MUV_init, 500);
		return;
	}
	MUV_waze_loginmanager = MUV_Waze.loginManager;
	if(typeof(MUV_waze_loginmanager) === 'undefined'){
		console.log('login manager NOK');
		window.setTimeout(MUV_init, 500);
		return;
	}
	MUV_waze_user = MUV_waze_loginmanager.user;
	if(typeof(MUV_waze_user) === 'undefined' || MUV_waze_user === null){
		console.log('user NOK');
		window.setTimeout(MUV_init, 500);
		return;
	}
	if(MUV_waze_user.rank < 2){
		console.log('Funções apenas disponíveis para níveis superiores.');
		return;
	}
	
	//Se tiver o URO+ ele usa o objeto de lá, senão cria um aqui.
	if(typeof wazeModel == "undefined")
	{
		if(typeof unsafeWindow.wazeModel != "undefined")
		{
			wazeModel = unsafeWindow.wazeModel;
		}
		else if(typeof unsafeWindow.W != "undefined")
		{
			if(typeof unsafeWindow.W.controller != "undefined")
			{
				if(typeof unsafeWindow.W.controller.model != "undefined")
				{
				   wazeModel = unsafeWindow.W.controller.model;
				}
				else
				{
					window.setTimeout(MUV_init, 500);
				}
			}
			else
			{
				window.setTimeout(MUV_init, 500);
			}
		}
		else
		{
			window.setTimeout(MUV_init, 500);
		}
	}
	
	//	Waze GUI needed
	MUV_userInfos = getId('user-details');
	if(typeof(MUV_userInfos) === 'undefined'){
		console.log('userInfos NOK');
		window.setTimeout(MUV_init, 500);
		return;
	}
	
	//Dá uma espera pra ver se o JNF carregou....
	if (typeof(WMETB_JNF_FixNode) == 'undefined' && typeof(WME_JNF_FixNode) == 'undefined' && tentativaJNF < 5)
	{
		window.setTimeout(MUV_init, 500);
		tentativaJNF++;
		console.log('tentativaJNF' + tentativaJNF);
		return;
	}
	
	if (typeof(wmech_version) == 'undefined' && tentativaHighlights < 5)
	{
		window.setTimeout(MUV_init, 500);
		tentativaHighlights++;
		return;
	}
	
	MUV_html();
}

function masterSetStyles(obj)
{
   obj.style.fontSize = '12px';
   obj.style.lineHeight = '100%';
   obj.style.overflow = 'auto';
   obj.style.height = (window.innerHeight * 0.55) + 'px';
}
/*FINAL */

/*INICIO navegabilidade*/
function AtivarTab(_id)
{
	console.log('ativando');
	var e = document.getElementById(_id);
	e.style.backgroundColor = "aliceblue";
	e.style.borderTop = "1px solid";
	e.style.borderLeft = "1px solid";
	e.style.borderRight = "1px solid";
	e.style.borderBottom = "0px solid";
}

function InativarTab(_id)
{
   var e = document.getElementById(_id);
   e.style.backgroundColor = "white";
   e.style.borderTop = "0px solid";
   e.style.borderLeft = "0px solid";
   e.style.borderRight = "0px solid";
   e.style.borderBottom = "1px solid";
}

function InativarTodasTab()
{
	InativarTab("_tabURS");
	InativarTab("_tabVias");
	InativarTab("_tabOutras");
   
	document.getElementById('abaURS').style.display = 'none';
	document.getElementById('abaVias').style.display = 'none';
	document.getElementById('abaOutrasFuncoes').style.display = 'none';
}

function ExibirFuncoesUR()
{
   InativarTodasTab();
   AtivarTab("_tabURS");
   document.getElementById('abaURS').style.display = 'block';
   return false;
}

function ExibirFuncoesVias()
{
   InativarTodasTab();
   AtivarTab("_tabVias");
   document.getElementById('abaVias').style.display = 'block';
   return false;
}

function ExibirFuncoesOutras()
{
   InativarTodasTab();
   AtivarTab("_tabOutras");
   document.getElementById('abaOutrasFuncoes').style.display = 'block';
   return false;
}
/*FINAL */

/*INICIO funções de botões*/
function ObterDadosURs()
{
	var dataCache = 
	[
		'id',
		'type',
		'typeText',
		'description',
		'state',
		'driveDate',
		'resolvedOn',
		'updatedOn',
		'updatedBy',
		'comments'
	];

	for (var urobj in wazeModel.updateRequestSessions.objects)
	{
		var ureq = wazeModel.updateRequestSessions.objects[urobj];
		var murInfo = wazeModel.mapUpdateRequests.objects[urobj];
			
		var drive = new Date(); drive.setTime(murInfo.attributes.driveDate);
		var resolved = new Date(); resolved.setTime(murInfo.attributes.resolvedOn);
		var updated  = new Date(); resolved.setTime(murInfo.attributes.updatedOn);
		
		var strMensagem = '';
		
		for (i=0;i<ureq.comments.length;i++) 
		{
			var updatedBy = ureq.comments[i].userID;
			
			var user = wazeModel.users.get(updatedBy);
			var nome = 'Wazer(reportante)';
			if (updatedBy != -1)
			{
				if (user != null)
				{				
					nome = user.userName;
				}
			}		
			
			strMensagem += nome + ': ' + ureq.comments[i].text;
		}
		
		var resolvedBy = murInfo.attributes.updatedBy; 
		var nomeResolvedBy = '';
		if (resolvedBy != -1)
		{
			if (wazeModel.users.get(resolvedBy) != null)
			{
				nomeResolvedBy = wazeModel.users.get(resolvedBy).userName;
			}
		}
		
		var descricao = murInfo.attributes.description;
		
		if (descricao != null && descricao != '')
		{
			descricao = descricao.replace(',','_').replace(new RegExp(String.fromCharCode(10), 'g'), '');
		}
		
		dataCache.push('\n'+
			murInfo.attributes.id,
			murInfo.attributes.type,
			murInfo.attributes.typeText,
			descricao,
			murInfo.getState(),
			drive.toDateString(),
			resolved.toDateString(),
			updated.toDateString(),
			nomeResolvedBy,
			strMensagem.replace(',','_').replace(new RegExp(String.fromCharCode(10), 'g'), '')
		);
		
		$('#dadosURs').each(function(){
			this.href = 'data:text/csv;base64,' + btoa(dataCache);
			this.download = 'URs.csv';
		});
	}
}

function SeguirTodasURsVisiveis()
{
	if (confirm('Deseja mesmo seguir todas as URs?'))
	{
		var contagemSeguindo = 0;
		for (var urobj in wazeModel.updateRequestSessions.objects)
		{
			var ureq = wazeModel.updateRequestSessions.objects[urobj];
				
			for (var murobj in wazeModel.mapUpdateRequests.objects)
			{
				var murInfo = wazeModel.mapUpdateRequests.objects[murobj];
				
				if (murInfo.attributes.id == ureq.id)
				{
					if (Waze.map.getExtent().toGeometry().containsPoint(murInfo.geometry))
					{
						ureq.toggleFollowConversation();					
						contagemSeguindo++;
					}
					break;					
				}
			}		
		}
		
		alert('Você está seguindo ' + contagemSeguindo + 'URs');
	}
}

function MUV_abre()
{
	var cont = 0;
	var diasAberturaMsgInicial = getId('_inputDiasMensagemInicial').value;
	
	for (var urobj in wazeModel.updateRequestSessions.objects)
	{
		var ureq = wazeModel.updateRequestSessions.objects[urobj];
		if (ureq.comments.length == 0 && ureq.open == true)
		{
			for (var murobj in wazeModel.mapUpdateRequests.objects)
			{
				var murInfo = wazeModel.mapUpdateRequests.objects[murobj];
				var dateNow = new Date();
				var diasAbertura = Math.floor((dateNow.getTime() - murInfo.attributes.driveDate) / 86400000);
				
				if (murInfo.attributes.id == ureq.id)	
				{
					if (
							(murInfo.attributes.description == null || murInfo.attributes.description == '')
							&&
							diasAbertura >= diasAberturaMsgInicial
							&&
							Waze.map.getExtent().toGeometry().containsPoint(murInfo.geometry)
						)
					{
						var textoAbertura = getId('_txtAberturaUR').value;
						if (textoAbertura == '')
						{
							textoAbertura = 'Olá Wazer! Você poderia informar detalhes sobre seu problema reportado?';
						}
					
						ureq.addComment(textoAbertura);
						cont = cont + 1;
						break;
					}
				}
			}
		}
	}

	alert('Foi feita o envio de comentário inicial em ' + cont + ' URs.');
}

function MUV_fecha()
{
	var diasConfAbertura = getId('_inputDiasAberturaUR').value;
	var diasConfComentario = getId('_inputDiasComentarioUR').value;
	
	var userChamp = champsBrazil.indexOf(unsafeWindow.W.loginManager.user.userName) != -1;
	
	if ((diasConfAbertura < 7 ||
		diasConfComentario < 3) && !userChamp)
	{
		alert('Parâmetros para fechamento de UR inválidos.');
		return;
	}

	for (var urobj in wazeModel.updateRequestSessions.objects)
	{
		var ureq = wazeModel.updateRequestSessions.objects[urobj];
		if (ureq.comments.length > 0 && ureq.open == true)
		{
			var dateNow = new Date();		
			var diasComentario = Math.floor((dateNow.getTime() - ureq.comments.last().createdOn) / 86400000);
			
			if (diasComentario >= diasConfComentario)
			{
				if (ureq.comments.last().userID != -1
				&& ureq.comments.last().text.indexOf('encerrar') == -1 
				&& ureq.comments.last().text.indexOf('fechar') == -1 
				&& ureq.comments.last().text.indexOf('finalizar') == -1 
				&& ureq.comments.last().text.indexOf('feche') == -1 
				&& ureq.comments.last().text.indexOf('encerre') == -1 
					)//Não foi o reportante o ultimo, não tem as palavras chaves no último comentário
				{
					for (var murobj in wazeModel.mapUpdateRequests.objects)
					{
						var murInfo = wazeModel.mapUpdateRequests.objects[murobj];
						var diasAbertura = Math.floor((dateNow.getTime() - murInfo.attributes.driveDate) / 86400000);
						
						if (murInfo.attributes.id == ureq.id)
						{
							if (diasAbertura >= diasConfAbertura
								&& murInfo.attributes.permissions != 0) //Só onde realmente tem permissão.
							{
								var fechamento = false;
								var ultimato = false;
								
								//Hora de brincar e analisar o histórico.
								if (ureq.comments.length != 1)
								{
									var FoiCobradoAgora = CobrarEditor(ureq);
									if (FoiCobradoAgora)
									{
										break;
									}
								}
								else
								{
									ultimato = true;
								}
								//Final análise.
								
								if (getId('chkFecharApenasVisiveis').checked == false)
								{
									fechamento = true;
								}
							
								if (getId('chkFecharApenasVisiveis').checked == true
									&& Waze.map.getExtent().toGeometry().containsPoint(murInfo.geometry)
								)
								{		
									fechamento = true;									
								}
							
							
								if (fechamento == true)
								{	
									var textFechamento = getId('_txtFechamentoUR').value;
									if (textFechamento == '')
									{
										textFechamento = 'Olá, Wazer. ';
										
										if (ultimato)
										{
											textFechamento += 'Não conseguiremos resolver o problema sem sua colaboração. '
										}
										
										textFechamento += 'Este alerta será encerrado por ter ficado um longo período inativo. Caso tenha alguma dúvida pode nos contatar através do fórum de editores. Sabia que você também pode ajudar nossa comunidade editando os mapas e deixando sua região atualizada? Mais info: https://www.waze.com/forum/viewtopic.php?f=298&t=31744';
									}

									ureq.addComment(textFechamento);
									//murInfo.setState(1);
									//unsafeWindow.W.model.actionManager.add(new unsafeWindow.W.Action.UpdateRequest(murInfo,1));
									
									$('div[data-id='+murInfo.attributes.id+']').click();
									$('label[for="state-not-identified"]').click();
									$('button[class="btn btn-primary done"]').click();
									break;
								}
							}
						}
					}
				}
				else 
				{
					if (ureq.comments.last().userID == -1 
							&& diasComentario >= diasConfAbertura
						)
					{
						var FoiCobrado = CobrarEditor(ureq);
						if (FoiCobrado)
						{
							break;
						}
					}
				}
			}
		}
	}
}

function CobrarEditor(ureq)
{
	if (ureq.comments.last().text.indexOf('inatividade') == -1)
	{
		//Obter os editores que comentaram.
		
		var strMensagem = 'Prezado(s) ';
		
		var distId = new Array();
		for (i=0;i<ureq.comments.length;i++) 
		{
			var updatedBy = ureq.comments[i].userID;
			if (updatedBy != -1
				&& updatedBy != wazeModel.loginManager.user.id
				)
			{
				if (distId.indexOf(updatedBy) == -1)
				{
					var user = wazeModel.users.get(updatedBy);
					strMensagem += user.userName + ', ';
					
					distId.push(updatedBy);
				}
				
				if (updatedBy == 46379388 && wazeModel.loginManager.user.id == 12739915)
				{
					//ericdanieldavid não cobra mais o OlavoAG.
					return true;
				}
			}
		}
		strMensagem += ' o caso foi solucionado? Precisa(m) de apoio? Wazer, por favor, caso o alerta não tenha sido solucionado nos dê um retorno, caso contrário em mais alguns dias será esgotado o prazo de inatividade do alerta.';
		
		//Varer o array e tirar o próprio usuário. Se for só eu, mata! 
		if (distId.length > 0)
		{
			ureq.addComment(strMensagem);
			return true;
		}
	}
	
	return false;
}

function MUV_resolve()
{
	if (unsafeWindow.W.map.zoom < 5)
	{
		alert('Aumente o zoom por favor. Ele está em ' + unsafeWindow.W.map.zoom + ', porém deve estar em 5 ou mais para liberação desta função.');
		return;
	}	
		
	var requestsResolver = new Array();
	for (var urobj in wazeModel.updateRequestSessions.objects)
	{
		var ureq = wazeModel.updateRequestSessions.objects[urobj];
		if (ureq.comments.length == 0 && ureq.open == true)
		{	
			for (var murobj in wazeModel.mapUpdateRequests.objects)
			{
				var murInfo = wazeModel.mapUpdateRequests.objects[murobj];
				
				if (murInfo.attributes.id == ureq.id)
				{
					if (Waze.map.getExtent().toGeometry().containsPoint(murInfo.geometry))
					{		
						requestsResolver.push(murInfo);
					}
					break;					
				}
			}
		}
	}
	
	//primeiro conta, se der confirma ai sim marca como resolvido.
	if (requestsResolver.length > 0)
	{
		if (confirm('Serão resolvidas ' + requestsResolver.length + ' URs. Você tem certeza disso?'))
		{
			var index;
			for (index = 0; index < requestsResolver.length; ++index) 
			{
				var id = requestsResolver[index].attributes.id;
				$('div[data-id='+id+']').click();
				
				$('label[for="state-solved"]').click();
				$('button[class="btn btn-primary done"]').click();
			}
		}
	}
	else
	{
		alert('Nenhuma UR capturada');
	}
}

function ContarURsFanfarrao()
{
	var count = 0;
	for (var urobj in wazeModel.updateRequestSessions.objects)
	{
		var ureq = wazeModel.updateRequestSessions.objects[urobj];

		for (var murobj in wazeModel.mapUpdateRequests.objects)
		{
			var murInfo = wazeModel.mapUpdateRequests.objects[murobj];
			if (murInfo.attributes.id == ureq.id)
			{
				if (murInfo.attributes.resolvedBy == getId('selFanfarrao').value)
				{
					count++;
				}
				break;
			}
		}
	}
	alert('O fanfarrão encerrou ' + count + ' URs.');
}

function CorretorDeNo(tipoCorrecao)
{
	DesabilitaAutoSave = true;
	var ModoBruto = false;
	var inicioExecucao = Date.now();
	
	for(var node in wazeModel.nodes.objects)
	{
		if (inicioExecucao + 15000 < Date.now())
		{
			if (confirm('Execução demorada. Vc quer continuar a executar por mais 15 segundos? Caso contrário, cancele, salve e aumente o zoom.'))
			{
				inicioExecucao = Date.now();
			}
			else
			{			
				break;
			}
		}	
	
		var nozinho = wazeModel.nodes.objects[node];
		var nocorrigido = false;
		
		if (tipoCorrecao == 'Reverse')
		{
			try 
			{
				if(typeof(WME_JNF_FixNode) != 'undefined')
				{
					WME_JNF_FixNode(nozinho, true);
					nocorrigido = true;
				}
			}
			catch(err) { }	
			
			try 
			{
				if(nocorrigido == false && typeof(WMETB_JNF_FixNode) != 'undefined')
				{
					WMETB_JNF_FixNode(nozinho, true);
				}
			}
			catch(err) { }	
		}
	
		if (tipoCorrecao == 'Permissao')
		{
			try
			{
				if (Waze.map.getExtent().toGeometry().containsPoint(nozinho.geometry))
				{
					wazeModel.actionManager.add(new ModifyAllConnections(nozinho, true));
				}
			}
			catch(err) { }
		}
		
		if (wazeModel.actionManager.unsavedActionsNum() > 150)
		{
			if (ModoBruto == false &&
			confirm('Foram geradas mais de 150 alterações.\n\nSe for possível dar mais zoom, dê OK, salve o resultado atual e execute novamente com mais zoom. \n\nSe não for possível, clique em Cancelar - porém esteja ciente que podem ocorrer erros ao salvar.'))
			{
				break;
			}
			else
			{
				ModoBruto = true;
			}			
		}
	}
	DesabilitaAutoSave = false;

	if (getId('chkAutoSave').checked)
	{
		SalvaTudo();
	}
}

function MUV_MataReverse()
{
	CorretorDeNo('Reverse');
}

function MUV_btnEnablePerms()
{
	CorretorDeNo('Permissao');
}

function AplicarNomeAlternativo()
{
	var NomeAlternativo = document.getElementById('txtNomeAlternativo').value;
	var todosSelecionados = new Array()
	for (i=0;i<Waze.selectionManager.selectedItems.length;i++) 
	{
		todosSelecionados.push(Waze.selectionManager.selectedItems[i].geometry.id);
	}
	var quantidadeItens = todosSelecionados.length;
	if (quantidadeItens > 0)
	{
		DefinirAlternativo(NomeAlternativo, 0, quantidadeItens, todosSelecionados);
	}
}

function DefinirAlternativo(Nome, Atual, Total, todosSelecionados)
{
	var geometryID = todosSelecionados[Atual];
	var segmentoAlternar;
		
	for	(var seg in wazeModel.segments.objects)
	{
		var segmento = wazeModel.segments.objects[seg];
		
		if (segmento.geometry.id == geometryID)
		{
			segmentoAlternar = segmento;
			break;
		}
	}
	
	console.log(segmentoAlternar);
	
	var t = new Array(); 
	t.push(segmentoAlternar);
	Waze.selectionManager.select(t);
	
	$('a[class="address-edit-btn"]').click();
	$('a[class="add-alt-street-btn"]').click();
	$('tr[class="alt-street-form-template new-alt-street"]').find('input[name="streetName"]').attr("value", Nome);
	$('div[class="address-form-actions"]').find('button[class="btn btn-primary"]').click();	
	
	if (Atual + 1 < Total)
	{
		window.setTimeout(function() {
			DefinirAlternativo(Nome,Atual+1,Total, todosSelecionados);
		}, 1500);
	}
}

function deleteAllUnkCameras() 
{
    var obj = wazeModel.cameras.objects;
    var foundCameras = new Array();
    for (var key in obj) 
	{
        var o = obj[key];
		if (
			o.attributes.permissions < 0 &&
			Waze.map.getExtent().toGeometry().containsPoint(o.geometry) &&
				//Não validadas ainda, criadas por lvl 3 ou superior.
				(
					(o.state != "Delete")
				&&(
					(!o.attributes.validated && 
					o.attributes.rank < 2 &&
					o.attributes.updateBy != wazeModel.loginManager.user.id &&
					o.attributes.cretateBy != wazeModel.loginManager.user.id)
				//Já validadas e que estão sem velocidade
				|| 
					(o.attributes.validated && !(o.attributes.speed > 0) && 
						wazeModel.users.get(o.attributes.updatedBy).rank <= wazeModel.loginManager.user.rank)
					)
				)
			)
		{
				foundCameras.push(o);
		}
    }
    alert('Serão apagados ' + foundCameras.length + ' radares.');
    wazeModel.deleteObjects(foundCameras);
}

function RevisarPlaces(posicaoAtual, subposicao, tipo)
{
	if (pararRevisao)
	{
		return;
	}

	var tempoRevisao = getId('txtTempoRevisao').value * 1000;	

	console.log(tipo + ' p'+posicaoAtual + ' s'+subposicao);
	if (tipo != 'multiple')
	{
		var qttAtualizacao = $('div[class="place-update '+tipo+'"]').length;
		for(i=posicaoAtual;i<qttAtualizacao;i++)
		{
			$('div[class="place-update '+tipo+'"]')[i].click();
			window.setTimeout(function() {
				RevisarPlaces(posicaoAtual+1,subposicao,tipo);
			}, tempoRevisao);
			break;
		}
		if (qttAtualizacao == posicaoAtual + 1)
		{
			if (tipo == 'add_venue')
			{
				tipo = 'add_image';
				posicaoAtual = 0;
			}
			
			if (tipo == 'add_image')
			{
				tipo = 'multiple';
				posicaoAtual = 0;
			}
		}
	}
	else
	{	
		var qtddMultiplos = $('div[class="place-update multiple"]').length;
		for(i=posicaoAtual;i<qtddMultiplos;i++)
		{
			$('div[class="place-update multiple"]')[i].click();
			
			//vê qts tem.
			var subEdicoes = $('div[class="place-update multiple"]')[i].attributes["data-update-count"].value;
			
			if (subposicao == 0)
			{
				window.setTimeout(function() {
					RevisarPlaces(posicaoAtual,subposicao+1,tipo);
				}, tempoRevisao);
			}
			
			for (j = 0;j<subposicao;j++)
			{
				$('button[class="btn btn-default navigation-button"]').click();
				
				if (subposicao - 1 == subEdicoes)
				{
					window.setTimeout(function() {
						RevisarPlaces(posicaoAtual+1,0,tipo);
					}, tempoRevisao);

				}
				else
				{
					window.setTimeout(function() {
						RevisarPlaces(posicaoAtual,subposicao+1,tipo);
					}, tempoRevisao);
				}
				break;
			}
			break;
		}
		
		if (qtddMultiplos == posicaoAtual -1)
		{
			$('[id=btnPlacesRev]')[0].disabled = false;
			$('[id=btnPlacesRevStop]')[0].disabled = true;
		}
	}
}

function AtualizarPlacesTrue()
{
	AtualizarPlaces('add_venue low', 'true');
	AtualizarPlaces('add_image low', 'true');
	AtualizarPlaces('multiple low', 'true');
	
	AtualizarPlaces('add_venue medium', 'true');
	AtualizarPlaces('add_image medium', 'true');
	AtualizarPlaces('multiple medium', 'true');
	
	AtualizarPlaces('add_venue high', 'true');
	AtualizarPlaces('add_image high', 'true');
	AtualizarPlaces('multiple high', 'true');
}

function AtualizarPlacesFalse()
{
	AtualizarPlaces('add_venue low', 'false');
	AtualizarPlaces('add_image low', 'false');
	AtualizarPlaces('multiple low', 'false');
	
	AtualizarPlaces('add_venue medium', 'false');
	AtualizarPlaces('add_image medium', 'false');
	AtualizarPlaces('multiple medium', 'false');
	
	AtualizarPlaces('add_venue high', 'false');
	AtualizarPlaces('add_image high', 'false');
	AtualizarPlaces('multiple high', 'false');
	
}

function AtualizarPlaces(tipo, valor)
{	
	if (tipo != 'multiple')
	{
		var qttAtualizacao = $('div[class="place-update '+tipo+'"]').length;
		for(i=0;i<qttAtualizacao;i++)
		{
			$('div[class="place-update '+tipo+'"]')[i].click();
			$('label[for="approved-'+valor+'"]').click();		
		}
		if (qttAtualizacao > 0)
		{
			$('a[class="close-panel"]').click();
		}
	}
	else
	{
		var qtddMultiplos = $('div[class="place-update multiple"]').length;
		for(i=0;i<qtddMultiplos;i++)
		{
			$('div[class="place-update multiple"]')[i].click();
			
			//vê qts tem.
			var subEdicoes = $('div[class="place-update multiple"]')[i].attributes["data-update-count"].value;
			for (j = 0;j<subEdicoes;j++)
			{
				$('label[for="approved-'+valor+'"]').click();
				$('button[class="btn btn-default navigation-button"]').click();
			}
		}
		if (qtddMultiplos > 0)
		{
			$('a[class="close-panel"]').click();
		}
	}
}

function ProcuraPostos()
{
	if (getId('_chkPostos').checked)
	{
		for(var objs in wazeModel.venues.objects)
		{
			var landmark = wazeModel.venues.objects[objs];
			if (landmark.isGasStation())
			{
				if (landmark.attributes.brand == "Esso" 
					|| landmark.attributes.brand == "Ypiranga"
					|| landmark.attributes.name == ""
					)
				{
					 $('path[id="'+ landmark.geometry.id +'"').css("fill", "#FF0000");
				}
			}
		}
	}
}

function ApagarTodosNumeros()
{
	var painelAberto = false;
	for(i=0;i<wazeMap.controls.length;i++)
	{
		if(wazeMap.controls[i].id != null &&
		wazeMap.controls[i].id.indexOf('W.Control.HouseNumbers') != -1)
		{
			if (wazeMap.controls[i].active)
			{
				painelAberto = true;
				break;
			}
		}
	}
	
	if (!painelAberto)
	{
		alert('Abra o controle de edição de números antes de usar essa função.');
		return;
	}

	var qtddNumeros = $("div[class=number-preview]").length;

	for (var i=0, j=qtddNumeros; i<j; i++)
	{
		$("div[class=number-preview]").trigger('click');
		$("div[class=delete-button]").trigger('click');
	}
}

function getQueryString(link, name)
{
    var pos = link.indexOf( name + '=' ) + name.length + 1;
    var len = link.substr(pos).indexOf('&');
    if (-1 == len) len = link.substr(pos).length;
    return link.substr(pos,len);
}

function LinkGMaps()
{
    var href = $('.WazeControlPermalink a').attr('href');

    var lon = getQueryString(href, 'lon');
    var lat = getQueryString(href, 'lat');
    var zoom = parseInt(getQueryString(href, 'zoom'));

    zoom = zoom > 6 ? 19 : zoom + 12;
    var mapsUrl = 'https://maps.google.com/?ll=' + lat + ',' + lon + '&z=' + zoom;
    window.open(mapsUrl,'_blank');
}

function LinkZoomed()
{
	var href = $('.WazeControlPermalink a').attr('href');
    var zoom = parseInt(getQueryString(href, 'zoom'));
	
    var mapsUrl = href.replace('zoom='+zoom,'zoom='+(zoom+2));
    window.open(mapsUrl,'_blank');
}


function DesfazerTudo()
{
	while (wazeModel.actionManager.undo())
	{	
		//faz nada... só desfaz... kkk
	}
}

function CarregarComboCidades() 
{
	CarregarCidades('_selCidadesOrigem');
}

function CarregarCidades(controleSelect)
{
	var selector = getId(controleSelect);
	var selecionado = selector.value;
	while(selector.options.length > 0)
	{
		selector.options.remove(0);
	}

	for (var objcit in wazeModel.cities.objects)
	{
		var cidade = wazeModel.cities.objects[objcit];
		
		var opcao = new Option(cidade.name,cidade.id);
		if (cidade.id == selecionado)
		{			
			opcao.setAttribute('selected',true);
		}	
		selector.options.add(opcao);		
	}
}

function ViasCidades()
{
	if (getId('_chkCidade').checked)
	{
		var count = 0;
		var ruas = '';
		
		var cidadeSelecionada = getId('_selCidadesOrigem').value;
		
		for (var st in wazeModel.streets.objects)
		{		
			var street = wazeModel.streets.objects[st];
			if (street.cityID == cidadeSelecionada)
			{		
				ruas += street.name + '\n';
				count++;
			}
		}
		
		if (count == 0)
		{
			alert('Não foram encontradas vias nesta visualização. Se já fez pesquisa em todas as áreas, peça agora a limpeza da cidade do mapa pelo formulário disponível no forum no endereço: https://www.waze.com/forum/viewtopic.php?f=299&t=45295 \n\nobs: para não ter que digitar tudo isso, dê Ctrl+C nessa mensagem e cole num bloco de notas. :-)');		
		}
		else
		{
			if (typeof(wmech_version) != 'undefined')
			{
				//Tem Highlights instalado. Vamo "brincar" então.
				alert('Foram encontradas ' + count + ' vias no total. Elas serão realçadas em amarelo.');
				getId('_cbHighlightCity').checked = true;
				updateCityList();
				getId('_selectCity').value = cidadeSelecionada;
				
				highlightSegments();
			}
			else
			{
				alert('Foram encontradas ' + count + ' vias no total. São elas:\n' + ruas + '\n\nobs: para não ter que digitar tudo isso, dê Ctrl+C nessa mensagem e cole num bloco de notas. :-)');		
			}
		}
	}
	else
	{
		if (typeof(wmech_version) != 'undefined')
		{
			getId('_cbHighlightCity').checked = false;
			highlightSegments();
		}
	}
}

function carregarUsuarios() 
{
	var selectUser = getId('_selUsuario');
	var numUsers = wazeModel.users.objects.length;

	var currentId = null;
	if (selectUser.selectedIndex >= 0)
	{
		currentId = selectUser.options[selectUser.selectedIndex].value;
	}
 
	var editorIds = new Array();
	var distId = new Array();
	for (var seg in wazeModel.segments.objects) 
	{
		var segment = wazeModel.segments.get(seg);
		if (getId(segment.geometry.id) === null)
			continue;
			
		var updatedBy = segment.attributes.updatedBy;
		if (distId.indexOf(updatedBy) == -1)
		{
			var user = wazeModel.users.get(updatedBy);
			var usrRank = user.normalizedLevel;
			
			var tmpAry = new Array();
			tmpAry.push(user.userName + ' (' + usrRank + ')');
            tmpAry.push(updatedBy);
		
			editorIds.push(tmpAry);
			distId.push(updatedBy);
		}
	}
	
	for(var objs in wazeModel.venues.objects)
	{
		var createdBy = wazeModel.venues.objects[objs].createdBy;
		if (distId.indexOf(createdBy) == -1)
		{
			var user = wazeModel.users.get(createdBy);
			if (typeof(user) != 'undefined')
			{
				var usrRank = user.normalizedLevel;
				
				var tmpAry = new Array();
				tmpAry.push(user.userName + ' (' + usrRank + ')');
				tmpAry.push(createdBy);
			
				editorIds.push(tmpAry);
				distId.push(createdBy);
			}
		}
	}
	editorIds.sort();
  
	selectUser.options.length = 0;
  
	for (var i = 0; i < editorIds.length; i++) {
		var usrOption = document.createElement('option');

		if (currentId !== null && editorIds[i][1] == currentId)
		{
			usrOption.setAttribute('selected',true);
		}
		usrOption.setAttribute('value',editorIds[i][1]);
		usrOption.appendChild(document.createTextNode(editorIds[i][0]));
		selectUser.appendChild(usrOption);
	}
}

function carregarFanfarroes() 
{
	var selectUser = getId('selFanfarrao');
	var numUsers = wazeModel.users.objects.length;

	var currentId = null;
	if (selectUser.selectedIndex >= 0)
	{
		currentId = selectUser.options[selectUser.selectedIndex].value;
	}
 
	var editorIds = new Array();
	var distId = new Array();
	
	for (var urobj in wazeModel.updateRequestSessions.objects)
	{
		var ureq = wazeModel.updateRequestSessions.objects[urobj];

		for (var murobj in wazeModel.mapUpdateRequests.objects)
		{
			var murInfo = wazeModel.mapUpdateRequests.objects[murobj];
			if (murInfo.attributes.id == ureq.id)
			{
				if (murInfo.attributes.resolvedBy != null)
				{
					var resolvedBy = murInfo.attributes.resolvedBy;
					if (distId.indexOf(resolvedBy) == -1)
					{
						var user = wazeModel.users.get(resolvedBy);
						var usrRank = user.normalizedLevel;
						
						var tmpAry = new Array();
						tmpAry.push(user.userName + ' (' + usrRank + ')');
						tmpAry.push(resolvedBy);
					
						editorIds.push(tmpAry);
						distId.push(resolvedBy);					
					}
				}				
				break;
			}
		}
	}	
  
	selectUser.options.length = 0;
  
	for (var i = 0; i < editorIds.length; i++) {
		var usrOption = document.createElement('option');

		if (currentId !== null && editorIds[i][1] == currentId)
		{
			usrOption.setAttribute('selected',true);
		}
		usrOption.setAttribute('value',editorIds[i][1]);
		usrOption.appendChild(document.createTextNode(editorIds[i][0]));
		selectUser.appendChild(usrOption);
	}
}

function ProcurarSegmentosUsuario()
{
	if (getId('_chkUsuario').checked)
	{
		var usuarioSelecinado = getId('_selUsuario').value;
		var count = 0;
		var ruas = '';

		for (var seg in wazeModel.segments.objects) 
		{
			var segment = Waze.model.segments.get(seg);
			if (getId(segment.geometry.id) === null)
			{
				continue;
			}

			if (segment.attributes.updatedBy == usuarioSelecinado 
				||segment.attributes.createdBy == usuarioSelecinado)
			{	
				ruas += wazeModel.streets.objects[segment.attributes.primaryStreetID].name + '\n';
				count++;
			}
		}
		
		if (count != 0)
		{
			if (typeof(wmech_version) != 'undefined')
			{
				//Tem Highlights instalado. Vamo "brincar" então.
				//alert('Foram encontradas ' + count + ' vias no total. Elas serão realçadas em verde.');
				getId('_cbHighlightEditor').checked = true;
				updateUserList();
				getId('_selectUser').value = usuarioSelecinado;
				
				highlightSegments();
			}
			else
			{
				alert('Foram encontradas ' + count + ' vias no total. São elas:\n' + ruas + '\n\nobs: para não ter que digitar tudo isso, dê Ctrl+C nessa mensagem e cole num bloco de notas. :-)');		
			}
		}
		
		for(var objs in wazeModel.venues.objects)
		{
			var landmark = wazeModel.venues.objects[objs];
			if (landmark.attributes.createdBy == usuarioSelecinado || landmark.attributes.updatedBy == usuarioSelecinado)
			{
				$('path[id="'+ landmark.geometry.id +'"').css("fill", "#66FF00");
			}
			else
			{
				$('path[id="'+ landmark.geometry.id +'"').css("fill", "#d191d6");
			}
		}
		
	}
	else
	{
		if (typeof(wmech_version) != 'undefined')
		{
			getId('_cbHighlightEditor').checked = false;
			highlightSegments();
		}
	}
}

var autoSaveTimer = 0;

function autoSave(event) 
{
	SalvaTudo();
}

function SalvaTudo()
{
	if (DesabilitaAutoSave == false)
	{
		if (getId('chkAutoSave').checked)
		{		
			if (wazeModel.actionManager.unsavedActionsNum() == 0)
			{
				console.log('parando salvador');
				window.clearInterval(autoSaveTimer);
				autoSaveTimer = 0;
			}
			
			if ((wazeModel.actionManager.unsavedActionsNum() >= 30) && 
				wazeModel.actionManager.canSave())
			{
					$("div[class='toolbar-button WazeControlSave ItemInactive']").trigger('click');
					
					if (getId('chkResave').checked && autoSaveTimer == 0)
					{
						autoSaveTimer = window.setInterval(function() { console.log('Re-Tentar salvar.'); TentarSalvar();  }, 3000);
					}
			}
		}
	}
}

function TentarSalvar()
{
	if (document.getElementById('save-popover-container').children.length > 0)
	{
		$('button[class="btn btn-default close-button"]').click();
		
		$("div[class='toolbar-button WazeControlSave ItemInactive']").trigger('click');
	}
}

/*INICIO Revisão de nomes*/
var contadorInstrucao = []; 
var idInterval = 0;
var lastSeg = 0;
var listaSegmentosRevisao = [];

function FaxinaNomesIniciar()
{
	listaSegmentosRevisao = [];
	
	var userChamp = champsBrazil.indexOf(unsafeWindow.W.loginManager.user.userName) != -1;	
	
	if (userChamp)
	{
		document.getElementById('btnIniciarRevisao').disabled = true;
		document.getElementById('btnPararRevisao').disabled = false;
	}
	else
	{
		alert('Aguarde até a mensagem de termino da revisão para continuar suas edições.');
	}
	
	
	if (lastSeg == 0)
	{
		for	(var seg in wazeModel.segments.objects)
		{
			lastSeg = seg;
			FaxinaSegmento(seg);
			break;
		}
	}
	else
	{
		ProximoSegmento(lastSeg);
	}	
}

function FaxinaNomesParar()
{
	window.clearInterval(idInterval);
	idInterval = 0;
	document.getElementById('btnIniciarRevisao').disabled = false;
	document.getElementById('btnPararRevisao').disabled = true;
}

function FaxinaNomesSelecionados()
{
	listaSegmentosRevisao = [];
	for (i=0;i<Waze.selectionManager.selectedItems.length;i++) 
	{
		for	(var seg in wazeModel.segments.objects)
		{
			if (wazeModel.segments.objects[seg].geometry.id == Waze.selectionManager.selectedItems[i].geometry.id)
			{
				listaSegmentosRevisao.push(seg);
				break;
			}				
		}
	}
		
	document.getElementById('btnIniciarRevisao').disabled = true;
	document.getElementById('btnPararRevisao').disabled = false;
	
	if (lastSeg == 0)
	{
		for	(var seg in wazeModel.segments.objects)
		{
			if (listaSegmentosRevisao.indexOf(seg) != -1)
			{
				lastSeg = seg;
				FaxinaSegmento(seg);
				break;
			}
		}
	}
	else
	{
		ProximoSegmento(lastSeg);
	}	
}

function ParalizadorCorrecaoNomes()
{
	var paralizador = document.createElement('section');
	paralizador.id = 'paralizador';
	paralizador.innerHTML +=  '<input type="button" id="btnParalizarRevisao" value="Parar Revisão de Nomes" class="btn btn-default"/><br/>';
	
	var painel = document.getElementsByClassName('selection-text')[0];
	if ($('input[id="btnParalizarRevisao"]').length == 0 && Waze.selectionManager.selectedItems.length > 0)
	{
		painel.appendChild(paralizador);
		document.getElementById('btnParalizarRevisao').onclick = FaxinaNomesParar;	
	}
}

function ProximoSegmento(seg)
{
	console.log("Verificado " + seg);
		
	if (idInterval == 0)
	{
		var temporizadorRename = 500;
		
		if (wazeModel.actionManager.unsavedActionsNum() >= 70)
		{
			temporizadorRename = 10000;
		}
		
		idInterval = window.setInterval(function(){
			
			console.log(contadorInstrucao);
			
			if (contadorInstrucao.length > 0
				&& contadorInstrucao[contadorInstrucao.length -1][1] == false)
			{
				ParalizadorCorrecaoNomes();
				console.log("executado nomeação. Execuções pendentes: " + contadorInstrucao.length);
			}
			else
			{
				window.clearInterval(idInterval);
				console.log("Parando o intervalor " + idInterval);
				idInterval = 0;
				
				contadorInstrucao = [];
				contadorInstrucao.length = 0;
				
				if (wazeModel.actionManager.unsavedActionsNum() >= 70)
				{
					alert("Salve seu trabalho antes de continuar.");
				}
				else
				{
					if (getId('chkAutoSave').checked && wazeModel.actionManager.unsavedActionsNum() >= 30)
					{
						FaxinaNomesParar();
						SalvaTudo();						
						return;
					}					
					
					var localizadoProximo =  false;
					for	(var segmentoSeguinte in wazeModel.segments.objects)
					{	
						if (localizadoProximo)
						{
							var segmento = wazeModel.segments.objects[segmentoSeguinte];
							var totalGeo = segmento.geometry.components.length;
							var naTela = 0;
							for(var compSegmento=0;compSegmento<totalGeo;compSegmento++)
							{
								var i=segmento.geometry.components[compSegmento];
								if(Waze.map.getExtent().toGeometry().containsPoint(i))
								{			
									naTela++;
								}	
							}
							
							//Só fazer na tela.
							if (naTela == totalGeo)
							{
								//Ver se é tipo selecionados. 
								if (listaSegmentosRevisao.length == 0
								|| listaSegmentosRevisao.indexOf(segmentoSeguinte) != -1)
								{									
									lastSeg = segmentoSeguinte;
									FaxinaSegmento(segmentoSeguinte);
									break;
								}
							}
						}
						
						if (seg == segmentoSeguinte)
						{
							localizadoProximo = true;
						}
					}
					
					//Se não achou nenhum depois do que acabou de fazer.
					if (lastSeg == seg)
					{
						lastSeg = 0;
						listaSegmentosRevisao = [];
						console.log("Acabou");
						document.getElementById('btnIniciarRevisao').disabled = false;
						document.getElementById('btnPararRevisao').disabled = true;
						alert("Ajuste de nomes chegou ao fim.");
					}
				}
			}
		}, temporizadorRename);
	}
	
	console.log('intervalor ' + idInterval);
}

function FaxinaSegmento(seg)
{	
	console.log("iniciando verificação do segmento " + seg);
	var segmento = wazeModel.segments.objects[seg];
	
	var totalGeo = segmento.geometry.components.length;
	var naTela = 0;
	for(var compSegmento=0;compSegmento<totalGeo;compSegmento++)
	{
		var i=segmento.geometry.components[compSegmento];
		if(Waze.map.getExtent().toGeometry().containsPoint(i))
		{			
			naTela++;
		}	
	}
	
	//Só fazer na tela.
	if (naTela == totalGeo)
	{
		//Vê se dá pra abreviar (principal)
		var segmentoSts = [];
		segmentoSts.push(segmento.attributes.primaryStreetID);
		segmentoSts = segmentoSts.concat(segmento.attributes.streetIDs); //Assim para primaryStreetID ser a primeira SEMPRE
		
		var NomeOriginais = [];
		var NomesModificados = [];
		
		console.log("streets: " + segmentoSts.length);
		
		for (iBuscaNome=0;iBuscaNome<segmentoSts.length;iBuscaNome++)
		{
			console.log("buscando nomes: " + segmentoSts[iBuscaNome]);
		
			if (typeof(wazeModel.streets.objects[segmentoSts[iBuscaNome]].name) != 'undefined'
				&& wazeModel.streets.objects[segmentoSts[iBuscaNome]].name != null
				&& wazeModel.streets.objects[segmentoSts[iBuscaNome]].name != "")
			{
				NomeOriginais.push(wazeModel.streets.objects[segmentoSts[iBuscaNome]].name);
				NomesModificados.push(VerificarCorrecaoNome(segmentoSts[iBuscaNome]));
			}
		}	
		
		var segmentoSelecionado = false;
		var painelAberto = false;
		
		for (iStreetLocalizada=0;iStreetLocalizada<segmentoSts.length;iStreetLocalizada++)
		{		
			if (iStreetLocalizada != 0)
			{
				//Vejo se já está na lista, se tiver é duplicado, deve ser apagado. 
				var existente = false;
				for(j=0;j<segmentoSts.length;j++)
				{					
					if (NomesModificados[iStreetLocalizada] == NomesModificados[j] && iStreetLocalizada != j)
					{
						//Opa é um duplicado, apaga o iStreetLocalizada
						existente = true;
						break;
					}
				}
				
				if (existente)
				{
					console.log("duplicado localizado. Vamos apagar!" + segmentoSts[iStreetLocalizada]);
										
					if (!segmentoSelecionado)
					{
						//Se tiver que trocar algo, seleciona e faz.
						var t = []; 
						t.push(segmento);
						Waze.selectionManager.select(t);
						
						segmentoSelecionado = true;
					}					
					
					if (!painelAberto)
					{
						contadorInstrucao.push(["painel", false]);
						var instrucaoAtual = contadorInstrucao.length - 1;
						
						window.setTimeout(function() {
							$('a[class="address-edit-btn"]').click();
							contadorInstrucao[instrucaoAtual] = ["painel", true];
						}, (contadorInstrucao.length * 800));
						
						painelAberto = true;
					}
					
					contadorInstrucao.push(["delete alternative", false]);
					
					var iRua = iStreetLocalizada;
					var idInstrucaoDelAlt = contadorInstrucao.length - 1;
					
					window.setTimeout(function() {
						console.log(segmentoSts[iRua]);
						ApagarSegmento(segmentoSts[iRua], idInstrucaoDelAlt);
					}, (contadorInstrucao.length * 800));
					
					console.log("pedi pra continuar");
					continue;
				}
			}
			
			console.log('Original: ' + NomeOriginais[iStreetLocalizada]);
			console.log('Abreviado: ' + NomesModificados[iStreetLocalizada]);

			//Mudado.
			if (NomeOriginais[iStreetLocalizada] != NomesModificados[iStreetLocalizada])
			{
				console.log('Vai modificar');
				
				if (!segmentoSelecionado)
				{
					//Se tiver que trocar algo, seleciona e faz.
					var t = new Array(); 
					t.push(segmento);
					Waze.selectionManager.select(t);
					
					contadorInstrucao.push(["toda via", false]);
					var instrucaoAtual = contadorInstrucao.length - 1;
						
					window.setTimeout(function() {
						$('button[class="btn btn-default select-entire-street"]').click();
						contadorInstrucao[instrucaoAtual] = ["toda via", true];
					}, (contadorInstrucao.length * 800));
					
					segmentoSelecionado = true;
				}				
				
				if (!painelAberto)
				{
					contadorInstrucao.push(["painel", false]);					
					var idInstrucaoPainel = contadorInstrucao.length - 1;
					
					window.setTimeout(function() {
						$('a[class="address-edit-btn"]').click();
						contadorInstrucao[idInstrucaoPainel] = ["painel", true];
					}, (contadorInstrucao.length * 800));
					painelAberto = true;
				}
		
				if (iStreetLocalizada == 0)
				{
					//Principal.
					contadorInstrucao.push(["alterando principal", false]);
					
					var iRua = iStreetLocalizada;
					var idInstrucaoAlterando = contadorInstrucao.length - 1;
					
					window.setTimeout(function() {
						$('input[class="form-control streetName"]').attr("value", NomesModificados[iRua]);
						contadorInstrucao[idInstrucaoAlterando] = ["alterando principal", true];
					}, (contadorInstrucao.length * 800));
				}
				else
				{
					//Alternativo.
					var iRua = iStreetLocalizada;
					
					//Exclui
					contadorInstrucao.push(["delete alternativo", false]);
					var idInstrucaoDelete = contadorInstrucao.length - 1;
					
					window.setTimeout(function() {
						ApagarSegmento(segmentoSts[iRua], idInstrucaoDelete);
					}, (contadorInstrucao.length * 800));
					
					//Cria um novo
					contadorInstrucao.push(["criando alternativo 1", false]);
					var idInstrucao1 = contadorInstrucao.length - 1;
						
					window.setTimeout(function() {
						CriarAlternativo(1, '', idInstrucao1);
					}, (contadorInstrucao.length * 800));
					
					contadorInstrucao.push(["criando alternativo 2", false]);
					var idInstrucao2 = contadorInstrucao.length - 1;
					
					window.setTimeout(function() {
						CriarAlternativo(2, NomesModificados[iRua], idInstrucao2);
					}, (contadorInstrucao.length * 800));
					
					contadorInstrucao.push(["criando alternativo 3", false]);
					var idInstrucao3 = contadorInstrucao.length - 1;
						
					window.setTimeout(function() {
						CriarAlternativo(3, '', idInstrucao3);
					}, (contadorInstrucao.length * 800));
				}
			}
		}
	}
	else
	{
		console.log('segmento fora da tela.');
	}
	
	//Para este segmento acabou. Se mudou aplicar.
	if (painelAberto)
	{
		//Aplicar  e vamos ao próximo!
		contadorInstrucao.push(["aplicar", false]);
		var idInstrucaoAplicar = contadorInstrucao.length - 1;
		
		window.setTimeout(function() {
			$('div[class="address-form-actions"]').find('button[class="btn btn-primary"]').click();
			contadorInstrucao[idInstrucaoAplicar] = ["aplicar", true];
		}, (contadorInstrucao.length * 800));
	}
	
	ProximoSegmento(seg);
}

function VerificarCorrecaoNome(streetID)
{
	var rua = wazeModel.streets.objects[streetID].name;
	var logradouroDaRuaOriginal = rua.substring(0, rua.indexOf(" "));
	var logradouroDaRua = logradouroDaRuaOriginal;
	var nomeDaRuaOriginal = rua.substring(rua.indexOf(" ")+1, rua.length) + " ";
	var nomeDaRua = nomeDaRuaOriginal;
	
	//logradouros.
	var logradouros = [
	"Acesso",
	"Alameda",
	"Avenida",
	"Beco",
	"Bloco",
	"Calçada",
	"Caminho",
	"Chácara",
	"Condomínio",
	"Conjunto",
	"Edifício",
	"Estrada",
	"Fazenda",
	"Galeria",
	"Granja",
	"Jardim",
	"Largo",
	"Loteamento",
	"Marginal",
	"Parque",
	"Praça",
	"Quadra",
	"Rodovia",
	"Rua",
	"Servidão",
	"Setor",
	"Travessa",
	"Via",
	"Viaduto",
	"Viela",
	"Vila"
	];
	
	var logradourosAbreviados = [
	"Ac.",
	"Al.",
	"Av.",
	"B.",
	"Bl.",
	"Calç.",
	"Cam.",
	"Ch.",
	"Cond.",
	"Cj.",
	"Ed.",
	"Est.",
	"Faz.",
	"Gal.",
	"Gja.",
	"Jd.",
	"Lg.",
	"Lot.",
	"Marg.",
	"Prq.",
	"Pç.",
	"Q.",
	"Rod.",
	"R.",
	"Serv.",
	"St.",
	"Tv.",
	"V.",
	"Vd.",
	"Ve.",
	"Vl."
	];
			
	if (logradouros.indexOf(logradouroDaRua) != -1)
	{
		//tem logradouro pra atualizar.
		logradouroDaRua = logradourosAbreviados[logradouros.indexOf(logradouroDaRua)];
	}
	
	//prefixos e nomes.
	var prefixosNomes = [
	"Agrícola",
	"Almirante",
	"Brigadeiro",
	"Capitão",
	"Capitao ",
	"Cônego",
	"Coronel",
	"Deputado",
	"Desembargador",
	"Dom ",
	"Dona ",
	"Doutor ",
	"Doutora",
	"Enfermeiro",
	"Enfermeira",
	"Engenheiro",
	"General",
	"Governador",
	"Júnior",
	"Major",
	"Marechal",
	"Monsenhor",
	"Nossa Senhora",
	"Nosso Senhor",
	"Padre",
	"Prefeito",
	"Presidente",
	"Professora",
	"Professor",	
	"Promotor",
	"Sargento",
	"Senador",
	"Senhor",
	"Senhora",
	"Tenente",
	"Vereador",
	"Antonio",
	"Goncalves",
	"Joao",
	"Magalhaes",
	"Salomao",
	"Sao ",
	"Sebastiao",
	"Jose ",
	"Jordao ",
	"Tres ",
	"Gloria",
	"Luis ",
	"Mario ",
	"Dr ",
	"Cornelio",
	"Recordacao",
	"Sd ",
	"Flavio",
	"Araujo",
	"Barao ",
	"Lazaro",
	"Perola ",
	"Andre ",
	"Das ",
	"Da ",
	"De ",
	"Do ",
	"Dos ",
	"Antonia",
	"Fatima",
	"Sertao ",
	"Mendonca",
	"Graca ",
	"Guimaraes",
	"Espirito",
	"Pe ",	
	"Ceara "
	];	
	
	var prefixosNomesAbreviados = [
	"Agr.",
	"Alm.",
	"Brig.",
	"Cap.",
	"Cap. ",
	"Con.",
	"Cel.",
	"Dep.",
	"Des.",
	"D. ",
	"Da. ",
	"Dr. ",
	"Dra.",
	"Enf.",
	"Enfa.",
	"Eng.",
	"Gen.",
	"Gov.",
	"Jr.",
	"Maj.",
	"Mal.",
	"Mons.",
	"N.Sra.",
	"N.Sr.",
	"Pe.",
	"Pref.",
	"Pres.",
	"Profa.",
	"Prof.",
	"Prom.",
	"Sarg.",
	"Sen.",
	"Sr.",
	"Sra.",
	"Ten.",
	"Ver.",
	"Antônio",
	"Gonçalves",
	"João",
	"Magalhães",
	"Salomão",
	"São ",
	"Sebastião",
	"José ",
	"Jordão ",
	"Três ",
	"Glória",
	"Luís ",
	"Mário ",
	"Dr. ",
	"Cornélio",
	"Recordação",
	"Sd. ",
	"Flávio",
	"Araújo",
	"Barão ",
	"Lázaro",
	"Pérola ",
	"André ",
	"das ",
	"da ",
	"de ",
	"do ",
	"dos ",
	"Antônia",
	"Fátima",
	"Sertão ",
	"Mendonça",
	"Graça",
	"Guimarães",
	"Espírito",
	"Pe. ",
	"Ceará"
	];
			
	for(x=0;x<prefixosNomes.length;x++)
	{
		if (nomeDaRua.indexOf(prefixosNomes[x]) != -1)
		{
			nomeDaRua = nomeDaRua.replace(prefixosNomes[x], prefixosNomesAbreviados[x]);
		}
	}

	if (logradouroDaRuaOriginal != logradouroDaRua
		|| nomeDaRuaOriginal != nomeDaRua)
	{
		return (logradouroDaRua + " " + nomeDaRua).trim();
	}
	else
	{
		return (logradouroDaRuaOriginal + " " + nomeDaRuaOriginal).trim();
	}
}

function ApagarSegmento(segmentoDataid, idContador)
{
	console.log("apagando " + segmentoDataid + " " + idContador )
	$('tr[data-id="'+ segmentoDataid +'"]').find('a[class="alt-street-delete"]').click();
	contadorInstrucao[idContador] = ["delete alternative", true];
}

function CriarAlternativo(passo, nome, idContador)
{
	console.log("alternativo " + passo + " " + nome + " contador " + idContador);
	
	if (passo == 1)
	{
		$('a[class="add-alt-street-btn"]').click();
	}
	
	if (passo == 2)
	{
		$('tr[class="alt-street-form-template new-alt-street"]').find('input[name="streetName"]').attr("value", nome);
	}
	
	if (passo == 3)
	{
		$('div[class="address-form-actions"]').find('button[class="btn btn-primary"]').click();
	}
	
	contadorInstrucao[idContador] = ["criando alternativo " + passo, true];
}
/*FINAL Revisão de nomes*/

/*FINAL*/

/* engage! =================================================================== */
MUV_bootstrap();
/* end ======================================================================= */	