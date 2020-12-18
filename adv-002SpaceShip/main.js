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

let g_key = Array(256);
let g_prevScene = "000";
let g_nextScene = "000";
let g_idScene = "000";
let g_cmdtbl = [];
let g_flgReqRefresh = true;

let g_chrIdx=0;
let	g_chrTbl = 
{
	"クレア"	:["img/C.png",	"クレア"	,undefined,
		[
			"予知能力を持つ。",
			"いつも考え事尾して自分の才能を役立てる方法を探っている。",
			"冷たイメージを持たれがちだが誰にでも優しい性格。",
			"ただロボットの類だけは好きではない。",
		],
	],
	"レイ"		:["img/R.png",	"レイ"		,undefined,
		[
			"戦略の天才で１５歳で世界最大の企業のCEOとなる。",
			"近寄りがたい雰囲気をもちチームワークは不得意。",
			"冷静沈着で緻密な思考の反面、不測の事態は苦手。",
			"勝利のために冷徹な判断ができる",
		]
	],
	"フェルゼン":["img/F.png",	"フェルゼン",undefined,
		[
			"フランス製ロボット。パスタ職人・ケーキ職人。",
			"世界で最も優秀なアンドロイドと評される。",
			"護衛のための格闘術も使える。進んで犠牲になるのを厭わない。",
			"完全な公正さを持つが、わずかでも規則から逸脱することができない。",
		]
		],
	"ノア"		:["img/N.png",	"ノア"		,undefined,
		[
			"ミシェルの弟。無口で人見知り。",
			"サッカージュニアワールドレベルの選手。",
			"姉と性格は正反対だが仲が良くいつも一緒にいる。",
			"姉を助けることを一番に考える。"
		]
	],
	"ミシェル"	:["img/M.png",	"ミシェル"	,undefined,
		[
			"ノアの姉。社交的で明るい性格。",
			"ベレーボールの世界レベルの選手。",
			"１８０ｃｍ。身長が伸びなくなってあきらめた。",
			"生物学の天才。専門ではないが医療知識に応用ができる。"
		]
	],
	"プロトン"	:["img/P.png",	"プロトン"	,undefined,
		[
			"体操オリンピック優勝者。マッチョで驚異的な身体能力を持つ。",
			"数学オリンピック、記憶力の世界大会でも連覇するほどの天才。",
			"責任感が強くリーダーだと勝手に考えている。"
		]
	],	
	"ケイ"		:["img/K.png",	"ケイ"		,undefined,
		[
			"両親二人は世界的に有名な科学者。",
			"英才教育をうけ自由気ままに育った。",
			"工作好きで工学の天才。創造的でいろんなものを作れる半面、",
			"他人の作ったものnの修理などは得意ではない。"
		]
	],
	"アルト"	:["img/A.png",	"アルト"	,undefined,
		[
			"コンピュータ好き。資料室にいつも入り浸って、",
			"宇宙ステーションについて調べている。",
			"好奇心旺盛でなんでも調べずにはいられない。",
			"従順な性格だが、自分の好奇心をやはり優先してしまう。"
		]
	],
	"バネット"	:["img/B.png",	"バネット"	,undefined,
		[
			"フェンシング二刀流競技のフェンディオンの世界ランク一位。",
			"真面目一辺倒な性格。時間があればVRルームでトレーニングをしている。",
			"ハヤトとフェルゼンとだけは進んで会話をする。"
		]
	],	
	"ユウト"	:["img/U.png",	"ユウト"	,undefined,
		[
			"自信家。皮肉屋。理論家。一番頭が良いと思っている。",
			"全く役に立たないようで、脱出路を見つけ出したり、",
			"想定外の解決方法を発案したり、",
			"なかなか侮れない重要メンバー。"
		]
	],
	"エミィ"	:["img/E.png",	"エミィ"	,undefined,
		[
			"最年少。IQ180の天才少女。",
			"毅然とふるまうが一人だと心細くなってうまくできない。",
			"頼まれたことは一心に取り組む健気で頼りになる",
			"。姉のような存在を憧れる。男嫌い。"
		]
	],
	"ハヤト"	:["img/H.png",	"ハヤト"	,undefined,
		[
			"コブドーの使い手。練習熱心。",
			"バネットが唯一一目置く相手。"
		]
	],
	"ユイ"		:["img/Y.png",	"ユイ"		,undefined,
		[
			"ドジっ子。",
			"なぜこの特選学級に選ばれたのか周囲から疑問を持たれてる。",
			"あまり気の利いたことは言わないが。いつもニコニコしてあまり存在感がない。",
			"重要な特殊能力テレパスを持つ。",
		]
	],
	"ジョー"	:["img/J.png",	"ジョー"	,undefined,
		[
			"明るく前向き。",
			"どんな時でも落ち込まないでみんなを励ます。ムードメーカー。",
			"人を嫌いにならないいいやつ。アンドロイドも好き。",
			"仲間思いで特に女性には優しい。冗談ばかり言っている。"
		]
	],
	"ディアナ"	:["img/D.png",	"ディアナ"	,undefined,
		[
			"学級委員長のようなちょっとした威厳がある。",
			"人に強要はしないが進んでそうしたいと思わせる交渉力が高い。",
			"計画性があり結果を重視する柔軟性もある。",
		]
	],
};

