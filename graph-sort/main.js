"use strict";
//var g1=html_canvas1.getContext('2d');
var g2=html_canvas2.getContext('2d');
var g3=html_canvas3.getContext('2d');
var g4=html_canvas4.getContext('2d');
var g5=html_canvas5.getContext('2d');
function rad(d){return d/360*Math.PI*2;}
function clamp(v){return (v<0)?0:(v>255)?255:v;}

//-----------------------------------------------------------------------------
function drawtitle( g, top, bottom )
//-----------------------------------------------------------------------------
{
}
//-----------------------------------------------------------------------------
function drawcircle( g, tbl, strtop, strbottom )
//-----------------------------------------------------------------------------
{
//g.clearRect();
g.clearRect(0, 0, g.canvas.width, g.canvas.height);

	let cx = g.canvas.width/2;
	let cy = g.canvas.height/2;
	let cs = g.canvas.width*4/5/2;
	//-----------------------------------------------------------------------------
	function conv( th )
	//-----------------------------------------------------------------------------
	{
		let cr=0;
		let cg=0;
		let cb=0;
		if ( th >= rad(240) && th <= rad(360) ) cr = clamp(255*(th-rad(240))/rad(120));
		if ( th >= rad(0)   && th <= rad(120) ) cr = clamp(255*(rad(120)-th)/rad(120));
		if ( th >= rad(0)   && th <= rad(120) ) cg = clamp(255*(         th)/rad(120));
		if ( th >= rad(120) && th <= rad(240) ) cg = clamp(255*(rad(240)-th)/rad(120));
		if ( th >= rad(120) && th <= rad(240) ) cb = clamp(255*(th-rad(120))/rad(120));
		if ( th >= rad(240) && th <= rad(360) ) cb = clamp(255*(rad(360)-th)/rad(120));
		return  'rgb('+cr+','+cg+','+cb+')';
	}		const st = rad(360)/tbl.length;
	for ( let i = 0 ; i < tbl.length ; i++ )
	{
		let th = i/tbl.length*rad(360); 

		let x1 = cs*Math.cos(th+st/2-rad(90))+cx; 
		let y1 = cs*Math.sin(th+st/2-rad(90))+cy; 
		let x2 = cs*Math.cos(th-st/2-rad(90))+cx; 
		let y2 = cs*Math.sin(th-st/2-rad(90))+cy; 
		g.beginPath();
		g.lineTo(cx,cy);
		g.lineTo(x1,y1);
		g.lineTo(x2,y2);
		g.closePath();

		let  c = conv( tbl[i]/tbl.length*rad(360) );

		g.strokeStyle = c;
		g.fillStyle = c;
		g.fill();
		g.stroke();
	}

	{
		let cy = 0;
		let str = ""+strtop;
		g.font = "24px monospace";
		g.fillStyle = "#000";
		g.textAlign = "center";
		g.textBaseline = "top";
		g.fillText( str, cx, cy+8);
	}
	{
		let cy = g.canvas.height;
		let str = ""+strbottom;
		g.font = "20 monospace";
		g.fillStyle = "#000";
		g.textAlign = "center";
		g.textBaseline = "bottom";
		g.fillText( str, cx, cy-8);
	}

}
//-----------------------------------------------------------------------------
function shuffle( src )	// すべてをシャッフル
//-----------------------------------------------------------------------------
{
	let dst = [];

	while( src.length > 0 )
	{
		let k = Math.floor( Math.random() * src.length );

		dst.push( src[k] );
		src.splice( k, 1 );
	}
	return dst;
}
//-----------------------------------------------------------------------------
function mergesort_full( _tbl )	// マージソート
//-----------------------------------------------------------------------------
{
	let tbl = _tbl.concat();
	let wrk = new Array( tbl.length );
	function mergesort( first , last )
	{
		if ( first < last )	
		{
			let m = Math.floor((first+last)/2);
		console.log(first,last);
			mergesort( first, m );
			mergesort( m+1, last );
			let p = 0;
			let q = 0;
			for ( let f = first ; f <= m ; f++ ) wrk[q++] = tbl[f];
			let l = m +1;
			let f = first;
			while ( l <= last && p < q )
			{
				if ( wrk[p] < tbl[l] ) tbl[f++] = wrk[p++];
				else				   tbl[f++] = tbl[l++];
			}
			while( p < q )			   tbl[f++] = wrk[p++];
		}
		return tbl;
	}
	return mergesort( 0, tbl.length-1 );
}

