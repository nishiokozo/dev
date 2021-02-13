// 2017/07/07 ver 1.1 
// 2021/01/29 c++ to javascript
"use strict";



const	INFINIT = Number.MAX_VALUE;

class GRA
{
	//-----------------------------------------------------------------------------
	constructor( w, h, canvas )
	//-----------------------------------------------------------------------------
	{
		this.canvas = canvas;
		this.ctx = canvas.getContext('2d');
		this.img = this.ctx.createImageData( w, h );
	}
	//-----------------------------------------------------------------------------
	cls( col )
	//-----------------------------------------------------------------------------
	{
		if ( col.x > 1.0 ) col.x = 1.0;
		if ( col.y > 1.0 ) col.y = 1.0;
		if ( col.z > 1.0 ) col.z = 1.0;
	
		for (let x=0; x<this.img.width ; x++ )
		for (let y=0; y<this.img.height ; y++ )
		{
			let adr = (y*this.img.width+x)*4;
			this.img.data[ adr +0 ] = Math.floor(255*col.x);
			this.img.data[ adr +1 ] = Math.floor(255*col.y);
			this.img.data[ adr +2 ] = Math.floor(255*col.z);
			this.img.data[ adr +3 ] = 0xff;
		}
	}

	//-----------------------------------------------------------------------------
	pset( x, y, col )
	//-----------------------------------------------------------------------------
	{
		if ( col.x > 1.0 ) col.x = 1.0;
		if ( col.y > 1.0 ) col.y = 1.0;
		if ( col.z > 1.0 ) col.z = 1.0;
	

		let adr = (y*this.img.width+x)*4;
		this.img.data[ adr +1 ] = Math.floor(255*col.y); // G
		this.img.data[ adr +0 ] = Math.floor(255*col.x); // R
		this.img.data[ adr +2 ] = Math.floor(255*col.z); // B
	}

	//-----------------------------------------------------------------------------
	streach()
	//-----------------------------------------------------------------------------
	{
		// -----------------------------------------
		// ImageDataをcanvasに合成
		// -----------------------------------------
		// ctx   : html_canvas.getContext('2d')
		// img : ctx.createImageData( width, height )

		this.ctx.imageSmoothingEnabled = this.ctx.msImageSmoothingEnabled = 0; // スムージングOFF
		{
		// 引き伸ばして表示
		    let cv=document.createElement('canvas');				// 新たにcanvasを生成
		    cv.width = this.img.width;
		    cv.height = this.img.height;
			cv.getContext("2d").putImageData( this.img,0,0);		// 作成したcanvasにImageDataをコピー
			{
				let sx = 0;
				let sy = 0;
				let sw = this.img.width;
				let sh = this.img.height;
				let dx = 0;
				let dy = 0;
				let dw = this.canvas.width;
				let dh = this.canvas.height;
				this.ctx.drawImage( cv,sx,sy,sw,sh,dx,dy,dw,dh);	// ImageDataは引き延ばせないけど、Imageは引き延ばせる
			}
			
		}
	}
}
class vec3
{
	constructor( x, y, z )
	{
		this.x = x;
		this.y = y;
		this.z = z;
	}
};

class Plate
{
	constructor( _p, _n, _c, _valReflection, _valRefractive, _valPower, _valEmissive, _valTransmittance, valFresnel )
	{
		this.P					= _p;
		this.N					= _n;
		this.C					= _c;
		this.valReflectance		= _valReflection;
		this.valRefractive		= _valRefractive;
		this.valPower			= _valPower;
		this.valEmissive		= _valEmissive;
		this.valTransmittance	= _valTransmittance;
		this.valFresnel			= valFresnel;	
	};
};

class	Light
{
	constructor( _p, _c )
	{
		this.P = _p;
		this.C = _c;
	}
};

class	Surface
{
	constructor()
	{
		this.t = INFINIT;
		this.flg		= false ; 
		this.stat	= 0; 
			// 0:none
			// 1:back
			// 2:front
			// 3:inside

		this.C	= new vec3(0,0,0);
		this.Q	= new vec3(0,0,0);
		this.N	= new vec3(0,0,0);
		this.Rl	= new vec3(0,0,0);	//	Reflection
		this.Rr	= new vec3(0,0,0);	//	Refraction

		this.valReflectance		= 0.0;
		this.valRefractive		= 0.0;
		this.valPower			= 0.0;
		this.valEmissive		= 0.0;
		this.valTransmittance	= 0.0;
		this.valFresnel			= 0.0;	

	}
};

class Sphere
{
	constructor( _P, _r, _C, _valReflection, _valRefractive, _valPower, _valEmissive, _valTransmittance, valFresnel )
	{
		this.P					= _P;
		this.r					= _r;
		this.C					= vmax( new vec3(0,0,0), vmin( new vec3(1,1,1),_C));
		this.valReflectance		= _valReflection;
		this.valRefractive		= _valRefractive;
		this.valPower			= _valPower;
		this.valEmissive		= _valEmissive;
		this.valTransmittance	= _valTransmittance;
		this.valFresnel			= valFresnel;	
	};
};

