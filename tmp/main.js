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
let g_prevScene = 0;
let g_nextScene = 0;
let g_numScene = 0;
let g_command = "";
let g_flgReqRefresh = true;

let message = {};
message.cntStr = 0;
message.maxStr = 14;
message.tblStr = Array(message.maxStr);
for (let i = 0 ; i < message.tblStr.length ; i++ ) message.tblStr[i]="";
message.str="";
message.tic=0;
message.delay=0;
message.wait=0;
message.fontsize=16;
message.fontheight=24;
let g=html_canvas.getContext('2d');

//--
let g_item = [];
g_item.push("本");
g_item.push("電球");
g_item.push("ライト");
g_item.push("ペン");

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
	g.fillStyle = "#ffffffff";
	g.fillRect( 0,0,639,399 );
}

//-----------------------------------------------------------------------------
message.print = function( str )
//-----------------------------------------------------------------------------
{
	message.str += str+":cr";
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
					message.tblStr[ message.cntStr ] += message.str.substr( message.tic, 1 );
					message.tic++;
					if ( message.tic >= message.str.length )
					{
						message.cntStr++;
					}
				}
			}
		}
	}
		
	// 表示
	{
		let y0 = 16; // 表示位置補正

		//上付き表示
		for ( let i = 0 ; i < message.maxStr ; i++ )
		{
			sys_print( 0,y0+(i+1)*(message.fontheight)-4, message.tblStr[i], message.fontsize );
		}
	}	

}

//-----------------------------------------------------------------------------
function	scene000_start( cmd )
//-----------------------------------------------------------------------------
{

	if ( cmd == "見る" || cmd == "みる" )
	{
		message.print( "このゲームでは一度も出てきてない単語は使えません。" );
		message.print( "ひらがな入力でも漢字入力でもどちらでも大丈夫です。" );
		message.print( "それでは『はじめる』と入力してください。" );
	}
	else
	if ( cmd == "はじめる" || cmd == "始める" )
	{
//		message.clr();
		g_nextScene = 1;
	}
	else
	{
		message.print( "それはできません" );
	}
}
//-----------------------------------------------------------------------------
function	scene001_elegang( cmd )
//-----------------------------------------------------------------------------
{

	if ( cmd == "見る" || cmd == "みる" )
	{
		message.print( "おもちゃメーカー、エレガングの前にいます。入口と警備員が見えます。" );
//		message.print( "おもちゃメーカー、エレガングの前にいます。" );
//		message.print( "入口と警備員が見えます。" );
	}
	else
	if ( cmd == "話す" || cmd == "はなす" || cmd == "警備員と話す" || cmd == "警備員とはなす" )
	{
		message.print( "おはようございます。受付でカードをもらってください。" );
	}
	else
	if ( cmd == "しらべる"  )
	{
		message.print( "あなたはこの会社の製品企画部に所属しています。" );
//		message.print( "ヒット作をいつか出したいところですが・・・" );
	}
	else
	if ( cmd == "入る" || cmd == "はいる" )
	{
//		message.clr();
		g_nextScene = 2;
	}
	else
	{
		message.print( "それはできません" );
	}
}
//-----------------------------------------------------------------------------
function	scene002_inelegang( cmd )
//-----------------------------------------------------------------------------
{

	if ( cmd == "見る" || cmd == "みる" )
	{
		message.print( "エレガングのロビーにいます。フロアには、エレベーターと受付嬢がいます。" );

	}
	else
	if ( cmd == "触る" || cmd == "さわる" )
	{
		message.print( "やめてください。" );
	}
	else
	if ( cmd == "話す" || cmd == "はなす" || cmd == "受付嬢と話す" || cmd == "受付嬢とはなす" )
	{
//		message.clr();
		g_nextScene = 3;
	}
	else
	if ( cmd == "エレベーターに乗る" || cmd == "エレベーターへ乗る" || cmd == "エレベーターに入る" || cmd == "エレベーターへ入る" || cmd == "エレベーターにのる" || cmd == "エレベーターへのる" || cmd == "エレベーターへはいる" || cmd == "エレベーターにはいる" )
	{
//		message.clr();
		g_nextScene = 4;
	}
	else
	if ( cmd == "出る" || cmd == "でる" )
	{
		g_nextScene = g_prevScene;
	}
	else
	{
		message.print( "それはできません" );
	}
}
//-----------------------------------------------------------------------------
function	scene003_talkGirl( cmd )
//-----------------------------------------------------------------------------
{

	if ( cmd == "みる" || cmd == "見る"  )
	{
		message.print( "いらっしゃいませ。どちらに御用ですか？" );
	}
	else	
	if ( cmd == "社長"  )
	{
		message.print( "アポイントがなければお会いできません。" );
	}
	else
	if ( cmd == "あなた"  )
	{
		message.print( "いまお会いしております。" );
	}
	else
	if ( cmd == "製品企画部" || cmd == "せいひんきかくぶ" )
	{
		g_item.push("カード");
		message.print( "こーぞさんですね。こちらのカードをどうぞ。" );
	}
	else
	if ( cmd == "総理大臣" )
	{
		message.print( "こちらにはいらっしゃいません。" );
	}
	else
	if ( cmd == "やめる" || cmd == "止める" || cmd == "おわる" || cmd == "終わる" || cmd == "さようなら"  || cmd == "どうも" || cmd == "ばいばい" || cmd == "ありがとう" || cmd == "すすむ" || cmd == "進む" )
	{
		message.print( "ご用件がありましたらまたどうぞ" );
		message.print( "" );
		g_nextScene = 2;
	}
	else
	{
		message.print( "すみません、もう一度お願いします。" );
	}
}

