"use strict";




//------------------------------------------------------------------------------
function func_intersect_Line_Point2( P0, I0, P1 )	// 直線と点との距離
//------------------------------------------------------------------------------
{
	// P0:始点
	// I0:方向（単位ベクトル）
	// P1:点
	// Q :衝突点
	// t :P0からQまでの距離

	let I1 = vsub2(P1 , P0);
	let t = dot2(I0,I1);	// P0からQまでのQ距離
	let Q = vadd2( P0, vmul_scalar2(I0,t));
	let	d =  length2(vsub2(Q , P1));
	return [true,d,Q,t];
}

//------------------------------------------------------------------------------
function func_intersect_HarfLine_Point2( P0, I0, P1 )	// 半直線と点との距離
//------------------------------------------------------------------------------
{
	let [flg,d,Q,t] = func_intersect_Line_Point2( P0, I0, P1 );

	if ( t <= 0 ) flg = false; 			// 始点トリミング：範囲外でも使える衝突点等の値が返る

	return [flg,d,Q,t];
}

//------------------------------------------------------------------------------
function func_intersect_SegLine_Point2( P0, Q0, P1 )	// 線分と点との距離
//------------------------------------------------------------------------------
{
	// P0:始点
	// Q0:終点
	// P1:点
 	let L = vsub2(Q0 , P0)
 	let I0 = normalize2(L)

	let [flg,d,Q,t] = func_intersect_Line_Point2( P0, I0, P1 );
	if ( t <= 0 ) flg = false; 			// 始点トリミング：範囲外でも使える衝突点等の値が返る
	if ( t >= length2(L) ) flg = false;	// 終点トリミング：範囲外でも使える衝突点等の値が返る

	return [flg,d,Q,t];
}


//------------------------------------------------------------------------------
function func_intersect_Line_Line2( P0, I0, P1, I1 ) // 直線と直線の距離
//------------------------------------------------------------------------------
{
	if ( (I0.x==0 && I0.y==0) || (I1.x==0 && I1.y==0) ) return [false,0,vec2(0,0),vec2(0,0),0,0];

	//    P0       P1
	//    |        |
	//    |}t0     |}t1(時間:Iベクトル方向、負の数ならP1より前)
	//    |        |
	// Q0 +--------+ Q1(衝突位置)
	//    |        |
	//    v        v
	//    I0       I1 (I0,I1は単位ベクトル)
	//
	//	交点ができたときは、Q0=Q1 , d=0 になる

	if (  cross2( I0, I1 ) == 0 ) // 平行だった時
	{
		let Q0 = vec2(0.0);
		let Q1 = vec2(0.0);
		let d = Math.abs( cross2( vsub2(P1 , P0), I0 ) );	// func_intersect_Line_Point2():点と線との距離
		return [false,d,Q0,Q1,0,0];
	}

	let d0 = dot2( vsub2(P1 , P0), I0 );
	let d1 = dot2( vsub2(P1 , P0), I1 );
	let d2 = dot2( I0, I1 );

	let t0 = ( d0 - d1 * d2 ) / ( 1.0 - d2 * d2 );
	let t1 = ( d1 - d0 * d2 ) / ( d2 * d2 - 1.0 );

	let	Q0 = vadd2(P0 , vmul_scalar2(I0,t0));
	let	Q1 = vadd2(P1 , vmul_scalar2(I1,t1));
	let	d =  length2(vsub2(Q1 , Q0));

	return [true,d,Q0,Q1,t0,t1];
}
//------------------------------------------------------------------------------
function func_intersect_HarfLine_HarfLine2( P0, I0, P1, I1 )
//------------------------------------------------------------------------------
{
	if ( (I0.x==0 && I0.y==0) || (I1.x==0 && I1.y==0) ) return [false,0,vec2(0,0),vec2(0,0),0,0];

	// 半直線と線分の距離
	// 半直線   : P0+I0
	// 半直線   : p1+I1
	// 距離     : d = |Q1-Q0|
	// 戻り値   : d距離 Q0,Q1	※false でもdだけは取得できる
	
	let [flg,d,Q0,Q1,t0,t1] = func_intersect_Line_Line2( P0, I0, P1, I1 );

	if ( flg )
	{
		// 半直線
		if ( t0 < 0 ) flg = false;
		if ( t1 < 0 ) flg = false;
	}

	return [flg,d,Q0,Q1,t0,t1];
}
//------------------------------------------------------------------------------
function func_intersect_SegLine_SegLine2( p0, q0, p1, q1 )
//------------------------------------------------------------------------------
{
	if ( q0.x == p0.x && q0.y == p0.y || q1.x == p1.x && q1.y == p1.y ) return [false,0,vec2(0,0),vec2(0,0),0,0];

	// 線分と線分の距離
	// 線分0開始: p0
	// 線分0終了: q0
	// 線分1開始: p1
	// 線分1終了: q1
	// 距離     : d = |Q1-Q0|
	// 戻り値   : d距離 Q0,Q1	※false でもdだけは取得できる
	
	let	P0 = p0;
	let	I0 = normalize2( vsub2(q0,p0) );
	let	P1 = p1;
	let	I1 = normalize2( vsub2(q1,p1) );

	let [flg,d,Q0,Q1,t0,t1] = func_intersect_Line_Line2( P0, I0, P1, I1 );

	if ( flg )
	{
		// 線分処理
		if ( t1 < 0 ) flg = false;
		if ( t1 > length2(vsub2(q1,p1)) ) flg = false;

		// 線分処理
		if ( t0 < 0 ) flg = false;
		if ( t0 > length2(vsub2(q0,p0)) ) flg = false;

	}

	return [flg,d,Q0,Q1,t0,t1];
}

