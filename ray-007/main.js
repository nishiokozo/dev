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
	constructor( _p, _n, _c, _valReflection, _valRefractive, _valPower, _valEmissive, _valTransmittance )
	{
		this.P					= _p;
		this.N					= _n;
		this.C					= _c;
		this.valReflectance		= _valReflection;
		this.valRefractive		= _valRefractive;
		this.valPower			= _valPower;
		this.valEmissive		= _valEmissive;
		this.valTransmittance	= _valTransmittance;
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
		this.R	= new vec3(0,0,0);	//	Reflectionion

		this.valReflectance		= 0.0;
		this.valRefractive		= 0.0;
		this.valPower			= 0.0;
		this.valEmissive		= 0.0;
		this.valTransmittance	= 0.0;

	}
};

class Sphere
{
	constructor( _P, _r, _C, _valReflection, _valRefractive, _valPower, _valEmissive, _valTransmittance )
	{
		this.P					= _P;
		this.r					= _r;
		this.C					= vmax( new vec3(0,0,0), vmin( new vec3(1,1,1),_C));
		this.valReflectance		= _valReflection;
		this.valRefractive		= _valRefractive;
		this.valPower			= _valPower;
		this.valEmissive		= _valEmissive;
		this.valTransmittance	= _valTransmittance;
	};
};


let test = {};

//------------------------------------------------------------------------------
function vnormalize( v )
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
function vreflect( I, N )
//------------------------------------------------------------------------------
{
	let a = 2*dot(I,N);
 	return vsub( I , vmul( new vec3(a,a,a), N ) );
}
//------------------------------------------------------------------------------
function vrefract( I, N, nm )
//------------------------------------------------------------------------------
{
	let	n1 = 1.0;
	let	n2 = nm;
	let	d = dot(-I,N);

	return (n1/n2)*( vmul( vsub(I,N) ,( Math.sqrt((n2/n1)*(n2/n1)-1+d*d)-d) ) );
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

			if ( t < 0 )
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
					sur.N = vsub( new vec3(0,0,0), vnormalize( vsub( sur.Q , O ) ) );
				}
				else
				{
					sur.N = vnormalize( vsub( sur.Q , O ) );
				}

				sur.C					= obj.C;

				sur.R					= vreflect( I, sur.N );

				sur.valReflectance		= obj.valReflectance;

				sur.valRefractive		= obj.valRefractive;

				sur.valPower			= obj.valPower;

				sur.valEmissive			= obj.valEmissive;

				sur.valTransmittance	= obj.valTransmittance;

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

//				if (   ( (sur.Q.x+10e3 % 1.0) < 0.5 && (sur.Q.z+10e3 % 1.0) < 0.5 )
//					|| ( (sur.Q.x+10e3 % 1.0) > 0.5 && (sur.Q.z+10e3 %  1.0) > 0.5 ) 
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
	
				sur.R = vreflect( I, obj.N );
	
				sur.valReflectance = obj.valReflectance;

				sur.valRefractive   = obj.valRefractive;

				sur.valPower = obj.valPower;

				sur.valEmissive = obj.valEmissive;

				sur.valTransmittance = obj.valTransmittance;


				sur.flg = true;
			}
			
		}

	}

	return sur;
}

