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
let line = function( sx,sy, ex,ey, wide=1.1 )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.strokeStyle = "#000000";
	g.lineWidth = wide;
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
let circle = function( x,y,r, width=1.1  )
//-----------------------------------------------------------------------------
{
	g.beginPath();
	g.lineWidth = width;
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


//-----------------------------------------------------------------------------
function rand( n ) // n=3以上が正規分布
//-----------------------------------------------------------------------------
{
	let r = 0;
	for ( j = 0 ; j < n ; j++ ) r += Math.random();
	return r/n;
}

class Effect
{
	//-----------------------------------------------------------------------------
	constructor( max )
	//-----------------------------------------------------------------------------
	{
		this.tblEffect = Array( max );
		for ( let i = 0 ; i < max ; i++ )
		{
			this.tblEffect[i] = {lim:0};
		}
	}
	//-----------------------------------------------------------------------------
	gen( _x, _y, _r, _dir, _spd,_lim, _add_r )
	//-----------------------------------------------------------------------------
	{
		for ( let tar of this.tblEffect )
		{
			if ( tar.lim == 0 )
			{
				tar.x		= _x;
				tar.y		= _y;
				tar.r		= _r;
				tar.add_r	= _add_r;
				tar.dir		= _dir;
				tar.spd		= _spd;
				tar.lim		= _lim;
				break;
			}
		}
	}
	//-----------------------------------------------------------------------------
	updateEffect()
	//-----------------------------------------------------------------------------
	{
		for ( let e of this.tblEffect )
		{
			if ( e.lim > 0 )
			{
				e.lim--;
				let th = e.dir;
				e.x += Math.cos( th )*e.spd;
				e.y += Math.sin( th )*e.spd;
				e.r += e.add_r;
		
				circle( e.x, e.y, e.r );
			}
		}
	}
};

let g_effect = new Effect(100);

class ActTst
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	set()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 32;
		this.time	= 0;
	}
	//-----------------------------------------------------------------------------
	update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;
		}
	}
};
class ActVolt
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	set( lim  )
	//-----------------------------------------------------------------------------
	{
		this.lim		= lim;
	}
	//-----------------------------------------------------------------------------
	update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
		}
	}
};
class ActDying
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	dying_set()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 32;
		this.time		= 0;
	}
	//-----------------------------------------------------------------------------
	dying_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;
		}
	}
};
class ActSword
{
	static NONE=0;
	static SET=0;
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.swd_req 	= 0;	//発動リクエスト
		this.swd_lim	= 0;	//発動リミット
		this.swd_stat 	= 0;	//シーケンス
	}
	//-----------------------------------------------------------------------------
	swd_set( req )
	//-----------------------------------------------------------------------------
	{
		if ( this.swd_stat == 1 ) req = 2;
		this.swd_req = req;
	}
	//-----------------------------------------------------------------------------
	swd_update( ax, ay, unit_size, unit_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.swd_req != 0  )
		{
			switch( this.swd_req )
			{
				case 1:
					this.swd_stat 	= this.swd_req;
					this.swd_req	= 0;
					this.swd_lim	= 32;
					this.swd_dir	= rad(90);
					this.swd_dir2	= rad(70);
					this.swd_add_r	= rad(+10.0);
					this.swd_acc_r	= rad(-1.0);
					break;

				case 2:
					this.swd_stat 	= this.swd_req;
					this.swd_req	= 0;
					this.swd_lim	= 32;
					this.swd_dir	= rad(70);
					this.swd_dir2	= rad(70);
					this.swd_add_r	= rad(+10.0);
					this.swd_acc_r	= rad(-1.0);
					break;
			}
		}

		if ( this.swd_stat == 1 )
		{
			{
				let th	= unit_dir+this.swd_dir;
				let r	= unit_size;
				let	bx	= r*Math.cos(th)+ax;
				let	by	= r*Math.sin(th)+ay;
				let th2	= unit_dir+this.swd_dir2;
				let	cx	= 2*r*Math.cos(th2)+ax;
				let	cy	= 2*r*Math.sin(th2)+ay;
				line(bx,by,cx,cy,3.0);
			}
		}
		if ( this.swd_stat == 2 )
		{
			if ( this.swd_lim > 0 )
			{
				this.swd_lim--;
		
				let th	= unit_dir+this.swd_dir;
				let r	= unit_size;
				let	bx	= r*Math.cos(th)+ax;
				let	by	= r*Math.sin(th)+ay;
				let th2	= unit_dir+this.swd_dir2;
				let	cx	= 2*r*Math.cos(th2)+ax;
				let	cy	= 2*r*Math.sin(th2)+ay;
				this.swd_dir += this.swd_add_r;	
				this.swd_dir2 += this.swd_add_r*1.5;	
				this.swd_add_r += this.swd_acc_r;
				line(bx,by,cx,cy,3.0);
			}
		}
		
	}
};

