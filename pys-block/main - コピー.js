"use strict";

const g_reso_x = 360;
const g_reso_y = 360;
let g_hdlRequest = null;
let g_hdlTimeout = null;
let g_game;
let g_req = '';
let first = 1;
let count = 1;
let g_highscore = 
{
	basic:1,
//	super:1,
	mitu:1,
	wild:1,
	special:1,
	atom:1,
//	heavy:1,
	dot:1,
	hex:1,
	bio:1,
	balls:1,
};

const BALL_SP_BASE	= 160;	//	基準になるボールの速度。平均的にゲームに快適な速度
const BALL_SP_TOP	= 400;
const BALL_SP_UNDER = 80;	
const BALL_SP_Y		= 20;	//	殆ど真横でバウンドし続けるのを抑制するための、Y軸移動量下限値
const BALL_SP_CEIL	= 1.1;	//	天井に当たったときの加速率
const BALL_M = 0.8;
const BALL_X = g_reso_x/2-100;
const BALL_Y = 212;
const RACKET_Y=g_reso_y-8;
const RACKET_M=2;
const RACKET_MIN=0.5;
const BLOCK_Y=64;
const BLOCK_R=14;

let gra;

let hit_buf_ball = [];
let hit_buf_racket = [];
let hit_q={};
let hit_st={};
let hit_en={};

let tst = fullscreen_create();
let tst_x=0;
let tst_y=0;

let g_se;
let racket;
let g_hdlClick = null;	// マウスクリックのチャタリング防止用
let g_inter = false;
let g_mouse_x;
let g_mouse_click;