//------------------------------------------------------------------------------
function normalize( v )
//------------------------------------------------------------------------------
{
	let s = 1/Math.sqrt( v.x*v.x + v.y*v.y + v.z*v.z );
	return new vec3(
		v.x * s,
		v.y * s,
		v.z * s
	);
}
//------------------------------------------------------------------------------
function vadd( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		a.x +b.x,
		a.y +b.y,
		a.z +b.z
	);
}
//------------------------------------------------------------------------------
function vsub( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		a.x -b.x,
		a.y -b.y,
		a.z -b.z
	);
}
//------------------------------------------------------------------------------
function vmul( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		a.x *b.x,
		a.y *b.y,
		a.z *b.z
	);
}
//------------------------------------------------------------------------------
function vdiv( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		a.x /b.x,
		a.y /b.y,
		a.z /b.z
	);
}
//------------------------------------------------------------------------------
function vmax( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		Math.max(a.x,b.x),
		Math.max(a.y,b.y),
		Math.max(a.z,b.z)
	);
}
//------------------------------------------------------------------------------
function vmin( a, b )
//------------------------------------------------------------------------------
{
	return new vec3( 
		Math.min(a.x,b.x),
		Math.min(a.y,b.y),
		Math.min(a.z,b.z)
	);
}
//------------------------------------------------------------------------------
function reflect( I, N )
//------------------------------------------------------------------------------
{
	let a = 2*dot(I,N);
 	return vsub( I , vmul( new vec3(a,a,a), N ) );
}
//------------------------------------------------------------------------------
function refract( I, N, eta )
//------------------------------------------------------------------------------
{
	let R = new vec3(0,0,0);
	let k = 1.0 - eta * eta * (1.0 - dot(N, I) * dot(N, I));
	if ( k < 0.0 )
	{
		R = new vec3(0,0,0);
	}
	else
	{
		let ve = new vec3(eta,eta,eta);
		let a = vmul( ve , I ); 
		let b = eta * dot(N, I);
		let c = b + Math.sqrt(k);
		let d = vmul( new vec3(c,c,c) , N);
		R = vsub(a , d);
	}
	return R;
}

//------------------------------------------------------------------------------
function dot( a, b )
//------------------------------------------------------------------------------
{
	return a.x*b.x + a.y*b.y + a.z*b.z;
}

//------------------------------------------------------------------------------
function Raycast( P, I )
//------------------------------------------------------------------------------
{
	let sur = new Surface();

	P = vadd( P, vmul( I, new vec3( 2e-10, 2e-10, 2e-10) ) ); 

	sur.flg = false;

	sur.t  = INFINIT;
	sur.stat  = 0;//Surface::STAT_NONE;


	//	球
	for ( let obj of g_tblSphere )
	{
		let	O = obj.P;
		let	r = obj.r;

		let	OP = vsub(P,O);
		let	b = dot( I, OP );
		let	aa = r*r - dot(OP,OP)+ b*b;

		let	stat = 0;

		if ( aa >= 0 )
		{
			let t = - Math.sqrt( aa ) - b;

			if ( t < 0 ) // 衝突距離tがマイナス、つまり視点Pより後ろの衝突は、レイがボールの中を通ってボールの奥で衝突した
			{
				t = + Math.sqrt( aa ) - b;
				stat++;
			}

			if ( sur.t >= t && t >= 0 )
			{
				stat += 2;

				sur.stat = stat;

				sur.t = t; 

				sur.Q = vadd( vmul( I , new vec3(t,t,t) ) , P );

				if ( stat == 3 )//Surface::STAT_BACK )
				{
					// ボールから出射
					sur.N = vsub( new vec3(0,0,0), normalize( vsub( sur.Q , O ) ) );
					sur.valRefractive		= 1.0; // 球の外は空気（屈折率1.0)と想定
				}
				else
				{
					// ボールへ入射
					sur.N = normalize( vsub( sur.Q , O ) );
					sur.valRefractive		= obj.valRefractive;
				}

				sur.C					= obj.C;

				sur.Rl					= reflect( I, sur.N );

				sur.Rr					= refract( I, sur.N, 1.0/obj.valRefractive ); // 空気の屈折率は1.0（=真空）とみなしてる。

				sur.valReflectance		= obj.valReflectance;

				sur.valPower			= obj.valPower;

				sur.valEmissive			= obj.valEmissive;

				sur.valTransmittance	= obj.valTransmittance;

				sur.valFresnel			= obj.valFresnel;

				sur.flg = true;
			}
		}
	}

	//	床
	for ( let obj of g_tblPlate )
	{
		let	f = dot( obj.N, vsub( P , obj.P) );
		if ( f > 0 )
		{
			let	t = -f/dot(obj.N,I);

			if ( sur.t >= t && t >= 0 )
			{
				sur.stat = 2;//Surface::STAT_FRONT;

				sur.t = t; 

				sur.Q = vadd( vmul( I , new vec3(t,t,t) ), P );

				sur.N = obj.N;

				if (   ( ((sur.Q.x+10e3) % 1.0) < 0.5 && ((sur.Q.z+10e3) % 1.0) < 0.5 )
					|| ( ((sur.Q.x+10e3) % 1.0) > 0.5 && ((sur.Q.z+10e3) % 1.0) > 0.5 ) 
				)
				{
					sur.C = obj.C;
				}
				else
				{
					sur.C = vmul( obj.C , new vec3(0.5,0.5,0.5) );
				}
	
				sur.Rl = reflect( I, obj.N );

				sur.Rr	= 1.0; // 床に屈折はないとみなしている。
	
				sur.valReflectance = obj.valReflectance;

				sur.valRefractive   = obj.valRefractive;

				sur.valPower = obj.valPower;

				sur.valEmissive = obj.valEmissive;

				sur.valTransmittance = obj.valTransmittance;

				sur.valFresnel			= obj.valFresnel;

				sur.flg = true;
			}
			
		}

	}

	return sur;
}

		function calc_refract( sur )
		{
			// 屈折計算
			let rt = (1-r)*sur.valTransmittance; //吸収率,透明率
			let rd = 1-r-rt; // 拡散率

			let surR = Raycast( sur.Q, sur.Rr );

			let Lt = Raytrace( surR.Q, surR.Rr, nest+1, lgt ); 		// 透過光

			let a = Math.pow( sur.valTransmittance, surR.t ); 		// 減衰率

			let Ct = vmul( vmul( new vec3(a,a,a) , sur.C ) , Lt ); 	// 透過光カラー

			let Cd = vmul( vmul( new vec3(d,d,d) , sur.C ) , Lc );	// 拡散カラー

			let ct = vmul( new vec3(rt,rt,rt), Ct ) //透過光
			let dt = vmul( new vec3(rd,rd,rd), Cd ) //拡散光

			return vadd( ct, dt );
		}

