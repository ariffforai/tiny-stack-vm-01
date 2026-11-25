import{readFileSync,mkdirSync,writeFileSync}from"node:fs";
function R(P,B){
let S=new Int32Array(257),C=new Int32Array(64),M=new Int32Array(256),U=new Uint8Array(65536);
let p=0,s=0,c=0,t=0,q=0,o=0,x,y,m,T=v=>[v,U.subarray(0,o)];
while(1){
if(t>=1e6)return T(10);
if(p<0||p>=P.length)return T(9);
let k=P[p],w=1;
t++;
switch(k){
case 0:return T(0);
case 1:if(p+1>=P.length)return T(9);w=2;m=P[p+1];if(m>127)m-=256;if(s>=256)return T(3);S[s++]=m;break;
case 2:if(p+4>=P.length)return T(9);w=5;m=P[p+1]|P[p+2]<<8|P[p+3]<<16|P[p+4]<<24;if(s>=256)return T(3);S[s++]=m;break;
case 3:if(s<1)return T(2);s--;break;
case 4:if(s<1)return T(2);if(s>=256)return T(3);S[s]=S[s-1];s++;break;
case 5:if(s<2)return T(2);x=S[s-1];S[s-1]=S[s-2];S[s-2]=x;break;
case 6:if(s<2)return T(2);if(s>=256)return T(3);S[s]=S[s-2];s++;break;
case 7:if(s<3)return T(2);x=S[s-3];S[s-3]=S[s-2];S[s-2]=S[s-1];S[s-1]=x;break;
case 16:if(s<2)return T(2);y=S[--s];x=S[--s];S[s++]=(x+y)|0;break;
case 17:if(s<2)return T(2);y=S[--s];x=S[--s];S[s++]=(x-y)|0;break;
case 18:if(s<2)return T(2);y=S[--s];x=S[--s];S[s++]=Math.imul(x,y);break;
case 19:if(s<2)return T(2);y=S[--s];x=S[--s];if(!y)return T(4);S[s++]=x===-2147483648&&y===-1?-2147483648:Math.trunc(x/y)|0;break;
case 20:if(s<2)return T(2);y=S[--s];x=S[--s];if(!y)return T(4);S[s++]=x%y;break;
case 21:if(s<2)return T(2);y=S[--s];x=S[--s];if(!y)return T(4);S[s++]=Math.trunc((x>>>0)/(y>>>0))|0;break;
case 22:if(s<2)return T(2);y=S[--s];x=S[--s];if(!y)return T(4);S[s++]=((x>>>0)%(y>>>0))|0;break;
case 23:if(s<1)return T(2);S[s-1]=(-S[s-1])|0;break;
case 24:if(s<2)return T(2);y=S[--s];x=S[--s];S[s++]=x&y;break;
case 25:if(s<2)return T(2);y=S[--s];x=S[--s];S[s++]=x|y;break;
case 26:if(s<2)return T(2);y=S[--s];x=S[--s];S[s++]=x^y;break;
case 27:if(s<1)return T(2);S[s-1]=~S[s-1];break;
case 28:if(s<2)return T(2);y=S[--s];x=S[--s];S[s++]=x<<y;break;
case 29:if(s<2)return T(2);y=S[--s];x=S[--s];S[s++]=x>>y;break;
case 30:if(s<2)return T(2);y=S[--s];x=S[--s];S[s++]=(x>>>y)|0;break;
case 32:if(s<2)return T(2);y=S[--s];x=S[--s];S[s++]=x===y?1:0;break;
case 33:if(s<2)return T(2);y=S[--s];x=S[--s];S[s++]=x<y?1:0;break;
case 34:if(s<2)return T(2);y=S[--s];x=S[--s];S[s++]=(x>>>0)<(y>>>0)?1:0;break;
case 48:if(p+2>=P.length)return T(9);w=3;m=P[p+1]|P[p+2]<<8;if(m>32767)m-=65536;p+=w+m;w=0;break;
case 49:if(p+2>=P.length)return T(9);w=3;m=P[p+1]|P[p+2]<<8;if(m>32767)m-=65536;if(s<1)return T(2);x=S[--s];if(!x){p+=w+m;w=0}break;
case 50:if(p+2>=P.length)return T(9);w=3;m=P[p+1]|P[p+2]<<8;if(m>32767)m-=65536;if(s<1)return T(2);x=S[--s];if(x){p+=w+m;w=0}break;
case 51:if(p+2>=P.length)return T(9);w=3;m=P[p+1]|P[p+2]<<8;if(c>=64)return T(7);C[c++]=p+w;p=m;w=0;break;
case 52:if(!c)return T(8);p=C[--c];w=0;break;
case 64:if(s<1)return T(2);x=S[s-1];if(x<0||x>255)return T(6);S[s-1]=M[x];break;
case 65:if(s<2)return T(2);y=S[--s];x=S[--s];if(y<0||y>255)return T(6);M[y]=x;break;
case 80:if(s<1)return T(2);x=S[--s];m=String(x);if(o+m.length>65536)return T(11);U.set(Buffer.from(m),o);o+=m.length;break;
case 81:if(s<1)return T(2);x=S[--s];if(o>=65536)return T(11);U[o++]=x&255;break;
case 82:if(s>=256)return T(3);S[s++]=q<B.length?B[q++]:-1;break;
case 83:if(s<1)return T(2);x=S[--s];return T(x&255);
default:return T(5);
}
p+=w;
}
}
for(let n=1;n<=40;n++){
let d="i"+String(n).padStart(3,"0");
let[e,b]=R(readFileSync("/input/"+d+"/program.bin"),readFileSync("/input/"+d+"/input.bin"));
mkdirSync("/output/"+d,{recursive:true});
writeFileSync("/output/"+d+"/stdout.bin",b);
writeFileSync("/output/"+d+"/exit.txt",e+"\n");
}
