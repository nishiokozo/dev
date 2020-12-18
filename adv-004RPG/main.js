'use strict';

const	KEY_SPC	= 0x20;
const	KEY_CR	= 13;
const	KEY_I	= 73;
const	KEY_O	= 79;
const	KEY_Z	= 90;
const	KEY_LEFT	= 37;
const	KEY_UP		= 38;
const	KEY_RIGHT	= 39;
const	KEY_DOWN	= 40;

let g_nextScene = "000";
let g_idxScene = "000";
let g_cmdtbl = [];
let g_flgReqRefresh = true;

let message = {};
message.cntStr = 0;
message.maxStr = 11;
message.tblStr = Array(message.maxStr);
for (let i = 0 ; i < message.tblStr.length ; i++ ) message.tblStr[i]="";
message.str="";
message.tic=0;
message.valTempo=0;
message.defTempo=1;
message.wait=0;
message.fontsize=16+8;
message.fontheight=24+8;
let g=html_canvas.getContext('2d');


//-----------------------------------------------------------------------------
function sys_printImgae( img, dx, dy, dw, dh  )
//-----------------------------------------------------------------------------
{
	let sx = 0;
	let sy = 0;
	let sw = img.width
	let sh = img.height;
	g.drawImage( img,sx,sy,sw,sh,dx,dy,dw,dh);	// ImageDataは引き延ばせないけど、Imageは引き延ばせる

}
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
	message.str = "";
	message.tic = 0;
}
//-----------------------------------------------------------------------------
message.isTic = function()
//-----------------------------------------------------------------------------
{
	return (message.tic < message.str.length );
}
//-----------------------------------------------------------------------------
message.update = function()
//-----------------------------------------------------------------------------
{
	// 文字タイピング
	if ( message.valTempo > 0 ) 
	{
		message.valTempo--;
	}
	else
	{
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

			let delay = message.defTempo;
			{
				let cmd = message.str.substr( message.tic, 5 );
				if ( cmd.substr(0,2) == ":j" )
				{
					g_nextScene = cmd.substr(2,3);
					message.tic+=":j###".length;
				}
				else
				if ( cmd.substr(0,2) == ":t" )
				{
					let val = Number( cmd.substr(2,2) );
					message.defTempo = val;
					delay = val;
					message.tic+=":t##".length;
				}
				else
				if ( cmd.substr(0,2) == ":w" )
				{
					let val = Number( cmd.substr(2,2) );
					delay = val;
					message.tic+=":w##".length;
				}
				else
				if ( message.str.substr( message.tic, ":cr".length ) == ":cr" )
				{
					message.cntStr++;
					message.tic+=":cr".length;
				}
				else
				{
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
			message.valTempo = delay;

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
	if ( tbl == undefined ) return;

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
	if ( tbl == undefined ) return;

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
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	let	c = ev.keyCode;


	if ( c == KEY_CR ) 
	{
		let cmd = html_input.value;
		if ( cmd != "" )
		{
			html_input.value = "";
			g_flgReqRefresh = true;

			// 字句分解
			{
				g_cmdtbl = [];
				let idx;
				 
				idx = cmd.indexOf( "を" );
				if ( idx != -1 )
				{
					g_cmdtbl.push( cmd.substring( 0, idx ) );
					g_cmdtbl.push( "を" );
					g_cmdtbl.push( cmd.substring( idx+1 ) );
				}

				idx = cmd.indexOf( "へ" );
				if ( idx != -1 )
				{
					g_cmdtbl.push( cmd.substring( 0, idx ) );
					g_cmdtbl.push( "へ" );
					g_cmdtbl.push( cmd.substring( idx+1 ) );
				}

				idx = cmd.indexOf( "に" );
				if ( idx != -1 )
				{
					g_cmdtbl.push( cmd.substring( 0, idx ) );
					g_cmdtbl.push( "に" );
					g_cmdtbl.push( cmd.substring( idx+1 ) );
				}

				if ( g_cmdtbl.length==0 )
				{
					g_cmdtbl.push( "" );
					g_cmdtbl.push( "" );
					g_cmdtbl.push( cmd );
				
				}
					console.log(g_cmdtbl,g_cmdtbl.length);
			}
			message.push( ">"+g_cmdtbl.join("") );
		}
	}
}

///////////////////////////////////////////////////////////////////////////////
// カスタム
///////////////////////////////////////////////////////////////////////////////

//-----------------------------------------------------------------------------
function main_update()
//-----------------------------------------------------------------------------
{
	html_input.focus();

	sys_cls();
	sys_print(660,20, "s:"+g_idxScene );

	message.update();

	if ( g_nextScene != g_idxScene && message.isTic() == false )
	{
		g_cmdtbl = ["","","次シーン"];
		g_idxScene = g_nextScene;
		g_flgReqRefresh = true;
	}

	if ( g_flgReqRefresh )
	{
		g_flgReqRefresh = false;
		story_update();
	}

	
	requestAnimationFrame( main_update );

}


let g_item = [];
g_item.push("ライト");
g_item.push("レーザーガン");
g_item.push("ハンディコンピュータ");

//-----------------------------------------------------------------------------
function story_update()
//-----------------------------------------------------------------------------
{

	let id = g_idxScene;
	let purpose = g_cmdtbl[0];
	let verb = g_cmdtbl[2];

	// 共通コマンド
	if ( verb == "進む" || verb == "すすむ" )
	{
		g_nextScene = g_tblScene[id][2][0];
		return;
	}
	else
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
				for ( let i = 0 ; i < g_tblScene[id][0].length ; i++ )
				{
					message.print( g_tblScene[id][0][i] );
				}
				scene_printItems( g_tblScene[id][1] );
				scene_printCasts( g_tblScene[id][2] );
			}
		}
	}
	else
	if ( verb == "調べる" || verb == "しらべる"  )
	{
		{
			message.print( "調べられません" );
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
			message.print( "むりですね。" );
		}
	}
	else
	if ( verb == "とる" || verb == "拾う" || verb == "取る" || verb == "ひろう"  )
	{
		if( item_move( purpose, g_tblScene[id][1], g_item ) )
		{
			message.print( purpose+"をもちものに入れました。" );
		}
		else
		{
			message.print( "取れませんでした。" );
		}
	}
	else
	if ( verb == "移動"  )
	{
		if ( g_tblScene[purpose] != undefined )
		{
			g_nextScene	= purpose;
		}
		else
		{
			message.print( "移動できません" );
		}
	}
	else
/*
	if ( verb == "もどる" || verb == "戻る" )
	{
//		if ( g_prevScene=="000" )
//		{
//			message.print( "ここから戻れるところはありません。" );
//		}
///		else
//		{
			//g_nextScene = g_prevScene;
//		}
//	}
	else
*/
	{
		if ( verb == "次シーン" )
		{
			for ( let i = 0 ; i < g_tblScene[g_idxScene][0].length ; i++ )
			{
				message.print( g_tblScene[g_idxScene][0][i] );
			}
		}
		if ( verb == "今日"  )
		{
			message.print(""+g_dateY+"年"+"X月"+"X日です");
		}
	}
}