let g_key=Array(256);
//-----------------------------------------------------------------------------
function main()
//-----------------------------------------------------------------------------
{
	// 初期化
	if ( g_hdlRequest ) window.cancelAnimationFrame( g_hdlRequest ); // main呼び出しで多重化を防ぐ
	if ( g_hdlTimeout ) clearTimeout( g_hdlTimeout 	);	 // main呼び出しで多重化を防ぐ
	if ( g_hdlClick ) clearTimeout( g_hdlClick 	);	 // main呼び出しで多重化を防ぐ
	gra = gra_create( html_canvas );
	first = 1;
	count = 1;
	g_mouse_x = 0;
	g_mouse_click = false;

	//---
	let info_flg_mouseinput = false;
	let info_pause;
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
	let prev_x;
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
	function init_stage( game, stage )
	{
		{
			// ラケットサイズをステージが進むと小さく
			let m = RACKET_M - (stage-1)/10;
			if ( m < RACKET_MIN ) m =  RACKET_MIN;
			racket = {p:{x:g_reso_x/2,y:RACKET_Y},v:{x:0,y:0},a:{x:0,y:0},r:16, m:m, req_a:{x:0,y:0}};
			racket.r = calc_r( racket.m )*2; // ラケットは半円なので、半径は倍
		}

		info_scaleball = 1;

		// ボールクリーンナップ
		{
			let cnt = 0;	// 持ち越せるのは最大6個
			let tmp = [];
			for ( let o of balls )
			{
				if ( o.flg == false ) continue; 
				if ( ++cnt > 6 ) break;

				if ( length2(o.v) > 0 && length2(o.v)>BALL_SP_BASE )
				{
					o.v  = vmul_scalar2( normalize2(o.v), BALL_SP_BASE ); // クリア時に早すぎるボールを一旦速度を落とす。
				}
				tmp.push(o);
			}
			balls = tmp;
		}	

		// ブロック初期化
		blocks=[];
		info_activeblocks=0;
		switch( game )
		{
			case 'test':	
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st/3);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 0 ; j < 1 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;
						blocks.push({typ:'nml',n:1,p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2-50, BLOCK_Y+st*5, BALL_M/2, 100, radians(0) );
					create_ball( g_reso_x/2+50, BLOCK_Y+st*5, BALL_M*2, 0 );
				//	create_ball( g_reso_x/2+34, BLOCK_Y+st*5+140, BALL_M*2, 0.1,radians(-135) );
					create_ball( g_reso_x/2-30, BLOCK_Y+64+32, BALL_M*Math.random()*3, 0 );
					create_ball( g_reso_x/2   , BLOCK_Y+32+32, BALL_M*Math.random()*4, 0 );
					create_ball( g_reso_x/2+32, BLOCK_Y+64+32, BALL_M*Math.random()*5, 0 );
				}
				break;

			case 'basic':	
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
						blocks.push({typ:'nml',n:1,p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2, BLOCK_Y-st, BALL_M, 0 );

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
//						if ( (j == 1 && ( i == 2 || i == 9 ) ) 
//						||   ( j == 2 && ( i == 2 || i ==  9 ) ) )
						if ( (j == 3 && ( i == 0 || i == 11 ) ) )
						blocks.push({typ:'hard',n:1,p:vec2(x, y),r:r, flg:true});
						else
						blocks.push({typ:'nml',n:1,p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2-16, BLOCK_Y-st, BALL_M, -50, radians(180) );
					create_ball( g_reso_x/2+16, BLOCK_Y-st, BALL_M,  20, radians(0) );
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
						blocks.push({typ:'nml',n:1,p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2-50, BLOCK_Y+st*5, BALL_M/2, 100, radians(0) );
					create_ball( g_reso_x/2+50, BLOCK_Y+st*5, BALL_M*4, 0 );

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
						if ( j == 3 && ( i == 5 || i == 6 ) ) continue;

						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;

				//		if ( j == 3 && ( i == 4 || i == 7 ) ) 
				//		blocks.push({typ:'hard',n:1,p:vec2(x, y),r:r, flg:true});
				//		else
						blocks.push({typ:'nml',n:1,p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2, BLOCK_Y+st*4, BALL_M*6, 0 );
				}
				break;

			case 'special':	 
				{
					let r = BLOCK_R+1;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 0 ; j < 5 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						if ( j == 2 && ( i == 5 ) ) continue;
					
						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y - st;
						if ( j == 2 && ( i == 2 || i == 8 ) ) 
						blocks.push({typ:'hard',n:1,p:vec2(x, y),r:r, flg:true});
						else
						blocks.push({typ:'nml',n:1,p:vec2(x, y),r:r, flg:true});
					}

					for ( let i = 0 ; i<4/2 ; i++ )
					{
						let x = g_reso_x/2-st+st/4	+st/2*i +st/2;
						let y = BLOCK_Y+st*2+st/4 - st;
						create_ball( x,y, BALL_M*0.5, 0 );
						create_ball( x,y+st/2, BALL_M*0.5, 0 );
					}
				}
				break;

			case 'atom':	// 
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 1 ; j < 6 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						let x = i * st+st/2+ax;
						let y = j * st + +BLOCK_Y-st*2;
//						if ( j == 2 && ( i == 0 || i == 2 || i == 4 || i == 7 || i == 9 || i == 11 ) ) 
//						if ( j == 2 ) continue;
						if ( j == 3 ) continue;
//						if ( j == 4 ) continue;
						if ( j == 1 && ( i == 0 || i == 11 ) ) 
						blocks.push({typ:'hard',n:1,p:vec2(x, y),r:r, flg:true});
						else
						blocks.push({typ:'nml',n:1,p:vec2(x, y),r:r, flg:true});
					}

//						create_ball( g_reso_x/2,BLOCK_Y-st-10 +50, BALL_M*0.1, 700, radians(0) );
						create_ball( g_reso_x/2,BLOCK_Y-st    +48, BALL_M*0.1, 600, radians(180) );
						create_ball( g_reso_x/2,BLOCK_Y-st+10 +48, BALL_M*0.1, 500, radians(0) );
						create_ball( g_reso_x/2,BLOCK_Y-st+20 +48, BALL_M*0.1, 400, radians(180) );
//						create_ball( g_reso_x/2,BLOCK_Y-st+30 +48, BALL_M*0.1, 300, radians(0) );
//						create_ball( g_reso_x/2,BLOCK_Y-st+40 +48, BALL_M*0.1, 200, radians(180) );
//						create_ball( g_reso_x/2,BLOCK_Y-st+50 +48, BALL_M*0.1, 100, radians(0) );
				}
				break;

			case 'heavy':	
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
						if ( (j == 1 && ( i == 1 || i == 10 ) ) 
						||   ( j == 2 && ( i == 3 || i ==  8 ) ) )
						blocks.push({typ:'hard',n:1,p:vec2(x, y),r:r, flg:true});
						else
						blocks.push({typ:'nml',n:1,p:vec2(x, y),r:r, flg:true});
					}
				//	create_ball( g_reso_x/2, BLOCK_Y-st, BALL_M, 0 );

					info_scaleball = 4;
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
						blocks.push({typ:'nml',n:1,p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2, BLOCK_Y-16, BALL_M*3,  0, radians(0) );
					create_ball( g_reso_x/2-50, BLOCK_Y-16, BALL_M*0.1,    0, radians(0) );
					create_ball( g_reso_x/2+50, BLOCK_Y-16, BALL_M*0.3,  200, radians(0) );
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
							if ( j == 2 && ( i == 0 || i == 10 ) ) 
							blocks.push({typ:'hard',n:1,p:vec2(x, y),r:r, flg:true});
							else
							blocks.push({typ:'nml',n:1,p:vec2(x, y),r:r, flg:true});
						}
					}
					create_ball( g_reso_x/2-st*6, BLOCK_Y+st*0.85*2 , BALL_M, 0 );
					create_ball( g_reso_x/2+st*6, BLOCK_Y+st*0.85*2 , BALL_M, 0 );
				}
				break;

			case 'bio':	// 
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let cx =g_reso_x/2;
					let cy =g_reso_y/2+st/4;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2+st/2;
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
					
						for ( let i = 0 ; i * st+ax+aax < g_reso_x-st/2 ; i++ )
						{
							let x = i * st+ax+aax;
							let y = j * st*0.85+BLOCK_Y;

							let u = x-cx;
							let v = y-cy;
							let l = Math.sqrt(u*u+v*v);
							if ( l < st*4+st/2  ) continue;
							if ( l < st*4.7 && y < st*8 && ( j == 1 || j == 6 ) ) 
							blocks.push({typ:'hard',n:1,p:vec2(x, y),r:r, flg:true});
							else
							blocks.push({typ:'nml',n:1,p:vec2(x, y),r:r, flg:true});
						}
					}
					create_ball( g_reso_x/2-32, BLOCK_Y+64+32, BALL_M*Math.random()*3, 0 );
					create_ball( g_reso_x/2   , BLOCK_Y+32+32, BALL_M*Math.random()*4, 0 );
					create_ball( g_reso_x/2+32, BLOCK_Y+64+32, BALL_M*Math.random()*5, 0 );
