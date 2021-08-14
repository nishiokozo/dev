"use strict";
// ばねの表示
	// メモ＞
	// 時間:t(s)
	// 質量:m(kg)
	// ばね係数:k(N/m)
	// 加速度:a(m/s^2)
	// 速度:v=at(m/s)
	// 距離:x=1/2vt(m)
	// 距離:x=1/2at^2(m)
	// 重力加速度:g=9.8(m/s^2)
	// 力:F=ma(N)
	// 力:F=-kx(N)
	// 運動量:p=mv(kgm/s=N・s)
	// 力積:I=mv'– mv
	// 力積:I=Ft(N・s)
	// エネルギー:K=mgh(J)
	// エネルギー:K=Fx(J)
	// エネルギー:K=1/2Fvt(J)
	// エネルギー:K=1/2mv^2(J)
	// 仕事:W=Fs(J,kgm/s/s)
	// 仕事:W=mg(x2-x1)
	// 仕事率:P=Fv P=W/t=Fx/t=Fv(W)
	// 運動量保存の式:m1v1+m2v2=m1v1'+m2v2'
	// 力学的エネルギー保存の式:1/2mv^2-Fx=1/2mv'^2
	// 反発係数の式:e=-(vb'-va')/(vb-va)	※ -衝突後の速度/衝突前の速度
	// 換算質量:1/μ=1/m1+1/m2, μ=,1m2/(m1+m2)
	// 重心位置:rg=(m1r1+m2r2)
	// 相対位置:r=r2-r1;
	// ばね係数:k=F/x
	// 仕事＝運動エネルギーの変化量
	// 力積＝運動量の変化量