//再起呼び出しを使うクイックソート
//-----------------------------------------------------------------------------
function qsort1( tbl )
//-----------------------------------------------------------------------------
{
	func( 0,tbl.length-1 );

	function func( first, last )
	{
		let x  = tbl[Math.floor((first+last)/2)];
		let i = first; 
		let j = last;
		while(1)
		{
			while( tbl[i] < x ) i++;
			while( x < tbl[j] ) j--;
			if ( i >= j ) break;
			let t = tbl[i]; 
			tbl[i] = tbl[j]; 
			tbl[j] = t;
			i++; 
			j--;
		}
		if ( first < i-1  ) func( first, i-1 );
		if ( j+1   < last ) func( j+1, last );
	}
}

//スタック式のクイックソート
//-----------------------------------------------------------------------------
function qsort2( tbl )
//-----------------------------------------------------------------------------
{
	let st = [];
	st.push([0,tbl.length-1]);

	while( st.length > 0 )
	{
		let [first,last] = st.pop([0,tbl.length-1]);
		
		let x  = tbl[Math.floor((first+last)/2)];
		let i = first; 
		let j = last;
		while(1)
		{
			while( tbl[i] < x ) i++;
			while( x < tbl[j] ) j--;
			if ( i >= j ) break;
			let t = tbl[i]; 
			tbl[i] = tbl[j]; 
			tbl[j] = t;
			i++; 
			j--;
		}
		if ( first < i-1  ) st.push([first,i-1]);
		if ( j+1   < last ) st.push([j+1,last]);
	}
}

//-----------------------------------------------------------------------------
function bubblesort_create( tbl )
//-----------------------------------------------------------------------------
{
	return {
		i:0,
		j:0,
		a:0,
		b:0,
		mode:'i',
		tbl:tbl.concat(),
		flgUpdate : false,
		cntUpdate : 0,
		stepSort:function()
		{
			this.flgUpdate = false;
			if ( this.mode == 'i' )
			{
				if ( this.i < this.tbl.length )
				{
					this.a = this.tbl[this.i];
					this.mode = 'j';
				}
				else
				{
					return false;
				}
			}
			if ( this.mode == 'j' )
			{
				if ( this.j < this.tbl.length )
				{
					this.b = this.tbl[this.j];
					if ( this.a < this.b )
					{
						this.tbl[this.i] = this.b;
						this.tbl[this.j] = this.a;
						this.a = this.b;
						this.flgUpdate = true;
						this.cntUpdate++;
					}
					this.j++;
				}
				else
				{
					this.j=0;
					this.i++;
					this.mode = 'i';
				}
			}
			return true;
		}
	}
}

//-----------------------------------------------------------------------------
let imapsort_create = function( a )
//-----------------------------------------------------------------------------
{	
	// 整数ソートのみ	値の幅分のバッファを確保する
	// 上書き版

	let n = a.length;
	let MIN = a[0];
	let MAX = a[0];
	for ( let i = 1 ; i < a.length ; i++ )
	{
		MIN = Math.min(MIN,a[i]);
		MAX = Math.max(MAX,a[i]);
	}
	
	let b		= new Array( a.length );
	let next	= new Array( a.length );
	let index	= new Array( MAX - MIN +1 );

	for ( let x = 0 ; x <= MAX- MIN ;x++ ) index[x] = -1;
	for ( let i = n-1 ; i >= 0 ; i-- ) 
	{
		let x = a[i] - MIN;
		next[i] = index[x];
		index[x] = i;
	}
	let j = 0;
	let x = 0;
	let i = n-1;
	let step = 0;
	//-----------------------------------------------------------------------------
	function stepSort()
	//-----------------------------------------------------------------------------
	{
		this.flgUpdate = false;
		if ( step == 0 )
		{
			if ( x <= MAX-MIN ) 
			{
				i = index[x];
				step = 1;
				x++;
			}
			else
			{
				return false;
			}
		}
		if ( step == 1 )
		{
			if ( i >= 0 )
			{
//				b[j++] = a[i];	i = next[i];
				this.tbl[j++] = x+MIN;						// 上書き版
				step = 0;
				this.flgUpdate = true;
				this.cntUpdate++;
			}
		}
		return true;
	}
	
	return {
//		tbl:b,
		tbl:a.concat(),// 上書き版	重複不可
		stepSort:stepSort,
		flgUpdate:false,
		cntUpdate:0,
	}
}