//-----------------------------------------------------------------------------
window.onload = function()
//-----------------------------------------------------------------------------
{
	//g_prevScene = "";
	g_idxScene = "";
	g_nextScene = "プロローグ";

	g_cmdtbl = ["","",""];
	html_input.value = "";

	main_update();
}

///////////////////////////////////////////////////////////////////////////////
// シナリオ部
///////////////////////////////////////////////////////////////////////////////

let g_tblScene =
{
	"プロローグ":	[
/*文章*/	["城の前にいます"],
/*Item*/	[],
/*進行*/	["アロハーの城"],
		],

	"アロハーの城":[
			[
				"アロハーの城です",
			],
			["宿屋","酒場","教会","武器屋"],
			["001"],
		],
	"001":[
			[
				"中学校を卒業し高校に進学しました",
			],
			[],
			["002"],
		],
	"002":[
			[
				"彼女ができました",
			],
			[],
			["003"],
		],
	"003":[
			[
				"高校を卒業し大学に進学しました",
			],
			[],
			["004"],
		],
	"004":[
			[
				"２０歳になりました",
			],
			[],
			["005"],
		],
	"005":[
			[
				"大学を卒業し企業に就職しました",
			],
			[],
			["006"],
		],
	"006":[
			[
				"新しい恋人ができました",
			],
			[],
			["007"],
		],
	"007":[
			[
				"恋人と結婚しました",
			],
			[],
			["008"],
		],
	"008":[
			[
				"子供ができました",
			],
			[],
			["009"],
		],
	"009":[
			[
				"３０歳になりました",
			],
			[],
			["010"],
		],
	"010":[
			[
				"昇進しました",
			],
			[],
			["011"],
		],
	"011":[
			[
				"４０歳になりました",
			],
			[],
			["012"],
		],
	"012":[
			[
				"二人目の子供が生まれました",
			],
			[],
			["013"],
		],
	"013":[
			[
				"ローンを組んで家を建てました",
			],
			[],
			["014"],
		],
	"014":[
			[
				"父親が最近倒れました",
			],
			[],
			["015"],
		],
	"015":[
			[
				"５０歳になりました",
			],
			[],
			["016"],
		],
	"016":[
			[
				"部長に昇進しました",
			],
			[],
			["017"],
		],
	"017":[
			[
				"父親が亡くなりました",
			],
			[],
			["018"],
		],
	"018":[
			[
				"６０歳になりました",
			],
			[],
			["019"],
		],
	"019":[
			[
				"母親が老人ホームに入ることになりました",
			],
			[],
			["020"],
		],
	"020":[
			[
				"定年退職になりました",
			],
			[],
			["021"],
		],
	"021":[
			[
				"初孫が生まれました",
			],
			[],
			["022"],
		],
	"022":[
			[
				"母親が亡くなりました",
			],
			[],
			["023"],
		],
	"023":[
			[
				"７０歳になりました",
			],
			[],
			["024"],
		],
	"024":[
			[
				"大きな病気にかかりましたが改善しました",
			],
			[],
			["025"],
		],
	"025":[
			[
				"８０歳になりました",
			],
			[],
			["026"],
		],
	"026":[
			[
				"奥様がなくなられました",
			],
			[],
			["027"],
		],
	"027":[
			[
				"息子が一緒に住むかと聴いてきました",
			],
			[],
			["028"],
		],
	"028":[
			[
				"最近痴呆が進んできました",
			],
			[],
			["029"],
		],
	"029":[
			[
				"老人ホームに入居しました",
			],
			[],
			["030"],
		],
	"030":[
			[
				"９０歳になりました",
			],
			[],
			["031"],
		],
	"031":[
			[
				"寝たきりになりました",
			],
			[],
			["032"],
		],
	"032":[
			[
				"１００歳でお亡くなりになりました。",
				"ゲームオーバー",
			],
			[],
			["033"],
		],

	"0歳"	: [
			[],
			["X1"],
		],
	"10歳"	: [
			["10歳になったよー"],
			["PC-8001"],
		],
	"15歳"	: [
			["15歳になったよー"],
			["MZ-1500"],
		],
	"20歳"	: [
			[],
			["Alto"],
		],
	"25歳"	: [
			[],
			["XEROX Star"],
		],
	"30歳"	: [
			[],
			["SMC-777"],
		],
	"35歳"	: [
			[],
			["SC-3000"],
		],
	"40歳"	: [
			[],
			["MSX"],
		],
	"45歳"	: [
			[],
			["MSX2turboR"],
		],
	"50歳"	: [
			[],
			["FM-NEW7"],
		],
	"55歳"	: [
			[],
			["FM-8"],
		],
	"60歳"	: [
			[],
			["MZ-2500"],
		],
	"65歳"	: [
			[],
			["X1turboZ3"],
		],
	"70歳"	: [
			[],
			["Apple]["],
		],
	"75歳"	: [
			[],
			["PC-9801"],
		],
	"80歳"	: [
			[],
			["NLS"],
		],
	"85歳"	: [
			[],
			["ENIAC"],
		],
	"90歳"	: [
			[],
			["ABCmachine"],
		],
	"95歳"	: [
			[],
			["Macintosh"],
		],
	"100歳"	: [
			[],
			["TRS-80"],
		],
};