//------------------------------------------------------------------------------
function Raytrace( P, I, nest, lgt )
//------------------------------------------------------------------------------
{
	let ret = new vec3(0,0,0);

	if ( nest > g_MaxReflect ) return ret;
//	if ( g_cntRay > g_MaxReflect ) return ret;
//	g_cntRay++;
	
	let sur = Raycast( P, I );
	if ( sur.flg )
	{
		let mL	= normalize( vsub( lgt.P, sur.Q ) );	// -L
		let l = dot( vsub( sur.Q , lgt.P) , vsub( sur.Q , lgt.P) ) ;
		let Lc	= vdiv( lgt.C , new vec3(l,l,l) );
		let r	= sur.valReflectance;
		let	d	= Math.max( 0.0, dot( sur.N, mL ) );
		let	s	= (sur.valPower+2)/(8*Math.PI) * Math.pow( Math.max( 0.0, dot( sur.Rl, mL ) ), sur.valPower );


		{// 遮蔽物判定＆スペキュラ計算
			let sur3 = Raycast( sur.Q, sur.Rl );
			if ( sur3.flg )
			{
				s	*=  sur3.valTransmittance;
			}
		}

		ret	 =	vadd( ret , vmul( new vec3(r,r,r) , vmul( vadd( Raytrace( sur.Q, sur.Rl, nest+1, lgt ), new vec3(s,s,s) ) , Lc ) ) );


		{// 遮蔽物判定＆デフューズ計算
			let sur2 = Raycast( sur.Q, mL );
			if ( sur2.flg )
			{
				// 影の中
				d	*=  sur2.valTransmittance;

//				let C = Raytrace( sur.Q, mL, nest+1, lgt );
				
//				d = C.y;//影のレンダリング実験。球体の反射が影にも映りこむ。おかしく感じる。反射成分は10%ほど。透過光の方がずっと明るいはず。
			}
		}



					
		if ( sur.valTransmittance == 0.0 )
		{
			ret = vadd( ret, vmul( vmul( new vec3(1-r,1-r,1-r) , ( vmul( new vec3(d,d,d) , sur.C ) ) ) , Lc) );
		}
		else
		{
			let surR = Raycast( sur.Q, sur.Rr );
			let C = Raytrace( surR.Q, surR.Rr, nest+1, lgt ); 
			let c = vadd( ret, vmul( new vec3(1-r,1-r,1-r) , C ) ); 
			let a = Math.pow( surR.valTransmittance,surR.t ); // 透明率と球体の中を光のとおった距離で累乗する。
			ret = vadd( ret, vmul( new vec3(a,a,a) , c ) );

		}
	}
	else
	{
		//どこにも衝突しなかった場合。光源が直接返る

		let mL	= normalize( vsub( lgt.P, P ) );	// -L
		let l = dot( vsub( P , lgt.P) , vsub( P , lgt.P) ) ;
		let Lc	= vdiv( lgt.C , new vec3(l,l,l) );
		let	s	= Math.max( 0.0, dot( I, mL ) );
		s	= Math.pow( s, 1000 ); //10000乗は適当な値


		ret	 =	vmul( new vec3(s,s,s), Lc );
	}


	return ret;
}