//					create_ball( g_reso_x/2-64, BLOCK_Y+64+48, BALL_M*Math.random()*2, 0 );
//					create_ball( g_reso_x/2   , BLOCK_Y+32+96, BALL_M*Math.random()*3, 0 );
//					create_ball( g_reso_x/2+64, BLOCK_Y+64+48, BALL_M*Math.random()*4, 0 );

				}
				break;

			case 'balls':	// 
				{
					let r = BLOCK_R;
					let st = r*2+1;
					let w = Math.floor(g_reso_x / st);
					let ax = (g_reso_x-w*st)/2;

					for ( let j = 0 ; j < 4 ; j++ )
					for ( let i = 0 ; i < w ; i++ )
					{
						if ( j == 3 && ( i == 5 || i == 6 ) ) continue;

						let x = i * st+st/2+ax;
						let y = j * st+st/2+BLOCK_Y;

				//		if ( j == 3 && ( i == 4 || i == 7 ) ) 
				//		blocks.push({typ:'hard',n:1,p:vec2(x, y),r:r, flg:true});
				//		else
						blocks.push({typ:'nml',n:1,p:vec2(x, y),r:r, flg:true});
					}
					create_ball( g_reso_x/2, BLOCK_Y+st*4, BALL_M*6, 0 );
				}
				break;


			default:
				{
					blocks.push({typ:'nml',p:vec2(g_reso_x/2, g_reso_y/2),r:20, flg:true});
					create_ball( g_reso_x/2, BLOCK_Y, BALL_M, 0 );
				
					console.log("ERROR game name:"+game );
				}
				break;		
		}
	}

	function resetall()
	{
		console.log("reset");

		racket = {p:{x:g_reso_x/2,y:RACKET_Y},v:{x:0,y:0},a:{x:0,y:0},r:16, m:RACKET_M};
		racket.r = calc_r( racket.m )*2; // ラケットは半円なので、半径は倍
		prev_x	= racket.p.x;
		pad = pad_create();

		balls = [];
		blocks = [];
		info_flg_mouseinput = false;
		info_stage = 1;
		info_stockballs = 3;
		info_pause = false;
		info_stat = 'start';
		info_timerlost = 0;
		info_masterball = null;
		info_score = 0;
		info_activeblocks = 0;
		info_scaleball = 1;
		init_stage( g_game, info_stage );

		// ハイスコアのHTMLへの反映
		for ( let id of Object.keys(g_highscore) )
		{
			document.getElementById("html_"+id).innerHTML = g_highscore[id];
		}

		hit_st = {};
		hit_en = {};
		hit_q = {};
		hit_buf_ball = [];
		hit_buf_racket = [];

	}

	resetall();

	g_se = se_create();

	
	//-------------------------------------------------------------------------
	function frame_update( delta )
	//-------------------------------------------------------------------------
	{
		gra.window( 0,0,g_reso_x,g_reso_y );
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


		if ( g_req == 'pause' )
		{
			g_req ='';
			if ( info_stat=='ingame' ) 
			{
				info_pause = !info_pause;
			}
		}
		if ( g_req == 'fullscreen' )
		{
			g_req ='';
			if ( tst.flgFullscreen == false ) 
			{
				tst.fullscreeen_change( html_canvas, function()
				{
					gra = gra_create( html_canvas );
				});		
			}
		}
		if ( g_req == 'reset' )
		{
			g_req ='';
			resetall();
		}


		function gra_cvx( mx ) // canvas座標系のxをgra.window()座標系に変換する
		{
			let wx = html_canvas.height*g_reso_x/g_reso_y; 
			let ad = (html_canvas.width-wx)/2;
			return (mx-ad)/wx*g_reso_x;
		}

		pad.getinfo();


		// input serve 
		if ( info_stat == 'serve' || info_stat == 'gameover' )
		{

			if ( g_mouse_click )	// mouse
			{
				g_req = 'req_next';
				g_mouse_click = false;
				info_flg_mouseinput = true;
			}
			else
			if ( g_key[KEY_SPC] )	// key
			{
				g_req = 'req_next';
				info_flg_mouseinput = false;
			}
			else
			if ( pad.trig.a ) 
			{
				g_req = 'req_next';	// game pad
				info_flg_mouseinput = false;
			}
		}



			if ( info_flg_mouseinput )
			{// input mouse


				let x = gra_cvx(g_mouse_x);
				if ( x < racket.r ) x = racket.r;
				if ( x > g_reso_x-racket.r ) x = g_reso_x-racket.r;


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
					if ( g_key[KEY_N] ) 
					{
						g_key[KEY_N] = 0;
						info_stage++;
						init_stage( g_game, info_stage );
					}
					if ( g_key[KEY_P] ) 
					{
						g_req='pause';
						g_key[KEY_P] = false;
					}
					if ( g_key[KEY_RIGHT] ) 
					{
						s = g_reso_x;

					}
					if ( g_key[KEY_LEFT] ) 
					{
						s = -g_reso_x;
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

						if ( pad.l1 && pad.trig.st ) {g_req='reset';}
						else
						if ( pad.trig.se ) 	document.getElementsByName( "html_debug" )[0].checked = !document.getElementsByName( "html_debug" )[0].checked;
						else
						if ( pad.trig.st ) {g_req='pause';}

					}

					let mx = (pad.rx+pad.lx);		// 入力値(-1~+1) 

					let s = mx*g_reso_x;

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
				if ( g_req == 'req_next' )
				{
					g_req='';
					resetall();
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
						if ( info_score > g_highscore[ g_game ] )
						{
							se_ring_by_name("se:highscore");
							g_highscore[ g_game ] = info_score;
						}
						else
						{
							se_ring_by_name("se:gameover");
						}
						info_stat = 'gameover';	// ゲームオーバー
					}

				}
			}

			if ( info_stat == 'result' )
			{
				if ( g_req == 'req_next' )
				{
					g_req='';
					info_stat = 'start';
				}
			}

			// count active blocks 
			{
				info_activeblocks=0;
				for ( let o of blocks )
				{
					if ( o.flg == false ) continue;
					if ( o.typ == 'hard' ) continue;
					
					info_activeblocks++;
				}
				
			}

			// ボール生成
			if( info_stat=='start')
			{
				let sp = BALL_SP_BASE*0.75 *1.02
				info_masterball = create_ball( BALL_X, BALL_Y, BALL_M*info_scaleball, sp, radians(45) );
				info_masterball.flgmaster = true;
				info_stat = 'serve';
			}

			// サーブ
			if ( g_req == 'req_next' )
			{
				g_req=''
				if ( info_stat == 'serve' )
				{
					se_ring_by_name("se:service");
					console.log('control by ',info_flg_mouseinput?'mouse only':'key or pad');

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
				info_stage++;
				init_stage( g_game, info_stage );
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
				for ( let o of balls )
				{
					if ( o.flg == false ) continue;

					o.p.x = o.p.x + o.v.x * delta
					o.p.y = o.p.y + o.v.y * delta
				}
			}

			// racket for collition to wall 
			{
				// e:ラケットの壁との反発係数
				let e = -1/4;
			
				let o = racket;
				let wl = o.r;
				let wr = g_reso_x-o.r-1;

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
			for ( let o of balls )
			{
				if ( o.flg == false ) continue;

				let wl = o.r;
				let wr = g_reso_x-o.r;
				let wt = o.r;
				let wb = g_reso_y+o.r;

				if ( o.p.x < wl )
				{
					se_ring_by_name("se:wall", (o.flgmaster)?1:0.5 );
					o.p.x += (wl-o.p.x)*2;
		 			o.v.x = -o.v.x;
					if ( o.flgmaster )
					{
						if ( Math.abs(o.v.y) < BALL_SP_Y ) 			//	y軸下限
						{
							if ( o.v.y == 0 ) o.v.y = 1;
							o.v.y = o.v.y/Math.abs(o.v.y)*BALL_SP_Y;
						}
					}

		 		}
				if ( o.p.x > wr )
				{
					se_ring_by_name("se:wall", (o.flgmaster)?1:0.5);
					o.p.x += (wr-o.p.x)*2;
		 			o.v.x = -o.v.x;
					if ( o.flgmaster )
					{
						if ( Math.abs(o.v.y) < BALL_SP_Y ) 			//	y軸下限
						{
							if ( o.v.y == 0 ) o.v.y = 1;
							o.v.y = o.v.y/Math.abs(o.v.y)*BALL_SP_Y;
						}
					}
		 		}

				if ( o.p.y < wt )
				{
					se_ring_by_name("se:ceil", (o.flgmaster)?1:0.5);
					o.p.y += (wt-o.p.y)*2;
		 			o.v.y = -o.v.y;
					if ( o.flgmaster ) 
					{
						o.v  = vmul_scalar2( o.v, BALL_SP_CEIL ); // 天井に当たるたび速度アップ
						//o.flgHi = true;
					}
		 		}
				if ( o.p.y > wb )
				{
					// ロストボール
					if ( o.flgmaster && o.flg == true )
					{
						info_stockballs--;

						se_ring_by_name("se:lost", (o.flgmaster)?1:0.5);
						info_stat = 'lostball';
						info_timerlost = 0;
					}
					else
					{
						se_ring_by_name("se:lost2", (o.flgmaster)?1:0.5);
					}
					o.flg = false;
				}
			}
			
			// 

			// 当たりチェック関数
			function chkhit( a, b )
			{
				return length2(vsub2(a.p,b.p))-(a.r+b.r);
			}

			// colition to block
			for ( let b of balls )
			{
				if ( b.flg == false ) continue;

				for ( let blk of blocks )
				{
					if ( blk.flg == false ) continue;

					let l = chkhit(b,blk);
					if ( l < 0 )
					{
						if ( blk.typ == 'hard' ) 
						{
							{ // 埋まりを解消
								let l = chkhit(blk,b);
								let N = normalize2( vsub2(blk.p,b.p) );
								let m = vmul_scalar2(N,l);
								b.p = vadd2( b.p, m );
							}

							b.v = reflect2( b.v, normalize2( vsub2( blk.p, b.p ) ) );
							se_ring_by_name("se:hard");
						}
						else
						if ( blk.typ == 'uzu' ) 
						{
							b.v = reflect2( b.v, normalize2( vsub2( blk.p, b.p ) ) );
							b.v = vmul_scalar2(b.v,1.1);
							se_ring_by_name("se:uzu");
							blk.flg = false;
							info_score++;
						}
						else
						{
							b.v = reflect2( b.v, normalize2( vsub2( blk.p, b.p ) ) );
							se_ring_by_name("se:break");
							blk.flg = false;
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
					if ( b.flg == false ) continue;

					let P0 = racket.p;
					let P1 = vec2( prev_x,racket.p.y);
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
							if ( 1)
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


					if ( b.p.y < racket.p.y )//+b.r ) // 上半分だけ
					{
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
							if ( k > 0 ) se_ring_by_name("se:racket");
							info_mouseslowtime += 0.1;//(s) 
						}
						else 
						{	// フレーム間以外の通常の当たり判定
							let l = chkhit(b,racket);
							if ( l<0 )
							{
								let k = coll( b,racket );
								if ( k > 0 ) se_ring_by_name("se:racket");
								info_mouseslowtime += 0.1;//(s)
							}
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

						if ( a.p.x == b.p.x && a.p.y == b.p.y ) 
						{
							b.p.x+=0.01; // 同一座標解消
						}
	
						let k = calcbound( a, b );

						if ( k > 0 ) se_ring_by_name("se:toball", (a.flgmaster||b.flgmaster)?1:0.5, a.m+b.m );

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
				let o = info_masterball;
				let sp = length2(o.v);
				if ( sp > BALL_SP_TOP ) 
				{
	//				o.v = vmul_scalar2( normalize2(o.v), BALL_SP_TOP );	//	上限制限
				}
				if ( sp < BALL_SP_UNDER ) 
				{
	//				o.v = vmul_scalar2( normalize2(o.v), BALL_SP_UNDER );	//	下限制限
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
			let x = gra_cvx(g_mouse_x);
			let y = tst_y;
			let s = 10;
			gra.line( x  , y, x+s, y+s/2  );
			gra.line( x  , y, x+s/2  , y+s);
			gra.line( x+s, y+s/2, x+s/2  , y+s);
		}

		{// draw wall
			gra.color(1,1,1);
			gra.line(0,0,0,g_reso_y);
			gra.line(g_reso_x-1,0,g_reso_x-1,g_reso_y );
			gra.line(0,0,g_reso_x-1,0 );
		}
	
		{// draw blocks
			gra.color(1,1,1);
			for ( let o of blocks )
			{
				if ( o.flg == false ) continue;

				if ( o.typ == 'nml' )
				{
					gra.circlefill( o.p.x, o.p.y, o.r );
				}
				else
				if ( o.typ == 'hard' )
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
				if ( o.typ == 'uzu' )
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
		function blurball( o, n, st=0, en=Math.PI*2 )
		{
			// n = Math.floor(length2(o.v)/o.r*0.03)+1;
			let ax = o.v.x*delta/n;
			let ay = o.v.y*delta/n;
			gra.alpha(1.5/n, 'add' );
			for ( let i = 0 ; i < n ; i++ )
			{
				gra.circlefill( o.p.x-ax*i, o.p.y-ay*i, o.r, st, en  );
			}
			gra.alpha(1);
		}

		{// draw ball

			gra.color(1,1,1);
			for ( let o of balls )
			{
				if ( o.flg == false ) continue;


				if( o.flgmaster )
				{	//ブラーボール	
					//gra.color(1,1,1);
					blurball( o, 3 );
				}
				else
				{
					if ( 1 )
					{// ブラックボール
						gra.color(1,1,1);
						gra.setLineWidth(2);
						gra.circle( o.p.x, o.p.y, o.r );
						gra.setLineWidth(1);
					}
					else
					{
						blurball( o, 3 );
					}
				}
				gra.color(1,1,1);
			
				if ( flgdebug ) gra.print( Math.floor(length2(o.v)).toString(), o.p.x,o.p.y );

			}
		}


		// draw racket 
		if (1)
		{
			blurball( racket, 32, Math.PI, Math.PI*2 );
		}
		else
		{
			gra.circlefill( racket.p.x, racket.p.y, racket.r, Math.PI, Math.PI*2  );
		}
	

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
			}
			gra.color(1,1,1);
		}

		gra.color(1,0.4,0);
		{
		}
		if(0)	
		{
				var g = html_canvas.getContext('2d');
				g.fillStyle = "yellow";
				g.font = "30px Courier";
				g.textAlign = "center";
				g.textBaseline = "top";
				g.fillText("abcABCあいう漢字", 512, 175);
				
				}



		// draw score
		{
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
						
			let str_score = "SCORE "+("0000"+info_score.toString()).substr(-4);
			let str_stage = "STAGE "+info_stage.toString();
			let str_balls = "BALLS "+info_stockballs.toString();
			gra.symbol( str_score,1,0,16,"left" );
			gra.symbol( str_stage,g_reso_x/2,0,16,"center" );
			gra.symbol( str_balls,g_reso_x-2,0,16,"right" );

		
			if ( info_pause )
			{
					gra.symbol( 'PAUSE'		,g_reso_x/2,16*14,16,"center" );
			}

			switch(info_stat)
			{
				case 'serve':
					if ( 1 )
					{
						gra.symbol( 'Click to service'				,g_reso_x/2,16*14,16,"center" );
						gra.symbol( 'or'							,g_reso_x/2,16*15,16,"center" );
						gra.symbol( 'Space or Trigger to service'	,g_reso_x/2,16*16,16,"center" );
					}
					else
					{
						gra.symbol( 'クリックしてスタート'				,g_reso_x/2,16*14,16,"center" );
						gra.symbol( 'or'							,g_reso_x/2,16*15,16,"center" );
						gra.symbol( 'Space or Trigger to service'	,g_reso_x/2,16*16,16,"center" );
					}
					break;
				case 'ingame':												break;
				case 'gameover':
					let str_hiscore = 'high score '+("0000"+g_highscore[ g_game ].toString()).substr(-4);
						gra.symbol( 'GAME OVER'				,g_reso_x/2,16*13,24,"center" );
						if ( g_highscore[ g_game ] == info_score &&  g_highscore[ g_game ]>0 )
						{
							gra.symbol( 'Recorded a high score!!!'		,g_reso_x/2,16*15,16,"center" );
						}
						gra.symbol( str_hiscore	,g_reso_x/2,16*16,16,"center" );

									break;

				case 'lostball':	
					gra.symbol( 'LOST BALL'		,g_reso_x/2,16*14,20,"center" );
					break;
				default:			
					gra.symbol( 'error stat'		,g_reso_x/2,16*14,16,"center" );
					break;
				
			}
			
		}
		
		// 情報表示
		if ( flgdebug )
		{
			gra.window( 0,0,html_canvas.width,html_canvas.height);
			let K=0;
			for ( let o of balls )	
			{
				if ( o.flg == false ) continue;

				let k = 1/2*o.m*dot2(o.v,o.v);
				K+=k;
			}
			gra.print( "K="+ K,0,html_canvas.height-16 );
			//gra.print( 1/delta +"fps",html_canvas.width-50,html_canvas.height-16 );
		}
		prev_x	= racket.p.x;

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
function fullscreen_create()
//-----------------------------------------------------------------------------
{
	let body = {}

	document.addEventListener('touchmove', function(e) {e.preventDefault();}, {passive: false}); // 指ドラッグスクロールの抑制

	let m_fullscreen_original_width;
	let m_fullscreen_original_height;

	body.flgFullscreen = false;

	//-----------------------------------------------------------------------------
	body.fullscreeen_change = function( cv, callback_at_return )
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
					body.flgFullscreen = true;
				}
				else
				{
					// フルスクリーンから戻り時
					cv.width = m_fullscreen_original_width;
					cv.height = m_fullscreen_original_height;
					body.flgFullscreen = false;
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
	return body;
}

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
		g_req = 'fullscreen';

	}
	else
	{
		g_game = valRequest;
		g_req = 'reset';
	}
}
//-----------------------------------------------------------------------------
window.onload = function()
//-----------------------------------------------------------------------------
{
	// htmlのhtml_game/checked設定を読み込んで実行
	{
		var list = document.getElementsByName( "html_game" ) ;
		for ( let l of list ) if ( l.checked ) l.onchange();
	}

	main();
}

// HTML/マウス/キーボード制御
document.onmousedown = mousemovedown;
document.onmousemove = onmousemove;
//-----------------------------------------------------------------------------
function mousemovedown(e)
//-----------------------------------------------------------------------------
{
	let as2 = g_reso_x/g_reso_y;
	let as1 = html_canvas.width/html_canvas.height;
	let	W = html_canvas.width * (g_reso_x/g_reso_y);
	let	H = html_canvas.height;

	if ( e.buttons==3 ) g_req='reset';
	if ( e.buttons==2 ) g_req='pause';
	if ( e.buttons==1 )
	{

	    var rect = html_canvas.getBoundingClientRect();
        let x= (e.clientX - rect.left)/ html_canvas.width;
        let y= (e.clientY - rect.top)/ html_canvas.height;
		if ( x > 0 && x < 1 && y >0 && y < 1 )
		{
			g_mouse_click = true;	

			if ( g_inter == false ) //  チャタリング防止 ms間連続クリックの禁止
			{
				g_inter = true;
				g_hdlClick = setTimeout( function(){g_inter = false;g_mouse_click=false;}, 200 ); // チャタリング防止 ms間連続クリックの禁止
			}
		}
	}

}
//-----------------------------------------------------------------------------
function onmousemove(e)
//-----------------------------------------------------------------------------
{
	let as2 = g_reso_x/g_reso_y;
	let as1 = html_canvas.width/html_canvas.height;
	let	W = html_canvas.width * (g_reso_x/g_reso_y);
	let	H = html_canvas.height;


	{
	
	    var rect = html_canvas.getBoundingClientRect();

		g_mouse_x = (e.clientX - rect.left);

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
window.onkeyup = function( ev )
//-----------------------------------------------------------------------------
{
	let c = ev.keyCode;
	g_key[c]=false;
}

//-----------------------------------------------------------------------------
function se_ring_by_name( name, vol=1.0, freq=1.0 )
//-----------------------------------------------------------------------------
{
	switch(name)
	{
		case 'se:service':	g_se.play( 89,0,145,0.05,  'triangle', 0.8*vol );	break;	//se_ring([42]);break;//135,27,200,42,37
		case 'se:racket':	g_se.play( 1517,0.0,160,0.12,  'triangle', 0.8*vol );	break;	//se_ring([100]);break;	//242,100
		case 'se:lost':		g_se.play( 177,0.1,71,0.27,  'sawtooth', 0.1*vol );	break;	//se_ring([262]);break;//,263
		case 'se:lost2':		g_se.play( 177,0.0,71,0.27,  'sawtooth', 0.08*vol );	break;	//se_ring([262]);break;//,263
		case 'se:wall':		g_se.play( 19,0.03,269,0.05,  'triangle', 0.4*vol );	break;	//se_ring([37]);break;//37,171,241,257,223,113
		case 'se:ceil':		g_se.play( 19,0.03,106,0.4,  'triangle', 0.5*vol );	break;		//se_ring([193]);break;//,
//		case 'se:ceil':		g_se.play( 2871,0.00,106,0.37,  'square', 0.08*vol );	break;		//se_ring([193]);break;//,
		case 'se:uzu':		g_se.play(  574,0.08,286,0.12,  'triangle', 0.25*vol );	break;		//se_ring([24]);break;//24,40,248,116,28,31,61
//		case 'se:break':	g_se.play( 330,0.02,440,0.08,  'square', 0.08*vol );	break;		//se_ring([24]);break;//24,40,248,116,28,31,61
//		case 'se:break':		g_se.play( 486,0.02,729,0.08,  'triangle', 0.20*vol );	break;		//se_ring([24]);break;//24,40,248,116,28,31,61
		case 'se:break':		g_se.play( 384,0.04,768,0.06,  'triangle', 0.30*vol );	break;		//se_ring([24]);break;//24,40,248,116,28,31,61

//		case 'se:hard':		g_se.play( 486,0.02,972,0.06,  'square', 0.10*vol );	break;		//se_ring([24]);break;//24,40,248,116,28,31,61
//		case 'se:hard':	g_se.play( 1517,0.01,160,0.0,  'triangle', 0.4*vol );	break;	//se_ring([100]);break;	//242,100
//		case 'se:toball':	g_se.play(  659,0.0,231,0.137,  'square', 0.1*vol );	break;		//se_ring([115]);break;//57,26,58,81,127,,213,26

		case 'se:toball':	g_se.play( 160,0.01,1917/3,0.02*3,  'triangle', 0.4*vol );	break;	//se_ring([100]);break;	//242,100
		case 'se:hard':	g_se.play(  659,0.0,231,0.137,  'square', 0.1*vol );	break;		//se_ring([115]);break;//57,26,58,81,127,,213,26

		case 'se:highscore':	g_se.play( 392,0.10,972,0.82,  'sawtooth', 0.1*vol );	break;		//se_ring([132]);break;//,156,98,158,118,132
		case 'se:gameover':	g_se.play( 199,0.19,95,0.855,  'sine', 0.6*vol );	break;	//se_ring([139]);break;//183,47
		default:
			console.log("no se:"+name);
	}
console.log(freq);	
}
//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	let	c = ev.keyCode;
	g_key[c]=true;
	if ( c == KEY_SPC ) return false; // falseを返すことでスペースバーでのスクロールを抑制
	if ( c == KEY_D ) document.getElementsByName( "html_debug" )[0].checked = !document.getElementsByName( "html_debug" )[0].checked;
	if ( c == KEY_R ) g_req = 'reset';
	if ( c == KEY_F ) g_req = 'fullscreen';

	

}

// 右クリックでのコンテキストメニューを抑制
document.addEventListener('contextmenu', contextmenu);
function contextmenu(e) 
{
  e.preventDefault();
}