let g_tblScene =
{
	"000":	[[],[]],

	"クレアの部屋"	: [
			[],
			["X1"],
		],
	"ユイの部屋"	: [
			[],
			["PC-8001"],
		],
	"ディアナの部屋"	: [
			[],
			["MZ-1500"],
		],
	"エミィの部屋"	: [
			[],
			["TX-0"],
		],
	"バネットの部屋"	: [
			[],
			["Alto"],
		],
	"ケイの部屋"	: [
			[],
			["XEROX Star"],
		],
	"フェルゼンの部屋"	: [
			[],
			["SMC-777"],
		],
	"ミシェルの部屋"	: [
			[],
			["SC-3000"],
		],
	"ノアの部屋"	: [
			[],
			["MSX"],
		],
	"ユートの部屋"	: [
			[],
			["MSX2turboR"],
		],
	"アルトの部屋"	: [
			[],
			["FM-NEW7"],
		],
	"プロトンの部屋"	: [
			[],
			["FM-8"],
		],
	"レイの部屋"	: [
			[],
			["MZ-2500"],
		],
	"ジョーの部屋"	: [
			[],
			["X1turboZ3"],
		],
	"ハヤトの部屋"	: [
			[],
			["Apple]["],
		],
	"空き部屋"	: [
			[],
			["PC-9801"],
		],
	"共有大リビング"	: [
			[],
			["NLS"],
		],
	"ミーティングルーム"	: [
			[],
			["ENIAC"],
		],
	"管制室"	: [
			[],
			["ABCmachine"],
		],
	"機関室"	: [
			[],
			["Macintosh"],
		],
	"無重力ドーム"	: [
			[],
			["TRS-80"],
		],
	"資料室"	: [
			[],
			["System360"],
		],
	"トレーニングルーム"	: [
			[],
			["ポケコン"],
		],
	"VRルーム"	: [
			[],
			["X68000"],
		],

	"001":	[
				[
/*
					":t08ＡＣ２０６０年:w20:t04",
					"夏休み、w20少年少女が集まって宇宙ステーションでのスペースキャンプ。:w10",
					"事故が発生してコンピュータが破壊、救援を待つことにしたがw10",
					"制御を失った宇宙ステーションの落下が始まり脱出が必要となった・・・:w10:t01",
					":w30",
					"人がいる。",
					"「おーいハヤト！」",
					"あなたを呼んでいる。",
					"どうしますか？",
*/
				],
				["電池"],
			],

	"002":	[
				[],
				["カセットテープ"],
			],

	"003":	[
				[],
				["フロッピーディスク"],
			],

	"004":	[
				[],
				["パラメトロン"],
			],

	"005":	[
				[],
				["マイクロコンピュータ"],
			],

	"006":	[
				[],
				["4040"],
			],

};

let g_tblEvent =
[
	"監視室爆発",
	"エレベーター爆発",
	"リングA切り離し",
	"浮遊ドーム爆発",
	"リングB切り離し",
	"リングB切り離し",
	"エレベーターシャフト切り離し",
];

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
message.reqFlush = false;
let g=html_canvas.getContext('2d');

//--
let g_item = [];
g_item.push("ライト");
g_item.push("レーザーガン");
g_item.push("ハンディコンピュータ");

