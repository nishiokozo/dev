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
	let info_stat;
	//
	lab.bane_k = 0;
	lab.ball1_m = 0;
	lab.F = 0;
//	lab.ball1_a = 0;
//	lab.ball2_a = 0;
//	let box;
	let ball1;
	let ball2;
	let bane_naturallength; //自然長k
	let bane_length; // ばね長さ
//	let bane_p0;
//	let bane_p1;
	let bane_x;
	let bane_U;
	let ball_K;
	let ball_K0;
	let min_E;
	let max_E;

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
//		bane_p0 = 0;	// ばね始点	boxとの接合点
//		bane_p1 = 0;	// ばね終点	ball1との接合点
		ball_K = 0;
		ball_K0 = 0;
		{
			let r = 11;
//			box		= {p:vec2(-90,0) ,w:15,h:r+1}
//			let x = box.p.x+box.w+bane_naturallength+r;
			ball1	= {p:vec2(-60,0)  ,v:vec2(0,0) ,r:r}
			ball2	= {p:vec2(0,0)  ,v:vec2(0,0) ,r:r}

			ball2.p.x = ball1.p.x+bane_naturallength;
		}
		ball2.p.x += 40;
		min_E = 999999;
		max_E = 0;
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
		{
			gra.cls();
			gra.window( -120,-120,120,120 );

			draw_Laboratory();

			if ( flgPause ) gra.print('PAUSE');
		}

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
			//
			case 'streach': 
					ball2.p.x += 2;
					info_stat = '<設定中>';
				break;
			case 'shrink': 
					ball2.p.x -= 2;
					info_stat = '<設定中>';
				break;
			case 'release': 
					info_stat = '<実験中>';
				break;
		}
	}
	//-------------------------------------------------------------------------
	function calc_Laboratory()
	//-------------------------------------------------------------------------
	{
//		bane_p0 = vec2(box.p.x+box.w,box.p.y);
//		bane_p0 = vec2(ball1.p.x-ball1.r,ball1.p.y);
//		bane_p1 = vec2(ball2.p.x-ball2.r,ball2.p.y);
		bane_length = length2( vsub2(ball2.p , ball1.p) );
		bane_x = bane_length-bane_naturallength;
		bane_U = 1/2*lab.bane_k*Math.pow(bane_x,2);		// 1/2kx^2
		lab.F = -lab.bane_k*bane_x;					//	F=-kx
	}
	//-------------------------------------------------------------------------
	function exec_Laboratory( delta )
	//-------------------------------------------------------------------------
	{
		if ( info_stat == '<実験中>' && (flgPause == false || flgStep ) )
		{
			let a = 0.0;
			let b = 1-a;
		
			let ball1_a = -a*lab.F/lab.ball1_m;				//	a=F/m
			let ball2_a =  b*lab.F/lab.ball2_m;					//	a=F/m

			ball1.v.x += ball1_a/2 * delta;
			ball1.p.x += ball1.v.x * delta ;
			ball_K  = 1/2*lab.ball1_m*Math.pow(ball1.v.x,2);

			ball2.v.x += ball2_a/2 * delta;
			ball2.p.x += ball2.v.x * delta ;
			ball_K += 1/2*lab.ball2_m*Math.pow(ball2.v.x,2);


			let E = bane_U+ball_K;
			min_E = Math.min(E,min_E);
			max_E = Math.max(E,max_E);
		}
	}
	//-------------------------------------------------------------------------
	function draw_Laboratory()
	//-------------------------------------------------------------------------
	{
		// draw ball1
		gra.circle( ball1.p.x, ball1.p.y, ball1.r );

		// draw ball2
		gra.circle( ball2.p.x, ball2.p.y, ball2.r );

		// draw bane
		{
			let p0 = vec2(ball1.p.x,ball1.p.y);
			let p1 = vec2(ball2.p.x,ball2.p.y);
			gra.drawbane2d( p0, p1, 5,10,15,15 );

			// 補助線:質量
			{
				gra.symbol( "m="+lab.ball1_m,ball1.p.x,ball1.p.y, 8 );
				gra.symbol( "m="+lab.ball2_m,ball2.p.x,ball2.p.y, 8 );
			}
			
		}

		// 情報表示
		{
			gra.locate(0,0);
			gra.print( "ばねの弾性エネルギー　U=" + strfloat(bane_U			,5,2) );
			gra.print( "ボールの運動エネルギーK=" + strfloat(ball_K			,5,2) );
			gra.print( "力学的エネルギー　　　E=" + strfloat(bane_U+ball_K	,5,2) );
			gra.print( "最小～最大　　　　　　E=" + strfloat(min_E	,5,2) + "-"  + strfloat(max_E	,5,2) );
			gra.print( "自然長="+bane_naturallength );
			gra.print( "伸縮長x="+strfloat(bane_x,3,1) );


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
	if ( document.getElementsByName( "html_k" ) )
	{
		lab.bane_k = document.getElementById( "html_k" ).value
	}
	if ( document.getElementsByName( "html_m1" ) )
	{
		lab.ball1_m = document.getElementById( "html_m1" ).value
	}
	if ( document.getElementsByName( "html_m2" ) )
	{
		lab.ball2_m = document.getElementById( "html_m2" ).value
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