//------------------------------------------------------------------------------
function Raytrace( P, I )
//------------------------------------------------------------------------------
{
	let ret = new vec3(0,0,0);

	if ( g_cntRay > 5 ) return ret;
	g_cntRay++;
	
	let sur = Raycast( P, I );
	if ( sur.flg )
	{
		for ( let lgt of g_tblLight )
		{
			let mL	= vnormalize( vsub( lgt.P, sur.Q ) );	// -L
			let l = dot( vsub( sur.Q , lgt.P) , vsub( sur.Q , lgt.P) ) ;
			let Lc	= vdiv( lgt.C , new vec3(l,l,l) );
			let r	= sur.valReflectance;
			let d	= 0;
			let s	= 0;

			{// 遮蔽物判定＆スペキュラ計算
				let sur3 = Raycast( sur.Q, sur.R );
				if ( !sur3.flg )
				{
					s	= (sur.valPower+2)/(8*Math.PI) * Math.pow( Math.max( 0.0, dot( sur.R, mL ) ), sur.valPower );
				}
			}

			ret	 =	vadd( ret , vmul( new vec3(r,r,r) , vmul( vadd( Raytrace( sur.Q, sur.R ), new vec3(s,s,s) ) , Lc ) ) );

			{// 遮蔽物判定＆デフューズ計算
				let sur2 = Raycast( sur.Q, mL );
				if ( !sur2.flg )
				{
					d	= Math.max( 0.0, dot( sur.N, mL ) );
				}
			}
				
			if ( sur.valTransmittance == 0.0 )
			{
				ret = vadd( ret, vmul( vmul( new vec3(1-r,1-r,1-r) , ( vmul( new vec3(d,d,d) , sur.C ) ) ) , Lc) );
			}
			else
			{
				I = vrefract( I, sur.N, sur.valRefractive/1.0 );
				sur = Raycast( sur.Q, I );

				I = vrefract( I, sur.N, 1.0/sur.valRefractive );
				ret = vadd( ret, vmul( new vec3(1-r,1-r,1-r) , Raytrace( sur.Q, I ) ) );
			}
		}
	}
	else
	{
		// アンビエント
	}


	return ret;
}


let g_tblLight = [];
let g_tblSphere = [];
let g_tblPlate = [];