//-----------------------------------------------------------------------------
function sys_printImgae( img, dx, dy, dw, dh  )
//-----------------------------------------------------------------------------
{
			let sx = 0;
			let sy = 0;
			let sw = img.width
			let sh = img.height;
//			let dx = 500;
//			let dy = 0;
//			let dw = 192;
//			let dh = 192;
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
		while ( message.tic < message.str.length )
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

			if ( message.reqFlush == false ) break;
		}
		message.reqFlush = false;	
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
function main_update()
//-----------------------------------------------------------------------------
{
	html_input.focus();

	sys_cls();
	sys_print(660,20, "s:"+g_idScene );
//	sys_print(760,40, "t:"+message.isTic() );

	message.update();

	if ( g_nextScene != g_idScene && message.isTic() == false )
	{
//console.log(":"+g_nextScene+":",":"+g_idScene+":");
		//cmd = "見る";
		g_cmdtbl = ["","","到着"];
		g_prevScene = g_idScene;
		g_idScene = g_nextScene;
		g_flgReqRefresh = true;
		message.reqFlush = false;
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
			if ( purpose=="メンバー" )
			{
				for ( let key in g_chrTbl )
				{
					message.print( g_chrTbl[key][1] );
				}
			}
			else
			if ( g_chrTbl[purpose] != undefined )
			{
				for ( let i in g_chrTbl[purpose][3] )
				{
					message.print( g_chrTbl[purpose][3][i] );
				}
			}
			else
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
		if ( verb == "もどる" || verb == "戻る" )
		{
			if ( g_prevScene=="000" )
			{
				message.print( "ここから戻れるところはありません。" );
			}
			else
			{
				//g_nextScene = g_prevScene;
			}
		}
		else
		{
			if ( verb == "到着" )
			{
				message.print("【"+g_idScene+"】");
			}
			switch(g_idScene)
			{
				case "000":
					{
						message.print("ＡＣ２０６０年");
						message.print(":w20世界中から将来有望な天才少年少女が集められたスペースキャンプ");
//						message.print("デブリの衝突事故で制御コンピュータが破壊、援を待つことにしたがw10");
//						message.print("制御を失った宇宙ステーションの落下が始まり脱出が必要となった・・・w10");
//						message.print(":w30:j001");
						g_nextScene = "001";
					}
					break;
					
				case "クレアの部屋":
					if ( verb == "到着" )
					{
						message.print("女の子の部屋です");
					}
					if ( verb == "移動" )
					{
						message.print("どこへ？");
						message.print("A");
						message.print("B");
						message.print("C");
						message.print("D");
					}
					break;

				case "ディアナの部屋":
					if ( verb == "到着" )
					{
						message.print("女の子の部屋です");
					}
					break;
					
				case "001":
					if ( verb == "到着" )
					{
						message.print("「おーいハヤト！」");
						message.print("あなたを呼んでいる。");
					}
					else
					if ( verb == "見に行く" || verb == "みにいく"  || verb == "いく" || verb == "行く"  )
					{
						message.print("j002");
					}
					else
					if ( verb == "何？" || verb == "なに？"  || verb == "どうした？" || verb == "何" || verb == "なに"  || verb == "どうした" || verb == "いるよ" )
					{
						message.print( "ちょっと来てくれ" );
					}
					else
					if ( verb == "誰？" || verb == "だれ？"  || verb == "誰" || verb == "だれ" )
					{
						message.print( "俺だよ、レミガン。ちょっと来てほしいんだけど" );
					}
					else
					if ( verb == "いないよ" || verb == "居ないよ" )
					{
						message.print( "いるだろ！ちょっと来てっ" );
					}
					else
					if ( verb == "いや" || verb == "嫌" )
					{
						message.print( "いいから来てくれよ！" );
					}
					else
					{
						message.print( "それはできません" );
					}
					break;

				case "002":
					if ( verb == "到着" )
					{
						message.print("【オープンデッキ】");
						message.print("レミガン、とエイダがいる。");
						message.print("w30");
					}
					else
					if ( verb == "レミガンと話す" || verb == "レミガンとはなす" || verb == "何？" || verb == "なに？" || verb == "何だ？" || verb == "なんだ？" || verb == "何" || verb == "なに" || verb == "何だ" || verb == "なんだ"  )
					{
						message.print("これをみてくれ");
					}
					else
					if ( verb == "みる" || verb == "見る" )
					{
						message.print( "言ってみただけ。" );
					}
					else
					{
						message.print( "それはできません："+ verb);
					}
					break;

				default:
					break;
			}
		}
		g_flgReqRefresh = false;
	}

	// 全員の顔と名前を表示
	if(0)
	{
		let ox = 24;
		let fs = 14,fh=12;
		let dx = 0, dy = 0, dw = 96, dh = dw;

		dx=dw/2+ox;
		for ( let key in g_chrTbl )
		{
			sys_print( dx+dw/2, dy+dh+fh, g_chrTbl[key][1],fs,"center" );
			sys_printImgae( g_chrTbl[key][2], dx,dy,dw,dh);
			dx+=dw;
			if ( dx > 800-dw )
			{
				dx = ox;
				dy+=dh+20;
			}
		}
	}

	// 引き伸ばして表示
	if(0)
	{
	
			let chr =g_chrTbl[g_chrIdx];
			let dx = 500;
			let dy = 0;
			let dw = 192;
			let dh = 192;

			// イメージ表示
			sys_printImgae( chr[3], dx,dy,dw,dh);

			// 名前表示
			sys_print( dx+dw/2, dy+dh+20, chr[1],24,"center" );
	}

	
	requestAnimationFrame( main_update );

}

//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	let	c = ev.keyCode;
	g_key[c] = true;


	if ( c == KEY_LEFT )	{if ( g_chrIdx > 0 ) g_chrIdx--;}
	else
	if ( c == KEY_RIGHT )	{if ( g_chrIdx < 14 ) g_chrIdx++;}
	else
	if ( c == KEY_DOWN || c == KEY_UP || c == KEY_LEFT || c == KEY_RIGHT )
	{
		message.reqFlush = true;
	} 
	else
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

//-----------------------------------------------------------------------------
window.onload = function()
//-----------------------------------------------------------------------------
{
	g_prevScene = "000";
	g_idScene = "000";
	g_nextScene = "クレアの部屋";

	g_cmdtbl = ["","",""];
	html_input.value = "";

	for ( let key in g_chrTbl )
	{
		let img = new Image();
		img.src	= g_chrTbl[key][0];
		g_chrTbl[key][2] = img;
	}
/*
	for ( let i=0 ; i < g_chrTbl.length ; i++ )
	{
		let img = new Image();
		img.src	= g_chrTbl[i][0];
		g_chrTbl[i][2] = img;
	}
*/
	main_update();
}

