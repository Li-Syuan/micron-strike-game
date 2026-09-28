(function(){
'use strict';
const C={night:'#142a35',sky:'#1b3542',steel:'#50767b',light:'#b5d3c2',teal:'#79d7bb',gold:'#ffd070',red:'#f08b70',ink:'#10272e',paper:'#f7ead0',road:'#29424a'};
class FactoryScene{
 constructor(canvas){this.c=canvas;this.g=canvas.getContext('2d');this.g.imageSmoothingEnabled=false;this.people=Array.from({length:60},(_,i)=>({x:325+(i%15)*42,y:358+Math.floor(i/15)*22,phase:i*2.4}));this.t=0;}
 rect(x,y,w,h,c){this.g.fillStyle=c;this.g.fillRect(Math.round(x),Math.round(y),w,h);}
 text(s,x,y,size=12,color=C.paper,align='left'){this.g.fillStyle=color;this.g.font=`bold ${size}px "Microsoft JhengHei",sans-serif`;this.g.textAlign=align;this.g.fillText(s,Math.round(x),Math.round(y));}
 line(x,y,x2,y2,c,w=2){this.g.strokeStyle=c;this.g.lineWidth=w;this.g.beginPath();this.g.moveTo(x,y);this.g.lineTo(x2,y2);this.g.stroke();}
 person(x,y,i,moving=false,sign=false,manager=false,celebrate=false){x=Math.round(x);y=Math.round(y);let bob=moving?Math.sin(this.t*9+i)*1.6:0;let shirt=manager?'#6d83b2':['#79bcb3','#e3b484','#9cbad1','#d88a76','#b7ba92'][i%5];this.rect(x-6,y+17,16,3,'#172e33');this.rect(x-3,y+11,4,7+(moving?Math.sin(this.t*9+i)*2:0),'#183441');this.rect(x+4,y+11,4,7,'#183441');this.rect(x-5,y+2+bob,14,11,shirt);this.rect(x-3,y-9+bob,10,11,'#e7b89a');this.rect(x-4,y-11+bob,11,4,i%4?'#29383f':'#eee6cf');this.rect(x+4,y-5+bob,2,2,C.ink);this.rect(x-8,y+4+bob,3,8,shirt);this.rect(x+9,y+4+bob,3,8,shirt);if(manager){this.rect(x+2,y+2,2,9,C.red);this.rect(x+12,y+8,8,8,'#775e56');}if(sign){this.rect(x-10,y-22,2,25,'#916b49');this.rect(x-26,y-39,38,20,i%2?C.paper:C.gold);this.text(['我要分紅','那我的呢','休假有理','一起談！'][i%4],x-24,y-26,8,C.ink);}if(celebrate){this.line(x-6,y+4,x-12,y-8,shirt,4);this.line(x+10,y+4,x+16,y-8,shirt,4);this.rect(x,y-22-Math.abs(Math.sin(this.t*3+i))*8,10,4,shirt);}}
 truck(x,y,type){this.rect(x,y,67,30,type==='pizza'?C.red:C.teal);this.rect(x+67,y+10,30,20,'#e6c783');this.rect(x+72,y+12,17,11,C.sky);this.rect(x-3,y+27,104,6,C.ink);for(let xx of [13,73]){this.rect(x+xx,y+28,13,13,C.ink);this.rect(x+xx+4,y+32,5,5,'#739195');}this.text(type==='pizza'?'PIZZA':'便當應援',x+8,y+20,11,C.ink);}
 draw(m,dt,paused=false){const g=this.g;if(!paused)this.t+=dt;let t=this.t;this.rect(0,0,1100,570,C.night);this.rect(0,0,1100,190,C.sky);
 // Distant industrial skyline, clouds and tiny illuminated windows.
 for(let i=0;i<19;i++){let h=32+(i*37)%65;this.rect(i*65-10,185-h,47,h,'#244450');for(let j=0;j<3;j++)this.rect(i*65+j*12,165-h,5,5,i%3?'#315761':'#6d8170');}
 for(let i=0;i<4;i++){let x=(i*307+t*3)%1250-100;this.rect(x,26+i%2*28,86,6,'#2a4a55');this.rect(x+19,21+i%2*28,42,8,'#2a4a55');}
 this.rect(1020,26,24,24,C.paper);this.rect(1010,21,23,26,C.sky);
 // Oversized revenue board.
 this.rect(35,26,453,121,'#0e252c');this.rect(39,30,445,113,'#29474e');this.rect(44,35,435,103,'#102c33');this.text('QUARTERLY REPORT  /  架空財報',59,57,11,C.teal);this.text('營收指數',59,81,12,'#b1c9bf');this.text((m?.revenue||100).toFixed(1),57,120,37,C.gold);this.text('↑ 再創新高',207,119,14,C.teal);for(let i=0;i<9;i++)this.rect(341+i*13,121-(i*7+8),8,i*7+8,i===8?C.gold:'#57978c');this.rect(68,147,7,34,C.steel);this.rect(450,147,7,34,C.steel);
 // Factory shell and roof.
 this.rect(279,172,782,276,'#17323b');this.rect(270,159,802,19,'#76938d');this.rect(288,183,763,251,'#3f6268');this.rect(294,188,751,239,'#23474f');this.rect(283,288,774,13,'#93ada2');this.rect(279,428,782,20,'#93ada2');this.rect(285,178,10,250,'#64858a');this.rect(725,180,10,248,'#6e908d');this.rect(1045,178,10,250,'#64858a');
 this.rect(545,131,283,29,'#41666b');this.text('μ  MEMORY FAB  /  記憶體工廠',560,151,14,C.paper);
 // Upper floor: wafer lab + executive office.
 this.rect(309,199,397,68,'#112f38');for(let i=0;i<6;i++){let x=322+i*63;this.rect(x,209,47,48,'#759b9b');this.rect(x+4,216,39,28,'#214c59');this.rect(x+9,222,25,14,C.teal);this.rect(x+19,218,4,24,'#3b7b79');this.rect(x+6,246,5,5,C.gold);}this.text('晶圓實驗室',310,282,10,'#b3cfcb');
 this.rect(751,191,279,86,'#8d8c78');this.rect(764,202,54,48,'#b7c7ab');this.rect(770,208,42,33,'#426674');this.line(790,208,790,241,'#a4b4a0');this.rect(835,235,148,8,'#b99b6f');this.rect(844,243,5,23,'#5d6858');this.rect(969,243,5,23,'#5d6858');this.rect(895,206,38,27,C.ink);this.text('↑ 利潤',899,224,9,C.gold);this.person(854+Math.sin(t*1.5)*8,230,1,true,false,true,m?.result==='company');this.person(964+Math.sin(t*2)*14,237,3,true,false,true,m?.result==='company');this.text('資方辦公室',754,282,10,C.paper);
 // Lower factory conveyor belts.
 const rate=m?.result&&m.result!=='unfinished'?1:(m?.production??1);for(let row=0;row<2;row++){let y=335+row*56;this.rect(310,y,404,15,'#122c34');this.rect(310,y+2,404,2,'#5b8287');for(let i=0;i<20;i++){let xx=310+((i*24+t*rate*24)%400);this.rect(xx,y+6,12,3,'#477077');}for(let i=0;i<8;i++){let xx=313+((i*53+t*rate*24)%388);this.rect(xx,y-11,18,12,'#a4b0a0');this.rect(xx+4,y-8,10,6,rate>.5?C.teal:'#496163');}}
 this.text(`產線運轉 ${Math.round(rate*100)}%`,753,320,12,C.teal);for(let i=0;i<8;i++){let x=758+(i%4)*64,y=340+Math.floor(i/4)*45;this.rect(x,y,51,31,'#73918c');this.rect(x+5,y+5,41,16,'#183e48');this.rect(x+10,y+8,12,4,rate>.4?C.teal:C.red);this.rect(x+37,y+23,5,4,C.gold);}
 // Pavement and gate.
 this.rect(0,449,1100,121,C.road);this.rect(0,443,1100,6,'#8b9c8e');for(let i=0;i<19;i++)this.rect(i*60+10,546,28,3,'#667976');this.rect(20,208,247,8,'#aac3b3');this.rect(25,213,9,221,'#597d7f');this.rect(252,213,9,221,'#597d7f');this.rect(39,176,211,31,'#e3c483');this.text('全廠的努力，大家的成果',49,196,13,C.ink);
 const strikes=m?Math.round(m.participation*60):16;for(let i=0;i<Math.ceil(strikes/15);i++){let x=35+i*55;g.fillStyle=['#d58b66','#80b09b','#e0bf7c','#a993bb'][i%4];g.beginPath();g.moveTo(x,440);g.lineTo(x+24,408);g.lineTo(x+48,440);g.fill();this.rect(x+19,424,12,16,C.ink);}this.text('員工集結區',47,246,13,C.gold);
 const laborWin=m?.result==='labor',companyWin=m?.result==='company',agree=m?.result==='compromise';let activeStrikes=m?.result&&m.result!=='unfinished'? (laborWin?44:agree?20:0):strikes;
 // People physically travel between the plant and the picket line.
 this.people.forEach((a,i)=>{let protest=i<activeStrikes;let tx=protest?51+(i%9)*23:326+(i%15)*42;let ty=protest?295+Math.floor(i/9)*23:354+Math.floor(i/15)*22;if(laborWin&&i<44)ty=300+Math.floor(i/9)*24;let dist=Math.hypot(tx-a.x,ty-a.y);if(!paused&&dist>1){let step=Math.min(dist,dt*90);a.x+=(tx-a.x)/dist*step;a.y+=(ty-a.y)/dist*step;}this.person(a.x,a.y,i,dist>3,protest&&i%4===0,false,laborWin&&protest);});
 // Negotiation stage, proposals as tangible chips.
 this.rect(419,486,295,14,'#bb9469');this.rect(435,499,9,29,'#685f53');this.rect(692,499,9,29,'#685f53');this.person(401,480,2,false,true,false,laborWin);this.person(730,480,3,false,false,true,companyWin);this.text('協 商 桌',525,521,12,C.paper);for(let i=0;i<3;i++){let x=471+i*68;let value=m?m.offer:0;this.rect(x,472,47,13,[C.teal,C.gold,C.red][i]);this.text(['加薪','獎金','休假'][i],x+7,482,9,C.ink);this.rect(x+4,469-Math.floor(value/20)*3,38,3,[C.teal,C.gold,C.red][i]);}
 this.rect(853,460,215,67,'#172f35');this.text('出貨區',865,479,11,'#97b6b1');for(let i=0;i<Math.round(rate*6);i++){let x=868+i*29;this.rect(x,494,23,24,'#b9976a');this.rect(x+10,494,3,24,'#e3c788');}this.text(`急單壓力 ${Math.round(m?.pressure||0)}%`,865,542,10,C.gold);
 if(m){for(const effect of m.effects){let age=m.time-effect.start;let type=effect.type;
 if(type==='revenue'){for(let i=0;i<13;i++){let x=75+i*30,y=56+((age*45+i*29)%130);this.rect(x,y,6,8,C.gold);this.rect(x+2,y+2,2,4,'#b08843');}}
 if(type==='lunch'||type==='pizza'){let x=Math.min(120,-110+age*100);this.truck(x,487,type);for(let i=0;i<5;i++){this.rect(260+i*12,513-i*4,15,5,type==='pizza'?C.red:C.paper);}}
 if(type==='payslip'){this.rect(61,260,155,35,C.paper);this.text('營收長高了，薪資呢？',68,282,11,C.ink);}
 if(type==='bonus'){this.rect(887,206,40,44,'#d77166');this.text('獎',897,234,19,C.gold);}
 if(type==='customer'){this.person(1058,485,0,true,false,true);this.rect(1003,447,73,26,C.paper);this.text('急單！！',1010,465,13,'#aa5750');}
 if(type==='board'){for(let i=0;i<6;i++)this.rect(779+i*35,204+Math.sin(age*2+i)*19,13,8,C.paper);}
 if(type==='pizza'&&m.expectation>=65){this.rect(60,267,173,28,C.gold);this.text('我要分紅，不是分八片！',66,286,11,C.ink);}
 if(type==='bargain'){this.rect(455,451,230,19,C.paper);this.text('提案來回，這次能談成嗎？',467,465,11,C.ink);}
 }
 if(m.result&&m.result!=='unfinished'){for(let i=0;i<40;i++)this.rect((i*79+t*13)%1100,(i*31+t*42)%545,3,7,[C.gold,C.teal,C.red][i%3]);this.rect(390,52,470,47,'#10272ee0');this.text({labor:'新待遇公告！員工努力有了回報',company:'產線復工！資方守住分配主導權',compromise:'雙方宣布：我們都取得重大成果'}[m.result],625,81,18,C.gold,'center');}
 }
 }
}
window.FactoryScene=FactoryScene;
})();
