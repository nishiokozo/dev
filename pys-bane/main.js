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
	// 仕事率:P=Fv
	// エネルギー:K=mgh(J)
	// エネルギー:K=Fx(J)
	// エネルギー:K=1/2Fvt(J)
	// エネルギー:K=1/2mv^2(J)
	// 運動量保存の式:m1v1+m2v2=m1v1'+m2v2'
	// 力学的エネルギー保存の式:1/2mv^2-Fx=1/2mv'^2
	// 反発係数の式:e=-(vb'-va')/(vb-va)	※ -衝突後の速度/衝突前の速度
	// 換算質量:1/μ=1/m1+1/m2, μ=,1m2/(m1+m2)
	// 重心位置:rg=(m1r1+m2r2)
	// 相対位置:r=r2-r1;
	// ばね係数:k=F/x
//-----------------------------------------------------------------------------
function create_lab()
//-----------------------------------------------------------------------------
{
	// 初期化
	let gra = gra_create( html_canvas );

	gra.drawbane2d = function( a,b,r,step=10,l0=r*2,l1=r*2,wd=4,div=step*14 )
	{
		let rot = Math.atan2( b.y-a.y, b.x-a.x );
		let p0=  vadd2( a , vrot2(vec2( l0,0),rot) );
		let p1 = vadd2( b , vrot2(vec2(-l1,0),rot) );
		//
		let v0 = vec2(a.x,a.y);
		let st = step*radians(360)/div;
		let th = radians(0);
		let len = length2( vsub( p1, p0) ); 
		let d = (len / div);
		for ( let i = 0 ; i <= div ; i++ )
		{
			let v1 = vec2(
				r* Math.cos(th)/wd + d*i,
				r* Math.sin(th)  
			);
			v1 = vrot2( v1, rot );
			v1 = vadd2( v1, p0 );

			gra.line( v0.x, v0.y, v1.x, v1.y );
			v0 = v1;

			th += st;
		}

		gra.line( v0.x, v0.y, b.x, b.y );
	}

	// 矢印の表示
	gra.drawarrow2d = function( p, v, l, sc = 1 )
	{
		if ( l == 0 ) 
		{
			gra.circle( p.x, p.y, sc );
			return;
		}
		else
		if ( l < 0 )
		{
			l = -l;
		}
		
		let rot = Math.atan2( v.y, v.x );
		let h = 1*sc;
		let w = h/Math.tan(radians(30));

		let tbl = 
			[
				vec2( l,0),
				vec2( l-w*2 ,-h*2	),
				vec2( l-w*2 ,-h		),
				vec2(    0  ,-h		),
				vec2(    0  , h		),
				vec2(    0  , h		),
				vec2( l-w*2 , h		),
				vec2( l-w*2 , h*2	),
				vec2( l,0),
			];
		let tbl2=[];
		for ( let v of tbl )
		{
			v = vrot2( v, rot );
			v = vadd2( v, p );
			tbl2.push(v);
		}

		gra.path_n( tbl2 );
	}
	function drawarrow_line2d( p, b, sc = 2 )
	{
		let v = normalize2(vsub2(b,p));
		let l = length2(vsub2(b,p));
		drawarrow2d( p, v, l, sc );
	}


	function calc_r( m, r0 = 10, m0 = 1 ) // 質量1の時半径10
	{
		let range = r0*r0*Math.PI / m0;	// 質量比率
		return Math.sqrt(range * m/Math.PI);
	}

	function strfloat( v, r=4, f=2 ) // r指数部桁、f小数部桁
	{
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
	}
	
	//
	
	let lab = {}

	lab.hdlTimeout = null;
	lab.mode = '';
	lab.req = '';
	lab.flgdebug = false;
	lab.bane_k = 0;
	lab.ball_m = 0;
	lab.F = 0;
	lab.a = 0;

	let box;
	let ball;

	let bane_naturallength; //自然長k
	let bane_length; // ばね長さ
	let bane_p0;	
	let bane_p1;	
	let bane_x;
	let bane_U;
	let ball_K;
	let min_E;
	let max_E;

	let flgPause = false;
	let flgStep = false;
	let flgGo = false;
	let info_stat;
	//-------------------------------------------------------------------------
	function reset()
	//-------------------------------------------------------------------------
	{
		console.log('reset:',lab.mode);

		flgPause = false;
		flgStep = false;
		info_stat = '<設定中>';

		//
		bane_naturallength = 100;
		bane_length = bane_naturallength;
		bane_x = 0;
		bane_U = 0;
		bane_p0 = 0;	// ばね始点	boxとの接合点
		bane_p1 = 0;	// ばね終点	ballとの接合点
		ball_K = 0;

		let r = 11;
		box		= {p:vec2(-90,0) ,w:15,h:r+1}
		let x = box.p.x+box.w+bane_naturallength+r;
		ball	= {p:vec2(x,0)  ,v:vec2(0,0) ,r:r}

		min_E = 999999;
		max_E = 0;

		{
			ball.p.x += 50;
		}

		//---

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

		// パラメータ計算
		calc_Laboratory();

		let delta = 1/(60);

		// 実験室
		exec_Laboratory( delta );

		// 描画
		draw_Laboratory();

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
			case 'streach': 
					ball.p.x += 2;
					info_stat = '<設定中>';
				break;
			case 'shrink': 
					ball.p.x -= 2;
					info_stat = '<設定中>';
				break;
			case 'release': 
					info_stat = '<実験中>';
				break;
			default:console.error("error req ",lab.req );
		}
	}
	//-------------------------------------------------------------------------
	function calc_Laboratory()
	//-------------------------------------------------------------------------
	{
		bane_p0 = vec2(box.p.x+box.w,box.p.y);
		bane_p1 = vec2(ball.p.x-ball.r,ball.p.y);
		bane_length = length2( vsub2(bane_p1,bane_p0) );
		bane_x = bane_length-bane_naturallength;
		bane_U = 1/2*lab.bane_k*Math.pow(bane_x,2);		// 1/2kx^2
	
		lab.F = -lab.bane_k*bane_x;					//	F=-kx
		lab.a = lab.F/lab.ball_m					//	a=F/m

	}
	//-------------------------------------------------------------------------
	function exec_Laboratory( delta )
	//-------------------------------------------------------------------------
	{
		if ( info_stat == '<実験中>' && (flgPause == false || flgStep ) )
		{
			ball.v.x += lab.a * delta;
			ball.p.x += ball.v.x * delta ;
			ball_K = 1/2*lab.ball_m*ball.v.x*ball.v.x;

			let E = bane_U+ball_K;
			min_E = Math.min(E,min_E);
			max_E = Math.max(E,max_E);

		}
	}
	//-------------------------------------------------------------------------
	function draw_Laboratory()
	//-------------------------------------------------------------------------
	{
		gra.cls();
		let c = 0;
		gra.window( -120,-120+c,120,120+c );
		
		// draw グラウンドに固定された箱
		{
			let x0 = box.p.x-box.w;
			let y0 = box.p.y-box.h;
			let x1 = box.p.x+box.w;
			let y1 = box.p.y+box.h;
			gra.line( x0,y0,x0,y1 );
			gra.line( x0,y0,x1,y0 );
			gra.line( x1,y0,x1,y1 );
			gra.line( -120,y1,x0,y1 );
			gra.line(  120,y1,x1,y1 );
		}

		// draw ball
		gra.circle( ball.p.x, ball.p.y, ball.r );

		// draw bane
		{
			let p0 = vec2(box.p.x+box.w,box.p.y);
			let p1 = vec2(ball.p.x-ball.r,ball.p.y);
			gra.drawbane2d( p0, p1, 5,10,0,3 );

			let fs=10;

			// 補助線:質量
			{
				gra.symbol( "m="+lab.ball_m,ball.p.x,ball.p.y-5, fs );
			}
			
			// 補助線:自然長
			{
				let x0 = p0.x;
				let x1 = p0.x+bane_naturallength;
				let y = 20;
				let w = 4;
				gra.line( x0, y  , x1, y );
				gra.line( x0, y-w, x0, y+w );
				gra.line( x1, y-w, x1, y+w );
				gra.symbol( "自然長="+bane_naturallength,x0+14, y+10, fs );
			}

			// 補助線:伸縮長
			{
				let x0 = p0.x+bane_naturallength;
				let x1 = p0.x+bane_length;
				let y = 22+12;
				let w = 4;
				gra.line( x0, y  , x1, y );
				gra.line( x0, y-w, x0, y+w );
				gra.line( x1, y-w, x1, y+w );
				gra.symbol( "伸縮長x="+strfloat(bane_x,3,1),(x0+x1)/2, y+10, fs );
			}

			// 補助線:力
			{
				let x = ball.p.x-ball.r;
				let y = ball.p.y-20;
				let p = vec2(x,y);
				let d = lab.F>0?1:-1;

				gra.drawarrow2d( p, vec2( d, 0 ), 15, 2 );
				gra.symbol( "F=-kx="+strfloat(lab.F,3,1)	,x,y-30, fs );
				gra.symbol( "a=F/m="+strfloat(lab.a,3,1)	,x,y-20, fs );
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
			gra.print( "最小～最大　　　　　　E=" + strfloat(min_E	,5,2) + "-"  + strfloat(max_E	,5,2) );


			gra.print( info_stat );
		}
		if ( flgPause ) gra.print('PAUSE');
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

	{	// HTMLからの設定を取得
		
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
		if ( document.getElementsByName( "html_k" ) )
		{
			lab.bane_k = document.getElementById( "html_k" ).value
		}
		if ( document.getElementsByName( "html_m" ) )
		{
			lab.ball_m = document.getElementById( "html_m" ).value
		}
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
	if ( g_key[KEY_P] )		html_onchange('pause');
	if ( g_key[KEY_LEFT] )		html_onchange('shrink');
	if ( g_key[KEY_RIGHT] )		html_onchange('streach');
	if ( g_key[KEY_CR] )		html_onchange('release');
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
	{
	    let rect = html_canvas.getBoundingClientRect();
        let x = (e.clientX - rect.left)/ html_canvas.width;
        let y = (e.clientY - rect.top )/ html_canvas.height;
		g_mouse.x = x;
		g_mouse.y = y;
	}
}
// 右クリックでのコンテキストメニューを抑制
document.addEventListener('contextmenu', contextmenu);
function contextmenu(e) 
{
  e.preventDefault();
}

