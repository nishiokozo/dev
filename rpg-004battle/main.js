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
	g.font = "10px monospace";
	g.fillStyle = "#000000";
	g.fillText( str, tx, ty );
}

//-----------------------------------------------------------------------------
let circle = function( x,y,r )
//-----------------------------------------------------------------------------
{
	g.beginPath();
//	g.lineWidth = 1;
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

class Effect
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		class EffectOne
		{
			//-----------------------------------------------------------------------------
			constructor()
			//-----------------------------------------------------------------------------
			{
				this.lim	= 0;
			}
			//-----------------------------------------------------------------------------
			on( _x, _y, _r, _dir, _spd,_lim, _add_r )
			//-----------------------------------------------------------------------------
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

		this.tblEffect = Array(100);
		for ( let i = 0 ; i < this.tblEffect.length ; i++ )
		{
			this.tblEffect[i] = new EffectOne();
		}
		//-----------------------------------------------------------------------------
		this.fire = function( _x, _y, _r, _dir, _spd,_lim, _add_r )
		//-----------------------------------------------------------------------------
		{
			for ( let tar of this.tblEffect )
			{
				if ( tar.lim == 0 )
				{
					tar.on( _x, _y, _r, _dir, _spd, _lim, _add_r );
					break;
				}
			}
		}
		//-----------------------------------------------------------------------------
		this.updateEffect = function()
		//-----------------------------------------------------------------------------
		{
			for ( let tar of this.tblEffect )
			{
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
		}
	}
};

let g_effect = new Effect;

class ActTwincle	// 点滅アクション
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.twn_time		= 0;	
		this.twn_lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	twn_setTwincle()  //) = function(  u1 )
	//-----------------------------------------------------------------------------
	{
		this.twn_time		= 0;
		this.twn_lim		= 32;
	}
	//-----------------------------------------------------------------------------
	twn_update()
	//-----------------------------------------------------------------------------
	{
		if ( this.twn_lim > 0 )	// 攻撃
		{
			this.twn_lim--;
			this.twn_time++;
		}
	}
};
class ActPunch	// パンチ攻撃アクション
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.pnc_time		= 0;	
		this.pnc_lim		= 0;		//攻撃リミット
		this.pnc_dir		= 0;		//攻撃角度(リアルタイム更新)
		this.pnc_br_add_r	= 0;
		this.pnc_br_acc_r	= 0;
	}
	//-----------------------------------------------------------------------------
	pnc_setPunch()  //) = function(  u1 )
	//-----------------------------------------------------------------------------
	{
		this.pnc_time		= 0;
		this.pnc_lim		= 32;
		this.pnc_dir		= rad(60);
		this.pnc_br_add_r	= rad(+8);
		this.pnc_br_acc_r	= rad(-0.9);
	}
	
	//-----------------------------------------------------------------------------
	pnc_update( ax, ay, unit_size, unit_dir )
	//-----------------------------------------------------------------------------
	{

		if ( this.pnc_lim > 0 )
		{
			this.pnc_lim--;

			let th	= unit_dir+this.pnc_dir;
			let r	= unit_size*1.3;
			let	bx	= r*Math.cos(th)+ax;
			let	by	= r*Math.sin(th)+ay;

			this.pnc_dir += this.pnc_br_add_r;	
			this.pnc_br_add_r += this.pnc_br_acc_r;
			this.pnc_time++;

			circle( bx, by, unit_size/4 ); // パンチ表示

		}

	}

};
class ActBreath	// ブレス攻撃アクション
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.brt_lim		= 0;
		this.brt_freq		= 0;
		this.brt_dir		= rad(0);
		this.brt_rot		= rad(0);
		this.brt_br_r		= 0;
		this.brt_br_spd		= 0;
		this.brt_br_lim		= 0;
		this.brt_br_add_r	= rad(0);
	}
	//-----------------------------------------------------------------------------
	brt_updateBreath( ax, ay, dx, dy, er, unit_size, unit_dir, unit_name )
	//-----------------------------------------------------------------------------
	{
		if ( this.brt_lim > 0 )	// 攻撃
		{
			this.brt_lim--;
			if ( (this.brt_lim % this.brt_freq ) == 0 )
			{
				this.brt_dir += this.brt_rot;
				let dir = unit_dir + this.brt_dir;
				g_effect.fire( 
					 dx
					,dy
					, this.brt_br_r
					, dir
					, this.brt_br_spd
					, this.brt_br_lim
					, this.brt_br_add_r
				);
			}
		}
	}

	//-----------------------------------------------------------------------------
	brt_setBreath()
	//-----------------------------------------------------------------------------
	{
		this.brt_lim		= 80;
		this.brt_freq		= 2;
		this.brt_dir		= rad(-30);
		this.brt_rot		= rad(2);
		this.brt_br_r		= 3.2;
		this.brt_br_spd	= 2;
		this.brt_br_lim	= 40;
		this.brt_br_add_r	= 32*0.005;
	}
};