//-----------------------------------------------------------------------------
function create_lab()
//-----------------------------------------------------------------------------
{
	// 初期化
	let gra = gra_create( html_canvas, 'as-window' );
	let gra2 = gra_create( html_canvas2, 'as-window' );

	function calc_r( m, r0 = 10, m0 = 1 ) // 質量1の時半径10
	{
		let range = r0*r0*Math.PI / m0;	// 質量比率
		return Math.sqrt(range * m/Math.PI);
	}

	
	let lab = {}
	lab.hdlTimeout = null;
	lab.mode = '';
	lab.req = '';
	lab.flgdebug = false;
	//
	let flgPause;
	let flgStep;
	let flgUpdated;
//	let info_stat;
	let count;
	//
	lab.th = 0;
	let hook;
	let balls=[];
	lab.m = 0;
	lab.h = 0;
	lab.l = 0;
	lab.k = 0;
	lab.dt = 0;
	lab.red = 0;
	lab.blue = 0;
//	let bane_F = 0;
//	let bane_a = 0;
//	let bane_naturallength; //自然長k
//	let bane_length; // ばね長さ
//	let p_box;
//	let p_ball;
//	let bane_x;
//	let ball_U;
//	let balls[0].K;
//	let amt_E;
	let min_E;
	let max_E;

/*
	function logparam()
	{
		function round(v)
		{
			return Math.round(v*100)/100;
		}
//		let a = {"Δt":lab.dt,"自然長":bane_naturallength,"ばね長":round(bane_length),"伸縮":round(bane_x), "-kx":round(bane_F)};
		let b = {v:round(balls[0].v.x), p:round(balls[0].p.x)};
		console.log(count,a,b );
	}
*/
	//-------------------------------------------------------------------------
	function reset()
	//-------------------------------------------------------------------------
	{
		console.log('reset:',lab.mode);
		flgStep = false;
//		info_stat = '<設定中>';
		if (1)
		{
			flgPause = false;
//			info_stat = '<実験中>';
		}
		count = 0;
		balls=[];
		//
//		bane_naturallength = 100;
//		balls[0].K = 0;
		for ( let n=0 ; n<lab.n ; n++ )
		{
//			let h = 20;
//			let w = 12;
			let m = lab.m;
			let h = lab.h;
			if ( n > 0 )
			{
				m = Math.random()*(m-m*0.1)+m*0.1;
				h = Math.random()*(h-h*0.1)+h*0.1;
			
				m = Math.floor(m*10)/10;
				h = Math.floor(h*10)/10;
			}
			let r = calc_r(m)/10;
			let y = h+r;
//			let p0 = vec2(0, y );
//			let p1 = vec2(lab.l ,y );
			let p1 = vec2((n*1-(lab.n-1)/2)*8,y );
			let K = 0;
			let U = lab.g * m * p1.y;
//			hook	= {p:p0 ,w:w,h:h}

			balls.push({p:p1 ,v:vec2(0,0) ,r:r, m:m, K:K, U:U })
		}
//console.log(lab.m);


		//amt_E = 0;
		min_E = 999999;
		max_E = 0;

		flgUpdated = true;
		calc_Laboratory(); // 静的パラメータを再計算

//		high = balls[0].p.y;

		graph_E_max = 0;
		for ( let bl of balls )
		{
			//if ( graph_E_max <= bl.U ) 
			graph_E_max += bl.U+bl.K; 
		}
		graph_reqReset = true;


	}

	let graph_reqReset = false;;
	let graph_x = 0;
	let graph_E_max = 0;
	let graph_U_p0 = vec2(0,0);
	let graph_U_p1 = vec2(0,0);
	let graph_K_p0 = vec2(0,0);
	let graph_K_p1 = vec2(0,0);
	let graph_E_p0 = vec2(0,0);
	let graph_E_p1 = vec2(0,0);
	//-------------------------------------------------------------------------
	lab.update = function()
	//-------------------------------------------------------------------------
	{
		let dt = lab.dt;//1/(60);

		if ( graph_reqReset ) 
		{
			graph_reqReset = false;
			let sec = 5.0;
			gra2.window( 0,graph_E_max*1.1,sec/lab.dt,-graph_E_max*0.1 );
			gra2.setAspect(1,0);
			gra2.cls();
			//gra2.line(gra2.sx,0,gra2.ex,0);

			{
				let amt_U = 0;
				let amt_K = 0;
				for ( let bl of balls )
				{
					amt_U += bl.U;
					amt_K += bl.K;
				}
				graph_x = gra2.sx;
				graph_U_p0.x = graph_x;
				graph_U_p1.x = graph_x;
				graph_U_p0.y = amt_U;
				graph_U_p1.y = amt_U;

				graph_K_p0.x = graph_x;
				graph_K_p1.x = graph_x;
				graph_K_p0.y = amt_K;
				graph_K_p1.y = amt_K;

				graph_E_p0.x = graph_x;
				graph_E_p1.x = graph_x;
				graph_E_p0.y = amt_K+amt_U;
				graph_E_p1.y = amt_K+amt_U;
			}
		}
		function draw_graph()
		{
			let amt_U = 0;
			let amt_K = 0;
			for ( let bl of balls )
			{
				amt_U += bl.U;
				amt_K += bl.K;
			}

			if ( graph_x > 0 )
			{
				graph_U_p1 = vec2( graph_x, amt_U );
				{
					gra2.color(0,0,1);
					gra2.line( graph_U_p0.x, graph_U_p0.y, graph_U_p1.x, graph_U_p1.y );
					graph_U_p0 = graph_U_p1;
				}

				{
					graph_K_p1 = vec2( graph_x, amt_K );
					gra2.color(1,0,0);
					gra2.line( graph_K_p0.x, graph_K_p0.y, graph_K_p1.x, graph_K_p1.y );
					graph_K_p0 = graph_K_p1;
				}
				gra2.color(1,0,1);
				{
					graph_E_p1 = vec2( graph_x, amt_U+amt_K );
					gra2.line( graph_E_p0.x, graph_E_p0.y, graph_E_p1.x, graph_E_p1.y );
					graph_E_p0 = graph_E_p1;
				}
				gra2.color(0,0,0);
			}
			if ( ++graph_x > gra2.ex ) 
			{
				graph_reqReset = true;
			}
		}


if(1)
		{
			gra.cls();
			let cx = 0;
			let cy = 9;
//			let sc = (lab.n-3)*lab.h*1.2;
//			sc = Math.max(sc,12);
//			let n = Math.max(3,Math.floor(lab.n-3));
//			sc = (n/2)*lab.h*0.85;
			let sh = Math.max(10,lab.h)*1.2;
			let sw = sh*(gra.ctx.canvas.width/gra.ctx.canvas.height);
			gra.window( cx-sw,cy+sh,cx+sw,cy-sh );
			gra.setAspect(1,0);
		}
		else
		{
			gra.cls();
			let cx = 0;
			let cy = 0;
			let sh = gra.ctx.canvas.width/2;
			let sw = gra.ctx.canvas.height/2;
			let sc = 1;
			gra.window( -sw*sc,-sh*sc,sw*sc,sh*sc );
		}

		// 入力処理
		flgStep = false;
		if ( lab.req != '' ) 
		{
			input_Laboratory( lab.req );
			lab.req ='';
		}

		// 実験室
		exec_Laboratory( dt );

		// 静的パラメータの再計算
		calc_Laboratory();

		// 描画
		draw_Laboratory();

		// グラフ描画
		draw_graph();

		if ( flgPause ) gra.print('PAUSE');

		

		lab.hdlTimeout = setTimeout( lab.update, dt*1000 );
	}
	//-------------------------------------------------------------------------
	function input_Laboratory( req )
	//-------------------------------------------------------------------------
	{
		switch( lab.req )
		{
			case 'pause': flgPause = !flgPause; break;
			case 'step': flgStep = true; break;
			case 'reset': reset(); break;
			default:console.error("error req ",lab.req );
				break;
		}
	}

	//-------------------------------------------------------------------------
	function calc_Laboratory()
	//-------------------------------------------------------------------------
	{
		// 静的なパラメータを計算
		
//
//		bane_length = length2( vsub2(p_ball,p_box) );
//		bane_x = bane_length-bane_naturallength;
//		banel_U = 1/2*lab.k*Math.pow(bane_x,2);		// 1/2kx^2
//		bane_F = -lab.k*bane_x;					//	F=-kx
//		bane_a = bane_F/lab.m;					//	a=F/m

		for ( let bl of balls )
		{
			bl.U = bl.m * Math.abs(lab.g) * (bl.p.y-bl.r);	// 落ちる可能性のある高さなので半径を引く
		}
	}

//let high = 0;
	//-------------------------------------------------------------------------
	function exec_Laboratory( dt )
	//-------------------------------------------------------------------------
	{
		// 動的なパラメータを計算

//		if ( info_stat == '<実験中>' )
		if ( (flgPause == false || flgStep ) )
		{
/*
			let t=dt;
//			let a=bane_a;
			if(0)
			{
				let v0=balls[0].v.x;			
				balls[0].v.x += a*t;
				lab.s = 1/2*a*t*t + v0*t;	//1/2at^2
				balls[0].p.x += lab.s;
			}
			else
			if(1)
			{
				// 単振動を移動量に取り入れた物
				balls[0].v.x += a*t;
				let A = 50;//振幅
				let th = Math.acos(bane_x/A);
lab.th = th;				
				if ( a>0 ) th+=Math.PI;
				let w = Math.sqrt(lab.k/lab.m);	// ω=√(k/m)
				th += w *dt ;
				let x = -A*Math.sin( th );

				
if ( count < 20 ) 
{
	let a= degrees(Math.acos(-0.5))
	let b= degrees(Math.acos( 0.5))
	console.log(count,bane_x,w, a, b, Math.cos(a), Math.cos(b) );
}
				lab.s = x;
				balls[0].p.x += lab.s;
			}
			else
*/
			// フレーム内の等速運動
			
//			let y0 = balls[0].p.y;
if(0)
			for ( let bl of balls )
			{// 振り子
				let vg = vec2( 0, lab.g * dt);
				let v0 = vsub2( bl.p, hook.p );
				let v1 = vadd2( v0, vg );
				let v2 = vmul_scalar2( normalize2( v1 ), lab.l );
				let v3 = vsub2( v2, v0 );
				bl.v = vadd2( bl.v, v3 );
				bl.p = vadd2( bl.p, bl.v );
			} 
			else
if(0)
			for ( let bl of balls )
			{// 振り子
				let vg = vec2( 0, lab.g * dt);
//				let v0 = vsub2( bl.p, hook.p );
//				let v1 = vadd2( v0, vg );
//				let v2 = vmul_scalar2( normalize2( v1 ), lab.l );
//				let v3 = vsub2( v2, v0 );

				let v = vadd2( bl.v, vg );
				let p = vadd2( bl.p, vmul_scalar2(v,dt) );
				if ( p.y < bl.r )
				{
//					high = 0;
					bl.v.y = -bl.v.y ;
				}
				else
				{
					bl.v = vadd2( bl.v, vg );
					bl.p = vadd2( bl.p, vmul_scalar2(bl.v,dt) );
				}
			} 
			else
			{// 厳密な落下
				function func_Quadraticformula( a,b,c, pm ) //二次方程式の解の公式
				{
					// return (-b±√(b^2-4ac))/2a;
					// pm= 1:+向きの衝突
					// pm=-1:-向きの衝突
					let d = pm*Math.sqrt(b*b-4*a*c);
					return (-b+d)/(2*a);
				}
				function calc_s_v( g,t,v0 )
				{	// 相対距離と最終速度を計算
					let s = 1/2*g*t*t+v0*t;
					let v = 2*(s-v0*t)/t+v0;
					return [s,v]
				}
				
				for ( let bl of balls )
				{
					let v0 = bl.v.y;
					let [s,v]=calc_s_v(lab.g,dt,v0);			//衝突時点

					if ( bl.p.y +s < bl.r ) 
					{
	//					high = 0;
						// 衝突時刻を求める
						let t = 0;
						{
							// -(bl.p.y-bl.r)=1/2*gt^2+vt
							// 0=at^2+bt+cと置いて解の公式で衝突時間を求める
							let a=1/2*lab.g;
							let b=v0;
							let c=(bl.p.y-bl.r);
							t = func_Quadraticformula( a,b,c, -1 ); // 下向きの衝突
						}
						{
							let [s1,v1]=calc_s_v(lab.g,t   , v0);		//衝突時点
							let [s2,v2]=calc_s_v(lab.g,dt-t,-v1);		//跳ね返り終点
							v = v2;
							s = s1+s2;
						}

					}
					bl.v.y = v;
					bl.p.y += s;
				}
				
	
			}
//			if ( balls[0].p.y > high ) high = balls[0].p.y;
			
			for ( let bl of balls )
			{
				bl.K = 1/2*bl.m*dot2(bl.v,bl.v);

				let amt_E = bl.U+bl.K;
				min_E = Math.min(amt_E,min_E);
				max_E = Math.max(amt_E,max_E);
			}

			flgUpdated = true;

			count++;
		}

	}

	
	//-------------------------------------------------------------------------
	function draw_Laboratory()
	//-------------------------------------------------------------------------
	{
//		gra.color(1,0,0);
//		gra.line( gra.sx,high,gra.ex,high );
//		gra.symbol( strfloat(high,3,3)	,gra.sx,high,10,"left" );

		gra.color(0,0,0);

if(0)
{
		gra.color(1,0,0);
		gra.circle(0,lab.red,balls[0].r);
		gra.color(0,0,0);
		gra.color(0,0,1);
		gra.line(0,lab.red,0,lab.blue);
		gra.color(0,0,0);
}

		// navi
		function drawdir2( x, y, r, th )
		{
			gra.circle( x, y, r);
			let x1=x+r*Math.cos(lab.th);
			let y1=y+r*Math.sin(lab.th);
			gra.line( x,y,x1,y1);
		}
	//	drawdir2( -100,100,18,radians(90) );

if(0)
		{// draw 天井に固定されたフック
			let x0 = hook.p.x-hook.w;
			let y0 = hook.p.y+hook.h;
			let y1 = hook.p.y;
			let x1 = hook.p.x+hook.w;
			gra.line( x0,y0,x0,y1 );
			gra.line( x1,y0,x1,y1 );
			gra.line( x0,y1,x1,y1 );
			gra.line( gra.sx,y0,x0,y0 );
			gra.line( gra.ex,y0,x1,y0 );
		}
		{
			// グラウンド
			gra.line( gra.sx,0,gra.ex,0 );
		}

		// draw ball
		for ( let bl of balls )
		{
			gra.circle( bl.p.x, bl.p.y, bl.r );
//			gra.circlefill( bl.p.x,bl.p.y, 2 );
			let fs=14;
			gra.symbol_row( "y="+strfloat(bl.p.y-bl.r,2,1)			+"m  "	,bl.p.x+bl.r,bl.p.y+0, fs,"left" );
			gra.symbol_row( "v="+strfloat(length2(bl.v),2,1)	+"m/s"	,bl.p.x+bl.r,bl.p.y+1, fs,"left" );
			gra.symbol_row( "m="+strfloat(bl.m,2,1)			+"Kg "	,bl.p.x+bl.r,bl.p.y+2, fs,"left" );
//			gra.symbol( "U="+strfloat(bl.U,2,1)			+"J  "	,bl.p.x+bl.r,bl.p.y+3, fs,"left" );
//			gra.symbol( "K="+strfloat(bl.K,2,1)			+"J  "	,bl.p.x+bl.r,bl.p.y+4, fs,"left" );
		}

		// draw bane
if(0)		{
			let p0 = hook.p;
			let p1 = balls[0].p;
			gra.circlefill( p0.x,p0.y, 2 );
			gra.circlefill( p1.x,p1.y, 2 );
			gra.line2( p0, p1 );

			let fs=10;

			// 補助線:質量
if(1)
			
/*
			// 補助線:自然長
			gra.drawmesure_line( p0.x, 20, p0.x+bane_naturallength, 20, 4 );
			gra.symbol( "自然長="+bane_naturallength, p0.x+14, 30, fs );

			// 補助線:伸縮長
			gra.drawmesure_line( p0.x+bane_naturallength, 34, p0.x+bane_length, 34, 4 );
			gra.symbol( "伸縮長x="+strfloat(bane_x,3,1), (p0.x+bane_naturallength), 45, fs );
*/

			// 補助線:力
if(0)
			{
				let x = balls[0].p.x-balls[0].r;
				let y = balls[0].p.y-20;
				let p = vec2(x,y);
				let d = bane_F>0?1:-1;

				gra.drawarrow2d( p, vec2( d, 0 ), 15, 2 );
				gra.symbol( "-kx="+strfloat(bane_F,3,1)	,x,y-20, fs );
				gra.symbol( "ma="+strfloat(balls[0].m*bane_a,3,1)	,x,y-30, fs );
//				gra.symbol( "s="+strfloat(lab.s,3,1)	,x,y-40, fs );
			}
		}

		// 情報表示
		{
			let K=0;
			let x = 0;
			let y = 0;

			function strFloatround( v, r=3, f=2 ) // 指数部3桁、小数部2桁
			{
				if ( v < Math.pow(10,r) )
				{
					let a = Math.pow(10,f);
					
					let b = Math.floor( v * a )/a;
				
					let s = ("            "+b.toString()).substr(-(r+f));
					return  s;
				}
				else
				{
					return  "over";
				}
			}

			gra.locate(x,y++);

			{
				let amt_U = 0;
				let amt_K = 0;
//				let amt_E = 0;
				for ( let bl of balls )
				{
					amt_U += bl.U;
					amt_K += bl.K;
//					amt_E += bl.U+bl.K;
				}

				gra.color(0,0,1);
				gra.print( "総位置エネルギー　　U=" + strfloat(amt_U	,4,20) );
				gra.color(1,0,0);
				gra.print( "総運動エネルギー　　K=" + strfloat(amt_K	,4,20) );
				gra.color(1,0,1);
				gra.print( "総力学的エネルギー　E=" + strfloat(amt_U+amt_K,4,20) );
				gra.color(0,0,0);
	//			gra.print( "力学的エネルギー　E=" + amt_U+amt_K );
	//			gra.print( "最小～最大　　　　E=" + strfloat(min_E	,4,2) + " ~"  + strfloat(max_E	,4,2)  );
				{
					let a = amt_U+amt_K;
					let b = graph_E_max;
//					let c = Math.min(a,b);
//					let d = Math.max(a,b);
					gra.print( "精度(計算値E/理論値E)=" + strfloat(100*a/b,4,20)	 +"%");
				}

			}
	//			gra.print( high );
		}

	}
	
	return lab;
}

