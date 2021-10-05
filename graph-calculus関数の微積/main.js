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
//	let gra3 = gra_create( html_canvas3 );
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
	lab.flgLine = false;
	//
	let flgPause = false;
	let flgStep;
	//
	lab.th = 0;
//	let hook;
	let balls=[];
	lab.m = 0;
	lab.h = 0;
	lab.r = 0;
	lab.time = 0;
	lab.rate = 0;
	lab.sc = 0;
	lab.sh = 0;
	lab.sw = 0;
	lab.cx = 0;
	lab.cy = 0;
	lab.k = 0;
	lab.dt = 0;
	lab.dx = 0;
	lab.dth = 0;
	lab.pz = 0;
	lab.hz = 0;
	lab.s = 0;
	lab.fs = 14;

	//-------------------------------------------------------------------------
	function reset()
	//-------------------------------------------------------------------------
	{
		console.log('reset:',lab.mode);
		flgStep = true;
		balls=[];
		//
		let r = lab.r;
//		let g = lab.g;
//		let time = lab.time;//5.0/2;	// 計測時間
//		let dt = lab.dt;
	
		{
			let th  = lab.th;
			balls.push( {next_t:0, th:th, v:radians(0), t:0, tbl:[], r:0.18} );
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

		update_Laboratory4();
		lab.hdlTimeout = setTimeout( lab.update, 1 );

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
	function update_Laboratory4()
	//-------------------------------------------------------------------------
	{
		let fs = lab.fs;

		// θ,ω,α-tグラフ4 描画 初期表示
		{
			let sh = lab.sc;
			let sw = lab.sc*(gra4.ctx.canvas.width/gra4.ctx.canvas.height);
			{
				gra4.backcolor(1,1,1);
				gra4.cls();
				let cx = lab.cx;
				let cy = lab.cy;
				gra4.window( cx-sw,cy+sh,cx+sw,cy-sh );
				gra4.setAspect(1,0);
			}
	
			// 原点 cross
			{
				gra4.color(0.8,0.8,0.8)
				gra4.line(gra4.sx,0,gra4.ex,0);
				gra4.line(0,gra4.sy,0,gra4.ey);

				let w = sw/80;
				let h = sh/80;

				gra4.color(0,0,0)
				gra4.symbol_row( "y↑",-w,gra4.sy,fs,"RT");
				gra4.symbol_row( "x→",gra4.ex,-h,fs,"RT");

				for ( let y = 0 ; y < gra4.sy ; y++ )
				{
					gra4.symbol_row( ""+y	,-w,y,fs,"RM");gra4.line(-w,y,w,y);
				}
				for ( let y = 0 ; y > gra4.ey ; y-- )
				{
					gra4.symbol_row( ""+y	,-w,y,fs,"RM");gra4.line(-w,y,w,y);
				}
				for ( let x = 0 ; x < gra4.ex ; x++ )
				{
					gra4.symbol_row( ""+x	,x,-h,fs,"CT");gra4.line(x,-h,x,h);
				}
				for ( let x = 0 ; x > gra4.sx ; x-- )
				{
					gra4.symbol_row( ""+x	,x,-h,fs,"CT");gra4.line(x,-h,x,h);
				}
				for ( let x = 0 ; x < gra4.ex ; x+= lab.dx )
				{
					let h = sh/80/2; gra4.line(x,-h,x,h);
				}
				for ( let x = 0 ; x > gra4.sx ; x-= lab.dx )
				{
					let h = sh/80/2; gra4.line(x,-h,x,h);
				}

			}

			gra4.locate(6,0);

			gra4.color(0,0,0);
		}
		
		let dot_r = 2;
		let ya =-999;
		let yb =0;
		let st = lab.st;
		let en = lab.en;

		gra4.color(0.8,0.8,0.8);
//		gra4.color(0,0,0);
		gra4.line( st, 0, st, gra4.sy );
		gra4.line( en, 0, en, gra4.sy );
		gra4.color(0,0,0);
		gra4.symbol_row( "st"	,st, gra4.sy, fs, "RT");
		gra4.symbol_row( "en"	,en, gra4.sy, fs, "LT");

		let d = function(x) {}	// 導関数
		let f = function(x) {}	// 関数
		let F = function(x) {}	// 原始関数
		switch( lab.mode )
		{
		case "mode_x2":
			d = function(x)	{return  2*x;					}
			f = function(x)	{return  Math.pow(x,2);			}
			F = function(x)	{return  Math.pow(x,3)/3;		}
			break;

		case "mode_sin":
			f = function(x)	{return  Math.sin(x);			}
			d = function(x)	{return  Math.cos(x);			}
			F = function(x)	{return  -Math.cos(x);			}
			break;

		case "mode_tan":
			f = function(x)	{return  Math.tan(x);						}
			d = function(x)	{return  1/Math.pow(Math.cos(x),2);			}
			F = function(x)	{return  -Math.log(Math.abs(Math.cos(x)));	}
			break;

		}



		{// 面積計測 & 棒グラフ描画

			// 定積分
			let f0 = F(st);
			let f1 = F(en);
			let s = f1-f0;

			// 区分求積法
			let S = 0;
			for ( let x = st  ; x <= en-lab.dx+0.0001 ; x += lab.dx	 )
			{
				let y = f(x+lab.dx);
				if ( y > 0 )
				{
					gra4.color(0.5,0.5,1);
				}
				else
				{
					gra4.color(1,0.5,0.5);
				}
				gra4.fill(x,y,x+lab.dx,0);
					gra4.color(0,0,0);
					gra4.color(0.5,0.5,0.5);
				S += lab.dx*y;
			}

			// 情報表示
			{
				let funcnames = 
				{
						'mode_x2'	:{func_f:"f(x)=x^2",		func_d:"d(x)=2x"	,	func_F:"F(x)=1/3x^3"},
						'mode_sin'	:{func_f:"f(x)=sin(x)",		func_d:"d(x)=cos(x)"	,	func_F:"F(x)=-cos(x)"},
						'mode_tan'	:{func_f:"f(x)=tan(x)",		func_d:"d(x)=1/cos(x)^2",	func_F:"F(x)=-log(abs(cos(x)))"},
				};
				gra4.color(0,0,0);
				gra4.locate(0,20);
				gra4.print( "関数　　　　　　："+funcnames[lab.mode]['func_f'] );
				gra4.print( "導関数（接線）　："+funcnames[lab.mode]['func_d'] );
				gra4.print( "原始関数（面積）："+funcnames[lab.mode]['func_F'] );
				gra4.locate(66,20);
				gra4.print( "定積分で求めた面積st～en "+s );
				gra4.print( "区分求積法での面積st～en "+S );
				gra4.print( "面積精度:"+(100*s/S)+"%" );
	//		document.getElementById("html_msg1").innerHTML = "定積分で求めた面積st～en "+s;
	//		document.getElementById("html_msg2").innerHTML = "区分求積法での面積st～en "+S;
			}
		}


		// 描画 接線
		if( lab.flgLine )
		{
			function draw( x )
			{

				let y = f(x);

				let t = d(x); // 接線
				gra4.color(0,1,0);
				gra4.color(0.8,0.8,0.8);
				gra4.line( x,y, x+1, y+t );			// サイン波描画
				gra4.line( x,y, x-1, y-t );			// サイン波描画

			}
			for ( let x = 0  ; x <= gra4.ex+0.00001 ; x += lab.dx ) draw(x);
			for ( let x = 0  ; x >= gra4.sx-0.00001 ; x -= lab.dx ) draw(x);
		}
		
		// 描画 関数曲線
		{
			function draw( x, x0 )
			{

				let y = f(x);
				gra4.color(0,0,0);gra4.dot( x, y, dot_r );			// サイン波描画

				let y0 = f(x0);
				gra4.color(0,0,0);gra4.line( x, y, x0, y0 );


			}
			for ( let x = lab.dx  ; x <= gra4.ex+0.00001 ; x += lab.dx ) draw(x, x-lab.dx);
			for ( let x =-lab.dx  ; x >= gra4.sx-0.00001 ; x -= lab.dx ) draw(x, x+lab.dx);
		}
	
		gra4.color(0,0,0);gra4.setLineWidth(1);gra4.setMode('');
		if ( flgPause ) gra4.print('PAUSE');


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
	if ( document.getElementsByName( "html_debug" ).length > 0 ) 
	{
		if ( document.getElementsByName( "html_debug" )[0] ) 
		{
			lab.flgdebug = document.getElementsByName( "html_debug" )[0].checked;
		}
	}
	if ( document.getElementsByName( "html_line" ).length > 0 ) 
	{
		if ( document.getElementsByName( "html_line" )[0] ) 
		{
			lab.flgLine = document.getElementsByName( "html_line" )[0].checked;
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
		if ( lab.dt < 0.00001 ) 
		{
			lab.dt = 0.00001;
			document.getElementById( "html_dt" ).value = lab.dt;
		}
	}
	if ( document.getElementById( "html_dx" ) )
	{
		lab.dx = document.getElementById( "html_dx" ).value*1;
		if ( lab.dx < 0.001 ) 
		{
			lab.dx = 0.001;
			document.getElementById( "html_dx" ).value = lab.dx;
		}
	}
	if ( document.getElementById( "html_dth" ) )
	{
		lab.dth = document.getElementById( "html_dth" ).value*1;
		if ( lab.dth < 0.01 ) 
		{
			lab.dth = 0.01;
			document.getElementById( "html_dth" ).value = lab.dth;
		}
		lab.dth = radians(lab.dth);
	}
	if ( document.getElementById( "html_st" ) )
	{
		lab.st = document.getElementById( "html_st" ).value*1;
	}
	if ( document.getElementById( "html_en" ) )
	{
		lab.en = document.getElementById( "html_en" ).value*1;
	}
	if ( document.getElementById( "html_pz" ) )
	{
		lab.pz = document.getElementById( "html_pz" ).value*1;
		lab.pz = radians(lab.pz);
	}
	if ( document.getElementById( "html_hz" ) )
	{
		lab.hz = document.getElementById( "html_hz" ).value*1;
		if ( lab.hz < 0.01 ) 
		{
			lab.hz = 0.01;
			document.getElementById( "html_hz" ).value = lab.hz;
		}
		//lab.hz = radians(lab.hz);
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
	if ( document.getElementById( "html_r" ) )
	{
		lab.r = document.getElementById( "html_r" ).value*1;
	}
	if ( document.getElementById( "html_time" ) )
	{
		lab.time = document.getElementById( "html_time" ).value*1;
	}
	if ( document.getElementById( "html_rate" ) )
	{
		lab.rate = document.getElementById( "html_rate" ).value*1;
	}
	if ( document.getElementById( "html_sc" ) )
	{
		lab.sc = document.getElementById( "html_sc" ).value*1;
	}
	if ( document.getElementById( "html_sh" ) )
	{
		lab.sh = document.getElementById( "html_sh" ).value*1;
	}
	if ( document.getElementById( "html_sw" ) )
	{
		lab.sw = document.getElementById( "html_sw" ).value*1;
	}
	if ( document.getElementById( "html_cx" ) )
	{
		lab.cx = document.getElementById( "html_cx" ).value*1;
	}
	if ( document.getElementById( "html_cy" ) )
	{
		lab.cy = document.getElementById( "html_cy" ).value*1;
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

