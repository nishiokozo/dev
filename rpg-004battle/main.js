let g=html_canvas.getContext('2d');

//-----------------------------------------------------------------------------
function streachImage2Canvas( img )
//-----------------------------------------------------------------------------
{
	// -----------------------------------------
	// ImageDataをcanvasに合成
	// -----------------------------------------
	// g   : html_canvas.getContext('2d')
	// img : g.createImageData( width, height )

	g.imageSmoothingEnabled = g.msImageSmoothingEnabled = 0; // スムージングOFF

	{
	// 引き伸ばして表示
	    let cv=document.createElement('canvas');				// 新たに<canvas>タグを生成
	    cv.width=img.width;
	    cv.height=img.height;
		cv.getContext("2d").putImageData(img,0,0);				// 作成したcanvasにImageDataをコピー
		{
			let sx = 0;
			let sy = 0;
			let sw = img.width;
			let sh = img.height;
			let dx = 0;
			let dy = 0;
			let dw = 640;
			let dh = 400;
			g.drawImage( cv,sx,sy,sw,sh,dx,dy,dw,dh);	// ImageDataは引き延ばせないけど、Imageは引き延ばせる
		}
		
	}
}

//-----------------------------------------------------------------------------
function rad( v )
//-----------------------------------------------------------------------------
{
	return v/180*Math.PI;
}
//-----------------------------------------------------------------------------
function deg( v )
//-----------------------------------------------------------------------------
{
	return v*180/Math.PI;
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
let fill_hach= function( sx,sy, ex,ey, step )
//-----------------------------------------------------------------------------
{
//	box(sx,sy,ex,ey);
	let w = ex-sx;
	let h = ey-sy;
	for ( let x = -w ; x <= w ; x+=step )
	{
		let x1 = x;
		let y1 = 0;
		let x2 = x+w;
		let y2 = h;
		if ( x1 < 0 ) 
		{
			x1 = 0;
			y1 = h-(x+w) * (h/w);
		}
		if ( x2 > w ) 
		{
			x2 = w;
			y2 = h-(x) * (h/w);
		}
		// 左上がりストライプ
		line( 
			 sx+x1
			,sy+y1
			,sx+x2
			,sy+y2
		);
		// 右上がりストライプ
		line( 
			 sx+x1
			,sy+(h-y1)
			,sx+x2
			,sy+(h-y2)
		);
	}
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
function line_dir( x, y, dir, r, wide = 1.1 )
//-----------------------------------------------------------------------------
{
	let x2 = r * Math.cos( dir )+x;
	let y2 = r * Math.sin( dir )+y;
	line( x, y, x2, y2, wide );
}


//-----------------------------------------------------------------------------
function rand( n ) // n=3以上が正規分布
//-----------------------------------------------------------------------------
{
	let r = 0;
	for ( j = 0 ; j < n ; j++ ) r += Math.random();
	return r/n;
}
//-----------------------------------------------------------------------------
function m100_cos( n ) // 100量子化cos n:0~99
//-----------------------------------------------------------------------------
{
	return Math.cos(n/100*Math.PI);
}
//-----------------------------------------------------------------------------
function m100_cos( n ) // 100量子化sin n:0~99
//-----------------------------------------------------------------------------
{
	return Math.sin(n/100*Math.PI);
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
		this.idx = 0;
	}
	//-----------------------------------------------------------------------------
	effect_gen( _x, _y, _r, _dir, _spd,_lim, _add_r, type = 0 )
	//-----------------------------------------------------------------------------
	{
		let e = this.tblEffect[ this.idx ];
		{
			e.type		= type;
			e.x			= _x;
			e.y			= _y;
			e.r			= _r;
			e.add_r		= _add_r;
			e.dir		= _dir;
			e.spd		= _spd;
			e.lim		= _lim;
		}

		this.idx++;
		if ( this.idx >= this.tblEffect.length ) this.idx = 0;
	}
	//-----------------------------------------------------------------------------
	effect_update()
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
		
				if ( e.type == 0 )
				{
					circle( e.x, e.y, e.r );
				}
				else
				{
					let ox = e.x +Math.cos( th )*e.spd*6;
					let oy = e.y +Math.sin( th )*e.spd*6;
					line( e.x, e.y, ox, oy );
					circle( e.x, e.y, e.r );
				}
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
	tst_set()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 32;
		this.time	= 0;
	}
	//-----------------------------------------------------------------------------
	tst_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;
		}
	}
};

class ActSummon
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	summon_set( cast_no, u1_x, u1_y, u1_dir, u1_size  )
	//-----------------------------------------------------------------------------
	{
		this.lim	= 60;
		this.time	= 0;
		this.cast	= g_tblCast.tbl[ cast_no ];

		let	dx = (u1_size*0.8) * Math.cos( u1_dir ) + u1_x;
		let	dy = (u1_size*0.8) * Math.sin( u1_dir ) + u1_y;

		this.r0 = u1_size*0.2;
		this.r1 = this.cast.size;
		this.x0 = dx;
		this.y0 = dy;
		this.x1 = dx + Math.cos( u1_dir ) * (u1_size + this.cast.size);
		this.y1 = dy + Math.sin( u1_dir ) * (u1_size + this.cast.size);
	}
	//-----------------------------------------------------------------------------
	summon_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;

			if ( this.lim == 0 )
			{
				let px = this.x1;
				let py = this.y1;
				g_unit.unit_create( 0, 2, px, py, this.cast.size, u1_dir, this.cast.tblThink, this.cast.name, this.cast.talk );
			}
		}
	}
};
class ActShot
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	shot_set( num = 1, interval = 1 )
	//-----------------------------------------------------------------------------
	{
		this.lim	= num*interval;
		this.time	= 0;
		this.freq	= interval;
	}
	//-----------------------------------------------------------------------------
	shot_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;

			if ( (this.lim % this.freq) == 0 )
			{
				g_effect.effect_gen( 
					  u1_x
					, u1_y
					, 2
					, u1_dir
					, 3	// speed
					, 50	// lim
					, 0	// rate scale
				);
			}
		}
	}
};
class ActQuick
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
		this.bx = 0;
		this.by = 0;
	}
	//-----------------------------------------------------------------------------
	quick_set( tx, ty, fx, fy, fdir )
	//-----------------------------------------------------------------------------
	{
//console.log( "quick1 ",tx,ty );

		this.lim	= 22;
		this.time	= 0;
		this.ax = 0;
		this.ay = 0;

//		this.tx = (tx-fx)/1;
//		this.ty = (ty-fy)/1;
		this.tx = tx;
		this.ty = ty;
		
//console.log( "quick2 ",this.tx,this.ty );
	}
	//-----------------------------------------------------------------------------
	quick_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;

			let x = (this.tx-u1_x)/4;
			let y = (this.ty-u1_y)/4;

			this.ax = x;
			this.ay = y;

