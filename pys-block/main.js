"use strict";


//-----------------------------------------------------------------------------
function bo_create()
//-----------------------------------------------------------------------------
{
	let bo = {};

	// public
	bo.req = '';
	bo.key=Array(256);
	bo.game;
	bo.hdlRequest = null;
	bo.reso_x = 360;
	bo.reso_y = 360;
	bo.mouse_x;
	bo.mouse_click;
	bo.tst_x=0;
	bo.tst_y=0;
	bo.inter = false;
	bo.se;
	bo.hdlClick = null;	// マウスクリックのチャタリング防止用
	// public


	let m_hdlTimeout = null;
	let first = 1;
	let count = 1;
	let m_highscore = 
	{
		multi:100,
	//	super:1,
	//	mitu:1,
	//	wild:1,
	//	special:1,
	//	atom:1,
	//	heavy:1,
		dot:100,
	//	hex:1,
	//	bio:1,
		moves:100,
	};

	const BALL_SP_BASE	= 160;	//	基準になるボールの速度。平均的にゲームに快適な速度
	const BALL_SP_MAX	= 500;	//	ゲーム性の限界の速度 ※天井加速の閾値なので、運動量交換でこれ以上はあり得る。マウスだと500,パッドだと400,キーだともう少し下にしたい所だけどマウス基準にしておく。
	const BALL_SP_Y		= 20;	//	殆ど真横でバウンドし続けるのを抑制するための、Y軸移動量下限値
	const BALL_SP_CEIL	= 1.1;	//	天井に当たったときの加速率
	const BALL_1UP		= 100;	// 100回ボールを打つたびに1up
	const BALL_M = 0.8;
	const BALL_X = bo.reso_x/2-100;
	const BALL_Y = 212;
	const RACKET_Y=bo.reso_y-8;
	const RACKET_M=2;
	const RACKET_MIN=1.0;
	const BLOCK_Y=64;
	const BLOCK_R=14+3;

	let gra;

	let hit_buf_ball = [];
	let hit_buf_racket = [];
	let hit_q={};
	let hit_st={};
	let hit_en={};

	let fs = fullscreen_create();

	let racket;


	
	// 初期化
	if ( bo.hdlRequest ) window.cancelAnimationFrame( bo.hdlRequest ); // bo_create呼び出しで多重化を防ぐ
	if ( m_hdlTimeout ) clearTimeout( m_hdlTimeout 	);	 // bo_create呼び出しで多重化を防ぐ
	if ( bo.hdlClick ) clearTimeout( bo.hdlClick 	);	 // bo_create呼び出しで多重化を防ぐ
	gra = gra_create( html_canvas );
	first = 1;
	count = 1;
	bo.mouse_x = 0;
	bo.mouse_click = false;

	//---
	let info_flg_mouseinput = false;
	let info_pause;
	let info_stat;
	let info_timerlost;
	let info_stockballs;
	let info_score;
	let info_cntStage;
	let info_activeblocks;
	let info_activeballs;
	let info_scaleball;
	let info_cntServe;
	let info_cntRally = 0;
	let balls = [];
	let blocks = [];
//	let prev_x;
	let pad;

	let info_mouseslowtime = 0;

	// メモ＞
	// 時間:o(s)
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
	

	//-----------------------------------------------------------------------------
	function calc_r( m )	// 質量に応じた面積の半径を返す関数
	//-----------------------------------------------------------------------------
	{
	
		let r0 = 10;	// 基準半径
		let m0 = 1;		// 基準質量
		let range = r0*r0*3.14 / m0;	// 質量比率
		return Math.sqrt(range * m/3.14);
	}

	//-----------------------------------------------------------------------------
	function create_ball( typ='bal:nml',px, py, m, speed, th= radians(45) )	// ボール生成関数
	//-----------------------------------------------------------------------------
	{
		// 初速ベクトル
		let vx = speed*Math.cos(th);
		let vy = speed*Math.sin(th);

		let r = calc_r( m );
		if ( r < 0 ) r = 1;
		balls.push({typ:typ, p:vec2(px, py),v:vec2(vx, vy),m:m ,r:r, flgActive:true, cntCnv:0 });
	}
	//-----------------------------------------------------------------------------
	function create_block( typ='blk:nml',px, py, r )
	//-----------------------------------------------------------------------------
	{
		blocks.push({typ:typ, n:1,p:vec2(px, py),r:r, flgActive:true});
	}

	// ステージ生成関数
	//-----------------------------------------------------------------------------
	function init_stage( game, info_cntStage )
	//-----------------------------------------------------------------------------
	{

		if(0)// ラケットサイズをステージが進むと小さく→ラケットを小さくしても、ボールコントロールの面白みがそがれるから没
		{
			let m = RACKET_M - (info_cntStage-1)/10;
			if ( m < RACKET_MIN ) m =  RACKET_MIN;
			racket = {p:{x:bo.reso_x/2,y:RACKET_Y},v:{x:0,y:0},a:{x:0,y:0},r:16, m:m, req_a:{x:0,y:0}};
			racket.r = calc_r( racket.m )*2; // ラケットは半円なので、半径は倍
		}

		info_scaleball = 1;
		info_cntServe = 0;

		// ボールクリーンナップ
		{
			let cnt = 0;	// 持ち越せるのは最大6個
			let tmp = [];
			for ( let b of balls )
			{
				if ( b.flgActive == false ) continue; 
				if ( ++cnt > 6 ) break;										// 持ち越しは最大六個
				if ( 'bal:hard' == b.typ ) continue;							// ブロックボールは持ち越さない

				if ( length2(b.v) > 0 && length2(b.v)>BALL_SP_BASE )
				{
					b.v  = vmul_scalar2( normalize2(b.v), BALL_SP_BASE );	// クリア時に早すぎるボールを一旦速度を落とす。
					b.cntCnv = 0;
				}
				tmp.push(b);
			}
			balls = tmp;
		}	

		// ブロック初期化
		blocks=[];
		switch( game )
		{
			case 'test':	
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(bo.reso_x / st/3);
					let ax = (bo.reso_x-w*st)/2;

					for ( let j = 0 ; j < 1 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
						create_block( 'blk:nml', x, y, r )
					}
					create_ball( 'bal:nml',bo.reso_x/2-50, BLOCK_Y+st*5, BALL_M/2, 100, radians(0) );
					create_ball( 'bal:nml',bo.reso_x/2+50, BLOCK_Y+st*5, BALL_M*2, 0 );
					create_ball( 'bal:nml',bo.reso_x/2-30, BLOCK_Y+64+32, BALL_M*Math.random()*3, 0 );
					create_ball( 'bal:nml',bo.reso_x/2   , BLOCK_Y+32+32, BALL_M*Math.random()*4, 0 );
					create_ball( 'bal:nml',bo.reso_x/2+32, BLOCK_Y+64+32, BALL_M*Math.random()*5, 0 );
				}
				break;

			case 'multi':	
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(bo.reso_x / st);
					let ax = (bo.reso_x-w*st)/2;

					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
						if ( j == 2 && ( i == 2 || i == 7 ) )
						blocks.push({typ:'blk:hard',n:1,p:vec2(x, y),r:r, flgActive:true});
						else
						blocks.push({typ:'blk:nml',n:1,p:vec2(x, y),r:r, flgActive:true});
					}
					create_ball( 'bal:nml',bo.reso_x/2, BLOCK_Y-st, BALL_M, 0 );

				}
				break;

			case 'moves':	// 
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(bo.reso_x / st);
					let ax = (bo.reso_x-w*st)/2;

					for ( let j = 0 ; j < 3 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
//						if ( j == 3 && ( i == 5 || i == 6 ) ) continue;
//						if ( j==3 || (i >2 && i < 9)) continue

						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;


						blocks.push({typ:'blk:nml',n:1,p:vec2(x, y),r:r, flgActive:true});
					}
					for ( let i = 0 ; i < info_cntStage && i < 4 ; i++ )
					{
						let a = Math.floor(Math.random()*2)*6+1;
						let m = BALL_M*a;
						
						
						m = BALL_M*4; // 小さいのがあってもあまり面白くない感じ。大きいのを一種類にする。
						create_ball( 'bal:hard',bo.reso_x/2, BLOCK_Y+st*4, m, 0 );
					}
				}
				break;

			case 'dot':	// 
				{
					let r = 2;
					let st = 29;
					let w = Math.floor(bo.reso_x / st);
					let ax = (bo.reso_x-w*st)/2;
					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
		//				blocks.push({typ:'blk:nml',n:1,p:vec2(x, y),r:r, flgActive:true});
						create_block( 'blk:nml', x, y, r )
					}
					if (0 )
					{
						create_ball( 'bal:hard',bo.reso_x/2, BLOCK_Y-16, BALL_M*3,  0, radians(0) );
						create_ball( 'bal:hard',bo.reso_x/2-50, BLOCK_Y-16, BALL_M*1.0,    0, radians(0) );
						create_ball( 'bal:hard',bo.reso_x/2+50, BLOCK_Y-16, BALL_M*0.4,  400, radians(0) );
					}
					else
					{
						create_ball( 'bal:hard',bo.reso_x/2+50, BLOCK_Y-16, BALL_M*0.4,  400, radians(0) );
						for ( let i =0 ; i < info_cntStage && i < 5 ; i++ )
						{
							let x = bo.reso_x/2-100+Math.random()*100; 
							let m = BALL_M*(Math.random()*2.7+0.3); 
							create_ball( 'bal:hard',x, BLOCK_Y-16, m,  0, radians(0) );
						}
					}
				}
				break;
	
	
			case 'super':	// +2ball
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(bo.reso_x / st);
					let ax = (bo.reso_x-w*st)/2;

					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
