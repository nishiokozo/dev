'use strict';

const	KEY_CR	= 13;
const	KEY_I	= 73;
const	KEY_O	= 79;
const	KEY_Z	= 90;
const	KEY_LEFT	= 37;
const	KEY_UP		= 38;
const	KEY_RIGHT	= 39;
const	KEY_DOWN	= 40;
let g_key = Array(256);
let g_prevScene = "000";
let g_nextScene = "000";
let g_idScene = "000";
let g_cmdtbl = [];
let g_flgReqRefresh = true;
let tmp =
{
	"a":[],
	"b":[],
	"c":[],
};
tmp["b"].push(11,12,13);
console.log(tmp["b"][1]);

let g_tblScene =
{
	"none":	[],

	"001":	[
				"おもちゃメーカー、エレガングの前にいます。入口と警備員が見えます。",
				["小石"]
			],

	"002":	[
				"エレガングのロビーにいます。エレベーターと受付嬢がいます。",
				["眼鏡"]
			],

	"003":	[
				"いらっしゃいませ。どちらに御用ですか？",
				["メモ帳"]
			],

	"004":	[
				"エレベーターの中です。カードリーダーがあります。",
				["紙切れ"]
			],

	"005":	[
				"製品企画部です。エレベーター、その他いろんな人がいます。",
				["パソコン","電話"],
				["ポン太","ミサキ"],
			],

	"006":	[
				"開発室です。:crあなたの席です。ヒット作を作りましょう",
				[],
				[],
			],
};

let message = {};
message.cntStr = 0;
message.maxStr = 11;
message.tblStr = Array(message.maxStr);
for (let i = 0 ; i < message.tblStr.length ; i++ ) message.tblStr[i]="";
message.str="";
message.tic=0;
message.delay=0;
message.wait=1;
message.fontsize=16+8;
message.fontheight=24+8;
let g=html_canvas.getContext('2d');

//--
let g_item = [];
g_item.push("本");
g_item.push("ライト");
g_item.push("ペン");
g_item.push("カード");

//-----------------------------------------------------------------------------
function sys_print( tx, ty, str, size=16, align="left" )
//-----------------------------------------------------------------------------
{
	g.font = size.toString() + "px monospace";
	g.fillStyle = "#000000";
	g.textAlign = align;
	g.fillText( str, tx, ty );
}
//-----------------------------------------------------------------------------
function sys_cls()
//-----------------------------------------------------------------------------
{
	g.fillStyle = "#ffffff";
	g.fillRect( 0,0,826-1,404-1 );
}

//-----------------------------------------------------------------------------
message.print = function( str )
//-----------------------------------------------------------------------------
{
	message.str += str+":cr";
}
//-----------------------------------------------------------------------------
message.push = function( str )
//-----------------------------------------------------------------------------
{
//	message.str += str+":cr";
		// スクロール
		if ( message.cntStr >= message.maxStr )
		{
			for ( let i = 1 ; i < message.maxStr ; i++ )
			{
				message.tblStr[i-1] = message.tblStr[i];
			}

			message.cntStr = message.maxStr-1;
			message.tblStr[ message.cntStr ] = "";
		}

	message.cntStr = message.maxStr-1; // 下から表示する場合
		
	message.tblStr[ message.cntStr ] = str;
	message.cntStr++;
	message.tic = message.str.length;
					message.str = "";
					message.tic = 0;
}
//-----------------------------------------------------------------------------
message.update = function()
//-----------------------------------------------------------------------------
{

//	if  ( height > message.tblStr.length ) height = message.tblStr.length;

	if ( message.tic < message.str.length )
	{
		// スクロール
		if ( message.cntStr >= message.maxStr )
		{
			for ( let i = 1 ; i < message.maxStr ; i++ )
			{
				message.tblStr[i-1] = message.tblStr[i];
			}

			message.cntStr = message.maxStr-1;
			message.tblStr[ message.cntStr ] = "";
		}

		message.cntStr = message.maxStr-1; // 下から表示する場合

		// 文字タイピング
		if ( message.delay > 0 ) 
		{
			message.delay--;
		}
		else
		{
			message.delay = message.wait;
			{
				if ( message.str.substr( message.tic, ":cr".length ) == ":cr" )
				{
					message.cntStr++;
					message.tic+=":cr".length;
				}
				else
				{
/*
console.log("<a> ", message.str);
					if ( message.str.substr(0,1) == ">" )
					{
						message.tblStr[ message.cntStr ] = message.str;
						message.tic = message.str.length;
					}
					else
*/
					{
						message.tblStr[ message.cntStr ] += message.str.substr( message.tic, 1 );
						message.tic++;
					}
					if ( message.tic >= message.str.length )
					{
						message.cntStr++;
					}
				}
				
				if ( message.tic >= message.str.length )
				{
					message.str = "";
					message.tic = 0;
				}

			}
		}
	}
		
	// 表示
	{
		let y0 = 0; // 表示位置補正

		//上付き表示
		for ( let i = 0 ; i < message.maxStr ; i++ )
		{
			sys_print( 0,y0+(i+1)*(message.fontheight)-4, message.tblStr[i], message.fontsize );
		}
	}	

}

