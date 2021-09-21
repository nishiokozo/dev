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
	let gra = gra_create( html_canvas );
//	let oscillo = oscillo_create( html_canvas2 );
	let ene = ene_create( html_canvas3, 3 );

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
	let min_E;
	let max_E;

	//-------------------------------------------------------------------------
	function reset()
	//-------------------------------------------------------------------------
	{
		console.log('reset:',lab.mode);
		flgStep = false;
		if (1)
		{
			flgPause = false;
		}
		count = 0;
		balls=[];
		//
		let amt_U = 0;
		
		for ( let n=0 ; n<lab.n ; n++ )
		{
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
			let p1 = vec2((n*1-(lab.n-1)/2)*8,y );
			let K = 0;
			let U = Math.abs(lab.g) * m * p1.y;
			amt_U += U;

			balls.push({p:p1 ,v:vec2(0,0) ,r:r, m:m, K:K, U:U })
		}

		min_E = 999999;
		max_E = 0;

		flgUpdated = true;
		calc_Laboratory(); // 静的パラメータを再計算

	
/*
		let emax = 0;
		for ( let ba of balls )
		{
			emax += ba.U;//+ba.K; 
		}
*/
//		oscillo.reset( amt_U );
		ene.reset( amt_U );


	}

	//-------------------------------------------------------------------------
	lab.update = function()
	//-------------------------------------------------------------------------
	{
		let dt = lab.dt;//1/(60);



		{
			gra.cls();
			let cx = 0;
			let cy = 9;
			let sh = Math.max(10,lab.h)*1.2;
			let sw = sh*(gra.ctx.canvas.width/gra.ctx.canvas.height);
			gra.window( cx-sw,cy+sh,cx+sw,cy-sh );
			gra.setAspect(1,0);
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

		// エネルギー量監視

		let amt_U = 0;
		let amt_K = 0;
		for ( let ba of balls )
		{
			amt_U += ba.U;
			amt_K += ba.K;
		}
//		oscillo.prot( 1, amt_U );
//		oscillo.prot( 2, amt_K );
//		oscillo.prot( 3, amt_U + amt_K );
		if ( balls.length >=1 ) ene.prot_pos2( 0, balls[0].p, balls[0].v, balls[0].m );
		if ( balls.length >=2 ) ene.prot_pos2( 1, balls[1].p, balls[1].v, balls[1].m );
		if ( balls.length >=3 ) ene.prot_pos2( 2, balls[2].p, balls[2].v, balls[2].m );


//		oscillo.update( lab.dt );
		ene.update( lab.dt, lab.g );

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
	}

	//-------------------------------------------------------------------------
	function exec_Laboratory( dt )
	//-------------------------------------------------------------------------
	{
		// 動的なパラメータを計算

		if ( (flgPause == false || flgStep ) )
		{
			for ( let ba of balls )
			{
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
				
if(0)
				{	// 簡易な衝突計算
					let v0 = ba.v.y;
					let [s,v]=calc_s_v(lab.g,dt,v0);			//衝突時点

					if ( ba.p.y +s < ba.r ) 
					{
						v = -ba.v.y;
						s = 0;
					}
					ba.v.y = v;
					ba.p.y += s;
				}
else				
				{	// 厳密な衝突計算
					let v0 = ba.v.y;
					let [s,v]=calc_s_v(lab.g,dt,v0);			//衝突時点

					if ( ba.p.y +s < ba.r ) 
					{
						// 衝突時刻を求める
						let t = 0;
						{
							// -(ba.p.y-ba.r)=1/2*gt^2+vt
							// 0=at^2+bt+cと置いて解の公式で衝突時間を求める
							let a=1/2*lab.g;
							let b=v0;
							let c=(ba.p.y-ba.r);
							t = func_Quadraticformula( a,b,c, -1 ); // 下向きの衝突
						}
						{
							let [s1,v1]=calc_s_v(lab.g,t   , v0);		//衝突時点
							let [s2,v2]=calc_s_v(lab.g,dt-t,-v1);		//跳ね返り終点
							v = v2;
							s = s1+s2;
						}

					}
					ba.v.y = v;
					ba.p.y += s;
				}
	
			}
			
			for ( let ba of balls )
			{
				ba.U = ba.m * Math.abs(lab.g) * (ba.p.y);	// 落ちる可能性のある高さなので半径を引く

				ba.K = 1/2*ba.m*dot2(ba.v,ba.v);

//				let amt_E = ba.U+ba.K;
//				min_E = Math.min(amt_E,min_E);
//				max_E = Math.max(amt_E,max_E);
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
		for ( let ba of balls )
		{
			gra.circle( ba.p.x, ba.p.y, ba.r );
//			gra.circlefill( ba.p.x,ba.p.y, 2 );
			let fs=14;
			gra.symbol_row( "y="+strfloat(ba.p.y-ba.r,2,1)			+"m  "	,ba.p.x+ba.r,ba.p.y+0, fs,"left" );
			gra.symbol_row( "v="+strfloat(length2(ba.v),2,1)	+"m/s"	,ba.p.x+ba.r,ba.p.y+1, fs,"left" );
			gra.symbol_row( "m="+strfloat(ba.m,2,1)			+"Kg "	,ba.p.x+ba.r,ba.p.y+2, fs,"left" );
//			gra.symbol( "U="+strfloat(ba.U,2,1)			+"J  "	,ba.p.x+ba.r,ba.p.y+3, fs,"left" );
//			gra.symbol( "K="+strfloat(ba.K,2,1)			+"J  "	,ba.p.x+ba.r,ba.p.y+4, fs,"left" );
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
/*
				let amt_U = 0;
				let amt_K = 0;
//				let amt_E = 0;
				for ( let ba of balls )
				{
					amt_U += ba.U;
					amt_K += ba.K;
//					amt_E += ba.U+ba.K;
				}
*/
				gra.color(0,0,1);
				gra.print( "総位置エネルギー　　U=" + strfloat(ene.U	,4,20) );
				gra.color(1,0,0);
				gra.print( "総運動エネルギー　　K=" + strfloat(ene.K	,4,20) );
				gra.color(1,0,1);
				gra.print( "総力学的エネルギー　E=" + strfloat(ene.U+ene.K,4,20) );
				gra.color(0,0,0);
	//			gra.print( "最小～最大　　　　E=" + strfloat(min_E	,4,2) + " ~"  + strfloat(max_E	,4,2)  );
				gra.print( "精度(計算値E/理論値E)=" + strfloat(100*(ene.U+ene.K)/ene.valmax,4,20)	 +"%");

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