//						if ( (j == 1 && ( i == 2 || i == 9 ) ) 
//						||   ( j == 2 && ( i == 2 || i ==  9 ) ) )
						if ( (j == 3 && ( i == 0 || i == 11 ) ) )
						blocks.push({typ:'blk:hard',n:1,p:vec2(x, y),r:r, flgActive:true});
						else
						blocks.push({typ:'blk:nml',n:1,p:vec2(x, y),r:r, flgActive:true});
					}
					create_ball( 'bal:nml',bo.reso_x/2-16, BLOCK_Y-st, BALL_M, -50, radians(180) );
					create_ball( 'bal:nml',bo.reso_x/2+16, BLOCK_Y-st, BALL_M,  20, radians(0) );
				}
				break;
				
			case 'mitu':	// 密
				{
					let r = BLOCK_R*3/4;
					let st = r*2+1;
					let w = Math.floor(bo.reso_x / st);
					let ax = (bo.reso_x-w*st)/2;

					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
						blocks.push({typ:'blk:nml',n:1,p:vec2(x, y),r:r, flgActive:true});
					}
					create_ball( 'bal:nml',bo.reso_x/2-50, BLOCK_Y+st*5, BALL_M/2, 100, radians(0) );
					create_ball( 'bal:nml',bo.reso_x/2+50, BLOCK_Y+st*5, BALL_M*4, 0 );

				}
				break;

			case 'wild':	// 
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(bo.reso_x / st);
					let ax = (bo.reso_x-w*st)/2;

					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						if ( j == 3 && ( i == 5 || i == 6 ) ) continue;

						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;

				//		if ( j == 3 && ( i == 4 || i == 7 ) ) 
				//		blocks.push({typ:'blk:hard',n:1,p:vec2(x, y),r:r, flgActive:true});
				//		else
						blocks.push({typ:'blk:nml',n:1,p:vec2(x, y),r:r, flgActive:true});
					}
					create_ball( 'bal:nml',bo.reso_x/2, BLOCK_Y+st*4, BALL_M*6, 0 );
				}
				break;

			case 'special':	 
				{
					let r = BLOCK_R+1;
					let st = r*2+1;
					let w = Math.floor(bo.reso_x / st);
					let ax = (bo.reso_x-w*st)/2;

					for ( let j = 0 ; j < 5 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						if ( 2 == j && ( 5 == i ) ) continue;
					
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y - st;
						if ( 2 == j && ( 2 == i || 8 == i ) ) 
						blocks.push({typ:'blk:hard',n:1,p:vec2(x, y),r:r, flgActive:true});
						else
						blocks.push({typ:'blk:nml',n:1,p:vec2(x, y),r:r, flgActive:true});
					}

					for ( let i = 0 ; i<4/2 ; i++ )
					{
						let x = bo.reso_x/2-st+st/4	+st/2*i +st/2;
						let y = BLOCK_Y+st*2+st/4 - st;
						create_ball( 'bal:nml',x,y, BALL_M*0.5, 0 );
						create_ball( 'bal:nml',x,y+st/2, BALL_M*0.5, 0 );
					}
				}
				break;

			case 'atom':	// 
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(bo.reso_x / st);
					let ax = (bo.reso_x-w*st)/2;

					for ( let j = 1 ; j < 6 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st + +BLOCK_Y-st*2;
						if ( j == 3 ) continue;
						if ( j == 1 && ( i == 0 || i == 11 ) ) 
						blocks.push({typ:'blk:hard',n:1,p:vec2(x, y),r:r, flgActive:true});
						else
						blocks.push({typ:'blk:nml',n:1,p:vec2(x, y),r:r, flgActive:true});
					}

//						create_ball( 'bal:nml',bo.reso_x/2,BLOCK_Y-st-10 +50, BALL_M*0.1, 700, radians(0) );
						create_ball( 'bal:nml',bo.reso_x/2,BLOCK_Y-st    +48, BALL_M*0.1, 600, radians(180) );
						create_ball( 'bal:nml',bo.reso_x/2,BLOCK_Y-st+10 +48, BALL_M*0.1, 500, radians(0) );
						create_ball( 'bal:nml',bo.reso_x/2,BLOCK_Y-st+20 +48, BALL_M*0.1, 400, radians(180) );
