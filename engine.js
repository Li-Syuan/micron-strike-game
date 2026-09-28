(function(root){
'use strict';
const clamp=(n,a=0,b=100)=>Math.max(a,Math.min(b,n));
const scenarios={gentle:{name:'溫和協商',support:62,expectation:56,pressure:26,fatigue:10,hardness:35,offer:22},orders:{name:'訂單爆滿',support:78,expectation:78,pressure:60,fatigue:6,hardness:42,offer:15},board:{name:'股東施壓',support:42,expectation:40,pressure:14,fatigue:28,hardness:82,offer:12}};
const cards=[
 {id:'revenue',name:'再公布破紀錄營收',icon:'↗',side:'mixed',tip:'營收 +25%，員工期待 +12、交期壓力 +14、團結 +4。賺越多，大家越想分。'},
 {id:'payslip',name:'員工曬出薪資單',icon:'▤',side:'labor',tip:'團結 +12、期待 +6。更多員工加入罷工。'},
 {id:'lunch',name:'便當應援車抵達',icon:'▣',side:'labor',tip:'疲勞 −18、團結 +5。恢復精神，繼續爭取。'},
 {id:'bargain',name:'發動集體協商',icon:'⚑',side:'labor',tip:'依交期壓力與團結，提高提案約 2～9 分；疲勞 +2。'},
 {id:'pizza',name:'資方端出披薩派對',icon:'◕',side:'company',tip:'期待低於 65：團結 −8、疲勞 −3。期待高：團結 +8、期待 +4，員工反彈。'},
 {id:'bonus',name:'宣布獎金方案',icon:'▰',side:'company',tip:'協商成果 +5、團結 −7。提案改善，部分員工復工。'},
 {id:'customer',name:'請客戶再等等',icon:'◷',side:'company',tip:'交期壓力 −18，接下來 20 秒壓力增加減半。'},
 {id:'board',name:'股東要求守住利潤',icon:'▦',side:'company',tip:'資方強硬度 +13、團結 +3。接下來 20 秒減少協商讓步。'}
];
class Model{
 constructor(scenario='gentle',seed=Date.now()){this.scenario=scenarios[scenario]?scenario:'gentle';Object.assign(this,scenarios[this.scenario]);this.seed=seed>>>0;this.time=0;this.revenue=100;this.production=1;this.participation=0;this.cooldowns={};this.buffs={};this.logs=[];this.effects=[];this.helped={labor:0,company:0,mixed:0};this.result=null;this.nextEvent=25;this.nextAuto=30;this.nextVote=300;this.eventIndex=0;this.log('財報發布：營收創高峰！產線收到「感謝大家付出」。','revenue',8);}
 random(){this.seed=(1664525*this.seed+1013904223)>>>0;return this.seed/4294967296;}
 score(){return Math.round(clamp(this.offer));}
 terms(){return {salary:(this.offer/10).toFixed(1),bonus:(this.offer*.03).toFixed(1),leave:(this.offer*.05).toFixed(1)};}
 acceptance(){return clamp(24+this.offer*.78+this.fatigue*.38-this.support*.24-this.expectation*.14);}
 log(text,type='talk',weight=2){this.logs.unshift({text,type,weight,time:this.time});this.logs=this.logs.slice(0,100);this.effects.push({type,start:this.time,until:this.time+12});}
 act(id){if(this.result)return {ok:false,message:'這局已結束，按「再鬧一場」開始新局。'};if(!cards.some(c=>c.id===id))return {ok:false,message:'找不到這張事件卡。'};let cd=(this.cooldowns[id]||0)-this.time;if(cd>0)return {ok:false,message:`事件冷卻中，還有 ${Math.ceil(cd)} 秒。`};this.cooldowns[id]=this.time+20;this.helped[cards.find(c=>c.id===id).side]++;let text='';
 switch(id){case'revenue':this.revenue*=1.25;this.expectation+=12;this.pressure+=14;this.support+=4;text='營收又破紀錄！金幣落下來了，員工期待與急單一起上升。';break;
 case'payslip':this.support+=12;this.expectation+=6;text='薪資單長卷展開：「營收長這麼高，我的那一格呢？」更多人集結。';break;
 case'lunch':this.fatigue-=18;this.support+=5;text='便當應援車抵達！先吃飽，才有力氣談權益。疲勞下降。';break;
 case'bargain':{let gain=(2+this.pressure*.055+this.support*.025)*(this.buffs.board>this.time?.55:1);this.offer+=gain;this.fatigue+=2;text=`談判桌推到廠門口：資方提案提高 ${gain.toFixed(1)} 分。`;break;}
 case'pizza':if(this.expectation>=65){this.support+=8;this.expectation+=4;text='「我要分紅，不是分八片！」披薩派對反彈，員工更團結。';}else{this.support-=8;this.fatigue-=3;text='披薩先墊肚子。部分員工緩和立場，團結下降 8。';}break;
 case'bonus':this.offer+=5;this.support-=7;text='巨大紅包抵達：獎金方案讓成果提高 5 分，部分員工開始考慮復工。';break;
 case'customer':this.pressure-=18;this.buffs.customer=this.time+20;text='主管向客戶鞠躬：「再給我們一點時間。」交期壓力暫時緩和。';break;
 case'board':this.hardness+=13;this.support+=3;this.buffs.board=this.time+20;text='股東搬來計算機：「利潤要守住！」資方立場轉硬，員工也不服氣。';break;}
 this.normalize();this.log(text,id,6);return {ok:true,message:text};}
 normalize(){for(const k of ['support','expectation','pressure','fatigue','hardness','offer'])this[k]=clamp(this[k]);}
 auto(){let before=this.offer;if(this.pressure>48){this.offer+=Math.max(1,(this.pressure-30)*.065)*(1-this.hardness/150);this.log('資方自動應對：急單等不得，先改善一點提案。','bargain',3);}else{this.support-=1.8;this.log('資方自動應對：發布說明會公告，暫緩讓步。','board',1);}if(this.support>55){this.fatigue-=2;this.pressure+=3;this.log('員工代表自動集合：輪流休息，繼續維持行動。','payslip',2);}else{this.fatigue+=3;this.log('員工開始討論要不要復工；代表準備下一輪表決。','talk',2);}this.normalize();}
 event(){let type=(this.eventIndex++ + Math.floor(this.random()*3))%4;if(this.scenario==='orders'&&this.eventIndex%3===0)type=1;if(this.scenario==='board'&&this.eventIndex%3===0)type=2;
 if(type===0){this.expectation+=4;this.support+=3;this.log('隔壁廠待遇傳聞流進群組，大家重新翻起薪資單。','payslip',4);}
 if(type===1){this.revenue+=18;this.pressure+=9;this.expectation+=3;this.log('客戶願付急單費！營收更好看，交期更不能拖。','customer',5);}
 if(type===2){this.hardness+=5;this.support+=2;this.log('股東大會快到了，辦公室連夜製作「利潤不能少」簡報。','board',4);}
 if(type===3){this.support+=6;this.fatigue-=3;this.log('員工代表的發言爆紅：我們也想分享努力的成果。','payslip',5);}this.normalize();}
 vote(final=false){const yes=this.acceptance();if(yes>=50){let s=this.score();this.result=s>=70?'labor':s<=30?'company':'compromise';this.log(`表決通過：${Math.round(yes)}% 贊成，協商成果 ${s} 分。`,'agreement',10);}else if(final){this.result='unfinished';this.log(`最終提案遭否決：${Math.round(yes)}% 贊成，協商仍未完成。`,'talk',10);}else this.log(`本輪表決未過：${Math.round(yes)}% 贊成。雙方繼續談。`,'talk',3);return this.result;}
 step(dt){if(this.result)return;dt=Math.min(dt,1);this.time=Math.min(480,this.time+dt);const desired=clamp((this.support*.62+this.expectation*.38-this.offer*.30-this.fatigue*.17)/100,0,.95);this.participation+=(desired-this.participation)*Math.min(1,dt*.8);this.production=1-this.participation;this.revenue+=dt*(.065+this.production*.045);this.fatigue+=dt*(.09+this.participation*.04);this.pressure+=dt*(this.participation*.17-.02)*(this.buffs.customer>this.time?.5:1);this.hardness-=dt*.012;this.normalize();this.effects=this.effects.filter(e=>e.until>this.time);
 if(this.time>=this.nextEvent){this.event();this.nextEvent=this.time+25+this.random()*10;}
 if(this.time>=this.nextAuto){this.auto();this.nextAuto+=30;}
 if(this.time>=480)this.vote(true);else if(this.time>=this.nextVote){this.vote();this.nextVote+=30;}
 }
 snapshot(){return JSON.parse(JSON.stringify({...this,score:this.score(),acceptance:this.acceptance(),terms:this.terms()}));}
}
const api={Model,cards,scenarios,clamp};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.Strike=api;
})(typeof window!=='undefined'?window:globalThis);
