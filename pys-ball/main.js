"use strict";

let g_hdlTimeout = null;
let g_valRequest = '2balls';
//-----------------------------------------------------------------------------
function main()
//-----------------------------------------------------------------------------
{
	// 初期化
	if ( g_hdlTimeout ) clearTimeout( g_hdlTimeout );	 // main呼び出しで多重化を防ぐ
	let gra = gra_create( html_canvas );
	let first = 1;

	let balls = [];

	switch(g_valRequest)
	{
		case '2balls':
			balls.push({name:"a",p:vec2(-40, 0),v:vec2(100, 0),m:1.0	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"b",p:vec2( 30, 1),v:vec2( 0, 0),m:2.0	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			break;

		case '3balls':
			balls.push({name:"a",p:vec2(  0, 0),v:vec2( 0, 0),m:1.0	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"b",p:vec2( 30, 20),v:vec2( 0, 0),m:2.0	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"c",p:vec2(-40, 0),v:vec2( 200, 0),m:0.2	,r:10,xp:vec2(0,0),prev:vec2(0,0)});

			break;

		case 'manyballs':
			balls.push({name:"b"  ,p:vec2( 30,  1),v:vec2(  0, 0),m:2.0	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"c1" ,p:vec2(-50,  0),v:vec2(200, 0),m:0.2	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"c2" ,p:vec2(  5, -5),v:vec2( -0, 0),m:0.2	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"c3" ,p:vec2(  0, 30),v:vec2( -0, 0),m:0.2	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"c4" ,p:vec2(  0,-30),v:vec2( -0, 0),m:0.2	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"c5" ,p:vec2( 20, 30),v:vec2( -0, 0),m:0.2	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"c6" ,p:vec2( 20,-30),v:vec2( -0, 0),m:0.2	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"c7" ,p:vec2( 40, 30),v:vec2( -0, 0),m:0.2	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"c8" ,p:vec2( 40,-30),v:vec2( -0, 0),m:0.2	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"c9" ,p:vec2(-20, 30),v:vec2( -0, 0),m:0.2	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"c10",p:vec2(-20,-30),v:vec2( -0, 0),m:0.2	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"c11",p:vec2(-40, 30),v:vec2( -0, 0),m:0.2	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			balls.push({name:"c12",p:vec2(-40,-30),v:vec2( -0, 0),m:0.2	,r:10,xp:vec2(0,0),prev:vec2(0,0)});
			break;
	}

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


	// 質量に応じた面積に設定
	{
		let r = 10;
		let m = 1;
		let range = r*r*3.14 / m;	// 質量比率

		for ( let t of balls )
		{
			let m = range * t.m;
			t.r = Math.sqrt(m/3.14);
		}

	}
	//-------------------------------------------------------------------------
	function frame_update( delta )
	//-------------------------------------------------------------------------
	{
		gra.cls();
		gra.window( -50,-50,50,50 );

		// うまり判定
		for ( let a of balls )
		for ( let b of balls )
		{
			if ( a == b ) continue;

			if ( length2(vsub2(a.p,b.p)) < a.r+b.r )	// 移動前の相手の残像と衝突
			{
				console.log("bbbaaaa埋まっている",length2(vsub2(a.p,b.p)) , a.r+b.r);
			}
			
		}

		// move
		for ( let t of balls )
		{
			t.p.x = t.p.x + t.v.x * delta
			t.p.y = t.p.y + t.v.y * delta
		}

		// collition to wall
		for ( let t of balls )
		{
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
	 		}
			if ( px > wr )
			{
				t.p.x += (wr-px)*2;
	 			t.v.x = -t.v.x;
	 		}
			if ( py < wt )
			{
				t.p.y += (wt-py)*2;
	 			t.v.y = -t.v.y;
	 		}
			if ( py > wb )
			{
				t.p.y += (wb-py)*2;
	 			t.v.y = -t.v.y;
	 		}

		}

		//collition to balls
		for ( let i = 0 ; i < balls.length ; i++ )
		for ( let j = i+1 ; j < balls.length ; j++ )
		{
			let a = balls[i];
			let b = balls[j];
			let l = length2(vsub2(a.p,b.p))-(a.r+b.r);
			if ( l < 0 )
			{
				function vinpact2( I, dir )
				{
					let N = normalize2( dir );	 
					let d = dot2( I, N );
					return vec2( N.x*d, N.y*d );
				}
				
				// 衝突ベクトル
				let a1 = vinpact2( a.v, vsub2( b.p, a.p ) );		// a -> b ベクトル
				let b1 = vinpact2( b.v, vsub2( a.p, b.p ) );		// b -> a ベクトル

				// 残留ベクトル
				let a2 = vsub2( a.v, a1 );
				let b2 = vsub2( b.v, b1 );

				// 速度交換
				// m1v1+m2v2=m1v1'+m2v2'
				// a1-b1=-v1'+v2'
				let a3 = vec2(
					(a.m*a1.x +b.m*(-a1.x+2*b1.x))/(a.m+b.m),
					(a.m*a1.y +b.m*(-a1.y+2*b1.y))/(a.m+b.m)
				);
				let b3 = vec2(
					a1.x-b1.x+a3.x,
					a1.y-b1.y+a3.y
				);

				// a,b:運動量伝達と合成
				a.v = vadd2( a2, a3 );
				b.v = vadd2( b2, b3 );

				// 埋まりを矯正
				{
					let n = normalize2( vsub2(a.p,b.p) );
					let v = vmul_scalar2(n,l);
					a.p = vsub2( a.p, v );
					b.p = vadd2( b.p, v );
				}
			}
		}

		// draw
		for ( let t of balls )
		{
			gra.circle( t.p.x, t.p.y, t.r );
			let v = vmul_scalar2( normalize2(t.v),t.r);
			//gra.line( t.p.x, t.p.y, t.p.x+v.x, t.p.y+v.y );
			gra.print(t.name,t.p.x-1,t.p.y-3);
		}
		

		// 情報表示
		if ( document.getElementsByName( "html_info" )[0].checked )
		{
			gra.window( 0,0,html_canvas.width,html_canvas.height);
			let K=0;
			let x = 0;
			let y = 0;
			gra.locate(x,y++);gra.print( "name | 速さv              | 質量m | 運動エネルギーK    |" );
			for ( let t of balls )	
			{
				let k = 1/2*t.m*dot2(t.v,t.v);
				gra.locate(x,y);gra.print( t.name  );
				gra.locate(x+5,y);gra.print( "| " + length2(t.v)  );
				gra.locate(x+26,y);gra.print( "| " +t.m );
				gra.locate(x+34,y);gra.print( "| " + k );
				gra.locate(x+55,y);gra.print( "| " );

				K+=k;
				y++;
			}
			gra.locate(0,y);gra.print( "計                                  "+ K );
			gra.print( 1/delta +"fps",html_canvas.width-44,html_canvas.height-16 );
		}
		
	}
	//-------------------------------------------------------------------------
	function update( time )
	//-------------------------------------------------------------------------
	{
		let delta = 1/60;
//		delta = 1;
		delta = 1/60;
//		delta = 1/120;
//		delta = 1/480
		frame_update( delta );
		g_hdlTimeout = setTimeout( update, delta*1000 );
	}
	update(0);
}
//-----------------------------------------------------------------------------
function html_onchange( valRequest )
//-----------------------------------------------------------------------------
{
	if ( valRequest == 'info' )
	{
	}
	else
	{
		g_valRequest = valRequest;
		main();
	}
}

window.onload = function()
{
	main();
}
