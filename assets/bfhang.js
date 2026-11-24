/* Black Friday sign hanging from the top bar, swinging with mouse / touch / scroll */
(function(){
  var host=document.querySelector('.stick')||document.querySelector('.home header');
  if(!host) return;
  var brand=host.classList.contains('stick');
  var wrap=document.createElement('div');
  wrap.className='bfhang'+(brand?' bfh-brand':'');
  wrap.setAttribute('aria-hidden','true');
  wrap.innerHTML='<span class="bfnail"></span><div class="bfsw"><svg class="bfstr" viewBox="0 0 100 40" preserveAspectRatio="none"><path d="M50 0 L12 40 M50 0 L88 40"/></svg><picture><source srcset="img/ui/blackfriday.webp" type="image/webp"><img src="img/ui/blackfriday.png" alt=""></picture></div>';
  host.appendChild(wrap);
  var sw=wrap.querySelector('.bfsw'), img=wrap.querySelector('img');
  var layer=document.createElement('div'); layer.className='bfdrops'; layer.setAttribute('aria-hidden','true'); document.body.appendChild(layer);
  var WORDS=['%','-50%','-30%','-70%','SALE','OFF','%','-40%','SALE','%'];
  var COLS=[['#e0141e','#fff'],['#ffd000','#111'],['#111','#ffd000'],['#fff','#e0141e']];
  var drops=[], acc=0;
  function spawn(){
    if(drops.length>=36) return;
    var r=img.getBoundingClientRect(); if(r.bottom<0||r.top>innerHeight) return;
    var e=document.createElement('span'), c=COLS[Math.random()*COLS.length|0], w=WORDS[Math.random()*WORDS.length|0];
    e.className='bfdrop'+(w.length<2?' bfd-pct':''); e.textContent=w; e.style.background=c[0]; e.style.color=c[1]; if(c[0]=='#111')e.style.borderColor='#ffd000';
    layer.appendChild(e);
    drops.push({e:e,x:r.left+r.width*(.12+Math.random()*.76),y:r.top+r.height*.75,vx:(Math.random()-.5)*70-om*25,vy:20+Math.random()*40,r:(Math.random()-.5)*40,vr:(Math.random()-.5)*260,life:0,max:1.6+Math.random()*.9});
  }
  function drops_step(dt){
    var sp=Math.abs(om);
    if(sp>.35){ acc+=dt*Math.min(14,(sp-.35)*9); while(acc>=1){acc-=1;spawn();} } else acc=0;
    for(var i=drops.length-1;i>=0;i--){
      var d=drops[i]; d.life+=dt; d.vy+=420*dt; d.vx*=.985; d.x+=d.vx*dt; d.y+=d.vy*dt; d.r+=d.vr*dt;
      var op=d.life<.15?d.life/.15:Math.max(0,1-(d.life-d.max*.6)/(d.max*.4));
      if(d.life>=d.max||d.y>innerHeight+40){d.e.remove();drops.splice(i,1);continue;}
      d.e.style.transform='translate('+d.x.toFixed(1)+'px,'+d.y.toFixed(1)+'px) translate(-50%,-50%) rotate('+d.r.toFixed(1)+'deg)';
      d.e.style.opacity=Math.min(1,op).toFixed(2);
    }
  }
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var th=0, om=0, bob=0, bv=0, lx=null, ly=null, lsy=scrollY, t0=performance.now(), last=t0, running=false;
  function kick(a,b){ om+=a; bv+=b||0; if(om>6)om=6; if(om<-6)om=-6; start(); }
  function pivotX(){ var r=wrap.getBoundingClientRect(); return r.left+r.width/2; }
  function onMove(x,y){
    if(lx!==null){
      var dx=x-lx, dy=y-ly;
      var side=x<pivotX()?1:-1;
      kick(dx*0.012+dy*0.007*side, Math.abs(dy)*0.02);
    }
    lx=x; ly=y;
  }
  addEventListener('mousemove',function(e){onMove(e.clientX,e.clientY)},{passive:true});
  addEventListener('mouseleave',function(){lx=ly=null});
  addEventListener('touchmove',function(e){var t=e.touches[0];if(t)onMove(t.clientX,t.clientY)},{passive:true});
  addEventListener('touchend',function(){lx=ly=null},{passive:true});
  addEventListener('scroll',function(){
    var d=scrollY-lsy; lsy=scrollY;
    kick(d*0.006, d*0.05);
  },{passive:true});

  function step(now){
    var dt=Math.min(.05,(now-last)/1000); last=now;
    // damped pendulum (angle in radians)
    var acc=-38*Math.sin(th)-1.6*om;
    om+=acc*dt; th+=om*dt;
    if(th>.6){th=.6;om*=-.4} if(th<-.6){th=-.6;om*=-.4}
    // little spring bounce on the string
    var ba=-160*bob-9*bv; bv+=ba*dt; bob+=bv*dt;
    if(bob>14)bob=14; if(bob<-6)bob=-6;
    // gentle idle sway so it always feels alive
    var idle=Math.sin((now-t0)/900)*.025;
    drops_step(dt);
    sw.style.transform='translateY('+bob.toFixed(2)+'px) rotate('+((th+idle)*57.2958).toFixed(2)+'deg)';
    requestAnimationFrame(step);
  }
  function start(){ if(!running){running=true;last=performance.now();requestAnimationFrame(step);} }
  start(); kick(1.2);
})();