//console.log( "quick ",this.tx,this.ty,x,y );
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
	volt_set( lim  )
	//-----------------------------------------------------------------------------
	{
		this.lim		= lim;
	}
	//-----------------------------------------------------------------------------
	volt_update( u1_x, u1_y, u1_size, u1_dir )
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
class ActSleep
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	sleep_set()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 60*10;
		this.time		= 0;
	}
	//-----------------------------------------------------------------------------
	sleep_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;
		}
	}
};
class ActKiai
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	kiai_set()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 32;
		this.time		= 0;
	}
	//-----------------------------------------------------------------------------
	kiai_update( u1_x, u1_y, u1_size, u1_dir )
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
	punch_set()  //) = function(  u1 )
	//-----------------------------------------------------------------------------
	{
		this.time		= 0;
		this.lim		= 32*2;
		this.dir		= rad(60);
		this.add_r	= rad(+8);
		this.acc_r	= rad(-0.9);
	}
	
	//-----------------------------------------------------------------------------
	punch_update( ax, ay, unit_size, unit_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )
		{
			this.lim--;
			let sz = unit_size;
			let br = unit_size/2;
			br = this.time;
			if ( br > unit_size/2 ) 
			{
				br = unit_size/2;
			}
			let r	= (br+unit_size);
			
			{
				let th	= unit_dir+this.dir;
				let	bx	= r*Math.cos(th)+ax;
				let	by	= r*Math.sin(th)+ay;


				circle( bx, by, br ); // パンチ表示
			}
			{
				let th	= unit_dir-this.dir;
				let	bx	= r*Math.cos(th)+ax;
				let	by	= r*Math.sin(th)+ay;


				circle( bx, by, br ); // パンチ表示
			}

				this.dir += this.add_r;	
				this.add_r += this.acc_r;
				let a = rad(19);
				if ( this.dir < a ) 
				{
					this.add_r	= -this.add_r/2.6;
						this.dir = a;
				}
//console.log( deg( this.dir ) );
				this.time++;
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
	breath_set()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 80;
		this.time	= 0;
		this.freq	= 2;
		this.dir	= rad(-30);
		this.rot	= rad(2);
		this.r		= 3.2;
		this.spd	= 2;
		this.br_lim	= 40;
		this.add_r	= 32*0.005;
	}
	//-----------------------------------------------------------------------------
	breath_update( dx, dy, unit_size, unit_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++
			if ( (this.time % this.freq ) == 0 )
			{
				g_effect.effect_gen( 
					  dx
					, dy
					, this.r
					, this.dir + unit_dir +Math.sin( rad(this.time*1.2) )
					, this.spd
					, this.br_lim
					, this.add_r
				);
			}
		}
	}
};
class ActValkan	// バルカン砲え
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 0;
	}
	//-----------------------------------------------------------------------------
	valkan_set()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 40;
		this.time	= 0;
		this.freq	= 2;
	}
	//-----------------------------------------------------------------------------
	valkan_update( dx, dy, unit_size, unit_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++
//			if ( (this.time % this.freq ) == 0 )
			if( rand(1) > 0.1 ) 
			{
				for ( let i = 0 ; i <1 ; i++ )
				{
					let dir = unit_dir + rand(2)*rad(50)-rad(50/2);
					g_effect.effect_gen( 
						  dx
						, dy
						, 5.2
						, dir //+ Math.sin(rad(this.time)*10)
						, 2 + rand(1)*4 
						, 60/4
						, -0.08*4
					);
				}

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
	bite_set()
	//-----------------------------------------------------------------------------
	{// 2	噛付き
		this.lim	= 8;
		this.freq	= 4;
		this.r		= 1.2;
		this.spd	= 1;
		this.br_lim	= 8;
		this.add_r	= 1.0;
	}
	//-----------------------------------------------------------------------------
	bite_update( dx, dy, unit_size, unit_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			if ( (this.lim % this.freq ) == 0 )
			{
				g_effect.effect_gen( 
					 dx
					,dy
					, this.r
					, unit_dir
					, this.spd
					, this.br_lim
					, this.add_r
				);
			}
		}
	}
};
class ActLaser	// レーザー
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim		= 0;		//攻撃リミット
	}
	//-----------------------------------------------------------------------------
	bow_set( num = 1, interval = 1 )
	//-----------------------------------------------------------------------------
	{
		this.lim	= num*interval;
		this.time	= 0;
		this.freq	= interval;
	}
	//-----------------------------------------------------------------------------
	bow_update( u1_x, u1_y, u1_size, u1_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;

			if ( (this.lim % this.freq) == 0 )
			{
				g_effect.effect_gen( 
					  u1_x
					, u1_y
					, 2
					, u1_dir
					, 3	// speed
					, 50	// lim
					, 0	// rate scale
					,1
				);
			}
		}
	}
};
class ActLong	// ロング攻撃
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.lim	= 0;
	}
	//-----------------------------------------------------------------------------
	long_set( size = 1.2 )
	//-----------------------------------------------------------------------------
	{
		this.lim	= 16;
		this.time	= 0;
		this.r		= size;
		this.spd	= size*1.25;
		this.br_lim	= 8;
		this.add_r	= size;
	}
	//-----------------------------------------------------------------------------
	long_update( dx, dy, unit_size, unit_dir )
	//-----------------------------------------------------------------------------
	{
		if ( this.lim > 0 )	// 攻撃
		{
			this.lim--;
			this.time++;
			if ( this.time == 1 )
			{
				g_effect.effect_gen( 
					 dx
					,dy
					, this.r
					, unit_dir
					, this.spd
					, this.br_lim
					, this.add_r
				);
				g_effect.effect_gen( 
					 dx
					,dy
					, this.r
					, unit_dir
					, this.spd/2
					, this.br_lim*2
					, this.add_r/2
				);
			}
		}
	}
};


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

