"use strict";

//-----------------------------------------------------------------------------
function gra_create( cv )	//2021/06/01 window関数実装
//-----------------------------------------------------------------------------
{
	let gra={}
	gra.ctx=cv.getContext('2d');
	gra.x = 0;
	gra.y = 0;

	let sx = 0; 
	let sy = 0; 
	let ex = gra.ctx.canvas.width; 
	let ey = gra.ctx.canvas.height; 
	let ox = 0;
	let oy = 0;
	//-------------------------------------------------------------------------
	gra.window = function( _sx, _sy, _ex, _ey )
	//-------------------------------------------------------------------------
	{
		sx = _sx;
		sy = _sy;
		ex = _ex;
		ey = _ey;
		ox = -_sx;
		oy = -_sy;
	}

	function cvabs( x, y )
	{
		let w = ex-sx;
		let h = ey-sy;
		x = (x+ox)/w * gra.ctx.canvas.width;
		y = (y+oy)/h * gra.ctx.canvas.height;
		return [x,y];
	}
	function cvrange( x, y )
	{
		let w = Math.abs(ex-sx);
		let h = Math.abs(ey-sy);
		x = (x)/w * gra.ctx.canvas.width;
		y = (y)/h * gra.ctx.canvas.height;
		return [x,y];
	}
	//-------------------------------------------------------------------------
	gra.line = function( x1, y1, x2, y2, mode="" )
	//-------------------------------------------------------------------------
	{
		function func( sx,sy, ex,ey, style =[1] )
		{
			gra.ctx.beginPath();
			gra.ctx.setLineDash(style);
			gra.ctx.strokeStyle = "#000000";
			gra.ctx.lineWidth = 1.0;
			gra.ctx.moveTo( sx, sy );
			gra.ctx.lineTo( ex, ey );
			gra.ctx.closePath();
			gra.ctx.stroke();
		}

		[x1,y1]=cvabs(x1,y1);
		[x2,y2]=cvabs(x2,y2);

		let style = [];
		switch( mode )
		{
			case "hasen": style = [2,4];
		}
	
		func( x1, y1, x2, y2, style );
	}
	//-------------------------------------------------------------------------
	gra.print = function( str, x1, y1 )
	//-------------------------------------------------------------------------
	{
		function func( str, tx=gra.x, ty=gra.y )
		{
			gra.ctx.font = "12px monospace";
			gra.ctx.fillStyle = "#000000";
			gra.ctx.fillText( str, tx+2, ty );

			gra.x = tx;
			gra.y = ty+12;
		}

		[x1,y1]=cvabs(x1,y1);
		func( str, x1+2, y1-4 );
	}
	//-----------------------------------------------------------------------------
	gra.circle = function( x1,y1,r )
	//-----------------------------------------------------------------------------
	{
		let func = function( x,y,rw,rh )
		{
			gra.ctx.beginPath();
			gra.ctx.setLineDash([]);
			let rotation = 0;
			let startAngle = 0;
			let endAngle = Math.PI*2;
			gra.ctx.ellipse( x, y, rw, rh, rotation, startAngle, endAngle );
			gra.ctx.closePath();
			gra.ctx.stroke();
		};
		[x1,y1]=cvabs(x1,y1);
		let [rw,rh] = cvrange(r,r);
		func( x1, y1,rw,rh );
	}

	//-----------------------------------------------------------------------------
	gra.cls = function()
	//-----------------------------------------------------------------------------
	{
		gra.ctx.fillStyle = "#ffffff";
		gra.ctx.fillRect( 0, 0, gra.ctx.canvas.width, gra.ctx.canvas.height );
		gra.x=0;
		gra.y=0;
	}
	return gra;
};

let gra = gra_create( html_canvas );


let first = 1;
//-----------------------------------------------------------------------------
function main()
//-----------------------------------------------------------------------------
{
	let prev = 0;
	//-------------------------------------------------------------------------
	function update( time )
	//-------------------------------------------------------------------------
	{
		if (0)
		{
				// 描画同期
			let ft = (time-prev)/1000;
			frame_update( ft );
			prev = time;
			requestAnimationFrame( update );
		}
		else
		{
				// タイマー指定
			let ft = 1000/10;
			frame_update( ft );
			setTimeout( update, ft );
		}
	}

	
	let deg = 50;

	//-------------------------------------------------------------------------
	function frame_update( ft )
	//-------------------------------------------------------------------------
	{
		// ベクトル値計算
		deg += 1;
		if ( deg > 360 ) deg-=360;

		let ax = 3;
		let ay = 1;
		let len = Math.sqrt(ax*ax+ay*ay);
		let bx = len*Math.cos(deg/180*Math.PI);
		let by = len*Math.sin(deg/180*Math.PI);
		let cx = ax*bx - ay*by;
		let cy = ax*by + ay*bx;
		let dx = cx/len;
		let dy = cy/len;

		// draw

		gra.cls();

		let sz_y = 5;
		let sz_x = Math.floor(html_canvas.width/html_canvas.height*sz_y);
		gra.window( -sz_x, sz_y, sz_x, -sz_y );

		// 罫線
		gra.line(-sz_x,0,sz_x,0);
		gra.line(0,-sz_y,0,sz_y);
		{
			let w = 0.15;
			for ( let x = -sz_x ; x <= sz_x ; x++ ) gra.line(x,w,x,-w);
			for ( let y = -sz_y ; y <= sz_y ; y++ ) gra.line(w,y,-w,y);
		}	

		// ベクトル
		function drawvec( x,y,str )
		{
			gra.line( 0,0,x,y);
			gra.line( x,0,x,y, "hasen");
			gra.line( 0,y,x,y, "hasen");

			gra.circle( x,y, 0.05 );
			
			// 小数点以下二桁
			x = Math.round(x*100)/100;
			y = Math.round(y*100)/100;
			gra.print( str+"("+x+","+y+")", x,y);
		}
		drawvec( ax, ay,"A");
		drawvec( bx, by,"B");
//		drawvec( cx, cy,"C");
		drawvec( dx, dy,"D");

		gra.window( 0,0,html_canvas.width,html_canvas.height );
		gra.print( "角度:"+Math.round(deg), 2,12 );
	}
	update(0);
}

main();
