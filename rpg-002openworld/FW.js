'use strict';

//var FW = FW || {};
//let FW = {};
//let FW = function(){};
//let FW = new function() {};
//let FW = new Object();
//let FW = Object();
//class FW{};
//function FW(){};
//let FW = [];
//let FW = new class{};
//let FW = class{};
//let FW = new class
let FW = new class
{
	constructor()
	{
		this.val = 1;
		this.a = 0;
	}
};

FW.private = function() {}

FW.private.cntFrame = 0;
FW.private.valFps	= 60;
FW.private.canvas;
FW.private.mWidth;
FW.private.mHeight;



// 外部に出せる
FW.rWidth;
FW.rHeight;
FW.onTick = function() {}	// 外部定義
FW.onPaint = function() {}	// 外部定義
//-----------------------------------------------------------------------------
FW.private.resize = function()
//-----------------------------------------------------------------------------
{
//	const html_canvas = document.getElementById("html_canvas");
	html_canvas.width = window.innerWidth;
	html_canvas.height = window.innerHeight;

	{
		const c = html_canvas.getContext("2d");
		c.imageSmoothingEnabled = c.msImageSmoothingEnabled = 0; // スムージングOFF
	}

	
	// アスペクト比に倣った拡大設定。
	FW.private.mWidth = html_canvas.width;
	FW.private.mHeight = html_canvas.height;

	if ( FW.private.mWidth / FW.rWidth < FW.private.mHeight / FW.rHeight )
	{
		FW.private.mHeight = FW.private.mWidth * FW.rHeight / FW.rWidth;
	} 
	else 
	{
		FW.private.mWidth = FW.private.mHeight * FW.rWidth / FW.rHeight;
	}

}

//-----------------------------------------------------------------------------
FW.private.onTimer = function()
//-----------------------------------------------------------------------------
{
	if( !FW.mCurrentStart )
	{
		FW.mCurrentStart = performance.now();
	}
	
	let d = Math.floor( ( performance.now() - FW.mCurrentStart ) * FW.private.valFps/ 1000 ) - FW.private.cntFrame;

//	console.log(d);	
	if ( d > 0 )
	{
		FW.private.cntFrame+= d;

		while ( d-- )
		{
			FW.onTick();
		}

		// レンダーバッファをキャンバスに引き延ばして表示
		{
		//	const html_canvas = document.getElementById("html_canvas");
			const c = html_canvas.getContext("2d");
			c.drawImage( FW.private.canvas, 0, 0, FW.rWidth, FW.rHeight, 0,0, FW.private.mWidth, FW.private.mHeight );
		}

		{
			const g = FW.private.canvas.getContext("2d");
			FW.onPaint( g );
		}
	}

	requestAnimationFrame( FW.private.onTimer );
}


//-----------------------------------------------------------------------------
FW.init = function( w, h )
//-----------------------------------------------------------------------------
{

	FW.rWidth = w;
	FW.rHeight = h;

	FW.private.resize();

	window.addEventListener( "resize", function(){ FW.private.resize() } ); 
	FW.private.canvas=document.createElement("canvas");// 新たに<canvas>タグを生成

	FW.private.canvas.width = window.innerWidth;
	FW.private.canvas.height = window.innerHeight;

	requestAnimationFrame( FW.private.onTimer );
}