//	let g_x1=0;
//	let g_y1=0;


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
		for ( let key of Object.keys(this.tbl) )
		{
			makeratio( this.tbl[key].tblThink );
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
const ACT_QUICK		=22;	// 瞬間移動	すっと小さくなって消え、直線の移動先に今度は大きくなって現れる
const ACT_SHOT		= 6;	// 投げる	岩を投げるようなイメージ
const ACT_VALKAN	= 7;	// 散弾	ドラゴンが大量の酸の唾を吐くようなイメージ
const ACT_SUMMON	= 8;	// 生成	召喚士がモンスターを生成する
const ACT_BOW		= 9;	// 攻撃	通常攻撃
const ACT_LONG		=10;	// 剣戟	長い手を伸ばして攻撃
const ACT_KIAI		=11;	// 気合	噛付いて投げ飛ばす
const ACT_SLEEP		=18;	// 遁走	ボスが倒されたり

const ACT_ALPHA		=12;	// 半透明	薄くなって移動。薄い間は攻撃できないが、ダメージも食らわない
const ACT_WARP		=13;	// ワープ	フェードアウトし、別のところからフェードインして現れる
const ACT_PUSH		=14;	// 押す	弾き飛ばすけ
const ACT_JUMP		=15;	// ジャンプ	踏付け
const ACT_GUID		=16;	// 誘導	誘導属性がある。追尾モンスター生成でも良いかも
const ACT_RUN		=17;	// 遁走	ボスが倒されたり

class Unit
{
	//-----------------------------------------------------------------------------
	constructor()
	//-----------------------------------------------------------------------------
	{
		this.tblUnit =[];
	}
	//-----------------------------------------------------------------------------
	unit_create( boss, gid, x, y, size, dir, tblThink, name, talk )
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
				limTalk		: 10,
				time		: 0,
				to_dir		: 0,
				think_type	: 0,
				think_lim	: 0,

				sword	: new ActSword,
				twincle	: new ActTwincle,
				punch	: new ActPunch,
				breath	: new ActBreath,
				valkan	: new ActValkan,
				bite	: new ActBite,
				bow		: new ActLaser,
				long	: new ActLong,
				volt	: new ActVolt,
				dying	: new ActDying,
				sleep	: new ActSleep,
				kiai	: new ActKiai,
				quick	: new ActQuick,
				shot	: new ActShot,
				summon	: new ActSummon,


				alpha	: new ActTst,
				warp	: new ActTst,
				push	: new ActTst,
				jump	: new ActTst,
				guid	: new ActTst,
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
		let dx,dy;
		if(1) // 目表示
		{
			let r = u1.size*0.8 + er;
			dx = r * Math.cos( u1.dir ) + u1.x;
			dy = r * Math.sin( u1.dir ) + u1.y;
		}
		else
		{
			dx = u1.size * Math.cos( u1.dir ) + u1.x;
			dy = u1.size * Math.sin( u1.dir ) + u1.y;
			line( u1.x, u1.y, dx, dy );	// 本体方向表示
		}
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
		}

		let ux = u1.x;
		let uy = u1.y;

		u1.time+=1;

		if ( u1.breath.lim > 0 )
		{
			print( u1.x+u1.size+8, u1.y-u1.size+16, "くらえ！焦熱のブレス" );
			circle( u1.x, u1.y, er+u1.size );	// 本体表示
			circle( dx,dy,(u1.size*0.2) );		// 口、目表示

		}
		else
		if ( u1.punch.lim > 0 )
		{
			print( u1.x+u1.size+8, u1.y-u1.size+16, "パンチ～" );
			circle( u1.x, u1.y, er+u1.size );	// 本体表示
			circle( dx,dy,(u1.size*0.2) );		// 口、目表示

		}
		else
		if ( u1.bite.lim > 0 )
		{
			print( u1.x+u1.size+8, u1.y-u1.size+16, "咬み咬み" );
			circle( u1.x, u1.y, er+u1.size );	// 本体表示
			circle( dx,dy,(u1.size*0.2) );		// 口、目表示

		}
		else
		if ( u1.bow.lim > 0 )
		{
			print( u1.x+u1.size+8, u1.y-u1.size+16, "攻撃" );
			
			let r = u1.bow.time*4;
			let tx = dx + r * Math.cos( u1.dir );
			let ty = dy + r * Math.sin( u1.dir );

			line( dx, dy, tx, ty );
			circle( u1.x, u1.y, er+u1.size );	// 本体表示
			circle( dx,dy,(u1.size*0.2) );		// 口、目表示

		}
		else
		if ( u1.long.lim > 0 )
		{
			print( u1.x+u1.size+8, u1.y-u1.size+16, "ロング攻撃" );
			circle( u1.x, u1.y, er+u1.size );	// 本体表示
			circle( dx,dy,(u1.size*0.2) );		// 口、目表示

		}
		else
		if ( u1.quick.lim > 0 ) 					// 高速移動
		{
			print( u1.x+u1.size+8, u1.y-u1.size+16, "フフッ" );
			ux += u1.quick.ax;	
			uy += u1.quick.ay;	
			circle( u1.x, u1.y, er+u1.size );	// 本体表示
			circle( dx,dy,(u1.size*0.2) );		// 口、目表示

		}
		else
		if ( u1.summon.lim > 0 ) 					// 電撃
		{
			print( u1.x+u1.size+8, u1.y-u1.size+16, "召喚～" );

			if(0)
			{
				let th = 0;
				let x0 = 0;
				let y0 = 0;
				let x2 = 0;
				let y2 = 0;
				let sz = u1.summon.lim/8;
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
			else
			{
				for ( let i = 0 ; i < u1.summon.lim/8 ; i++ )
				{
					const sz = u1.summon.lim*u1.size/32/2;
					let x = rand(3)*sz-sz/2;
					let y = rand(3)*sz-sz/2;
					circle( u1.x+x, u1.y+y, er+u1.size );	// 本体表示
					circle( dx,dy,(u1.size*0.2) );		// 口、目表示
				}
			}

			let s = u1.summon;
			let t = s.time / ( s.time + s.lim );
			let x = (s.x1-s.x0)*t + s.x0;
			let y = (s.y1-s.y0)*t + s.y0;
			let r = (s.r1-s.r0)*t + s.r0;

			circle( x, y, r );	// 本体表示
			circle( dx,dy,(u1.size*0.2) );		// 口、目表示

//				circle( u1.x, u1.y, er+u1.size );	// 本体表示
		}
		else
		if ( u1.volt.lim > 0 ) 					// 電撃
		{
			print( u1.x+u1.size+8, u1.y-u1.size+16, "電撃アターック！" );
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
			print( u1.x+u1.size+8, u1.y-u1.size+16, "瀕死ぴえん" );
			for ( let i = 0 ; i < u1.dying.lim/2 ; i++ )
			{
				const sz = u1.dying.lim*u1.size/32;
				let x = rand(3)*sz-sz/2;
				let y = rand(3)*sz-sz/2;
				circle( u1.x+x, u1.y+y, er+u1.size );	// 本体表示
			}
		}
		else
		if ( u1.sleep.lim > 0 ) 					// 睡眠
		{
			print( u1.x+u1.size+8, u1.y-u1.size+16, "Zzz..." );

			er = Math.cos(rad(u1.sleep.time*5))*1.8+er;
			let r = u1.size*0.8 + er;
			dx = r * Math.cos( u1.dir ) + u1.x;
			dy = r * Math.sin( u1.dir ) + u1.y;
			circle( u1.x, u1.y, er+u1.size );	// 本体表示
			circle( dx,dy,(u1.size*0.2) );		// 口、目表示

			if ( (u1.sleep.time % 48) == 0 )
			{
					g_effect.effect_gen( 
						 dx
						,dy
						, u1.size*0.2
						, u1.dir-rad(45)
						, 0.25
						, 80
						, 0.05
						,0
					);
			}
		}
		else
		if ( u1.kiai.lim > 0 ) 					// 気合
		{
			print( u1.x+u1.size+8, u1.y-u1.size+16, "フンッ！" );
			if ( u1.kiai.time == 1 )
			{
				let th = 0;
				let x0 = 0;
				let y0 = 0;
				let x2 = 0;
				let y2 = 0;
				let st = rad(30);
				while( th <= Math.PI*2 )
				{
					let t = u1.kiai.time
					let r = u1.size+t;
					let sz = rad(6*t);
					let x1 = r*Math.cos(th) + u1.x;
					let y1 = r*Math.sin(th) + u1.y;
					th += st;
					g_effect.effect_gen( 
						 x1
						,y1
						, 5
						, th//u1.dir
						, 1
						, 20
						,-0.2
					);
				}
				line( x0,y0,x2,y2);
			}
			if ( u1.kiai.time == 10 )
			{
				let th = 0;
				let x0 = 0;
				let y0 = 0;
				let x2 = 0;
				let y2 = 0;
				let st = rad(30);
				while( th <= Math.PI*2 )
				{
					let t = u1.kiai.time
					let r = u1.size+t;
					let sz = rad(6*t);
					let x1 = r*Math.cos(th) + u1.x;
					let y1 = r*Math.sin(th) + u1.y;
					th += st;
					g_effect.effect_gen( 
						 x1
						,y1
						, 5
						, th//u1.dir
						, 0.1
						, 20
						,-0.2
					);
				}
				line( x0,y0,x2,y2);
			}
			circle( u1.x, u1.y, er+u1.size );	// 本体表示
			circle( dx,dy,(u1.size*0.2) );		// 口、目表示
		}
		else
		if ( u1.twincle.lim > 0 )
		{
			print( u1.x+u1.size+8, u1.y-u1.size+16, "見えないよ～ん" );
			{
				let th = 0;
				let x0 = 0;
				let y0 = 0;
				let x2 = 0;
				let y2 = 0;
				let sz = rad(6);
				let st = rad(18);
				while( th <= Math.PI*2 )
				{
					let r = u1.size+er*4;
					r = r+rand(1)*3;
					let x1 = r*Math.cos(th) + u1.x;
					let y1 = r*Math.sin(th) + u1.y;
					let x2 = r*Math.cos(th+sz) + u1.x;
					let y2 = r*Math.sin(th+sz) + u1.y;
					line( x1,y1,x2,y2,1.4);
					th += st;
				}
				line( x0,y0,x2,y2);
			}
		}
		else
		{
			circle( u1.x, u1.y, er+u1.size );	// 本体表示
			circle( dx,dy,(u1.size*0.2) );		// 口、目表示
		}
		
		////////////////
		// update
		////////////////

		u1.sword.swd_update( u1.x, u1.y, u1.size, u1.dir );
		u1.punch.punch_update( u1.x, u1.y, u1.size, u1.dir );
		u1.twincle.twn_update();
		u1.bite.bite_update( dx, dy, u1.size, u1.dir );
		u1.bow.bow_update( dx, dy, u1.size, u1.dir );
		u1.long.long_update( dx, dy, u1.size, u1.dir );
		u1.breath.breath_update( dx, dy, u1.size, u1.dir );
		u1.valkan.valkan_update( dx, dy, u1.size, u1.dir );

		u1.volt.volt_update( u1.x, u1.y, u1.size, u1.dir );	
		u1.dying.dying_update( u1.x, u1.y, u1.size, u1.dir );
		u1.sleep.sleep_update( u1.x, u1.y, u1.size, u1.dir );
		u1.kiai.kiai_update( u1.x, u1.y, u1.size, u1.dir );
		u1.quick.quick_update( u1.x, u1.y, u1.size, u1.dir );	

		u1.shot.shot_update( dx, dy, u1.size, u1.dir );	
		u1.summon.summon_update( dx, dy, u1.size, u1.dir );	
		u1.alpha.tst_update( u1.x, u1.y, u1.size, u1.dir );	
		u1.warp.tst_update( u1.x, u1.y, u1.size, u1.dir );	
		u1.push.tst_update( u1.x, u1.y, u1.size, u1.dir );	
		u1.jump.tst_update( u1.x, u1.y, u1.size, u1.dir );	
		u1.guid.tst_update( u1.x, u1.y, u1.size, u1.dir );	
		u1.run.tst_update( u1.x, u1.y, u1.size, u1.dir );	


		if ( u1.gid == 0 ) return;	// グループID=0 はNONE
		if ( u1.gid == 1 ) return;	// グループID=1 はPlayer

		////////////////
		// 思考
		////////////////
		{	// 狙いを決める
			{
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
				{	// 方向を求める
					let x0	= tar_x;
					let y0	= tar_y;
					u1.to_dir = Math.atan2( (y0-u1.y), (x0-u1.x) );
				}
			}

			{
				let act	= u1.tblThink[ u1.think_type ];

				{	// アクション発動
					let num = act.act_no;
					if ( num == ACT_TWINCLE	) 	u1.twincle.twn_set( 60 );
					if ( num == ACT_PUNCH	) 	u1.punch.punch_set();
					if ( num == ACT_BREATH	)	u1.breath.breath_set();
					if ( num == ACT_VALKAN	)	u1.valkan.valkan_set();
					if ( num == ACT_BITE	)	u1.bite.bite_set();
					if ( num == ACT_BOW		)	u1.bow.bow_set();
					if ( num == ACT_LONG	)	u1.long.long_set( u1.size/8 );
					if ( num == ACT_SWORD	)	u1.sword.swd_set( 1 );

					if ( num == ACT_VOLT	)	u1.volt.volt_set( 32 );	// 電撃	ダメージ＆一定時間動けなくなる。また近くに連鎖する
					if ( num == ACT_DYING	)	u1.dying.dying_set();
					if ( num == ACT_SLEEP	)	u1.sleep.sleep_set();
					if ( num == ACT_KIAI	)	u1.kiai.kiai_set();	// 気合	噛付いて投げ飛ばす
					if ( num == ACT_QUICK	)	
					{
						if ( u1.quick.lim == 0 )
						{
							// 攻撃対象との相対角度を求める
							let th = u1.to_dir - u1.dir;
							if ( th < -Math.PI ) th += Math.PI*2;
							if ( th >  Math.PI ) th -= Math.PI*2;
							
							// 右にいるか左にいるかを判断し、移動方向を決める
							if ( th > 0 )
							{
								th = rad(60);
							}
							else
							{
								th = rad(-60);
							}
							// 移動先座標を決める
							{
								let dir = u1.dir+th;
								let r = 80;	
								let x = r*Math.cos(dir)+u1.x;
								let y = r*Math.sin(dir)+u1.y;
								u1.quick.quick_set( x, y, u1.x, u1.y, u1.dir);
							}
						}
				

					}

					if ( num == ACT_SHOT	)	u1.shot.shot_set(2,6);	// 投げる	岩を投げるようなイメージ
					if ( num == ACT_SUMMON	)	u1.summon.summon_set("ZOMBIE", u1.x, u1.y, u1.dir, u1.size );	// 召喚
					if ( num == ACT_ALPHA	)	u1.alpha.tst_set();	// 半透明	薄くなって移動。薄い間は攻撃できないがダメージも食らわない
					if ( num == ACT_WARP	)	u1.warp.tst_set();	// ワープ	フェードアウトし、別のところからフェードインして現れる
					if ( num == ACT_PUSH	)	u1.push.tst_set();	// 押す	弾き飛ばすけ
					if ( num == ACT_JUMP	)	u1.jump.tst_set();	// ジャンプ	踏付け
					if ( num == ACT_GUID	)	u1.guid.tst_set();	// 誘導	誘導属性がある。追尾モンスター生成でも良いかも
					if ( num == ACT_RUN		)	u1.run.tst_set();	// 遁走	ボスが倒されたり
				}

				{// 方向を変える
					// 相対角を求める
					let s = u1.to_dir - u1.dir;
					if ( s < -Math.PI ) s += Math.PI*2;
					if ( s >  Math.PI ) s -= Math.PI*2;

					let r = 0;
					if ( s > 0 ) 
					{
						r =  Math.min(s,act.rot_spd);
					}
					if ( s < 0 ) 
					{
						r =  -Math.min(-s,act.rot_spd);
					}
					u1.dir += r;
				}

				{	//MOVE

					let th = u1.dir+act.mov_dir;
					ux += Math.cos( th )*act.mov_spd;
					uy += Math.sin( th )*act.mov_spd;

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
							let far = Math.sqrt( (x1-ux)*(x1-ux) + (y1-uy)*(y1-uy) );			
							if ( len+0 > far ) flg = true;
						}
						return flg
					}
					
					if ( isCol() == false )
					{
						u1.x = ux;
						u1.y = uy;
					}
					
				}
			}

			u1.think_lim--;
			if ( u1.think_lim <= 0 )	// 思考パターン抽選
			{
				u1.think_type = 0;
				let r = Math.random();
				for ( let i = 0 ; i < u1.tblThink.length ; i++ )
				{
					let tnk = u1.tblThink[i];
					if ( r < tnk.ratio ) 
					{
						u1.think_type = i;
						u1.think_lim = Math.floor( rand(tnk.num)*tnk.quant )+1;
						break;
					}
				}
				if ( u1.think_type == 0 ) console.log("抽選失敗");			
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

let g_json_cast = 
{
	"DUMMY":
	{
		name		:"DUMMY",
		size		:  2,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	"PLAYER1":
	{
		name		:"こーぞ",
		size		:  13,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	"PLAYER2":
	{
		name		:"ティナ",
		size		:  11,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	"PLAYER3":
	{
		name		:"ユイ",
		size		:  11,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(0)	,mov_spd:0.25	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
		]
	},
	"DRAGON":	// 竜型	ドラゴン
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
	"WOLF":	// 獣型	ウルフ
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
	"MINO":	// 人型ミノタウロス
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
	"GHOST":	// 幽体	ゴースト
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
			{name:"TWINCLE"	,act_no:4			,mov_dir:rad(   0)	,mov_spd:1.30 	, rot_spd:rad(0.3)	,rate:20, quant: 0, num:3 },
		]
	},
	"ZOMBIE":	// 人型	ゾンビ
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
	"SWORDMAN":	// 人型	ソードマン
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
	"TSTMAN":	// 人型	テストマン
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
			{name:"剣"		,act_no:ACT_SWORD	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"脈動"	,act_no:ACT_DYING	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"射撃"	,act_no:ACT_SHOT	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"瞬足"	,act_no:ACT_QUICK	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(4.0)	,rate:120, quant: 20, num:3 },
			{name:"半透明"	,act_no:ACT_ALPHA	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"ワープ"	,act_no:ACT_WARP	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"押す"	,act_no:ACT_PUSH	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"ジャンプ",act_no:ACT_JUMP	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"長距離"	,act_no:ACT_LONG	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"追尾"	,act_no:ACT_GUID	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"電撃"	,act_no:ACT_VOLT	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"気合"	,act_no:ACT_KIAI	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"散弾"	,act_no:ACT_VALKAN	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"生成"	,act_no:ACT_SUMMON		,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
			{name:"遁走"	,act_no:ACT_RUN		,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(0.3)	,rate:20, quant: 20, num:3 },
		]
	},
	"NINJA":	// 人型	忍者			クイックな動きと手裏剣
	{
		name		:"忍者"	,
		size		: 16,
		talk		:["",70,"某がお相手いたそう",30,"いざッ"],
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  60)	,mov_spd:1.0	, rot_spd:rad(1.5)	,rate:20, quant: 96, num:3 },
			{name:"FL"		,act_no:0			,mov_dir:rad( -60)	,mov_spd:1.0	, rot_spd:rad(1.5)	,rate:20, quant: 96, num:3 },
			{name:"BR"		,act_no:0			,mov_dir:rad( 120)	,mov_spd:1.0 	, rot_spd:rad(1.0)	,rate:20, quant: 96, num:3 },
			{name:"BL"		,act_no:0			,mov_dir:rad(-120)	,mov_spd:1.0 	, rot_spd:rad(1.0)	,rate:20, quant: 96, num:3 },
			{name:"B"		,act_no:0			,mov_dir:rad(-180)	,mov_spd:4.0 	, rot_spd:rad(0.0)	,rate:10, quant: 20, num:3 },
			{name:"瞬足"	,act_no:ACT_QUICK	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(28.0)	,rate:20, quant: 30, num:3 },
			{name:"撃つ"	,act_no:ACT_SHOT	,mov_dir:rad(   0)	,mov_spd:0.1 	, rot_spd:rad(28.0)	,rate:20, quant: 0, num:3 },
		]
	},
	"WIBARN":	// 飛竜	ワイバーン		酸の唾を吐く
	{
		name		:"ワイバーン"	,
		size		: 32,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(  0)	,mov_spd:0.25	, rot_spd:rad(1.0)	,rate: 0, quant:  0, num:3 },
			{name:"R"		,act_no:0			,mov_dir:rad( 90)	,mov_spd:0.75	, rot_spd:rad(0.2)	,rate:20, quant: 72, num:3 },
			{name:"R"		,act_no:0			,mov_dir:rad( 60)	,mov_spd:0.75	, rot_spd:rad(0.2)	,rate:20, quant:120, num:3 },
			{name:"L"		,act_no:0			,mov_dir:rad(45)	,mov_spd:0.75	, rot_spd:rad(0.2)	,rate:20, quant:120, num:3 },
			{name:"バルカン",act_no:ACT_VALKAN	,mov_dir:rad(  0)	,mov_spd:0.25	, rot_spd:rad(0.6)	,rate:10, quant:0, num:3 },
		]
	},
	"SUMMON":	// 人型	召喚士	召喚
	{
		name		:"召喚士"	,
		size		: 12,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(  0)	,mov_spd:0.0	, rot_spd:rad(0.0)	,rate: 0, quant:  0, num:3 },
			{name:"B"		,act_no:0			,mov_dir:rad( 120)	,mov_spd:0.75	, rot_spd:rad(0.8)	,rate:20, quant: 8, num:3 },
			{name:"B"		,act_no:0			,mov_dir:rad(  90)	,mov_spd:1.25	, rot_spd:rad(0.8)	,rate:20, quant: 36, num:3 },
			{name:"R"		,act_no:0			,mov_dir:rad( 60)	,mov_spd:1.0	, rot_spd:rad(0.8)	,rate:20, quant:36, num:3 },
			{name:"L"		,act_no:0			,mov_dir:rad( 160)	,mov_spd:0.5	, rot_spd:rad(0.8)	,rate:20, quant:8, num:3 },
			{name:"召喚"	,act_no:ACT_SUMMON	,mov_dir:rad(  0)	,mov_spd:0.25	, rot_spd:rad(0.3)	,rate:4, quant:0, num:3 },
		]
	},
	"ORC":	// 人型	オーク
	{
		name		:"オーク"	,
		size		: 14,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0		, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"F"		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.2 	, rot_spd:rad(0.3)	,rate:10, quant: 72, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  45)	,mov_spd:0.4	, rot_spd:rad(0.6)	,rate:10, quant: 72, num:3 },
			{name:"FR"		,act_no:0			,mov_dir:rad(  90)	,mov_spd:0.4	, rot_spd:rad(0.6)	,rate:20, quant: 72, num:3 },
			{name:"BL"		,act_no:0			,mov_dir:rad(-140)	,mov_spd:0.3	, rot_spd:rad(0.1)	,rate:20, quant: 36, num:3 },
			{name:"攻撃"	,act_no:ACT_LONG	,mov_dir:rad(   0)	,mov_spd:2.30 	, rot_spd:rad(0.3)	,rate:20, quant: 0, num:3 },
		]
	},
	"ARCHER":	// 人型	弓
	{
		name		:"アーチャー",
		size		: 12,	
		tblThink	:
		[
			{name:""		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.20	, rot_spd:rad(1)	,rate: 0, quant:  0, num:3 },
			{name:"B"		,act_no:0			,mov_dir:rad( 180)	,mov_spd:0.25	, rot_spd:rad(0.2)	,rate:30, quant: 72, num:3 },
			{name:"F"		,act_no:0			,mov_dir:rad(   0)	,mov_spd:0.40	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"R"		,act_no:0			,mov_dir:rad(  45)	,mov_spd:0.40 	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"L"		,act_no:0			,mov_dir:rad( -45)	,mov_spd:0.40 	, rot_spd:rad(0.2)	,rate:10, quant:120, num:3 },
			{name:"弓"		,act_no:ACT_BOW		,mov_dir:rad(   0)	,mov_spd:0.75	, rot_spd:rad(0.6)	,rate:30, quant:0, num:3 },
		]
	},