//-----------------------------------------------------------------------------
function	scene_printItems( tbl )
//-----------------------------------------------------------------------------
{
	let str = "";
	let cnt = 0 ;
	for ( const elem of tbl )
	{
		str += elem +"、";
		cnt++;
	}
	if ( cnt > 0 ) 
	{
		str += "があります。";
		message.print( str );
	}
}
//-----------------------------------------------------------------------------
function	scene_printCasts( tbl )
//-----------------------------------------------------------------------------
{
	let str = "";
	let cnt = 0 ;
	for ( const elem of tbl )
	{
		str += elem +"、";
		cnt++;
	}
	if ( cnt > 0 ) 
	{
		str += "がいます。";
		message.print( str );
	}
}

//-----------------------------------------------------------------------------
function	item_move( str, fm, to )
//-----------------------------------------------------------------------------
{
	let idx = fm.indexOf( str );
	if ( idx != -1 )
	{
		fm.splice( idx, 1 );
		to.push( str );
		return true;
	}
	return false;
}
//-----------------------------------------------------------------------------
function	scene001_elegang( cmdtbl )
//-----------------------------------------------------------------------------
{
	let purpose = cmdtbl[0];
	let verb = cmdtbl[2];

	if ( verb == "話す" || verb == "はなす" || verb == "警備員と話す" || verb == "警備員とはなす" )
	{
		message.print( "おはようございます。受付でカードをもらってください。" );
	}
	else
	if ( verb == "しらべる"  )
	{
		message.print( "あなたはこの会社の製品企画部に所属しています。" );
	}
	else
	if ( verb == "入る" || verb == "はいる" )
	{
		g_nextScene = "002";
	}
	else 
	{
		message.print( "それはできません" );
	}
}
//-----------------------------------------------------------------------------
function	scene002_inelegang(  cmdtbl )
//-----------------------------------------------------------------------------
{
	let purpose = cmdtbl[0];
	let verb = cmdtbl[2];

	if ( verb == "触る" || verb == "さわる" )
	{
		message.print( "やめてください。" );
	}
	else
	if ( verb == "話す" || verb == "はなす" || verb == "受付嬢と話す" || verb == "受付嬢とはなす" )
	{
		g_nextScene = "003";
	}
	else
	if ( verb == "エレベーターに乗る" || verb == "エレベーターへ乗る" || verb == "エレベーターに入る" || verb == "エレベーターへ入る" || verb == "エレベーターにのる" || verb == "エレベーターへのる" || verb == "エレベーターへはいる" || verb == "エレベーターにはいる" )
	{
		g_nextScene = "004";
	}
	else
	if ( verb == "出る" || verb == "でる"  )
	{
		g_nextScene = "001";
	}
	else
	{
		message.print( "それはできません");
	}
}
//-----------------------------------------------------------------------------
function	scene003_talkGirl(  cmdtbl )
//-----------------------------------------------------------------------------
{
	let purpose = cmdtbl[0];
	let verb = cmdtbl[2];

	if ( verb == "社長"  )
	{
		message.print( "アポイントがなければお会いできません。" );
	}
	else
	if ( verb == "あなた"  )
	{
		message.print( "いまお会いしております。" );
	}
	else
	if ( verb == "カードをください" || verb == "カードを下さい" )
	{
		g_item.push("カード");
		message.print( "こーぞさんですね。こちらのカードをどうぞ。" );
	}
	else
	if ( verb == "製品企画部" || verb == "せいひんきかくぶ" )
	{
		g_item.push("カード");
		message.print( "こーぞさんですね。こちらのカードをどうぞ。" );
	}
	else
	if ( verb == "総理大臣" )
	{
		message.print( "こちらにはいらっしゃいません。" );
	}
	else
	if ( verb == "やめる" || verb == "止める" || verb == "おわる" || verb == "終わる" || verb == "さようなら"  || verb == "どうも" || verb == "ばいばい" || verb == "ありがとう" || verb == "すすむ" || verb == "進む" )
	{
		message.print( "ご用件がありましたらまたどうぞ" );
		g_nextScene = "002";
	}
	else
	{
		message.print( "すみません、もう一度お願いします。" );
	}
}