//-----------------------------------------------------------------------------
function	scene004_elevator( cmd )
//-----------------------------------------------------------------------------
{

	if ( cmd == "みる" || cmd == "見る"  )
	{
		message.print( "エレベーターの中です。カードリーダーがあります。" );
	}
	else
	if ( cmd == "しらべる" || cmd == "調べる" )
	{
		message.print( "カードリーダーがあります。" );
	}
	else
	if ( cmd == "カードを入れる" || cmd == "カードをいれる" || cmd == "カードをいれる" || cmd == "カードをさす" || cmd == "カードを挿す" || cmd == "カードをさしこむ" || cmd == "カードを差し込む" || cmd == "カードをつかう" || cmd == "カードを使う" )
	{
		if ( g_item.indexOf("カード") != -1 )
		{
			message.print( "動き出しました。" );
//			message.clr();
			g_nextScene = 5;
		}
		else
		{
			message.print( "カードを持っていません。" );
		}
	}
	else
	if ( cmd == "出る" || cmd == "でる" )
	{
		g_nextScene = g_prevScene;
	}
	else
	{
		message.print( "それはできません" );
	}
}
//-----------------------------------------------------------------------------
function	scene005_seihinnkikaku( cmd )
//-----------------------------------------------------------------------------
{
	if ( cmd == "みる" || cmd == "見る"  )
	{
		message.print( "製品企画部です。エレベーター、その他いろんな人がいます。" );
	}
	else
	if ( cmd == "エレベーターに乗る" || cmd == "エレベーターへ乗る" || cmd == "エレベーターに入る" || cmd == "エレベーターへ入る" || cmd == "エレベーターにのる" || cmd == "エレベーターへのる" || cmd == "エレベーターへはいる" || cmd == "エレベーターにはいる" )
	{
//		message.clr();
		g_nextScene = 4;
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
	sys_print(580,16, "s:"+g_numScene );

	message.update();

	if ( g_flgReqRefresh )
	{
		// 共通コマンド
		if ( g_command == "もちもの" || g_command == "アイテム"  )
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
			switch( g_numScene )
			{
			case 0: scene000_start( g_command );	break;
			case 1: scene001_elegang( g_command );	break;
			case 2:	scene002_inelegang( g_command );	break;
			case 3:	scene003_talkGirl( g_command );	break;
			case 4:	scene004_elevator( g_command );	break;
			case 5:	scene005_seihinnkikaku( g_command );	break;

			}
		}
		g_flgReqRefresh = false;
	}
	if ( g_nextScene != g_numScene )
	{
		g_command = "見る";
		g_prevScene = g_numScene;
		g_numScene = g_nextScene;
		g_flgReqRefresh = true;
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
		g_command = html_input.value.substr(1);

		html_input.value = ">";
		g_flgReqRefresh = true;
		message.print( ">"+g_command );
console.log( g_command );
	}


}

//-----------------------------------------------------------------------------
window.onload = function()
//-----------------------------------------------------------------------------
{
	g_prevScene = 0;
	g_numScene = 0;
	g_nextScene = 0;

	g_command = "見る";

	main_update();
}