//------------------------------------------------------------------------------
function initScene( n )
//------------------------------------------------------------------------------
{
	g_tblLight = [];
	g_tblSphere = [];
	g_tblPlate = [];

	let P,C,N,rl,rr,pw,e,tm,r,l;

	switch(n)
	{
	case "smile":
		{
		//	X,Y,Z,CR,CG,CB,R,RF,KF,OW,KV
		// _P, _r, _C, _valReflection, _valRefractive, _valPower, _valEmissive, _valTransmittance )
			g_tblPlate.push( new Plate( P=new vec3( 0  ,  0 ,0.0),N=new vec3(0,1,0),C=new vec3(0.8,0.8,0.8),rl=0.5,rr=1.0 ,pw=20,e= 0.0,tm=0.0 ) );

			let sphere =
			[
				{x: 0.0	,y:0.5	,z:-0.58	,cr:0.0 ,cg:0.1 ,cb:1.0 ,r:0.5	,rf:0.5 ,kf:0.0 ,pw:16 ,kv:1.4},
				{x:-0.5	,y:0.5	,z: 0.29	,cr:0.0 ,cg:1.0 ,cb:0.1 ,r:0.5	,rf:0.5 ,kf:0.0 ,pw:16 ,kv:1.4},
				{x: 0.5	,y:0.5	,z: 0.29	,cr:1.0 ,cg:0.1 ,cb:0.1 ,r:0.5	,rf:0.5 ,kf:0.0 ,pw:16 ,kv:1.4},
				{x: 0.0	,y:1.32	,z: 0.0		,cr:1.0 ,cg:1.0 ,cb:1.0 ,r:0.5	,rf:0.8 ,kf:0.0 ,pw:16 ,kv:1.4},
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
			g_tblPlate.push( new Plate( P=new vec3( 0  ,  0 ,0.0),N=new vec3(0,1,0),C=new vec3(0.8,0.8,0.8),rl=0.5,rr=1.0 ,pw=20,e= 0.0,tm=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 0.0 , 1.25, -2       ),   0.5 , new vec3(1  , 0.2, 0.2), 0.5, 1.0, 20, 0.0, 0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 0.0 , 0.5 , -2-0.433 ),   0.5 , new vec3(0.0, 0.0, 0.0), 1.0, 1.0, 20, 0.0, 0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 0.5 , 0.5 , -2+0.433 ),   0.5 , new vec3(0.2, 0.2, 1.0), 0.5, 1.0, 20, 0.0, 0.0 ) );
			g_tblSphere.push( new Sphere(new vec3(-0.5 , 0.5 , -2+0.433 ),   0.5 , new vec3(0.0, 1.0, 0.0), 0.5, 1.0, 20, 0.0, 0.0 ) );
			l=40;g_tblLight.push( new Light( new vec3( 4   ,  2 , -1 ), new vec3(0.6*l, 0.8*l, 1.0*l) ) );
			l=10;g_tblLight.push( new Light( new vec3( -1  ,  2 ,  -3 ), new vec3(1.0*l, 0.8*l, 0.6*l) ) );
		}
		break;

	case "3metals":
		{
			g_tblPlate.push( new Plate( P=new vec3( 0  ,  0 ,0.0),N=new vec3(0,1,0),C=new vec3(0.8,0.8,0.8),rl=0.5,rr=1.0 ,pw=20,e= 0.0,tm=0.0 ) );
			g_tblSphere.push( new Sphere(new vec3(-2.0 , 0.5 , -2 ),   0.5 , new vec3(0.0, 0.0, 0.0), 1.0 , 1.0, 20, 0.0, 0.0 ) );
			g_tblSphere.push( new Sphere(new vec3(-1.0 , 0.5 , -2 ),   0.5 , new vec3(0.0, 0.0, 0.0), 0.75, 1.0, 20, 0.0, 0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 0.0 , 0.5 , -2 ),   0.5 , new vec3(0.0, 0.0, 0.0), 0.5 , 1.0, 20, 0.0, 0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 1.0 , 0.5 , -2 ),   0.5 , new vec3(0.0, 0.0, 0.0), 0.25, 1.0, 20, 0.0, 0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 2.0 , 0.5 , -2 ),   0.5 , new vec3(0.0, 0.0, 0.0), 0.0 , 1.0, 20, 0.0, 0.0 ) );
			g_tblLight.push( new Light( new vec3( 0   ,  20 ,  -2 ), new vec3(800,800,800) ) );
		}
		break;

	case "rasen":
		{ 
			g_tblPlate.push( new Plate( P=new vec3( 0  ,  0 ,0.0),N=new vec3(0,1,0),C=new vec3(0.8,0.8,0.8),rl=0.5,rr=1.0 ,pw=20,e= 0.0,tm=0.0 ) );
			g_tblSphere.push( new Sphere(  new vec3( 0 , 1.0 , 0 ),   0.5 ,  new vec3(0.0, 0.0, 0.0),   0.5,   1.0 ,  100,  0.0,  0.0 ) );
			let	max = 16*3*2;
			for ( let i = 0 ; i < max ; i++ )
			{
				let	th  = i *(Math.PI/360)*16/2 * 3;
				let	th2 = i *(Math.PI/360)*16/2 * 0.5;
				let	x = Math.cos(th)*2;
				let	z = Math.sin(th)*2 ;
				let	y = Math.cos(th2) +1.2;
				g_tblSphere.push( new Sphere(P=new vec3( x , y , z ),r=0.2 ,C=new vec3( x, y,  z) ,rl=0.2,rr=0.0 ,pw=100,e= 0.0,tm=0.0 ) );
			}


			if (0)
			{
				g_tblLight.push( new Light( new vec3( 0   ,  30 ,  0 ), new vec3(1800,1800,1800) ) );
				g_tblLight.push( new Light( new vec3(-30   ,  30 ,  0 ), new vec3( 900,1800,1800) )  );
				g_tblLight.push( new Light( new vec3(60   ,  80 ,  0 ), new vec3(4800,4800,2400) )  );
				g_tblLight.push( new Light( new vec3(-60   ,  80 , 0 ), new vec3(4800,2400,4800) )  );
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
			g_tblPlate.push( new Plate( new vec3( 0   ,  0 ,  0    ), vnormalize(new vec3(0, 1,0))  , new vec3(0.8, 0.8, 0.8), 0.5, 1.0, 20, 0.0, 0.0 ) );
			g_tblSphere.push( new Sphere(new vec3(-1.0 , 1.0 , -2 ),   1.0 , new vec3(1.0, 0.5, 0.5), 0.2, 1.0, 20, 0.0, 0.0 ) );
			g_tblSphere.push( new Sphere(new vec3( 1.0 , 1.0 , -2 ),   1.0 , new vec3(0.0, 0.0, 0.0), 0.2, 1.0, 20, 0.0, 0.0 ) );
			g_tblLight.push( new Light( new vec3( 0   ,  20 ,  -2 ), new vec3(800, 800, 800) ) );
		}
		break;

	case "colorballs":
		{
			g_tblPlate.push( new Plate( P=new vec3(0  , 0 ,0.0),N=new vec3(0,1,0),C=new vec3(0.8,0.8,0.8),rl=0.5,rr=1.0 ,pw=20,e= 0.0,tm=0.0 ) );
			g_tblSphere.push( new Sphere(P=new vec3( 0.5,1.0,3.0)	,r=0.5  ,C=new vec3(0.0,0.0,1.0),rl=0.5,rr=1.0 ,pw=20,e=10.0,tm=0.0 ) );
			g_tblSphere.push( new Sphere(P=new vec3(-0.5,1.0,3.0)	,r=0.5  ,C=new vec3(0.0,1.0,0.0),rl=0.5,rr=1.0 ,pw=20,e=10.0,tm=0.0 ) );
			g_tblSphere.push( new Sphere(P=new vec3( 0.0,1.5,3.0)	,r=0.5  ,C=new vec3(1.0,0.0,0.0),rl=0.5,rr=1.0 ,pw=20,e=10.0,tm=0.0 ) );
			g_tblSphere.push( new Sphere(P=new vec3( 0.0,0.5,3.0)	,r=0.5  ,C=new vec3(1.0,1.0,0.0),rl=0.5,rr=1.0 ,pw=20,e=10.0,tm=0.0 ) );
			g_tblSphere.push( new Sphere(P=new vec3( 0.0,1.0,2.75)	,r=0.25 ,C=new vec3(1.0,1.0,1.0),rl=0.5,rr=1.0 ,pw=20,e=10.0,tm=0.0 ) );
			g_tblLight.push( new Light( P=new vec3( 1.0 ,15, 0 ) ,C=new vec3(360,360,360) )  );
		}
		break;
	}
}