class ActTwincle	// 点滅アクション
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	twn_set( lim )  //) = function(  u1 )
	//-----------------------------------------------------------------------------
	{
		this.time		= 0;
		this.lim		= lim;
		this.twn_flg		= false;
	}
	//-----------------------------------------------------------------------------
	twn_isActive()
	//-----------------------------------------------------------------------------
	{
		let pat = [0,0,0,1,1,1];
		return pat[(this.time % pat.length )]
	}
	//-----------------------------------------------------------------------------
	twn_update()
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )
		{
			this.lim--;
			this.time++;
		}
	}
};
class ActPunch	// パンチ攻撃アクション
{
	static bAttack = true;
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 0;	
	}
	//-----------------------------------------------------------------------------
	pnc_set()  //) = function(  u1 )
	//-----------------------------------------------------------------------------
	{
		this.pnc_time		= 0;
		this.lim		= 32;
		this.pnc_dir		= rad(60);
		this.pnc_add_r	= rad(+8);
		this.pnc_acc_r	= rad(-0.9);
	}
	
	//-----------------------------------------------------------------------------
	pnc_update( ax, ay, unit_size, unit_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )
		{
			this.lim--;

			let th	= unit_dir+this.pnc_dir;
			let r	= unit_size*1.3;
			let	bx	= r*Math.cos(th)+ax;
			let	by	= r*Math.sin(th)+ay;

			this.pnc_dir += this.pnc_add_r;	
			this.pnc_add_r += this.pnc_acc_r;
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
		this.lim	= 0;
	}
	//-----------------------------------------------------------------------------
	brt_set()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 80;
		this.brt_freq	= 2;
		this.brt_dir	= rad(-30);
		this.brt_rot	= rad(2);
		this.brt_r		= 3.2;
		this.brt_spd	= 2;
		this.brt_br_lim	= 40;
		this.brt_add_r	= 32*0.005;
	}
	//-----------------------------------------------------------------------------
	brt_update( ax, ay, dx, dy, er, unit_size, unit_dir, unit_name )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			if ( (this.lim % this.brt_freq ) == 0 )
			{
				this.brt_dir += this.brt_rot;
				let dir = unit_dir + this.brt_dir;
				g_effect.gen( 
					  dx
					, dy
					, this.brt_r
					, dir
					, this.brt_spd
					, this.brt_br_lim
					, this.brt_add_r
				);
			}
		}
	}
};

class ActBite	// 噛みつきアクション
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 0;
	}
	//-----------------------------------------------------------------------------
	bte_set()
	//-----------------------------------------------------------------------------
	{// 2	噛付き
		this.lim	= 8;
		this.bte_freq	= 4;
		this.bte_r		= 1.2;
		this.bte_spd	= 1;
		this.bte_br_lim	= 8;
		this.bte_add_r	= 1.0;
	}
	//-----------------------------------------------------------------------------
	bte_update( ax, ay, dx, dy, er, unit_size, unit_dir, unit_name )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			if ( (this.lim % this.bte_freq ) == 0 )
			{
				g_effect.gen( 
					 dx
					,dy
					, this.bte_r
					, unit_dir
					, this.bte_spd
					, this.bte_br_lim
					, this.bte_add_r
				);
			}
		}
	}
};


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
const ACT_SWORD		= 5;	// 剣
const ACT_VOLT		=20;	// 電撃	ダメージ＆一定時間動けなくなる。また近くに連鎖する

