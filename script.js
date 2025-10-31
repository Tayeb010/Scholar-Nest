// Animations, counters, noise background, and nav toggle
(function(){
  const ready = (fn)=> document.readyState!=='loading' ? fn() : document.addEventListener('DOMContentLoaded', fn);
  ready(()=>{
    const reveals = Array.from(document.querySelectorAll('.reveal'));
    if('IntersectionObserver' in window){
      const io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{
          if(e.isIntersecting){
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      }, {threshold: 0.12});
      reveals.forEach(el=> io.observe(el));
    } else { reveals.forEach(el=> el.classList.add('is-in')); }

    const counters = Array.from(document.querySelectorAll('.num'));
    const startCounter = (el)=>{
      const to = parseInt(el.dataset.count||'0',10);
      let cur = 0; const step = Math.max(1, Math.round(to/60));
      const tick = ()=>{ cur+=step; if(cur>=to){el.textContent=to;} else {el.textContent=cur; requestAnimationFrame(tick);} };
      tick();
    };
    if('IntersectionObserver' in window){
      const io2 = new IntersectionObserver((ents)=>{
        ents.forEach(e=>{ if(e.isIntersecting){ startCounter(e.target); io2.unobserve(e.target); } });
      }, {threshold: 0.4});
      counters.forEach(el=> io2.observe(el));
    } else { counters.forEach(startCounter); }

    document.querySelector('.hamburger')?.addEventListener('click', ()=>{
      const nav = document.querySelector('.nav nav');
      nav.style.display = getComputedStyle(nav).display==='none' ? 'flex' : 'none';
    });

    const y = document.getElementById('year'); if(y) y.textContent = new Date().getFullYear();

    const canvas = document.getElementById('noise');
    if(canvas && canvas.getContext){
      const ctx = canvas.getContext('2d');
      const resize = ()=>{ canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
      window.addEventListener('resize', resize); resize();
      (function render(){
        const w=canvas.width, h=canvas.height;
        const img = ctx.createImageData(w,h);
        const data = img.data;
        for(let i=0;i<data.length;i+=4){
          const n = (Math.random()*255)|0;
          data[i]=data[i+1]=data[i+2]=n; data[i+3]=18;
        }
        ctx.putImageData(img,0,0);
        requestAnimationFrame(render);
      })();
    }
  });
})();