//						create_ball( 'bal:nml',bo.reso_x/2,BLOCK_Y-st+30 +48, BALL_M*0.1, 300, radians(0) );
//						create_ball( 'bal:nml',bo.reso_x/2,BLOCK_Y-st+40 +48, BALL_M*0.1, 200, radians(180) );
//						create_ball( 'bal:nml',bo.reso_x/2,BLOCK_Y-st+50 +48, BALL_M*0.1, 100, radians(0) );
				}
				break;

			case 'heavy':	
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(bo.reso_x / st);
					let ax = (bo.reso_x-w*st)/2;

					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
						if ( (j == 1 && ( i == 1 || i == 10 ) ) 
						||   ( j == 2 && ( i == 3 || i ==  8 ) ) )
						blocks.push({typ:'blk:hard',n:1,p:vec2(x, y),r:r, flgActive:true});
						else
						blocks.push({typ:'blk:nml',n:1,p:vec2(x, y),r:r, flgActive:true});
					}
				//	create_ball( 'bal:nml',bo.reso_x/2, BLOCK_Y-st, BALL_M, 0 );

					info_scaleball = 4;
				}
				break;


			case 'hex':	
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(bo.reso_x / st);
					let ax = (bo.reso_x-w*st)/2+st/2;
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
					
						for ( let i = 0 ; i * st+ax+aax < bo.reso_x-st/2 ; i++ )
						{
							let x = i * st+ax+aax;
							let y = j * st*0.85+BLOCK_Y;
							if ( j == 2 && ( i == 0 || i == 10 ) ) 
							blocks.push({typ:'blk:hard',n:1,p:vec2(x, y),r:r, flgActive:true});
							else
							blocks.push({typ:'blk:nml',n:1,p:vec2(x, y),r:r, flgActive:true});
						}
					}
					create_ball( 'bal:nml',bo.reso_x/2-st*6, BLOCK_Y+st*0.85*2 , BALL_M, 0 );
					create_ball( 'bal:nml',bo.reso_x/2+st*6, BLOCK_Y+st*0.85*2 , BALL_M, 0 );
				}
				break;

			case 'bio':	// 
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let cx =bo.reso_x/2;
					let cy =bo.reso_y/2+st/4;
					let w = Math.floor(bo.reso_x / st);
					let ax = (bo.reso_x-w*st)/2+st/2;
					let aax = 0;
					for ( let j = -1 ; j < 11 ; j++ )
					{
						if ( (j+1)%2 == 1 ) 
						{
							aax = 0;
						}
						else
						{
							aax = st/2;
						}
					
						for ( let i = 0 ; i * st+ax+aax < bo.reso_x-st/2 ; i++ )
						{
							let x = i * st+ax+aax;
							let y = j * st*0.85+BLOCK_Y;

							let u = x-cx;
							let v = y-cy;
							let l = Math.sqrt(u*u+v*v);
							if ( l < st*4+st/2  ) continue;
							if ( l < st*4.7 && y < st*8 && ( j == 1 || j == 6 ) ) 
							blocks.push({typ:'blk:hard',n:1,p:vec2(x, y),r:r, flgActive:true});
							else
							blocks.push({typ:'blk:nml',n:1,p:vec2(x, y),r:r, flgActive:true});
						}
					}
					create_ball( 'bal:nml',bo.reso_x/2-32, BLOCK_Y+64+32, BALL_M*Math.random()*3, 0 );
					create_ball( 'bal:nml',bo.reso_x/2   , BLOCK_Y+32+32, BALL_M*Math.random()*4, 0 );
					create_ball( 'bal:nml',bo.reso_x/2+32, BLOCK_Y+64+32, BALL_M*Math.random()*5, 0 );