const ACT_DYING		=21;	// 瀕死	激しく大小に脈打つ
const ACT_SHOT		= 0;	// 投げる	岩を投げるようなイメージ
const ACT_QUICK		= 0;	// 瞬間移動	すっと小さくなって消え、直線の移動先に今度は大きくなって現れる
const ACT_ALPHA		= 0;	// 半透明	薄くなって移動。薄い間は攻撃できないが、ダメージも食らわない
const ACT_WARP		= 0;	// ワープ	フェードアウトし、別のところからフェードインして現れる
const ACT_PUSH		= 0;	// 押す	弾き飛ばすけ
const ACT_JUMP		= 0;	// ジャンプ	踏付け
const ACT_LONG		= 0;	// 触手	長い手を伸ばして攻撃
const ACT_GUID		= 0;	// 誘導	誘導属性がある。追尾モンスター生成でも良いかも
const ACT_BIGBITE	= 0;	// 噛付いて投げ飛ばす
const ACT_SHOTGUN	= 0;	// 散弾	ドラゴンが大量の酸の唾を吐くようなイメージ
const ACT_GEN		= 0;	// 生成	召喚士がモンスターを生成する
const ACT_RUN		= 0;	// 遁走	ボスが倒されたり

class Unit
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.tblUnit =[];
	}
	//-----------------------------------------------------------------------------
	unit_add( boss, gid, x, y, size, dir, tblThink, name, talk )
	//-----------------------------------------------------------------------------
	{
		this.tblUnit.push(
			{
				boss		: boss,
				gid			: gid,	// グループID , 1:Player
				x			: x,
				y			: y,
				size		: size,
				dir			: dir,
				tblThink	: tblThink,
				name		: name,
				tblTalk		: talk,
				seqTalk		: 0,
				limTalk		: 60,
				time		: 0,
				to_th		: 0,
				think_type	: 0,
				think_lim	: 0,

				sword	: new ActSword,
				twincle	: new ActTwincle,
				punch	: new ActPunch,
				breath	: new ActBreath,
				bite	: new ActBite,

				volt	: new ActVolt,
				dying	: new ActDying,
				shot	: new ActTst,
				quick	: new ActTst,
				alpha	: new ActTst,
				warp	: new ActTst,
				push	: new ActTst,
				jump	: new ActTst,
				long	: new ActTst,
				guid	: new ActTst,
				bigbite	: new ActTst,
				shotgun	: new ActTst,
				gen		: new ActTst,
				run		: new ActTst,

			}
		);
	}

	//-----------------------------------------------------------------------------
	unit_update( u1 )
	//-----------------------------------------------------------------------------
	{
		////////////////
		// 表示
		////////////////

		let	er = Math.cos(rad(u1.time*10))*0.6;
		let dx = u1.size * Math.cos( u1.dir ) + u1.x;
		let dy = u1.size * Math.sin( u1.dir ) + u1.y;
		line( u1.x, u1.y, dx, dy );	// 本体方向表示
		print( u1.x+u1.size, u1.y-u1.size, u1.name );
		
		if ( u1.tblTalk != undefined )
		{
			if ( u1.limTalk > 0 )
			{
				u1.limTalk--;
				if ( u1.limTalk == 0 )
				{
					while( u1.seqTalk < u1.tblTalk.length )
					{
						u1.seqTalk++;
						let d = u1.tblTalk[u1.seqTalk];
						if ( Number.isFinite(d) ) 
						{
							u1.limTalk = d;
						}
						else
						{
							break;	
						}
					}
				}
				if ( u1.seqTalk < u1.tblTalk.length )
				{
					print( u1.x+u1.size, u1.y-u1.size-16, u1.tblTalk[u1.seqTalk] );
				}
			}
		}
		{
			if ( u1.breath.lim > 0 )
			{
				print( u1.x+u1.size+8, u1.y-u1.size+16, "くらえ！焦熱のブレス" );
			}
			if ( u1.volt.lim > 0 )
			{
				print( u1.x+u1.size+8, u1.y-u1.size+16, "電撃アターック！" );
			}
			if ( u1.dying.lim > 0 )
			{
				print( u1.x+u1.size+8, u1.y-u1.size+16, "瀕死ぴえん" );
			}
			if ( u1.twincle.lim > 0 )
			{
				print( u1.x+u1.size+8, u1.y-u1.size+16, "見えないよ～ん" );
			}
			if ( u1.punch.lim > 0 )
			{
				print( u1.x+u1.size+8, u1.y-u1.size+16, "パンチ～" );
			}
			if ( u1.bite.lim > 0 )
			{
				print( u1.x+u1.size+8, u1.y-u1.size+16, "咬み咬み" );
			}
		}


		u1.time+=1;

		if ( u1.volt.lim > 0 ) 					// 電撃
		{
			{
				let th = 0;
				let x0 = 0;
				let y0 = 0;
				let x2 = 0;
				let y2 = 0;
				let sz = u1.volt.lim/2;
				let st = rad(8);
				while( th < Math.PI*2 )
				{
					let r = u1.size+rand(1)*sz;
					let x1 = r*Math.cos(th) + u1.x;
					let y1 = r*Math.sin(th) + u1.y;
					if ( x2 == 0 ) 
					{
						x0 = x1;
						y0 = y1;
					}
					else
					{
						line( x1,y1,x2,y2);
					}
					x2 = x1;
					y2 = y1;
					th += st;
				}
				line( x0,y0,x2,y2);
			}
		}
		else
		if ( u1.dying.lim > 0 ) 					// 瀕死
		{
			for ( let i = 0 ; i < u1.dying.lim/2 ; i++ )
			{
				const sz = u1.dying.lim*u1.size/32;
				let x = rand(3)*sz-sz/2;
				let y = rand(3)*sz-sz/2;
				circle( u1.x+x, u1.y+y, er+u1.size );	// 本体表示
			}
		}
		else
		if ( u1.twincle.lim > 0 )
		{
			{
				let th = 0;
				let x0 = 0;
				let y0 = 0;
				let x2 = 0;
				let y2 = 0;
				let sz = u1.twincle.lim/2;
				let st = rad(15);
				while( th <= Math.PI*2 )
				{
					st = rad(10);
					let r = u1.size+er*3;//+rand(1)*sz;
					r+=rand(1)*4;
					let x1 = r*Math.cos(th) + u1.x;
					let y1 = r*Math.sin(th) + u1.y;
					let x2 = r*Math.cos(th+st/4) + u1.x;
					let y2 = r*Math.sin(th+st/4) + u1.y;
					line( x1,y1,x2,y2,2.4);
					th += st;
				}
				line( x0,y0,x2,y2);
			}
		}
		else
		{
			if ( u1.boss )							// ボスは外装付き
			{
				circle( u1.x, u1.y, er+u1.size+2 );	// 外装表示
			}
			else
			{
				circle( u1.x, u1.y, er+u1.size );	// 本体表示
			}
		}
			if ( u1.boss )							// ボスは外装付き
			{
//				circle( u1.x, u1.y, er+u1.size*0.8 );	// 外装表示
			}
		
		////////////////
		// update
		////////////////

		u1.sword.swd_update( u1.x, u1.y, u1.size, u1.dir );
		u1.punch.pnc_update( u1.x, u1.y, u1.size, u1.dir );
		u1.twincle.twn_update();
		u1.bite.bte_update( u1.x, u1.y, dx, dy, er, u1.size, u1.dir, u1.name );
		u1.breath.brt_update( u1.x, u1.y, dx, dy, er, u1.size, u1.dir, u1.name );

		u1.volt.update( u1.x, u1.y, u1.size, u1.dir );	
		u1.dying.dying_update( u1.x, u1.y, u1.size, u1.dir );

		u1.shot.update( u1.x, u1.y, u1.size, u1.dir );	
		u1.quick.update( u1.x, u1.y, u1.size, u1.dir );	
		u1.alpha.update( u1.x, u1.y, u1.size, u1.dir );	
		u1.warp.update( u1.x, u1.y, u1.size, u1.dir );	
		u1.push.update( u1.x, u1.y, u1.size, u1.dir );	
		u1.jump.update( u1.x, u1.y, u1.size, u1.dir );	
		u1.long.update( u1.x, u1.y, u1.size, u1.dir );	
		u1.guid.update( u1.x, u1.y, u1.size, u1.dir );	
		u1.bigbite.update( u1.x, u1.y, u1.size, u1.dir );	
		u1.shotgun.update( u1.x, u1.y, u1.size, u1.dir );	
		u1.gen.update( u1.x, u1.y, u1.size, u1.dir );	
		u1.run.update( u1.x, u1.y, u1.size, u1.dir );	

		if ( u1.gid == 0 ) return;	// グループID=0 はNONE
		if ( u1.gid == 1 ) return;	// グループID=1 はPlayer

		////////////////
		// 思考
		////////////////

		let act	= u1.tblThink[ u1.think_type ];
		{
			let num = act.act_no;
			if ( num == ACT_TWINCLE	) 	u1.twincle.twn_set( 60 );
			if ( num == ACT_PUNCH	) 	u1.punch.pnc_set();
			if ( num == ACT_BREATH	)	u1.breath.brt_set();
			if ( num == ACT_BITE	)	u1.bite.bte_set();
			if ( num == ACT_SWORD	)	u1.sword.swd_set( 1 );

			if ( num == ACT_VOLT	)	u1.volt.set( 32 );	// 電撃	ダメージ＆一定時間動けなくなる。また近くに連鎖する
			if ( num == ACT_DYING	)	u1.dying.dying_set();

			if ( num == ACT_SHOT	)	u1.shot.set();	// 投げる	岩を投げるようなイメージ
			if ( num == ACT_QUICK	)	u1.quick.set();	// 瞬間移動	すっと小さくなって消え、直線の移動先に今度は大きくなって現れる
			if ( num == ACT_ALPHA	)	u1.alpha.set();	// 半透明	薄くなって移動。薄い間は攻撃できないが、ダメージも食らわない
			if ( num == ACT_WARP	)	u1.warp.set();	// ワープ	フェードアウトし、別のところからフェードインして現れる
			if ( num == ACT_PUSH	)	u1.push.set();	// 押す	弾き飛ばすけ
			if ( num == ACT_JUMP	)	u1.jump.set();	// ジャンプ	踏付け
			if ( num == ACT_LONG	)	u1.long.set();	// 触手	長い手を伸ばして攻撃
			if ( num == ACT_GUID	)	u1.guid.set();	// 誘導	誘導属性がある。追尾モンスター生成でも良いかも
			if ( num == ACT_BIGBITE	)	u1.bigbite.set();	// 噛付いて投げ飛ばす
			if ( num == ACT_SHOTGUN	)	u1.shotgun.set();	// 散弾	ドラゴンが大量の酸の唾を吐くようなイメージ
			if ( num == ACT_GEN		)	u1.gen.set();	// 生成	召喚士がモンスターを生成する
			if ( num == ACT_RUN		)	u1.run.set();	// 遁走	ボスが倒されたり


		}

		{	// 狙いを決める
			let tar_x = 0;
			let tar_y = 0;
			{
				let cnt = 0;
				for ( let u1 of g_unit.tblUnit )
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

			{	// 方向を決める
				let x0	= tar_x;
				let y0	= tar_y;
				u1.to_th = Math.atan2( (y0-u1.y), (x0-u1.x) );
			}

			{	// 方向を変える
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
			let ax	= u1.x;
			let ay	= u1.y;

			let th = u1.dir+act.mov_dir;
			ax += Math.cos( th )*act.mov_spd;
			ay += Math.sin( th )*act.mov_spd;

			let isCol = function() //衝突判定
			{
				let flg = false; 
				for ( let u2 of g_unit.tblUnit )
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


const CAST_NONE		= 0;	// NONE
const CAST_PLAYER1	= 1;	// 人型	Player
const CAST_PLAYER2	= 2;	// 人型	Player
const CAST_PLAYER3	= 3;	// 人型	Player
const CAST_DRAGON	= 4;	// 竜型	ドラゴン
const CAST_WOLF		= 5;	// 獣型	ウルフ
const CAST_MINO		= 6;	// 人型ミノタウロス
const CAST_GHOST	= 7;	// 幽体	ゴースト
const CAST_ZOMBIE	= 8;	// 人型	ゾンビ
const CAST_SWORDMAN	= 9;	// 人型	ソードマン
const CAST_TSTMAN	= 10;	// 人型	テストマン
const CAST_BIGMAN	= 11;	// 人型	巨人
const CAST_TOROL	= 12;	// 人型	トロール
const CAST_ORC		= 13;	// 人型	オーク
const CAST_GOBLIN	= 14;	// 人型	ゴブリン	
const CAST_WIBARN	= 15;	// 飛竜	ワイバーン	
const CAST_CYCROPS	= 15;	// 人型	サイクロプス
let g_json_cast = 
[
	{
		name		:"NONE",
		size		:  2,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	{
		name		:"こーぞ",
		size		:  13+12,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	{
		name		:"ティナ",
		size		:  11,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	{
		name		:"ユイ",
		size		:  11,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	{
		name		:"ドラゴン"	,
		size		: 52,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"B"		,act_no:0			,mov_dir:rad(180)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:20, quant: 72, num:3 },
			{name:"R"		,act_no:0			,mov_dir:rad( 60)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:20, quant:120, num:3 },
			{name:"L"		,act_no:0			,mov_dir:rad(-60)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:20, quant:120, num:3 },
			{name:"ブレス"	,act_no:1,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(0.6)	,rate:10, quant:0, num:3 },
		]
	},
	{
		name		:"ウルフ"		,
		size		: 10,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.20	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"B"		,act_no:0			,mov_dir:rad( 180)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:30, quant: 72, num:3 },
			{name:"F"		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.75	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"R"		,act_no:0			,mov_dir:rad(  80)	,mov_spd:0.34 	, rot_spd:rad(1.4)	,rate:10, quant:120, num:3 },
			{name:"L"		,act_no:0			,mov_dir:rad( -80)	,mov_spd:0.34 	, rot_spd:rad(1.4)	,rate:10, quant:120, num:3 },
			{name:"噛付き"	,act_no:2,mov_dir:rad(   0)	,mov_spd:0.75	, rot_spd:rad(0.2)	,rate:10, quant:0, num:3 },
		]
	},
	{
		name		:"ミノタウロス",
		size		: 30,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.20	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"B"		,act_no:0			,mov_dir:rad( 180)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:30, quant: 72, num:3 },
			{name:"F"		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.40	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"R"		,act_no:0			,mov_dir:rad(  45)	,mov_spd:0.40 	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"L"		,act_no:0			,mov_dir:rad( -45)	,mov_spd:0.40 	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"パンチ"	,act_no:3,mov_dir:rad(   0)	,mov_spd:0.75	, rot_spd:rad(0.6)	,rate:30, quant:0, num:3 },
		]
	},
	{
		name		:"ゴースト"	,
		size		: 14,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  60)	,mov_spd:0.35	, rot_spd:rad(0.3)	,rate:12, quant: 96, num:3 },
			{name:"FL"		,act_no:0			,mov_dir:rad( -60)	,mov_spd:0.35	, rot_spd:rad(0.3)	,rate:12, quant: 96, num:3 },
			{name:"BR"		,act_no:0			,mov_dir:rad( 120)	,mov_spd:0.30 	, rot_spd:rad(0.3)	,rate:10, quant: 96, num:3 },
			{name:"BL"		,act_no:0			,mov_dir:rad(-120)	,mov_spd:0.30 	, rot_spd:rad(0.3)	,rate:10, quant: 96, num:3 },
			{name:"TWINCLE"	,act_no:4,mov_dir:rad(   0)	,mov_spd:1.30 	, rot_spd:rad(0.3)	,rate:20, quant: 0, num:3 },
		]
	},
	{
		name		:"ゾンビ"		,
		size		: 12,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"探す"	,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(1.0)	,rate:10, quant: 48, num:3 },
			{name:"F"		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.25 	, rot_spd:rad(0.1)	,rate:10, quant: 72, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  30)	,mov_spd:0.25	, rot_spd:rad(0.1)	,rate:10, quant: 72, num:3 },
			{name:"FL"		,act_no:0			,mov_dir:rad( -30)	,mov_spd:0.25	, rot_spd:rad(0.1)	,rate:10, quant: 72, num:3 },
		]
	},
	{
		name		:"ソードマン"	,
		size		: 16,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"F"		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.2 	, rot_spd:rad(0.3)	,rate:10, quant: 72, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  45)	,mov_spd:0.4	, rot_spd:rad(0.6)	,rate:10, quant: 72, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  90)	,mov_spd:0.4	, rot_spd:rad(0.6)	,rate:20, quant: 72, num:3 },
			{name:"BL"		,act_no:0			,mov_dir:rad(-140)	,mov_spd:0.3	, rot_spd:rad(0.1)	,rate:20, quant: 96, num:3 },
			{name:"攻撃"	,act_no:ACT_SWORD	,mov_dir:rad(   0)	,mov_spd:2.30 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"脈動"	,act_no:ACT_DYING	,mov_dir:rad(   0)	,mov_spd:2.30 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },

		]
	},
	{
		name		:"テストマン"	,
		size		: 16,
		talk		:["",50,"やぁやぁ我こそはテストマン",30,"いざ尋常に！"],
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  60)	,mov_spd:0.32	, rot_spd:rad(0.3)	,rate:20, quant: 96, num:3 },
			{name:"FL"		,act_no:0			,mov_dir:rad( -60)	,mov_spd:0.32	, rot_spd:rad(0.3)	,rate:20, quant: 96, num:3 },
			{name:"BR"		,act_no:0			,mov_dir:rad( 120)	,mov_spd:0.30 	, rot_spd:rad(0.3)	,rate:20, quant: 96, num:3 },
			{name:"BL"		,act_no:0			,mov_dir:rad(-120)	,mov_spd:0.30 	, rot_spd:rad(0.3)	,rate:20, quant: 96, num:3 },
			{name:"ブレス"	,act_no:ACT_BREATH	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"噛付き"	,act_no:ACT_BITE	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"パンチ"	,act_no:ACT_PUNCH	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"点滅"	,act_no:ACT_TWINCLE	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },

			{name:"脈動"	,act_no:ACT_DYING	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"射撃"	,act_no:ACT_SHOT	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"瞬足"	,act_no:ACT_QUICK	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"半透明"	,act_no:ACT_ALPHA	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"ワープ"	,act_no:ACT_WARP	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"押す"	,act_no:ACT_PUSH	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"ジャンプ",act_no:ACT_JUMP	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"長距離"	,act_no:ACT_LONG	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"追尾"	,act_no:ACT_GUID	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"電撃"	,act_no:ACT_VOLT	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"嚙み投げ",act_no:ACT_BIGBITE	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"散弾"	,act_no:ACT_SHOTGUN	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"生成"	,act_no:ACT_GEN		,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"遁走"	,act_no:ACT_RUN		,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
		]
	}
];

