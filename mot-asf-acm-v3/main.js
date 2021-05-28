"use strict";
let first=1;

let tst = tst_create();
let g_yaw;
let g_reqId1;
let g_reqId2;
let rand;
let a_m_cntframe;
let b_m_cntframe;
let g_param_colset;
let g_param_fovy;
let g_param_zoom;
let g_param_high;
let g_param_look;
let g_param_normal;
let g_param_undome;
let g_param_request;
let gra;
//-----------------------------------------------------------------------------
function main()
//-----------------------------------------------------------------------------
{
	if ( g_reqId2 ) clearTimeout( g_reqId2 );				 // main呼び出しで多重化を防ぐ
	g_reqId2=null;

	if ( g_reqId1 ) window.cancelAnimationFrame( g_reqId1 ); // main呼び出しで多重化を防ぐ
	g_reqId1 = null;

	g_param_colset = { back:vec3( 1.0, 1.0, 1.0 ),	flat:vec3(1.0, 1.0, 1.0 ),	dark:vec3( 0.4, 0.4, 0.4 ),	wire:vec3( 0.2, 0.2, 0.2 )};
	g_param_fovy = 28;
	g_param_zoom = 10;
	g_param_high = 2;
	g_param_look = 1;
	g_param_normal = false;
	g_param_undome = false;
	g_param_request = "";
	g_yaw = 0;
	rand = random_create( "xorshift32" );
	a_m_cntframe = 1;
	b_m_cntframe = 1;
	let cam = camera_create( vec3(  0.0, 1.0, 10 ), vec3( 0, 1.0,0 ), 28, 1.0,1000.0  );
	gra = create_gra_webgl( html_canvas.getContext( "webgl", { antialias: true } ) );
	html_onchange();
	let then = 0;
	let g_time = 0;
	let m_stepFrame = 1;
	let m_flgPlay = true;

	let m_ft = 1000/120;	
	let a_mot;
//	a_mot = bvh_create( "01_01.bvh" );	// jump
//	a_mot = bvh_create( "02_01.bvh" );	// walk
//	a_mot = bvh_create( "05_02.bvh" );	// dunce
//	a_mot = bvh_create( "05_03.bvh" );	// dunce
//	a_mot = bvh_create( "05_04.bvh" );	// dunce
//	a_mot = bvh_create( "05_05.bvh" );	// dance - err
//	a_mot = bvh_create( "05_10.bvh" );	// dunce - one ng
//	a_mot = bvh_create( "05_11.bvh" );	// dunce
//	a_mot = bvh_create( "05_18.bvh" );	// dunce
//	a_mot = bvh_create( "05_20.bvh" );	// dunce - one err
//	a_mot = bvh_create( "09_01.bvh" );	// run

//	let b_mot = asfamc_create( "01.asf", "01_01.amc" );	//jump
//	let b_mot = asfamc_create( "02.asf", "02_01.amc" );//walk
//	let b_mot = asfamc_create( "05.asf", "05_02.amc" );	//dance
//	let b_mot = asfamc_create( "05.asf", "05_04.amc" );	//dance
//	let b_mot = asfamc_create( "05.asf", "05_05.amc" );	//dance - err
//	let b_mot = asfamc_create( "05.asf", "05_10.amc" );	//dance - one err
//	let b_mot = asfamc_create( "05.asf", "05_11.amc" );	//dance
//	let b_mot = asfamc_create( "05.asf", "05_18.amc" );	//dance
//	let b_mot = asfamc_create( "05.asf", "05_20.amc" );	//dance - one err
	let b_mot = asfamc_create( "09.asf", "09_01.amc" );	//run

	let teststage = testmodel_create();

	update_paint();	
	//---------------------------------------------------------------------
	function	update_paint()
	//---------------------------------------------------------------------
	{
		let now = performance.now();
		const deltaTime = ( now - then );///1000;
		then = now;

		update_frame( deltaTime );

		let time = performance.now();			// 実際に掛かったフレームタイム
		let t = (time-g_time)-m_ft;				// 差
		let t2 = ((t>0)?m_ft-t:m_ft);			// 次のフレームタイムの指定値
		g_time = time;
		g_reqId2 = setTimeout( update_paint, t2 );
	}


	//---------------------------------------------------------------------
	function update_frame( delta )
	//---------------------------------------------------------------------
	{
//if(first)console.log(m_ft);
		if ( a_mot && a_mot.m_mot ) m_ft = a_mot.m_mot.MOTION.FrameTime*1000;	// bvhの指定フレームタイムに書き換え
//if(first)console.log(m_ft);
		// 描画
		cam.fovy	= g_param_fovy;
		cam.pos.z	= g_param_zoom;
		cam.pos.y	= g_param_high;
		cam.at.y	= g_param_look;

		let P = mperspective( cam.fovy, html_canvas.width/html_canvas.height, cam.near, cam.far );
		let V= mlookat( cam.pos, cam.at );

		g_yaw += radians( -0.004*delta*2  );
//		g_yaw = radians( -60  );
		V = mmul( V, mrotate( g_yaw, vec3( 0,1,0 ) ) );

		// ステージ表示
		teststage.draw(  gra, P, V, g_param_colset );

		// フレーム制御
		{
			m_stepFrame = m_flgPlay?1:0;
			if ( g_param_request == "play/stop" ) 
			{
				g_param_request="";
				m_flgPlay = m_flgPlay?false:true;
			}
			if ( g_param_request == "next" ) 
			{
				g_param_request="";
				m_stepFrame = 1;
			}
			if ( g_param_request == "prev" ) 
			{
				g_param_request="";
				m_stepFrame = -1;
			}
		}
		if ( b_mot && b_mot.m_mot )
		{
			b_m_cntframe += m_stepFrame;
			if ( b_m_cntframe < 1 ) b_m_cntframe = b_mot.amt_frame-1; 
			if ( b_m_cntframe > b_mot.amt_frame ) b_m_cntframe = 1; 
		}
		if ( a_mot && a_mot.m_mot )
		{
			a_m_cntframe += m_stepFrame;
			if ( a_m_cntframe < 1 ) a_m_cntframe = a_mot.m_mot.MOTION.Frames-1; 
			if ( a_m_cntframe >= a_mot.m_mot.MOTION.Frames ) a_m_cntframe = 1; 
		}
		if ( m_stepFrame )
		{
			if ( a_mot && a_mot.m_mot )  window.document.getElementById("html_frameval").value = a_m_cntframe;
			if ( b_mot && b_mot.m_mot )  window.document.getElementById("html_frameval").value = b_m_cntframe;
		}
		if ( a_mot && a_mot.m_mot )  window.document.getElementById("html_framemax").innerHTML = (a_mot.m_mot.MOTION.Frames-1)+","+b_mot.amt_frame;
		if ( b_mot && b_mot.m_mot )  window.document.getElementById("html_framemax").innerHTML = b_mot.amt_frame;

		if ( a_mot ) a_mot.update();
		if ( b_mot ) b_mot.update();

		if ( a_mot && a_mot.m_mot ) a_mot.exec( gra, P, V, g_param_colset, 0.045, a_m_cntframe );
		if ( b_mot && b_mot.m_mot ) b_mot.exec( gra, P, V, g_param_colset, 0.1, b_m_cntframe );

		gra.cls( g_param_colset.back );
		gra.draw_flat();
		gra.draw_wire();


	}

}


//-----------------------------------------------------------------------------
function html_onchange( valRequest )
//-----------------------------------------------------------------------------
{
	if(1)
	{
		let A = mrotz( radians(45) );
		let T = mtrans( vec3(1,2,3) );
		console.table(A);
		console.table(T);
		console.table(mmul(A,T));
		console.table(mmul(T,A));
	}
	{
		g_param_fovy = window.document.getElementById( "html_fovy" ).value*1;
		g_param_look = window.document.getElementById( "html_look" ).value*1;
		g_param_high = window.document.getElementById( "html_high" ).value*1;
		g_param_zoom = window.document.getElementById( "html_zoom" ).value*1;
	}


	a_m_cntframe = window.document.getElementById("html_frameval").value*1;

	if( valRequest == "fullscreen" )
	{
		tst.fullscreeen_change( html_canvas, function()
		{
			gra = create_gra_webgl( html_canvas.getContext( "webgl", { antialias: true } ) );	// 画面再設定
		});

	}
	else
	{
		g_param_request = valRequest;

	}
}

main();
