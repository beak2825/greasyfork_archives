// ==UserScript==
// @name         ACAC Counter
// @namespace    https://github.com/torus711
// @version      0.9
// @description  Add column which displays # of ACs while the contest on tasks page of AtCoder.
// @author       torus711
// @match        https://atcoder.jp/contests/*/tasks
// @icon         https://www.google.com/s2/favicons?sz=64&domain=atcoder.jp
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557151/ACAC%20Counter.user.js
// @updateURL https://update.greasyfork.org/scripts/557151/ACAC%20Counter.meta.js
// ==/UserScript==

( async function(){
    'use strict';

	injectCounts( createCells(), await fetchStandings() );

	return;
} )();

function createCells()
{
	const table = [ ...document.querySelectorAll( 'th' ) ].find( th => {
		return th.innerHTML.includes( '実行時間制限' );
	} ).parentElement.parentElement.parentElement;

	let cells = [];
	table.querySelectorAll( 'tr' ).forEach( ( row, i ) => {
		const cell = document.createElement( i === 0 ? 'th' : 'td' );
		if ( i === 0 )
		{
			cell.width = '10%';
			cell.textContent = '#ACs';
		}
		else
		{
			cell.textContent = 'Loading...';
			cells.push( cell );
		}
		cell.style.textAlign = 'right';

		row.children[3].after( cell );
	} );

	return cells;
}

async function fetchStandings()
{
	const standingsURL = new URL( './standings/json', window.location.href ).pathname;
	return ( await fetch( standingsURL ) ).json();
}

async function injectCounts( cells, standings )
{
	let tasks = {};
	for ( const task of standings.TaskInfo )
	{
		tasks[ JSON.stringify( task.TaskScreenName ) ] = 0;
	}

	for ( const contestant of standings.StandingsData )
	{
		for ( const [ task, result ] of Object.entries( contestant.TaskResults ) )
		{
			tasks[ JSON.stringify( task ) ] += result.Status === 1;
		}
	}

	const counts = Object.values( tasks );
	for ( let i = 0; i < cells.length; ++i )
	{
		cells[i].textContent = counts[i].toLocaleString( 'ja-JP' );
	}

	return;
}