//------------------------------------------------------------------------------
function initScene( n )
//------------------------------------------------------------------------------
{
	g_tblLight = [];
	g_tblSphere = [];
	g_tblPlate = [];

	let P,C,N,rl,rr,pw,e,tm,r,l,fn;

	switch(n)
	{
	case "grass":
		{
			g_tblPlate.push( new Plate( new vec3( 0   ,  0 , 0 ), normalize(new vec3(0, 1,0))  , new vec3(0.8, 0.8, 0.8), 0.0, 1.0, 20, 0.0, 0.0,fn=0.0 ) );

			g_tblSphere.push( new Sphere(new vec3(1.75,1.0 , 0 ), 1.0 , new vec3(1.0, 1.0, 1.0), rl=0.0, rr=1.4, pw=200, 0.0, tm=1.0,fn=0.0 ) );

			g_tblLight.push( new Light( new vec3( 20  , 12 , 0 ), new vec3( 800, 800, 800) ) );
		}
		break;

	case "grassball":
		{
			// rr(refractance/屈折率)
			// 空気		屈折率	1.0003
			// 氷		屈折率	1.309
			// 水		屈折率	1.3330
			// アクリル	屈折率	1.49~1.53
			// ガラス	屈折率	1.51	一般的なガラス
			// ダイヤ	屈折率	2.4195
			g_tblPlate.push( new Plate( new vec3( 0   ,  0 ,  0    ), normalize(new vec3(0, 1,0))  , new vec3(0.8, 0.8, 0.8), 0.0, 1.0, 20, 0.0, 0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 2.0 , 1.0 ,2),   1.0 , new vec3(1.0, 1.0, 1.0), rl=0.1, rr=1.5, pw=200, 0.0, tm=0.5,fn=0.0 ) );
			g_tblLight.push( new Light( new vec3( 20   ,  12 , 20 ), new vec3(1800, 1800, 1800) ) );

		}
		break;
		
	case "spot":
		{
		//	X,Y,Z,CR,CG,CB,Rl,RF,KF,OW,KV
		// _P, _r, _C, _valReflection, _valRefractive, _valPower, _valEmissive, _valTransmittance )
			g_tblPlate.push( new Plate( P=new vec3( 0  ,  0 ,0.0),N=new vec3(0,1,0),C=new vec3(0.8,0.8,0.8),rl=0.5,rr=1.0 ,pw=20,e= 0.0,tm=0.0,fn=0.0 ) );

			let sphere =
			[
				{x: 0.0	,y:0.5	,z:-0.58	,cr:0.0 ,cg:0.1 ,cb:1.0 ,r:0.5	,rf:0.5 ,kf:0.0 ,pw:116 ,kv:1.4},
				{x:-0.5	,y:0.5	,z: 0.29	,cr:0.0 ,cg:1.0 ,cb:0.1 ,r:0.5	,rf:0.5 ,kf:0.0 ,pw:116 ,kv:1.4},
				{x: 0.5	,y:0.5	,z: 0.29	,cr:1.0 ,cg:0.1 ,cb:0.1 ,r:0.5	,rf:0.5 ,kf:0.0 ,pw:116 ,kv:1.4},
				{x: 0.0	,y:1.32	,z: 0.0		,cr:1.0 ,cg:1.0 ,cb:1.0 ,r:0.5	,rf:0.8 ,kf:0.0 ,pw:116 ,kv:1.4},
			];
			for ( let a of sphere )
			{
				g_tblSphere.push( new Sphere(
					 P=new vec3( a.x , a.y , a.z )
					,r=a.r 
					,C=new vec3( a.cr, a.cg,  a.cb) 
					,rl=a.rf
					,rr=0.0 
					,pw=a.pw
					,e= 0.0
					,tm=0.0 
					,fn=0.0
				) );
			}

			let light =
			[
				{x: 0.2	,y:3.0	,z:0.2	,r:1.0 ,g:1.0 ,b:1.0 ,w:20}
			];
			for ( let a of light )
			{
				g_tblLight.push( new Light( 
					 P=new vec3( a.x ,a.y ,a.z )
					,C=new vec3( a.r*a.w ,a.g*a.w ,a.b*a.w ) 
				));
			
			}
		}
		break;

	case "4balls":
		{
			g_tblPlate.push( new Plate( P=new vec3( 0  ,  0 ,0.0),N=new vec3(0,1,0),C=new vec3(0.8,0.8,0.8),rl=0.5,rr=1.0 ,pw=20,e= 0.0,tm=0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 0.0 , 1.25, 0       ),   0.5 , new vec3(1  , 0.2, 0.2), 0.5, 1.0, 40, 0.0, 0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 0.0 , 0.5 , -0.433 ),   0.5 , new vec3(0.0, 0.0, 0.0), 1.0, 1.0, 40, 0.0, 0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 0.5 , 0.5 , +0.433 ),   0.5 , new vec3(0.2, 0.2, 1.0), 0.5, 1.0, 40, 0.0, 0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3(-0.5 , 0.5 , +0.433 ),   0.5 , new vec3(0.0, 1.0, 0.0), 0.5, 1.0, 40, 0.0, 0.0,fn=0.0 ) );
			l=40;g_tblLight.push( new Light( new vec3( 4   ,  2 , -1 ), new vec3(0.6*l, 0.8*l, 1.0*l) ) );
			l=10;g_tblLight.push( new Light( new vec3( -1  ,  2 ,  -3 ), new vec3(1.0*l, 0.8*l, 0.6*l) ) );
		}
		break;

	case "5metals":
		{
			g_tblPlate.push( new Plate( P=new vec3( 0  ,  0 ,0.0),N=new vec3(0,1,0),C=new vec3(0.8,0.8,0.8),rl=0.5,rr=1.0 ,pw=120,e= 0.0,tm=0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3(-2.0 , 0.5 , 0 ),   0.5 , new vec3(0.0, 0.0, 0.0), 1.0 , 1.0, 120, 0.0, 0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3(-1.0 , 0.5 , 0 ),   0.5 , new vec3(0.0, 0.0, 0.0), 0.75, 1.0, 120, 0.0, 0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 0.0 , 0.5 , 0 ),   0.5 , new vec3(0.0, 0.0, 0.0), 0.5 , 1.0, 120, 0.0, 0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 1.0 , 0.5 , 0 ),   0.5 , new vec3(0.0, 0.0, 0.0), 0.25, 1.0, 120, 0.0, 0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 2.0 , 0.5 , 0 ),   0.5 , new vec3(0.0, 0.0, 0.0), 0.05, 1.0, 120, 0.0, 0.0,fn=0.0 ) );
			g_tblLight.push( new Light( new vec3( 0   ,  20 ,  0 ), new vec3(800,800,800) ) );

			//	g_tblLight.push( new Light( new vec3(-20   ,  40 , 10 ), new vec3(   0,   0,400) )  );
			//	g_tblLight.push( new Light( new vec3( 30   ,  40 ,  0 ), new vec3(   0,400,   0) )  );
			//	g_tblLight.push( new Light( new vec3( 10   ,  40 , 20 ), new vec3(400,   0,   0) )  );
		}
		break;

	case "rasen":
		{ 
			g_tblPlate.push( new Plate( P=new vec3( 0  ,  0 ,0.0),N=new vec3(0,1,0),C=new vec3(0.8,0.8,0.8),rl=0.5,rr=1.0 ,pw=20,e= 0.0,tm=0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(  new vec3( 0 , 1.0 , 0 ),   0.5 ,  new vec3(0.0, 0.0, 0.0),   0.5,   1.0 ,  120,  0.0,  0.0,fn=0.0 ) );
			let	max = 16*3;
			for ( let i = 0 ; i < max ; i++ )
			{
				let	th  = i *(Math.PI/360)*16 * 3;
				let	th2 = i *(Math.PI/360)*16 * 0.5;
				let	x = Math.cos(th);
				let	z = Math.sin(th) ;
				let	y = Math.cos(th2) +1.2;
				g_tblSphere.push( new Sphere(P=new vec3( x , y , z ),r=0.2 ,C=new vec3( x, y,  z) ,rl=0.2,rr=0.0 ,pw=60,e= 0.0,tm=0.0,fn=0.0 ) );
			}


			if (1)
			{
				g_tblLight.push( new Light( new vec3( 5   ,  30 ,  -5 ), new vec3(1800,1800,1800) ) );
//				g_tblLight.push( new Light( new vec3(-30   ,  30 ,  0 ), new vec3( 900,1800,1800) )  );
//				g_tblLight.push( new Light( new vec3(60   ,  80 ,  0 ), new vec3(4800,4800,2400) )  );
//				g_tblLight.push( new Light( new vec3(-60   ,  80 , 0 ), new vec3(4800,2400,4800) )  );
			}
			else
			{
				g_tblLight.push( new Light( new vec3(  0   ,  30 ,  0 ), new vec3(1600,1600,1600) ) );
				g_tblLight.push( new Light( new vec3(-20   ,  40 ,  0 ), new vec3(   0,   0,4000) )  );
				g_tblLight.push( new Light( new vec3( 30   ,  40 ,  0 ), new vec3(   0,4000,   0) )  );
				g_tblLight.push( new Light( new vec3( 10   ,  40 ,  0 ), new vec3(4000,   0,   0) )  );
			}
		}
		break;

	case "twinballs":
		{
			g_tblPlate.push( new Plate( new vec3( 0   ,  0 ,  0    ), normalize(new vec3(0, 1,0))  , new vec3(0.8, 0.8, 0.8), 0.5, 1.0, 20, 0.0, 0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3(-1.0 , 1.0 , 0 ),   1.0 , new vec3(1.0, 0.5, 0.5), 0.2, 1.0, 20, 0.0, 0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 1.0 , 1.0 , 0 ),   1.0 , new vec3(0.0, 0.0, 0.0), 0.2, 1.0, 20, 0.0, 0.0,fn=0.0 ) );
			g_tblLight.push( new Light( new vec3( 0   ,  20 ,  0 ), new vec3(800, 800, 800) ) );
		}
		break;


	case "refract":
		{
			g_tblPlate.push( new Plate( new vec3( 0   ,  0 ,  0    ), normalize(new vec3(0, 1,0))  , new vec3(0.8, 0.8, 0.8), 0.5, 1.0, 20, 0.0, 0.0,fn=0.0 ) );
//	constructor( _P, _r, _C, _valReflection, _valRefractive, _valPower, _valEmissive, _valTransmittance )
			// valTransmittance 長さ1辺りの減衰率。0.9なら距離1で90％の明るさになる
//	let P,C,N,rl,rr,pw,e,tm,r,l;

//			g_tblSphere.push( new Sphere(new vec3(-0.0 , 1.0 , 8 ),   1.0 , new vec3(0.1, 1.0, 0.1) , 0.0, 0.0, 20, 0.0, 0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 0.0 , 1.25, 0      +0),   0.5 , new vec3(1  , 0.2, 0.2), 0.2, 1.0, 60, 0.0, 0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 0.0 , 0.5 , -0.433 +0),   0.5 , new vec3(1.0, 1.0, 0.2), 0.2, 1.0, 60, 0.0, 0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 0.5 , 0.5 , +0.433 +0),   0.5 , new vec3(0.2, 0.2, 1.0), 0.2, 1.0, 60, 0.0, 0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3(-0.5 , 0.5 , +0.433 +0),   0.5 , new vec3(0.0, 1.0, 0.0), 0.2, 1.0, 60, 0.0, 0.0,fn=0.0 ) );


			g_tblSphere.push( new Sphere(new vec3(-1.0 , 1.0 ,-2),   1.0 , new vec3(0.0, 0.0, 0.0), rl=0.1, rr=1.5, pw=200, 0.0, tm=0.8,fn=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 1.0 , 1.0 ,+2),   1.0 , new vec3(0.0, 0.0, 0.0), rl=0.1, rr=2.0, pw=200, 0.0, tm=0.8,fn=0.0 ) );
