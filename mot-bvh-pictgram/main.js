"use strict";

///// Token



///// canvas

let first = 1;




//-----------------------------------------------------------------------------
function wideperse( P,  v )		// ワイドパース
//-----------------------------------------------------------------------------
{
	if( g_param_normal )
	{								// 平行奥行
		v = vec4_vmul_Mv( P ,v );
	}
	else
	{								// 距離で割る
		let dis = length( v );
		v = vec4_vmul_Mv( P ,v );
		v.z *= dis/v.w;
		v.w = dis;
	}
	return v;
}






//------------------------------------------------------------------------------
function create_mot( filename )
//------------------------------------------------------------------------------
{
	let mot={};
	let m_step = 0;
	let m_text_in="(none)";
	let m_loaded = false;
	mot.m_mot = null;

	//------------------------------------------------------------------------------
	function a_web_load( filename )
	//------------------------------------------------------------------------------
	{
		let xhr = new XMLHttpRequest();
		xhr.open('GET', filename); 
		xhr.onload = () => 
		{
			m_text_in = xhr.response;
			m_loaded = true;
		}
		xhr.send( null );
	}

	//------------------------------------------------------------------------------
	mot.update = function()
	//------------------------------------------------------------------------------
	{
		switch( m_step )
		{
		case 0:
			a_web_load( filename );	
			m_step++;
			break;

		case 1:
			if ( m_loaded ) 
			{
				m_step++;

				//----------------------------------------
				function bvh_persJoint( text )
				//----------------------------------------
				{
					function bvh_persJoint_sub( token )
					{
						let hash = {}
						let element="";	//	パースモード
						let form=[];	//	フォーマット
						let param=[];	//	パラメータ
						let len_variable = -1;		// 可変長長さ
						let flg_variable = false;	// 可変長フラグ	：CHANNELS 3 Zrotation Xrotation Yrotation
						hash.JOINT=[];
						while( token.isActive() )
						{
							let obj = token.getToken().val;
						
							if ( obj == "}" ) break;
							if ( obj == "{" ) obj = bvh_persJoint_sub( token );
							if ( obj == null ) return null;

							if ( element == "" )
							{
								switch( obj )
								{
								case "HIERARCHY":
									break;

								case "ROOT":
								case "JOINT":
								case "End":
									element = obj;//"DEFINE";
									param=[];
									flg_variable = false;
									form = 
									[
										[""		,	""],
										[""		,	""],
									];
									break;

								case "CHANNELS":
									element = obj;
									param=[];
									flg_variable = true;
									break;

								case "OFFSET":
									element = obj;
									param=[];
									flg_variable = false;
									form = 
									[
										["float"	,	"x"],
										["float"	,	"y"],
										["float"	,	"z"],
									];
									break;

								case "MOTION":
									element = obj;
									param=[];
									flg_variable = false;
									form = 
									[
										["none"		,	""			],
										["none"		,	""			],
										["float"	,	"Frames"	],
										["none"		,	""			],
										["none"		,	""			],
										["none"		,	""			],
										["float"	,	"FrameTime"	],
									];
									break;

								default:
									alert( ".bvh file error:"+obj );
									return null;
									break;
								}
							}
							else
							{
								param.push(obj);

								if ( flg_variable && param.length == 1 )
								{
									// 長さ指定（CHANNELS）フォーマットの処理
									len_variable = param[0]*1;
									flg_variable = false;
									param = [];
								}
								else
								{
									// 定型フォーマット処理
									switch( element )
									{
									case "ROOT":
									case "JOINT":
									case "End":
										if ( param.length == form.length )
										{
											let name	= param[0];	// hip
											let mot	= param[1];	// {}
											//--
											hash.JOINT.push(mot);	
											mot["NAME"]=name;
											element = "";
										}
										break;

									case "CHANNELS":
										if ( param.length == len_variable ) 
										{
											hash[element]	=	param;
											element = "";
											cntData+=param.length;
										}
										break;

									case "OFFSET":
										if ( param.length == form.length )
										{
											hash[element]={};
											for ( let i = 0 ; i < form.length ; i++ )
											{
												let a = param[i];
												if ( form[i][0] == "float" ) a = a*1;
												if ( form[i][0] == "none" ) continue;
												hash[element][form[i][1]] = a;
											}
											element = "";
										}
										break;

									case "MOTION":
										if ( param.length == form.length )
										{
											hash[element]={};
											for ( let i = 0 ; i < form.length ; i++ )
											{
												let a = param[i];
												if ( form[i][0] == "float" ) a = a*1;
												if ( form[i][0] == "none" ) continue;
												hash[element][form[i][1]] = a;
											}
											element = "DATA";
											hash[element]=[];
											param=[];
											//--
										}
										break;

									case "DATA":
										if ( param.length == cntData )	// Frame毎に分割
										{
											hash[element].push( param );
											param=[];
										}

									}
								}
							}

						}

						return hash;
					}
					let cntData = 0;
					let token = token_create( text );
					return bvh_persJoint_sub( token );
				}

				{//pers
					mot.m_mot = bvh_persJoint( m_text_in );
					if ( mot.m_mot == null ) return;
				}
				//--
				//console.log(mot.m_mot,mot.m_mot.MOTION.Frames );


			}
			break;

		case 2:
			break;
		}
	}

	//------------------------------------------------------------------------------
	mot.exec = function( P, V, colset, scale, numframe )
	//------------------------------------------------------------------------------
	{
		//----------------------------------------
		function bvh_play( M, mot, frame, scale )
		//----------------------------------------
		{
			function drawbone( v3, p3, s )
			{
				let v = vec4( v3.x*s, v3.y*s, v3.z*s , 1 );
				let p = vec4( p3.x*s, p3.y*s, p3.z*s , 1 );
				v = vec4_vmul_Mv( V ,v );
				v = wideperse( P, v );
				p = vec4_vmul_Mv( V ,p );
				p = wideperse( P, p );
//				gra3.set_wire( v, p, colset.wire );

				{ // ピクトグラムパーツの表示

					
					let b = 0.9;
					let a = 1.1;
					let r1 = 0.2;
					let r3 = 0.06;
					let r2 = (r1+r3)/2;
					if (num == 7) gra.circlefill( p.x, p.y, 0.3 );	// 頭
					if (num ==10) gra.drawpictgrambone( vec2(v.x,v.y), b*r1 , vec2(p.x,p.y), b*r2 );//
					if (num ==11) gra.drawpictgrambone( vec2(v.x,v.y), b*r2, vec2(p.x,p.y), b*r3 );//
					if (num ==15) gra.drawpictgrambone( vec2(v.x,v.y), b*r1 , vec2(p.x,p.y), b*r2 );//
					if (num ==16) gra.drawpictgrambone( vec2(v.x,v.y), b*r2, vec2(p.x,p.y), b*r3 );//
					if (num ==19) gra.drawpictgrambone( vec2(v.x,v.y), a*r1 , vec2(p.x,p.y), a*r2 );//腰→膝
					if (num ==20) gra.drawpictgrambone( vec2(v.x,v.y), a*r2, vec2(p.x,p.y), a*r3 );//膝→踵
					if (num ==24) gra.drawpictgrambone( vec2(v.x,v.y), a*r1 , vec2(p.x,p.y), a*r2 );//腰→膝
					if (num ==25) gra.drawpictgrambone( vec2(v.x,v.y), a*r2, vec2(p.x,p.y), a*r3 );//膝→踵

				}


			}

			function bvh_play_sub( M, obj, data )
			{
				// 描画
				if( obj.OFFSET.x!=0 || obj.OFFSET.y!=0 || obj.OFFSET.z!=0 )
				{
					let p = vmul_Mv( M, vec3(0,0,0) );
					let v = vmul_Mv( M, obj.OFFSET );
					drawbone( p, v, scale );
				}

				// child行列計算
				let C = midentity();
				if ( obj.CHANNELS )
				{
					for ( let ch of obj.CHANNELS )
					{
						switch( ch )
						{
							case "Xposition":C = mmul( mtrans( vec3( data[ptr++]*1,0,0 ) ), C );break;
							case "Yposition":C = mmul( mtrans( vec3( 0,data[ptr++]*1,0 ) ), C );break;
							case "Zposition":C = mmul( mtrans( vec3( 0,0,data[ptr++]*1 ) ), C );break;
							case "Xrotation":C = mmul( C, mrotx( radians( data[ptr++]*1 ) )   );break;
							case "Yrotation":C = mmul( C, mroty( radians( data[ptr++]*1 ) )   );break;
							case "Zrotation":C = mmul( C, mrotz( radians( data[ptr++]*1 ) )   );break;
						}
					}
				}
				C = mmul( mtrans( obj.OFFSET ), C );
				C = mmul( M, C );

				for ( let j of obj.JOINT )
				{
					num++;
					bvh_play_sub( C, j,data );
				}
			}
			// 
			let ptr = 0;
			let num = 0;
			bvh_play_sub( M, mot.JOINT[0], mot.DATA[frame] );

		}
		if ( m_step == 2 )
		{
			bvh_play( midentity(), mot.m_mot, numframe, scale );
		}
	}	
	return mot;
}