//	"GIANT":	// 人型	巨人
//	"TOROL":	// 人型	トロール
//	"GOBLIN":	// 人型	ゴブリン	
//	"CYCROPS":	// 人型	サイクロプス	目からレーザー
};

const g_tblCast = new Cast( g_json_cast );

let g_img = g.createImageData( 200, 200 );

let g_map;
// フロアマトリクス
{
	let size= 52;
	let w = Math.floor(html_canvas.width/size);
	let h = Math.floor(html_canvas.height/size);
	let sx = (html_canvas.width-w*size)/2+size/2;
	let sy = (html_canvas.height-h*size)/2+size/2;

	g_map = Array(w);
	for ( let i = 0 ; i < g_map.length ; i++ ) g_map[i] = Array(h);

	for ( let x = 0 ; x < w ; x++ )
	{
		for ( let y = 0 ; y < h ; y++ )
		{
			if ( rand(1) > 0.95 )
			{
				g_map[y][x] = 1;
			}
		}
	}
}
		let g_sets=[
			[9,9,0,9,0,9,9],
			[9,0,9,3,9,0,9],
			[0,0,0,9,0,0,0],
			[0,4,0,0,0,4,0],
			[0,0,0,9,0,0,0],
			[9,0,9,1,9,0,9],
			[9,9,9,9,9,9,9],
		];
