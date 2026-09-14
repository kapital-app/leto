
(function(){
  var root=document.getElementById('kapital-v11');
  if(!root||!window.KAPITAL_SPRITE)return;
  var frames={main:[0,973],money:[973,961],accounts:[1934,881],balance:[2815,1014],more:[3829,1027]};
  var img=new Image();
  function crop(y,h){
    var c=document.createElement('canvas'),x=c.getContext('2d',{willReadFrequently:true});
    c.width=520;c.height=h;
    x.drawImage(img,0,y,520,h,0,0,520,h);
    var I=x.getImageData(0,0,520,h),d=I.data,n=520*h,v=new Uint8Array(n),q=new Int32Array(n),head=0,tail=0,T=1225;
    function near(i){var o=i*4,r=d[o]-242,g=d[o+1]-240,b=d[o+2]-233;return r*r+g*g+b*b<=T}
    function add(i){if(i>=0&&i<n&&!v[i]&&near(i)){v[i]=1;q[tail++]=i}}
    var i,j,p,cx;
    for(i=0;i<520;i++){add(i);add((h-1)*520+i)}
    for(j=1;j<h-1;j++){add(j*520);add(j*520+519)}
    while(head<tail){p=q[head++];cx=p%520;add(p-520);add(p+520);if(cx)add(p-1);if(cx<519)add(p+1)}
    for(i=0;i<n;i++)if(v[i])d[i*4+3]=0;
    x.putImageData(I,0,0);
    return c.toDataURL('image/webp',.96);
  }
  img.onload=function(){
    var cache={};
    Object.keys(frames).forEach(function(k){cache[k]=crop(frames[k][0],frames[k][1])});
    root.querySelectorAll('img[data-kshot]').forEach(function(el){
      el.src=cache[el.getAttribute('data-kshot')];
      el.classList.add('kready');
    });
    window.KAPITAL_SPRITE=null;
  };
  img.src=window.KAPITAL_SPRITE;
})();

(function(){
  var root=document.getElementById('kapital-v11');
  if(!root)return;

  // Reveal
  var reveal=[].slice.call(root.querySelectorAll('.m-reveal'));
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}
      });
    },{threshold:.07});
    reveal.forEach(function(el){io.observe(el);});
  }else{
    reveal.forEach(function(el){el.classList.add('in');});
  }

  // Demo slider
  var track=root.querySelector('.m-track');
  var slides=[].slice.call(root.querySelectorAll('.m-slide'));
  var tabs=[].slice.call(root.querySelectorAll('.m-tab'));
  var dots=[].slice.call(root.querySelectorAll('.m-dot'));
  var prev=root.querySelector('.m-arrow.prev');
  var next=root.querySelector('.m-arrow.next');
  if(!track||!slides.length)return;
  var index=0;

  function setActive(i){
    index=Math.max(0,Math.min(slides.length-1,i));
    tabs.forEach(function(t,n){t.classList.toggle('on',n===index);});
    dots.forEach(function(d,n){d.classList.toggle('on',n===index);});
  }
  function go(i){
    setActive(i);
    track.scrollTo({left:track.clientWidth*index,behavior:'smooth'});
  }
  function sync(){
    var w=track.clientWidth||1;
    setActive(Math.round(track.scrollLeft/w));
  }
  var raf=0;
  track.addEventListener('scroll',function(){
    cancelAnimationFrame(raf);
    raf=requestAnimationFrame(sync);
  },{passive:true});
  if(prev)prev.addEventListener('click',function(){go(index-1);});
  if(next)next.addEventListener('click',function(){go(index+1);});
  dots.forEach(function(d,i){d.addEventListener('click',function(){go(i);});});
  tabs.forEach(function(t){
    t.addEventListener('click',function(){
      go(parseInt(t.getAttribute('data-go'),10)||0);
    });
  });

})();