class ActBite	// 噛みつきアクション
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.bte_lim		= 0;
		this.bte_freq		= 0;
		this.bte_dir		= rad(0);
		this.bte_rot		= rad(0);
		this.bte_br_r		= 0;
		this.bte_br_spd		= 0;
		this.bte_br_lim		= 0;
		this.bte_br_add_r	= rad(0);
	}
	//-----------------------------------------------------------------------------
	bte_update( ax, ay, dx, dy, er, unit_size, unit_dir, unit_name )
	//-----------------------------------------------------------------------------
	{
		if ( this.bte_lim > 0 )	// 攻撃
		{
			this.bte_lim--;
			if ( (this.bte_lim % this.bte_freq ) == 0 )
			{
				this.bte_dir += this.bte_rot;
				let dir = unit_dir + this.bte_dir;
				g_effect.fire( 
					 dx
					,dy
					, this.bte_br_r
					, dir
					, this.bte_br_spd
					, this.bte_br_lim
					, this.bte_br_add_r
				);
			}
		}
	}


	//-----------------------------------------------------------------------------
	bte_setBite()
	//-----------------------------------------------------------------------------
	{// 2	噛付き
		this.bte_lim		= 8;
		this.bte_freq		= 4;
		this.bte_dir		= rad(0);
		this.bte_rot		= rad(0);
		this.bte_br_r		= 1.2;
		this.bte_br_spd	= 1;
		this.bte_br_lim	= 8;
		this.bte_br_add_r	= 1.0;
	}

};

