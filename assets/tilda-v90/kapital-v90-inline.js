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

  // Product demo slider
  var track=root.querySelector('#m-track');
  var slides=[].slice.call(root.querySelectorAll('.m-slide'));
  var dots=[].slice.call(root.querySelectorAll('.m-dot'));
  var tabs=[].slice.call(root.querySelectorAll('.m-tab'));
  var prev=root.querySelector('#m-prev');
  var next=root.querySelector('#m-next');
  var index=0;

  // Load product screenshots only when the user actually opens a slide.
  function loadSlideImage(i){
    var s=slides[i];
    if(!s)return;
    var im=s.querySelector('img[data-k-src]');
    if(!im)return;
    var u=im.getAttribute('data-k-src');
    if(!u)return;
    im.src=u;
    im.removeAttribute('data-k-src');
  }


  function setState(i){
    index=Math.max(0,Math.min(slides.length-1,i));
    dots.forEach(function(d,n){d.classList.toggle('on',n===index);});
    tabs.forEach(function(t,n){t.classList.toggle('on',n===index);});
  }

  function go(i){
    i=(i+slides.length)%slides.length;
    loadSlideImage(i);
    var target=slides[i];
    track.scrollTo({
      left:target.offsetLeft-track.offsetLeft,
      behavior:'smooth'
    });
    setState(i);
  }

  function nearest(){
    var left=track.scrollLeft,best=0,dist=Infinity;
    slides.forEach(function(s,i){
      var d=Math.abs((s.offsetLeft-track.offsetLeft)-left);
      if(d<dist){dist=d;best=i;}
    });
    return best;
  }

  var raf=null;
  track.addEventListener('scroll',function(){
    if(raf)cancelAnimationFrame(raf);
    raf=requestAnimationFrame(function(){
      var n=nearest();
      loadSlideImage(n);
      setState(n);
    });
  },{passive:true});

  prev.addEventListener('click',function(){go(index-1);});
  next.addEventListener('click',function(){go(index+1);});
  dots.forEach(function(d,i){d.addEventListener('click',function(){go(i);});});
  tabs.forEach(function(t){
    t.addEventListener('click',function(){
      go(parseInt(t.getAttribute('data-go'),10)||0);
    });
  });

})();