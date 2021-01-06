let g=html_canvas.getContext('2d');
//-----------------------------------------------------------------------------
function rad( deg )
//-----------------------------------------------------------------------------
{
	return deg/180*Math.PI;
}
//-----------------------------------------------------------------------------
let box = function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.strokeStyle = "#000000";
    g.rect(sx,sy,ex-sx,ey-sy);
	g.closePath();
	g.stroke();

}
//-----------------------------------------------------------------------------
let fill= function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	g.beginPath();
    g.rect(sx,sy,ex-sx,ey-sy);
	g.closePath();
	g.fillStyle = "#000000";
	g.fill();
	g.stroke();

}

//-----------------------------------------------------------------------------
let line = function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.strokeStyle = "#000000";
	g.lineWidth = 1.1;
	g.moveTo( sx, sy );
	g.lineTo( ex, ey );
	g.closePath();
	g.stroke();
}

//-----------------------------------------------------------------------------
function print( tx, ty, str )
//-----------------------------------------------------------------------------
{
	g.font = "12px monospace";
	g.fillStyle = "#000000";
	g.fillText( str, tx, ty );
}

//-----------------------------------------------------------------------------
let circle = function( x,y,r )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.arc(x, y, r, 0, Math.PI * 2, true);
	g.closePath();
	g.stroke();
}

//-----------------------------------------------------------------------------
function cls()
//-----------------------------------------------------------------------------
{
	g.fillStyle = "#ffffff";
	g.fillRect( 0, 0, html_canvas.width, html_canvas.height );
}

let g_cast ={};
g_cast.cnt = 0;
g_cast.tbl = new Array(100);



class BreathClass
{
	constructor()
	{
		this.lim	= 0;
	}
	on( _x, _y, _r, _dir, _spd,_lim, _add_r )
	{
		this.x		= _x;
		this.y		= _y;
		this.r		= _r;
		this.add_r	= _add_r;
		this.dir	= _dir;
		this.spd	= _spd;
		this.lim	= _lim;
	}
};

let g_breath = {};
g_breath.cnt = 0;
g_breath.tbl = Array(100);
for ( let i = 0 ; i < g_breath.tbl.length ; i++ )
{
	g_breath.tbl[i] = new BreathClass();
	
}
g_breath.fire = function( _x, _y, _r, _dir, _spd,_lim, _add_r )
{
	for ( let i = 0 ; i < g_breath.tbl.length ; i++ )
	{
		if ( g_breath.tbl[i].lim == 0 )
		{
			g_breath.tbl[i].on( _x, _y, _r, _dir, _spd, _lim, _add_r );
			break;
		}
	}
}

/*
const THINK_NONE			= 0;	// 思考しない	ユーザーコントロール

const THINK_ATTACK			= 1;	// 攻撃			接近戦	追いかける剣で戦う
const THINK_LONGATTACK		= 2;	// ロング攻撃	距離戦	弓、魔法から適切なものが自動選択
const THINK_DEFFENCE		= 3;	// 護衛			体力の弱い仲間を護衛する。
const THINK_MAB				= 4;	// 回り込むB	背後に回り込む
const THINK_MAF				= 5;	// 回り込むF	敵の前をふさぐ
const THINK_RUN				= 6;	// 逃げる
const THINK_SEARCH			= 7;	// 探す

const THINK_BACK			= 8;	// 後退
const THINK_FORWARD			= 9;	// 前進
const THINK_MAWARI_R		= 10;	// 回り込み右
const THINK_MAWARI_L		= 11;	// 回り込み左
const THINK_ATTACK_BREATH	= 12;	// ブレス攻撃
const THINK_ATTACK_BITE		= 13;	// 噛みつき攻撃
*/

//const ATTACK_BREATH	= 0;
//const ATTACK_BITE		= 1;

