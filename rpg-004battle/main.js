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
    g.rect(1,1,ex-sx,ey-sx);
	g.closePath();
	g.stroke();

}

//-----------------------------------------------------------------------------
let line = function( sx,sy, ex,ey )
//-----------------------------------------------------------------------------
{
	g.beginPath();
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
	g.fillStyle = "#ffffffff";
	g.fillRect( 0,0,384,384 );
}

let g_cast ={};
g_cast.cnt = 0;
g_cast.tbl = new Array(100);



const ATTACK_NONE			= 0;	// 攻撃しない
const ATTACK_TYPE_BREATH	= 1;	// ブレス攻撃
const ATTACK_TYPE_BITE		= 2;	// 噛みつき攻撃

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
let g_tblThink_player =
[
	{name:""			,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"攻撃"		,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"ロング攻撃"	,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"防御"		,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"回り込むB"	,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"回り込むF"	,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"逃げる"		,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"探す"		,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(0.6)	,rate: 0, dice:24, num:0 },
	{name:"B"			,mov_dir:rad(180)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:30, dice:24, num:3 },
	{name:"F"			,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:10, dice:24, num:10 },
	{name:"R"			,mov_dir:rad( 45)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:10, dice:24, num:5 },
	{name:"L"			,mov_dir:rad(-45)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:10, dice:24, num:5 },
	{name:"ブレス"		,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(0.6)	,rate: 0, dice:24, num:5 },
	{name:"噛みつき"	,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:10, dice:24, num:5 },
];
let g_tblThink_dragon =
[
	{name:""			,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"攻撃"		,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"ロング攻撃"	,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"防御"		,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"回り込むB"	,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"回り込むF"	,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"逃げる"		,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"探す"		,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(0.6)	,rate: 0, dice:24, num:0 },
	{name:"B"			,mov_dir:rad(180)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:30, dice:24, num:3 },
	{name:"F"			,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:10, dice:24, num:10 },
	{name:"R"			,mov_dir:rad( 45)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:10, dice:24, num:5 },
	{name:"L"			,mov_dir:rad(-45)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:10, dice:24, num:5 },
	{name:"ブレス"		,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(0.6)	,rate:10, dice:24, num:5 },
	{name:"噛みつき"	,mov_dir:rad(0)		,mov_spd:0.25		, rot_spd:rad(0.2)	,rate: 0, dice:24, num:5 },
];
let g_tblThink_wolf =
[
	{name:""			,mov_dir:rad(0)		,mov_spd:0.75		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"攻撃"		,mov_dir:rad(0)		,mov_spd:0.75		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"ロング攻撃"	,mov_dir:rad(0)		,mov_spd:0.75		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"防御"		,mov_dir:rad(0)		,mov_spd:0.75		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"回り込むB"	,mov_dir:rad(0)		,mov_spd:0.75		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"回り込むF"	,mov_dir:rad(0)		,mov_spd:0.75		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"逃げる"		,mov_dir:rad(0)		,mov_spd:0.75		, rot_spd:rad(1)	,rate: 0, dice:24, num:0 },
	{name:"探す"		,mov_dir:rad(0)		,mov_spd:0.75		, rot_spd:rad(0.6)	,rate: 0, dice:24, num:0 },
	{name:"B"			,mov_dir:rad(180)	,mov_spd:0.25		, rot_spd:rad(0.2)	,rate:30, dice:24, num:3 },
	{name:"F"			,mov_dir:rad(0)		,mov_spd:0.75		, rot_spd:rad(0.2)	,rate:10, dice:24, num:5 },
	{name:"R"			,mov_dir:rad( 80)	,mov_spd:0.34 		, rot_spd:rad(1.4)	,rate:10, dice:24, num:5 },
	{name:"L"			,mov_dir:rad(-80)	,mov_spd:0.34 		, rot_spd:rad(1.4)	,rate:10, dice:24, num:5 },
	{name:"ブレス"		,mov_dir:rad(0)		,mov_spd:0.75		, rot_spd:rad(0.6)	,rate: 0, dice:24, num:5 },
	{name:"噛みつき"	,mov_dir:rad(0)		,mov_spd:0.75		, rot_spd:rad(0.2)	,rate:10, dice:24, num:5 },
];
const UNIT_PLAYER		= 0;	// Player
const UNIT_DRAGON	= 1;	// ドラゴン
const UNIT_WOLF		= 2;	// ウルフ