//-----------------------------------------------------------------------------
function quicksort_create( _tbl )
//-----------------------------------------------------------------------------
{
	let tbl = _tbl.concat();
	let f = 0;
	let l = 0;
	let st = [];
	st.push([0,tbl.length-1]);
	let first = 0;
	let last = 0;
	let m = 0 ;
	let flgCont = false;

	function stepSort()
	{
		this.flgUpdate = false;
		if ( flgCont == false && st.length > 0 )
		{
			[first,last] = st.pop([0,tbl.length-1]);
			m  = tbl[Math.floor((first+last)/2)];
			f = first; 
			l = last;
		}
		while( tbl[f] < m ) f++;
		while( m < tbl[l] ) l--;
		if ( f >= l )
		{
			if ( l+1   < last ) st.push( [l+1,last] );
			if ( first < f-1  ) st.push( [first,f-1] );
			flgCont = false;
		}
		else
		{
			let a = tbl[f]; 
			tbl[f] = tbl[l]; 
			tbl[l] = a;
			f++; 
			l--;
			flgCont = true;
			this.flgUpdate = true;
			this.cntUpdate++;
		}
		return (flgCont == true || st.length > 0);
	}
	return {
		tbl:tbl,
		stepSort:stepSort,
		flgUpdate:false,
		cntUpdate:0,
	}
}

//-----------------------------------------------------------------------------
function mergesort_create( _tbl )
//-----------------------------------------------------------------------------
{
	let tbl = _tbl.concat();
	let st = [];
	let wrk = new Array( tbl.length );
	let idx = 0;	
	st.push( [0, tbl.length-1] );
	while( idx < st.length )
	{	
		let [first,last] = st[idx++];
		if ( first < last )	
		{
			let m = Math.floor((first+last)/2);
			st.push( [first, m] );
			st.push( [m+1, last] );
		}
		else
		{
			break;
		}
	}
	let flgCont = false;
	let first = 0;
	let last = 0;
	let m = 0;
	let p = 0;
	let q = 0;
	let l = 0;
	let f = 0;
	function stepSort()
	{
		this.flgUpdate = false;
		if ( flgCont == false && st.length > 0 )
		{
			[first,last] = st.pop();
			m = Math.floor((first+last)/2);
			p = 0;
			q = 0;
			for ( let f = first ; f <= m ; f++ ) wrk[q++] = tbl[f];
			l = m +1;
			f = first;
		}
		if ( p < q )
		{
			if ( l <= last )
			{
				if ( wrk[p] < tbl[l] ) 
				{
					tbl[f++] = wrk[p++];
				}
				else
				{
				   tbl[f++] = tbl[l++];
				}
			}
			else
			{
					tbl[f++] = wrk[p++];
			}
			this.flgUpdate = true;
			this.cntUpdate++;
		}
		if ( p < q ) flgCont = true; else flgCont = false;
		return (flgCont == true || st.length > 0);
	}
	return {
		tbl:tbl,
		stepSort:stepSort,
		flgUpdate:false,
		cntUpdate:0,
	}
}

let	bubblesort;
let	imapsort;
let	quicksort;
let	mergesort;
//-----------------------------------------------------------------------------
function setup()
//-----------------------------------------------------------------------------
{
	let num = document.getElementById( "html_num" ).value*1;

	let tbl1 =[];
	for ( let i = 0 ; i < num ; i++ ) tbl1.push(i);
	tbl1 = shuffle( tbl1 );
	bubblesort = bubblesort_create( tbl1 );
	imapsort = imapsort_create( tbl1 );
	quicksort = quicksort_create( tbl1 );
	mergesort = mergesort_create( tbl1 );
}
//setup();

//-----------------------------------------------------------------------------
window.onload = function( e )
//-----------------------------------------------------------------------------
{
	setup();
	draw();

}
//-----------------------------------------------------------------------------
function draw()
//-----------------------------------------------------------------------------
{
	drawcircle( g2, imapsort.tbl,"inverse mapping sort",""+imapsort.cntUpdate );
	drawcircle( g3, quicksort.tbl, "quick sort" ,""+quicksort.cntUpdate);
	drawcircle( g4, mergesort.tbl, "merge sort",""+mergesort.cntUpdate );
	drawcircle( g5, bubblesort.tbl,"bubble sort",""+bubblesort.cntUpdate);
}
let g_flgUpdate = false;
//-----------------------------------------------------------------------------
function drawscene()
//-----------------------------------------------------------------------------
{ 
	while( bubblesort.stepSort() ) if ( bubblesort.flgUpdate ) break;
	while( imapsort.stepSort() ) if ( imapsort.flgUpdate ) break;
	while( quicksort.stepSort() ) if ( quicksort.flgUpdate ) break;
	while( mergesort.stepSort() ) if ( mergesort.flgUpdate ) break;
	draw();

	if( g_flgUpdate ) window.requestAnimationFrame( drawscene );
}

//-----------------------------------------------------------------------------
function html_sort()
//-----------------------------------------------------------------------------
{
	g_flgUpdate = true;
	drawscene();
}

//-----------------------------------------------------------------------------
function html_shuffle()
//-----------------------------------------------------------------------------
{
	g_flgUpdate = false;
	setup();
	draw();
}