//-----------------------------------------------------------------------------
function main_update()
//-----------------------------------------------------------------------------
{
	cls();
	if (1)	// フロアマトリクス
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
				if ( g_sets[y][x] == 1 ) continue;
				if ( g_sets[y][x] == 3 ) continue;
				if ( g_sets[y][x] == 4 ) continue;
				if ( g_map[y][x] == 1 )
//				if ( x == 3 && y == 3 )
				{
					//circle( x*size+sx, y*size+sy, 16+8,3 );
					let s = size-0;
					let x0 = x*size+sx;
					let y0 = y*size+sy;
					let x1 = x0-s/2;
					let y1 = y0-s/2;
					let x2 = x0+s/2;
					let y2 = y0+s/2;
					fill_hach( x1,y1,x2,y2, 13 );
					//print( x*size+sx, y*size+sy, Math.floor(g_map[y][x]*100) );
				}
			}
		}
	}

	// 月と太陽
	{
		function draw_sun( px, py, r0, r1, r2 ) 
		{ // 太陽
			circle( px, py, r0 );
			for ( let th = 0 ; th < Math.PI*2 ; th += rad(30) )
			{
				let x1 = r1*Math.cos(th) + px;
				let y1 = r1*Math.sin(th) + py;
				let x2 = r2*Math.cos(th) + px;
				let y2 = r2*Math.sin(th) + py;
				line( x1, y1, x2, y2 );
			}
		}
		draw_sun( 60, 20, 7, 11, 15 );

		function draw_moon( px, py, r0 ) 
		{ // 月 29.5日周期で満ち欠け
			for ( let i = 0 ; i < r0 ; i+=0.5 )
			{
				circle( px, py, i );
			}
		}
		draw_moon( 30, 20, 8 );
	}

	if(0)
	{ // クリッピング実験
		circle( html_canvas.width/2, html_canvas.height/2, 160 );
	    g.clip();
	}

	// エフェクト更新
	g_effect.effect_update();

	// ユニット更新
	g_unit.unit_updateUnit();


	{// 別に作ったImageDataを重ね合わせ表示
		let x = 50;
		let y = 50;
		let col = 0x00ff00;
		{
			let a = 0xff;
			let adr = (y*g_img.width+x)*4;
			g_img.data[ adr +0 ] = (col>>16)&0xff;
			g_img.data[ adr +1 ] = (col>> 8)&0xff;
			g_img.data[ adr +2 ] = (col>> 0)&0xff;
			g_img.data[ adr +3 ] = a&0xff;
			streachImage2Canvas( g_img );
		}
	}
	
	requestAnimationFrame( main_update );
}

