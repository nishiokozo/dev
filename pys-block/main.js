"use strict";

let g_hdlRequest = null;
let g_hdlTimeout = null;
let g_valRequest = 'normal';
let g_reso_x = 192;
let g_reso_y = 192;
let g_req = '';
let racket = {p:{x:g_reso_x/2,y:186},v:{x:0,y:0},r:16, m:1.2};
let first = 1;
let count = 1;

let hit_ball;
let hit_racket;
let hit_racket1;
let hit_buf_ball = [];
let hit_buf_racket = [];

//let hit_b0={};
//let hit_b={};
//let hit_r={};
let hit_q={};
let hit_st={};
let hit_en={};


let tst_x=0;
let tst_y=0;


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

//-----------------------------------------------------------------------------
function main()
//-----------------------------------------------------------------------------
{
	// 初期化
	if ( g_hdlRequest ) window.cancelAnimationFrame( g_hdlRequest ); // main呼び出しで多重化を防ぐ
	if ( g_hdlTimeout ) clearTimeout( g_hdlTimeout 	);	 // main呼び出しで多重化を防ぐ
	let gra = gra_create( html_canvas );
	first = 1;
	count = 1;
//	g_prev0_x = 99999;

	let info_stat = 'start';
	let info_masterball = null;
	let info_stockballs = 30;
	let info_score = 0;
	let info_stage = 1;
	let info_activeblocks = 0;
	let info_activeballs = 0;

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
	

	const BALLM = 0.14;

	let balls_prev = [];
	let balls = [];
	let blocks = [];
		
	// ボール生成
	function create_ball( px, py, m, speed, th= radians(45) )
	{
		// 初速ベクトル
		let vx = speed*Math.cos(th);
		let vy = speed*Math.sin(th);

		// 質量に応じた面積に設定
		let r = function()
		{
			let r0 = 10;	// 基準半径
			let m0 = 1;		// 基準質量
			let range = r0*r0*3.14 / m0;	// 質量比率
			return Math.sqrt(range * m/3.14);
		}();

		balls.push({flgmaster:false, p:vec2(px, py),v:vec2(vx, vy),m:m	,r:r, flg:true, prev1:{p:vec2(0, 0)}, prev2:{p:vec2(0, 0)} });
		return balls[balls.length-1];

	}

	function init_stage( type )
	{

		// ボールクリーンナップ
		{
			let tmp = [];
			for ( let t of balls )
			{
				if ( t.flg == false ) continue; 

				if ( length2(t.v) > 0 && length2(t.v)>100 )
				{
					t.v  = vmul_scalar2( normalize2(t.v), 100 ); // クリア時に早すぎるボールを一旦速度を落とす。
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
					let r = 8;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 0 ; j < 1 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+32;
						blocks.push({p:vec2(x, y),r:r, flg:true});
					}
//					create_ball( g_reso_x/2, 124, BALLM, 0 );
//					create_ball( g_reso_x/2, 124, BALLM, 0 );
					create_ball( 150, 120, BALLM*2, 40, radians(180) );
					create_ball( 20, 120, BALLM*3, 10, radians(180) );
				}
				break;

			case 'normal':	// ノーマル
				{
					let r = 8;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+32;
						blocks.push({p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2, 20, BALLM, 0 );
					create_ball( g_reso_x/2, 120, BALLM, 0 );
				}
				break;

			case 'mitu':	// ノーマル
				{
					let r = 5;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 0 ; j < 5 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+32;
						blocks.push({p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2, 20, BALLM, 0 );
					create_ball( g_reso_x/2, 120, BALLM, 0 );
				}
				break;

			case 'super':	// +2ball
				{
					let r = 8;
					let st = 17;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+32;
						blocks.push({p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2-48, 20, BALLM, 0 );
					create_ball( g_reso_x/2+48, 20, BALLM, 0 );
				}
				break;

			case 'dot':	// 
				{
					let r = 1;
					let st = 16;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;
					for ( let j = 0 ; j < 5 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+32;
						blocks.push({p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2, 20, BALLM*5, 0 );
				}
				break;

			case 'hex':	
				{
					let r = 7;
					let st = 15;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;
					for ( let j = 0 ; j < 5 ; j++ )
					{
						if ( j%2 == 0 ) 
						{
							ax = (g_reso_x-w*st);
						}
						else
						{
							ax = (g_reso_x-w*st)+st/2;
						}
					
						for ( let i = 0 ; i < w ; i++ )
						{
							let x = i * st+ax;
							let y = j * st*0.85+32;
							blocks.push({p:vec2(x, y),r:r, flg:true});
						}
					}
					create_ball( g_reso_x/2, 16, BALLM, 0 );
				}
				break;
		}
	}

	init_stage( g_valRequest );

	racket.r = function( m )
			{
				let r0 = 10;	// 基準半径
				let m0 = 1;		// 基準質量
				let range = r0*r0*3.14 / m0;	// 質量比率
				return Math.sqrt(range * m/3.14);
			}( racket.m );

	//-------------------------------------------------------------------------
	function frame_update( delta )
	//-------------------------------------------------------------------------
	{
		let flginfo = (document.getElementsByName( "html_info" )
					&& document.getElementsByName( "html_info" )[0]
					&& document.getElementsByName( "html_info" )[0].checked );

		gra.backcolor(0,0,0);
		gra.color(1,1,1);
		gra.cls();
		gra.window( 0,0,g_reso_x,g_reso_y );


		// count active balls 
		{
			info_activeballs=0;
			for ( let t of balls )
			{
				if ( t.flg == false ) continue;
				if ( t.v.x == 0 && t.v.y == 0 ) continue;
				
				info_activeballs++;
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

		// change stat
		if ( info_masterball == null || info_masterball.flg == false )
		{
			if ( info_stockballs > 0 )
			{
				info_stat = 'start';
			}
			else
			{
				info_stat = 'gameover';	// ゲームオーバー
			}
		}
		else
		if ( info_activeballs == 0 )
		{
			if ( info_stockballs > 0 )
			{
				info_stat = 'start';
			}
			else
			{
				info_stat = 'gameover';	// ゲームオーバー
			}
		}
		
		// exec request
		if ( g_req == 'service' )		// サービス
		{
			g_req=''
			if ( info_stat == 'start' )
			{
				if ( info_stockballs > 0 ) 
				{
					console.log('service');
					info_masterball = create_ball( g_reso_x/2-50, 110, BALLM*1, 100, radians(45) );
					info_masterball.flgmaster = true;
					info_stockballs--;
					info_stat = 'ingame';

					hit_st = {};
					hit_en = {};
					//hit_b0 = {};
					//hit_b = {};
					//hit_r = {};
					hit_q = {};

					hit_buf_ball = [];
					hit_buf_racket = [];

				}
			}
		}

		// check clear
		if ( info_activeblocks <= 0 )
		{
			info_stage++;
			init_stage( g_valRequest );
		}

		// move ball
		for ( let t of balls )
		{
			if ( t.flg == false ) continue;

				t.prev2.p.x = t.prev1.p.x;
				t.prev2.p.y = t.prev1.p.y;
				t.prev1.p.x = t.p.x;
				t.prev1.p.y = t.p.y;

			t.p.x = t.p.x + t.v.x * delta
			t.p.y = t.p.y + t.v.y * delta
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
		racket.v.x = (racket.p.x- g_prev1_x)*60; // ラケットの移動量から速度を逆算

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
					if ( Math.abs(t.v.y) < 20 ) 			//	y軸下限0.2倍
					{
						t.v.y = t.v.y/Math.abs(t.v.y)*20;
					}
				}

	 		}
			if ( px > wr )
			{
				t.p.x += (wr-px)*2;
	 			t.v.x = -t.v.x;
				if ( t.flgmaster )
				{
					if ( Math.abs(t.v.y) < 20 ) 			//	y軸下限0.2倍
					{
						t.v.y = t.v.y/Math.abs(t.v.y)*20;
					}
				}
	 		}

			if ( py < wt )
			{
				t.p.y += (wt-py)*2;
	 			t.v.y = -t.v.y;
				if ( t.flgmaster ) 
				{
					t.v  = vmul_scalar2( t.v, 1.1 ); // 天井に当たるたび10%増し
					//t.flgHi = true;
				}
	 		}
			if ( py > wb )
			{
				// ロストボール
				t.flg = false;
	 		}
		}
		
		// 

		// 当たりチェック
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


		function vimpact2( I, N )
		{
			let d = dot2( I, N );
			return vec2( N.x*d, N.y*d );
		}

		function calcbound( a, b ) // .v .p .m
		{
			// ボール同士の衝突

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
					function coll( b, t )
					{
						let ix= b.v.x;
						let iy= b.v.y;
						{
							let s = length2( b.v );
							calcbound( t, b );
							b.v = vmul_scalar2( normalize2(b.v), s );
							racket.v.y = 0;
							racket.p.y = 186;
						}

						// 埋まりを解消
						{
							let l = chkhit( t, b )
							let N = normalize2( vsub2(t.p,b.p) );
							let m = vmul_scalar2(N,l);
							b.p = vadd2( b.p, m );
						}

						{// 速度コントロール
							let sp = length2(b.v);
							if ( sp > 0 && sp < 100 ) 
							{
								b.v = vmul_scalar2( normalize2(b.v), 100/(b.m/BALLM) );	//	下限制限
							}
						}

						hit_buf_racket.unshift({p:{x:t.p.x,y:t.p.y},r:t.r});
						hit_buf_ball.unshift({p:{x:b.p.x, y:b.p.y},r:b.r,iv:{x:ix, y:iy},v:{x:b.v.x, y:b.v.y}});
						hit_racket1 = {p:{x:g_prev1_x,y:t.p.y},r:t.r};
						hit_racket 	= {p:{x:t.p.x,y:t.p.y},r:t.r};
						hit_ball 	= {p:{x:b.p.x,y:b.p.y},r:b.r};

					}
							// collition to racket
		if ( info_stat == 'ingame' )
		{
			let a = racket;
			for ( let b of balls )
			{
				if ( b.flg == false ) continue;

				let P0 = racket.p;
				let P1 = vec2( g_prev1_x,racket.p.y);
				let P2 = b.p;
				let r = b.r+racket.r;

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

					//hit_b0.x = b.prev1.p.x;	// 1フレーム前のボールの位置
					//hit_b0.y = b.prev1.p.y;	// 1フレーム前のボールの位置
					//hit_b0.r = b.r;

					//hit_b.x = b.p.x;		// 現在のボールの位置
					//hit_b.y = b.p.y;
					//hit_b.r = b.r;

					//hit_r.x = X.x			// 計算上の衝突したときのラケットの位置
					//hit_r.y = X.y;
					//hit_r.r = racket.r;

					hit_q.x = Q.x
					hit_q.y = Q.y;
					hit_q.r = 1;

					let t = {p:{x:X.x,y:X.y},r:racket.r};
					t.v = racket.v;
					t.m = racket.m;
//					let l = chkhit(b,t);
					coll( b,t )

				}
				else 
				{
					let t = a;
					let l = chkhit(b,t);
					if ( l<0 )
					{
						coll( b,t )//
/*
						let ix= b.v.x;
						let iy= b.v.y;
						{
							let s = length2( b.v );
							calcbound( t, b );
							b.v = vmul_scalar2( normalize2(b.v), s );
							racket.v.y = 0;
							racket.p.y = 186;
						}

						// 埋まりを解消
						{
							let N = normalize2( vsub2(t.p,b.p) );
							let m = vmul_scalar2(N,l);
							b.p = vadd2( b.p, m );
						}

						{// 速度コントロール
							let sp = length2(b.v);
							if ( sp > 0 && sp < 100 ) 
							{
								b.v = vmul_scalar2( normalize2(b.v), 100/(b.m/BALLM) );	//	下限制限
							}
						}

						hit_buf_racket.unshift({p:{x:t.p.x,y:t.p.y},r:t.r});
						hit_buf_ball.unshift({p:{x:b.p.x, y:b.p.y},r:b.r,iv:{x:ix, y:iy},v:{x:b.v.x, y:b.v.y}});
						hit_racket1 = {p:{x:g_prev1_x,y:t.p.y},r:t.r};
						hit_racket = {p:{x:t.p.x,y:t.p.y},r:t.r};
						hit_ball = {p:{x:b.p.x,y:b.p.y},r:b.r};
*/
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

					if ( a.v.x == 0 && a.v.y == 0 ) b.v = vmul_scalar2( normalize2(b.v), 120 );
					if ( b.v.x == 0 && b.v.y == 0 ) a.v = vmul_scalar2( normalize2(a.v), 120 );

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
			if ( sp > 250 ) 
			{
			//	t.v = vmul_scalar2( normalize2(t.v), 250 );	//	上限制限2.5倍
			}
			if ( sp < 50 ) 
			{
				t.v = vmul_scalar2( normalize2(t.v), 50 );	//	下限制限0.5倍
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

			if( t.flgmaster )
			{//ブラーボール	
				gra.color(1,1,1);
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
			else
			{
				// ブラックボール
				gra.circle( t.prev1.p.x, t.prev1.p.y, t.r );
			}
		
			if ( flginfo ) gra.print( Math.floor(length2(t.v)).toString(), t.p.x,t.p.y );

		}

		//draw test

		{
			if( flginfo )
			{
				gra.color(0.5,0.5,0);
		//		if ( hit_b0 )	gra.circle( hit_b0.x, hit_b0.y, hit_b0.r );
				gra.color(1,0,0);
//				if ( hit_b )	gra.circle( hit_b.x, hit_b.y, hit_b.r );
//				if ( hit_r )	gra.circle( hit_r.x, hit_r.y, hit_r.r, Math.PI, Math.PI*2 );
		//		if ( hit_q )	gra.line( hit_q.x, hit_q.y, hit_b.x, hit_b.y );
				if ( hit_q )	gra.circle( hit_q.x, hit_q.y+1, hit_q.r );
				gra.color(1,0,0);
				if ( hit_st )	gra.line( hit_st.x, hit_st.y+1, hit_en.x, hit_en.y+1 );
//				if ( hit_st )	gra.line( hit_st.x, hit_st.y+1, hit_st.x, hit_st.y-hit_r.r );
//				if ( hit_en )	gra.line( hit_en.x, hit_en.y+1, hit_en.x, hit_en.y-hit_r.r );
//				if ( hit_st )	gra.circle( hit_st.x, hit_st.y+1, hit_st.r, Math.PI, Math.PI*2 );
//				if ( hit_en )	gra.circle( hit_en.x, hit_en.y+1, hit_en.r, Math.PI, Math.PI*2 );
			}

			if(flginfo)
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
					//gra.print( t.v.y, t.p.x+3, t.p.y+6 );
					//console.log( t.v.x, t.v.y );
				}
				for ( let i = 0 ; i < n && i < hit_buf_racket.length; i++ )							//	ラケットの軌跡
				{
					let t = hit_buf_racket[i];
					gra.color(0.0,0.7,0.7);
					gra.circle( t.p.x, t.p.y, t.r, Math.PI, Math.PI*2 );
				}
			}
			gra.color(0.5,0.5,0.0);
	//		if ( hit_racket1 )	gra.circle( hit_racket1.p.x, hit_racket1.p.y, hit_racket1.r );	//	衝突時の前フレームのラケットの位置
			gra.color(1,1,0);
	//		if ( hit_racket )	gra.circle( hit_racket.p.x, hit_racket.p.y, hit_racket.r );		//	衝突時のラケットの位置
	//		if ( hit_ball )		gra.circle( hit_ball.p.x, hit_ball.p.y, hit_ball.r );			//	衝突時のボールの位置
			gra.color(1,1,1);
		}

		// draw racket 
		gra.circlefill( racket.p.x, racket.p.y, racket.r, Math.PI, Math.PI*2  );




		if( info_stat=='start')			gra.circlefill( g_reso_x/4, 110, 4.2 );

		// draw score
		{
			gra.window( 0,0,html_canvas.width,html_canvas.height);
			gra.locate(1,0);
			gra.print("SCORE "+("0000"+info_score.toString()).substr(-4));
			gra.locate(28,0);
			gra.print("STAGE "+info_stage.toString());
			gra.locate(55,0);
			gra.print("BALLS "+info_stockballs.toString());

			if(0)
			{
				gra.locate(20,1);
				gra.print("blk "+blocks.length );
				gra.print("bal "+balls.length );

				let cnt = 0;
				for ( let t of balls )	
				{
					if (t.flg) cnt++;
				}
				gra.print("balc"+cnt );
			}

			switch(info_stat)
			{
				case 'start':		gra.locate(24,14);gra.print( 'click to service' );

					break;

				case 'ingame':		break;
				case 'gameover':	gra.locate(27,14);gra.print( 'GAME OVER');break;
				
			}
			
		}

		// 情報表示
		if ( flginfo )
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
			gra.print( 1/delta +"fps",html_canvas.width-44,html_canvas.height-16 );
		}
			g_prev1_x	= racket.p.x;

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
		g_valRequest = valRequest;
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

	main();
}
// HTML/マウス/キーボード制御


document.onmousedown = mousemovedown;
document.onmousemove = mousemovedown;
let g_prev1_x = 0;
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
			g_req = 'service';
		}
//console.log(x,y);
	}
//console.log(e.buttons,g_req);
		//console.log(e);
		//console.log('screenX',e.screenX);	// 絶対座標
		//console.log('clientX',e.clientX);	// ウィンドウ内
		//console.log('pageX  ',e.pageX);	// ウィンドウ内
		//console.log('x      ',e.x);	// ウィンドウ内
		//console.log('offsetX',e.offsetX);	// canvas内
//	g_prev0_x	= racket.p.x;
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

//	g_prevButtons = e.buttons;
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