//-----------------------------------------------------------------------------
function camera_create( pos, at, fovy, near=1.0, far=1000.0 )
//-----------------------------------------------------------------------------
{
	let body = {};
	body.pos	= pos;
	body.at		= at;
	body.fovy	= fovy;
	body.near	= near;
	body.far	= far;
	return body;
}

/////
document.addEventListener('touchmove', function(e) {e.preventDefault();}, {passive: false}); // 指ドラッグスクロールの抑制
let g_yaw;
let g_rot;
let g_reqId1;
let g_reqId2;
let rand;
let m_cntframe;
let g_param_colset;
let g_param_fovy;
let g_param_zoom;
let g_param_high;
let g_param_look;
let g_param_normal;
let g_param_raph;
let g_param_undome;
let g_param_request;
let gra;
let count = 0;
//-----------------------------------------------------------------------------
function main()
//-----------------------------------------------------------------------------
{
	if ( g_reqId2 ) clearTimeout( g_reqId2 );				 // main呼び出しで多重化を防ぐ
	g_reqId2=null;

	if ( g_reqId1 ) window.cancelAnimationFrame( g_reqId1 ); // main呼び出しで多重化を防ぐ
	g_reqId1 = null;

	g_param_colset = { back:vec3( 1.0, 1.0, 1.0 )		,	flat:vec3(1.0, 1.0, 1.0 )		, wire:vec3( 0.32, 0.32, 0.32 )	 };
	g_param_fovy = 28;
	g_param_zoom = 10;
	g_param_high = 2;
	g_param_look = 1;
g_param_fovy = 45;
g_param_look = 0.8;
g_param_high = 0.8;
g_param_zoom = 4.0;

	g_param_normal = false;
	g_param_raph = false;
	g_param_undome = false;
	g_param_request = "";

	g_yaw = radians( -26  );
	g_rot = radians( 0  );

	rand = random_create( "xorshift32" );
	m_cntframe = 1;
	let cam = camera_create( vec3(  0.0, 1.0, 10 ), vec3( 0, 1.0,0 ), 28, 1.0,1000.0  );
	gra = gra_create( html_canvas2 );

	html_onchange('abs');

	var then = 0;
	let g_time = 0;
	let m_stepFrame = 1;
	let m_flgPlay = true;

	let m_ft = 1/60;	

	let c_mot = create_mot( "nocchi.bvh" );
	let b_mot = create_mot( "aachan.bvh" );
	let a_mot = create_mot( "kashiyuka.bvh" );


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

{ // for 2d;
		let s = 4;
		let w = 24/s;
		let h = 24/s;
		gra.window( -w,h,w,-h );
		gra.color(0,0,0.5);
		gra.cls();
}

		if ( b_mot.m_mot ) m_ft = b_mot.m_mot.MOTION.FrameTime*1000;	// bvhの指定フレームタイムに書き換え
		// 描画
		cam.fovy	= g_param_fovy;
		cam.pos.z	= g_param_zoom;
		cam.pos.y	= g_param_high;
		cam.at.y	= g_param_look;

		let P = mperspective( cam.fovy, (gra.ex-gra.sx)/(gra.ey-gra.sy), cam.near, cam.far );
		let V= mlookat( cam.pos, cam.at );

		g_yaw+=radians(g_rot/delta);
		V = mmul( V, mrotate( g_yaw, vec3( 0,1,0 ) ) );

		a_mot.update();
		b_mot.update();
		c_mot.update();

		a_mot.exec( P, V, g_param_colset, 0.01, m_cntframe );
		b_mot.exec( P, V, g_param_colset, 0.01, m_cntframe );
		c_mot.exec( P, V, g_param_colset, 0.01, m_cntframe );

		if ( a_mot.m_mot )//&& b_mot.m_mot && c_mot.m_mot )
		{
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
				m_cntframe += m_stepFrame;
				if ( m_cntframe < 1 ) m_cntframe = a_mot.m_mot.MOTION.Frames-1; 
				if ( m_cntframe >= a_mot.m_mot.MOTION.Frames ) m_cntframe = 1; 
				if ( m_stepFrame )
				{
					window.document.getElementById("html_frameval").value = m_cntframe;
				}
				window.document.getElementById("html_framemax").innerHTML = a_mot.m_mot.MOTION.Frames-1;
			}


		}

	}

}


