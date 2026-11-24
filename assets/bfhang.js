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
  var sw=wrap.querySelector('.bfsw');
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
    sw.style.transform='translateY('+bob.toFixed(2)+'px) rotate('+((th+idle)*57.2958).toFixed(2)+'deg)';
    requestAnimationFrame(step);
  }
  function start(){ if(!running){running=true;last=performance.now();requestAnimationFrame(step);} }
  start(); kick(1.2);
})();
