(() => {
  const section = document.querySelector('.security-orbit');
  if (!section) return;
  const canvas = section.querySelector('canvas'), ctx = canvas.getContext('2d');
  if (!ctx) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, visible = false, angle = -.35, phase = 0, last = 0, frame = 0, drag = null, size = 400;
  // Natural Earth 110m public-domain coastlines, stored with the website.
  const mapCanvas=document.createElement('canvas'); mapCanvas.width=1440;mapCanvas.height=720;
  const mapCtx=mapCanvas.getContext('2d',{willReadFrequently:true});
  const globeLayer=document.createElement('canvas');globeLayer.width=globeLayer.height=280;
  const globeCtx=globeLayer.getContext('2d');const pixels=globeCtx.createImageData(280,280);
  const surface=[];let mapPixels=null;
  for(let y=0;y<280;y++)for(let x=0;x<280;x++){
    const nx=(x-139.5)/140,ny=(139.5-y)/140,q=nx*nx+ny*ny;
    if(q>1)continue;const z=Math.sqrt(1-q);
    surface.push([(y*280+x)*4,Math.atan2(nx,z),Math.asin(ny),Math.max(.18,.48+z*.48-nx*.18+ny*.12)]);
  }
  (window.MPS_WORLD_LAND?Promise.resolve(window.MPS_WORLD_LAND):fetch('world-land.geojson').then(r=>{if(!r.ok)throw Error('Map unavailable');return r.json();})).then(data=>{
    mapCtx.fillStyle='#ffffff';
    for(const feature of data.features){const polygons=feature.geometry.type==='Polygon'?[feature.geometry.coordinates]:feature.geometry.coordinates;
      for(const polygon of polygons){mapCtx.beginPath();for(const ring of polygon){ring.forEach(([lon,lat],i)=>{const x=(lon+180)*4,y=(90-lat)*4;if(i)mapCtx.lineTo(x,y);else mapCtx.moveTo(x,y);});mapCtx.closePath();}mapCtx.fill('evenodd');}
    }
    mapPixels=mapCtx.getImageData(0,0,1440,720).data;canvas.dataset.mapLoaded='true';draw();
  }).catch(()=>{canvas.dataset.mapLoaded='false';});
  let landDots=null;
  function drawLand(cx,cy,r){
    if(!mapPixels)return;
    if(!landDots){
      landDots=[];
      for(let lat=-86;lat<=86;lat+=1.8){
        const step=1.8/Math.max(.2,Math.cos(lat*Math.PI/180));
        for(let lon=-180;lon<180;lon+=step){
          const mx=Math.min(1439,Math.floor((lon+180)*4));
          const my=Math.min(719,Math.floor((90-lat)*4));
          if(mapPixels[(my*1440+mx)*4+3]>80)landDots.push([lat*Math.PI/180,lon*Math.PI/180]);
        }
      }
    }
    for(const [lat,lon] of landDots){
      const p=project(lat,lon,r*1.004);if(p[2]<=0)continue;
      ctx.fillStyle=`rgba(151,204,220,${.22+p[2]*.63})`;
      ctx.beginPath();ctx.ellipse(p[0],p[1],Math.max(.4,r*.0054*p[2]),r*.0054,0,0,Math.PI*2);ctx.fill();
    }
    ctx.strokeStyle='#9fcee64a';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,Math.PI*2);ctx.stroke();
  }
  function project(lat, lon, r) {
    const x = Math.cos(lat) * Math.sin(lon + angle), z = Math.cos(lat) * Math.cos(lon + angle), y = Math.sin(lat);
    return [size / 2 + x * r, size * .56 - y * r, z];
  }
  function line(points, color, width = 1) {
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.beginPath();
    let pen = false;
    points.forEach(p => { if (p[2] < 0) { pen = false; return; } if (pen) ctx.lineTo(p[0], p[1]); else ctx.moveTo(p[0], p[1]); pen = true; }); ctx.stroke();
  }
  function draw() {
    ctx.clearRect(0, 0, size, size);
    const r = size * .32, cx = size / 2, cy = size * .56;
    const halo = ctx.createRadialGradient(cx, cy, r * .7, cx, cy, r * 1.5);
    halo.addColorStop(0, '#2365a955'); halo.addColorStop(1, '#2365a900');
    ctx.fillStyle = halo; ctx.fillRect(0, 0, size, size);
    ctx.save(); ctx.translate(cx, cy + r * 1.15); ctx.scale(1, .18); ctx.fillStyle = '#01071488'; ctx.beginPath(); ctx.arc(0, 0, r * .85, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    const sphere = ctx.createRadialGradient(cx-r*.4, cy-r*.5, r*.05, cx, cy, r);
    sphere.addColorStop(0, '#285788'); sphere.addColorStop(.65, '#102e56'); sphere.addColorStop(1, '#05132e');
    ctx.fillStyle = sphere; ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
    for (let lat = -1.2; lat <= 1.2; lat += .3) {
      line(Array.from({length:121}, (_,i) => project(lat, i / 120 * Math.PI * 2, r)), '#89b9dc25');
    }
    for (let lon = 0; lon < Math.PI * 2; lon += Math.PI / 10) {
      line(Array.from({length:81}, (_,i) => project(-Math.PI/2 + i/80*Math.PI, lon, r)), '#89b9dc25');
    }
    drawLand(cx,cy,r);
    line(Array.from({length:161},(_,i)=>project(.22*Math.sin(i/160*Math.PI*2),i/160*Math.PI*2,r*1.025)), '#e9ad2090', 2);
    for(const lon of [-.9,1.3,2.9]){const p=project(.22*Math.sin(lon),lon,r*1.025);if(p[2]>0){ctx.fillStyle='#f4c65c';ctx.shadowColor='#e9ad20';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(p[0],p[1],4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;}}
    // Dimensional uniformed officer with articulated limbs and restrained gait.
    ctx.save();ctx.translate(cx,cy-r+2);ctx.scale(size/460,size/460);
    const walk=paused||reduced.matches?0:Math.sin(phase),bob=Math.abs(walk)*1.1;
    ctx.fillStyle='#02081566';ctx.beginPath();ctx.ellipse(0,0,18,4,0,0,Math.PI*2);ctx.fill();
    ctx.translate(0,-bob);
    function limb(points,color,width){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.stroke();}
    // Trousers, seams and polished boots.
    for(const side of [-1,1]){
      const swing=side*walk*5,knee=side*6+swing*.55,foot=side*7+swing;
      limb([[side*6,-39],[knee,-22],[foot,-7]],side<0?'#60758c':'#8294a5',10);
      limb([[side*7,-36],[knee+1,-22],[foot+1,-10]],'#b0bbc64d',1.2);
      const leather=ctx.createLinearGradient(foot-6,-11,foot+8,0);leather.addColorStop(0,'#26384d');leather.addColorStop(1,'#030915');
      ctx.fillStyle=leather;ctx.beginPath();ctx.roundRect(foot-6,-10,16,9,3);ctx.fill();limb([[foot-3,-7],[foot+6,-7]],'#72829766',1);
    }
    // Shaped jacket with side shading.
    const jacket=ctx.createLinearGradient(-18,-80,19,-43);jacket.addColorStop(0,'#315578');jacket.addColorStop(.45,'#1a365a');jacket.addColorStop(1,'#0b1932');
    ctx.fillStyle=jacket;ctx.beginPath();ctx.moveTo(-8,-83);ctx.quadraticCurveTo(-17,-81,-18,-72);ctx.lineTo(-13,-41);ctx.quadraticCurveTo(0,-37,13,-41);ctx.lineTo(18,-72);ctx.quadraticCurveTo(17,-81,8,-83);ctx.closePath();ctx.fill();
    for(const side of [-1,1]){
      const swing=-side*walk*4,elbow=side*22+swing*.4,hand=side*19+swing;
      limb([[side*15,-76],[elbow,-61],[hand,-46]],side<0?'#315273':'#193553',8);
      limb([[side*16,-74],[elbow-1,-61]],'#7894ab40',1.2);
      ctx.fillStyle='#ad7958';ctx.beginPath();ctx.ellipse(hand,-43,3.6,5,side*.15,0,Math.PI*2);ctx.fill();
      limb([[hand-4,-49],[hand+3,-49]],'#0b1830',3);
    }
    // Shirt collar, tie, epaulettes, pockets, badge and radio.
    ctx.fillStyle='#b4c9db';ctx.beginPath();ctx.moveTo(-8,-81);ctx.lineTo(0,-70);ctx.lineTo(8,-81);ctx.lineTo(0,-78);ctx.closePath();ctx.fill();
    ctx.fillStyle='#07132a';ctx.beginPath();ctx.moveTo(0,-78);ctx.lineTo(-3,-73);ctx.lineTo(-2,-59);ctx.lineTo(1,-56);ctx.lineTo(3,-60);ctx.lineTo(2,-73);ctx.closePath();ctx.fill();
    limb([[-15,-78],[-9,-79]],'#e9bd5d',2);limb([[9,-79],[15,-78]],'#e9bd5d',2);
    ctx.strokeStyle='#66809a88';ctx.lineWidth=1;ctx.strokeRect(-11,-64,8,8);ctx.strokeRect(5,-64,7,8);
    ctx.fillStyle='#efc65a';ctx.beginPath();ctx.moveTo(6,-74);ctx.lineTo(12,-74);ctx.lineTo(12,-68);ctx.lineTo(9,-65);ctx.lineTo(6,-68);ctx.closePath();ctx.fill();
    ctx.fillStyle='#080f20';ctx.fillRect(-14,-73,6,10);limb([[-12,-73],[-13,-81]],'#14263f',1.5);ctx.fillStyle='#88acb8';ctx.fillRect(-12,-70,3,2);
    ctx.fillStyle='#081122';ctx.fillRect(-13,-45,26,5);ctx.strokeStyle='#d4ad56';ctx.strokeRect(-2,-45,5,5);ctx.fillStyle='#13243b';ctx.beginPath();ctx.roundRect(10,-45,7,10,2);ctx.fill();
    // Neck, ears and softly shaded face.
    ctx.fillStyle='#986749';ctx.fillRect(-4,-90,8,10);
    ctx.fillStyle='#b3815e';for(const side of [-1,1]){ctx.beginPath();ctx.ellipse(side*10,-97,2.3,3.7,0,0,Math.PI*2);ctx.fill();}
    const skin=ctx.createLinearGradient(-10,-103,10,-87);skin.addColorStop(0,'#d09a70');skin.addColorStop(.5,'#b7805a');skin.addColorStop(1,'#835339');ctx.fillStyle=skin;ctx.beginPath();ctx.roundRect(-10,-109,20,25,[8,8,9,9]);ctx.fill();
    limb([[-6,-99],[-3,-99]],'#392f2b',1.1);limb([[3,-99],[6,-99]],'#392f2b',1.1);limb([[0,-98],[-1,-94],[1,-93]],'#87583e',.8);limb([[-3,-89],[3,-89]],'#764835',.9);
    // Structured cap, gold band, curved visor and insignia.
    const cap=ctx.createLinearGradient(-12,-116,12,-104);cap.addColorStop(0,'#365778');cap.addColorStop(1,'#0c1c35');ctx.fillStyle=cap;ctx.beginPath();ctx.moveTo(-12,-105);ctx.lineTo(-11,-113);ctx.quadraticCurveTo(0,-119,12,-112);ctx.lineTo(13,-104);ctx.closePath();ctx.fill();
    limb([[-11,-104],[12,-104]],'#cda747',1.5);ctx.fillStyle='#0a182d';ctx.beginPath();ctx.ellipse(4,-103,16,3,0,0,Math.PI*2);ctx.fill();ctx.fillStyle='#e9bd5d';ctx.beginPath();ctx.arc(0,-110,2.3,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }
  function tick(time) { frame=0;const dt=Math.min((time-last)/1000||0,.05);last=time;if(!paused&&!drag){angle+=dt*.07;phase+=dt*3;}draw();if(visible&&!paused&&!document.hidden)frame=requestAnimationFrame(tick); }
  function start(){if(!frame&&visible&&!paused&&!document.hidden){last=performance.now();frame=requestAnimationFrame(tick);}else draw();}
  function resize(){size=canvas.clientWidth;const dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=Math.round(size*dpr);canvas.height=Math.round(size*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);draw();}
  canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,angle};canvas.setPointerCapture(e.pointerId);});
  canvas.addEventListener('pointermove',e=>{if(drag){angle=drag.angle+(e.clientX-drag.x)*.008;draw();}});
  function release(){drag=null;start();}canvas.addEventListener('pointerup',release);canvas.addEventListener('pointercancel',release);
  canvas.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();angle+=e.key==='ArrowLeft'?-.15:.15;draw();}});
  new ResizeObserver(resize).observe(canvas);
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible){cancelAnimationFrame(frame);frame=0;}else start();},{threshold:.05}).observe(section);
  document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0;}else start();});
  reduced.addEventListener('change',()=>{paused=reduced.matches;start();});resize();
})();