//-----------------------------------------------------------------------------
function html_update()
//-----------------------------------------------------------------------------
{
	init_testmodel();
}
//-----------------------------------------------------------------------------
function html_onchange( valRequest )
//-----------------------------------------------------------------------------
{
	if ( valRequest =="abs" )
	{
		var list = window.document.getElementsByName( "html_cam" ) ;
		for ( let l of list )
		{
			if ( l.checked ) 
			{
				switch( l.value )
				{
					case "cam1":
						g_param_fovy = 45;
						g_param_look = 0.8;	//1.3;
						g_param_high = 0.8;	//0.7;
						g_param_zoom = 4.0;	//5.0;
		g_yaw = radians( -26  );
						break;
					case "cam2":
						g_param_fovy = 42;
						g_param_look = 1.2;	//2.2;	//1.6;	//2
						g_param_high = 3.3;	//0.3;	//0.4;	//0.3
						g_param_zoom = 6;	//6;	//5;	//6
		g_yaw = radians( -26  );
						break;
					case "cam3":
						g_param_fovy = 55;
						g_param_look = 1;
						g_param_high = 6;
						g_param_zoom = 4;
		g_yaw = radians( -26  );
						break;
				}
				break;
			}
		}
	}
	else
	{
//						g_param_fovy = window.document.getElementById( "html_fovy" ).value*1;
//						g_param_look = window.document.getElementById( "html_look" ).value*1;
//						g_param_high = window.document.getElementById( "html_high" ).value*1;
//						g_param_zoom = window.document.getElementById( "html_zoom" ).value*1;
//g_param_fovy = 45;
//g_param_look = 0.8;
//g_param_high = 0.8;
//g_param_zoom = 4.0;
	}


//	g_param_normal	= window.document.getElementsByName( "html_normal" )[0].checked ;
//	g_param_raph	= window.document.getElementsByName( "html_raph" )[0].checked ;
//	m_cntframe = window.document.getElementById("html_frameval").value*1;

	g_rot = 	window.document.getElementById("html_rot").value;

	g_param_normal	= false;
	g_param_raph	= false;
//	m_cntframe		= 1;

/*
	if( valRequest == "最大解像度" )
	{
		html_canvas.width = window.screen.width/2;
		html_canvas.height = window.screen.height/2;
		main();
	}
	else
	if( valRequest == "fullscreen" )
	{
		if( 	window.document.fullscreenEnabled
			||	document.documentElement.webkitRequestFullScreen ) // iOS対応
		{
			original_width = html_canvas.width;
			original_height = html_canvas.height;
			html_canvas.width = window.screen.width;
			html_canvas.height = window.screen.height;

			if ( window.orientation ) // iOS用、縦横検出
			{
				if( window.orientation == 90 || window.orientation == -90 )
				{
					html_canvas.width = window.screen.height;
					html_canvas.height = window.screen.width;
				}
			}
			gra3 = create_gra_webgl( html_canvas.getContext( "webgl", { antialias: true } ) );	// 画面再設定
			{
				let obj =	html_canvas.requestFullscreen 
						||	html_canvas.webkitRequestFullScreen;

				obj.call( html_canvas );
			}

			function callback()
			{
				if (	window.document.fullscreenElement
					||	window.document.webkitFullscreenElement )
				{
					// フルスクリーンへ突入時
//					window.document.getElementById("html_debug1").innerHTML = window.orientation;
//					window.document.getElementById("html_debug2").innerHTML = window.screen.width+","+window.screen.height;
				}
				else
				{
					// フルスクリーンから戻り時
					html_canvas.width = original_width;
					html_canvas.height = original_height;
					gra3 = create_gra_webgl( html_canvas.getContext( "webgl", { antialias: true } ) );	// 画面再設定
				}
			}
			window.document.addEventListener("fullscreenchange", callback, false);
			window.document.addEventListener("webkitfullscreenchange", callback, false);
		}
		else
		{
			alert("フルスクリーンに対応していません");
		}
	}
	else
*/
	{
		g_param_request = valRequest;

	}
}

main();