//-----------------------------------------------------------------------------
function	scene004_elevator(  cmdtbl )
//-----------------------------------------------------------------------------
{
	let purpose = cmdtbl[0];
	let verb = cmdtbl[2];

	if ( verb == "しらべる" || verb == "調べる" )
	{
		message.print( "カードリーダーがあります。" );
	}
	else
	if ( verb == "カードを入れる" || verb == "カードをいれる" || verb == "カードをいれる" || verb == "カードをさす" || verb == "カードを挿す" || verb == "カードをさしこむ" || verb == "カードを差し込む" || verb == "カードをつかう" || verb == "カードを使う" )
	{
		if ( g_item.indexOf("カード") != -1 )
		{
			message.print( "動き出しました。" );
			g_nextScene = "005";
		}
		else
		{
			message.print( "カードを持っていません。" );
		}
	}
	else
	if ( verb == "出る" || verb == "でる" )
	{
		g_nextScene = g_prevScene;
	}
	else
	{
		message.print( "それはできません" );
	}
}
//-----------------------------------------------------------------------------
function	scene005_seihinnkikaku(  cmdtbl )
//-----------------------------------------------------------------------------
{
	let purpose = cmdtbl[0];
	let verb = cmdtbl[2];
	
	if ( verb == "エレベーターに乗る" || verb == "エレベーターへ乗る" || verb == "エレベーターに入る" || verb == "エレベーターへ入る" || verb == "エレベーターにのる" || verb == "エレベーターへのる" || verb == "エレベーターへはいる" || verb == "エレベーターにはいる" )
	{
		g_nextScene = "004";
	}
	else
	if ( verb == "出る" || verb == "でる" )
	{
		g_nextScene = g_prevScene;
	}
	else
	{
		message.print( "それはできません" );
	}
}

