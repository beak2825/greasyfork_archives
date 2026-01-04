// ==UserScript==
// @name        BingImageCreator カスタムダウンロードボタン
// @description ダウンロードボタンをカスタムし、ファイル名に作成日時を、ExifのUserCommentに作成プロンプトを埋め込みます。
// @namespace   https://greasyfork.org/ja/users/1189800-ggg-niya-to
// @version     1.1
// @include     /https://www\.bing\.com/images/create/.+\?(.+&)?view=detailv2(&|$)/
// @compatible  edge on PC / manager : Tampermonkey
// @author      ggg.niya.to
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/548671/BingImageCreator%20%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89%E3%83%9C%E3%82%BF%E3%83%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/548671/BingImageCreator%20%E3%82%AB%E3%82%B9%E3%82%BF%E3%83%A0%E3%83%80%E3%82%A6%E3%83%B3%E3%83%AD%E3%83%BC%E3%83%89%E3%83%9C%E3%82%BF%E3%83%B3.meta.js
// ==/UserScript==
////////////////////////
// loadイベントが何故か発行されない場合の対策
(()=>{
	let executed;
	function startup(){
		if(executed){ return; }
		executed=true;
		main();
	}
	addEventListener("load",startup);
	setTimeout(startup,1000);
})();
////////////////////////
if(!Blob.prototype.bytes){
	Blob.prototype.bytes=function(){ return this.arrayBuffer().then(b => new Uint8Array(b)); };
}
////////////////////////
function main(){
// 日時文字列
	const TIME=(()=>{
		function d2d(d){ return d<10 ? "0"+d : d; }
		let t=location.pathname.match("/create/[^/]+/\\d-([0-9a-f]{8})[0-9a-f]{24}");
		return t ? ""+((t=new Date(parseInt(t[1],16)*1000)).getFullYear())+d2d(t.getMonth()+1)+d2d(t.getDate())+"-"+d2d(t.getHours())+d2d(t.getMinutes())+d2d(t.getSeconds()) : "unknown";
	})();
// セレクター定数
	const UL_SELECTOR=".actn_container UL",IMG_SELECTOR="#mainImageWindow .mainImage.current IMG";
// 監視とタイムアウト
	const OBS=new MutationObserver(setup);
	let timeout=true;
	setTimeout(()=>{
		if(timeout){
			OBS.disconnect();
			alert("\""+UL_SELECTOR+"\" not found");
		}
	},3000);
	OBS.observe(document.body,{ subtree:true, childList:true });
	setup();
// 構築処理関数
	function setup(){
		// 追加場所を取得
		const UL=document.querySelector(UL_SELECTOR);
		if(!UL){ return; }
		timeout=false;
		OBS.disconnect();
		// 元のダウンロードボタンとカスタムボタン
		const M=UL.querySelector(".dldc"),O = M ? (M.style.display="none",M.children[0]) : null,
			B=UL.insertBefore(document.createElement("LI"),(()=>{
				let e;
				return (e=M) || (e=UL.querySelector(".c")) || (e=UL.querySelector(".sharec")) ? e.nextSibling : UL.firstChild;
			})()).appendChild(document.createElement("DIV"));
		B.className="action dld nofocus";
		B.role="button";
		B.tabIndex=0;
		B.innerHTML="<SPAN><SPAN class=\"icon\"></SPAN><SPAN class=\"text\">ダウンロード</SPAN></SPAN>";
		// ダウンロードリンク本体
		const A=document.createElement("A");
		document.body.appendChild(A).style.display="none";
		// 本処理
		let last;
		B.onclick=(event)=>{
			// 前回のメモリがあれば解放
			if(last){
				URL.revokeObjectURL(last);
				last=null;
			}
			// Ctrlと一緒に押したら元のボタン（あれば）を起動
			if(O && event.ctrlKey){
				O.click();
				return;
			}
			// ダウンロードする画像
			const IMG=document.querySelector(IMG_SELECTOR);
			if(!IMG){
				alert("\""+IMG_SELECTOR+"\" not found");
				return;
			}
			// 基URLとそこから生成した識別コード
			const SRC=IMG.src.replace(/\?.+$/,""),CODE=(()=>{
				var sum=0,a=1,s,i;
				for(s=SRC.replace(/^.+\/(.{4}\.)?/,""),i=0;i<s.length;i++,a*=2){ sum+=s.charCodeAt(i)*a; }
				return (new Uint8Array([sum/256,sum])).toHex();
			})();
			// 画像をロードしてBlobを取得
			fetch(SRC+"?pid=ImgGn").then((RESPONSE)=>{	// そのままのパラメータだとwebpが返ってくる場合があるので
				if(!RESPONSE.ok){
					alert("http-error : "+RESPONSE.status);
					return;
				}
				RESPONSE.blob().then((BLOB_I)=>{
					// 生成プロンプトから APP1<EXIF<TIFF<コメントデータ のBlobを作成
					(new Blob([IMG.alt],{ type:"text/plain" })).bytes().then((BA)=>{
						// コメントバイトデータの整形（念のため）
						const com=Array.from(BA),S_A1D=52,S_CET=8,MAX_COM=256*256-1-S_A1D-S_CET-1-1;	// USHRT_MAX-APP1_DATA-COM_ENC_TAG-末尾NUL-偶数整形マージン
						if(MAX_COM < com.length){ com.length=MAX_COM; }	// 念のため1
						com.push(0);	// 念のため2
						if(com.length%2){ com.push(0); }	// 念のため3
						while(com.length<8){ com.push(0); }	// 念のため4
						// データ構成（短いのでベタ書き）
						const CC=S_CET+com.length,SS=S_A1D+CC;
						return new Blob([
							// APP1
							new Uint8Array([0xFF,0xE1,SS/256,SS]),
								// EXIF
								"Exif",new Uint8Array([0x00,0x00]),
									// TIFF
									"MM",new Uint8Array([0x00,0x2A,0x00,0x00,0x00,0x08,
										// 0th-IFD
										0x00,0x01,0x87,0x69,0x00,0x04,0x00,0x00,0x00,0x01,0x00,0x00,0x00,0x1A,0x00,0x00,0x00,0x00,
										// EXIF-IFD
										0x00,0x01,0x92,0x86,0x00,0x07,0x00,0x00,CC/256,CC,0x00,0x00,0x00,0x2C,0x00,0x00,0x00,0x00,
										// コメントデータ
										0x00,0x00,0x00,0x00,0x00,0x00,0x00,0x00]),new Uint8Array(com)]);
					}).then((BLOB_C)=>{
						// 画像BlobにコメントBlobを挿入したBlobからオブジェクトURLを生成し、それをリンク先に設定してダウンロード
						A.href=last=URL.createObjectURL(new Blob([BLOB_I.slice(0,2),BLOB_C,BLOB_I.slice(2)],{ type:BLOB_I.type }));
						A.setAttribute("download",TIME+"_"+CODE);
						A.click();
					});
				});
			});
		};
	}
}
////////////////////////
/* 作成メモ
先頭2バイト（FF,D8）の後に挿入

-- APP1 構造 --
セグメントマーカー（FF,E1）
セグメントサイズ（BE、2バイト、2＋58＋n）
EXIFデータ本体（58＋nバイト）

-- EXIF 構造 -- 58＋nバイト
EXIF識別コード（6バイト、"Exif\0\0"）
TIFFデータ本体（52＋nバイト）

-- TIFF 構造 -- 52＋nバイト
TIFFヘッダー（8バイト）
	エンディアン指定（2バイト、BE＝"MM"＝4D,4D）
	マジックナンバー（2バイト、00,2A）
	0th-IFDへのポインタ（4バイト、8＝00,00,00,08）
0th-IFD（18バイト）
	エントリ数（2バイト、EXIF-IFDのみなら1＝00,01）
	エントリ（12バイト）
		タグ（2バイト、EXIF-IFDへのポインタ＝34665＝87,69）
		タイプ（2バイト、LONG＝4＝00,04）
		カウント（4バイト、1＝00,00,00,01）
		ポインタ（4バイト、8＋0th-IFDのサイズ(18)＝26＝00,00,00,1A）
	1st-IFDへのポインタ（4バイト、存在しないので0＝00,00,00,00）
		↑ 一部サイトで2バイトと書いてあるが大嘘っぽい
EXIF-IFD（26＋nバイト）
	エントリ数（2バイト、1＝00,01）
	エントリ（12バイト）
		タグ（2バイト、ユーザーコメント＝37510＝92,86）
		タイプ（2バイト、UNDEFINED＝7＝00,07）
		カウント（4バイト、コメントデータのバイト数＝8＋n）
		オフセット（4バイト、8＋0th-IFDのサイズ(18)＋2＋12＋4＝44＝00,00,00,2C）
	不使用のポインタ（4バイト、00,00,00,00）
	コメントデータ（8＋nバイト）
		エンコードタグ（8バイト、未定義＝0＝00,00,00,00,00,00,00,00）
		コメント本体（nバイト）
*/
