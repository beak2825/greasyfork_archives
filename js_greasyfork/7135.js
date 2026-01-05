// ==UserScript==
// @name           Virtonomica: Апгрейд оборудования
// @description:ru Помощник в апгрейде оборудования.
// @namespace      virtonomica
// @include        https://*virtonomic*.*/*/window/unit/equipment/*
// @version     1.21
// @description Помощник в апгрейде оборудования.
// @downloadURL https://update.greasyfork.org/scripts/7135/Virtonomica%3A%20%D0%90%D0%BF%D0%B3%D1%80%D0%B5%D0%B9%D0%B4%20%D0%BE%D0%B1%D0%BE%D1%80%D1%83%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/7135/Virtonomica%3A%20%D0%90%D0%BF%D0%B3%D1%80%D0%B5%D0%B9%D0%B4%20%D0%BE%D0%B1%D0%BE%D1%80%D1%83%D0%B4%D0%BE%D0%B2%D0%B0%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

var run = function() 
{

function NumFormat( N )
{
    	var res = '';
	N = N.toString();
    	for (var i=0, j=N.length; i<j; i++) 
	{
		if (i%3 == 0 && i != 0) 
			res = ' ' + res;
		res = N.substr(j-1-i, 1) + res;
    	}
    	return res;
}


	var total; // всего установлено оборудования
	var cQ;    // текущее качество
	var rQ;    // требуемое качество
	var min = 1000000000;
	var minname;
	var minneed;
	var mincell;
	var notfarm;



    	var win = (typeof(unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
    	$ = win.$;

	// проверка, что это не животноводческая ферма
	notfarm = 1;
	$( 'img[src="/img/unit_types/animalfarm.gif"]' ).each( function( ) 
	{
		// таки да
		notfarm = 0;
	});

	if ( !notfarm ) return;

    	$( 'div.recommended_quality' ).each( function( ) 
	{
        	var spans = $( 'span', this );
		cQ = parseFloat( $( spans[0] ).text() );
		rQ = parseFloat( $( spans[1] ).text() ) + 0.01;
		total = parseInt( $( spans[2] ).text().replace(' ', '', 'g') );    

    	});


	if (rQ <= cQ ) return;

    	$( '#mainTable tr' ).each( function() 
	{
        	if ($( this ).prop( 'id' )[0] != 'r') return;

        	var cells = $( 'td', this );
		var offer = parseInt( $(cells[2]).text().trim().replace( ' ', '', 'g' ) ); 
	        var price = parseFloat( $( cells[6] ).text().replace(/[^\d\.]/g,'')  );
        	var qual = parseFloat( $( cells[7] ).text() );

	        if ( isNaN(price) || isNaN(qual) ) return;
        	if ( qual < rQ ) return;

  		var need = Math.ceil( total * ( rQ - cQ )/( qual - cQ ) );

		if ( offer < need )
			return;

		var cost = Math.round( need * price );

		if ( cost < min )
		{
			min = cost;
			minname = $( cells[0] ).text();
			mincell = cells[0];
			minneed = need;
		}
	
        	cells[0].innerHTML = cells[0].innerHTML + '<div style="color: grey"><nobr>' + 
			NumFormat( need ) + ' (' +  NumFormat( cost ) + '$)</nobr></div>';
    	});

	if ( min < 1000000000 )
	{
		mincell.innerHTML = '<img src="/img/supplier_add.gif"> '  + mincell.innerHTML;
		$( 'div.header h3').each( function()
		{
			this.innerHTML = this.innerHTML + ' --> <font color="green">' + minname + ' --> <span id=upgrade_min style="cursor:pointer;border: 1px solid;border-radius: 6px;padding: 2px 4px;background: none repeat scroll 0 0 lightcyan;">' + NumFormat( minneed ) + 'шт</span> (' +  NumFormat( min ) + '$)</font>';
		});
		$("#upgrade_min").click(function(){
			$("#terminateInput").val(minneed);
			$("#amountInput").val(minneed);
		});
	}
}

var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);