let g_unit =
[
	["こーぞ"	, 16, g_tblThink_player],
	["ドラゴン"	, 32, g_tblThink_dragon],
	["ウルフ"	, 12, g_tblThink_wolf],
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
for ( let i = 0 ; i < g_unit.length ; i++ )
{
	unit_makeThinkRatio( g_unit[i][2] );
}

const STAT_NON = 0;	// 特になし
const STAT_COL = 1;	// 衝突している（詰まって動けない）

for ( let i = 0 ; i < g_cast.tbl.length ; i++ )
{
	let gid=0;
	let x=0;
	let y=0;
	let flgActive=false;
	let time=0;
	let size=0;
	let name="";
	let dir=0;
	let think_type=THINK_NONE;
	let think_time=60;
	let stat=STAT_NON;
	let XXto_x=0;	// 行先
	let XXto_y=0;
	let to_th=0;
	let attack_type=ATTACK_NONE;
	let attack_lim = 0;
	let attack_freq = 0;
	let attack_rot = 0;
	let attack_dir = 0;
	let	attack_br_r = 0;
	let	attack_br_add_r = 0;
	let	attack_br_spd = 0;
	let	attack_br_lim = 0;
//	let unit_type=UNIT_PLAYER;
	let tblThink=g_unit[UNIT_PLAYER][2];

	g_cast.tbl[i] = {gid,x,y,size,name,flgActive,time,dir,think_type,XXto_x,XXto_y,to_th,think_time
		,attack_type	//攻撃タイプ
		,attack_lim		//攻撃リミット
		,attack_freq	//攻撃頻度
		,attack_rot		//攻撃回転速度
		,attack_dir		//攻撃角度(リアルタイム更新)
		,attack_br_r		//ブレスサイズ
		,attack_br_add_r	//ブレスサイズ増加量
		,attack_br_spd		//ブレス速度
		,attack_br_lim		//ブレスリミット
		//--
//		,unit_type		//ユニットタイプ
		,tblThink
	};
}


//-----------------------------------------------------------------------------
g_cast.add = function( gid, x, y, dir, name, size, tblThink )
//-----------------------------------------------------------------------------
{
	if ( g_cast.cnt+1 >= g_cast.tbl.length ) return;
	g_cast.tbl[ g_cast.cnt ].gid	= gid;	// グループID , 0:Player
	g_cast.tbl[ g_cast.cnt ].x		= x;
	g_cast.tbl[ g_cast.cnt ].y		= y;
	g_cast.tbl[ g_cast.cnt ].XXto_x	= x;
	g_cast.tbl[ g_cast.cnt ].XXto_y	= y;
	g_cast.tbl[ g_cast.cnt ].to_th	= 0;
	g_cast.tbl[ g_cast.cnt ].size	= size;
	g_cast.tbl[ g_cast.cnt ].dir	= dir;
	g_cast.tbl[ g_cast.cnt ].name	= name;
	g_cast.tbl[ g_cast.cnt ].attack_type	= ATTACK_NONE;	
//	g_cast.tbl[ g_cast.cnt ].unit_type	= unit_type;	
	g_cast.tbl[ g_cast.cnt ].tblThink	= tblThink;	
	g_cast.cnt++;
}

//-----------------------------------------------------------------------------
function	dice( n ) 
//-----------------------------------------------------------------------------
{
	return Math.floor( Math.random()*n )+1;
}

//-----------------------------------------------------------------------------
g_cast.update = function( c1 )
//-----------------------------------------------------------------------------
{
	let ax		= c1.x;
	let ay		= c1.y;
	let tblThink = c1.tblThink;
	let think1	= tblThink[ c1.think_type ];
	let	er = Math.cos(rad(c1.time*10))*1.2;
	circle( ax, ay, er+c1.size );

//	print( ax+c1.size, ay-c1.size, c1.name+" "+think1.name );
	print( ax+c1.size, ay-c1.size, c1.name );
	let dx = c1.size * Math.cos( c1.dir ) + ax;
	let dy = c1.size * Math.sin( c1.dir ) + ay;
	line( ax, ay, dx, dy );

	c1.time+=1;

	if ( c1.attack_lim > 0 )
	{
		c1.attack_lim--;
		
		if ( (c1.attack_lim % c1.attack_freq ) == 0 )
		{
			if ( c1.attack_type == ATTACK_TYPE_BREATH )	// ブレス
			{
				c1.attack_dir += c1.attack_rot;
				let dir = c1.dir + c1.attack_dir;
				g_breath.fire( 
					 dx
					,dy
					, c1.attack_br_r
					, dir
					, c1.attack_br_spd
					, c1.attack_br_lim
					, c1.attack_br_add_r
				);
			}
			if ( c1.attack_type == ATTACK_TYPE_BITE )	// 噛みつき
			{
				c1.attack_dir += c1.attack_rot;
				let dir = c1.dir + c1.attack_dir;
				g_breath.fire( 
					 dx
					,dy
					, c1.attack_br_r
					, dir
					, c1.attack_br_spd
					, c1.attack_br_lim
					, c1.attack_br_add_r
				);
			}
		}

	}



//	if ( c1.unit_type == UNIT_PLAYER ) return;
	if ( c1.gid == 0 ) return;	// グループID=0 はPlayer

	if ( c1.think_time-- < 0 )
	{
		// 思考ルーチン（レシオ表反映)
		{
			let r = Math.random();
			for ( let i = 0 ; i < tblThink.length ; i++ )
			{
				let tnk = tblThink[i];
				if ( r < tnk.ratio ) 
				{
					c1.think_type = i;
					c1.think_time = dice(tnk.dice)*tnk.num;
					break;
				}
			}
		}		

	}

	{
		// 狙いを決める
		let tar = g_cast.tbl[0];
		for ( let i = 0 ; i < g_cast.tbl.length ; i++ )
		{
			if ( g_cast.tbl[i].think_type == THINK_NONE )
			{
				tar = g_cast.tbl[i];
				break;
			}
		}

		// 方向を決める
		{
			let x0	= tar.x;
			let y0	= tar.y;
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
	
	if ( c1.think_type == THINK_ATTACK_BREATH )
	{
		c1.attack_type		= ATTACK_TYPE_BREATH;
		c1.attack_lim		= 80;
		c1.attack_freq		= 2;
		c1.attack_rot		= rad(2);
		c1.attack_dir		= -rad(30);
		c1.attack_br_r		= c1.size/10;
		c1.attack_br_add_r	= c1.size/200;
		c1.attack_br_spd	= 2;
		c1.attack_br_lim	= 40;
	}
	if ( c1.think_type == THINK_ATTACK_BITE )
	{
		c1.attack_type		= ATTACK_TYPE_BITE;
		c1.attack_lim		= 8;
		c1.attack_freq		= 4;
		c1.attack_rot		= rad(0);
		c1.attack_dir		= rad(0);
		c1.attack_br_r		= c1.size/10;
		c1.attack_br_add_r	= 1.0;
		c1.attack_br_spd	= 1;
		c1.attack_br_lim	= 8;
	}
	
	{	//MOVE
		
		if ( c1.think_type == THINK_FORWARD )
		{
			// 前進
			let th = c1.dir+think1.mov_dir;
			ax += Math.cos( th )*think1.mov_spd;
			ay += Math.sin( th )*think1.mov_spd;
		}
		if ( c1.think_type == THINK_BACK )
		{
			// 後退
			let th = c1.dir+think1.mov_dir;
			ax += Math.cos( th )*think1.mov_spd;
			ay += Math.sin( th )*think1.mov_spd;
			
		}
		if ( c1.think_type == THINK_MAWARI_R )
		{
			// 右回り
			let th = c1.dir+think1.mov_dir;
			ax += Math.cos( th )*think1.mov_spd;
			ay += Math.sin( th )*think1.mov_spd;
			
		}
		if ( c1.think_type == THINK_MAWARI_L )
		{
			// 右回り
			let th = c1.dir+think1.mov_dir;
			ax += Math.cos( th )*think1.mov_spd;
			ay += Math.sin( th )*think1.mov_spd;
			
		}
		let isCol = function() //衝突判定
		{
			let flg = false; 
			for ( let j = 0 ; j < g_cast.cnt ; j++ )
			{
//				if ( j == i ) continue;
				if ( g_cast.tbl[j] == c1 )
				{
//				console.log(" cast same " );
					continue;
				}
				let x1	= g_cast.tbl[j].x;
				let y1	= g_cast.tbl[j].y;
				let len	= g_cast.tbl[j].size + c1.size;
				let far = Math.sqrt( (x1-ax)*(x1-ax) + (y1-ay)*(y1-ay) );			
				if ( len+5 > far ) flg = true;
			}
			return flg
		}
		
		if ( isCol() == false )
		{
			c1.x = ax;
			c1.y = ay;
		}
	}
}
//-----------------------------------------------------------------------------
all_update = function()
//-----------------------------------------------------------------------------
{
//print(10,10,g_breath.tbl.length);

	if (0)
	{
		let size= 48;
		for ( let x = 1 ; x < 384/size ; x++ )
		{
			for ( let y = 1 ; y < 384/size ; y++ )
			{
				circle( x*size, y*size, 16 );
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
//const	KEY_I	= 73;
//const	KEY_O	= 79;
//const	KEY_Z	= 90;
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
	for ( let i = 0 ; i < g_cast.tbl.length ; i++ )
	{
		if ( g_cast.tbl[i].think_type == THINK_NONE )
		{
		//console.log("u " + i);
			u1 = g_cast.tbl[i];
			break;
		}
	}
	//--
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
		u1.attack_type		= ATTACK_TYPE_BREATH;
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
			u1.attack_type		= ATTACK_TYPE_BITE;
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
			[0,0,0,0,0,0,0],
			[0,0,0,9,0,0,0],
			[0,0,9,1,9,0,0],
			[0,0,0,9,0,0,0],
		];

		const CAST_NONE		= 0;
		const CAST_HUUMAN	= 1;
		const CAST_DRAGON	= 2;
		const CAST_WOLF		= 3;
		const CAST_BLOCK	= 9;


		{
			for ( let y = 0 ; y < tbl.length ; y++ )
			{
				for ( let x = 0 ; x < tbl[y].length ; x++ )
				{
					if ( tbl[y][x] == 0 )
					{
						if ( y < 3 )
						{
							if ( dice(6) == 1 ) tbl[y][x] = 2;
						}
						else
						{
							if ( dice(18) == 1 ) tbl[y][x] = 2;
						}
					}
				}
			}
		}
		{
			let size= 48;
			for ( let y = 0 ; y < tbl.length ; y++ )
			{
				for ( let x = 0 ; x < tbl[y].length ; x++ )
				{
					let px = x*size+size;
					let py = y*size+size;

					switch( tbl[y][x] )
					{
					case 1:
						g_cast.add( 0, px, py, rad(-90), g_unit[ UNIT_PLAYER ][0], g_unit[ UNIT_PLAYER ][1], g_unit[ UNIT_PLAYER ][2] );
						break;

					case 3:
						g_cast.add( 1,px, py, rad(90), g_unit[ UNIT_DRAGON ][0], g_unit[ UNIT_DRAGON ][1], g_unit[ UNIT_DRAGON ][2] );
						break;

					case 2:
						g_cast.add( 1, px, py, rad(90), g_unit[ UNIT_WOLF ][0], g_unit[ UNIT_WOLF ][1], g_unit[ UNIT_WOLF ][2] );
						break;

					}
				}
			}
		}
	}


requestAnimationFrame( update );