let lab = create_lab();
//-----------------------------------------------------------------------------
window.onload = function()
//-----------------------------------------------------------------------------
{
	// onloadになってからhtmlの設定を読み込んでからリセット
	html_onchange('reset');
	lab.update();
}

//-----------------------------------------------------------------------------
function html_onchange( cmd )
//-----------------------------------------------------------------------------
{
	// 状態切り替え
	if ( cmd == 'debug' )
	{
		// UIの描画が変わるものは個々で変えてその後読み直す
		document.getElementsByName( "html_debug" )[0].checked = !document.getElementsByName( "html_debug" )[0].checked;
	}
	else
	if ( cmd != undefined )
	{
		lab.req = cmd;
	}

	// HTMLからの設定を取得
		
	// type='checkbox'
	if ( document.getElementsByName( "html_debug" ) > 0 ) 
	{
		if ( document.getElementsByName( "html_debug" )[0] ) 
		{
			lab.flgdebug = document.getElementsByName( "html_debug" )[0].checked;
		}
	}

	// type='radio'
	if ( document.getElementsByName( "html_mode" ).length > 0 )
	{
		let list = document.getElementsByName( "html_mode" ) ;
		for ( let l of list ) if ( l.checked ) lab.mode = l.value;
	}

	// type='text'
	if ( document.getElementById( "html_dt" ) )
	{
		lab.dt = document.getElementById( "html_dt" ).value*1;
	}
	if ( document.getElementById( "html_k" ) )
	{
		lab.k = document.getElementById( "html_k" ).value*1;
	}
	if ( document.getElementById( "html_m" ) )
	{
		lab.m = document.getElementById( "html_m" ).value*1;
	}
	if ( document.getElementById( "html_n" ) )
	{
		lab.n = document.getElementById( "html_n" ).value*1;
	}
	if ( document.getElementById( "html_h" ) )
	{
		lab.h = document.getElementById( "html_h" ).value*1;
	}
	if ( document.getElementById( "html_g" ) )
	{
		lab.g = document.getElementById( "html_g" ).value*1;
	}
	if ( document.getElementById( "html_l" ) )
	{
		lab.l = document.getElementById( "html_l" ).value*1;
	}
}
// キー入力
let g_key=Array(256);
//-----------------------------------------------------------------------------
window.onkeyup = function( ev )
//-----------------------------------------------------------------------------
{
	g_key[ev.keyCode]=false;
}
//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	g_key[ev.keyCode]=true;
	if ( g_key[KEY_D] )		html_onchange('debug');
	if ( g_key[KEY_R] )		html_onchange('reset');
	if ( g_key[KEY_SPC] )	html_onchange('step');
	if ( g_key[KEY_P] )		html_onchange('pause')
	//;
