(() => {
const section=document.querySelector('.security-estate');if(!section)return;
const info={
access:['ACCESS CONTROL','A secure welcome.','Professional officers manage entry, check visitors and help keep access to your property controlled.',['Visitor verification','Controlled entry and exit','On-site security presence'],'access control'],
camera:['CCTV MONITORING','A clearer view of your site.','Camera coverage supports awareness of entrances, shared spaces and areas that need closer attention.',['CCTV design and installation','Monitoring support','System maintenance'],'CCTV'],
patrol:['SITE PATROLS','Presence that keeps moving.','Visible patrols help officers observe the site, check key areas and report concerns.',['Site patrols','Checkpoint inspections','Incident reporting'],'site patrols'],
perimeter:['PERIMETER SECURITY','Attention at the boundary.','A site assessment identifies vulnerable boundaries and helps shape appropriate patrols, access measures and technical security.',['Site due diligence','Boundary inspections','Tailored technical solutions'],'perimeter security'],
vip:['PERSONAL PROTECTION','People at the centre.','Protection arrangements are planned around the individual, their movements and the environment.',['Bodyguard and VIP protection','Movement planning','Professional security personnel'],'personal protection']};
const keys=Object.keys(info),detail=section.querySelector('.estate-detail'),link=section.querySelector('.estate-enquire');
function select(key){const data=info[key];section.dataset.active=key;section.querySelectorAll('[data-service]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.service===key)));detail.querySelector('.estate-detail-number').textContent=`0${keys.indexOf(key)+1} / ${data[0]}`;detail.querySelector('h3').textContent=data[1];detail.querySelector('p').textContent=data[2];const list=detail.querySelector('ul');list.replaceChildren(...data[3].map(text=>{const li=document.createElement('li');li.textContent=text;return li;}));link.textContent=`Enquire about ${data[4]} →`;link.href=`contact.html?service=${encodeURIComponent(data[4])}`;}
section.querySelectorAll('[data-service]').forEach(b=>b.addEventListener('click',()=>select(b.dataset.service)));
const motion=section.querySelector('.estate-motion'),reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches;
function sync(){section.classList.toggle('motion-paused',paused);motion.textContent=paused?'Play motion':'Pause motion';motion.setAttribute('aria-pressed',String(paused));}
motion.addEventListener('click',()=>{paused=!paused;sync();});reduced.addEventListener('change',()=>{paused=reduced.matches;sync();});
new IntersectionObserver(entries=>{section.classList.toggle('motion-paused',paused||!entries[0].isIntersecting);}).observe(section);
select('access');sync();
})();