if(0)
{
				g_tblLight.push( new Light( new vec3( 0   ,  20 ,  0 ), new vec3(   0,   0,800) )  );
				g_tblLight.push( new Light( new vec3( 0   ,  20 ,  0 ), new vec3(   0,800, 0) )  );
				g_tblLight.push( new Light( new vec3( 0   ,  20 ,  0 ), new vec3(800,   0,   0) )  );
}
else
{
			g_tblLight.push( new Light( new vec3( 0   ,  20 ,  0 ), new vec3(800, 800, 800) ) );
}

		}
		break;


		
	case "colorballs":
		{
			g_tblPlate.push( new Plate( P=new vec3(0  , 0 ,0.0),N=new vec3(0,1,0),C=new vec3(0.8,0.8,0.8),rl=0.3,rr=1.0 ,pw=70,e= 0.0,tm=0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(P=new vec3( 0.5,1.0,0.0)	,r=0.5  ,C=new vec3(0.0,0.0,1.0),rl=0.3,rr=1.0 ,pw=70,e=10.0,tm=0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(P=new vec3(-0.5,1.0,0.0)	,r=0.5  ,C=new vec3(0.0,1.0,0.0),rl=0.3,rr=1.0 ,pw=70,e=10.0,tm=0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(P=new vec3( 0.0,1.5,0.0)	,r=0.5  ,C=new vec3(1.0,0.0,0.0),rl=0.3,rr=1.0 ,pw=70,e=10.0,tm=0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(P=new vec3( 0.0,0.5,0.0)	,r=0.5  ,C=new vec3(1.0,1.0,0.0),rl=0.3,rr=1.0 ,pw=70,e=10.0,tm=0.0,fn=0.0 ) );
			g_tblSphere.push( new Sphere(P=new vec3( 0.0,1.0,0.0)	,r=0.5 ,C=new vec3(1.0,1.0,1.0),rl=0.3,rr=1.0 ,pw=70,e=10.0,tm=0.0,fn=0.0 ) );
			g_tblLight.push( new Light( P=new vec3( 1.0 ,15, 0 ) ,C=new vec3(360,360,360) )  );
				g_tblLight.push( new Light( new vec3(-20   ,  40 , 10 ), new vec3(   0,   0,400) )  );
				g_tblLight.push( new Light( new vec3( 30   ,  40 ,  0 ), new vec3(   0,400,   0) )  );
				g_tblLight.push( new Light( new vec3( 10   ,  40 , 20 ), new vec3(400,   0,   0) )  );
		}
		break;
	}
}

//------------------------------------------------------------------------------
function rotYaw( v, th )
//------------------------------------------------------------------------------
{
   	let s = Math.sin(th);
	let c = Math.cos(th);
	// c,  0, -s,
	// 0,  1,  0,
    // s,  0,  c
	let nx = v.x*c			- v.z*s;
	let ny =		 v.y;
	let nz = v.x*s			+ v.z*c;

	return new vec3( nx, v.y, nz );
}
//------------------------------------------------------------------------------
function rotPitch( v, th )
//------------------------------------------------------------------------------
{
	let s = Math.sin(th);
	let c = Math.cos(th);
	// 1,  0,  0,
	// 0,  c,  s,
	// 0, -s,  c
	let nx = v.x;
	let ny =	 v.y*c + v.z*s;
	let nz =	-v.y*s + v.z*c;

	return new vec3( nx, ny, nz );
}
//------------------------------------------------------------------------------
function rotRoll( v, th )
//------------------------------------------------------------------------------
{
	let s = Math.sin(th);
	let c = Math.cos(th);
	// c,  s,  0,
	//-s,  c,  0,
	// 0,  0,  1
	let nx = v.x*c + v.y*s;
	let ny =-v.x*s + v.y*c;
	let nz = 				v.z;

	return new vec3( nx, ny, nz );
}

//------------------------------------------------------------------------------
function paint( gra, rot )
//------------------------------------------------------------------------------
{
	let	posEye = new vec3(0,1.0,-17+8);
	let	posAt = new vec3(0,1.0,0);
	
	posEye.x = document.getElementById( "html_eye_x" ).value*1;
	posEye.y = document.getElementById( "html_eye_y" ).value*1;
	posEye.z = document.getElementById( "html_eye_z" ).value*1;
	posAt.x = document.getElementById( "html_at_x" ).value*1;
	posAt.y = document.getElementById( "html_at_y" ).value*1;
	posAt.z = document.getElementById( "html_at_z" ).value*1;
	let fovy = document.getElementById( "html_fovy" ).value*Math.PI/180.0;
	let rz = document.getElementById( "html_rz" ).value*Math.PI/180.0;

	let sz = 1.0/Math.tan(fovy/2);	// 視点から投影面までの距離


	let a = function( v )
	{
		let yz = Math.sqrt(v.x*v.x+v.z*v.z);
		let ry = -Math.atan2( v.x , v.z ); 
		let rx = Math.atan2( v.y, yz ); 
		return [rx,ry];
	}
	let [rx,ry] = a( vsub(posAt, posEye) ); 

	let aspect = html_canvas.width/html_canvas.height;
	for( let py = 0 ; py < gra.img.height ; py++ )
	{
		for( let px = 0 ; px < gra.img.width ; px++ )
		{
			g_cntRay = 0;

			let x = (px / gra.img.width)*aspect *2.0-1.0*aspect;
			let y = (py / gra.img.height) *2.0-1.0;

			let P = posEye;
			let I =  normalize( new vec3( x, y, sz ) );
			

			I = rotRoll( I, rz );
			I = rotPitch( I, rx );
			I = rotYaw( I, ry );

//	 		let C = Raytrace( P, I );
			let nest = 0;
			let C = new vec3(0,0,0);
			for ( let lgt of g_tblLight )
			{
		 		C = vadd( C, Raytrace( P, I, nest+1, lgt ) );
			}
			gra.pset( px, gra.img.height-py, C );
		}
	}
}

//------------------------------------------------------------------------------
function update_paint()
//------------------------------------------------------------------------------
{

	let	SIZwidth =  Math.floor(html_canvas.width*g_numReso);		// レンダリングバッファの解像度
	let	SIZheight =  Math.floor(html_canvas.height*g_numReso);	// レンダリングバッファの解像度



	let time = 0;
	{
		let gra = new GRA( SIZwidth, SIZheight, html_canvas );
		gra.cls( new vec3(0,0,0) );
		gra.streach();
		const st = performance.now();
		paint( gra, (0)*Math.PI/18 );
		const en = performance.now();
		time = en-st;
		gra.streach();
	}

		document.getElementById("html_msec").innerHTML = ""+(time).toFixed()+"msec";
		document.getElementById("html_fps").innerHTML = ""+(60/(time/(1000/60))).toFixed()+" fps";

}


//------------------------------------------------------------------------------
function update_scene()
//------------------------------------------------------------------------------
{

	g_MaxReflect = document.getElementById( "html_maxreflect" ).value*1;
	{
		html_canvas.width = document.getElementById( "html_size_x" ).value;
		html_canvas.height = document.getElementById( "html_size_y" ).value;
	}

	initScene( g_strScene );

	update_paint();
}
//------------------------------------------------------------------------------
function update_start()
//------------------------------------------------------------------------------
{
	// レイトレ結果以外の更新を促すために１フレーム開ける。
	requestAnimationFrame( update_scene );
};
//------------------------------------------------------------------------------
window.onload = function( e )
//------------------------------------------------------------------------------
{
	html_scene_click();
	html_reso_click();

	// javascript側で初期のキャンバスサイズを決める
	{
		html_canvas.width = window.innerWidth-40;
		html_canvas.height = html_canvas.width*(9/16);

		document.getElementById( "html_size_x" ).value = html_canvas.width;
		document.getElementById( "html_size_y" ).value = html_canvas.height;
	}




	// レンダリング開始
	requestAnimationFrame( update_start );

}
//-----------------------------------------------------------------------------
function rad( v )
//-----------------------------------------------------------------------------
{
	return v/180*Math.PI;
}

//-----------------------------------------------------------------------------
window.onkeydown = function( ev )
//-----------------------------------------------------------------------------
{
	const	KEY_TAB	= 9;
	const	KEY_CR	= 13;
	const	KEY_0	= 48;	//0x30
	const	KEY_1	= 49;	//0x31
	const	KEY_2	= 50;	//0x32
	const	KEY_3	= 51;	//0x33
	const	KEY_4	= 52;	//0x34
	const	KEY_5	= 53;	//0x35
	const	KEY_6	= 54;	//0x36
	const	KEY_7	= 55;	//0x37
	const	KEY_8	= 56;	//0x38
	const	KEY_9	= 57;	//0x39
	const	KEY_A	= 65;	//0x41
	const	KEY_B	= 66;	//0x42
	const	KEY_C	= 67;	//0x43
	const	KEY_D	= 68;	//0x44
	const	KEY_E	= 69;	//0x45
	const	KEY_F	= 70;	//0x46
	const	KEY_G	= 71;	//0x47
	const	KEY_H	= 72;	//0x48
	const	KEY_I	= 73;	//0x49
	const	KEY_J	= 74;	//0x4a
	const	KEY_K	= 75;	//0x4b
	const	KEY_L	= 76;	//0x4c
	const	KEY_M	= 77;	//0x4d
	const	KEY_N	= 78;	//0x4e
	const	KEY_O	= 79;	//0x4f
	const	KEY_P	= 80;	//0x50
	const	KEY_Q	= 81;	//0x51
	const	KEY_R	= 82;	//0x52
	const	KEY_S	= 83;	//0x53
	const	KEY_T	= 84;	//0x54
	const	KEY_U	= 85;	//0x55
	const	KEY_V	= 86;	//0x56
	const	KEY_W	= 87;	//0x57
	const	KEY_X	= 88;	//0x58
	const	KEY_Y	= 89;	//0x59
	const	KEY_Z	= 90;	//0x5a

	const	KEY_LEFT	= 37;
	const	KEY_UP		= 38;
	const	KEY_RIGHT	= 39;
	const	KEY_DOWN	= 40;


	let	c = ev.keyCode;

	if ( c >= KEY_0 && c <= KEY_9 ) return;
	if ( c == KEY_CR || c == KEY_TAB ) return;

	{
		// get
		let	posEye = new vec3(
			document.getElementById( "html_eye_x" ).value*1,
			document.getElementById( "html_eye_y" ).value*1,
			document.getElementById( "html_eye_z" ).value*1
		);
		let	posAt = new vec3(
			document.getElementById( "html_at_x" ).value*1,
			document.getElementById( "html_at_y" ).value*1,
			document.getElementById( "html_at_z" ).value*1
		);
		let fovy = document.getElementById( "html_fovy" ).value*Math.PI/180.0;
		let rz = document.getElementById( "html_rz" ).value*Math.PI/180.0;

		let a = function( v )
		{
			let yz = Math.sqrt(v.x*v.x+v.z*v.z);
			let ry = -Math.atan2( v.x , v.z ); 
			let rx = Math.atan2( v.y, yz ); 
			return [rx,ry];
		}
		let [rx,ry] = a( vsub(posAt, posEye) ); 
	
		let V =	vsub(posAt, posEye); // 視線ベクトル
		
		{//move

			let spdE = 0;
			let dirE = 0;
			let spdA = 0;
			let dirA = 0;
			let sE =1/2;
			let sA =1/4;

			{
				// 注視点
				if ( c == KEY_UP	) {posAt.y +=sA;}
				if ( c == KEY_DOWN	) {posAt.y -=sA;}
				if ( c == KEY_RIGHT	) {dirA=rad(0);spdA=sA;}
				if ( c == KEY_LEFT	) {dirA=rad(180);spdA=sA;}

				// 視点
				if ( c == KEY_R	) {dirE=rad( 90);spdE=sE;	}
				if ( c == KEY_F	) {dirE=rad(-90);spdE=sE;	}
				if ( c == KEY_D	) {dirE=rad(  0);spdE=sE;	}
				if ( c == KEY_A	) {dirE=rad(180);spdE=sE;	}
				if ( c == KEY_W	) {posEye.y+=sE;}
				if ( c == KEY_S	) {posEye.y-=sE;}
				if ( c == KEY_Q	) {rz+=rad(2);}
				if ( c == KEY_E	) {rz-=rad(2);}

				if ( spdE > 0 )
				{
					posEye.x += Math.cos( ry+dirE )*spdE;
					posEye.z += Math.sin( ry+dirE )*spdE;
				}
				
				if ( spdA > 0 )
				{
					posAt.x += Math.cos( ry+dirA )*spdA;
					posAt.z += Math.sin( ry+dirA )*spdA;
				}
			}

		}
		
		// set
		document.getElementById( "html_eye_x" ).value = posEye.x.toFixed(3);
		document.getElementById( "html_eye_y" ).value = posEye.y.toFixed(3);
		document.getElementById( "html_eye_z" ).value = posEye.z.toFixed(3);
		document.getElementById( "html_at_x" ).value = posAt.x.toFixed(3);
		document.getElementById( "html_at_y" ).value = posAt.y.toFixed(3);
		document.getElementById( "html_at_z" ).value = posAt.z.toFixed(3);
		document.getElementById( "html_fovy" ).value = (fovy * 180 /Math.PI).toFixed();
		document.getElementById( "html_rz" ).value = (rz * 180 /Math.PI).toFixed();
	}

	requestAnimationFrame( update_paint );
}


let g_tblLight = [];
let g_tblSphere = [];
let g_tblPlate = [];
let g_MaxReflect;

let g_cntRay = 0;

let g_strScene="";
let g_numReso=1.0;
//-----------------------------------------------------------------------------
function html_scene_click()
//-----------------------------------------------------------------------------
{
	var list = document.getElementsByName( "html_scene" ) ;
	for ( let l of list )
	{
		if ( l.checked ) 
		{
			g_strScene = l.value;
			break;
		}
	}
}
//-----------------------------------------------------------------------------
function html_reso_click()
//-----------------------------------------------------------------------------
{
	var list = document.getElementsByName( "html_reso" ) ;
	for ( let l of list )
	{
		if ( l.checked ) 
		{
			g_numReso = l.value*1;
			break;
		}
	}
}


//-----------------------------------------------------------------------------
function html_getValue_textid( id )	// input type="text" id="xxx" 用
//-----------------------------------------------------------------------------
{
	return document.getElementById( id ).value * 1;
}
//-----------------------------------------------------------------------------
function html_setValue_textid( id, val )	// input type="text" id="xxx" 用
//-----------------------------------------------------------------------------
{
	document.getElementById( id ).value = val;
}


//-----------------------------------------------------------------
function html_setFullscreen()
//-----------------------------------------------------------------
{
	const obj = document.querySelector("#html_canvas"); 

	if( document.fullscreenEnabled )
	{
		obj.requestFullscreen.call(obj);
	}
	else
	{
		alert("フルスクリーンに対応していません");
	}
}