//-----------------------------------------------------------------------------
function main_update()
//-----------------------------------------------------------------------------
{
	html_input.focus();

	sys_cls();
	sys_print(760,20, "s:"+g_idScene );

	message.update();

	if ( g_nextScene != g_idScene )
	{
		//g_command = "見る";
		g_cmdtbl = ["","","見る"];
		g_prevScene = g_idScene;
		g_idScene = g_nextScene;
		g_flgReqRefresh = true;
	}
	if ( g_flgReqRefresh )
	{
		let id = g_idScene;
		let purpose = g_cmdtbl[0];
		let verb = g_cmdtbl[2];

		// 共通コマンド
		if ( verb == "見る" || verb == "みる" )
		{
			if ( purpose == "もちもの" || purpose == "持ち物" || purpose == "アイテム"  )
			{
				let str = "";
				let cnt = 0 ;
				for ( const elem of g_item )
				{
					str += elem +" / ";
					cnt++;
				}
				str += "計"+cnt.toString()+"つ";
				message.print( str );
			}
			else
			{
				if ( g_tblScene[id] == undefined )
				{
					message.print( id+"というIDは存在しません" );
				}
				else
				{
					message.print( g_tblScene[id][0] );
					scene_printItems( g_tblScene[id][1] );
					scene_printCasts( g_tblScene[id][2] );
				}
			}
		}
		else
		if ( verb == "捨てる" || verb == "棄てる" || verb == "すてる" || verb == "置く" || verb == "おく" )
		{
			if ( item_move( purpose, g_item, g_tblScene[id][1] ) )
			{
				message.print( purpose+"を置きました。" );
			}
			else 
			{
				message.print( purpose+"は持っていません。" );
			}
		}
		else
		if ( verb == "とる" || verb == "拾う" || verb == "取る" || verb == "ひろう"  )
		{
			let str = purpose;
			
			if( item_move( str, g_tblScene[id][1], g_item ) )
			{
				message.print( str+"をもちものに入れました。" );
			}
			else
			{
				message.print( str+"はありません。" );
			}
		}
		else
		if ( verb == "もどる" || verb == "戻る" )
		{
			g_nextScene = g_prevScene;
		}
		else
		{
			switch( g_idScene )
			{
//			case 0: scene000_start( g_cmdtbl );	break;
			case "001": scene001_elegang( g_cmdtbl );	break;
			case "002":	scene002_inelegang( g_cmdtbl );	break;
			case "003":	scene003_talkGirl( g_cmdtbl );	break;
			case "004":	scene004_elevator( g_cmdtbl );	break;
			case "005":	scene005_seihinnkikaku( g_cmdtbl );	break;
			}
		}
		g_flgReqRefresh = false;
	}


/*

	if ( g_step==0 )
	{
		g_step++;
		g_timer=60*3;
	}
	if ( g_step==1 )
	{
//		print( x,y+=20, "1980fd年に\n タイムスリップします");
		if ( g_timer > 0 ) g_timer--;
	}
	if ( g_step==2 )
	{
//			print( x,y+=20, "ここは秋葉原です");
	}
*/

//		message.print( "このゲームでは一度も出てきてない単語は使えません。" );
//		message.print( "ひらがな入力でも漢字入力でもどちらでも大丈夫です。" );
//		message.print( "それでは『はじめる』と入力してください。" );

//	message.print( "あなたはこの会社の製品企画部に所属しています。" );
//	message.print( "ヒット作をいつか出したいところですが・・・" );
//	message.print( "どうしますか？" );
//	message.print( "" );
	//document.getElementById("html_input").focus();
	//html_input.focus();

	//	html_input.value = "aa";	
		


	
	requestAnimationFrame( main_update );

}

//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	let	c = ev.keyCode;
	g_key[c] = true;

	if ( c == KEY_CR ) 
	{
		let g_command = html_input.value;
		if ( g_command != "" )
		{
			html_input.value = "";
			g_flgReqRefresh = true;

			// 字句分解
			{
				g_cmdtbl = [];
				let idx = g_command.indexOf( "を" );
				if ( idx != -1 )
				{
					g_cmdtbl.push( g_command.substring( 0, idx ) );
					g_cmdtbl.push( "を" );
					g_cmdtbl.push( g_command.substring( idx+1 ) );
				
				}
				else
				{
					g_cmdtbl.push( "" );
					g_cmdtbl.push( "" );
					g_cmdtbl.push( g_command );
				
				}
					console.log(g_cmdtbl,g_cmdtbl.length);
			}

//			message.push( ">"+g_command );
			message.push( ">"+g_cmdtbl.join("") );
		}
	}
}

//-----------------------------------------------------------------------------
window.onload = function()
//-----------------------------------------------------------------------------
{
	g_prevScene = "000";
	g_idScene = "000";
	g_nextScene = "006";

	//g_command = "見る";
	g_cmdtbl = ["","","見る"];
	html_input.value = "";

	main_update();
}