//const ATTACK_NONE			= 0;	// 攻撃しない
//const ATTACK_TYPE_BREATH	= 1;	// ブレス攻撃
//const ATTACK_TYPE_BITE		= 2;	// 噛みつき攻撃

let g_tblAttack =
[
	{//0 undefined
	},

	{//1	ブレス
		lim			: 80,
		freq		: 2,
		rot			: rad(2),
		dir			: -rad(30),
		br_r		: 32*0.1,		//c1.size/10,
		br_add_r	: 32*0.005,	//c1.size/200,
		br_spd		: 2,
		br_lim		: 40,
	},

	{// 2	噛みつき
		lim			: 8,
		freq		: 4,
		rot			: rad(0),
		dir			: rad(0),
		br_r		: 1.2,	//0.1,		//c1.size/10,
		br_add_r	: 1.0,
		br_spd		: 1,
		br_lim		: 8,
	},

	{// 3	パンチ
		lim			: 8,
		freq		: 4,
		rot			: rad(0),
		dir			: -rad(0),
		br_r		: 20.0,
		br_add_r	: 1,
		br_spd		: 1,
		br_lim		: 2,
	}
];


let g_tblThink_dummy =
[
	{name:""			,atc_no:0,mov_dir:rad(0)	,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
	{name:"B"			,atc_no:0,mov_dir:rad(180)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:30, quant:120, num:3 },
	{name:"F"			,atc_no:0,mov_dir:rad(0)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
	{name:"R"			,atc_no:0,mov_dir:rad( 45)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
	{name:"L"			,atc_no:0,mov_dir:rad(-45)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
	{name:"噛みつき"	,atc_no:2,mov_dir:rad(0)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
];
let g_tblThink_dragon =
[
	{name:""			,atc_no:0,mov_dir:rad(0)	,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
	{name:"B"			,atc_no:0,mov_dir:rad(180)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:20, quant: 72, num:3 },
	{name:"R"			,atc_no:0,mov_dir:rad( 60)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:20, quant:120, num:3 },
	{name:"L"			,atc_no:0,mov_dir:rad(-60)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:20, quant:120, num:3 },
	{name:"ブレス"		,atc_no:1,mov_dir:rad(0)	,mov_spd:0.25		, rot_spd:rad(0.6)	,rate:10, quant:240, num:3 },
];
let g_tblThink_wolf =
[
	{name:""			,atc_no:0,mov_dir:rad(0)	,mov_spd:0.20		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
	{name:"B"			,atc_no:0,mov_dir:rad(180)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:30, quant: 72, num:3 },
	{name:"F"			,atc_no:0,mov_dir:rad(0)	,mov_spd:0.75		, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
	{name:"R"			,atc_no:0,mov_dir:rad( 80)	,mov_spd:0.34 		, rot_spd:rad(1.4)	,rate:10, quant:120, num:3 },
	{name:"L"			,atc_no:0,mov_dir:rad(-80)	,mov_spd:0.34 		, rot_spd:rad(1.4)	,rate:10, quant:120, num:3 },
	{name:"噛みつき"	,atc_no:2,mov_dir:rad(0)	,mov_spd:0.75		, rot_spd:rad(0.21)	,rate:10, quant:120, num:3 },
];
let g_tblThink_mino =
[
	{name:""			,atc_no:0,mov_dir:rad(0)	,mov_spd:0.20		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
	{name:"B"			,atc_no:0,mov_dir:rad(180)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:30, quant: 72, num:3 },
	{name:"F"			,atc_no:0,mov_dir:rad(0)	,mov_spd:0.40		, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
	{name:"R"			,atc_no:0,mov_dir:rad( 45)	,mov_spd:0.40 		, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
	{name:"L"			,atc_no:0,mov_dir:rad(-45)	,mov_spd:0.40 		, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
	{name:"パンチ"		,atc_no:3,mov_dir:rad(0)	,mov_spd:0.75		, rot_spd:rad(0.6)	,rate:30, quant:120, num:3 },
];
let g_tblThink_ghost =
[
	{name:""			,atc_no:0,mov_dir:rad(0)	,mov_spd:0			, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
	{name:"FR"			,atc_no:0,mov_dir:rad(60)	,mov_spd:0.35		, rot_spd:rad(0.3)	,rate:12, quant: 96, num:3 },
	{name:"FL"			,atc_no:0,mov_dir:rad(-60)	,mov_spd:0.35		, rot_spd:rad(0.3)	,rate:12, quant: 96, num:3 },
	{name:"BR"			,atc_no:0,mov_dir:rad( 120)	,mov_spd:0.30 		, rot_spd:rad(0.3)	,rate:10, quant: 96, num:3 },
	{name:"BL"			,atc_no:0,mov_dir:rad(-120)	,mov_spd:0.30 		, rot_spd:rad(0.3)	,rate:10, quant: 96, num:3 },
];
let g_tblThink_zombie =
[
	{name:""			,atc_no:0,mov_dir:rad( 0)	,mov_spd:0			, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
	{name:"探す"		,atc_no:0,mov_dir:rad(  0)	,mov_spd:0.1 		, rot_spd:rad(1.0)	,rate:10, quant: 48, num:3 },
	{name:"F"			,atc_no:0,mov_dir:rad(  0)	,mov_spd:0.25 		, rot_spd:rad(0.1)	,rate:10, quant: 72, num:3 },
	{name:"FR"			,atc_no:0,mov_dir:rad( 30)	,mov_spd:0.25		, rot_spd:rad(0.1)	,rate:10, quant: 72, num:3 },
	{name:"FL"			,atc_no:0,mov_dir:rad(-30)	,mov_spd:0.25		, rot_spd:rad(0.1)	,rate:10, quant: 72, num:3 },
];
let g_tblThink_swordman =
[
	{name:""			,atc_no:0,mov_dir:rad( 0)	,mov_spd:0			, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
	{name:"F"			,atc_no:0,mov_dir:rad(  0)	,mov_spd:0.8 		, rot_spd:rad(0.3)	,rate:10, quant: 72, num:3 },
	{name:"FR"			,atc_no:0,mov_dir:rad( 45)	,mov_spd:0.4		, rot_spd:rad(0.6)	,rate:10, quant: 72, num:3 },
	{name:"FR"			,atc_no:0,mov_dir:rad( 90)	,mov_spd:0.4		, rot_spd:rad(0.6)	,rate:20, quant: 72, num:3 },
	{name:"BL"			,atc_no:0,mov_dir:rad(-140)	,mov_spd:0.3		, rot_spd:rad(0.1)	,rate:20, quant: 96, num:3 },
];
const GID_NONE		= 0;	// NONE
const GID_PLAYER1	= 1;	// Player
const GID_PLAYER2	= 2;	// Player
const GID_PLAYER3	= 3;	// Player
const GID_DRAGON	= 4;	// ドラゴン
const GID_WOLF		= 5;	// ウルフ
const GID_MINO		= 6;	// ミノタウロス
const GID_GHOST		= 7;	// ゴースト
const GID_ZOMBIE	= 8;	// ゾンビ
const GID_SWORDMAN	= 9;	// ソードマン

let g_group =
[
	["NONE"			, 2, g_tblThink_dummy],
	["こーぞ"		, 16, g_tblThink_dummy],
	["ティナ"		, 16, g_tblThink_dummy],
	["ユイ"			, 16, g_tblThink_dummy],
	["ドラゴン"		, 52, g_tblThink_dragon],
	["ウルフ"		, 10, g_tblThink_wolf],
	["ミノタウロス"	, 30, g_tblThink_mino],
	["ゴースト"		, 14, g_tblThink_ghost],
	["ゾンビ"		, 12, g_tblThink_zombie],
	["ソードマン"	, 16, g_tblThink_swordman],
];

function unit_makeThinkRatio( tblThink )
{// rate（割合）からratio（比率）を作成
	let amt = 0;
	for ( let i = 0 ; i < tblThink.length ; i++ )
	{
		amt += tblThink[i].rate;
		tblThink[i].ratio = amt;
	}
	for ( let i = 0 ; i < tblThink.length ; i++ )
	{
		tblThink[i].ratio /= amt;
	}
}
for ( let i = 0 ; i < g_group.length ; i++ )
{
	unit_makeThinkRatio( g_group[i][2] );
}


for ( let i = 0 ; i < g_cast.tbl.length ; i++ )
{
	let gid=0;	// グループID 0=NONE
	let x=0;
	let y=0;
	let time=0;
	let size=0;
	let name="";
	let dir=0;
	let think_type=0;//THINK_NONE;
	let think_lim=60;
	let to_th=0;
	let attack_lim = 0;
	let attack_freq = 0;
	let attack_no = 0;
	let attack_dir = 0;
	let tblThink=g_group[GID_NONE][2];

	g_cast.tbl[i] = {gid,x,y,size,name,time,dir,think_type,to_th,think_lim
		,attack_lim		//攻撃リミット
		,attack_freq	//攻撃頻度
		,attack_no
		,attack_dir		//攻撃角度(リアルタイム更新)
		,tblThink
	};
}


//-----------------------------------------------------------------------------
g_cast.add = function( gid, x, y, dir, name, size, tblThink )
//-----------------------------------------------------------------------------
{
	if ( g_cast.cnt+1 >= g_cast.tbl.length ) return;
	g_cast.tbl[ g_cast.cnt ].gid	= gid;	// グループID , 1:Player
	g_cast.tbl[ g_cast.cnt ].x		= x;
	g_cast.tbl[ g_cast.cnt ].y		= y;
	g_cast.tbl[ g_cast.cnt ].to_th	= 0;
	g_cast.tbl[ g_cast.cnt ].size	= size;
	g_cast.tbl[ g_cast.cnt ].dir	= dir;
	g_cast.tbl[ g_cast.cnt ].name	= name;
	g_cast.tbl[ g_cast.cnt ].tblThink	= tblThink;	
	g_cast.cnt++;
}

/*
//-----------------------------------------------------------------------------
function	dice( n ) 
//-----------------------------------------------------------------------------
{
	return Math.floor( Math.random()*n )+1;
}
*/
//-----------------------------------------------------------------------------
function rand( n ) // n=3以上が正規分布
//-----------------------------------------------------------------------------
{
	let r = 0;
	for ( j = 0 ; j < n ; j++ ) r += Math.random();
	return r/n;
}

//-----------------------------------------------------------------------------
g_cast.update = function( c1 )
//-----------------------------------------------------------------------------
{

	let ax		= c1.x;
	let ay		= c1.y;
	let think1	= c1.tblThink[ c1.think_type ];
	let	er = Math.cos(rad(c1.time*10))*1.2;
	circle( ax, ay, er+c1.size );

	if ( think1.atc_no != 0 && c1.attack_lim == 0 )
	{
		c1.attack_no = think1.atc_no;
		let attack = g_tblAttack[ c1.attack_no ];
		c1.attack_lim		= attack.lim;
		c1.attack_freq		= attack.freq;
		c1.attack_dir		= attack.dir;

		c1.think_lim = attack.lim/2;
	}
	
//	print( ax+c1.size, ay-c1.size, c1.name+" "+think1.name+" "+c1.think_lim );
	print( ax+c1.size, ay-c1.size, c1.name );
	let dx = c1.size * Math.cos( c1.dir ) + ax;
	let dy = c1.size * Math.sin( c1.dir ) + ay;
	line( ax, ay, dx, dy );

	c1.time+=1;

	if ( c1.attack_lim > 0 )	// 攻撃
	{
		c1.attack_lim--;
		
		if ( (c1.attack_lim % c1.attack_freq ) == 0 )
		{

			if ( c1.attack_no != 0 )
			{
				let attack = g_tblAttack[ c1.attack_no ];
				{
					c1.attack_dir += attack.rot;
					let dir = c1.dir + c1.attack_dir;
					g_breath.fire( 
						 dx
						,dy
						, attack.br_r
						, dir
						, attack.br_spd
						, attack.br_lim
						, attack.br_add_r
					);
				}
			}

		}

	}

	if ( c1.gid == 0 ) return;	// グループID=0 はNONE
	if ( c1.gid == 1 ) return;	// グループID=1 はPlayer

	{
		// 狙いを決める
		let tar_x = 0;
		let tar_y = 0;
		{
			let cnt = 0;
			for ( let i = 0 ; i < g_cast.tbl.length ; i++ )
			{
				if ( g_cast.tbl[i].gid == 1 )	// グループID=1 はPlayer
				{
					tar_x += g_cast.tbl[i].x;
					tar_y += g_cast.tbl[i].y;
					cnt++;
				}
			}
			tar_x /= cnt;
			tar_y /= cnt;
		}

		// 方向を決める
		{
			let x0	= tar_x;
			let y0	= tar_y;
			c1.to_th = Math.atan2( (y0-ay), (x0-ax) );
		}
		// 方向を変える
		{
			let s = c1.to_th - c1.dir;
			if ( s < -Math.PI ) s += Math.PI*2;
			if ( s >  Math.PI ) s -= Math.PI*2;

			let r = 0;
			if ( s > 0 ) r =  think1.rot_spd;
			if ( s < 0 ) r = -think1.rot_spd;

			c1.dir += r;
		}
	}

	{	//MOVE
		let th = c1.dir+think1.mov_dir;
		ax += Math.cos( th )*think1.mov_spd;
		ay += Math.sin( th )*think1.mov_spd;

		let isCol = function() //衝突判定
		{
			let flg = false; 
			for ( let j = 0 ; j < g_cast.cnt ; j++ )
			{
				if ( g_cast.tbl[j] == c1 )
				{
					continue;
				}
				let x1	= g_cast.tbl[j].x;
				let y1	= g_cast.tbl[j].y;
				let len	= g_cast.tbl[j].size + c1.size;
				let far = Math.sqrt( (x1-ax)*(x1-ax) + (y1-ay)*(y1-ay) );			
				if ( len+0 > far ) flg = true;
			}
			return flg
		}
		
		if ( isCol() == false )
		{
			c1.x = ax;
			c1.y = ay;
		}
	}

	if ( c1.think_lim-- < 0 )	// 思考パターン抽選
	{
		let r = Math.random();
		for ( let i = 0 ; i < c1.tblThink.length ; i++ )
		{
			let tnk = c1.tblThink[i];
			if ( r < tnk.ratio ) 
			{
				c1.think_type = i;
				{
//					let r  = rand(tnk.num);
					c1.think_lim = Math.floor( rand(tnk.num)*tnk.quant );
					/*
					let d = tnk.base;
					for ( let i = 0 ; i < tnk.num ; i++ )
					{
						d+=dice(tnk.dice);
					}
					c1.think_lim = d;
					*/
				}
				break;
			}
		}

	}


}
		let g_tbl = new Array(500);
		g_tbl.fill(0);
		let g_ave = new Array(500);
		g_ave.fill(0);
//-----------------------------------------------------------------------------
all_update = function()
//-----------------------------------------------------------------------------
{

	if (0)
	{
		let size= 52;
		let w = Math.floor(html_canvas.width/size);
		let h = Math.floor(html_canvas.height/size);
		let sx = (html_canvas.width-w*size)/2+size/2;
		let sy = (html_canvas.height-h*size)/2+size/2;
		for ( let x = 0 ; x < w ; x++ )
		{
			for ( let y = 0 ; y < h ; y++ )
			{
				circle( x*size+sx, y*size+sy, 16 );
			}
		}
	}

	for ( let i = 0 ; i < g_breath.tbl.length ; i++ )
	{
		let tar = g_breath.tbl[i];
		if ( tar.lim > 0 )
		{
			tar.lim--;
			let th = tar.dir;
			tar.x += Math.cos( th )*tar.spd;
			tar.y += Math.sin( th )*tar.spd;
			tar.r += tar.add_r;
	
			circle( tar.x, tar.y, tar.r );
		}
	}

	for ( let i = 0 ; i < g_cast.cnt ; i++ ) 
	{
		g_cast.update( g_cast.tbl[i] );
	}



}

//-----------------------------------------------------------------------------
function update()
//-----------------------------------------------------------------------------
{
	cls();

	all_update();
	
	requestAnimationFrame( update );

}

const	KEY_CR	= 13;
const	KEY_A	= 65;	//0x41	
const	KEY_B	= 66;	//0x42	
const	KEY_C	= 67;	//0x43	
const	KEY_D	= 68;	//0x44	
const	KEY_E	= 69;	//0x45	
const	KEY_F	= 70;	//0x46	
const	KEY_G	= 71;	//0x47	
const	KEY_H	= 72;	//0x48	
const	KEY_I	= 73;	//0x49	
const	KEY_J	= 74;	//0x4a	
const	KEY_K	= 75;	//0x4b	
const	KEY_L	= 76;	//0x4c	
const	KEY_M	= 77;	//0x4d	
const	KEY_N	= 78;	//0x4e	
const	KEY_O	= 79;	//0x4f	
const	KEY_P	= 80;	//0x50	
const	KEY_Q	= 81;	//0x51	
const	KEY_R	= 82;	//0x52	
const	KEY_S	= 83;	//0x53	
const	KEY_T	= 84;	//0x54	
const	KEY_U	= 85;	//0x55	
const	KEY_V	= 86;	//0x56	
const	KEY_W	= 87;	//0x57	
const	KEY_X	= 88;	//0x58	
const	KEY_Y	= 89;	//0x59	
const	KEY_Z	= 90;	//0x5a	

const	KEY_LEFT	= 37;
const	KEY_UP		= 38;
const	KEY_RIGHT	= 39;
const	KEY_DOWN	= 40;
//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	let	c = ev.keyCode;


	let u1 	= g_cast.tbl[0];
	let cntPlayer =0;
	for ( let i = 0 ; i < g_cast.tbl.length ; i++ )
	{
//		if ( g_cast.tbl[i].think_type == THINK_NONE )
		if ( g_cast.tbl[i].gid == 1 )	// グループID=1 はPlayer
		{
			cntPlayer++;
		//console.log("u " + i);
			u1 = g_cast.tbl[i];
//			break;
			if ( cntPlayer > 1 ) {if ( Math.random() < 0.5 ) continue;}
			if ( c == KEY_LEFT	) u1.dir -= rad(5);
			if ( c == KEY_RIGHT	) u1.dir += rad(5);
			let spd = 0;
			if ( c == KEY_UP	) spd = 2;
			if ( c == KEY_DOWN	) spd = -2;
			{
				u1.x += Math.cos( u1.dir )*spd;
				u1.y += Math.sin( u1.dir )*spd;
			}

			if ( c == KEY_O )
			{
		//		u1.attack_type		= ATTACK_TYPE_BREATH;
				u1.attack_lim		= 100;
				u1.attack_freq		= 2;
				u1.attack_rot		= rad(2);
				u1.attack_dir		= -rad(45);
				u1.attack_br_r		= 2;
				u1.attack_br_add_r	= 0.1;
				u1.attack_br_spd	= 2;
				u1.attack_br_lim	= 40;
			}
			if ( c == KEY_P )
			{
		//			u1.attack_type		= ATTACK_TYPE_BITE;
					u1.attack_lim		= 8;
					u1.attack_freq		= 4;
					u1.attack_rot		= rad(0);
					u1.attack_dir		= rad(0);
					u1.attack_br_r		= u1.size/10;
					u1.attack_br_add_r	= 1.0;
					u1.attack_br_spd	= 1;
					u1.attack_br_lim	= 8;
			}
		}
	}
	//--

}



//g_cast.add( 0, 100, 350, 16, rad(-90), "ティナ",THINK_NONE );
//g_cast.add( 0, 290, 300, 16, rad(-90), "ユイ",THINK_NONE );

//g_cast.add( 1,100,  40, 25, 0.25, rad(90),"ワイバーン",THINK_ATTACK_BREATH );
//g_cast.add( 1,192, 150, 36, 0.25, rad(90), "ドラゴン",THINK_ATTACK_BREATH );
//g_cast.add( 1,300, 130, 22, 0.25, rad(90), "ゴースト",THINK_ATTACK_BREATH );

	

	{//ユニット配置

		let tbl=[
			[0,0,0,9,0,0,0],
			[0,0,9,3,9,0,0],
			[0,0,0,9,0,0,0],
			[0,4,0,0,0,4,0],
			[0,0,0,9,0,0,0],
			[0,9,9,1,9,9,0],
			[9,1,9,9,9,1,9],
		];
9;


		{
			for ( let y = 0 ; y < tbl.length ; y++ )
			{
				for ( let x = 0 ; x < tbl[y].length ; x++ )
				{
					switch( tbl[y][x] )
					{
						case 0:	// 雑魚
							if ( y < 3 )
							{
								if ( rand(1) < 0.2 ) tbl[y][x] = 2;
							}
							else
							{
								if ( rand(1) < 0.1 ) tbl[y][x] = 2;
							}
							break;

						case 3:	// ボス
							{
							//	if ( rand(1) < 0.2 ) tbl[y][x] = 0;
							}
							break;

						case 4:	// 中ボス
							{
								if ( rand(1) < 0.2 ) tbl[y][x] = 0;
							}
							break;
					}
				}
			}
		}
		{
			let cntPlayer = 0;
			let size= 52;
			let w = Math.floor(html_canvas.width/size);
			let h = Math.floor(html_canvas.height/size);
			let sx = (html_canvas.width-w*size)/2+size/2;
			let sy = (html_canvas.height-h*size)/2+size/2;

			for ( let y = 0 ; y < h ; y++ )
			{
				for ( let x = 0 ; x < w ; x++ )
				{
					let px = x*size+sx;
					let py = y*size+sy;


					switch( tbl[y][x] )
					{
					case 1: // プレイヤー
						{
							let unit = g_group[ GID_PLAYER1+cntPlayer ];
							g_cast.add( 1, px, py, rad(-90), unit[0], unit[1], unit[2] );	
							cntPlayer++;
						}
						break;

					case 3: // ボス
						{
							let unit = g_group[ GID_DRAGON ];
//							let unit = g_group[ GID_MINO ];
							g_cast.add( 2, px, py, rad( 90), unit[0], unit[1], unit[2] );	
						}
						break;

					case 2: // 雑魚
						{
							let unit = g_group[ GID_WOLF ];
//							let unit = g_group[ GID_GHOST ];
//							let unit = g_group[ GID_ZOMBIE ];
//							let unit = g_group[ GID_SWORDMAN ];
							g_cast.add( 2, px, py, rad( 90), unit[0], unit[1], unit[2] );	
						}
						break;

					case 4: // 中ボス
break;
						{
							let unit = g_group[ GID_MINO ];
							g_cast.add( 2, px, py, rad(90), unit[0], unit[1], unit[2] );	
						}
						break;

					}
				}
			}
		}
	}


requestAnimationFrame( update );

