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
	// 力積=運動量の変化量
	// 速度v=rw
	// 加速度a=rω^2
	// 加速度a=v^2/r
	// 向心力F=mrω^2=mv^2/r
	// 角速度ω=2π/t	※距離÷時間
	// 角速度ω=√(a/r)
//-----------------------------------------------------------------------------
function lab_create()
//-----------------------------------------------------------------------------
{
	// 初期化
//	let gra1 = gra_create( html_canvas );
//	let gra2 = gra_create( html_canvas2 );
	let gra3 = gra_create( html_canvas3 );
	let gra4 = gra_create( html_canvas4 );
//	let gra5 = gra_create( html_canvas5 );
//	let ene = ene_create( html_canvas2, 3 );

	function calc_r( m, r0 = 10, m0 = 1 ) // 質量1の時半径10
	{
		let range = r0*r0*Math.PI / m0;	// 質量比率
		return Math.sqrt(range * m/Math.PI);
	}

/*

	gra2.color(1,1,1);

	function drawdir2( x, y, r, th )
	{
		gra2.circle( x, y, r);
		let x1=x+r*Math.cos(th);
		let y1=y+r*Math.sin(th);
		gra2.line( x,y,x1,y1);
	}
	function drawvec2( x, y, r, v )
	{
		let V = normalize2(v);
		let th = Math.atan2( V.y, V.x );
		gra2.circle( x, y, r);
		let x1=x+r*Math.cos(th);
		let y1=y+r*Math.sin(th);
		gra2.line( x,y,x1,y1);
	}

	function drawdirv2( p, r, th )
	{
		gra2.circle( p.x, p.y, r);
		let x1=p.x+r*Math.cos(th);
		let y1=p.y+r*Math.sin(th);
		gra2.line( p.x,p.y,x1,y1);
	}
	function drawvecv2( p, r, v )
	{
		let V = normalize2(v);
		let th = Math.atan2( V.y, V.x );
		gra2.circle( p.x, p.y, r);
		let x1=p.x+r*Math.cos(th);
		let y1=p.y+r*Math.sin(th);
		gra2.line( p.x,p.y,x1,y1);
	}
*/
	
	let lab = {}
	lab.hdlTimeout = null;
	lab.mode = '';
	lab.req = '';
	lab.flgdebug = false;
	//
	let flgPause = false;
	let flgStep;
	//
	lab.th = 0;
//	let hook;
	let balls=[];
	lab.m = 0;
	lab.h = 0;
	lab.l = 0;
	lab.time = 0;
	lab.k = 0;
	lab.dt = 0;
	lab.s = 0;

	//-------------------------------------------------------------------------
	function reset()
	//-------------------------------------------------------------------------
	{
		console.log('reset:',lab.mode);
		flgStep = false;
		balls=[];
		//
	
		{
			let h	= lab.h;
			let m	= lab.m;
			let l	= lab.l;
			let r	= calc_r(m)/60;
			let p0	= vec2(0, h);
			let p1	= vec2(l ,h);
			let K	= 0;
			let U	= lab.g * m * p1.y;
			let th  = lab.th;
//			hook	= {p:p0 ,v:0.1,h:0.2}
			balls.push( {th:th, v:radians(0), t:0} );
		}


	}
	//-------------------------------------------------------------------------
	lab.update = function()
	//-------------------------------------------------------------------------
	{
		// 入力処理
		flgStep = false;
		if ( lab.req != '' ) 
		{
			input_Laboratory( lab.req );
			lab.req ='';
		}

		update_Laboratory4( gra3, gra4,  lab.dt );
		lab.hdlTimeout = setTimeout( lab.update, lab.dt*1000 );

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
	function update_Laboratory4( gra3, gra4, dt )
	//-------------------------------------------------------------------------
	{

		let fs = 16;
		let ball_r = 0.1;
		let r = lab.l;
		let g = lab.g;
		let time = lab.time;//5.0/2;	// 計測時間

		function gra3_drawball( gra, th, v,a, g, flgAll )
		{

			let x = r*Math.cos(th+radians(-90));
			let y = r*Math.sin(th+radians(-90));
			gra.circle( x, y, ball_r );

			let arrow_r = 0.013;
			if ( flgAll ) 
			{//重力ベクトル
				let x1 = x;
				let y1 = y-g;
				gra.setLineWidth_row(2);
				gra.color(0,0,0);gra.line(x,y,x1,y1 );gra.circle(x1,y1, arrow_r );	// 簡易矢印
				gra.color(0,0,0);gra.symbol_row( "g" 	, x1,y1,fs,"CT");
				gra.setLineWidth_row(1);

				if ( flgAll ) 
				{//速度ベクトル
					let vh = th+radians(-90); 	// 接線角度
					let x2 = x-v*Math.cos(vh+radians(-90));
					let y2 = y-v*Math.sin(vh+radians(-90));
					gra.setLineWidth_row(3);
					gra.color(0,0,1);gra.line(x,y,x2,y2 );gra.circle(x2,y2, arrow_r );	// 簡易矢印
					gra.color(0,0,1);gra.symbol_row( "v" 	, x2,y2,fs,"CB");
					gra.setLineWidth_row(1);

				}
				if ( flgAll ) 
				{//加速ベクトル
					let vh = th+radians(-90); 	// 接線角度
					let x3 = x-a*Math.cos(vh+radians(-90));
					let y3 = y-a*Math.sin(vh+radians(-90));
					gra.color(1,0,0);gra.line(x,y,x3,y3 );gra.circle(x3,y3, arrow_r );	// 簡易矢印
					gra.setLineWidth_row(2);
					//if ( a < 0 )	{gra.color(1,0,0);gra.symbol_row( "-a" 	, x3,y3,fs,"CT");}
					//else						
					{gra.color(1,0,0);gra.symbol_row( "a" 	, x3,y3,fs,"CT");}
					gra.setLineWidth_row(1);

					gra.pattern('hasen');
					gra.color(0,0,0);gra.line(x1,y1,x3,y3);
					gra.pattern('normal');
				}
			}

			gra.setLineWidth_row(1);
			if ( flgAll ) 
			{//角度
				let st = radians(-90)+radians(0);
				let en = radians(-90)+th;
				if ( th < 0 ) [st,en]=[en,st];
				gra.color(0,0,0);gra.circle( 0, 0, r/4,st,en );


				let x1 = r/5.3*Math.cos((st+en)/2);
				let y1 = r/5.3*Math.sin((st+en)/2);
				gra.color(0,0,0);gra.symbol_row( "θ" 	, x1,y1,fs);

				gra.color(0,0,0);gra.line( 0, 0, x, y );
			}

			gra.setLineWidth_row(1);
		}


		////	初期化等

		// 円グラフ3 描画 初期描画
		{
			/// gra3
			{
				gra3.backcolor(1,1,1);
				gra3.cls();
				let cx = 0.0;
				let cy = 0.0;//lab.h;
				let sh = 3.6/2;
				let sw = sh*(gra3.ctx.canvas.width/gra3.ctx.canvas.height);
				gra3.window( cx-sw,cy+sh,cx+sw,cy-sh );
				gra3.setAspect(1,0);
			}
			// 原点 cross
			{
				gra3.color(0.8,0.8,0.8)
				gra3.line(gra3.sx,0,gra3.ex,0);
				gra3.line(0,gra3.sy,0,gra3.ey);
			}
			// 値
			{
				gra3.color(0,0,0)
				gra3.symbol_row( "π/2" 	, (r+ball_r*4),0,fs);
				gra3.symbol_row( "-π/2"	,-(r+ball_r*4),0,fs);
				gra3.symbol_row( "π" 	,0,(r+ball_r*2),fs);
				gra3.symbol_row( "0"	,0,-(r+ball_r*2),fs);

 				gra3.locate(0,20);
				gra3.color(0,0,0);gra3.print( "黒:角度θ");
				gra3.color(0,0,1);gra3.print( "青:接線速度v");
				gra3.color(1,0,0);gra3.print( "赤:接線加速度a=-gsinθ");
				gra3.locate(70,22);gra3.color(0,0,0);gra3.print( "fps:"+1/dt);
			}

			gra3.color(0,0,0);
		}

		// θ-tグラフ4 描画 初期表示
		{
			let sh = 4*3;
			{
				gra4.backcolor(1,1,1);
				gra4.cls();
				let cx = time/2;
				let cy = 0.0;//lab.h;
				let w = (gra4.ctx.canvas.width/gra4.ctx.canvas.height);
				let sw = time/(w-0.25);///(gra4.ctx.canvas.width/gra4.ctx.canvas.height);
				gra4.window( cx-sw,cy+sh,cx+sw,cy-sh );
				gra4.setAspect(1,0);
			}
	
			// 原点 cross
			{
				gra4.color(0.8,0.8,0.8)
				gra4.line(gra4.sx,0,gra4.ex,0);
				gra4.line(0,gra4.sy,0,gra4.ey);

				gra4.color(0,0,0)
				gra4.symbol_row( "θ↑",0,gra4.sy,fs,"RT");
				gra4.symbol_row( "t→",gra4.ex,0,fs,"RT");
				let peek = 3.14;
				gra4.symbol_row( "π",0,peek,fs,"RM");
				gra4.symbol_row( "-π",0,-peek,fs,"RM");
				gra4.symbol_row( "2π",0,peek*2,fs,"RM");
				gra4.symbol_row( "-2π",0,-peek*2,fs,"RM");
				
				let x = 0;
				let y = 0;
				let h = 0.2;;
				let cnt  = 0;
				gra4.line( x,y, x,y-h);gra4.symbol_row( "0", x,y-h,fs,"CT");
				for ( let x = 0 ; x < gra4.ex ; x+=dt )
				{
					if ( (cnt % 10) == 0 ) gra4.line( x,y+h, x,y-h);
					cnt++;
				}

			}
//			gra4.color(0,0,0);gra4.locate(75,10);gra4.print( time+"秒間");
			gra4.color(0,0,0);gra4.locate(77,0);gra4.print( "θ-t");

			gra4.color(0,0,0);
		}

		/////// 実部
		
		// θ-tグラフ4 描画 
		{

			let v = 0;
			let th = lab.th;
			let th0 = 0;
			let v0 = 0;
			let a0 = 0;
			for ( let t = 0 ; t <= time ; t+= dt )
			{
				let a = -g*Math.sin(th);		// 接線加速度

				let dot_r = 1.8;
				gra4.setMode('no-range');

				// ドット
				gra4.color(0,0,0);gra4.circlefill( t,th, dot_r );
				gra4.color(1,0,0);gra4.circlefill( t,a, dot_r );
				gra4.color(0,0,1);gra4.circlefill( t,v, dot_r );

				// ライン
				if ( t > 0 )
				{
//					gra4.color(0,0,0);gra4.line( t-dt,th0, t, th );
//					gra4.color(0,0,1);gra4.line( t-dt,v0, t, v );
//					gra4.color(1,0,0);gra4.line( t-dt,a0, t, a );
				}

				gra3.color(0.8,0.8,0.8);gra3_drawball( gra3, th,v*dt,a*dt,g*dt, false ); // ボールの残像
				gra4.setMode('');

				th0 = th;
				a0 = a;
				v0 = v;

				v+=a*dt;		//角速度
				th+=(v/r)*dt;
			}
			
		}

		// 円グラフ3 上描画 リアルタイム描画
		{

			let ba = balls[0];
			let v = ba.v;
			let th = ba.th;
			{
				let a = -g*Math.sin(th);		// 接線加速度
				gra3.color(0,0,0);gra3_drawball( gra3, th,v*dt,a*dt,g*dt, true );

				gra4.color(0.8,0.8,0.8);gra4.line(ba.t,gra4.sy,ba.t,gra4.ey);
				gra4.color(0,0,0);gra4.circle_row(ba.t,th,6);

				if ( ba.t+dt <= time )
				if ( !flgPause || flgStep  )
				{
					v+=a*dt;	// 角速度
					th+=(v/r)*dt;
					ba.t += dt;
				}
			}
			ba.v = v;
			ba.th = th;
		
			gra3.color(0,0,0);gra3.circle(0,0,r+ball_r); // 円の外枠。最後に描画

		}


		gra3.color(0,0,0);gra3.setLineWidth(1);gra3.setMode('');
		gra4.color(0,0,0);gra4.setLineWidth(1);gra4.setMode('');
		if ( flgPause ) gra3.print('PAUSE');
	}	
	return lab;
}

let lab = lab_create();
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
		if ( lab.dt < 0.01 ) 
		{
			lab.dt = 0.01;
			document.getElementById( "html_dt" ).value = lab.dt;
		}
	}
	if ( document.getElementById( "html_k" ) )
	{
		lab.k = document.getElementById( "html_k" ).value*1;
	}
	if ( document.getElementById( "html_m" ) )
	{
		lab.m = document.getElementById( "html_m" ).value*1;
	}
	if ( document.getElementById( "html_h" ) )
	{
		lab.h = document.getElementById( "html_h" ).value*1;
	}
	if ( document.getElementById( "html_g" ) )
	{
		lab.g = document.getElementById( "html_g" ).value*1;
	}
	if ( document.getElementById( "html_th" ) )
	{
		lab.th = document.getElementById( "html_th" ).value*1;
		lab.th = radians(lab.th);
	}
	if ( document.getElementById( "html_l" ) )
	{
		lab.l = document.getElementById( "html_l" ).value*1;
	}
	if ( document.getElementById( "html_time" ) )
	{
		lab.time = document.getElementById( "html_time" ).value*1;
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
/*
	//test
    let rect = html_canvas.getBoundingClientRect();
    let x = (e.clientX - rect.left)/ html_canvas.width;
    let y = (e.clientY - rect.top )/ html_canvas.height;
	g_mouse.x = x;
	g_mouse.y = y;
*/
}
// 右クリックでのコンテキストメニューを抑制
document.addEventListener('contextmenu', contextmenu);
function contextmenu(e) 
{
  e.preventDefault();
}