//	if ( g_key[KEY_LEFT] )		html_onchange('shrink');
//	if ( g_key[KEY_RIGHT] )		html_onchange('streach');
//	if ( g_key[KEY_CR] )		html_onchange('release');
	//
	if ( g_key[KEY_SPC] ) return false; // falseを返すことでスペースバーでのスクロールを抑制
}

//マウス入力
let g_mouse = {x:0,y:0,l:false,r:false};
document.onmousedown = mousemovedown;
document.onmouseup = mousemoveup;
document.onmousemove = onmousemove;
//-----------------------------------------------------------------------------
function mousemoveup(e)
//-----------------------------------------------------------------------------
{
	if ( e.button==0 )	g_mouse.l=false;
	if ( e.button==2 )	g_mouse.r=false;
}
//-----------------------------------------------------------------------------
function mousemovedown(e)
//-----------------------------------------------------------------------------
{
	if ( e.button==0 )	g_mouse.l=true;
	if ( e.button==2 )	g_mouse.r=true;
}
//-----------------------------------------------------------------------------
function onmousemove(e)
//-----------------------------------------------------------------------------
{
	//test
    let rect = html_canvas.getBoundingClientRect();
    let x = (e.clientX - rect.left)/ html_canvas.width;
    let y = (e.clientY - rect.top )/ html_canvas.height;
	g_mouse.x = x;
	g_mouse.y = y;
}
// 右クリックでのコンテキストメニューを抑制
document.addEventListener('contextmenu', contextmenu);
function contextmenu(e) 
{
  e.preventDefault();
}