const	SIZwidth =  html_canvas.width;		// レンダリングバッファの解像度
const	SIZheight =  html_canvas.height;	// レンダリングバッファの解像度
let g_cntRay = 0;

//------------------------------------------------------------------------------
function paint( gra, rot )
//------------------------------------------------------------------------------
{
	let	posScr = new vec3(0,1.0,-12+8);
	let	posEye = new vec3(0,1.0,-17+8);


	function rotY( v, th )
	{
		let s = Math.sin(th);
		let c = Math.cos(th);

		let nx = v.x*c- v.z*s;
		let nz = v.x*s+ v.z*c;

		return new vec3( nx, v.y, nz );
	}

	let aspect = html_canvas.width/html_canvas.height;
	for( let py = 0 ; py < gra.img.height ; py++ )
	{
		for( let px = 0 ; px < gra.img.width ; px++ )
		{
			g_cntRay = 0;

			let x = (px / gra.img.width)*aspect *2.0-1.0*aspect;
			let y = (py / gra.img.height) *2.0-1.0;
			let	P = vadd( new vec3( x, y, 0 ), posScr );
			let I = vnormalize( vsub( P , posEye ));

			P = rotY( P, rot );
			I = rotY( I, rot );

	 		let C = Raytrace( P, I );
			gra.pset( px, gra.img.height-py, C );
		}
	}
}

let g_step = 0;
let g_totaltime = 0;
let g_canvas = 
[
	html_canvas,
	html_canvas2,
	html_canvas3,
	html_canvas4,
]
//------------------------------------------------------------------------------
function update_paint()
//------------------------------------------------------------------------------
{
	{
		let gra = new GRA( SIZwidth, SIZheight, g_canvas[ g_step ] );
		gra.cls( new vec3(0,0,0) );
		gra.streach();
		const st = performance.now();
		paint( gra, (g_step*20)*Math.PI/18 );
		const en = performance.now();
		gra.streach();
		
		g_totaltime += en-st;
		document.getElementById("message").innerHTML = ""+((g_totaltime)/1000).toFixed(2)+"秒";
	}

	g_step++;

	if ( g_step < g_canvas.length ) requestAnimationFrame( update_paint );
}

//------------------------------------------------------------------------------
function update_start()
//------------------------------------------------------------------------------
{
	// レンダリング画面以外の更新を促すために１フレーム開ける。
	requestAnimationFrame( update_paint );
};
//------------------------------------------------------------------------------
window.onload = function( e )
//------------------------------------------------------------------------------
{
	initScene( "3metals");
	initScene( "twinballs");
	initScene( "colorballs");
	initScene( "rasen");
	initScene( "smile");
	initScene( "4balls");

	document.getElementById("message2").innerHTML = navigator.userAgent;

	// レンダリング開始
	requestAnimationFrame( update_start );


}