//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	const	KEY_CR	= 13;
	const	KEY_0	= 48;	//0x30
	const	KEY_1	= 49;	//0x31
	const	KEY_2	= 50;	//0x32
	const	KEY_3	= 51;	//0x33
	const	KEY_4	= 52;	//0x34
	const	KEY_5	= 53;	//0x35
	const	KEY_6	= 54;	//0x36
	const	KEY_7	= 55;	//0x37
	const	KEY_8	= 56;	//0x38
	const	KEY_9	= 57;	//0x39
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

			if ( c == KEY_G )	//
			{
				u1.sleep.sleep_set();	
			}
			if ( c == KEY_H )	//
			{
				u1.kiai.kiai_set();	
			}
			if ( c == KEY_J )	//
			{
				u1.long.long_set( u1.size/8 );
			}
			if ( c == KEY_K )	//
			{
				u1.bow.bow_set();
			}
			if ( c == KEY_L )	//
			{
				u1.summon.summon_set("WOLF", u1.x, u1.y, u1.dir, u1.size );
			}
			if ( c == KEY_E )	//
			{
				u1.valkan.valkan_set();
			}
			if ( c == KEY_R )	//
			{
				u1.shot.shot_set(2,4);
			}
			if ( c == KEY_T )	//
			{
				u1.volt.volt_set(32);	// 電撃	ダメージ＆一定時間動けなくなる。また近くに連鎖する
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
				u1.bite.bite_set();
			}
			if ( c == KEY_O )	// ブレス
			{
				u1.breath.breath_set();
			}
			if ( c == KEY_P )	//パンチ
			{
				u1.punch.punch_set();
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
}