let g_tblCast = new Cast( g_json_cast );


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

			if ( c == KEY_T )	//
			{
				u1.volt.set(32);	// 電撃	ダメージ＆一定時間動けなくなる。また近くに連鎖する
			}
			if ( c == KEY_Y )	//
			{
				u1.dying.dying_set();	
			}
			if ( c == KEY_S )	//ソード
			{
				u1.sword.swd_set( 1 );
			}
			if ( c == KEY_W )	//ソード
			{
				u1.sword.swd_set( 2 );
			}
			if ( c == KEY_I )	//噛付き
			{
				u1.bite.bte_set();
			}
			if ( c == KEY_O )	// ブレス
			{
				u1.breath.brt_set();
			}
			if ( c == KEY_P )	//パンチ
			{
				u1.punch.pnc_set();
			}
			if ( c == KEY_U )	//点滅
			{
				u1.twincle.twn_set( 32 );
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



//.unit_add( 0, 100, 350, 16, rad(-90), "ティナ",THINK_NONE );
//.unit_add( 0, 290, 300, 16, rad(-90), "ユイ",THINK_NONE );

//.unit_add( 1,100,  40, 25, 0.25, rad(90),"ワイバーン",THINK_ATTACK_BREATH );
//.unit_add( 1,192, 150, 36, 0.25, rad(90), "ドラゴン",THINK_ATTACK_BREATH );
//.unit_add( 1,300, 130, 22, 0.25, rad(90), "ゴースト",THINK_ATTACK_BREATH );

	

	{//ユニット配置

		let tbl=[
			[0,0,0,9,0,0,0],
			[0,0,9,3,9,0,0],
			[0,0,0,9,0,0,0],
			[0,4,0,0,0,4,0],
			[0,0,0,9,0,0,0],
			[0,9,9,1,9,9,0],
			[9,0,9,9,9,0,9],
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
							g_unit.unit_add( 0, 1, px, py, cast.size, rad(-90), cast.tblThink, cast.name, cast.talk );
							cntPlayer++;
						}
						break;

					case 2: // 雑魚
						{
break;
//							let cast = g_tblCast.tbl[ CAST_WOLF ];
//							let cast = g_tblCast.tbl[ CAST_GHOST ];
//							let cast = g_tblCast.tbl[ CAST_ZOMBIE ];
							let cast = g_tblCast.tbl[ CAST_SWORDMAN ];
							g_unit.unit_add( 0, 2, px, py, cast.size, rad(90), cast.tblThink, cast.name, cast.talk );
						}
						break;

					case 4: // 中ボス
break;
						{
//							let cast = g_tblCast.tbl[ CAST_DRAGON ];
							let cast = g_tblCast.tbl[ CAST_MINO ];
							g_unit.unit_add( 0, 2, px, py, cast.size, rad(90), cast.tblThink, cast.name, cast.talk );
						}
						break;

					case 3: // ボス
//break;
						{
//							let cast = g_tblCast.tbl[ CAST_GHOST ];
//							let cast = g_tblCast.tbl[ CAST_SWORDMAN ];
//							let cast = g_tblCast.tbl[ CAST_DRAGON ];
//							let cast = g_tblCast.tbl[ CAST_MINO ];
//							let cast = g_tblCast.tbl[ CAST_SWORDMAN ];
							let cast = g_tblCast.tbl[ CAST_TSTMAN ];
							g_unit.unit_add( 1, 2, px, py, cast.size, rad(90), cast.tblThink, cast.name, cast.talk );
						}
						break;


					}
				}
			}
		}
	}


requestAnimationFrame( update );