//					create_ball( 'bal:nml',bo.reso_x/2-64, BLOCK_Y+64+48, BALL_M*Math.random()*2, 0 );
//					create_ball( 'bal:nml',bo.reso_x/2   , BLOCK_Y+32+96, BALL_M*Math.random()*3, 0 );
//					create_ball( 'bal:nml',bo.reso_x/2+64, BLOCK_Y+64+48, BALL_M*Math.random()*4, 0 );

				}
				break;



			default:
				{
					blocks.push({typ:'blk:nml',p:vec2(bo.reso_x/2, bo.reso_y/2),r:20, flgActive:true});
					create_ball( 'bal:nml',bo.reso_x/2, BLOCK_Y, BALL_M, 0 );
				
					console.log("ERROR game name:"+game );
				}
				break;		
		}
	}

	//-------------------------------------------------------------------------
	bo.resetall = function()
	//-------------------------------------------------------------------------
	{
		console.log("reset");

		racket = {p:{x:bo.reso_x/2,y:RACKET_Y},v:{x:0,y:0},a:{x:0,y:0},r:16, m:RACKET_M};
		racket.r = calc_r( racket.m )*2; // ラケットは半円なので、半径は倍
//		prev_x	= racket.p.x;
		pad = pad_create();

		balls = [];
		blocks = [];
		info_flg_mouseinput = false;
		info_cntStage = 1;
		info_stockballs = 3;
		info_pause = false;
		info_stat = 'start';
		info_timerlost = 0;
		info_score = 0;
		info_activeblocks = 0;
		info_activeballs = 0;
		info_scaleball = 1;
		info_cntServe = 0;
		init_stage( bo.game, info_cntStage );

		// ハイスコアのHTMLへの反映
		for ( let id of Object.keys(m_highscore) )
		{
			document.getElementById("html_"+id).innerHTML = m_highscore[id];	// kozo
		}

		hit_st = {};
		hit_en = {};
		hit_q = {};
		hit_buf_ball = [];
		hit_buf_racket = [];

	}

	//-----------------------------------------------------------------------------
	bo.se_ring_by_name = function( name, vol=1.0, freq=1.0 )
	//-----------------------------------------------------------------------------
	{
		let f =1
		switch(name)
		{
			case 'se:service':	bo.se.play( 89,0,145,0.05,  'triangle', 0.8*vol );	break;	//se_ring([42]);break;//135,27,200,42,37
			case 'se:racket':	bo.se.play( 117,0,160/f,0.12*f,  'triangle', 0.8*vol );	break;	//se_ring([100]);break;	//242,100
			case 'se:lost':		bo.se.play( 177,0.1,71,0.67,  'sawtooth', 0.1*vol );	break;	//se_ring([262]);break;//,263
			case 'se:lost2':		bo.se.play( 177,0.0,71,0.27,  'sawtooth', 0.08*vol );	break;	//se_ring([262]);break;//,263
			case 'se:wall':		bo.se.play( 19,0.03,269,0.05,  'triangle', 0.4*vol );	break;	//se_ring([37]);break;//37,171,241,257,223,113
			case 'se:ceil':		bo.se.play( 19,0.03,106,0.4,  'triangle', 0.8*vol );	break;		//se_ring([193]);break;//,
	//		case 'se:ceil':		bo.se.play( 2871,0.00,106,0.37,  'square', 0.08*vol );	break;		//se_ring([193]);break;//,
			case 'se:uzu':		bo.se.play(  574,0.08,286,0.12,  'triangle', 0.25*vol );	break;		//se_ring([24]);break;//24,40,248,116,28,31,61
	//		case 'se:break':	bo.se.play( 330,0.02,440,0.08,  'square', 0.08*vol );	break;		//se_ring([24]);break;//24,40,248,116,28,31,61
	//		case 'se:break':		bo.se.play( 486,0.02,729,0.08,  'triangle', 0.20*vol );	break;		//se_ring([24]);break;//24,40,248,116,28,31,61
			case 'se:break':		bo.se.play( 384,0.04,768,0.06,  'triangle', 0.30*vol );	break;		//se_ring([24]);break;//24,40,248,116,28,31,61
	//		case 'se:hard':		bo.se.play( 486,0.02,972,0.06,  'square', 0.10*vol );	break;		//se_ring([24]);break;//24,40,248,116,28,31,61
	//		case 'se:hard':	bo.se.play( 1517,0.01,160,0.0,  'triangle', 0.4*vol );	break;	//se_ring([100]);break;	//242,100
	//		case 'se:toball':	bo.se.play(  659,0.0,231,0.137,  'square', 0.1*vol );	break;		//se_ring([115]);break;//57,26,58,81,127,,213,26
			case 'se:toball':	bo.se.play( 160,0.01,1917/3,0.02*3,  'triangle', 0.4*vol );	break;	//se_ring([100]);break;	//242,100
			case 'se:toball2':	bo.se.play( 160,0.01,1917/2,0.02*3,  'triangle', 0.2*vol );	break;	//se_ring([100]);break;	//242,100
//			case 'se:toball2':	bo.se.play( 2800,0.025,3200,0.2,  'sine', 0.0841*vol );break;
//			case 'se:toblock':	bo.se.play( 160,0.01,1917/6,0.02*3,  'triangle', 0.1*vol );	break;	//se_ring([100]);break;	//242,100
//			case 'se:hard':	bo.se.play(  659,0.0,231,0.137,  'square', 0.1*vol );	break;		//se_ring([115]);break;//57,26,58,81,127,,213,26
			case 'se:1up':	bo.se.play( 792,0.140,672,0.82,  'sine', 0.3*vol );break;
//			case 'se:clear':	bo.se.play( 4200,0.0,3200,0.1,  'square', 0.3*vol );break;
			case 'se:clear':	bo.se.play( 2000,0.05,2000,0.04,  'sine', 0.2*vol );	break;	//se_ring([100]);break;	//242,100
			case 'se:highscore':	bo.se.play( 872,0.05,972,1.3,  'sine', 0.2*vol );	break;		//se_ring([132]);break;//,156,98,158,118,132
			case 'se:gameover':	bo.se.play( 199,0.19,95,0.855,  'sine', 0.6*vol );	break;	//se_ring([139]);break;//183,47
			default:
				console.log("no se:"+name);
		}
	}


	bo.se = se_create();

	
	//-------------------------------------------------------------------------
	bo.frame_update = function( delta )
	//-------------------------------------------------------------------------
	{
		gra.window( 0,0,bo.reso_x,bo.reso_y );
		gra.backcolor(0,0,0);
		gra.color(1,1,1);
		gra.cls();
		// 物理演算をそのまま適用した場合のゲーム上の問題
		// ①ラケットを高速移動させると衝突後ボールが速くなりすぎる問題
		// ②マスターボールが遅くなりすぎる問題
		// ③マスターボールが水平に反射し落ちてこない問題
		// ④マスターボールを高速で打ち返してもゲーム難易度を上げるだけの問題
		// ⑤マスターボールが天井スタートの時速くなりすぎて打ち返せなくなる問題
		//
	
		let flgdebug = (document.getElementsByName( "html_debug" )
					&& document.getElementsByName( "html_debug" )[0]
					&& document.getElementsByName( "html_debug" )[0].checked );


		if ( 'pause' == bo.req )
		{
			bo.req ='';
			if ( info_stat=='ingame' ) 
			{
				info_pause = !info_pause;
			}
		}
		if ( bo.req == 'fullscreen' )
		{
			bo.req ='';
			if ( fs.flgFullscreen == false ) 
			{
				fs.fullscreeen_change( html_canvas, function()
				{
					gra = gra_create( html_canvas );
				});		
			}
		}
		if ( bo.req == 'reset' )
		{
			bo.req ='';
			bo.resetall();
		}


		function gra_cvx( mx ) // canvas座標系のxをgra.window()座標系に変換する
		{
			let wx = html_canvas.height*bo.reso_x/bo.reso_y; 
			let ad = (html_canvas.width-wx)/2;
			return (mx-ad)/wx*bo.reso_x;
		}

		pad.getinfo();


			if ( flgdebug &&  bo.key[KEY_N] ) // 強制クリア
			{
				bo.key[KEY_N] = 0;
				for ( let o of blocks )
				{
					if ( o.flgActive == false ) continue;
					if ( o.typ == 'blk:hard' ) continue;
					o.flgActive = false;
				}

			}

		// input serve 
		if ( info_stat == 'serve' || info_stat == 'gameover' )
		{

			if ( bo.mouse_click )	// mouse
			{
				bo.req = 'req_next';
				bo.mouse_click = false;
				info_flg_mouseinput = true;
			}
			else
			if ( bo.key[KEY_SPC] )	// key
			{
				bo.req = 'req_next';
				info_flg_mouseinput = false;
			}
			else
			if ( pad.trig.a ) 
			{
				bo.req = 'req_next';	// game pad
				info_flg_mouseinput = false;
			}
		}



		if ( info_flg_mouseinput )
		{// input mouse


			let x = gra_cvx(bo.mouse_x);
			if ( x < racket.r ) x = racket.r;
			if ( x > bo.reso_x-racket.r ) x = bo.reso_x-racket.r;


			let s = (x-racket.p.x);

			if ( info_mouseslowtime > 0 )
			{
				info_mouseslowtime -= delta;
				s /= 4;
			}

			{
				let v = racket.v.x;					// 
				let t = delta;						// 
				let a = (s-v*t)/(t*t);			//
				racket.a.x += a;
			}
		
		}
		else
		{ 
			{	// input key
				let s = 0;
				if ( flgdebug && bo.key[KEY_CR] ) 
				{
					bo.key[KEY_CR] = 0;
					let r = BLOCK_R;
					let st = r*2+1;
					create_ball( 'bal:hard',bo.reso_x/2, BLOCK_Y+st*4, BALL_M*6, 0 );
				}
				if ( bo.key[KEY_P] ) 
				{
					bo.req='pause';
					bo.key[KEY_P] = false;
				}
				if ( bo.key[KEY_RIGHT] ) 
				{
					s = bo.reso_x*1.5;

				}
				if ( bo.key[KEY_LEFT] ) 
				{
					s = -bo.reso_x*1.5;
				}
				{
					let v = racket.v.x;					// 
					let t = delta*20;						// 
					let a = (s-v*t)/(t*t);			//
					racket.a.x += a;
				}
			}

			{// pad

				{// input pad

					if ( pad.l1 && pad.trig.st ) {bo.req='reset';}
					else
					if ( pad.trig.se ) 	document.getElementsByName( "html_debug" )[0].checked = !document.getElementsByName( "html_debug" )[0].checked;
					else
					if ( pad.trig.st ) {bo.req='pause';}

				}

				let mx = (pad.rx+pad.lx);		// 入力値(-1~+1) 

				let s = mx*bo.reso_x;

				{
					let v = racket.v.x;					// 
					let t = delta*20;						// 
					let a = (s-v*t)/(t*t);			//
					racket.a.x += a;
				}
			}
		}
				// raket y accel
		{
			let s = (RACKET_Y-racket.p.y);
			let v = racket.v.y;					// 
			let t = delta*4;						// 
			let a = (s-v*t)/(t*t);			//

			racket.a.y += a;
		}


		if ( info_pause == false )
		{
			// exec request
			if ( info_stat == 'gameover' )
			{
				if ( bo.req == 'req_next' )
				{
					bo.req='reset';
				}

			}
			if ( info_stat == 'lostball' )
			{
				info_timerlost += delta;
				if ( info_timerlost >= 1.0 )
				{
					if ( info_stockballs > 0 )
					{
						info_stat = 'start';
					}
					else
					{
						if ( info_score > m_highscore[ bo.game ] )
						{
							bo.se_ring_by_name("se:highscore");
							m_highscore[ bo.game ] = info_score;
						}
						else
						{
							bo.se_ring_by_name("se:gameover");
						}
						info_stat = 'gameover';	// ゲームオーバー
					}

				}
			}

			if ( info_stat == 'result' )
			{
				if ( bo.req == 'req_next' )
				{
					bo.req='';
					info_stat = 'start';
				}
			}

			//1up exec
			{
			}

			// count active blocks 
			{
				info_activeblocks=0;
				for ( let o of blocks )
				{
					if ( o.flgActive == false ) continue;
					if ( o.typ == 'blk:hard' ) continue;
					
					info_activeblocks++;
				}
				
			}

			// count active balls 
			{
				info_activeballs=0;
				for ( let b of balls )
				{
					if ( b.flgActive == false ) continue;
					if ( b.typ == 'bal:hard' ) continue;
					if ( b.v.x ==0 && b.v.y == 0  ) continue;
					
					info_activeballs++;
				}
				
			}

			// ボール生成
			if( info_stat=='start')
			{
				let sp = BALL_SP_BASE*0.75 + info_cntServe*BALL_SP_BASE*0.3;
				create_ball( 'bal:nml',BALL_X, BALL_Y, BALL_M*info_scaleball, sp, radians(45) );
//				create_ball( 'bal:nml',BALL_X, 10, BALL_M*info_scaleball, sp, radians(45) );
				info_stat = 'serve';
				info_cntServe++;
			}

			// サーブ
			if ( bo.req == 'req_next' )
			{
				bo.req=''
				if ( info_stat == 'serve' )
				{
					bo.se_ring_by_name("se:service");
					//console.log('control by ',info_flg_mouseinput?'mouse only':'key or pad');

					console.log('service');
					info_stat = 'ingame';

					hit_st = {};
					hit_en = {};
					hit_q = {};
					hit_buf_ball = [];
					hit_buf_racket = [];
				}
			}

			// check clear
			if ( info_activeblocks <= 0 )
			{
				info_cntStage++;
				//bo.se_ring_by_name("se:clear"); // →クリア音と最後のブロックの破壊音重なっていまいちなのでなくす。
				init_stage( bo.game, info_cntStage );
			}


			// accel racket
			{
				racket.v.x += racket.a.x *delta;
				racket.v.y += racket.a.y *delta;
				racket.a.x = 0;
				racket.a.y = 0;
			}
		
			// move racket
			{
				let o = racket;
				o.p.x = o.p.x + o.v.x * delta
				o.p.y = o.p.y + o.v.y * delta
			}

			// move ball
			if ( info_stat == 'ingame' )
			{
				for ( let b of balls )
				{
					if ( b.flgActive == false ) continue;

					b.p.x = b.p.x + b.v.x * delta
					b.p.y = b.p.y + b.v.y * delta

					if ( b.typ=='bal:hard' )
					{
				//		b.v = vmul_scalar2( b.v, 0.999 );
					}
				}
			}

			// racket for collition to wall 
			{
				// e:ラケットの壁との反発係数
				let e = -1/4;
			
				let o = racket;
				let wl = o.r;
				let wr = bo.reso_x-o.r-1;

				if ( o.p.x < wl ) 
				{
					o.p.x += (wl-o.p.x);
		 			o.v.x = o.v.x*e;
				}
				if ( o.p.x > wr ) 
				{
					o.p.x += (wr-o.p.x);
		 			o.v.x = o.v.x*e;
				}
			}

			// collition ball to wall
			for ( let b of balls )
			{
				if ( b.flgActive == false ) continue;

				let wl = b.r;
				let wr = bo.reso_x-b.r;
				let wt = b.r;
				let wb = bo.reso_y+b.r;

				if ( b.p.x < wl )
				{
					bo.se_ring_by_name("se:wall" );
					b.p.x += (wl-b.p.x)*2;
		 			b.v.x = -b.v.x;
					if ( b.type == 'bal:nml' )
					{
						if ( Math.abs(b.v.y) < BALL_SP_Y ) 			//	y軸下限
						{
							if ( b.v.y == 0 ) b.v.y = 1;
							b.v.y = b.v.y/Math.abs(b.v.y)*BALL_SP_Y;
						}
					}

		 		}
				if ( b.p.x > wr )
				{
					bo.se_ring_by_name("se:wall" );
					b.p.x += (wr-b.p.x)*2;
		 			b.v.x = -b.v.x;
					if ( b.type == 'bal:nml' )
					{
						if ( Math.abs(b.v.y) < BALL_SP_Y ) 			//	y軸下限
						{
							if ( b.v.y == 0 ) b.v.y = 1;
							b.v.y = b.v.y/Math.abs(b.v.y)*BALL_SP_Y;
						}
					}
		 		}

				if ( b.p.y < wt )
				{
					b.p.y += (wt-b.p.y)*2;
		 			b.v.y = -b.v.y;
					if ( b.typ == 'bal:nml' )
					{
						if ( length2(b.v) <  BALL_SP_MAX )	// ゲーム性の大体の限界
						{
							b.v  = vmul_scalar2( b.v, BALL_SP_CEIL ); // 天井に当たるたび速度アップ
							bo.se_ring_by_name("se:ceil" );
						}
						else
						{
							bo.se_ring_by_name("se:wall" );
						}
//						console.log( "sp ",length2(b.v) );
					}
					else
					{
						bo.se_ring_by_name("se:wall" );
					}
		 		}
				if ( b.typ == "bal:hard" )// ブロックみたいなボールは落ちない
				{
					if ( b.p.y+b.r*2 > wb )
					{
						b.p.y += (wb-(b.p.y+b.r*2))*2;
			 			b.v.y = -b.v.y;
					}
				}
				else
				if ( b.typ == "bal:nml" )
				{
					if ( b.p.y > wb )
					{
						// ロストボール
						b.flgActive = false;

						if ( info_activeballs == 1 )
						{
							info_stockballs--; 

							bo.se_ring_by_name("se:lost" );
							info_stat = 'lostball';
							info_timerlost = 0;
						}
						else
						{
							bo.se_ring_by_name("se:lost2");
						}
					}
				}
			}
			
			// 

			// 当たりチェック関数
			function chkhit( a, b )
			{
				return length2(vsub2(a.p,b.p))-(a.r+b.r);
			}

			// collition to block
			for ( let b of balls )
			{
				if ( b.flgActive == false ) continue;

				for ( let blk of blocks )
				{
					if ( blk.flgActive == false ) continue;

					let l = chkhit(b,blk);
					if ( l < 0 )
					{
						if ( blk.typ == 'blk:hard' || b.typ == 'bal:hard' ) 
						{
							{ // 埋まりを解消
								let l = chkhit(blk,b);
								let N = normalize2( vsub2(blk.p,b.p) );
								let m = vmul_scalar2(N,l);
								b.p = vadd2( b.p, m );
							}

							b.v = reflect2( b.v, normalize2( vsub2( blk.p, b.p ) ) );
							bo.se_ring_by_name("se:toball2", 1.0 );
						}
						else
						if ( blk.typ == 'blk:uzu' ) 
						{
							b.v = reflect2( b.v, normalize2( vsub2( blk.p, b.p ) ) );
							b.v = vmul_scalar2(b.v,1.1);
							bo.se_ring_by_name("se:uzu");
							blk.flgActive = false;
							info_score++;
						}
						else
						{
							b.v = reflect2( b.v, normalize2( vsub2( blk.p, b.p ) ) );
							bo.se_ring_by_name("se:break");
							blk.flgActive = false;
							info_score++;
						}
					}

				}
			}


			// 衝突計算関数
			function calcbound( a, b ) // .v .p .m mark
			{
				// 伝達ベクトル
				let N = normalize2( vsub2( b.p, a.p ) );
				let va = dot2( a.v, N )
				let vb = dot2( b.v, N )

				//console.log( vb-va);
				if ( vb > va ) return 0 ; // 離れてゆく場合は計算しない

				let a1 = vec2( N.x*va, N.y*va );
				let b1 = vec2( N.x*vb, N.y*vb );

				// 残留ベクトル
				let a2 = vsub2( a.v, a1 );
				let b2 = vsub2( b.v, b1 );

				// 運動量交換
				// m1v1+m2v2=m1v1'+m2v2'
				// v1-v2=-(v1'-v2')
				let a3 = vec2(
					(a.m*a1.x +b.m*(2*b1.x-a1.x))/(a. m+b.m),
					(a.m*a1.y +b.m*(2*b1.y-a1.y))/(a.m+b.m)
				);
				let b3 = vec2(
					a1.x-b1.x+a3.x,
					a1.y-b1.y+a3.y
				);

				// a,b:運動量合成
				a.v = vadd2( a2, a3 );
				b.v = vadd2( b2, b3 );

				return Math.abs(va-vb); // 衝突速度を返す
					
				let ka = (1/2*a.m*va*va);
				let kb = (1/2*b.m*vb*vb);
				return  ka+kb; // 衝突エネルギーKを返す

			}
			
			{// collition racket to ball

				for ( let b of balls )
				{
					if ( b.flgActive == false ) continue;

					let P0 = racket.p;
//					let P1 = vec2( prev_x,racket.p.y);
					let P1 = vec2( racket.p.x-racket.v.x*delta,racket.p.y);
					let P2 = b.p;
					let r = b.r+racket.r;

					function coll( b, r ) //  ball && racket 
					{
						let ix= b.v.x; // 衝突前の速度ベクトル
						let iy= b.v.y; 

 						let k = calcbound( r, b );

						{	// 速度下限調整
							//
							let b_sp = BALL_SP_BASE;			// 基準速度
							let i_sp = length2( vec2(ix,iy) );	// 入射速度
							let c_sp = length2(b.v);			// 計算速度

							let sp = 0;
							let type="none";
							if ( b.typ=='bal:nml' )
							{
								if(1)
								{
									//   1| 2| 3	|基|入|計|
									//  基>入>計	| 1| 2| 3|	入射速度を基準速度に近づける
									//  基>計>入	| 1| 3| 2|	計算速度を基準速度に近づける
									//  入>基>計	| 2| 1| 3|	入射速度で返す
									//  入>計>基	| 3| 1| 2|	入射速度で返す
									//  計>入>基	| 3| 2| 1|	入射速度で返す
									//  計>基>入	| 2| 3| 1|	基準速度で返す
										 if ( b_sp >= i_sp && i_sp >= c_sp ) {type = "bic";sp = (i_sp+b_sp)/2;}
									else if ( b_sp >= c_sp && c_sp >= i_sp ) {type = "bci";sp = (c_sp+b_sp)/2;}
									else if ( i_sp >= b_sp && b_sp >= c_sp ) {type = "ibc";sp = i_sp;}
									else if ( i_sp >= c_sp && c_sp >= b_sp ) {type = "icb";sp = i_sp;}
									else if ( c_sp >= i_sp && i_sp >= b_sp ) {type = "cib";sp = i_sp;}
									else if ( c_sp >= b_sp && b_sp >= i_sp ) {type = "cbi";sp = b_sp;}
									else console.log("error bound speed:" );
								}
								else
								{
									sp = c_sp;								
									let F = r.m*racket.v.x;	// ラケットの力を計算
									let a = vdiv_scalar2(F,b.m);		// ボールに掛かる加速度
									
								}
							}
							else
							if ( b.typ=='bal:hard' )
							{
								sp = i_sp;								
							}
							else
							{
								console.log( 'error ',b.typ );
							}
							b.v = vmul_scalar2( normalize2(b.v), sp );
						}

						{ // 埋まりを解消
							let l = chkhit(r,b);

							let N = normalize2( vsub2(r.p,b.p) );
							let m = vmul_scalar2(N,l/2);
							r.p = vsub2( r.p, m );
							b.p = vadd2( b.p, m );
						}

						hit_buf_racket.unshift({m:r.m,p:{x:r.p.x,y:r.p.y},r:r.r, iv:{x:ix,y:iy}, v:{x:r.v.x, y:r.v.y}});
						hit_buf_ball.unshift(  {m:b.m,p:{x:b.p.x,y:b.p.y},r:b.r, iv:{x:ix,y:iy}, v:{x:b.v.x, y:b.v.y}});
					
						return k;
					}


					let prev = b.cntCnv;
					if ( b.p.y < racket.p.y )//+b.r ) // 上半円
					{
						let flgcoll = false;
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

							let o = {p:{x:X.x,y:X.y},r:racket.r};
							o.v = racket.v;
							o.m = racket.m;

							let k = coll( b,o );
							flgcoll = true;

						}
						else 
						{	// フレーム間以外の通常の当たり判定
							let l = chkhit(b,racket);
							if ( l<0 )
							{
								let k = coll( b,racket );
								flgcoll = true;
							}
						}
						if ( flgcoll )
						{
							info_mouseslowtime += 0.1;//(s) 
							b.cntCnv++;
							if ( b.typ=='bal:nml' )
							{
								if ( ((++info_cntRally) % BALL_1UP )== 0 )
								{
									info_stockballs++;
									bo.se_ring_by_name("se:1up");
								}
							}
						}
					}
					
					if ( prev == b.cntCnv )
					{
						if ( b.cntCnv > 0 ) 
						{
							//console.log('conv ',b.cntCnv );
							let f = 1;//b.cntCnv;
							if ( f > 2 ) f= 2; // 重い場合は音程を低くしようと試したが、パッとしないのでやめる。
							bo.se_ring_by_name("se:racket",f);
							b.cntCnv = 0;
						}
					}
				}
			}
			
			// collition ball to ball
			for ( let i = 0 ; i < balls.length ; i++ )
			{
				let a = balls[i];
				if ( a.flgActive == false ) continue;

				for ( let j = i+1 ; j < balls.length ; j++ )
				{
					let b = balls[j];
					if ( b.flgActive == false ) continue;
					let l = chkhit(a,b);
					if ( l < 0 )
					{
					
						if ( a.p.x == b.p.x && a.p.y == b.p.y ) 
						{
							b.p.x+=0.01; // 同一座標解消
						}
	
						let k = calcbound( a, b );

						if ( k > 0 ) 
						{
							if ( a.typ == 'bal:nml' || b.typ == 'bal:nml' )
							{
								bo.se_ring_by_name("se:toball", 1.0 );
							}
							else
							{
								bo.se_ring_by_name("se:toball2", 1.0 );
							}
						}

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


		}
		else
		{
			// ポーズ中
			racket.a.x = 0;
			racket.a.y = 0;
		} // end of pause
		

		if ( info_stat == 'serve' )
		{// draw mouse coursor
			gra.color(1,1,1)
			let x = gra_cvx(bo.mouse_x);
			let y = bo.tst_y;
			let s = 10;
			gra.line( x  , y, x+s, y+s/2  );
			gra.line( x  , y, x+s/2  , y+s);
			gra.line( x+s, y+s/2, x+s/2  , y+s);
		}

		{// draw wall
			gra.color(1,1,1);
			gra.line(0,0,0,bo.reso_y);
			gra.line(bo.reso_x-1,0,bo.reso_x-1,bo.reso_y );
			gra.line(0,0,bo.reso_x-1,0 );
		}
	
		{// draw blocks
			gra.color(1,1,1);
			for ( let o of blocks )
			{
				if ( o.flgActive == false ) continue;

				if ( o.typ == 'blk:nml' )
				{
					gra.setLineWidth(3);
					gra.circle( o.p.x, o.p.y, o.r );
					gra.setLineWidth(1);
				}
				else
				if ( o.typ == 'blk:hard' )
				{
					gra.setLineWidth(3);
					for ( let i = 0 ; i < 1 ; i++ )
					{
						let r = o.r-i*4;
						if ( r < 1 ) break;
						gra.circle( o.p.x, o.p.y, r );
					}
					gra.setLineWidth(1);
					gra.circlefill( o.p.x, o.p.y, o.r-4 );
				}
				else
				if ( o.typ == 'blk:uzu' )
				{
					gra.setLineWidth(2);
					for ( let i = 0 ; i < 5 ; i++ )
					{
						let r = o.r-i*3;
						if ( r < 1 ) break;
						gra.circle( o.p.x, o.p.y, r );
					}
					gra.setLineWidth(1);
				}
			}
		}

		// ブラーボールの表示
		function blurball( b, typ, n=-1 , st=0, en=Math.PI*2 )
		{
			if ( info_stat != 'ingame' ) n = 1;
			if ( n==-1 ) n = Math.floor(length2(b.v)/b.r*0.03)+1;
			let ax = b.v.x*delta/n;
			let ay = b.v.y*delta/n;
			gra.alpha(1.5/n, 'add' );
			for ( let i = 0 ; i < n ; i++ )
			{
				let x = b.p.x-ax*i;
				let y = b.p.y-ay*i;
				if ( typ=='bal:nml' )
				{
					gra.circlefill( x, y, b.r, st, en  );
//					blurball( b );
				}
				else
				if ( typ=='bal:hard' )
				{
					for ( let i = 0 ; i < 1 ; i++ )
					{
						let r = b.r-i*4;
						if ( r < 1 ) break;
						gra.circle( x, y, r );
					}
					let r = b.r-4;
					if ( r <=0 ) r= 1.0
					gra.circlefill( x, y, r );

				}
		
			}
			gra.alpha(1);
		}

		{// draw ball

			gra.color(1,1,1);
			for ( let b of balls )
			{
				if ( b.flgActive == false ) continue;
			
				if ( b.typ=='bal:nml' )
				{
					blurball( b, b.typ );
				}
				else
				if ( b.typ=='bal:hard' )
				{
					gra.setLineWidth(3);
					blurball( b, b.typ );
					gra.setLineWidth(1);
/*
					gra.setLineWidth(3);
					for ( let i = 0 ; i < 1 ; i++ )
					{
						let r = b.r-i*4;
						if ( r < 1 ) break;
						gra.circle( b.p.x, b.p.y, r );
					}
					gra.setLineWidth(1);
					let r = b.r-4;
					if ( r <=0 ) r= 1.0
					gra.circlefill( b.p.x, b.p.y, r );
*/

				}
				else
				{
					console.log('error ',b ) ;
				}
				gra.color(1,1,1);
			
				if ( flgdebug ) 
				{
					gra.color(0.25,0.5,1);
					gra.symbol( Math.floor(length2(b.v)).toString(), b.p.x, b.p.y, 16);
					gra.symbol( Math.floor(length2(b.v)).toString(), b.p.x+1, b.p.y, 16);
					gra.color(1,1,1);
				}

			}
		}


		// draw racket 
		blurball( racket, 'bal:nml' , 32, Math.PI, Math.PI*2 );
	

		//draw debug
		{
			if( flgdebug )
			{
				gra.setLineWidth(2);

				gra.color(1,0,0);
				if ( hit_q )	gra.circle( hit_q.x, hit_q.y+1, hit_q.r );
				gra.color(1,1,0);
//				if ( hit_st )	gra.line( hit_st.x, hit_st.y+1, hit_en.x, hit_en.y+1 );
				if ( hit_st )	gra.line( hit_st.x, bo.reso_y-2, hit_en.x, bo.reso_y-2 );

				let n = 2;
				for ( let i = 0 ; i < n && i < hit_buf_ball.length; i++ )							//	ボールの軌跡
				{
					let o = hit_buf_ball[i];
					gra.color(0.0,0.7,0.7);
					gra.circle( o.p.x, o.p.y, o.r-0.5 );
					let sc = 2;
					let iv = vmul_scalar2(o.iv,o.m*delta*sc);
					let ov = vmul_scalar2(o.v ,o.m*delta*sc);
					gra.color(0.7,0.7,0.7);
					gra.line( o.p.x, o.p.y, o.p.x-iv.x*sc, o.p.y-iv.y*sc );
					gra.color(1,0,0);
					gra.line( o.p.x, o.p.y, o.p.x+ov.x*sc, o.p.y+ov.y*sc );
					let deg  = Math.atan2( -ov.y ,-ov.x ) * 180 / Math.PI ;
					//if ( i == 0 ) gra.print( deg, o.p.x+3, o.p.y-10 );
				}
				for ( let i = 0 ; i < n && i < hit_buf_racket.length; i++ )							//	ラケットの軌跡
				{
					let o = hit_buf_racket[i];
					gra.color(0.0,0.7,0.7);
					gra.circle( o.p.x, o.p.y, o.r-0.5, Math.PI, Math.PI*2 );
					let sc = 2; 
					let iv = vmul_scalar2(o.iv,o.m*delta*sc);
					let ov = vmul_scalar2(o.v ,o.m*delta*sc);
					gra.color(0.7,0.7,0.7);
					gra.line( o.p.x, o.p.y, o.p.x-iv.x*sc, o.p.y-iv.y*sc );
					gra.color(1,0,0);
					gra.line( o.p.x, o.p.y, o.p.x+ov.x*sc, o.p.y+ov.y*sc );

				}
				gra.setLineWidth(1);
				gra.color(1,1,1);
			}
		}

		// draw score
		{
/*
			gra.color(1,1,1);
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
*/						

			let str_score = "SCORE "+("0000"+info_score.toString()).substr(-4);
			let str_stage = "STAGE "+info_cntStage.toString();
			let str_balls = "BALLS "+info_stockballs.toString();
			gra.symbol( str_score,1,0,16,"left" );
			gra.symbol( str_stage,bo.reso_x/2,0,16,"center" );
			gra.symbol( str_balls,bo.reso_x-2,0,16,"right" );
			if ( flgdebug )
			{
				let str_abals = "A-BAL "+info_activeballs.toString();
				let str_ablks = "A-BLK "+info_activeblocks.toString();
				gra.symbol( str_abals,bo.reso_x-2,16,16,"right" );
				gra.symbol( str_ablks,bo.reso_x-2,32,16,"right" );
			}

		
			if ( info_pause )
			{
					gra.symbol( 'PAUSE'		,bo.reso_x/2,16*14,16,"center" );
			}


			function sym2( str, x, y, size )
			{
				gra.color(0,0,0);gra.symbol( str,x+1,y+1,size,"center" );
				gra.color(0,0,0);gra.symbol( str,x+2,y+2,size,"center" );
				gra.color(1,1,1);gra.symbol( str,x,y,size,"center" );
			}
			switch(info_stat)
			{
				case 'serve':
					if ( 1 )
					{
						sym2( 'Click to service'				,bo.reso_x/2,16*14,16);
						sym2( 'or'							,bo.reso_x/2,16*15,16);
						sym2( 'Space or Trigger to service'	,bo.reso_x/2,16*16,16);
					}
					else
					{
						sym2( 'クリックしてスタート'				,bo.reso_x/2,16*14,16);
						sym2( 'or'							,bo.reso_x/2,16*15,16);
						sym2( 'Space or Trigger to service'	,bo.reso_x/2,16*16,16);
					}
					break;
				case 'ingame':												break;
				case 'gameover':
					let str_hiscore = 'high score '+("0000"+m_highscore[ bo.game ].toString()).substr(-4);
						sym2( 'GAME OVER'				,bo.reso_x/2,16*13,24 );
						sym2( 'GAME OVER'				,bo.reso_x/2,16*13,24 );
						if ( m_highscore[ bo.game ] == info_score &&  m_highscore[ bo.game ]>0 )
						{
							sym2( 'Recorded a high score!!!'		,bo.reso_x/2,16*15,16 );
						}
						sym2( str_hiscore	,bo.reso_x/2,16*16,16 );

									break;

				case 'lostball':	
					sym2( 'LOST BALL'		,bo.reso_x/2,16*14,20 );
					break;
				default:			
					sym2( 'error stat'		,bo.reso_x/2,16*14,16 );
					break;
				
			}
			
		}
		
		// 情報表示
		if ( flgdebug )
		{
			gra.window( 0,0,html_canvas.width,html_canvas.height);
			let K=0;
			for ( let b of balls )	
			{
				if ( b.flgActive == false ) continue;

				let k = 1/2*b.m*dot2(b.v,b.v);
				K+=k;
			}
			gra.print( "K="+ K,0,html_canvas.height-16 );
			//gra.print( 1/delta +"fps",html_canvas.width-50,html_canvas.height-16 );
		}
//		prev_x	= racket.p.x;

	}
	return bo;

}
//-----------------------------------------------------------------------------
function fullscreen_create()
//-----------------------------------------------------------------------------
{
	let bo = {}

	document.addEventListener('touchmove', function(e) {e.preventDefault();}, {passive: false}); // 指ドラッグスクロールの抑制

	let m_fullscreen_original_width;
	let m_fullscreen_original_height;

	bo.flgFullscreen = false;

	//-----------------------------------------------------------------------------
	bo.fullscreeen_change = function( cv, callback_at_return )
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
			{
				let obj = cv.requestFullscreen || cv.webkitRequestFullScreen;
				obj.call( cv );
			}

			function callback()
			{
				if (	window.document.fullscreenElement ||	window.document.webkitFullscreenElement )
				{
					// フルスクリーンへ突入時
					bo.flgFullscreen = true;
				}
				else
				{
					// フルスクリーンから戻り時
					cv.width = m_fullscreen_original_width;
					cv.height = m_fullscreen_original_height;
					bo.flgFullscreen = false;
				}
				callback_at_return(); // 画面モード再設定
			}
			window.document.addEventListener("fullscreenchange", callback, false);
			window.document.addEventListener("webkitfullscreenchange", callback, false);
		}
		else
		{
			alert("フルスクリーンに対応していません\nDoes not support full screen");
		}
	}
	return bo;
}




