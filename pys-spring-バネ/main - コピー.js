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

	function calc_r( m, r0 = 10, m0 = 1 ) // 質量1の時半径10
	{
		let range = r0*r0*Math.PI / m0;	// 質量比率
		return Math.sqrt(range * m/Math.PI);
	}

	function strfloat( v, r=4, f=2 ) // r指数部桁、f小数部桁
	{
		let a = Math.pow(10,f);
		let b = Math.floor( v );
		let c = parseInt( v, 10 );	// 小数点以下切り捨て
		let d = Math.abs(v-c);
		let e = Math.round( d*a );	// 四捨五入
		c = ('      '+c).substr(-r);
		e = (e+'000000').substr(0,f);
		return c+"."+ e;
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
	let info_stat;
	let count;
	let sin_th;
//	let first;
	//
	lab.th = 0;
	let box;
	let ball;
	lab.m = 0;
	lab.k = 0;
	lab.t = 0;
	lab.s = 0;
	let bane_F = 0;
	let bane_a = 0;
	let bane_naturallength; //自然長k
	let bane_length; // ばね長さ
	let sin_bane_length; // ばね長さ
	let p_box;
	let p_ball;
	let sin_p_box;
	let sin_p_ball;
	let bane_x;
	let sin_bane_x;
	let bane_U;
	let ball_K;
	let min_E;
	let max_E;

	function logparam()
	{
		function round(v)
		{
			return Math.round(v*100)/100;
		}
		let a = {"Δt":lab.t,"自然長":bane_naturallength,"ばね長":round(bane_length),"伸縮":round(bane_x), "-kx":round(bane_F)};
		let b = {v:round(ball.v.x), p:round(ball.p.x)};
		console.log(count,a,b );
	}

	//-------------------------------------------------------------------------
	function reset()
	//-------------------------------------------------------------------------
	{
		console.log('reset:',lab.mode);
		flgStep = false;
		info_stat = '<設定中>';
		if (1)
		{
			//flgStep = true;
			flgPause = true;
			info_stat = '<実験中>';
		}
		count = 0;
		//
		bane_naturallength = 100;
		ball_K = 0;
		{
			let w = 15;
			let r = 11;
			box		= {p:vec2(-bane_naturallength-r-w-50,0) ,w:w,h:r+1}
			ball	= {p:vec2(0,0)  ,v:vec2(0,0) ,r:r}
		}
		min_E = 999999;
		max_E = 0;

		flgUpdated = true;
		calc_Laboratory(); // 静的パラメータを再計算

		sin_th = radians(-90);
	}
	//-------------------------------------------------------------------------
	lab.update = function()
	//-------------------------------------------------------------------------
	{
		{
			gra.cls();
			let x = -90;
			gra.window( x-120,-120,x+120,120 );
		}

		// 入力処理
		flgStep = false;
		if ( lab.req != '' ) 
		{
			input_Laboratory( lab.req );
			lab.req ='';
		}

		let delta = lab.t;//1/(60);

		// 実験室
		exec_Laboratory( delta );

		// 静的パラメータの再計算
		calc_Laboratory();

		// 描画
		draw_Laboratory();
		if ( flgPause ) gra.print('PAUSE');

		lab.hdlTimeout = setTimeout( lab.update, delta*1000 );
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
		
		p_box = vec2(box.p.x+box.w,box.p.y);
		p_ball = vec2(ball.p.x-ball.r,ball.p.y);

		bane_length = length2( vsub2(p_ball,p_box) );
		bane_x = bane_length-bane_naturallength;
		bane_U = 1/2*lab.k*Math.pow(bane_x,2);		// 1/2kx^2
		bane_F = -lab.k*bane_x;					//	F=-kx
		bane_a = bane_F/lab.m;					//	a=F/m

//		if ( flgUpdated && count < 10) {logparam();flgUpdated=false;}

		{
			let A = 50;//振幅
			let x = -A*Math.sin( sin_th );
			let y = 90;
			sin_p_box = vadd2(p_box,vec2(0,y));
			sin_p_ball = vec2(x-A-11,y);
			sin_bane_length = length2( vsub2(sin_p_ball,sin_p_box) );
			sin_bane_x = sin_bane_length-bane_naturallength;
		}
	}


	//-------------------------------------------------------------------------
	function exec_Laboratory( delta )
	//-------------------------------------------------------------------------
	{
		// 動的なパラメータを計算

		if ( info_stat == '<実験中>' && (flgPause == false || flgStep ) )
		{

			let t=delta;
			let a=bane_a;
			if(1)
			{
				let v0=ball.v.x;			
				ball.v.x += a*t;
				lab.s = 1/2*a*t*t + v0*t;	//1/2at^2
				ball.p.x += lab.s;
			}
			else
			if(1)
			{
				// 単振動を移動量に取り入れた物
				ball.v.x += a*t;
				let A = 50;//振幅
				let th = Math.acos(bane_x/A);
lab.th = th;				
				if ( a>0 ) th+=Math.PI;
				let w = Math.sqrt(lab.k/lab.m);	// ω=√(k/m)
				th += w *delta ;
				let x = -A*Math.sin( th );

				
if ( count < 20 ) 
{
	let a= degrees(Math.acos(-0.5))
	let b= degrees(Math.acos( 0.5))
	console.log(count,bane_x,w, a, b, Math.cos(a), Math.cos(b) );
}
				lab.s = x;
				ball.p.x += lab.s;
			}
			else
			{
				// フレーム内の等速運動
				ball.v.x += a*t;
				lab.s = ball.v.x * t ;
				ball.p.x += lab.s;
			} 
			ball_K = 1/2*lab.m*ball.v.x*ball.v.x;


			let E = bane_U+ball_K;
			min_E = Math.min(E,min_E);
			max_E = Math.max(E,max_E);

			flgUpdated = true;

			{
				let w = Math.sqrt(lab.k/lab.m);	// ω=√(k/m) 
				sin_th += w *delta;
				if ( sin_th > Math.PI*2 ) sin_th -= Math.PI*2;
				if ( sin_th < 0 ) sin_th += Math.PI*2;
			}
			count++;
		}

	}

	
	//-------------------------------------------------------------------------
	function draw_Laboratory()
	//-------------------------------------------------------------------------
	{
		{
			let x = -120;
			let y = -40;
			let r = 20;
			gra.circle( x, y, r);
			let x1=x+r*Math.cos(lab.th);
			let y1=y+r*Math.sin(lab.th);
			gra.line( x,y,x1,y1);
		}
		{
		gra.color(1,0,0);
			let A = 50;//振幅
			let x = -A*Math.sin( sin_th );
			let y = 90;
			gra.circle( x-A,y, 11 );
			{
				let x0 = box.p.x-box.w;
				let y0 = box.p.y-box.h+y;
				let x1 = box.p.x+box.w;
				let y1 = box.p.y+box.h+y;
				gra.line( x0,y0,x0,y1 );
				gra.line( x0,y0,x1,y0 );
				gra.line( x1,y0,x1,y1 );
				gra.line( gra.sx,y1,x0,y1 );
				gra.line( gra.ex,y1,x1,y1 );
			}
			{
				let p0 = sin_p_box;
				let p1 = sin_p_ball;
				gra.circlefill( p0.x,p0.y, 2 );
				gra.circlefill( p1.x,p1.y, 2 );
				gra.drawbane2d( p0, p1, 5,10,0,3 );

				gra.line( p1.x,p1.y, p_ball.x, p_ball.y );
				gra.symbol( "伸縮長="+strfloat(sin_bane_x,3,1), (p0.x+bane_naturallength), 110, 10 );


			}
		gra.color(0,0,0);
		}

		// draw グラウンドに固定された箱
		{
			let x0 = box.p.x-box.w;
			let y0 = box.p.y-box.h;
			let x1 = box.p.x+box.w;
			let y1 = box.p.y+box.h;
			gra.line( x0,y0,x0,y1 );
			gra.line( x0,y0,x1,y0 );
			gra.line( x1,y0,x1,y1 );
			gra.line( gra.sx,y1,x0,y1 );
			gra.line( gra.ex,y1,x1,y1 );
		}

		// draw ball
		gra.circle( ball.p.x, ball.p.y, ball.r );

		// draw bane
		{
			let p0 = p_box;
			let p1 = p_ball;
			gra.circlefill( p0.x,p0.y, 2 );
			gra.circlefill( p1.x,p1.y, 2 );
			gra.drawbane2d( p0, p1, 5,10,0,3 );

			let fs=10;

			// 補助線:質量
			{
				gra.symbol( "m="+lab.m,ball.p.x,ball.p.y-5, fs );
			}
			
			// 補助線:自然長
			gra.drawmesure_line( p0.x, 20, p0.x+bane_naturallength, 20, 4 );
			gra.symbol( "自然長="+bane_naturallength, p0.x+14, 30, fs );

			// 補助線:伸縮長
			gra.drawmesure_line( p0.x+bane_naturallength, 34, p0.x+bane_length, 34, 4 );
			gra.symbol( "伸縮長x="+strfloat(bane_x,3,1), (p0.x+bane_naturallength), 45, fs );

			// 補助線:力
			{
				let x = ball.p.x-ball.r;
				let y = ball.p.y-20;
				let p = vec2(x,y);
				let d = bane_F>0?1:-1;

				gra.drawarrow2d( p, vec2( d, 0 ), 15, 2 );
				gra.symbol( "-kx="+strfloat(bane_F,3,1)	,x,y-20, fs );
				gra.symbol( "ma="+strfloat(lab.m*bane_a,3,1)	,x,y-30, fs );
				gra.symbol( "s="+strfloat(lab.s,3,1)	,x,y-40, fs );
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

			gra.print( "ばねの弾性エネルギー　U=" + strfloat(bane_U			,5,2) );
			gra.print( "ボールの運動エネルギーK=" + strfloat(ball_K			,5,2) );
			gra.print( "力学的エネルギー　　　E=" + strfloat(bane_U+ball_K	,5,2) );
			gra.print( "最小～最大　　　　　　E=" + strfloat(min_E	,5,2) + " ~"  + strfloat(max_E	,5,2) );

			gra.print( info_stat );
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
	if ( document.getElementsByName( "html_debug" ) ) 
	{
		if ( document.getElementsByName( "html_debug" )[0] ) 
		{
			lab.flgdebug = document.getElementsByName( "html_debug" )[0].checked;
		}
	}

	// type='radio'
	if ( document.getElementsByName( "html_mode" ) )
	{
		let list = document.getElementsByName( "html_mode" ) ;
		for ( let l of list ) if ( l.checked ) lab.mode = l.value;
	}

	// type='text'
	if ( document.getElementsByName( "html_t" ) )
	{
		lab.t = document.getElementById( "html_t" ).value*1;
	}
	if ( document.getElementsByName( "html_k" ) )
	{
		lab.k = document.getElementById( "html_k" ).value*1;
	}
	if ( document.getElementsByName( "html_m" ) )
	{
		lab.m = document.getElementById( "html_m" ).value*1;
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
	if ( g_key[KEY_LEFT] )		html_onchange('shrink');
	if ( g_key[KEY_RIGHT] )		html_onchange('streach');
	if ( g_key[KEY_CR] )		html_onchange('release');
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

