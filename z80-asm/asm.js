"use strict";


	var	Symbol	=	"([_A-Za-z0-9]+)";		
	var	r		=	"([A|B|C|D|E|H|L])";						//A B C D E F H L
	var	n		=	"([0-9A-Za-z]+)";	//Numeric
	var	b		=	n;
	var	d		=	"([\\+|\\-][0-9A-Za-z]+)";	//Numeric
	var	nn		=	Symbol;
	var	e		=	n						//Numeric
	var	dd		=	"(BC|DE|HL|SP)";		//
	var	qq		=	"(BC|DE|HL|AF)";		//
	var	ss		=	"(BC|DE|HL|SP)";		//
	var	pp		=	"(BC|DE|IX|SP)";		//
	var	rr		=	"(BC|DE|IY|SP)";		//
	var	cc		=	"(NZ|Z|NC|C|PO|PE|P|M)";		//
	var	p		=	"(00H|08H|10H|18H|20H|28H|30H|38H)";		//
	var	_n_		=	"\\("+n+"\\)";	//(n)
	var	_nn_	=	"\\("+nn+"\\)";			//(nn)
	let _hl_	=	"(\\(HL\\))";

	var	tblOpc=
	[
		 [new RegExp(	"^ASDFGHJKERTYUIO"+"$"),0]

		,[new RegExp(	"^RET"													+"$"),186]	//	RET
		,[new RegExp(	"^RETI"													+"$"),188]	//	RETI
		,[new RegExp(	"^RETN"													+"$"),189]	//	RETN
		,[new RegExp(	"^RLD"													+"$"),159]	//	RLD
		,[new RegExp(	"^RRD"													+"$"),160]	//	RRD
		,[new RegExp(	"^RLCA"													+"$"),127]	//	RLCA
		,[new RegExp(	"^RLA"													+"$"),128]	//	RLA
		,[new RegExp(	"^RRCA"													+"$"),129]	//	RRCA
		,[new RegExp(	"^RRA"													+"$"),130]	//	RRA
		,[new RegExp(	"^INI"													+"$"),193]	//	INI
		,[new RegExp(	"^INIR"													+"$"),194]	//	INIR
		,[new RegExp(	"^IND"													+"$"),195]	//	IND
		,[new RegExp(	"^INDR"													+"$"),196]	//	INDR
		,[new RegExp(	"^OUTI"													+"$"),199]	//	OUTI
		,[new RegExp(	"^OTIR"													+"$"),200]	//	OTIR
		,[new RegExp(	"^OUTD"													+"$"),201]	//	OUTD
		,[new RegExp(	"^OTDR"													+"$"),202]	//	OTDR
		,[new RegExp(	"^DAA"													+"$"),104]	//	DAA
		,[new RegExp(	"^CPL"													+"$"),105]	//	CPL
		,[new RegExp(	"^NEG"													+"$"),106]	//	NEG
		,[new RegExp(	"^CCF"													+"$"),107]	//	CCF
		,[new RegExp(	"^SCF"													+"$"),108]	//	SCF
		,[new RegExp(	"^NOP"													+"$"),109]	//	NOP
		,[new RegExp(	"^HALT"													+"$"),110]	//	HALT
		,[new RegExp(	"^DI"													+"$"),111]	//	DI
		,[new RegExp(	"^EI"													+"$"),112]	//	EI
		,[new RegExp(	"^IM 0"													+"$"),113]	//	IM 0
		,[new RegExp(	"^IM 1"													+"$"),114]	//	IM 1
		,[new RegExp(	"^IM 2"													+"$"),115]	//	IM 2
		,[new RegExp(	"^LDI"													+"$"),48]	//	LDI
		,[new RegExp(	"^LDIR"													+"$"),49]	//	LDIR
		,[new RegExp(	"^LDD"													+"$"),50]	//	LDD
		,[new RegExp(	"^LDDR"													+"$"),51]	//	LDDR
		,[new RegExp(	"^CPI"													+"$"),52]	//	CPI
		,[new RegExp(	"^CPIR"													+"$"),53]	//	CPIR
		,[new RegExp(	"^CPD"													+"$"),54]	//	CPD
		,[new RegExp(	"^CPDR"													+"$"),55]	//	CPDR
		,[new RegExp(	"^PUSH "	+"IX"										+"$"),37]	//	PUSH IX
		,[new RegExp(	"^PUSH "	+"IY"										+"$"),38]	//	PUSH IY
		,[new RegExp(	"^POP "		+"IX"										+"$"),40]	//	POP IX
		,[new RegExp(	"^POP "		+"IY"										+"$"),41]	//	POP IY
		,[new RegExp(	"^EX "		+"DE"				+","+"HL"				+"$"),42]	//	EX DE,HL
		,[new RegExp(	"^EX "		+"AF"				+","+"AF'"				+"$"),43]	//	EX AF,AF'
		,[new RegExp(	"^EXX"													+"$"),44]	//	EXX
		,[new RegExp(	"^EX "		+"\\(SP\\)"			+","+"HL"				+"$"),45]	//	EX (SP),HL
		,[new RegExp(	"^EX "		+"\\(SP\\)"			+","+"IX"				+"$"),46]	//	EX (SP),IX
		,[new RegExp(	"^EX "		+"\\(SP\\)"			+","+"IY"				+"$"),47]	//	EX (SP),IY
		,[new RegExp(	"^LD "		+"SP"				+","+"IX"				+"$"),34]	//	LD SP,IX
		,[new RegExp(	"^LD "		+"SP"				+","+"IY"				+"$"),35]	//	LD SP,IY
		,[new RegExp(	"^LD "		+"SP"				+","+"HL"				+"$"),33]	//	LD SP,HL
		,[new RegExp(	"^LD "		+"A"				+","+"I"				+"$"),18]	//	LD A,I
		,[new RegExp(	"^LD "		+"A"				+","+"R"				+"$"),19]	//	LD A,R
		,[new RegExp(	"^LD "		+"I"				+","+"A"				+"$"),20]	//	LD I,A
		,[new RegExp(	"^LD "		+"R"				+","+"A"				+"$"),21]	//	LD R,A
		,[new RegExp(	"^LD "		+r					+","+r					+"$"),1]	//		LD r,`r
		,[new RegExp(	"^LD "		+r					+","+n					+"$"),2]	//		LD r,n
		,[new RegExp(	"^LD "		+r					+","+_hl_				+"$"),3]	//		LD r,(HL)
		,[new RegExp(	"^LD "		+r					+","+"\\(IX"+d+"\\)"	+"$"),4]	//		LD r,(IX+d)
		,[new RegExp(	"^LD "		+r					+","+"\\(IY"+d+"\\)"	+"$"),5]	//		LD r,(IY+d)
		,[new RegExp(	"^LD "		+_hl_				+","+r					+"$"),6]	//		LD (HL),r
		,[new RegExp(	"^LD "		+"\\(IX"+d+"\\)"	+","+r					+"$"),7]	//		LD (IX+d),r
		,[new RegExp(	"^LD "		+"\\(IY"+d+"\\)"	+","+r					+"$"),8]	//		LD (IY+d),r
		,[new RegExp(	"^LD "		+_hl_				+","+n					+"$"),9]	//		LD (HL),n
		,[new RegExp(	"^LD "		+"\\(IX"+d+"\\)"	+","+n					+"$"),10]	//	LD (IX+d),n
		,[new RegExp(	"^LD "		+"\\(IY"+d+"\\)"	+","+n	 	 			+"$"),11]	//	LD (IY+d),n
		,[new RegExp(	"^LD "		+"A"				+","+"\\(BC\\)"			+"$"),12]	//	LD A,(BC)
		,[new RegExp(	"^LD "		+"A"				+","+"\\(DE\\)"			+"$"),13]	//	LD A,(DE)
		,[new RegExp(	"^LD "		+"\\(BC\\)"			+","+"A"				+"$"),15]	//	LD (BC),A
		,[new RegExp(	"^LD "		+"\\(DE\\)"			+","+"A"				+"$"),16]	//	LD (DE),A
		,[new RegExp(	"^PUSH "	+qq											+"$"),36]	//	PUSH qq
		,[new RegExp(	"^POP "		+qq											+"$"),39]	//	POP qq
		,[new RegExp(	"^ADD "		+"A"				+","+r					+"$"),56]	//	ADD A,r
		,[new RegExp(	"^ADD "		+"A"				+","+n					+"$"),57]	//	ADD A,n
		,[new RegExp(	"^ADD "		+"A"				+","+_hl_				+"$"),58]	//	ADD A,(HL)
		,[new RegExp(	"^ADD "		+"A"				+","+"\\(IX"+d+"\\)"	+"$"),59]	//	ADD A,(IX+d)
		,[new RegExp(	"^ADD "		+"A"				+","+"\\(IY"+d+"\\)"	+"$"),60]	//	ADD A,(IY+d)
		,[new RegExp(	"^ADC "		+"A"				+","+r					+"$"),61]	//	ADC A,r
		,[new RegExp(	"^ADC "		+"A"				+","+n					+"$"),62]	//	ADC A,n
		,[new RegExp(	"^ADC "		+"A"				+","+_hl_				+"$"),63]	//	ADC A,(HL)
		,[new RegExp(	"^ADC "		+"A"				+","+"\\(IX"+d+"\\)"	+"$"),64]	//	ADC A,(IX+d)
		,[new RegExp(	"^ADC "		+"A"				+","+"\\(IY"+d+"\\)"	+"$"),65]	//	ADC A,(IY+d)
		,[new RegExp(	"^SUB "		+r											+"$"),66]	//	SUB r
		,[new RegExp(	"^SUB "		+n											+"$"),67]	//	SUB n
		,[new RegExp(	"^SUB "		+_hl_										+"$"),68]	//	SUB (HL)
		,[new RegExp(	"^SUB "		+"\\(IX"+d+"\\)"							+"$"),69]	//	SUB (IX+d)
		,[new RegExp(	"^SUB "		+"\\(IY"+d+"\\)"							+"$"),70]	//	SUB (IY+d)
//		,[ RegExp(	"^SUB "		+"A"				+r						+"$"),66]	//	SUB A,r			疑似
//		,[ RegExp(	"^SUB "		+"A"				+n						+"$"),67]	//	SUB A,n			疑似
//		,[ RegExp(	"^SUB "		+"A"				+_hl_					+"$"),68]	//	SUB A,(HL)		疑似
//		,[ RegExp(	"^SUB "		+"A"				+","+"\\(IX"+d+"\\)"	+"$"),69]	//	SUB A,(IX+d)	疑似
//		,[ RegExp(	"^SUB "		+"A"				+","+"\\(IY"+d+"\\)"	+"$"),70]	//	SUB A,(IY+d)	疑似
		,[new RegExp(	"^SBC "		+"A"				+","+r					+"$"),71]	//	SBC A,r
		,[new RegExp(	"^SBC "		+"A"				+","+n					+"$"),72]	//	SBC A,n
		,[new RegExp(	"^SBC "		+"A"				+","+_hl_				+"$"),73]	//	SBC A,(HL)
		,[new RegExp(	"^SBC "		+"A"				+","+"\\(IX"+d+"\\)"	+"$"),74]	//	SBC A,(IX+d)
		,[new RegExp(	"^SBC "		+"A"				+","+"\\(IY"+d+"\\)"	+"$"),75]	//	SBC A,(IY+d)
		,[new RegExp(	"^AND "		+r											+"$"),76]	//	AND r
		,[new RegExp(	"^AND "		+n											+"$"),77]	//	AND n
		,[new RegExp(	"^AND "		+_hl_										+"$"),78]	//	AND (HL)
		,[new RegExp(	"^AND "		+"\\(IX"+d+"\\)"							+"$"),79]	//	AND (IX+d)
		,[new RegExp(	"^AND "		+"\\(IY"+d+"\\)"							+"$"),80]	//	AND (IY+d)
		,[new RegExp(	"^OR "		+r											+"$"),81]	//	OR r
		,[new RegExp(	"^OR "		+n											+"$"),82]	//	OR n
		,[new RegExp(	"^OR "		+_hl_										+"$"),83]	//	OR (HL)
		,[new RegExp(	"^OR "		+"\\(IX"+d+"\\)"							+"$"),84]	//	OR (IX+d)
		,[new RegExp(	"^OR "		+"\\(IY"+d+"\\)"							+"$"),85]	//	OR (IY+d)
		,[new RegExp(	"^XOR "		+r											+"$"),86]	//	XOR r
		,[new RegExp(	"^XOR "		+n											+"$"),87]	//	XOR n
		,[new RegExp(	"^XOR "		+_hl_										+"$"),88]	//	XOR (HL)
		,[new RegExp(	"^XOR "		+"\\(IX"+d+"\\)"							+"$"),89]	//	XOR (IX+d)
		,[new RegExp(	"^XOR "		+"\\(IY"+d+"\\)"							+"$"),90]	//	XOR (IY+d)
		,[new RegExp(	"^CP "		+r											+"$"),91]	//	CP r
		,[new RegExp(	"^CP "		+n											+"$"),92]	//	CP n
		,[new RegExp(	"^CP "		+_hl_										+"$"),93]	//	CP (HL)
		,[new RegExp(	"^CP "		+"\\(IX"+d+"\\)"							+"$"),94]	//	CP (IX+d)
		,[new RegExp(	"^CP "		+"\\(IY"+d+"\\)"							+"$"),95]	//	CP (IY+d)
		,[new RegExp(	"^INC "		+r											+"$"),96]	//	INC r
		,[new RegExp(	"^INC "		+_hl_										+"$"),97]	//	INC (HL)
		,[new RegExp(	"^INC "		+"\\(IX"+d+"\\)"							+"$"),98]	//	INC (IX+d)
		,[new RegExp(	"^INC "		+"\\(IY"+d+"\\)"							+"$"),99]	//	INC (IY+d)
		,[new RegExp(	"^DEC "		+r											+"$"),100]	//	DEC r
		,[new RegExp(	"^DEC "		+_hl_										+"$"),101]	//	DEC (HL)
		,[new RegExp(	"^DEC "		+"\\(IX"+d+"\\)"							+"$"),102]	//	DEC (IX+d)
		,[new RegExp(	"^DEC "		+"\\(IY"+d+"\\)"							+"$"),103]	//	DEC (IY+d)
		,[new RegExp(	"^ADD "		+"(HL)"				+","			+ss		+"$"),116]	//	ADD HL,ss
		,[new RegExp(	"^ADC "		+"(HL)"				+","			+ss		+"$"),117]	//	ADC HL,ss
		,[new RegExp(	"^SBC "		+"(HL)"				+","			+ss		+"$"),118]	//	SBC HL,ss
		,[new RegExp(	"^ADD "		+"(IX)"				+","			+pp		+"$"),119]	//	ADD IX,pp
		,[new RegExp(	"^ADD "		+"(IY)"				+","			+rr		+"$"),120]	//	ADD IY,rr
		,[new RegExp(	"^INC "		+ss											+"$"),121]	//	INC ss
		,[new RegExp(	"^INC "		+"(IX)"										+"$"),122]	//	INC IX
		,[new RegExp(	"^INC "		+"(IY)"										+"$"),123]	//	INC IY
		,[new RegExp(	"^DEC "		+ss											+"$"),124]	//	DEC ss
		,[new RegExp(	"^DEC "		+"(IX)"										+"$"),125]	//	DEC IX
		,[new RegExp(	"^DEC "		+"(IY)"										+"$"),126]	//	DEC IY
		,[new RegExp(	"^RLC "		+r											+"$"),131]	//	RLC r
		,[new RegExp(	"^RLC "		+_hl_										+"$"),132]	//	RLC (HL)
		,[new RegExp(	"^RLC "		+"\\(IX"+d+"\\)"							+"$"),133]	//	RLC (IX+d)
		,[new RegExp(	"^RLC "		+"\\(IY"+d+"\\)"							+"$"),134]	//	RLC (IY+d)
		,[new RegExp(	"^RL "		+r											+"$"),135]	//	RL r
		,[new RegExp(	"^RL "		+_hl_										+"$"),136]	//	RL (HL)
		,[new RegExp(	"^RL "		+"\\(IX"+d+"\\)"							+"$"),137]	//	RL (IX+d)
		,[new RegExp(	"^RL "		+"\\(IY"+d+"\\)"							+"$"),138]	//	RL (IY+d)
		,[new RegExp(	"^RRC "		+r											+"$"),139]	//	RRC m
		,[new RegExp(	"^RRC "		+_hl_										+"$"),140]	//	RRC (HL)
		,[new RegExp(	"^RRC "		+"\\(IX"+d+"\\)"							+"$"),141]	//	RRC (IX+d)
		,[new RegExp(	"^RRC "		+"\\(IY"+d+"\\)"							+"$"),142]	//	RRC (IY+d)
		,[new RegExp(	"^RR "		+r											+"$"),143]	//	RR m
		,[new RegExp(	"^RR "		+_hl_										+"$"),144]	//	RR (HL)
		,[new RegExp(	"^RR "		+"\\(IX"+d+"\\)"							+"$"),145]	//	RR (IX+d)
		,[new RegExp(	"^RR "		+"\\(IY"+d+"\\)"							+"$"),146]	//	RR (IY+d)
		,[new RegExp(	"^SLA "		+r											+"$"),147]	//	SLA m
		,[new RegExp(	"^SLA "		+_hl_										+"$"),148]	//	SLA (HL)
		,[new RegExp(	"^SLA "		+"\\(IX"+d+"\\)"							+"$"),149]	//	SLA (IX+d)
		,[new RegExp(	"^SLA "		+"\\(IY"+d+"\\)"							+"$"),150]	//	SLA (IY+d)
		,[new RegExp(	"^SRA "		+r											+"$"),151]	//	SRA m
		,[new RegExp(	"^SRA "		+_hl_										+"$"),152]	//	SRA (HL)
		,[new RegExp(	"^SRA "		+"\\(IX"+d+"\\)"							+"$"),153]	//	SRA (IX+d)
		,[new RegExp(	"^SRA "		+"\\(IY"+d+"\\)"							+"$"),154]	//	SRA (IY+d)
		,[new RegExp(	"^SRL "		+r											+"$"),155]	//	SRL m
		,[new RegExp(	"^SRL "		+_hl_										+"$"),156]	//	SRL (HL)
		,[new RegExp(	"^SRL "		+"\\(IX"+d+"\\)"							+"$"),157]	//	SRL (IX+d)
		,[new RegExp(	"^SRL "		+"\\(IY"+d+"\\)"							+"$"),158]	//	SRL (IY+d)
		,[new RegExp(	"^BIT "		+b					+","+r					+"$"),161]	//	BIT b,r
		,[new RegExp(	"^BIT "		+b 					+","+_hl_				+"$"),162]	//	BIT b,(HL)
		,[new RegExp(	"^BIT "		+b					+","+"\\(IX"+d+"\\)"	+"$"),163]	//	BIT b,(IX+d)
		,[new RegExp(	"^BIT "		+b					+","+"\\(IY"+d+"\\)"	+"$"),164]	//	BIT b,(IY+d)
		,[new RegExp(	"^SET "		+b					+","+r					+"$"),165]	//	SET b,r
		,[new RegExp(	"^SET "		+b 					+","+_hl_				+"$"),166]	//	SET b,(HL)
		,[new RegExp(	"^SET "		+b					+","+"\\(IX"+d+"\\)"	+"$"),167]	//	SET b,(IX+d)
		,[new RegExp(	"^SET "		+b					+","+"\\(IY"+d+"\\)"	+"$"),168]	//	SET b,(IY+d)
		,[new RegExp(	"^RES "		+b					+","+r					+"$"),169]	//	RES b,r
		,[new RegExp(	"^RES "		+b 					+","+_hl_				+"$"),170]	//	RES b,(HL)
		,[new RegExp(	"^RES "		+b					+","+"\\(IX"+d+"\\)"	+"$"),171]	//	RES b,(IX+d)
		,[new RegExp(	"^RES "		+b					+","+"\\(IY"+d+"\\)"	+"$"),172]	//	RES b,(IY+d)
		,[new RegExp(	"^JR "		+e											+"$"),175]	//	JR e
		,[new RegExp(	"^JR C,"	+e											+"$"),176]	//	JR C,e
		,[new RegExp(	"^JR NC,"	+e											+"$"),177]	//	JR NC,e
		,[new RegExp(	"^JR Z,"	+e											+"$"),178]	//	JR Z,e
		,[new RegExp(	"^JR NZ,"	+e											+"$"),179]	//	JR NZ,e
		,[new RegExp(	"^JP "		+_hl_										+"$"),180]	//	JP (HL)
		,[new RegExp(	"^JP "		+"\\(IX\\)"									+"$"),181]	//	JP (IX)
		,[new RegExp(	"^JP "		+"\\(IY\\)"									+"$"),182]	//	JP (IY)
		,[new RegExp(	"^DJNZ "	+e											+"$"),183]	//	DJNZ e
		,[new RegExp(	"^RET "		+cc											+"$"),187]	//	RET cc
		,[new RegExp(	"^RST "		+p											+"$"),190]	//	RST p
		,[new RegExp(	"^IN "		+r 					+","+"\\(C\\)"			+"$"),192]	//	IN r,(C)
		,[new RegExp(	"^IN "		+"A"				+","+_n_				+"$"),191]	//	IN A,(n)
		,[new RegExp(	"^OUT "		+"(\\(C\\))"		+","		+r			+"$"),198]	//	OUT (C),r
		,[new RegExp(	"^OUT "		+_n_				+","+"A"				+"$"),197]	//	OUT (n),A
		,[new RegExp(	"^LD "		+"A"				+","+_nn_				+"$"),14]	//	LD A,(nn)
		,[new RegExp(	"^LD "		+"IX"				+","+nn					+"$"),23]	//	LD IX,nn
		,[new RegExp(	"^LD "		+"IY"				+","+nn					+"$"),24]	//	LD IY,nn
		,[new RegExp(	"^LD "		+"HL"				+","+_nn_				+"$"),25]	//	LD HL,(nn)
		,[new RegExp(	"^LD "		+"IX"				+","+_nn_				+"$"),27]	//	LD IX,(nn)
		,[new RegExp(	"^LD "		+"IY"				+","+_nn_				+"$"),28]	//	LD IY,(nn)
		,[new RegExp(	"^LD "		+dd					+","+nn					+"$"),22]	//	LD dd,nn
		,[new RegExp(	"^LD "		+dd					+","+_nn_				+"$"),26]	//	LD dd,(nn)
		,[new RegExp(	"^LD "		+_nn_				+","+"A"				+"$"),17]	//	LD (nn),A
		,[new RegExp(	"^LD "		+_nn_				+","+"HL"				+"$"),29]	//	LD (nn),HL
		,[new RegExp(	"^LD "		+_nn_				+","+dd					+"$"),30]	//	LD (nn)dd
		,[new RegExp(	"^LD "		+_nn_				+","+"IX"				+"$"),31]	//	LD (nn),IX
		,[new RegExp(	"^LD "		+_nn_				+","+"IY"				+"$"),32]	//	LD (nn),IY
		,[new RegExp(	"^JP "		+nn											+"$"),173]	//	JP nn
		,[new RegExp(	"^JP "		+cc					+","+nn					+"$"),174]	//	JP cc,nn
		,[new RegExp(	"^CALL "	+nn											+"$"),184]	//	CALL nn
		,[new RegExp(	"^CALL "	+cc					+","+nn					+"$"),185]	//	CALL cc,nn

		,[new RegExp(	"^"		+Symbol											+"$"),203]	//	ADDRESS:
		,[new RegExp(	"^"		+Symbol+ " EQU " + n							+"$"),204]	//	n EQU n
		,[new RegExp(	"^"		+"ORG " + n										+"$"),205]	//	ORG n



	];

	var	g_r=
	{
		"B":0x0,//0b000;
		"C":0x1,//0b001;
		"D":0x2,//0b010;
		"E":0x3,//0b011;
		"H":0x4,//0b100;
		"L":0x5,//0b101;
//		"(HL)":0x6,//0b111;
		"A":0x7,//0b111;
	};
	var	g_b=
	{
		"B":0x0,
		"C":0x1,
		"D":0x2,
		"E":0x3,
		"H":0x4,
		"L":0x5,
		"(HL)":0x6,
		"A":0x7,
	};
	var	g_dd=
	{
		"BC":0b00,
		"DE":0b01,
		"HL":0b10,
		"SP":0b11,
	};
	var	g_qq=
	{
		"BC":0b00,
		"DE":0b01,
		"HL":0b10,
		"AF":0b11,
	};
	var	g_ss=
	{
		"BC":0b00,
		"DE":0b01,
		"HL":0b10,
		"SP":0b11,
	};
	var	g_pp=
	{
		"BC":0b00,
		"DE":0b01,
		"IX":0b10,
		"SP":0b11,
	};
	var	g_p=
	{
		"00H":0xC7,
		"08H":0xCF,
		"10H":0xD7,
		"18H":0xDF,
		"20H":0xE7,
		"28H":0xEF,
		"30H":0xF7,
		"38H":0xFF,
	};
	var	g_rr=
	{
		"BC":0b00,
		"DE":0b01,
		"IY":0b10,
		"SP":0b11,
	};
	var	g_cc=
	{
		"NZ":0b000,
		"Z" :0b001,
		"NC":0b010,
		"C" :0b011,
		"PO":0b100,
		"PE":0b101,
		"P" :0b110,
		"M" :0b111,
	};

	var	g_flgAssemble;
	var	g_tblLabelcode;
	var	g_cntAddress;
	var	g_tblCode;
	var	g_cntErr;
	let g_outputmode = 1;
	let g_tblCmdHex = [];
	//--------------------------------------------------------------------------
	Number.prototype.toHex=function(culms)
	//--------------------------------------------------------------------------
	{
		var v=this;
		if ( v < 0 )
		{
			v=0;
			for ( var b=(culms*4)-1 ; b>=0 ; b-- )
			{
				v<<=1;
				v|=(this>>b)&1;
			}
		}
		return ("00000000"+(v.toString(16).toUpperCase())).substr(-culms);
	}


	//--------------------------------------------------------------------------
	Number.prototype.isDigit=function()
	//--------------------------------------------------------------------------
	{
	    return true;
	}
	//--------------------------------------------------------------------------
	String.prototype.isDigit=function()
	//--------------------------------------------------------------------------
	{
	    return /^\d+$/.test(this);
	}

	//--------------------------------------------------------------------------
	function dump(  v )
	//--------------------------------------------------------------------------
	{
		document.getElementById("dst").value += v+"\n";
	}
	//--------------------------------------------------------------------------
	function dumpErr(  v )
	//--------------------------------------------------------------------------
	{
		if ( g_flgAssemble ) document.getElementById("dst").value += "Err:"+v+"\n";
	}

	//--------------------------------------------------------------------------
	function cnvLabels2Dec( v )
	//--------------------------------------------------------------------------
	{
		if ( !v.isDigit() )
		{
			let sign = 1;	// +d,-d 主に用の処理
			{
				if ( v.substr(0,1) == "+" ) 
				{
					sign = 1;
					v = v.substr(1);
				}
				else 
				if ( v.substr(0,1) == "-" ) 
				{
					sign = -1;
					v = v.substr(1);
				}
			}

			//ラベル変換
			var n=g_tblLabelcode[v];
			if ( n==undefined ) 
			{
				if ( /[0-9A-F].+/.exec(v) ) 
				{	// ラベルになければ数字として扱う
				}
				else
				{
					dumpErr("Undefined Label name:"+ v);
				}
			}
			else
			{
				// ラベルを数値に変換
				v=n;
			}

			//HEX to DEC 変換
			if ( !v.isDigit() )
			{
				if ( v.toString().slice(-1).toUpperCase()=="H" ) v=parseInt(v.substr(0,v.length-1),16);
			}
			v *= sign;	// 数値化でもある
		}

		if ( !v.isDigit() )
		{
			dump( "Error("+v+")" );
			g_cntErr++;
			v=0;
		}
		return v*1;
			
	}
	//--------------------------------------------------------------------------
	function write_hex1( v )
	//--------------------------------------------------------------------------
	{
		if ( g_flgAssemble )
		{
			v = cnvLabels2Dec(v);
			g_tblCode.push(v);
		}
		g_cntAddress++;
	}

	//--------------------------------------------------------------------------
	function assemble(a) 
	//--------------------------------------------------------------------------
	{
		assemble_main();
/*
		if (window.File) 
		{
			assemble_main();
		  // File APIに関する処理を記述
		  //window.alert("File APIが実装されてます。");
		} else {
		  window.alert("本ブラウザではFile APIが使えません");
		}
*/
	}
	//--------------------------------------------------------------------------
	function dumpNormal() 
	//--------------------------------------------------------------------------
	{
			var x=0;
			var	len=g_cntAddress;
			var	cnt=0;
			let ofs = g_tblLabelcode["ORG"];

			while(len)
			{
				document.getElementById("dst").value += (cnt+ofs).toHex(4)+" ";
				var x=16;
				while(x&&len)
				{
					var v=g_tblCode[cnt];
					document.getElementById("dst").value += (v*1).toHex(2)+" ";
					x--;
					len--;
					cnt++;
				}
				document.getElementById("dst").value += "\n";
			}
	}
	//--------------------------------------------------------------------------
	function dumpIntelHex() 
	//--------------------------------------------------------------------------
	{
		var x=0;
		var	len=g_tblCode.length;//g_cntAddress;
		var	cnt=0;
		let ofs = g_tblLabelcode["ORG"];
		var	width=0x10;
		var	spc="";
		while(len>0)
		{
			if ( len>width )
			{
				x=width;
			}
			else
			{
				x=len;
			}
			document.getElementById("dst").value += ":";
			document.getElementById("dst").value += x.toHex(2)+spc;
			document.getElementById("dst").value += (cnt+ofs).toHex(4)+spc;
			document.getElementById("dst").value += "00"+spc;
			
			var sum=x + (((cnt+ofs)>>8)&0xff) + ((cnt+ofs)&0xff);

			while(x>0 && len>0)
			{
				var v=g_tblCode[cnt];
				if ( v==undefined )
				{
					v=0;
					document.getElementById("dst").value += " err.7("+(cnt+ofs)+")";
				}
				sum+=v;
				document.getElementById("dst").value += v.toHex(2)+spc;
				x--;
				len--;
				cnt++;
			}
			document.getElementById("dst").value += (-sum).toHex(2);
			document.getElementById("dst").value += "\n";
		}
		document.getElementById("dst").value += ":"+"00"+"0000"+"01"+"FF"+"\n";
		
	}

	//--------------------------------------------------------------------------
	function assemble_main(a) 
	//--------------------------------------------------------------------------
	{
		g_flgAssemble = false;
		g_tblLabelcode=new Array();
		g_tblCode=new Array();
		g_cntErr=0;
		g_tblCmdHex = [];
		g_tblLabelcode["ORG"]=0;
		document.getElementById("dst").value="";

		//	ラベルテーブルの作成
		g_flgAssemble=false;
		analisys();

		//	アセンブル
		g_flgAssemble=true;
		analisys();

		{

			if ( g_outputmode == 1 )	// IntelHel出力
			{
				dumpIntelHex();
			}
			if ( g_outputmode == 2 )	// デバッグ用16進数出力
			{
				dumpNormal();
			}
			if ( g_outputmode == 2 )	//  デバッグ用ラベル値出力
			{
				document.getElementById("dst").value += "--\n";
				for ( var key in g_tblLabelcode )	dump( key + ":" +g_tblLabelcode[key] );	
			}
			if ( g_outputmode == 4 )	// デバッグ用コマンドHEX出力
			{
				for ( var v of g_tblCmdHex )
				{
					document.getElementById("dst").value += v;
				}
			}
		}
	}
	//--------------------------------------------------------------------------
	function analisys() 
	//--------------------------------------------------------------------------
	{
		g_cntErr=0;
		var text=document.getElementById("src").value;
		var tblStr=text.split(/\n|:/);
		var	cntLine=1;
		g_cntAddress=0;

		for ( var i=0 ; i < tblStr.length ; i++ )
		{
			var	str=tblStr[i];

			str=str.replace(/;.*$/g, ""); 			//コメント削除
			str=str.trim().replace(/[ |	]+/g, " "); //トリム
			str=str.replace(/[ |\t]+,[ |\t]+/g, ","); //,前後トリム
			str=str.toUpperCase();					//大文字化
			if ( str.length == 0 ) continue;		//空行削除

			let stCmdHex = g_tblCode.length;

			//	DEFB擬似命令
			if ( str.substr(0,4)=="DEFB" ) 
			{
				var tbl=str.substr(4,99).split(",");

				for ( var j=0 ; j<tbl.length ; j++ )
				{
					var	d = tbl[j].trim();

					write_hex1( d );
				}
			//	continue;
			}
			else
			{

				var	Find=
				{
					None:0,
					UDLabel:1,	//	Undefined Label
					OK:2,
				};

				var valFind=Find.None;
	//			var	p=0;
	//			for ( p ; p<tblOpc.length ; p++ )
				for ( let opc of tblOpc )
				{
	//				var tbl=str.match( tblOpc[p][0] );
					var tbl=str.match( opc[0] );
					if ( tbl!=null )
					{

						var	o1=tbl[1];	if ( o1 != undefined ) o1 = o1.toUpperCase();
						var	o2=tbl[2];	if ( o2 != undefined ) o2 = o2.toUpperCase();
						var	o3=tbl[3];	if ( o3 != undefined ) o3 = o3.toUpperCase();
	//console.log(str,tbl,p);
	//if ( g_flgAssemble ) console.log( ">",opc[1] );
	//					switch(p)

						switch(opc[1])
						{
						case 1://ld r,r
							write_hex1( 0b01000000|(g_r[o1]<<3)|(g_r[o2]) );
							valFind=Find.OK;
							break;
						case 2:	//ld r,n
							write_hex1( 0b00000110|(g_r[o1]<<3) );
							write_hex1( o2 );
							valFind=Find.OK;
							break;
						case 3:	//ld r,(HL)
							write_hex1( 0b01000110|(g_r[o1]<<3) );
							valFind=Find.OK;
							break;
						case 4:	//ld r,(IX+d)
							write_hex1( 0xDD );
							write_hex1( 0b01000110|(g_r[o1]<<3) );
							write_hex1( o2 );
							valFind=Find.OK;
							break;
						case 5:	//ld r,(IY+d)
							write_hex1( 0xFD );
							write_hex1( 0b01000110|(g_r[o1]<<3) );
							write_hex1( o2 );
							valFind=Find.OK;
							break;
						case 6:	//ld (HL),r
							write_hex1( 0b01110000|(g_r[o2]) );
							valFind=Find.OK;
							break;
						case 7:	//ld (IX+d),r
							write_hex1( 0xDD );
							write_hex1( 0b01110000|(g_r[o2]) );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 8:	//ld (IY+d),r
							write_hex1( 0xFD );
							write_hex1( 0b01110000|(g_r[o2]) );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 9:	//ld (HL),n
							write_hex1( 0x36 );
							write_hex1( o2 );
							valFind=Find.OK;
							break;
						case 10:	//ld (ix+d),n
							write_hex1( 0xDD );
							write_hex1( 0x36 );
							write_hex1( o1 );
							write_hex1( o2 );
							valFind=Find.OK;
							break;
						case 11:	//ld (iy+d),n
							write_hex1( 0xFD );
							write_hex1( 0x36 );
							write_hex1( o1 );
							write_hex1( o2 );
							valFind=Find.OK;
							break;
						case 12:	//ld a,(bc)
							write_hex1( 0x0a );
							valFind=Find.OK;
							break;
						case 13:	//	LD A,(DE)
							write_hex1( 0x1a );
							valFind=Find.OK;
							break;
						case 14:	//	LD A,(nn)
							write_hex1( 0x3a);
							o1=cnvLabels2Dec(o1);
	//if ( g_flgAssemble ) console.log("::",o1);
							write_hex1( (o1   )&0xff );
							write_hex1( (o1>>8)&0xff );
							valFind=Find.OK;
							break;
						case 15:	//	LD (BC),A
							write_hex1( 0x02 );
							valFind=Find.OK;
							break;
						case 16:	//	LD (DE),A
							write_hex1( 0x12 );
							valFind=Find.OK;
							break;
						case 17:	//	LD (nn),A
							write_hex1( 0x32 );
							o1=cnvLabels2Dec(o1);
							write_hex1( (o1   )&0xff );
							write_hex1( (o1>>8)&0xff );
							valFind=Find.OK;
							break;
						case 18:	//	LD A,I
							write_hex1( 0xed );
							write_hex1( 0x57 );
							valFind=Find.OK;
							break;
						case 19:	//	LD A,R
							write_hex1( 0xed );
							write_hex1( 0x5f );
							valFind=Find.OK;
							break;
						case 20:	//	LD I,A
							write_hex1( 0xed );
							write_hex1( 0x47 );
							valFind=Find.OK;
							break;
						case 21:	//	LD R,A
							write_hex1( 0xed );
							write_hex1( 0x4f );
							valFind=Find.OK;
							break;
						case 22:	//	LD dd,nn
							write_hex1( 0b00000001|g_dd[o1]<<4 );
	//console.log(o2);
							o2=cnvLabels2Dec(o2);
							write_hex1( (o2   )&0xff );
							write_hex1( (o2>>8)&0xff );
							valFind=Find.OK;
							break;
						case 23:	//	LD IX,nn
							write_hex1( 0xDD );
							write_hex1( 0x21 );
							o1=cnvLabels2Dec(o1);
							write_hex1( (o1   )&0xff );
							write_hex1( (o1>>8)&0xff );
							valFind=Find.OK;
							break;
						case 24:	//	LD IY,nn
							write_hex1( 0xFD );
							write_hex1( 0x21 );
							o1=cnvLabels2Dec(o1);
							write_hex1( (o1   )&0xff );
							write_hex1( (o1>>8)&0xff );
							valFind=Find.OK;
							break;
						case 25:	//	LD HL,(nn)
							write_hex1( 0x2A );
							o1=cnvLabels2Dec(o1);
							write_hex1( (o1   )&0xff );
							write_hex1( (o1>>8)&0xff );
							valFind=Find.OK;
							break;
						case 26:	//	LD dd,(nn)
							write_hex1( 0xED );
							write_hex1( 0b01001011|g_dd[o1]<<4 );
							o2=cnvLabels2Dec(o2);
							write_hex1( (o2   )&0xff );
							write_hex1( (o2>>8)&0xff );
							valFind=Find.OK;
							break;
						case 27:	//	LD IX,(nn)
							write_hex1( 0xDD );
							write_hex1( 0x2A );
							o1=cnvLabels2Dec(o1);
							write_hex1( (o1   )&0xff );
							write_hex1( (o1>>8)&0xff );
							valFind=Find.OK;
							break;
						case 28:	//	LD IY,(nn)
							write_hex1( 0xFD );
							write_hex1( 0x2A );
							o1=cnvLabels2Dec(o1);
							write_hex1( (o1   )&0xff );
							write_hex1( (o1>>8)&0xff );
							valFind=Find.OK;
							break;
						case 29:	//	LD (nn),HL
	//console.log(o1,o2)
							write_hex1( 0x22 );
							o1=cnvLabels2Dec(o1);
							write_hex1( (o1   )&0xff );
							write_hex1( (o1>>8)&0xff );
							valFind=Find.OK;
							break;
						case 30:	//	LD (nn),dd
							write_hex1( 0xED );
							write_hex1( 0b01000011|g_dd[o2]<<4 );
							o1=cnvLabels2Dec(o1);
							write_hex1( (o1   )&0xff );
							write_hex1( (o1>>8)&0xff );
							valFind=Find.OK;
							break;
						case 31:	//	LD (nn),IX
							write_hex1( 0xDD );
							write_hex1( 0x22 );
							o1=cnvLabels2Dec(o1);
							write_hex1( (o1   )&0xff );
							write_hex1( (o1>>8)&0xff );
							valFind=Find.OK;
							break;
						case 32:	//	LD (nn),IY
							write_hex1( 0xFD );
							write_hex1( 0x22 );
							o1=cnvLabels2Dec(o1);
							write_hex1( (o1   )&0xff );
							write_hex1( (o1>>8)&0xff );
							valFind=Find.OK;
							break;
						case 33:	//	LD SP,HL
							write_hex1( 0xF9 );
							valFind=Find.OK;
							break;
						case 34:	//	LD SP,IX
							write_hex1( 0xDD );
							write_hex1( 0xF9 );
							valFind=Find.OK;
							break;
						case 35:	//	LD SP,IY
							write_hex1( 0xFD );
							write_hex1( 0xF9 );
							valFind=Find.OK;
							break;
						case 36:	//	PUSH qq
							write_hex1( 0b11000101|g_qq[o1]<<4 );
							valFind=Find.OK;
							break;
						case 37:	//	PUSH IX
							write_hex1( 0xDD );
							write_hex1( 0xE5 );
							valFind=Find.OK;
							break;
						case 38:	//	PUSH IY
							write_hex1( 0xFD );
							write_hex1( 0xE5 );
							valFind=Find.OK;
							break;
						case 39:	//	POP qq
							write_hex1( 0b11000001|g_qq[o1]<<4 );
							valFind=Find.OK;
							break;
						case 40:	//	POP IX
							write_hex1( 0xDD );
							write_hex1( 0xE1 );
							valFind=Find.OK;
							break;
						case 41:	//	POP IY
							write_hex1( 0xFD );
							write_hex1( 0xE1 );
							valFind=Find.OK;
							break;
						case 42:	//	EX DE,HL
							write_hex1( 0xEB );
							valFind=Find.OK;
							break;
						case 43:	//	EX AF,AF'
							write_hex1( 0x08 );
							valFind=Find.OK;
							break;
						case 44:	//	EXX
							write_hex1( 0xD9 );
							valFind=Find.OK;
							break;
						case 45:	//	EX (SP),HL
							write_hex1( 0xE3 );
							valFind=Find.OK;
							break;
						case 46:	//	EX (SP),IX
							write_hex1( 0xDD );
							write_hex1( 0xE3 );
							valFind=Find.OK;
							break;
						case 47:	//	EX (SP),IY
							write_hex1( 0xFD );
							write_hex1( 0xE3 );
							valFind=Find.OK;
							break;
						case 48:	//	LDI
							write_hex1( 0xED );
							write_hex1( 0xA0 );
							valFind=Find.OK;
							break;
						case 49:	//	LDIR
							write_hex1( 0xED );
							write_hex1( 0xB0 );
							valFind=Find.OK;
							break;
						case 50:	//	LDD
							write_hex1( 0xED );
							write_hex1( 0xA8 );
							valFind=Find.OK;
							break;
						case 51:	//	LDDR
							write_hex1( 0xED );
							write_hex1( 0xB8 );
							valFind=Find.OK;
							break;
						case 52:	//	CPI
							write_hex1( 0xED );
							write_hex1( 0xA1 );
							valFind=Find.OK;
							break;
						case 53:	//	CPIR
							write_hex1( 0xED );
							write_hex1( 0xB1 );
							valFind=Find.OK;
							break;
						case 54:	//	CPD
							write_hex1( 0xED );
							write_hex1( 0xA9 );
							valFind=Find.OK;
							break;
						case 55:	//	CPDR
							write_hex1( 0xED );
							write_hex1( 0xB9 );
							valFind=Find.OK;
							break;
						case 56:	//	ADD A,r
							write_hex1( 0b10000000|(g_r[o1]) );
							valFind=Find.OK;
							break;
						case 57:	//	ADD A,n
							write_hex1( 0xC6 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 58:	//	ADD A,(HL)
							write_hex1( 0x86 );
							valFind=Find.OK;
							break;
						case 59:	//	ADD A,(IX+d)
							write_hex1( 0xDD );
							write_hex1( 0x86 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 60:	//	ADD A,(IY+d)
							write_hex1( 0xFD );
							write_hex1( 0x86 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 61:	//	ADC A,r
							write_hex1( 0b10001000|(g_r[o1]) );
							valFind=Find.OK;
							break;
						case 62:	//	ADC A,n
							write_hex1( 0xCE );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 63:	//	ADC A,(HL)
							write_hex1( 0x8E );
							valFind=Find.OK;
							break;
						case 64:	//	ADC A,(IX+d)
							write_hex1( 0xDD );
							write_hex1( 0x8E );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 65:	//	ADC A,(IY+d)
							write_hex1( 0xFD );
							write_hex1( 0x8E );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 66:	//	SUB r
							write_hex1( 0b10010000|(g_r[o1]) );
							valFind=Find.OK;
							break;
						case 67:	//	SUB n
							write_hex1( 0xD6 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 68:	//	SUB A,(HL)
							write_hex1( 0x96 );
							valFind=Find.OK;
							break;
						case 69:	//	SUB (IX+d)
							write_hex1( 0xDD );
							write_hex1( 0x96 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 70:	//	SUB A,(IY+d)
							write_hex1( 0xFD );
							write_hex1( 0x96 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 71:	//	SBC A,r
							write_hex1( 0b10011000|(g_r[o1]) );
							valFind=Find.OK;
							break;
						case 72:	//	SBC A,n
							write_hex1( 0xDE );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 73:	//	SBC A,(HL)
							write_hex1( 0x9E );
							valFind=Find.OK;
							break;
						case 74:	//	SBC A,(IX+d)
							write_hex1( 0xDD );
							write_hex1( 0x9E );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 75:	//	SBC A,(IY+d)
							write_hex1( 0xFD );
							write_hex1( 0x9E );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 76:	//	AND r
							write_hex1( 0b10100000|(g_r[o1]) );
							valFind=Find.OK;
							break;
						case 77:	//	AND n
							write_hex1( 0xE6 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 78:	//	AND (HL)
							write_hex1( 0xA6 );
							valFind=Find.OK;
							break;
						case 79:	//	AND (IX+d)
							write_hex1( 0xDD );
							write_hex1( 0xA6 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 80:	//	AND (IY+d)
							write_hex1( 0xFD );
							write_hex1( 0xA6 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 81:	//	OR r							//?? OR
							write_hex1( 0b10110000|(g_r[o1]) );
							valFind=Find.OK;
							break;
						case 82:	//	OR n
							write_hex1( 0xF6 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 83:	//	OR (HL)
							write_hex1( 0xB6 );
							valFind=Find.OK;
							break;
						case 84:	//	OR (IX+d)
							write_hex1( 0xDD );
							write_hex1( 0xB6 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 85:	//	OR (IY+d)
							write_hex1( 0xFD );
							write_hex1( 0xB6 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 86:	//	XOR r							//?? XOR
							write_hex1( 0b10101000|(g_r[o1]) );
							valFind=Find.OK;
							break;
						case 87:	//	XOR n
							write_hex1( 0xEE );					//0xF6 と最初書いてたOR nをコピペしたミスっぽい
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 88:	//	XOR (HL)
							write_hex1( 0xAE );					//0xB6 と最初書いてたOR (HL)をコピペしたミスっぽい
							valFind=Find.OK;
							break;
						case 89:	//	XOR (IX+d)
							write_hex1( 0xDD );
							write_hex1( 0xAE );					//0xB6 と最初書いてたOR..をコピペしたミスっぽい
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 90:	//	XOR (IY+d)
							write_hex1( 0xFD );
							write_hex1( 0xAE );					//0xB6 と最初書いてたOR..をコピペしたミスっぽい
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 91:	//	CP r
							write_hex1( 0b10111000|(g_r[o1]) );
							valFind=Find.OK;
							break;
						case 92:	//	CP n
							write_hex1( 0xFE );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 93:	//	CP (HL)
							write_hex1( 0xBE );
							valFind=Find.OK;
							break;
						case 94:	//	CP (IX+d)
							write_hex1( 0xDD );
							write_hex1( 0xBE );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 95:	//	CP (IY+d)
							write_hex1( 0xFD );
							write_hex1( 0xBE );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 96:	//	INC r
							write_hex1( 0b00000100|(g_r[o1]<<3) );
							valFind=Find.OK;
							break;
						case 97:	//	INC (HL)
							write_hex1( 0x34 );
							valFind=Find.OK;
							break;
						case 98:	//	INC (IX+d)
							write_hex1( 0xDD );
							write_hex1( 0x34 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 99:	//	INC (IY+d)
							write_hex1( 0xFD );
							write_hex1( 0x34 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 100:	//	DEC r
							write_hex1( 0b00000101|(g_r[o1]<<3) );
							valFind=Find.OK;
							break;
						case 101:	//	DEC (HL)
							write_hex1( 0x35 );
							valFind=Find.OK;
							break;
						case 102:	//	DEC (IX+d)
							write_hex1( 0xDD );
							write_hex1( 0x35 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 103:	//	DEC (IY+d)
							write_hex1( 0xFD );
							write_hex1( 0x35 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 104:	//	DAA
							write_hex1( 0x27 );
							valFind=Find.OK;
							break;
						case 105:	//	CPL
							write_hex1( 0x2F );
							valFind=Find.OK;
							break;
						case 106:	//	NEG
							write_hex1( 0xED );
							write_hex1( 0x44 );
							valFind=Find.OK;
							break;
						case 107:	//	CCF
							write_hex1( 0x3F );
							valFind=Find.OK;
							break;
						case 108:	//	SCF
							write_hex1( 0x37 );
							valFind=Find.OK;
							break;
						case 109:	//	NOP
							write_hex1( 0x00 );
							valFind=Find.OK;
							break;
						case 110:	//	HLAT
							write_hex1( 0x76 );
							valFind=Find.OK;
							break;
						case 111:	//	DI
							write_hex1( 0xF3 );
							valFind=Find.OK;
							break;
						case 112:	//	EI
							write_hex1( 0xFB );
							valFind=Find.OK;
							break;
						case 113:	//	IM 0
							write_hex1( 0xED );
							write_hex1( 0x46 );
							valFind=Find.OK;
							break;
						case 114:	//	IM 1
							write_hex1( 0xED );
							write_hex1( 0x56 );
							valFind=Find.OK;
							break;
						case 115:	//	IM 2
							write_hex1( 0xED );
							write_hex1( 0x5E );
							valFind=Find.OK;
							break;
						case 116:	//	ADD HL,ss
							write_hex1( 0b00001001|(g_ss[o2]<<4) );
							valFind=Find.OK;
							break;
						case 117:	//	ADC HL,ss
	//console.log( o1, o2 );
							write_hex1( 0xED );
							write_hex1( 0b01001010|(g_ss[o2]<<4) );
							valFind=Find.OK;
							break;
						case 118:	//	SBC HL,ss
							write_hex1( 0xED );
							write_hex1( 0b01000010|(g_ss[o2]<<4) );
							valFind=Find.OK;
							break;
						case 119:	//	ADD IX,pp
							write_hex1( 0xDD );
							write_hex1( 0b00001001|(g_pp[o2]<<4) );
							valFind=Find.OK;
							break;
						case 120:	//	ADD IY,rr
							write_hex1( 0xFD );
							write_hex1( 0b00001001|(g_rr[o2]<<4) );
							valFind=Find.OK;
							break;
						case 121:	//	INC ss
							write_hex1( 0b00000011|(g_ss[o1]<<4) );
							valFind=Find.OK;
							break;
						case 122:	//	INC IX
							write_hex1( 0xDD );
							write_hex1( 0x23 );
							valFind=Find.OK;
							break;
						case 123:	//	INC IY
							write_hex1( 0xFD );
							write_hex1( 0x23 );
							valFind=Find.OK;
							break;
						case 124:	//	DEC ss
							write_hex1( 0b00001011|(g_ss[o1]<<4) );
							valFind=Find.OK;
							break;
						case 125:	//	DEC IX
							write_hex1( 0xDD );
							write_hex1( 0x2B );
							valFind=Find.OK;
							break;
						case 126:	//	DEX IY
							write_hex1( 0xFD );
							write_hex1( 0x2B );
							valFind=Find.OK;
							break;
						case 127:	//	RLCA
							write_hex1( 0x07 );
							valFind=Find.OK;
							break;
						case 128:	//	RLA
							write_hex1( 0x17 );
							valFind=Find.OK;
							break;
						case 129:	//	RRCA
							write_hex1( 0x0F );
							valFind=Find.OK;
							break;
						case 130:	//	RRA
							write_hex1( 0x1F );
							valFind=Find.OK;
							break;
						case 131:	//	RLC r
							write_hex1( 0xCB );
							write_hex1( g_r[o1] );
							valFind=Find.OK;
							break;
						case 132:	//	RLC (HL)
							write_hex1( 0xCB );
							write_hex1( 0x06 );
							valFind=Find.OK;
							break;
						case 133:	//	RLC (IX+d)
							write_hex1( 0xDD );
							write_hex1( 0xCB );
							write_hex1( o1 );
							write_hex1( 0x06 );
							valFind=Find.OK;
							break;
						case 134:	//	RLC (IY+d)
							write_hex1( 0xFD );
							write_hex1( 0xCB );
							write_hex1( o1 );
							write_hex1( 0x06 );
							valFind=Find.OK;
							break;
						case 135:	//	RL r
							write_hex1( 0xCB );
							write_hex1( 0b00010000|(g_r[o1]<<0) );
							valFind=Find.OK;
							break;
						case 136:	//	RL (HL)
							write_hex1( 0xCB );
							write_hex1( 0x16 );
							valFind=Find.OK;
							break;
						case 137:	//	RL (IX+d)
							write_hex1( 0xDD );
							write_hex1( 0xCB );
							write_hex1( o1 );
							write_hex1( 0x16 );
							valFind=Find.OK;
							break;
						case 138:	//	RL (IY+d)
							write_hex1( 0xFD );
							write_hex1( 0xCB );
							write_hex1( o1 );
							write_hex1( 0x16 );
							valFind=Find.OK;
							break;
						case 139:	//	RRC r							//??	RRC r
							write_hex1( 0xCB );
							write_hex1( 0b00001000|(g_r[o1]<<0) );
							valFind=Find.OK;
							break;
						case 140:	//	RRC (HL)
							write_hex1( 0xCB );
							write_hex1( 0x0E );
							valFind=Find.OK;
							break;
						case 141:	//	RRC (IX+d)
							write_hex1( 0xDD );
							write_hex1( 0xCB );
							write_hex1( o1 );
							write_hex1( 0x0E );
							valFind=Find.OK;
							break;
						case 142:	//	RRC (IY+d)
							write_hex1( 0xFD );
							write_hex1( 0xCB );
							write_hex1( o1 );
							write_hex1( 0x0E );
							valFind=Find.OK;
							break;
						case 143:	//	RR r							//??	RR r
							write_hex1( 0xCB );
							write_hex1( 0b00011000|(g_r[o1]<<0) );
							valFind=Find.OK;
							break;
						case 144:	//	RR (HL)
							write_hex1( 0xCB );
							write_hex1( 0x1E );
							valFind=Find.OK;
							break;
						case 145:	//	RR (IX+d)
							write_hex1( 0xDD );
							write_hex1( 0xCB );
							write_hex1( o1 );
							write_hex1( 0x1E );
							valFind=Find.OK;
							break;
						case 146:	//	RR (IY+d)
							write_hex1( 0xFD );
							write_hex1( 0xCB );
							write_hex1( o1 );
							write_hex1( 0x1E );
							valFind=Find.OK;
							break;
						case 147:	//	SLA r							//??	SLA	r
							write_hex1( 0xCB );
							write_hex1( 0b00100000|(g_r[o1]<<0) );
							valFind=Find.OK;
							break;
						case 148:	//	SLA (HL)
							write_hex1( 0xCB );
							write_hex1( 0x26 );
							valFind=Find.OK;
							break;
						case 149:	//	SLA (IX+d)
							write_hex1( 0xDD );
							write_hex1( 0xCB );
							write_hex1( o1 );
							write_hex1( 0x26 );
							valFind=Find.OK;
							break;
						case 150:	//	SLA (IY+d)
							write_hex1( 0xFD );
							write_hex1( 0xCB );
							write_hex1( o1 );
							write_hex1( 0x26 );
							valFind=Find.OK;
							break;
						case 151:	//	SRA r							//??	SRA	r
							write_hex1( 0xCB );
							write_hex1( 0b00101000|(g_r[o1]<<0) );
							valFind=Find.OK;
							break;
						case 152:	//	SRA (HL)
							write_hex1( 0xCB );
							write_hex1( 0x2E );
							valFind=Find.OK;
							break;
						case 153:	//	SRA (IX+d)
							write_hex1( 0xDD );
							write_hex1( 0xCB );
							write_hex1( o1 );
							write_hex1( 0x2E );
							valFind=Find.OK;
							break;
						case 154:	//	SRA (IY+d)
							write_hex1( 0xFD );
							write_hex1( 0xCB );
							write_hex1( o1 );
							write_hex1( 0x2E );
							valFind=Find.OK;
							break;
						case 155:	//	SRL r
							write_hex1( 0xCB );
							write_hex1( 0b00111000|(g_r[o1]<<0) );
							valFind=Find.OK;
							break;
						case 156:	//	SRL (HL)
							write_hex1( 0xCB );
							write_hex1( 0x3E );
							valFind=Find.OK;
							break;
						case 157:	//	SRL (IX+d)
							write_hex1( 0xDD );
							write_hex1( 0xCB );
							write_hex1( o1 );
							write_hex1( 0x3E );
							valFind=Find.OK;
							break;
						case 158:	//	SRL (IY+d)
							write_hex1( 0xFD );
							write_hex1( 0xCB );
							write_hex1( o1 );
							write_hex1( 0x3E );
							valFind=Find.OK;
							break;
						case 159:	//	RLD
							write_hex1( 0xED );
							write_hex1( 0x6F );
							valFind=Find.OK;
							break;
						case 160:	//	RRD
							write_hex1( 0xED );
							write_hex1( 0x67 );
							valFind=Find.OK;
							break;
						case 161:	//	BIT b,r
							write_hex1( 0xCB );
							write_hex1( 0x40|(o1<<3)|g_r[o2] );
							valFind=Find.OK;
							break;
						case 162:	//	BIT b,(HL)
							write_hex1( 0xCB );
							write_hex1( 0x46|(o1<<3)|g_r[o2] );
							valFind=Find.OK;
							break;
						case 163:	//	BIT b,(IX+d)
							write_hex1( 0xDD );
							write_hex1( 0xCB );
							write_hex1( o2 );
							write_hex1( 0b01000110|(o1<<3) );
							valFind=Find.OK;
							break;
						case 164:	//	BIT b,(IY+d)
							write_hex1( 0xFD );
							write_hex1( 0xCB );
							write_hex1( o2 );
							write_hex1( 0b01000110|(o1<<3) );
							valFind=Find.OK;
							break;
						case 165:	//	SET b,r
							write_hex1( 0xCB );
							write_hex1( 0b11000000|(o1<<3)|g_r[o2] );
							valFind=Find.OK;
							break;
						case 166:	//	SET b,(HL)
							write_hex1( 0xCB );
							write_hex1( 0b11000110|(o1<<3) );
							valFind=Find.OK;
							break;
						case 167:	//	SET b,(IX+d)
							write_hex1( 0xDD );
							write_hex1( 0xCB );
							write_hex1( o2 );
							write_hex1( 0b11000110|(o1<<3) );
							valFind=Find.OK;
							break;
						case 168:	//	SET b,(IY+d)
							write_hex1( 0xFD );
							write_hex1( 0xCB );
							write_hex1( o2 );
							write_hex1( 0b11000110|(o1<<3) );
							valFind=Find.OK;
							break;
						case 169:	//	RES b,r
							write_hex1( 0xCB );
							write_hex1( 0b10000000|(o1<<3)|g_r[o2] );
							valFind=Find.OK;
							break;
						case 170:	//	RES b,(HL)
							write_hex1( 0xCB );
							write_hex1( 0b10000110|(o1<<3) );
							valFind=Find.OK;
							break;
						case 171:	//	RES b,(IX+d)
							write_hex1( 0xDD );
							write_hex1( 0xCB );
							write_hex1( o2 );
							write_hex1( 0b10000110|(o1<<3) );
							valFind=Find.OK;
							break;
						case 172:	//	RES b,(IY+d)
							write_hex1( 0xFD );
							write_hex1( 0xCB );
							write_hex1( o2 );
							write_hex1( 0b10000110|(o1<<3) );
							valFind=Find.OK;
							break;
						case 173:	//	JP nn
							write_hex1( 0xC3 );
							o1=cnvLabels2Dec(o1);
							write_hex1( (o1   )&0xff );
							write_hex1( (o1>>8)&0xff );
							valFind=Find.OK;
							break;
						case 174:	//	JP cc,nn
							write_hex1( 0b11000010|(g_cc[o1]<<3) );
							o2=cnvLabels2Dec(o2);
							write_hex1( (o2   )&0xff );
							write_hex1( (o2>>8)&0xff );
							valFind=Find.OK;
							break;
						case 175:	//	JR e
							write_hex1( 0x18 );
							o1 = cnvLabels2Dec( o1 ) -g_cntAddress-1;
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 176:	//	JR C,e
							write_hex1( 0x38 );
							if ( !o1.toString().isDigit() ) 
							o1 = cnvLabels2Dec( o1 ) -g_cntAddress-1;
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 177:	//	JR NC,e
							write_hex1( 0x30 );
							if ( !o1.toString().isDigit() ) 
							o1 = cnvLabels2Dec( o1 ) -g_cntAddress-1;
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 178:	//	JR Z,e
							write_hex1( 0x28 );
							if ( !o1.toString().isDigit() ) 
							o1 = cnvLabels2Dec( o1 ) -g_cntAddress-1;
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 179:	//	JR NZ,e
							write_hex1( 0x20 );
							if ( !o1.toString().isDigit() ) 
							o1 = cnvLabels2Dec( o1 ) -g_cntAddress-1;
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 180:	//	JP (HL)
							write_hex1( 0xE9 );
							valFind=Find.OK;
							break;
						case 181:	//	JP (IX)
							write_hex1( 0xDD );
							write_hex1( 0xE9 );
							valFind=Find.OK;
							break;
						case 182:	//	JP (IY)
							write_hex1( 0xFD );
							write_hex1( 0xE9 );
							valFind=Find.OK;
							break;
						case 183:	//	DJNZ e
							write_hex1( 0x10 );
							if ( !o1.toString().isDigit() ) 
							{
								if ( (o1=g_tblLabelcode[o1])==undefined ) break;
								o1=o1-g_cntAddress-1;
							}
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 184:	//	CALL nn
							write_hex1( 0xCD );
							if ( !o1.toString().isDigit() ) if ( (o1=g_tblLabelcode[o1])==undefined ) break;
							o1=cnvLabels2Dec(o1);
							write_hex1( (o1   )&0xff );
							write_hex1( (o1>>8)&0xff );
							valFind=Find.OK;
							break;
						case 185:	//	CALL cc,nn
							write_hex1( 0b11000100|(g_cc[o1]<<3) );
							if ( !o2.toString().isDigit() ) if ( (o2=g_tblLabelcode[o2])==undefined ) break;
							o2=cnvLabels2Dec(o2);
							write_hex1( (o2   )&0xff );
							write_hex1( (o2>>8)&0xff );
							valFind=Find.OK;
							break;
						case 186:	//	RET
							write_hex1( 0xC9 );
							valFind=Find.OK;
							break;
						case 187:	//	RET cc
							write_hex1( 0b11000000|(g_cc[o1]<<3) );
							valFind=Find.OK;
							break;
						case 188:	//	RETI
							write_hex1( 0xED );
							write_hex1( 0x4D );
							valFind=Find.OK;
							break;
						case 189:	//	RETN
							write_hex1( 0xED );
							write_hex1( 0x45 );
							valFind=Find.OK;
							break;
						case 190:	//	RST p

							write_hex1( g_p[o1] );
							valFind=Find.OK;
							break;
						case 191:	//	IN A,(n)
							write_hex1( 0xDB );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 192:	//	IN r,(C)
							write_hex1( 0xED );
							write_hex1( 0b01000000|(g_r[o1]<<3) );
							valFind=Find.OK;
							break;
						case 193:	//	INI
							write_hex1( 0xED );
							write_hex1( 0xA2 );
							valFind=Find.OK;
							break;
						case 194:	//	INIR
							write_hex1( 0xED );
							write_hex1( 0xB2 );
							valFind=Find.OK;
							break;
						case 195:	//	IND
							write_hex1( 0xED );
							write_hex1( 0xAA );
							valFind=Find.OK;
							break;
						case 196:	//	INDR
							write_hex1( 0xED );
							write_hex1( 0xBA );
							valFind=Find.OK;
							break;
						case 197:	//	OUT (n),A
							write_hex1( 0xD3 );
							write_hex1( o1 );
							valFind=Find.OK;
							break;
						case 198:	//	OUT (C),r
							write_hex1( 0xED );
							write_hex1( 0b01000001|(g_r[o2]<<3) );
							valFind=Find.OK;
							break;
						case 199:	//	OUTI
							write_hex1( 0xED );
							write_hex1( 0xA3 );
							valFind=Find.OK;
							break;
						case 200:	//	OUTIR
							write_hex1( 0xED );
							write_hex1( 0xB3 );
							valFind=Find.OK;
							break;
						case 201:	//	OUTD
							write_hex1( 0xED );
							write_hex1( 0xAB );
							valFind=Find.OK;
							break;
						case 202:	//	OUTDR
							write_hex1( 0xED );
							write_hex1( 0xBB );
							valFind=Find.OK;
							break;

						//擬似コード
						case 203://LABEL
							{
								let ofs = g_tblLabelcode["ORG"];
								g_tblLabelcode[o1]=g_cntAddress + ofs;
							}
							valFind=Find.OK;
							break;

						case 204://EQU
							g_tblLabelcode[o1]=o2;
							valFind=Find.OK;
							break;

						case 205://ORG
							o1 = cnvLabels2Dec(o1);
							g_tblLabelcode["ORG"]=o1;
							valFind=Find.OK;
							break;

						}

						break;
					}
				}
			}

			if ( g_flgAssemble ) // コマンドとHEXの比較出力。デバッグ用
			{
				{
					let strcmd = "";
					let ofs = g_tblLabelcode["ORG"];
					let len = g_tblCode.length-stCmdHex;
					
					const wdt = 4;
					for ( let i = 0 ; i < Math.floor(len/wdt+1)*wdt  ; i++ )
					{
						let data = g_tblCode[ stCmdHex+i ];

						if ( (i%wdt) == 0 )			// アドレス表示
						{
							if ( i>0 ) strcmd += "\n";
							strcmd += (stCmdHex+ofs+i).toHex(4)+" ";
						}

						if ( data == undefined ) 	// 空白表示
						{
							strcmd += "   ";
						}
						else						// データ表示
						{
							strcmd += data.toHex(2) + " ";
						}
						if ( i == wdt-1 )			// 命令表示
						{
							strcmd += ""+str;
						}
		
					}
					g_tblCmdHex.push( strcmd + "\n");
				}

			}
			
			if ( g_flgAssemble )
			{
				if ( valFind==Find.UDLabel ) 
				{
					document.getElementById("dst").value += "Error1("+i+") " +"p=("+p+") " + str +"\n";
					g_cntErr++;
				}
				if ( valFind==Find.None ) 
				{
					document.getElementById("dst").value += "Syntax Error("+i+")> " + str +"\n";
					g_cntErr++;
				}
			}

		}


    }
    
//HTMLとのやり取り関連
//-----------------------------------------------------------------------------
function html_radio_click()
//-----------------------------------------------------------------------------
{
	var list = document.getElementsByName( "html_radio" ) ;

	for ( let i = 0 ; i < list.length; i++ ) 
	{
		if ( list[i].checked ) 
		{
			g_outputmode = list[i].value;
			break;
		}
	}
}
//-----------------------------------------------------------------------------
window.onload = function()
//-----------------------------------------------------------------------------
{
	html_radio_click();
//	g_outputmode = 4;
	if ( 1)
	{
		document.getElementById("src").value ="; Z80 smaple\n";
		document.getElementById("src").value +="	ORG 1000h"+"\n";
		document.getElementById("src").value +="	jp main"+"\n";
		document.getElementById("src").value +="	DEFB 1,2,3,4,5,6,7,8,9,ah"+"\n";
		document.getElementById("src").value +="	nop"+"\n";
		document.getElementById("src").value +=""+"\n";
		document.getElementById("src").value +="val	EQU	1"+"\n";
		document.getElementById("src").value +="	DEFB ffh"+"\n";
		document.getElementById("src").value +="main:"+"\n";
		document.getElementById("src").value +="	ld a,val"+"\n";
		document.getElementById("src").value +="	ld a,(label)"+"\n";
		document.getElementById("src").value +="	ld a,(10)"+"\n";
		document.getElementById("src").value +="	ld a,(10h)"+"\n";
		document.getElementById("src").value +="	jp main"+"\n";
		document.getElementById("src").value +="label:"+"\n";
	}

	assemble(1);
	
}