let bo = bo_create(); // breakout 

//-----------------------------------------------------------------------------
window.onload = function()
//-----------------------------------------------------------------------------
{
	// htmlのhtml_game/checked設定を読み込んで実行
	{
		var list = document.getElementsByName( "html_game" ) ;
		for ( let l of list ) if ( l.checked ) l.onchange();
	}


	//-------------------------------------------------------------------------
	function update()
	//-------------------------------------------------------------------------
	{
		if ( 1 )
		{
			// 描画書き換えが同期していて綺麗。ゲーム用
			bo.frame_update( 1/60 );
			bo.hdlRequest = window.requestAnimationFrame( update );	
		}
		else
		{
			// 1/60 以上の更新が可能。シミュレーション用
			let delta = 1/60;
			bo.frame_update( delta );
			m_hdlTimeout = setTimeout( update, delta*1000 );
		}
	}
	update();
}

// HTML/マウス/キーボード制御
//-----------------------------------------------------------------------------
function html_onchange( valRequest )
//-----------------------------------------------------------------------------
{
	if ( valRequest == 'reset' )
	{
		bo.resetall();
	}
	else
	if( valRequest == "fullscreen" )
	{
		bo.req = 'fullscreen';

	}
	else
	{
		bo.game = valRequest;
		bo.req = 'reset';
	}
}

