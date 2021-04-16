	; テストコード sample1
d8	EQU	1
	nop
e:
n:
nn:
p:
	NOP
	LD BC,nn
	LD (BC),A
	INC BC
	INC B
	DEC B
	LD B,n
	RLCA
	EX AF,AF'
	ADD HL,BC
	LD A,(BC)
	DEC BC
	INC C
	DEC C
	LD C,n
	RRCA
	DJNZ e
	LD DE,nn
	LD (DE),A
	INC DE
	INC D
	DEC D
	LD D,n
	RLA
	JR e
	ADD HL,DE
	LD A,(DE)
	DEC DE
	INC E
	DEC E
	LD E,n
	RRA
	JR NZ,e
	LD HL,nn
	LD (nn),HL
	INC HL
	INC H
	DEC H
	LD H,n
	DAA
	JR Z,e
	ADD HL,HL
	LD HL,(nn)
	DEC HL
	INC L
	DEC L
	LD L,n
	CPL
	JR NC,e
	LD SP,nn
	LD (nn),A
	INC SP
	INC (HL)
	DEC (HL)
	LD (HL),n
	SCF
	JR C,e
	ADD HL,SP
	LD A,(nn)
	DEC SP
	INC A
	DEC A
	LD A,n
	CCF
	LD B,B
	LD B,C
	LD B,D
	LD B,E
	LD B,H
	LD B,L
	LD B,(HL)
	LD B,A
	LD C,B
	LD C,C
	LD C,D
	LD C,E
	LD C,H
	LD C,L
	LD C,(HL)
	LD C,A
	LD D,B
	LD D,C
	LD D,D
	LD D,E
	LD D,H
	LD D,L
	LD D,(HL)
	LD D,A
	LD E,B
	LD E,C
	LD E,D
	LD E,E
	LD E,H
	LD E,L
	LD E,(HL)
	LD E,A
	LD H,B
	LD H,C
	LD H,D
	LD H,E
	LD H,H
	LD H,L
	LD H,(HL)
	LD H,A
	LD L,B
	LD L,C
	LD L,D
	LD L,E
	LD L,H
	LD L,L
	LD L,(HL)
	LD L,A
	LD (HL),B
	LD (HL),C
	LD (HL),D
	LD (HL),E
	LD (HL),H
	LD (HL),L
	HALT
	LD (HL),A
	LD A,B
	LD A,C
	LD A,D
	LD A,E
	LD A,H
	LD A,L
	LD A,(HL)
	LD A,A
	ADD A,B
	ADD A,C
	ADD A,D
	ADD A,E
	ADD A,H
	ADD A,L
	ADD A,(HL)
	ADD A,A
	ADC A,B
	ADC A,C
	ADC A,D
	ADC A,E
	ADC A,H
	ADC A,L
	ADC A,(HL)
	ADC A,A
	SUB B
	SUB C
	SUB D
	SUB E
	SUB H
	SUB L
	SUB (HL)
	SUB A
	SBC A,B
	SBC A,C
	SBC A,D
	SBC A,E
	SBC A,H
	SBC A,L
	SBC A,(HL)
	SBC A,A
	AND B
	AND C
	AND D
	AND E
	AND H
	AND L
	AND (HL)
	AND A
	XOR B
	XOR C
	XOR D
	XOR E
	XOR H
	XOR L
	XOR (HL)
	XOR A
	OR B
	OR C
	OR D
	OR E
	OR H
	OR L
	OR (HL)
	OR A
	CP B
	CP C
	CP D
	CP E
	CP H
	CP L
	CP (HL)
	CP A
	RET NZ
	POP BC
	JP NZ,nn
	JP nn
	CALL NZ,nn
	PUSH BC
	ADD A,n
	RST 00H
	RET Z
	RET
	JP Z,nn
	RLC B
	RLC C
	RLC D
	RLC E
	RLC H
	RLC L
	RLC (HL)
	RLC A
	RRC B
	RRC C
	RRC D
	RRC E
	RRC H
	RRC L
	RRC (HL)
	RRC A
	RL B
	RL C
	RL D
	RL E
	RL H
	RL L
	RL (HL)
	RL A
	RR B
	RR C
	RR D
	RR E
	RR H
	RR L
	RR (HL)
	RR A
	SLA B
	SLA C
	SLA D
	SLA E
	SLA H
	SLA L
	SLA (HL)
	SLA A
	SRA B
	SRA C
	SRA D
	SRA E
	SRA H
	SRA L
	SRA (HL)
	SRA A
	;SLL B  ;Z80未定義
	;SLL C  ;Z80未定義
	;SLL D  ;Z80未定義
	;SLL E  ;Z80未定義
	;SLL H  ;Z80未定義
	;SLL L  ;Z80未定義
	;SLL (HL)  ;Z80未定義
	;SLL A  ;Z80未定義
	SRL B
	SRL C
	SRL D
	SRL E
	SRL H
	SRL L
	SRL (HL)
	SRL A
	BIT 0,B
	BIT 0,C
	BIT 0,D
	BIT 0,E
	BIT 0,H
	BIT 0,L
	BIT 0,(HL)
	BIT 0,A
	BIT 1,B
	BIT 1,C
	BIT 1,D
	BIT 1,E
	BIT 1,H
	BIT 1,L
	BIT 1,(HL)
	BIT 1,A
	BIT 2,B
	BIT 2,C
	BIT 2,D
	BIT 2,E
	BIT 2,H
	BIT 2,L
	BIT 2,(HL)
	BIT 2,A
	BIT 3,B
	BIT 3,C
	BIT 3,D
	BIT 3,E
	BIT 3,H
	BIT 3,L
	BIT 3,(HL)
	BIT 3,A
	BIT 4,B
	BIT 4,C
	BIT 4,D
	BIT 4,E
	BIT 4,H
	BIT 4,L
	BIT 4,(HL)
	BIT 4,A
	BIT 5,B
	BIT 5,C
	BIT 5,D
	BIT 5,E
	BIT 5,H
	BIT 5,L
	BIT 5,(HL)
	BIT 5,A
	BIT 6,B
	BIT 6,C
	BIT 6,D
	BIT 6,E
	BIT 6,H
	BIT 6,L
	BIT 6,(HL)
	BIT 6,A
	BIT 7,B
	BIT 7,C
	BIT 7,D
	BIT 7,E
	BIT 7,H
	BIT 7,L
	BIT 7,(HL)
	BIT 7,A
	RES 0,B
	RES 0,C
	RES 0,D
	RES 0,E
	RES 0,H
	RES 0,L
	RES 0,(HL)
	RES 0,A
	RES 1,B
	RES 1,C
	RES 1,D
	RES 1,E
	RES 1,H
	RES 1,L
	RES 1,(HL)
	RES 1,A
	RES 2,B
	RES 2,C
	RES 2,D
	RES 2,E
	RES 2,H
	RES 2,L
	RES 2,(HL)
	RES 2,A
	RES 3,B
	RES 3,C
	RES 3,D
	RES 3,E
	RES 3,H
	RES 3,L
	RES 3,(HL)
	RES 3,A
	RES 4,B
	RES 4,C
	RES 4,D
	RES 4,E
	RES 4,H
	RES 4,L
	RES 4,(HL)
	RES 4,A
	RES 5,B
	RES 5,C
	RES 5,D
	RES 5,E
	RES 5,H
	RES 5,L
	RES 5,(HL)
	RES 5,A
	RES 6,B
	RES 6,C
	RES 6,D
	RES 6,E
	RES 6,H
	RES 6,L
	RES 6,(HL)
	RES 6,A
	RES 7,B
	RES 7,C
	RES 7,D
	RES 7,E
	RES 7,H
	RES 7,L
	RES 7,(HL)
	RES 7,A
	SET 0,B
	SET 0,C
	SET 0,D
	SET 0,E
	SET 0,H
	SET 0,L
	SET 0,(HL)
	SET 0,A
	SET 1,B
	SET 1,C
	SET 1,D
	SET 1,E
	SET 1,H
	SET 1,L
	SET 1,(HL)
	SET 1,A
	SET 2,B
	SET 2,C
	SET 2,D
	SET 2,E
	SET 2,H
	SET 2,L
	SET 2,(HL)
	SET 2,A
	SET 3,B
	SET 3,C
	SET 3,D
	SET 3,E
	SET 3,H
	SET 3,L
	SET 3,(HL)
	SET 3,A
	SET 4,B
	SET 4,C
	SET 4,D
	SET 4,E
	SET 4,H
	SET 4,L
	SET 4,(HL)
	SET 4,A
	SET 5,B
	SET 5,C
	SET 5,D
	SET 5,E
	SET 5,H
	SET 5,L
	SET 5,(HL)
	SET 5,A
	SET 6,B
	SET 6,C
	SET 6,D
	SET 6,E
	SET 6,H
	SET 6,L
	SET 6,(HL)
	SET 6,A
	SET 7,B
	SET 7,C
	SET 7,D
	SET 7,E
	SET 7,H
	SET 7,L
	SET 7,(HL)
	SET 7,A
	CALL Z,nn
	CALL nn
	ADC A,n
	RST 08H
	RET NC
	POP DE
	JP NC,nn
	OUT (p),A
	CALL NC,nn
	PUSH DE
	SUB n
	RST 10H
	RET C
	EXX
	JP C,nn
	IN A,(p)
	CALL C,nn
	ADD IX,BC
	ADD IX,DE
	LD IX,nn
	LD (nn),IX
	INC IX
	;INC IXH  ;Z80未定義
	;DEC IXH  ;Z80未定義
	;LD IXH,n ;Z80未定義
	LD IX,(nn)
	DEC IX
	;INC IXL  ;Z80未定義
	;DEC IXL  ;Z80未定義
	;LD IXL,n ;Z80未定義
	INC (IX+d8)
	DEC (IX+d8)
	LD (IX+d8),n
	ADD IX,SP
	;LD B,IXH ;Z80未定義
	;LD B,IXL ;Z80未定義
	LD B,(IX+d8)
	;LD C,IXH ;Z80未定義
	;LD C,IXL ;Z80未定義
	LD C,(IX+d8)
	;LD D,IXH ;Z80未定義
	;LD D,IXL ;Z80未定義
	LD D,(IX+d8)
	;LD E,IXH ;Z80未定義
	;LD E,IXL ;Z80未定義
	LD E,(IX+d8)
	;LD IXH,B ;Z80未定義
	;LD IXH,C ;Z80未定義
	;LD IXH,D ;Z80未定義
	;LD IXH,E ;Z80未定義
	;LD IXH,H ;Z80未定義
	;LD IXH,L ;Z80未定義
	LD H,(IX+d8)
	;LD IXH,A ;Z80未定義
	;LD IXL,B ;Z80未定義
	;LD IXL,C ;Z80未定義
	;LD IXL,D ;Z80未定義
	;LD IXL,E ;Z80未定義
	;LD IXL,H ;Z80未定義
	;LD IXL,L ;Z80未定義
	LD L,(IX+d8)
	;LD IXL,A ;Z80未定義
	LD (IX+d8),B
	LD (IX+d8),C
	LD (IX+d8),D
	LD (IX+d8),E
	LD (IX+d8),H
	LD (IX+d8),L
	LD (IX+d8),A
	;LD A,IXH ;Z80未定義
	;LD A,IXL ;Z80未定義
	LD A,(IX+d8)
	;ADD A,IXH ;Z80未定義
	;ADD A,IXL ;Z80未定義
	ADD A,(IX+d8)
	;ADC A,IXH ;Z80未定義
	;ADC A,IXL ;Z80未定義
	ADC A,(IX+d8)
	;SUB A,IXH ;Z80未定義
	;SUB A,IXL ;Z80未定義
	SUB (IX+d8)
	;SBC A,IXH ;Z80未定義
	;SBC A,IXL ;Z80未定義
	SBC A,(IX+d8)
	;AND IXH  ;Z80未定義
	;AND IXL  ;Z80未定義
	AND (IX+d8)
	;XOR IXH  ;Z80未定義
	;XOR IXL  ;Z80未定義
	XOR (IX+d8)
	;OR IXH  ;Z80未定義
	;OR IXL  ;Z80未定義
	OR (IX+d8)
	;CP IXH  ;Z80未定義
	;CP IXL  ;Z80未定義
	CP (IX+d8)
	;RLC (IX+d8),B ;Z80未定義
	;RLC (IX+d8),C ;Z80未定義
	;RLC (IX+d8),D ;Z80未定義
	;RLC (IX+d8),E ;Z80未定義
	;RLC (IX+d8),H ;Z80未定義
	;RLC (IX+d8),L ;Z80未定義
	RLC (IX+d8)
	;RLC (IX+d8),A ;Z80未定義
	;RLC (IX+d8),B ;Z80未定義
	;RRC (IX+d8),C ;Z80未定義
	;RRC (IX+d8),D ;Z80未定義
	;RRC (IX+d8),E ;Z80未定義
	;RRC (IX+d8),H ;Z80未定義
	;RRC (IX+d8),L ;Z80未定義
	RRC (IX+d8)
	;RRC (IX+d8),A ;Z80未定義
	;RL (IX+d8),B ;Z80未定義
	;RL (IX+d8),C ;Z80未定義
	;RL (IX+d8),D ;Z80未定義
	;RL (IX+d8),E ;Z80未定義
	;RL (IX+d8),H ;Z80未定義
	;RL (IX+d8),L ;Z80未定義
	RL (IX+d8)
	;RL (IX+d8),A ;Z80未定義
	;RR (IX+d8),B ;Z80未定義
	;RR (IX+d8),C ;Z80未定義
	;RR (IX+d8),D ;Z80未定義
	;RR (IX+d8),E ;Z80未定義
	;RR (IX+d8),H ;Z80未定義
	;RR (IX+d8),L ;Z80未定義
	RR (IX+d8)
	;RR (IX+d8),A ;Z80未定義
	;SLA (IX+d8),B ;Z80未定義
	;SLA (IX+d8),C ;Z80未定義
	;SLA (IX+d8),D ;Z80未定義
	;SLA (IX+d8),E ;Z80未定義
	;SLA (IX+d8),H ;Z80未定義
	;SLA (IX+d8),L ;Z80未定義
	SLA (IX+d8)
	;SLA (IX+d8),A ;Z80未定義
	;SRA (IX+d8),B ;Z80未定義
	;SRA (IX+d8),C ;Z80未定義
	;SRA (IX+d8),D ;Z80未定義
	;SRA (IX+d8),E ;Z80未定義
	;SRA (IX+d8),H ;Z80未定義
	;SRA (IX+d8),L ;Z80未定義
	SRA (IX+d8)
	;SRA (IX+d8),A ;Z80未定義
	;SLL (IX+d8),B ;Z80未定義
	;SLL (IX+d8),C ;Z80未定義
	;SLL (IX+d8),D ;Z80未定義
	;SLL (IX+d8),E ;Z80未定義
	;SLL (IX+d8),H ;Z80未定義
	;SLL (IX+d8),L ;Z80未定義
	;SLL (IX+d8)  ;Z80未定義
	;SLL (IX+d8),A ;Z80未定義
	;SRL (IX+d8),B ;Z80未定義
	;SRL (IX+d8),C ;Z80未定義
	;SRL (IX+d8),D ;Z80未定義
	;SRL (IX+d8),E ;Z80未定義
	;SRL (IX+d8),H ;Z80未定義
	;SRL (IX+d8),L ;Z80未定義
	SRL (IX+d8)
	;SRL (IX+d8),A ;Z80未定義
	;SLL (IX+d8),B ;Z80未定義
	;BIT 0,(IX+d8) ;Z80未定義
	;BIT 0,(IX+d8) ;Z80未定義
	;BIT 0,(IX+d8) ;Z80未定義
	;BIT 0,(IX+d8) ;Z80未定義
	;BIT 0,(IX+d8) ;Z80未定義
	BIT 0,(IX+d8)
	;BIT 0,(IX+d8) ;Z80未定義
	;BIT 1,(IX+d8) ;Z80未定義
	;BIT 1,(IX+d8) ;Z80未定義
	;BIT 1,(IX+d8) ;Z80未定義
	;BIT 1,(IX+d8) ;Z80未定義
	;BIT 1,(IX+d8) ;Z80未定義
	;BIT 1,(IX+d8) ;Z80未定義
	BIT 1,(IX+d8)
	;BIT 1,(IX+d8) ;Z80未定義
	;BIT 2,(IX+d8) ;Z80未定義
	;BIT 2,(IX+d8) ;Z80未定義
	;BIT 2,(IX+d8) ;Z80未定義
	;BIT 2,(IX+d8) ;Z80未定義
	;BIT 2,(IX+d8) ;Z80未定義
	;BIT 2,(IX+d8) ;Z80未定義
	BIT 2,(IX+d8)
	;BIT 2,(IX+d8) ;Z80未定義
	;BIT 3,(IX+d8) ;Z80未定義
	;BIT 3,(IX+d8) ;Z80未定義
	;BIT 3,(IX+d8) ;Z80未定義
	;BIT 3,(IX+d8) ;Z80未定義
	;BIT 3,(IX+d8) ;Z80未定義
	;BIT 3,(IX+d8) ;Z80未定義
	BIT 3,(IX+d8)
	;BIT 3,(IX+d8) ;Z80未定義
	;BIT 4,(IX+d8) ;Z80未定義
	;BIT 4,(IX+d8) ;Z80未定義
	;BIT 4,(IX+d8) ;Z80未定義
	;BIT 4,(IX+d8) ;Z80未定義
	;BIT 4,(IX+d8) ;Z80未定義
	;BIT 4,(IX+d8) ;Z80未定義
	BIT 4,(IX+d8)
	;BIT 4,(IX+d8) ;Z80未定義
	;BIT 5,(IX+d8) ;Z80未定義
	;BIT 5,(IX+d8) ;Z80未定義
	;BIT 5,(IX+d8) ;Z80未定義
	;BIT 5,(IX+d8) ;Z80未定義
	;BIT 5,(IX+d8) ;Z80未定義
	;BIT 5,(IX+d8) ;Z80未定義
	BIT 5,(IX+d8)
	;BIT 5,(IX+d8) ;Z80未定義
	;BIT 6,(IX+d8) ;Z80未定義
	;BIT 6,(IX+d8) ;Z80未定義
	;BIT 6,(IX+d8) ;Z80未定義
	;BIT 6,(IX+d8) ;Z80未定義
	;BIT 6,(IX+d8) ;Z80未定義
	;BIT 6,(IX+d8) ;Z80未定義
	BIT 6,(IX+d8)
	;BIT 6,(IX+d8) ;Z80未定義
	;BIT 7,(IX+d8) ;Z80未定義
	;BIT 7,(IX+d8) ;Z80未定義
	;BIT 7,(IX+d8) ;Z80未定義
	;BIT 7,(IX+d8) ;Z80未定義
	;BIT 7,(IX+d8) ;Z80未定義
	;BIT 7,(IX+d8) ;Z80未定義
	BIT 7,(IX+d8)
	;BIT 7,(IX+d8) ;Z80未定義
	;RES 0,(IX+d8),B ;Z80未定義
	;RES 0,(IX+d8),C ;Z80未定義
	;RES 0,(IX+d8),D ;Z80未定義
	;RES 0,(IX+d8),E ;Z80未定義
	;RES 0,(IX+d8),H ;Z80未定義
	;RES 0,(IX+d8),L ;Z80未定義
	RES 0,(IX+d8)
	;RES 0,(IX+d8),A ;Z80未定義
	;RES 1,(IX+d8),B ;Z80未定義
	;RES 1,(IX+d8),C ;Z80未定義
	;RES 1,(IX+d8),D ;Z80未定義
	;RES 1,(IX+d8),E ;Z80未定義
	;RES 1,(IX+d8),H ;Z80未定義
	;RES 1,(IX+d8),L ;Z80未定義
	RES 1,(IX+d8)
	;RES 1,(IX+d8),A ;Z80未定義
	;RES 2,(IX+d8),B ;Z80未定義
	;RES 2,(IX+d8),C ;Z80未定義
	;RES 2,(IX+d8),D ;Z80未定義
	;RES 2,(IX+d8),E ;Z80未定義
	;RES 2,(IX+d8),H ;Z80未定義
	;RES 2,(IX+d8),L ;Z80未定義
	RES 2,(IX+d8)
	;RES 2,(IX+d8),A ;Z80未定義
	;RES 3,(IX+d8),B ;Z80未定義
	;RES 3,(IX+d8),C ;Z80未定義
	;RES 3,(IX+d8),D ;Z80未定義
	;RES 3,(IX+d8),E ;Z80未定義
	;RES 3,(IX+d8),H ;Z80未定義
	;RES 3,(IX+d8),L ;Z80未定義
	RES 3,(IX+d8)
	;RES 3,(IX+d8),A ;Z80未定義
	;RES 4,(IX+d8),B ;Z80未定義
	;RES 4,(IX+d8),C ;Z80未定義
	;RES 4,(IX+d8),D ;Z80未定義
	;RES 4,(IX+d8),E ;Z80未定義
	;RES 4,(IX+d8),H ;Z80未定義
	;RES 4,(IX+d8),L ;Z80未定義
	RES 4,(IX+d8)
	;RES 4,(IX+d8),A ;Z80未定義
	;RES 5,(IX+d8),B ;Z80未定義
	;RES 5,(IX+d8),C ;Z80未定義
	;RES 5,(IX+d8),D ;Z80未定義
	;RES 5,(IX+d8),E ;Z80未定義
	;RES 5,(IX+d8),H ;Z80未定義
	;RES 5,(IX+d8),L ;Z80未定義
	RES 5,(IX+d8)
	;RES 5,(IX+d8),A ;Z80未定義
	;RES 6,(IX+d8),B ;Z80未定義
	;RES 6,(IX+d8),C ;Z80未定義
	;RES 6,(IX+d8),D ;Z80未定義
	;RES 6,(IX+d8),E ;Z80未定義
	;RES 6,(IX+d8),H ;Z80未定義
	;RES 6,(IX+d8),L ;Z80未定義
	RES 6,(IX+d8)
	;RES 6,(IX+d8),A ;Z80未定義
	;RES 7,(IX+d8),B ;Z80未定義
	;RES 7,(IX+d8),C ;Z80未定義
	;RES 7,(IX+d8),D ;Z80未定義
	;RES 7,(IX+d8),E ;Z80未定義
	;RES 7,(IX+d8),H ;Z80未定義
	;RES 7,(IX+d8),L ;Z80未定義
	RES 7,(IX+d8)
	;RES 7,(IX+d8),A ;Z80未定義
	;SET 0,(IX+d8),B ;Z80未定義
	;SET 0,(IX+d8),C ;Z80未定義
	;SET 0,(IX+d8),D ;Z80未定義
	;SET 0,(IX+d8),E ;Z80未定義
	;SET 0,(IX+d8),H ;Z80未定義
	;SET 0,(IX+d8),L ;Z80未定義
	SET 0,(IX+d8)
	;SET 0,(IX+d8),A ;Z80未定義
	;SET 1,(IX+d8),B ;Z80未定義
	;SET 1,(IX+d8),C ;Z80未定義
	;SET 1,(IX+d8),D ;Z80未定義
	;SET 1,(IX+d8),E ;Z80未定義
	;SET 1,(IX+d8),H ;Z80未定義
	;SET 1,(IX+d8),L ;Z80未定義
	SET 1,(IX+d8)
	;SET 1,(IX+d8),A ;Z80未定義
	;SET 2,(IX+d8),B ;Z80未定義
	;SET 2,(IX+d8),C ;Z80未定義
	;SET 2,(IX+d8),D ;Z80未定義
	;SET 2,(IX+d8),E ;Z80未定義
	;SET 2,(IX+d8),H ;Z80未定義
	;SET 2,(IX+d8),L ;Z80未定義
	SET 2,(IX+d8)
	;SET 2,(IX+d8),A ;Z80未定義
	;SET 3,(IX+d8),B ;Z80未定義
	;SET 3,(IX+d8),C ;Z80未定義
	;SET 3,(IX+d8),D ;Z80未定義
	;SET 3,(IX+d8),E ;Z80未定義
	;SET 3,(IX+d8),H ;Z80未定義
	;SET 3,(IX+d8),L ;Z80未定義
	SET 3,(IX+d8)
	;SET 3,(IX+d8),A ;Z80未定義
	;SET 4,(IX+d8),B ;Z80未定義
	;SET 4,(IX+d8),C ;Z80未定義
	;SET 4,(IX+d8),D ;Z80未定義
	;SET 4,(IX+d8),E ;Z80未定義
	;SET 4,(IX+d8),H ;Z80未定義
	;SET 4,(IX+d8),L ;Z80未定義
	SET 4,(IX+d8)
	;SET 4,(IX+d8),A ;Z80未定義
	;SET 5,(IX+d8),B ;Z80未定義
	;SET 5,(IX+d8),C ;Z80未定義
	;SET 5,(IX+d8),D ;Z80未定義
	;SET 5,(IX+d8),E ;Z80未定義
	;SET 5,(IX+d8),H ;Z80未定義
	;SET 5,(IX+d8),L ;Z80未定義
	SET 5,(IX+d8)
	;SET 5,(IX+d8),A ;Z80未定義
	;SET 6,(IX+d8),B ;Z80未定義
	;SET 6,(IX+d8),C ;Z80未定義
	;SET 6,(IX+d8),D ;Z80未定義
	;SET 6,(IX+d8),E ;Z80未定義
	;SET 6,(IX+d8),H ;Z80未定義
	;SET 6,(IX+d8),L ;Z80未定義
	SET 6,(IX+d8)
	;SET 6,(IX+d8),A ;Z80未定義
	;SET 7,(IX+d8),B ;Z80未定義
	;SET 7,(IX+d8),C ;Z80未定義
	;SET 7,(IX+d8),D ;Z80未定義
	;SET 7,(IX+d8),E ;Z80未定義
	;SET 7,(IX+d8),H ;Z80未定義
	;SET 7,(IX+d8),L ;Z80未定義
	SET 7,(IX+d8)
	;SET 7,(IX+d8),A ;Z80未定義
	POP IX
	EX (SP),IX
	PUSH IX
	JP (IX)
	LD SP,IX
	SBC A,n
	RST 18H
	RET PO
	POP HL
	JP PO,nn
	EX (SP),HL
	CALL PO,nn
	PUSH HL
	AND n
	RST 20H
	RET PE
	JP (HL)
	JP PE,nn
	EX DE,HL
	CALL PE,nn
	;IN0 B,(n) ;HD64180
	;OUT0 (n),B ;HD64180
	;TST A,B ;HD64180
	;IN0 C,(n) ;HD64180
	;OUT0 (n),C ;HD64180
	;TST A,C ;HD64180
	;IN0 D,(n) ;HD64180
	;OUT0 (n),D ;HD64180
	;TST A,D ;HD64180
	;IN0 E,(n) ;HD64180
	;OUT0 (n),E ;HD64180
	;TST A,E ;HD64180
	;IN0 H,(n) ;HD64180
	;OUT0 (n),H ;HD64180
	;TST A,H ;HD64180
	;IN0 L,(n) ;HD64180
	;OUT0 (n),L ;HD64180
	;TST A,L ;HD64180
	;TST A,(HL) ;HD64180
	;IN0 A,(n) ;HD64180
	;OUT0 (n),A ;HD64180
	;TST A,A ;HD64180
	IN B,(C)
	OUT (C),B
	SBC HL,BC
	LD (nn),BC
	NEG
	RETN
	IM 0
	LD I,A
	IN C,(C)
	OUT (C),C
	ADC HL,BC
	LD BC,(nn)
	;MLT BC  ;HD64180
	RETI
	LD R,A
	IN D,(C)
	OUT (C),D
	SBC HL,DE
	LD (nn),DE
	IM 1
	LD A,I
	IN E,(C)
	OUT (C),E
	ADC HL,DE
	LD DE,(nn)
	;MLT DE  ;HD64180
	IM 2
	LD A,R
	IN H,(C)
	OUT (C),H
	SBC HL,HL
	LD (nn),HL
	;TST A,n ;HD64180
	LD HL,(nn)
	;MLT HL  ;HD64180
	RLD
	;IN F,(C) ;Z80未定義
	;OUT (C),0 ;Z80未定義
	SBC HL,SP
	LD (nn),SP
	;TSTIO (C),n ;HD64180
	;SLP  ;HD64180
	IN A,(C)
	OUT (C),A
	ADC HL,SP
	LD SP,(nn)
	;MLT SP  ;HD64180
	;OTIM  ;HD64180
	;OTDM  ;HD64180
	;OTIMR  ;HD64180
	;OTDMR  ;HD64180
	LDI
	CPI
	INI
	OUTI
	LDD
	CPD
	IND
	OUTD
	LDIR
	CPIR
	INIR
	OTIR
	LDDR
	CPDR
	INDR
	OTDR
	;MULUB A,B ;R800
	;MULUW HL,BC ;R800
	;MULUB A,C ;R800
	;MULUB A,D ;R800
	;MULUB A,E ;R800
	;MULUW HL,SP ;R800
	XOR n
	RST 28H
	RET P
	JP P,nn
	JP P,nn
	DI
	CALL P,nn
	PUSH AF
	OR n
	RST 30H
	RET M
	LD SP,HL
	JP M,nn

	CALL M,nn
	ADD IY,BC
	ADD IY,DE
	LD IY,nn
	LD (nn),IY
	INC IY
	;INC IYH  ;Z80未定義
	;DEC IYH  ;Z80未定義
	;LD IYH,n ;Z80未定義
	LD IY,(nn)
	DEC IY
	;INC IYL  ;Z80未定義
	;DEC IYL  ;Z80未定義
	;LD IYL,n ;Z80未定義
	INC (IY+d8)
	DEC (IY+d8)
	LD (IY+d8),n
	ADD IY,SP
	;LD B,IYH ;Z80未定義
	;LD B,IYL ;Z80未定義
	LD B,(IY+d8)
	;LD C,IYH ;Z80未定義
	;LD C,IYL ;Z80未定義
	LD C,(IY+d8)
	;LD D,IYH ;Z80未定義
	;LD D,IYL ;Z80未定義
	LD D,(IY+d8)
	;LD E,IYH ;Z80未定義
	;LD E,IYL ;Z80未定義
	LD E,(IY+d8)
	;LD IYH,B ;Z80未定義
	;LD IYH,C ;Z80未定義
	;LD IYH,D ;Z80未定義
	;LD IYH,E ;Z80未定義
	;LD IYH,H ;Z80未定義
	;LD IYH,L ;Z80未定義
	LD H,(IY+d8)
	;LD IYH,A ;Z80未定義
	;LD IYL,B ;Z80未定義
	;LD IYL,C ;Z80未定義
	;LD IYL,D ;Z80未定義
	;LD IYL,E ;Z80未定義
	;LD IYL,H ;Z80未定義
	;LD IYL,L ;Z80未定義
	LD L,(IY+d8)
	;LD IYL,A ;Z80未定義
	LD (IY+d8),B
	LD (IY+d8),C
	LD (IY+d8),D
	LD (IY+d8),E
	LD (IY+d8),H
	LD (IY+d8),L
	LD (IY+d8),A
	;LD A,IYH ;Z80未定義
	;LD A,IYL ;Z80未定義
	LD A,(IY+d8)
	;ADD A,IYH ;Z80未定義
	;ADD A,IYL ;Z80未定義
	ADD A,(IY+d8)
	;ADC A,IYH ;Z80未定義
	;ADC A,IYL ;Z80未定義
	ADC A,(IY+d8)
	;SUB A,IYH ;Z80未定義
	;SUB A,IYL ;Z80未定義
	SUB (IY+d8)
	;SBC A,IYH ;Z80未定義
	;SBC A,IYL ;Z80未定義
	SBC A,(IY+d8)
	;AND IYH  ;Z80未定義
	;AND IYL  ;Z80未定義
	AND (IY+d8)
	;XOR IYH  ;Z80未定義
	;XOR IYL  ;Z80未定義
	XOR (IY+d8)
	;OR IYH  ;Z80未定義
	;OR IYL  ;Z80未定義
	OR (IY+d8)
	;CP IYH  ;Z80未定義
	;CP IYL  ;Z80未定義
	CP (IY+d8)
	RLC (IY+d8)
	RRC (IY+d8)
	RL (IY+d8)
	RR (IY+d8)
	SLA (IY+d8)
	SRA (IY+d8)
	;SLL (IY+d8)  ;Z80未定義
	SRL (IY+d8)
	BIT 0,(IY+d8)
	BIT 1,(IY+d8)
	BIT 2,(IY+d8)
	BIT 3,(IY+d8)
	BIT 4,(IY+d8)
	BIT 5,(IY+d8)
	BIT 6,(IY+d8)
	BIT 7,(IY+d8)
	RES 0,(IY+d8)
	RES 1,(IY+d8)
	RES 2,(IY+d8)
	RES 3,(IY+d8)
	RES 4,(IY+d8)
	RES 5,(IY+d8)
	RES 6,(IY+d8)
	RES 7,(IY+d8)
	SET 0,(IY+d8)
	SET 1,(IY+d8)
	SET 2,(IY+d8)
	SET 3,(IY+d8)
	SET 4,(IY+d8)
	SET 5,(IY+d8)
	SET 6,(IY+d8)
	SET 7,(IY+d8)
	POP IY
	EX (SP),IY
	PUSH IY
	JP (IY)
	LD SP,IY
	CP n
	RST 38H
	END