class Unit
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.tblUnit =[];
	}
	
	//-----------------------------------------------------------------------------
	add( boss, gid, x, y, size, dir, tblThink, name )
	//-----------------------------------------------------------------------------
	{
		this.tblUnit.push(
			{
				boss	: boss,
				gid		: gid,	// グループID , 1:Player
				x		: x,
				y		: y,
				size	: size,
				dir		: dir,
				tblThink : tblThink,
				name	: name,
				time			:0,
				to_th	: 0,
				think_type		:0,
				think_lim		:0,

				twincle : new ActTwincle,
				punch : new ActPunch,
				breath : new ActBreath,
				bite	: new ActBite,
			}
		);
	}

	//-----------------------------------------------------------------------------
	unit_update( u1 )
	//-----------------------------------------------------------------------------
	{
		let ax	= u1.x;
		let ay	= u1.y;
		let act	= u1.tblThink[ u1.think_type ];
		let	er = Math.cos(rad(u1.time*10))*1.2;
		let dx = u1.size * Math.cos( u1.dir ) + ax;
		let dy = u1.size * Math.sin( u1.dir ) + ay;
		line( ax, ay, dx, dy );	// 本体方向表示
		print( ax+u1.size, ay-u1.size, u1.name );
		u1.time+=1;

		if ( u1.twincle.twn_lim > 0 ) 	// 点滅表示
		{
			let pat = [0,0,0,1,1,1];
			if ( pat[(u1.twincle.twn_time % pat.length )] == 1  )
			{
				circle( ax, ay, er+u1.size );	// 本体表示
			}
		}
		else
		{
			if ( u1.boss )
			{
				circle( ax, ay, er+u1.size+2 );	// 外装表示
			}
			circle( ax, ay, er+u1.size );	// 本体表示
		}

		{
			let num = act.act_no;
			if ( num == ACT_TWINCLE	) 	u1.twincle.twn_setTwincle();
			if ( num == ACT_PUNCH	) 	u1.punch.pnc_setPunch();
			if ( num == ACT_BREATH	)	u1.breath.brt_setBreath();
			if ( num == ACT_BITE	)	u1.bite.bte_setBite();
		}


		// update
		u1.punch.pnc_update( ax, ay, u1.size, u1.dir );
		u1.twincle.twn_update();
		u1.bite.bte_update( ax, ay, dx, dy, er, u1.size, u1.dir, u1.name );
		u1.breath.brt_updateBreath( ax, ay, dx, dy, er, u1.size, u1.dir, u1.name );

		if ( u1.gid == 0 ) return;	// グループID=0 はNONE
		if ( u1.gid == 1 ) return;	// グループID=1 はPlayer

		{
			// 狙いを決める
			let tar_x = 0;
			let tar_y = 0;
			{
				let cnt = 0;
				for ( let u1 of g_unit.tblUnit )//g_tblUnit ) 
				{
					if ( u1.gid == 1 ) 
					{
						tar_x += u1.x;
						tar_y += u1.y;
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
				u1.to_th = Math.atan2( (y0-ay), (x0-ax) );
			}
			// 方向を変える
			{
				let s = u1.to_th - u1.dir;
				if ( s < -Math.PI ) s += Math.PI*2;
				if ( s >  Math.PI ) s -= Math.PI*2;

				let r = 0;
				if ( s > 0 ) r =  act.rot_spd;
				if ( s < 0 ) r = -act.rot_spd;

				u1.dir += r;
			}
		}

		{	//MOVE
			let th = u1.dir+act.mov_dir;
			ax += Math.cos( th )*act.mov_spd;
			ay += Math.sin( th )*act.mov_spd;

			let isCol = function() //衝突判定
			{
				let flg = false; 
				for ( let u2 of g_unit.tblUnit )//g_tblUnit ) 
				{
					if ( u2 == u1 )
					{
						continue;
					}
					let x1	= u2.x;
					let y1	= u2.y;
					let len	= u2.size + u1.size;
					let far = Math.sqrt( (x1-ax)*(x1-ax) + (y1-ay)*(y1-ay) );			
					if ( len+0 > far ) flg = true;
				}
				return flg
			}
			
			if ( isCol() == false )
			{
				u1.x = ax;
				u1.y = ay;
			}
		}

		if ( u1.think_lim-- < 0 )	// 思考パターン抽選
		{
			let r = Math.random();
			for ( let i = 0 ; i < u1.tblThink.length ; i++ )
			{
				let tnk = u1.tblThink[i];
				if ( r < tnk.ratio ) 
				{
					u1.think_type = i;
					{
						u1.think_lim = Math.floor( rand(tnk.num)*tnk.quant )+1;
					}
					break;
				}
			}

		}
	}
	
	//-----------------------------------------------------------------------------
	unit_updateUnit()
	//-----------------------------------------------------------------------------
	{
		for ( let u1 of g_unit.tblUnit ) 
		{
			this.unit_update( u1 );
		}
	}
	

};

let g_unit = new Unit;

//let g_breath = new ActBreath;
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
const THINK_ATTACK_BITE		= 13;	// 噛付き攻撃
*/



class Cast
{
	constructor( jsonCast )
	{
		this.tbl = jsonCast ;

		let makeratio = function( tblThink )
		{// rate（割合）からratio（比率）を作成
			let amt = 0;
			for ( let t of tblThink )
			{
				amt += t.rate;
				t.ratio = amt;
			}
			for ( let t of tblThink )
			{
				t.ratio /= amt;
			}
		}
		for ( let t of this.tbl )
		{
			makeratio( t.tblThink );
		}

	}
};

const ACT_NONE		= 0;	// 攻撃しない
const ACT_BREATH	= 1;	// ブレス攻撃
const ACT_BITE		= 2;	// 噛付き攻撃
const ACT_PUNCH		= 3;	// パンチ
const ACT_TWINCLE	= 4;	// 点滅


const CAST_NONE		= 0;	// NONE
const CAST_PLAYER1	= 1;	// Player
const CAST_PLAYER2	= 2;	// Player
const CAST_PLAYER3	= 3;	// Player
const CAST_DRAGON	= 4;	// ドラゴン
const CAST_WOLF		= 5;	// ウルフ
const CAST_MINO		= 6;	// ミノタウロス
const CAST_GHOST	= 7;	// ゴースト
const CAST_ZOMBIE	= 8;	// ゾンビ
const CAST_SWORDMAN	= 9;	// ソードマン
let g_json_cast = 
[
	{
		name		:"NONE",
		size		:  2,	
		tblThink	:
		[
			{name:""		,act_no:0,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	{
		name		:"こーぞ",
		size		:  12,	
		tblThink	:
		[
			{name:""		,act_no:0,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	{
		name		:"ティナ",
		size		:  11,	
		tblThink	:
		[
			{name:""		,act_no:0,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	{
		name		:"ユイ",
		size		:  11,	
		tblThink	:
		[
			{name:""		,act_no:0,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	{
		name		:"ドラゴン"	,
		size		: 52,	
		tblThink	:
		[
			{name:""		,act_no:0,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"B"		,act_no:0,mov_dir:rad(180)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:20, quant: 72, num:3 },
			{name:"R"		,act_no:0,mov_dir:rad( 60)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:20, quant:120, num:3 },
			{name:"L"		,act_no:0,mov_dir:rad(-60)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:20, quant:120, num:3 },
			{name:"ブレス"	,act_no:1,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(0.6)	,rate:10, quant:0, num:3 },
		]
	},
	{
		name		:"ウルフ"		,
		size		: 10,	
		tblThink	:
		[
			{name:""		,act_no:0,mov_dir:rad(   0)	,mov_spd:0.20	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"B"		,act_no:0,mov_dir:rad( 180)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:30, quant: 72, num:3 },
			{name:"F"		,act_no:0,mov_dir:rad(   0)	,mov_spd:0.75	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"R"		,act_no:0,mov_dir:rad(  80)	,mov_spd:0.34 	, rot_spd:rad(1.4)	,rate:10, quant:120, num:3 },
			{name:"L"		,act_no:0,mov_dir:rad( -80)	,mov_spd:0.34 	, rot_spd:rad(1.4)	,rate:10, quant:120, num:3 },
			{name:"噛付き"	,act_no:2,mov_dir:rad(   0)	,mov_spd:0.75	, rot_spd:rad(0.2)	,rate:10, quant:0, num:3 },
		]
	},
	{
		name		:"ミノタウロス",
		size		: 30,	
		tblThink	:
		[
			{name:""		,act_no:0,mov_dir:rad(   0)	,mov_spd:0.20	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"B"		,act_no:0,mov_dir:rad( 180)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:30, quant: 72, num:3 },
			{name:"F"		,act_no:0,mov_dir:rad(   0)	,mov_spd:0.40	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"R"		,act_no:0,mov_dir:rad(  45)	,mov_spd:0.40 	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"L"		,act_no:0,mov_dir:rad( -45)	,mov_spd:0.40 	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"パンチ"	,act_no:3,mov_dir:rad(   0)	,mov_spd:0.75	, rot_spd:rad(0.6)	,rate:30, quant:0, num:3 },
		]
	},
	{
		name		:"ゴースト"	,
		size		: 14,	
		tblThink	:
		[
			{name:""		,act_no:0,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"FR"		,act_no:0,mov_dir:rad(  60)	,mov_spd:0.35	, rot_spd:rad(0.3)	,rate:12, quant: 96, num:3 },
			{name:"FL"		,act_no:0,mov_dir:rad( -60)	,mov_spd:0.35	, rot_spd:rad(0.3)	,rate:12, quant: 96, num:3 },
			{name:"BR"		,act_no:0,mov_dir:rad( 120)	,mov_spd:0.30 	, rot_spd:rad(0.3)	,rate:10, quant: 96, num:3 },
			{name:"BL"		,act_no:0,mov_dir:rad(-120)	,mov_spd:0.30 	, rot_spd:rad(0.3)	,rate:10, quant: 96, num:3 },
			{name:"TWINCLE"	,act_no:4,mov_dir:rad(   0)	,mov_spd:1.30 	, rot_spd:rad(0.3)	,rate:20, quant: 0, num:3 },
		]
	},
	{
		name		:"ゾンビ"		,
		size		: 12,	
		tblThink	:
		[
			{name:""		,act_no:0,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"探す"	,act_no:0,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(1.0)	,rate:10, quant: 48, num:3 },
			{name:"F"		,act_no:0,mov_dir:rad(   0)	,mov_spd:0.25 	, rot_spd:rad(0.1)	,rate:10, quant: 72, num:3 },
			{name:"FR"		,act_no:0,mov_dir:rad(  30)	,mov_spd:0.25	, rot_spd:rad(0.1)	,rate:10, quant: 72, num:3 },
			{name:"FL"		,act_no:0,mov_dir:rad( -30)	,mov_spd:0.25	, rot_spd:rad(0.1)	,rate:10, quant: 72, num:3 },
		]
	},
	{
		name		:"ソードマン"	,
		size		: 16,	
		tblThink	:
		[
			{name:""		,act_no:0,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"F"		,act_no:0,mov_dir:rad(   0)	,mov_spd:0.2 	, rot_spd:rad(0.3)	,rate:10, quant: 72, num:3 },
			{name:"FR"		,act_no:0,mov_dir:rad(  45)	,mov_spd:0.4	, rot_spd:rad(0.6)	,rate:10, quant: 72, num:3 },
			{name:"FR"		,act_no:0,mov_dir:rad(  90)	,mov_spd:0.4	, rot_spd:rad(0.6)	,rate:20, quant: 72, num:3 },
			{name:"BL"		,act_no:0,mov_dir:rad(-140)	,mov_spd:0.3	, rot_spd:rad(0.1)	,rate:20, quant: 96, num:3 },
			{name:"攻撃"	,act_no:0,mov_dir:rad(   0)	,mov_spd:2.30 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
		]
	}
];

let g_tblCast = new Cast( g_json_cast );

//-----------------------------------------------------------------------------
function rand( n ) // n=3以上が正規分布
//-----------------------------------------------------------------------------
{
	let r = 0;
	for ( j = 0 ; j < n ; j++ ) r += Math.random();
	return r/n;
}

//-----------------------------------------------------------------------------
uxxnit_update = function( u1 )
//-----------------------------------------------------------------------------
{
	let ax	= u1.x;
	let ay	= u1.y;
	let act	= u1.tblThink[ u1.think_type ];
	let	er = Math.cos(rad(u1.time*10))*1.2;
	let dx = u1.size * Math.cos( u1.dir ) + ax;
	let dy = u1.size * Math.sin( u1.dir ) + ay;
	line( ax, ay, dx, dy );	// 本体方向表示
	print( ax+u1.size, ay-u1.size, u1.name );
	u1.time+=1;

	if ( u1.twincle.twn_lim > 0 ) 	// 点滅表示
	{
		let pat = [0,0,0,1,1,1];
		if ( pat[(u1.twincle.twn_time % pat.length )] == 1  )
		{
			circle( ax, ay, er+u1.size );	// 本体表示
		}
	}
	else
	{
		if ( u1.boss )
		{
			circle( ax, ay, er+u1.size+2 );	// 外装表示
		}
		circle( ax, ay, er+u1.size );	// 本体表示
	}

	{
		let num = act.act_no;
		if ( num == ACT_TWINCLE	) 	u1.twincle.twn_setTwincle();
		if ( num == ACT_PUNCH	) 	u1.punch.pnc_setPunch();
		if ( num == ACT_BREATH	)	u1.breath.brt_setBreath();
		if ( num == ACT_BITE	)	u1.bite.bte_setBite();
	}


	// update
	u1.punch.pnc_update( ax, ay, u1.size, u1.dir );
	u1.twincle.twn_update();
	u1.bite.bte_update( ax, ay, dx, dy, er, u1.size, u1.dir, u1.name );
	u1.breath.brt_updateBreath( ax, ay, dx, dy, er, u1.size, u1.dir, u1.name );

	if ( u1.gid == 0 ) return;	// グループID=0 はNONE
	if ( u1.gid == 1 ) return;	// グループID=1 はPlayer

	{
		// 狙いを決める
		let tar_x = 0;
		let tar_y = 0;
		{
			let cnt = 0;
			for ( let u1 of g_unit.tblUnit )//g_tblUnit ) 
			{
				if ( u1.gid == 1 ) 
				{
					tar_x += u1.x;
					tar_y += u1.y;
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
			u1.to_th = Math.atan2( (y0-ay), (x0-ax) );
		}
		// 方向を変える
		{
			let s = u1.to_th - u1.dir;
			if ( s < -Math.PI ) s += Math.PI*2;
			if ( s >  Math.PI ) s -= Math.PI*2;

			let r = 0;
			if ( s > 0 ) r =  act.rot_spd;
			if ( s < 0 ) r = -act.rot_spd;

			u1.dir += r;
		}
	}

	{	//MOVE
		let th = u1.dir+act.mov_dir;
		ax += Math.cos( th )*act.mov_spd;
		ay += Math.sin( th )*act.mov_spd;

		let isCol = function() //衝突判定
		{
			let flg = false; 
			for ( let u2 of g_unit.tblUnit )//g_tblUnit ) 
			{
				if ( u2 == u1 )
				{
					continue;
				}
				let x1	= u2.x;
				let y1	= u2.y;
				let len	= u2.size + u1.size;
				let far = Math.sqrt( (x1-ax)*(x1-ax) + (y1-ay)*(y1-ay) );			
				if ( len+0 > far ) flg = true;
			}
			return flg
		}
		
		if ( isCol() == false )
		{
			u1.x = ax;
			u1.y = ay;
		}
	}

	if ( u1.think_lim-- < 0 )	// 思考パターン抽選
	{
		let r = Math.random();
		for ( let i = 0 ; i < u1.tblThink.length ; i++ )
		{
			let tnk = u1.tblThink[i];
			if ( r < tnk.ratio ) 
			{
				u1.think_type = i;
				{
					u1.think_lim = Math.floor( rand(tnk.num)*tnk.quant )+1;
				}
				break;
			}
		}

	}


}

//-----------------------------------------------------------------------------
function update()
//-----------------------------------------------------------------------------
{
	cls();

	if (0)	// フロアマトリクス
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

	// エフェクト更新
	g_effect.updateEffect();

	// ユニット更新
	g_unit.unit_updateUnit();

	requestAnimationFrame( update );

}

const	KEY_CR	= 13;
const	KEY_0	= 48;//	0x30	0
const	KEY_1	= 49;	//	0x31	1
const	KEY_2	= 50;	//	0x32	2
const	KEY_3	= 51;	//	0x33	3
const	KEY_4	= 52;	//	0x34	4
const	KEY_5	= 53;	//	0x35	5
const	KEY_6	= 54;	//	0x36	6
const	KEY_7	= 55;	//	0x37	7
const	KEY_8	= 56;	//	0x38	8
const	KEY_9	= 57;	//	0x39	9
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


	let u1 	= g_unit.tblUnit[0];
	let cntPlayer =0;
	for ( let u1 of g_unit.tblUnit ) 
	{
		if ( u1.gid == 1 )	// グループID=1 はPlayer
		{
			cntPlayer++;
			if ( cntPlayer > 1 ) {if ( Math.random() < 0.5 ) continue;}
			if ( c == KEY_LEFT	) u1.dir -= rad(7);
			if ( c == KEY_RIGHT	) u1.dir += rad(7);
			{
				let spd = 0;
				let dir = u1.dir;
				if ( c == KEY_A	) {spd=3;dir = u1.dir -rad(90);}
				if ( c == KEY_D	) {spd=3;dir = u1.dir +rad(90);}
				if ( c == KEY_UP	) {spd=3;dir = u1.dir;}
				if ( c == KEY_DOWN	) {spd=-3;dir = u1.dir;}

				{
					u1.x += Math.cos( dir )*spd;
					u1.y += Math.sin( dir )*spd;
				}
			}

			if ( c == KEY_I )	//噛付き
			{
				u1.bite.bte_setBite();
			}
			if ( c == KEY_O )	// ブレス
			{
				u1.breath.brt_setBreath();
			}
			if ( c == KEY_P )	//パンチ
			{
				u1.punch.pnc_setPunch();
			}
			if ( c == KEY_U )	//点滅
			{
				u1.twincle.twn_setTwincle();
			}
			if ( c == KEY_2 )	//
			{
				u1.size += 1;
			}
			if ( c == KEY_1 )	//
			{
				u1.size -= 1;
			}
		}
	}
	//--

}



//.add( 0, 100, 350, 16, rad(-90), "ティナ",THINK_NONE );
//.add( 0, 290, 300, 16, rad(-90), "ユイ",THINK_NONE );

//.add( 1,100,  40, 25, 0.25, rad(90),"ワイバーン",THINK_ATTACK_BREATH );
//.add( 1,192, 150, 36, 0.25, rad(90), "ドラゴン",THINK_ATTACK_BREATH );
//.add( 1,300, 130, 22, 0.25, rad(90), "ゴースト",THINK_ATTACK_BREATH );

	

	{//ユニット配置

		let tbl=[
			[0,0,0,9,0,0,0],
			[0,0,9,3,9,0,0],
			[0,0,0,9,0,0,0],
			[0,4,0,0,0,4,0],
			[0,0,0,9,0,0,0],
			[0,9,9,1,9,9,0],
			[9,1,9,9,9,0,9],
		];



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
							let cast = g_tblCast.tbl[ CAST_PLAYER1+cntPlayer ];
							g_unit.add( 0, 1, px, py, cast.size, rad(-90), cast.tblThink, cast.name );
							cntPlayer++;
						}
						break;

					case 2: // 雑魚
						{
//break;
//							let cast = g_tblCast.tbl[ CAST_WOLF ];
							let cast = g_tblCast.tbl[ CAST_GHOST ];
//							let cast = g_tblCast.tbl[ CAST_ZOMBIE ];
//							let cast = g_tblCast.tbl[ CAST_SWORDMAN ];
							g_unit.add( 0, 2, px, py, cast.size, rad(90), cast.tblThink, cast.name );
						}
						break;

					case 4: // 中ボス
//break;
						{
//							let cast = g_tblCast.tbl[ CAST_DRAGON ];
							let cast = g_tblCast.tbl[ CAST_MINO ];
							g_unit.add( 0, 2, px, py, cast.size, rad(90), cast.tblThink, cast.name );
						}
						break;

					case 3: // ボス
//break;
						{
//							let cast = g_tblCast.tbl[ CAST_GHOST ];
//							let cast = g_tblCast.tbl[ CAST_SWORDMAN ];
							let cast = g_tblCast.tbl[ CAST_DRAGON ];
//							let cast = g_tblCast.tbl[ CAST_MINO ];
							g_unit.add( 1, 2, px, py, cast.size, rad(90), cast.tblThink, cast.name );
						}
						break;


					}
				}
			}
		}
	}


requestAnimationFrame( update );