document.onmousedown = mousemovedown;
document.onmousemove = onmousemove;
//-----------------------------------------------------------------------------
function mousemovedown(e)
//-----------------------------------------------------------------------------
{
	let as2 = bo.reso_x/bo.reso_y;
	let as1 = html_canvas.width/html_canvas.height;
	let	W = html_canvas.width * (bo.reso_x/bo.reso_y);
	let	H = html_canvas.height;

	if ( e.buttons==3 ) bo.req='reset';
	if ( e.buttons==2 ) bo.req='pause';
	if ( e.buttons==1 )
	{

	    var rect = html_canvas.getBoundingClientRect();
        let x= (e.clientX - rect.left)/ html_canvas.width;
        let y= (e.clientY - rect.top)/ html_canvas.height;
		if ( x > 0 && x < 1 && y >0 && y < 1 )
		{
			bo.mouse_click = true;	

			if ( bo.inter == false ) //  チャタリング防止 ms間連続クリックの禁止
			{
				bo.inter = true;
				bo.hdlClick = setTimeout( function(){bo.inter = false;bo.mouse_click=false;}, 200 ); // チャタリング防止 ms間連続クリックの禁止
			}
		}
	}

}
//-----------------------------------------------------------------------------
function onmousemove(e)
//-----------------------------------------------------------------------------
{
	let as2 = bo.reso_x/bo.reso_y;
	let as1 = html_canvas.width/html_canvas.height;
	let	W = html_canvas.width * (bo.reso_x/bo.reso_y);
	let	H = html_canvas.height;


	{
	
	    var rect = html_canvas.getBoundingClientRect();

		bo.mouse_x = (e.clientX - rect.left);

	}

	//test
	{
	    var rect = html_canvas.getBoundingClientRect();
        let x= (e.clientX - rect.left)/ html_canvas.width *bo.reso_x;
        let y= (e.clientY - rect.top )/ html_canvas.height *bo.reso_y
		bo.tst_x = x;
		bo.tst_y = y;
	}

}

//-----------------------------------------------------------------------------
window.onkeyup = function( ev )
//-----------------------------------------------------------------------------
{
	let c = ev.keyCode;
	bo.key[c]=false;
}

//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	let	c = ev.keyCode;
	bo.key[c]=true;
	if ( c == KEY_SPC ) return false; // falseを返すことでスペースバーでのスクロールを抑制
	if ( c == KEY_D ) document.getElementsByName( "html_debug" )[0].checked = !document.getElementsByName( "html_debug" )[0].checked;
	if ( c == KEY_R ) bo.req = 'reset';
	if ( c == KEY_F ) bo.req = 'fullscreen';

//	if ( c == KEY_Q ) bo.se_ring_by_name( "se:clear" );
	

}

// 右クリックでのコンテキストメニューを抑制
document.addEventListener('contextmenu', contextmenu);
function contextmenu(e) 
{
  e.preventDefault();
}