
//-----------------------------------------------------------------------------
function update()
//-----------------------------------------------------------------------------
{
	g_timer--;
	
	


	if ( g_timer <= 0 )
	{
		document.getElementById("html_set").innerHTML = g_set+1;


		{ // 下限設定
			let val = document.getElementById( "html_interval" ).value*1;
			if ( val < 1 )
			{
				document.getElementById( "html_interval" ).value = 1;
			}
		}

		let timer_case1 = 0.5;

		switch( g_step )
		{
			case 3:	 // タイトル
				{
					g_str0 = "国際松濤館(式)";
					g_str1 = "一本組手";
					g_str2 = "";
					g_str3 = "";
				}
				break;


			case 4:	// 基本・自由タイトル表示インターバル
				{
					g_step = 2;
					g_timer = 60*0.2;
					g_str0 = "";
					g_str1 = "";
					g_str2 = "";
					g_str3 = "";
				}	
				break;

			case 2:	//	基本・自由タイトル表示
				{
					g_step = 1;
					g_timer = 60*2.5;
					g_str0 = "";
					g_str1 = g_tblWaza[g_cntWawa][0];
					g_str2 = "";
					g_str3 = "";
				}
				break;

			case 0:	//	 技表示
				{
					g_step = 1;
					let val = document.getElementById( "html_interval" ).value*1;
					g_timer = 60*val - 60*timer_case1;

					g_str0 = g_tblWaza[g_cntWawa][0];
					g_str1 = g_tblWaza[g_cntWawa][1];
					g_str2 = g_tblWaza[g_cntWawa][2];
					if ( document.getElementsByName( "html_explain" )[0].checked )	g_str3 = g_tblWaza[g_cntWawa][3]; else g_str3="";

					let prev = g_cntWawa;

					g_cntWawa++;
					if ( g_cntWawa >= g_tblWaza.length )
					{
						g_set++;

						set_param( true );	//	シャッフルあり
						g_cntWawa = 0;
					}

					if ( g_tblWaza[g_cntWawa][0] != g_tblWaza[prev][0] )
					{
						g_step = 4;
					}

				}	
				break;

			case 1:	// 技表示インターバル
				{
					g_step = 0;
					g_timer = 60*timer_case1;
					g_str1 = "";
					g_str2 = "";
					g_str3 = "";
				}	
				break;



		}
	}
	


	document.getElementById("html_message0").innerHTML = g_str0;
	document.getElementById("html_message1").innerHTML = g_str1;
	document.getElementById("html_message2").innerHTML = g_str2;
	document.getElementById("html_message3").innerHTML = g_str3;


	if ( g_reqId != null) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される
	g_reqId = requestAnimationFrame( update );
}
let g_reqId = null;
let g_timer = 0;
let g_step = 0;
let g_tblWaza=[];
let g_cntWawa = 0;
let	g_str0 = "";
let	g_str1 = "";
let	g_str2 = "";
let	g_str3 = "";
let	g_set = 0;


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
function shuffle_num( src, num ) // 必ずnum 個だけシャッフルする
//-----------------------------------------------------------------------------
{
	if ( num == 0 ) return src;

	//-----------------------------------------------------------------------------
	function shuffle_n( src, n ) // n 個だけシャッフルする
	//-----------------------------------------------------------------------------
	{
		// ①リストaから無作為にn個抜き出す->list_b
		let list_a=[];
		for ( let i = 0 ; i < src.length ; i++ )
		{
			list_a[i] = { rnd:Math.random(), idx:i, flg:false };
		}
		list_a.sort( function(a,b){return ( a.rnd>b.rnd )?1:-1;} );
		for ( let i = 0 ; i < src.length ; i++ )
		{
			if ( i < n ) list_a[i].flg = true;	// シャッフル対象
		}
		let list_b = [];
		for ( let a of list_a )
		{
			if ( a.flg )
			{
				list_b.push( { rnd:a.rnd, idx:a.idx, flg:a.flg } );
			}
		}
		list_a.sort( function(a,b){return ( a.idx>b.idx )?1:-1;} );

	//console.table(list_a);
	//console.table(list_b);

		// ②混ぜたリストを空いている所に順に戻してゆく
		let s = 0;
		for ( let i = 0 ; i < list_a.length ; i++ )
		{
			if ( list_a[i].flg )
			{
				list_a[i].idx = list_b[s++].idx;
			}
		}

		// ③出力
		let dst = [];
		for ( let a of list_a ) 
		{
			dst.push( src[ a.idx ] );
		}
		return dst;
	}

	// main

	let cnt = 0;
	let dst=[];
	while( cnt != num )
	{
		cnt = 0;
		dst = shuffle_n(src,num);
		for ( let i = 0 ; i < src.length ; i++ )
		{
			if ( src[i] != dst[i] ) cnt++;
		}
	}
	return dst
}
//-----------------------------------------------------------------------------
function set_param( flgShuffle )
//-----------------------------------------------------------------------------
{


	let tblKihon = [];
	if ( document.getElementsByName( "html_kall" )[0].checked )
	{
		if ( document.getElementsByName( "html_knum1" )[0].checked ) tblKihon.push( ["基本一本","上段突き","一番"	,"（右脚↓）左揚げ受け、右逆突き"] );
		if ( document.getElementsByName( "html_knum2" )[0].checked ) tblKihon.push( ["基本一本","上段突き","二番"	,"（右脚＼↓）後屈立ち左縦手刀受け、前屈立ち右手刀打ち"] );
		if ( document.getElementsByName( "html_knum3" )[0].checked ) tblKihon.push( ["基本一本","上段突き","三番"	,"左横移動閉塞立ち、右揚げ受け右前蹴り右肘打ち"] );
		if ( document.getElementsByName( "html_knum4" )[0].checked ) tblKihon.push( ["基本一本","上段突き","四番"	,"（右脚↓）上段十字受け右回し蹴り左裏肘打ち、左周り戻り"] );

		if ( document.getElementsByName( "html_knum1" )[0].checked ) tblKihon.push( ["基本一本","中段突き","一番"	,"（右脚↓）左外受け、右逆突き"] );
		if ( document.getElementsByName( "html_knum2" )[0].checked ) tblKihon.push( ["基本一本","中段突き","二番"	,"（左脚↓）右外受け、右肘打ち"] );
		if ( document.getElementsByName( "html_knum3" )[0].checked ) tblKihon.push( ["基本一本","中段突き","三番"	,"（右脚↓）左内受け左刻み突き右逆突き"] );
		if ( document.getElementsByName( "html_knum4" )[0].checked ) tblKihon.push( ["基本一本","中段突き","四番"	,"（右／右↓）後屈立ち左手刀打ち掴んで左回し蹴り右貫き手"] );

		if ( document.getElementsByName( "html_knum1" )[0].checked ) tblKihon.push( ["基本一本","前蹴り"  ,"一番"	,"（右脚↓）左下段払い、右逆突き"] );
		if ( document.getElementsByName( "html_knum2" )[0].checked ) tblKihon.push( ["基本一本","前蹴り"  ,"二番"	,"（右脚↓）右逆下段払い、左刻み突き、右逆突き"] );
		if ( document.getElementsByName( "html_knum3" )[0].checked ) tblKihon.push( ["基本一本","前蹴り"  ,"三番"	,"（左脚↓）十字受け溜めて両手手刀打ち"] );
		if ( document.getElementsByName( "html_knum4" )[0].checked ) tblKihon.push( ["基本一本","前蹴り"  ,"四番"	,"（左＼右）逆下段払い猫足立右肘打ち"] );

		if ( document.getElementsByName( "html_knum1" )[0].checked ) tblKihon.push( ["基本一本","横蹴込み","一番"	,"（右脚／↓）左外受け、右逆突き"] );
		if ( document.getElementsByName( "html_knum2" )[0].checked ) tblKihon.push( ["基本一本","横蹴込み","二番"	,"（右脚↓）左下段背腕受け、右手背刀打ち"] );

		if ( document.getElementsByName( "html_knum1" )[0].checked ) tblKihon.push( ["基本一本","回し蹴り","一番"	,"（右脚→）左上段背腕受け、右逆突き"] );
		if ( document.getElementsByName( "html_knum2" )[0].checked ) tblKihon.push( ["基本一本","回し蹴り","二番"	,"（左脚＼）両手刀受け、右肘打ち左添え"] );


	}

	let tblJyuu = [];
	if ( document.getElementsByName( "html_jall" )[0].checked )
	{
		if ( document.getElementsByName( "html_jnum1" )[0].checked ) tblJyuu.push( ["自由一本","上段突き","一番"	,"（右脚＼↓）左縦手刀受け、右逆突き"] );
		if ( document.getElementsByName( "html_jnum2" )[0].checked ) tblJyuu.push( ["自由一本","上段突き","二番"	,"左流し受け、右裏突き（右脚／↓）"] );
		if ( document.getElementsByName( "html_jnum3" )[0].checked ) tblJyuu.push( ["自由一本","上段突き","三番"	,"（右脚／↓右上段揚げ受け、右回し蹴り、左逆突き"] );
		if ( document.getElementsByName( "html_jnum4" )[0].checked ) tblJyuu.push( ["自由一本","上段突き","四番"	,"左掌底払い打ち右掌底、左←"] );

		if ( document.getElementsByName( "html_jnum1" )[0].checked ) tblJyuu.push( ["自由一本","中段突き","一番"	,"（右脚／↓）左外受け、右逆突き"] );
		if ( document.getElementsByName( "html_jnum2" )[0].checked ) tblJyuu.push( ["自由一本","中段突き","二番"	,"（左脚↓）左青龍刀受け、右裏拳打ち"] );
		if ( document.getElementsByName( "html_jnum3" )[0].checked ) tblJyuu.push( ["自由一本","中段突き","三番"	,"（左脚←）右縦手刀"] );
		if ( document.getElementsByName( "html_jnum4" )[0].checked ) tblJyuu.push( ["自由一本","中段突き","四番"	,"右前蹴り、左下段払（右右↓）左刻み突き"] );

		if ( document.getElementsByName( "html_jnum1" )[0].checked ) tblJyuu.push( ["自由一本","前蹴り"  ,"一番"	,"（右脚＼↓）左下段払い、右逆突き"] );
		if ( document.getElementsByName( "html_jnum2" )[0].checked ) tblJyuu.push( ["自由一本","前蹴り"  ,"二番"	,"（左脚／↓）右下段払い、右刻み突き"] );
		if ( document.getElementsByName( "html_jnum3" )[0].checked ) tblJyuu.push( ["自由一本","前蹴り"  ,"三番"	,"十字受け、左手刀打ち（右脚←）"] );
		if ( document.getElementsByName( "html_jnum4" )[0].checked ) tblJyuu.push( ["自由一本","前蹴り"  ,"四番"	,"（右脚＼↑）右下段払い右逆突き"] );

		if ( document.getElementsByName( "html_jnum1" )[0].checked ) tblJyuu.push( ["自由一本","横蹴り"  ,"一番"	,"（右脚／↓）左外受け、右逆突き"] );
		if ( document.getElementsByName( "html_jnum2" )[0].checked ) tblJyuu.push( ["自由一本","横蹴り"  ,"二番"	,"（左脚＼↓）左青龍刀合わせ受け、右縦突き"] );
		if ( document.getElementsByName( "html_jnum3" )[0].checked ) tblJyuu.push( ["自由一本","横蹴り"  ,"三番"	,"（左脚↓）左背腕受け、回転右上段裏肘打ち、逆回転戻り"] );

		if ( document.getElementsByName( "html_jnum1" )[0].checked ) tblJyuu.push( ["自由一本","回し蹴り","一番"	,"（右脚＼↓）左背腕受け、右逆突き"] );
		if ( document.getElementsByName( "html_jnum2" )[0].checked ) tblJyuu.push( ["自由一本","回し蹴り","二番"	,"（右脚↑）左逆刻み打ち（左脚→）右手刀打ち"] );
		if ( document.getElementsByName( "html_jnum3" )[0].checked ) tblJyuu.push( ["自由一本","回し蹴り","三番"	,"（左脚↓）膝隠し立ち右上段回し蹴り"] );



		{
			if ( document.getElementsByName( "html_jnum1b" )[0].checked ) tblJyuu.push( ["自由一本","後ろ蹴り","一番"	,"（左脚＼↓）左青龍刀合わせ受け、右回し突き"] );
			if ( document.getElementsByName( "html_jnum2b" )[0].checked ) tblJyuu.push( ["自由一本","後ろ蹴り","二番"	,"（左↑）右すくい受け、右下段突き"] );
			if ( document.getElementsByName( "html_jnum3b" )[0].checked ) tblJyuu.push( ["自由一本","後ろ蹴り","三番"	,"（左脚↓）右払い左後ろ蹴り"] );

			if ( document.getElementsByName( "html_jnum1b" )[0].checked ) tblJyuu.push( ["自由一本","刻み突き","一番"	,"（左脚←）右裏拳突き、左逆突き"] );
			if ( document.getElementsByName( "html_jnum2b" )[0].checked ) tblJyuu.push( ["自由一本","刻み突き","二番"	,"左刻み足払い左流し受け、右裏突き（←右脚）"] );
			if ( document.getElementsByName( "html_jnum3b" )[0].checked ) tblJyuu.push( ["自由一本","刻み突き","三番"	,"前進右裏拳打ち両手突き放し（左＼左脚↓）"] );

			if ( document.getElementsByName( "html_jnum1b" )[0].checked ) tblJyuu.push( ["自由一本","逆突き"  ,"一番"	,"（右脚／↓）左刻み突き、右逆突き"] );
			if ( document.getElementsByName( "html_jnum2b" )[0].checked ) tblJyuu.push( ["自由一本","逆突き"  ,"二番"	,"（左脚＼↑）右下段払い、右回し蹴り、（右脚↑）右手刀打ち、（左回転）"] );
			if ( document.getElementsByName( "html_jnum3b" )[0].checked ) tblJyuu.push( ["自由一本","逆突き"  ,"三番"	,"正面後退左下段払い左裏拳打ち"] );
		}
	}

	if ( flgShuffle )
	{
		let rate = document.getElementById( "html_shuffle" ).value*1;

		tblKihon = shuffle_num( tblKihon, Math.floor(tblKihon.length*rate) );
		tblJyuu = shuffle_num( tblJyuu, Math.floor(tblJyuu.length*rate) );
	}

	g_tblWaza = tblKihon.concat( tblJyuu );

	if ( g_tblWaza.length == 0 )
	{
		g_tblWaza.push( ["データがありません","" ,""] );
	}

}

//-----------------------------------------------------------------------------
function reset()
//-----------------------------------------------------------------------------
{
	g_set = 0;
	g_step = 3;
	g_timer = 0;
	g_tblWaza=[];
	g_str0 = "";
	g_str1 = "";
	g_str2 = "";
	g_str3 = "";
	g_cntWawa = 0;

	set_param( false );	// 初回はシャッフルしない


	if ( g_reqId != null) window.cancelAnimationFrame( g_reqId ); // 止めないと多重で実行される
	g_reqId = requestAnimationFrame( update );


}

	let src=[11,22,33,44,55];
	let dst=shuffle_num(src,3);

		console.log( src );
		console.log( dst );



reset();


//-----------------------------------------------------------------------------
function html_updateReset()
//-----------------------------------------------------------------------------
{
	g_set = 0;

	reset();
}
//-----------------------------------------------------------------------------
function html_updateStart()
//-----------------------------------------------------------------------------
{
	g_step = 4;
}