let g_hdlRequest = null;
let g_hdlTimeout = null;
let g_stage;
let g_reso_x = 360;//192;
let g_reso_y = 360;//192;
let g_req = '';
let first = 1;
let count = 1;
let g_highscore = 0;

let hit_ball;
let hit_racket;
let hit_racket1;
let hit_buf_ball = [];
let hit_buf_racket = [];

let hit_q={};
let hit_st={};
let hit_en={};

let tst_x=0;
let tst_y=0;

const BALL_SP_BASE	= 160;	//	基準になるボールの速度
const BALL_SP_TOP	= 500;
const BALL_SP_UNDER = 80;	
const BALL_SP_Y		= 40;	//	殆ど真横でバウンドし続けるのを抑制するための、Y軸移動量下限値
const BALL_SP_CEIL	= 1.1;	//	天井に当たったときの加速率
const BALL_M = 0.8;
const BALL_X = g_reso_x/2-50;
const BALL_Y = 210;

const RACKET_Y=360-8;
const RACKET_M=8;

const BLOCK_Y=64;
const BLOCK_R=14;

let racket = {p:{x:g_reso_x/2,y:RACKET_Y},v:{x:0,y:0},r:16, m:RACKET_M};
let g_prev_x	= racket.p.x;

//-----------------------------------------------------------------------------
function main()
//-----------------------------------------------------------------------------
{
	// 初期化
	if ( g_hdlRequest ) window.cancelAnimationFrame( g_hdlRequest ); // main呼び出しで多重化を防ぐ
	if ( g_hdlTimeout ) clearTimeout( g_hdlTimeout 	);	 // main呼び出しで多重化を防ぐ
	if ( g_hdlClick ) clearTimeout( g_hdlClick 	);	 // main呼び出しで多重化を防ぐ
	let gra = gra_create( html_canvas );
	first = 1;
	count = 1;

	let info_stat;
	let info_timerlost;
	let info_masterball;
	let info_stockballs;
	let info_score;
	let info_stage;
	let info_activeblocks;
	let info_scaleball;
	let balls;
	let blocks;

	let cnthit=0;





		
	// メモ＞
	// 時間:t(s)
	// 質量:m(kg)
	// 加速度:a(m/s^2)
	// 速度:v=at(m/s)
	// 距離:x=1/2vt(m)
	// 距離:x=1/2at^2(m)
	// 重力加速度:g=9.8(m/s^2)
	// 力:F=ma(N)
	// 運動量:p=mv(kgm/s=N・s)
	// 力積:I=mv'– mv
	// 力積:I=Ft(N・s)
	// エネルギー:K=mgh(J)
	// エネルギー:K=Fx(J)
	// エネルギー:K=1/2Fvt(J)
	// エネルギー:K=1/2mv^2(J)
	// 運動量保存の式:m1v1+m2v2=m1v1'+m2v2'
	// 力学的エネルギー保存の式:1/2mv^2-Fx=1/2mv'^2
	// 反発係数の式:e=-(va'-vb')/(va-vb)
	// ニュートン力学の二体問題
	// 換算質量:1/μ=(1/m1+1/m2)
	// 換算質量:μ=m1m2/(m1+m2)
	// 重心位置：rg=(m1r1+m2r2)
	// 相対位置：r=r2-r1;
	// 換算質量:1=μ/m1+μ/m2
	// 圧力:P
	// 体積:P
	// エネルギー：K=PV(J)
	

	// 質量に応じた面積の半径を返す関数
	function calc_r( m )
	{
		let r0 = 10;	// 基準半径
		let m0 = 1;		// 基準質量
		let range = r0*r0*3.14 / m0;	// 質量比率
		return Math.sqrt(range * m/3.14);
	}

		
	// ボール生成関数
	function create_ball( px, py, m, speed, th= radians(45) )
	{
		// 初速ベクトル
		let vx = speed*Math.cos(th);
		let vy = speed*Math.sin(th);

		let r = calc_r( m );
		balls.push({flgmaster:false, p:vec2(px, py),v:vec2(vx, vy),m:m ,r:r, flg:true });
		return balls[balls.length-1];

	}

	// ステージ生成関数
	function init_stage( type )
	{
		info_scaleball = 1;

		// ボールクリーンナップ
		{
			let tmp = [];
			for ( let t of balls )
			{
				if ( t.flg == false ) continue; 

				if ( length2(t.v) > 0 && length2(t.v)>BALL_SP_BASE )
				{
					t.v  = vmul_scalar2( normalize2(t.v), BALL_SP_BASE ); // クリア時に早すぎるボールを一旦速度を落とす。
				}
				tmp.push(t);
			}
			balls = tmp;
		}	

		// ブロック初期化
		blocks=[];
		info_activeblocks=0;
		switch( type )
		{
			case 'test':	// ノーマル
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 0 ; j < 1 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
						blocks.push({p:vec2(x, y),r:r, flg:true});
					}
					create_ball( 150, 112, BALL_M*2, 40, radians(180) );
					create_ball( 20, 112, BALL_M*3, 10, radians(180) );
				}
				break;

			case 'basic':	// ノーマル
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
						blocks.push({p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2, BLOCK_Y-st, BALL_M, 0 );
				}
				break;
	
			case 'giant':	// ノーマル
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
						blocks.push({p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2, BLOCK_Y-st, BALL_M, 0 );

//					info_masterball = create_ball( BALL_X, BALL_Y, BALL_M*4, 100, radians(45) );
//					info_masterball.flgmaster = true;

					//info_scaleball = 4;
				}
				break;

			case 'super':	// +2ball
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
						blocks.push({p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2-16, BLOCK_Y-st, BALL_M, 0 );
					create_ball( g_reso_x/2+16, BLOCK_Y-st, BALL_M, 0 );
				}
				break;
				
			case 'mitu':	// 密
				{
					let r = BLOCK_R*3/4;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
						blocks.push({p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2, BLOCK_Y-st, BALL_M, 0 );
					create_ball( g_reso_x/2, BLOCK_Y+st*5, BALL_M, 0 );
				}
				break;

			case 'wild':	// 
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
						blocks.push({p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2, BLOCK_Y+st*4, BALL_M*6, 0 );
				}
				break;


			case 'special':	// 
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
						blocks.push({p:vec2(x, y),r:r, flg:true});
					}

					for ( let i = 0 ; i<4 ; i++ )
					{
						let x = g_reso_x/2-st+st/4	+st/2*i;
						let y = BLOCK_Y+st*2+st/4;
						create_ball( x,y, BALL_M*0.5, 0 );
						create_ball( x,y+st/2, BALL_M*0.5, 0 );
					}
				}
				break;

			case 'dot':	// 
				{
					let r = 2;
					let st = BLOCK_R*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;
					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
						blocks.push({p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2, BLOCK_Y-16, BALL_M*3, 0 );
				}
				break;

			case 'hex':	
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2+st/2;
					let aax = 0;
					for ( let j = 0 ; j < 5 ; j++ )
					{
						if ( j%2 == 1 ) 
						{
							aax = 0;
						}
						else
						{
							aax = st/2;
						}
					
						for ( let i = 0 ; i * st+ax+aax < g_reso_x-st/2 ; i++ )
						{
							let x = i * st+ax+aax;
							let y = j * st*0.85+BLOCK_Y;
							blocks.push({p:vec2(x, y),r:r, flg:true});
						}
					}
					if(0)
					{
						create_ball( g_reso_x/2-st*6, BLOCK_Y+st*0.85 , BALL_M, 0 );
						create_ball( g_reso_x/2-st*6, BLOCK_Y+st*0.85*3 , BALL_M, 0 );
						create_ball( g_reso_x/2+st*6, BLOCK_Y+st*0.85 , BALL_M, 0 );
						create_ball( g_reso_x/2+st*6, BLOCK_Y+st*0.85*3 , BALL_M, 0 );
					}
					else
					{
						create_ball( g_reso_x/2-st*6, BLOCK_Y+st*0.85*2 , BALL_M, 0 );
						create_ball( g_reso_x/2+st*6, BLOCK_Y+st*0.85*2 , BALL_M, 0 );
					}
				}
				break;

			case 'castle':	// 
				if(0)
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let cx =g_reso_x/2;
					let cy =g_reso_y/2;
					
					{
						let x = cx;
						let y = cy;
							blocks.push({p:vec2(x, y),r:r, flg:true});
					}
				}
				else
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let cx =g_reso_x/2;
					let cy =g_reso_y/2+st/4;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2+st/2;
					let aax = 0;
					for ( let j = 0 ; j < 11 ; j++ )
					{
						if ( j%2 == 1 ) 
						{
							aax = 0;
						}
						else
						{
							aax = st/2;
						}
					
						for ( let i = 0 ; i * st+ax+aax < g_reso_x-st/2 ; i++ )
						{
							let x = i * st+ax+aax;
							let y = j * st*0.85+BLOCK_Y;

//		if ( j >=2 && x>st*2 && x<g_reso_x-st*2 ) continue;
let u = x-cx;
let v = y-cy;
let l = Math.sqrt(u*u+v*v);
if ( l < st*4+st/2  ) continue;

							blocks.push({p:vec2(x, y),r:r, flg:true});
						}
					}
					create_ball( g_reso_x/2-30, BLOCK_Y+64+32, BALL_M*Math.random()*3, 0 );
					create_ball( g_reso_x/2   , BLOCK_Y+32+32, BALL_M*Math.random()*4, 0 );
					create_ball( g_reso_x/2+32, BLOCK_Y+64+32, BALL_M*Math.random()*5, 0 );
				}
				break;

			default:
				{
					blocks.push({p:vec2(g_reso_x/2, g_reso_y/2),r:20, flg:true});
					create_ball( g_reso_x/2, BLOCK_Y, BALL_M, 0 );
				
					console.log("ERROR stage name:"+type );
				}
				break;		
		}
	}

	function init_game()
	{
		balls = [];
		blocks = [];
		info_stage = 1;
		info_stockballs = 3;
		info_stat = 'setgame';
		info_timerlost = 0;
		info_masterball = null;
		info_score = 0;
		info_activeblocks = 0;
		info_scaleball = 1;
		init_stage( g_stage );
							document.getElementById("html_fps").innerHTML = ""+("0000"+g_highscore.toString()).substr(-4);

	}

	init_game();


	racket.r = calc_r( racket.m )

	//-------------------------------------------------------------------------
	function frame_update( delta )
	//-------------------------------------------------------------------------
	{
		let flgdebug = (document.getElementsByName( "html_debug" )
					&& document.getElementsByName( "html_debug" )[0]
					&& document.getElementsByName( "html_debug" )[0].checked );

		gra.backcolor(0,0,0);
		gra.color(1,1,1);
		gra.cls();
		gra.window( 0,0,g_reso_x,g_reso_y );




		// exec request
		if ( info_stat == 'gameover' )
		{
			if ( g_req == 'req_next' )
			{
				init_game();
				//return;
			}

		}
		if ( info_stat == 'lostball' )
		{
			info_timerlost += delta;
			if ( info_timerlost >= 1.0 )
			{
				info_stat = 'setgame';
			}
		}

		// count active blocks 
		{
			info_activeblocks=0;
			for ( let t of blocks )
			{
				if ( t.flg == false ) continue;
				
				info_activeblocks++;
			}
			
		}

		// サーブ
		if ( g_req == 'req_next' )
		{
			g_req=''
			if ( info_stat == 'start' )
			{
				console.log('service');
				info_stat = 'ingame';

				hit_st = {};
				hit_en = {};
				hit_q = {};

				hit_buf_ball = [];
				hit_buf_racket = [];
			}
		}

		// ボール生成
		if( info_stat=='setgame')
		{
			info_masterball = create_ball( BALL_X, BALL_Y, BALL_M*1, BALL_SP_BASE, radians(45) );
			info_masterball.flgmaster = true;
			info_stat = 'start';
		}

		// check clear
		if ( info_activeblocks <= 0 )
		{
			info_stage++;
			init_stage( g_stage );
		}

		// move ball
		if ( info_stat == 'ingame' )
		{
			for ( let t of balls )
			{
				if ( t.flg == false ) continue;

				t.p.x = t.p.x + t.v.x * delta
				t.p.y = t.p.y + t.v.y * delta
			}
		}

		// racket for collition to wall 
		{
			let wl = gra.sx+racket.r;
			let wr = gra.ex-racket.r;
		
			if ( racket.p.x < wl ) 
			{
				racket.p.x = wl;
			}
			if ( racket.p.x > wr ) 
			{
				racket.p.x = wr;
			}
		}
		racket.v.x = (racket.p.x- g_prev_x)*60; // ラケットの移動量から速度を逆算

		// collition ball to wall
		for ( let t of balls )
		{
			if ( t.flg == false ) continue;

			let wl = gra.sx+t.r;
			let wr = gra.ex-t.r;
			let wt = gra.sy+t.r;
			let wb = gra.ey-t.r;
			let px = t.p.x;
			let py = t.p.y;

			if ( px < wl )
			{
				t.p.x += (wl-px)*2;
	 			t.v.x = -t.v.x;
				if ( t.flgmaster )
				{
					if ( Math.abs(t.v.y) < BALL_SP_Y ) 			//	y軸下限
					{
						t.v.y = t.v.y/Math.abs(t.v.y)*BALL_SP_Y;
					}
				}

	 		}
			if ( px > wr )
			{
				t.p.x += (wr-px)*2;
	 			t.v.x = -t.v.x;
				if ( t.flgmaster )
				{
					if ( Math.abs(t.v.y) < BALL_SP_Y ) 			//	y軸下限
					{
						t.v.y = t.v.y/Math.abs(t.v.y)*BALL_SP_Y;
					}
				}
	 		}

			if ( py < wt )
			{
				t.p.y += (wt-py)*2;
	 			t.v.y = -t.v.y;
				if ( t.flgmaster ) 
				{
					t.v  = vmul_scalar2( t.v, BALL_SP_CEIL ); // 天井に当たるたび速度アップ
					//t.flgHi = true;
				}
	 		}
			if ( py > wb )
			{
				// ロストボール
				if ( t.flgmaster && t.flg == true )
				{
					info_stockballs--;

					if ( info_stockballs > 0 )
					{
						info_stat = 'lostball';
						info_timerlost = 0;
					}
					else
					{
						if ( info_score > g_highscore )
						{
							g_highscore = info_score;
						}
						info_stat = 'gameover';	// ゲームオーバー
						//info_timerlost = 0;
					}
				}
				t.flg = false;
			}
		}
		
		// 

		// 当たりチェック関数
		function chkhit( a, b )
		{
			return length2(vsub2(a.p,b.p))-(a.r+b.r);
		}

		// colition to block
		for ( let t of balls )
		{
			if ( t.flg == false ) continue;

			for ( let b of blocks )
			{
				if ( b.flg == false ) continue;

				let l = chkhit(t,b);
				if ( l < 0 )
				{
					t.v = reflect2( t.v, normalize2( vsub2( b.p, t.p ) ) );
					b.flg = false;
					info_score++;
					
				}

			}
		}



		// 衝突計算関数
		function calcbound( a, b ) // .v .p .m
		{
			// 伝達衝撃関数
			function vimpact2( I, N )
			{
				let d = dot2( I, N );
				return vec2( N.x*d, N.y*d );
			}

			// 伝達ベクトル
			let N = normalize2( vsub2( b.p, a.p ) );
			let a1 = vimpact2( a.v, N );		// N はどちら向きでも同じ結果になる。
			let b1 = vimpact2( b.v, N );		// N はどちら向きでも同じ結果になる。

			// 残留ベクトル
			let a2 = vsub2( a.v, a1 );
			let b2 = vsub2( b.v, b1 );

			// 速度交換
			// m1v1+m2v2=m1v1'+m2v2'
			// v1-v2=-(v1'-v2')
			let a3 = vec2(
				(a.m*a1.x +b.m*(2*b1.x-a1.x))/(a.m+b.m),
				(a.m*a1.y +b.m*(2*b1.y-a1.y))/(a.m+b.m)
			);
			let b3 = vec2(
				a1.x-b1.x+a3.x,
				a1.y-b1.y+a3.y
			);

			// a,b:運動量合成
			a.v = vadd2( a2, a3 );
			b.v = vadd2( b2, b3 );

		}

		// collition racket to ball
		if ( info_stat == 'ingame' )
		{
			let a = racket;

			for ( let b of balls )
			{
				if ( b.flg == false ) continue;

				let P0 = racket.p;
				let P1 = vec2( g_prev_x,racket.p.y);
				let P2 = b.p;
				let r = b.r+racket.r;

				function coll( ball, rkt )
				{
					let ix= ball.v.x;
					let iy= ball.v.y;
					{
						let s = length2( ball.v );
						calcbound( rkt, ball );
						ball.v = vmul_scalar2( normalize2(ball.v), s );
						racket.v.y = 0;
						racket.p.y = RACKET_Y;
					}

					// 埋まりを解消 ball側だけ
					{
						let l = chkhit( rkt, ball )
						let N = normalize2( vsub2(rkt.p,ball.p) );
						let m = vmul_scalar2(N,l);
						ball.p = vadd2( ball.p, m );
					}

					if ( b.flgmaster )
					{
//						t.v = vmul_scalar2( normalize2(t.v), BALL_SP_UNDER );	//	下限制限0.5倍
					}

					{// 速度コントロール
						let sp = length2(ball.v);
						if ( sp > 0 && sp < BALL_SP_BASE ) 
						{
							sp = (sp+BALL_SP_BASE)/2
//							ball.v = vmul_scalar2( normalize2(ball.v), 100/(ball.m/BALL_M) );	//	下限制限
							ball.v = vmul_scalar2( normalize2(ball.v), sp );	//	下限制限
						}
					}

					hit_buf_racket.unshift({p:{x:rkt.p.x,y:rkt.p.y},r:rkt.r});
					hit_buf_ball.unshift({p:{x:ball.p.x, y:ball.p.y},r:ball.r,iv:{x:ix, y:iy},v:{x:ball.v.x, y:ball.v.y}});
					hit_racket1 = {p:{x:g_prev_x,y:rkt.p.y},r:rkt.r};
					hit_racket 	= {p:{x:rkt.p.x,y:rkt.p.y},r:rkt.r};
					hit_ball 	= {p:{x:ball.p.x,y:ball.p.y},r:ball.r};

				}
				let [flg,d,Q] = func_intersect_SegLine_Point2( P0, P1, P2 );  // フレーム間を線形で衝突判定
				if ( flg && d < r ) 
				{
					// X=Q+I*√(r^2-d^2)	衝突時のラケットの位置
					let s = Math.sqrt(r*r-d*d);
					let I = normalize2( vsub2( P1, Q ) );
					let X = vadd2( Q, vmul_scalar2( I, s ) );
				
					hit_st.x = P0.x;		// 当たり判定の区間の開始位置
					hit_st.y = P0.y;
					hit_st.r = racket.r;
					hit_en.x = P1.x;		// 当たり判定の区間の終了位置
					hit_en.y = P1.y;
					hit_en.r = racket.r;

					hit_q.x = Q.x
					hit_q.y = Q.y;
					hit_q.r = 1;

					let t = {p:{x:X.x,y:X.y},r:racket.r};
					t.v = racket.v;
					t.m = racket.m;

					coll( b,t )


				}
				else 
				{	// フレーム間以外の通常の当たり判定
					let t = a;
					let l = chkhit(b,t);
					if ( l<0 )
					{
						coll( b,t )//

					}
				}

			}
		}
		
		// collition ball to ball
		for ( let i = 0 ; i < balls.length ; i++ )
		{
			let a = balls[i];
			if ( a.flg == false ) continue;

			for ( let j = i+1 ; j < balls.length ; j++ )
			{
				let b = balls[j];
				if ( b.flg == false ) continue;
				let l = chkhit(a,b);
				if ( l < 0 )
				{
					if ( a.p.x == b.p.x && a.p.y == b.p.y ) b.p.x+=0.01; // 同一座標解消

					if ( a.v.x == 0 && a.v.y == 0 ) b.v = vmul_scalar2( normalize2(b.v), BALL_SP_BASE );
					if ( b.v.x == 0 && b.v.y == 0 ) a.v = vmul_scalar2( normalize2(a.v), BALL_SP_BASE );

					calcbound( a, b );

					// 埋まりを解消
					{
						let N = normalize2( vsub2(a.p,b.p) );
						let m = vmul_scalar2(N,l/2);
						a.p = vsub2( a.p, m );
						b.p = vadd2( b.p, m );
					}
				}
			}
		}


		// 速度制限
		if ( info_masterball != null )
		{
			let t = info_masterball;
			let sp = length2(t.v);
			if ( sp > BALL_SP_TOP ) 
			{
				t.v = vmul_scalar2( normalize2(t.v), BALL_SP_TOP );	//	上限制限2.5倍
			}
			if ( sp < BALL_SP_UNDER ) 
			{
				t.v = vmul_scalar2( normalize2(t.v), BALL_SP_UNDER );	//	下限制限0.5倍
			}
		}
		
	
		// draw blocks
		for ( let t of blocks )
		{
			if ( t.flg == false ) continue;

			gra.circlefill( t.p.x, t.p.y, t.r );
		}

		// draw ball
		for ( let t of balls )
		{
			if ( t.flg == false ) continue;

			// ブラーボールの表示
			function blurball( t )
			{
				let n = 2;
				let ax = t.v.x*delta/n;
				let ay = t.v.y*delta/n;
				gra.alpha(1.0/n, 'add' );
				for ( let i = 0 ; i < n ; i++ )
				{
					gra.circlefill( t.p.x-ax*i, t.p.y-ay*i, t.r );
				}
				gra.alpha(1);
			}

			if( t.flgmaster )
			{
				//ブラーボール	
				gra.color(1,1,1);
				blurball( t );
			}
			else
			{
				// ブラックボール
				if ( 1 )
				{
//					gra.color(0.5,0.5,0.5);
//					gra.circlefill( t.p.x, t.p.y, t.r );
					gra.color(1,1,1);
					gra.circle( t.p.x, t.p.y, t.r );
					gra.circle( t.p.x, t.p.y, t.r-0.25 );
					gra.circle( t.p.x, t.p.y, t.r-0.5 );
				}
				else
				{
					gra.color(1,1,1);
					gra.circle( t.p.x, t.p.y, t.r );
				}
			}
			gra.color(1,1,1);
		
			if ( flgdebug ) gra.print( Math.floor(length2(t.v)).toString(), t.p.x,t.p.y );

		}



		// draw racket 
		gra.circlefill( racket.p.x, racket.p.y, racket.r, Math.PI, Math.PI*2  );


		//draw debug
		{
			if( flgdebug )
			{
				gra.color(1,0,0);
				if ( hit_q )	gra.circle( hit_q.x, hit_q.y+1, hit_q.r );
				gra.color(1,0,0);
				if ( hit_st )	gra.line( hit_st.x, hit_st.y+1, hit_en.x, hit_en.y+1 );
			}

			if(flgdebug)
			{
				let n = 2;
				for ( let i = 0 ; i < n && i < hit_buf_ball.length; i++ )							//	ボールの軌跡
				{
					let t = hit_buf_ball[i];
					gra.color(0.0,0.7,0.7);
					gra.circle( t.p.x, t.p.y, t.r-0.5 );
					let sc = 10;
					let iv = normalize2(t.iv);
					let tv = normalize2(t.v);
					gra.color(0.7,0.7,0.7);
					gra.line( t.p.x, t.p.y, t.p.x-iv.x*sc, t.p.y-iv.y*sc );
					gra.color(1,1,0);
					gra.line( t.p.x, t.p.y, t.p.x+tv.x*sc, t.p.y+tv.y*sc );
					let deg  = Math.atan2( -tv.y ,-tv.x ) * 180 / Math.PI ;

					if ( i == 0 ) gra.print( deg, t.p.x+3, t.p.y-10 );
				}
				for ( let i = 0 ; i < n && i < hit_buf_racket.length; i++ )							//	ラケットの軌跡
				{
					let t = hit_buf_racket[i];
					gra.color(0.0,0.7,0.7);
					gra.circle( t.p.x, t.p.y, t.r, Math.PI, Math.PI*2 );
				}
			}
			gra.color(1,1,1);
		}
///		if( info_stat=='start')			gra.circlefill( BALL_X, BALL_Y, calc_r(BALL_M*info_scaleball) );
//		if( info_stat=='lostball')		gra.circlefill( info_masterball.p.x, info_masterball.p.y, info_masterball.r );

		// draw score
		{
			function putcenter( str, x, y )
			{
				x += (40 - str.length)/2;
				gra.locate(x,y);gra.print( str );
			}
			function putright( str, x, y )
			{
				x += (40 - str.length);
				gra.locate(x,y);gra.print( str );
			}
						
			gra.window( 0,0,html_canvas.width,html_canvas.height);
			gra.locate(1,0);
			gra.print("SCORE "+("0000"+info_score.toString()).substr(-4));
			putcenter( "STAGE "+info_stage.toString() ,0,0 );
			putright( "BALLS "+info_stockballs.toString(), -1,0 );

		
			switch(info_stat)
			{
				case 'start':		putcenter( 'Click to service', 0, 16 );	break;
				case 'ingame':												break;
				case 'gameover':
								putcenter( 'GAME OVER', 0, 16 );	//	break;
							if ( g_highscore == info_score && g_highscore>0 )
							{
								putcenter( 'Recorded a high score!!!', 0, 17 );
							}
							putcenter( 'high score '+("0000"+g_highscore.toString()).substr(-4), 0, 18 );

										break;

				case 'lostball':	putcenter( 'LOST BALL' , 0, 16 );		break;
				default:			putcenter( 'error stat' , 0, 16 );		break;
				
			}
			
		}

		// 情報表示
		if ( flgdebug )
		{
			gra.window( 0,0,html_canvas.width,html_canvas.height);
			let K=0;
			for ( let t of balls )	
			{
				if ( t.flg == false ) continue;

				let k = 1/2*t.m*dot2(t.v,t.v);
				K+=k;
			}
			gra.print( "K="+ K,0,html_canvas.height-16 );
			//gra.print( 1/delta +"fps",html_canvas.width-50,html_canvas.height-16 );
		}
		g_prev_x	= racket.p.x;

	}
	//-------------------------------------------------------------------------
	function update()
	//-------------------------------------------------------------------------
	{
		if ( 1 )
		{
			// 描画書き換えが同期していて綺麗。ゲーム用
			frame_update( 1/60 );
			g_hdlRequest = window.requestAnimationFrame( update );	
		}
		else
		{
			// 1/60 以上の更新が可能。シミュレーション用
			let delta = 1/60;
			frame_update( delta );
			g_hdlTimeout = setTimeout( update, delta*1000 );
		}
	}
	update();
}
//-----------------------------------------------------------------------------
function tst_create()
//-----------------------------------------------------------------------------
{
	let tst = {}

	document.addEventListener('touchmove', function(e) {e.preventDefault();}, {passive: false}); // 指ドラッグスクロールの抑制

	let m_fullscreen_original_width;
	let m_fullscreen_original_height;

	//-----------------------------------------------------------------------------
	tst.fullscreeen_change = function( cv,cb )
	//-----------------------------------------------------------------------------
	{
		if( 	window.document.fullscreenEnabled
			||	document.documentElement.webkitRequestFullScreen ) // iOS対応
		{
			m_fullscreen_original_width = cv.width;
			m_fullscreen_original_height = cv.height;
			cv.width = window.screen.width;
			cv.height = window.screen.height;

			if ( window.orientation ) // iOS用、縦横検出
			{
				if( window.orientation == 90 || window.orientation == -90 )
				{
					cv.width = window.screen.height;
					cv.height = window.screen.width;
				}
			}
		//	gra = create_gra_webgl( cv.getContext( "webgl", { antialias: true } ) );	// 画面再設定
			{
				let obj =	cv.requestFullscreen 
						||	cv.webkitRequestFullScreen;

				obj.call( cv );
			}

			function callback()
			{
				if (	window.document.fullscreenElement
					||	window.document.webkitFullscreenElement )
				{
					// フルスクリーンへ突入時
//					window.document.getElementById("html_debug1").innerHTML = window.orientation;
//					window.document.getElementById("html_debug2").innerHTML = window.screen.width+","+window.screen.height;
				}
				else
				{
					// フルスクリーンから戻り時
					cv.width = m_fullscreen_original_width;
					cv.height = m_fullscreen_original_height;
//					gra = create_gra_webgl( cv.getContext( "webgl", { antialias: true } ) );	// 画面再設定
				}
				cb(); // 画面モード再設定
			}
			window.document.addEventListener("fullscreenchange", callback, false);
			window.document.addEventListener("webkitfullscreenchange", callback, false);
		}
		else
		{
			alert("フルスクリーンに対応していません");
		}
	}
	return tst;
}
let tst = tst_create();

