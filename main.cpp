make 
#include <stdio.h>
int main()
{
	float	g = 9.8;
	float	n = 1000;
	float	t = 1;
	float	dt = t/n;
	float	v = 0;
	float	x = 0;
	for ( float i = 0 ; i < n ; i++ )
	{
		v += g*dt;
		x += v*dt;
	}
	printf("gΔt^2    = %f\n",x);	
	float y = 1.0/2.0*g*t*t;
	printf("1/2*g*t^2 = %f\n",y);	
}