//-----------------------------------------------------------------------------
window.onload = function()
//-----------------------------------------------------------------------------
{
	//.unit_create( 0, 100, 350, 16, rad(-90), "ティナ",THINK_NONE );
	//.unit_create( 0, 290, 300, 16, rad(-90), "ユイ",THINK_NONE );

	//.unit_create( 1,100,  40, 25, 0.25, rad(90),"ワイバーン",THINK_ATTACK_BREATH );
	//.unit_create( 1,192, 150, 36, 0.25, rad(90), "ドラゴン",THINK_ATTACK_BREATH );
	//.unit_create( 1,300, 130, 22, 0.25, rad(90), "ゴースト",THINK_ATTACK_BREATH );

	{//ユニット配置




		{
			for ( let y = 0 ; y < g_sets.length ; y++ )
			{
				for ( let x = 0 ; x < g_sets[y].length ; x++ )
				{
					if ( g_map[y][x] == 1 ) continue;
					switch( g_sets[y][x] )
					{
						case 0:	// 雑魚
							if ( y < 3 )
							{
								if ( rand(1) < 0.2 ) g_sets[y][x] = 2;
							}
							else
							{
								if ( rand(1) < 0.1 ) g_sets[y][x] = 2;
							}
							break;

						case 3:	// ボス
							{
							//	if ( rand(1) < 0.2 ) g_sets[y][x] = 0;
							}
							break;

						case 4:	// 中ボス
							{
								if ( rand(1) < 0.2 ) g_sets[y][x] = 0;
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

			let tblEnemy =
			[
				["WOLF","GHOST","ZOMBIE","NINJA","ORC","ARCHER",],
				["GHOST","WIBARN","MINO","NINJA","SUMMON","SWORDMAN",],
				["DRAGON","MINO","SWORDMAN","TSTMAN","NINJA","WIBARN"],
			];
			let e0 = Math.floor(tblEnemy[0].length*rand(1))
			let e1 = Math.floor(tblEnemy[1].length*rand(1))
			let e2 = Math.floor(tblEnemy[2].length*rand(1))

			for ( let y = 0 ; y < h ; y++ )
			{
				for ( let x = 0 ; x < w ; x++ )
				{
					let px = x*size+sx;
					let py = y*size+sy;


					switch( g_sets[y][x] )
					{
					case 1: // プレイヤー
						{
							let cast;
							if ( cntPlayer == 0 ) cast = g_tblCast.tbl[ "PLAYER1" ];
							if ( cntPlayer == 1 ) cast = g_tblCast.tbl[ "PLAYER2" ];
							if ( cntPlayer == 2 ) cast = g_tblCast.tbl[ "PLAYER3" ];
							g_unit.unit_create( 0, 1, px, py, cast.size, rad(-90), cast.tblThink, cast.name, cast.talk );
							cntPlayer++;
						}
						break;

					case 2: // 雑魚
						{
//break;
//							let cast = g_tblCast.tbl[ "WOLF" ];
//							let cast = g_tblCast.tbl[ "GHOST" ];
//							let cast = g_tblCast.tbl[ "ZOMBIE" ];
//							let cast = g_tblCast.tbl[ "SWORDMAN" ];
//							let cast = g_tblCast.tbl[ "NINJA" ];
//							let cast = g_tblCast.tbl[ "ORC" ];
//							let cast = g_tblCast.tbl[ "ARCHER" ];
							let cast = g_tblCast.tbl[ tblEnemy[0][ e0 ]];
							g_unit.unit_create( 0, 2, px, py, cast.size, rad(90), cast.tblThink, cast.name, cast.talk );
						}
						break;

					case 4: // 中ボス
break;
						{
//							let cast = g_tblCast.tbl[ "DRAGON" ];
//							let cast = g_tblCast.tbl[ "MINO" ];
//							let cast = g_tblCast.tbl[ "TSTMAN" ];
//							let cast = g_tblCast.tbl[ "NINJA" ];
							let cast = g_tblCast.tbl[ tblEnemy[1][ e1 ]];
							g_unit.unit_create( 0, 2, px, py, cast.size, rad(90), cast.tblThink, cast.name, cast.talk );
						}
						break;

					case 3: // ボス
//break;
						{
//							let cast = g_tblCast.tbl[ "GHOST" ];
//							let cast = g_tblCast.tbl[ "SWORDMAN" ];
//							let cast = g_tblCast.tbl[ "DRAGON" ];
//							let cast = g_tblCast.tbl[ "MINO" ];
//							let cast = g_tblCast.tbl[ "SWORDMAN" ];
//							let cast = g_tblCast.tbl[ "TSTMAN" ];
//							let cast = g_tblCast.tbl[ "NINJA" ];
//							let cast = g_tblCast.tbl[ "WIBARN" ];
//							let cast = g_tblCast.tbl[ "SUMMON" ];
//							let cast = g_tblCast.tbl[ "ARCHER" ];
							let cast = g_tblCast.tbl[ tblEnemy[2][ e2 ]];
							g_unit.unit_create( 0, 2, px, py, cast.size, rad(90), cast.tblThink, cast.name, cast.talk );
						}
						break;


					}
				}
			}
		}
	}
	requestAnimationFrame( main_update );
}