//-----------------------------------------------------------------------------
function html_onchange( valRequest )
//-----------------------------------------------------------------------------
{
	if ( valRequest == 'info' )
	{
	}
	else
	if( valRequest == "fullscreen" )
	{
		tst.fullscreeen_change( html_canvas, function()
		{
//			gra = create_gra_webgl( html_canvas.getContext( "webgl", { antialias: true } ) );	// 画面再設定
		});

	}
	else
	{
		g_stage = valRequest;
		main();
	}
}
//-----------------------------------------------------------------------------
window.onload = function()
//-----------------------------------------------------------------------------
{

	// htmlのhtml_stage/checked設定を読み込んで実行
	{
		var list = document.getElementsByName( "html_stage" ) ;
		for ( let l of list ) if ( l.checked ) l.onchange();
	}
console.log(window.document.getElementsByName( "html_debug" )[0].checked);
	main();
}
// HTML/マウス/キーボード制御


document.onmousedown = mousemovedown;
document.onmousemove = mousemovedown;
let g_hdlClick = null;	// マウスクリックのチャタリング防止用
let g_inter = false;
//-----------------------------------------------------------------------------
function mousemovedown(e)
//-----------------------------------------------------------------------------
{
//	if ( e.buttons==2 ) main(); // リセット
	if ( e.buttons==1 )
	{
	    var rect = html_canvas.getBoundingClientRect();
        let x= (e.clientX - rect.left)/ html_canvas.width;
        let y= (e.clientY - rect.top)/ html_canvas.height;
		if ( x > 0 && x < 1 && y >0 && y < 1 )
		{
			if ( g_inter == false ) //  チャタリング防止 ms間連続クリックの禁止
			{
				g_req = 'req_next';
				g_inter = true;
				g_hdlClick = setTimeout( function(){g_inter = false;}, 300 ); // チャタリング防止 ms間連続クリックの禁止
			}
		}
	}
	{
	    var rect = html_canvas.getBoundingClientRect();
        let x= (e.clientX - rect.left)/ html_canvas.width *g_reso_x;
		racket.p.x = x;
	}

	//test
	{
	    var rect = html_canvas.getBoundingClientRect();
        let x= (e.clientX - rect.left)/ html_canvas.width *g_reso_x;
        let y= (e.clientY - rect.top )/ html_canvas.height *g_reso_y
		tst_x = x;
		tst_y = y;
	}

}

//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	const	KEY_TAB	= 9;
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

	if ( c == KEY_R ) main();
}

// 右クリックでのコンテキストメニューを抑制
document.addEventListener('contextmenu', contextmenu);
function contextmenu(e) 
{
  e.preventDefault();
}