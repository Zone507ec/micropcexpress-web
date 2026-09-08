const $ = (s, p = document) => p.querySelector(s);
const $$ = (s, p = document) => [...p.querySelectorAll(s)];
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const WA = 'https://wa.me/50760124997';

const icons = {
  web: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.4 4.4 6.4 4.4 9S15 17.6 12 21M12 3C9 6.4 7.6 9.4 7.6 12S9 17.6 12 21"/></svg>',
  system: '<svg viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="7" ry="3"/><path d="M5 5v7c0 1.7 3.1 3 7 3s7-1.3 7-3V5M5 12v7c0 1.7 3.1 3 7 3s7-1.3 7-3v-7"/></svg>',
  dashboard: '<svg viewBox="0 0 24 24"><path d="M5 20V10M10 20V4M15 20v-7M20 20V7"/></svg>',
  booking: '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16M8 14h2M14 14h2"/></svg>',
  inventory: '<svg viewBox="0 0 24 24"><path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z"/><path d="m4 7.5 8 4.5 8-4.5M12 12v9"/></svg>',
  automation: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19 12a7 7 0 0 0-.12-1.3l2-1.55-2-3.46-2.44.98a7 7 0 0 0-2.2-1.27L13.9 3h-4l-.34 2.4a7 7 0 0 0-2.2 1.27l-2.44-.98-2 3.46 2 1.55A7 7 0 0 0 4.8 12c0 .45.04.88.12 1.3l-2 1.55 2 3.46 2.44-.98a7 7 0 0 0 2.2 1.27L9.9 21h4l.34-2.4a7 7 0 0 0 2.2-1.27l2.44.98 2-3.46-2-1.55c.08-.42.12-.85.12-1.3Z"/></svg>'
};

const solutionData = [
  {id:'web',label:'Página Web',eyebrow:'PÁGINA WEB',title:'Páginas web que impresionan y convierten',desc:'Diseños modernos, rápidos y optimizados para que tu negocio destaque en cualquier dispositivo.',benefits:['Diseño personalizado','Optimización SEO','Integración con tus herramientas'],cta:'Ver ejemplos de páginas web →'},
  {id:'system',label:'Sistema',eyebrow:'SISTEMA A LA MEDIDA',title:'Procesos organizados en una sola herramienta',desc:'Un sistema diseñado alrededor de cómo trabaja tu negocio, no al revés.',benefits:['Usuarios y permisos','Búsqueda y registros','Flujos adaptados a tu operación'],cta:'Evaluar un sistema →'},
  {id:'dashboard',label:'Dashboard',eyebrow:'DASHBOARD & DATOS',title:'Tus números importantes, visibles y accionables',desc:'KPIs, gráficos y alertas para tomar decisiones con información clara.',benefits:['KPIs en tiempo real','Gráficos interactivos','Reportes y alertas'],cta:'Quiero un dashboard →'},
  {id:'booking',label:'Reservaciones',eyebrow:'RESERVACIONES',title:'Agenda disponible incluso cuando estás ocupado',desc:'Disponibilidad, horarios, cliente y confirmación desde una sola experiencia.',benefits:['Calendario en vivo','Horarios configurables','Confirmaciones rápidas'],cta:'Quiero reservas online →'},
  {id:'inventory',label:'Inventario',eyebrow:'INVENTARIO',title:'Control de stock sin depender de hojas sueltas',desc:'Productos, entradas, salidas, mínimos y alertas en una interfaz clara.',benefits:['Stock actualizado','Alertas de mínimos','Entradas y salidas'],cta:'Quiero controlar inventario →'},
  {id:'automation',label:'Automatización',eyebrow:'AUTOMATIZACIÓN',title:'Menos pasos manuales. Más procesos conectados.',desc:'Conecta formularios, sistemas y WhatsApp para ahorrar tiempo y reducir errores.',benefits:['Flujos automáticos','Integraciones','Notificaciones y reglas'],cta:'Quiero automatizar →'}
];

const businessData = [
  {id:'restaurante',label:'Restaurante',title:'Una experiencia digital que vende incluso cuando estás ocupado.',desc:'Menú, pedidos, ubicación, reservas y WhatsApp en una experiencia simple para el cliente.',features:['Menú y promociones','Pedidos o reservas','Ubicación y WhatsApp'],preview:'previews/cafeteria.html',device:'restaurant',brand:'Sabor Urbano',photo:'assets/business-restaurante.webp',photoPosition:'center center',heroTitle:'Sabores que abren el apetito.',heroText:'Menú, reservas y pedidos en una experiencia elegante y fácil de usar.',heroCta:'Reservar mesa',cards:[['Menú','34 platos'],['Reservas','26 hoy'],['Pedidos','Directo por WhatsApp']]},
  {id:'panaderia',label:'Panadería',title:'Productos frescos, pedidos y contacto sin complicar al cliente.',desc:'Una vitrina para mostrar panes, dulces, temporadas, pedidos especiales y horarios.',features:['Catálogo visual','Pedidos especiales','Horarios y ubicación'],preview:'previews/panaderia.html',device:'bakery',brand:'Pan del Barrio',photo:'assets/business-panaderia.webp',photoPosition:'center center',heroTitle:'Horneado fresco, mejor presentado.',heroText:'Destaca panes, dulces, temporadas y pedidos especiales con una imagen que provoque.',heroCta:'Ver catálogo',cards:[['Especiales','Del día'],['Pedidos','Por encargo'],['Horarios','Siempre visibles']]},
  {id:'zapateria',label:'Zapatería',title:'Catálogo, tallas y contacto desde el celular.',desc:'Una experiencia enfocada en producto para que el cliente encuentre modelos y pregunte rápido.',features:['Catálogo por estilo','Tallas y disponibilidad','WhatsApp directo'],preview:'previews/zapateria.html',device:'shop',brand:'Paso Firme',photo:'assets/business-zapateria.webp',photoPosition:'center center',heroTitle:'Modelos que lucen premium.',heroText:'Exhibe zapatos, estilos y tallas con una vitrina más atractiva y enfocada en conversión.',heroCta:'Ver colección',cards:[['Catálogo','Nuevas colecciones'],['Tallas','Disponibilidad'],['Consultas','Atención rápida']]},
  {id:'clinica',label:'Clínica',title:'Servicios y citas presentados con más confianza.',desc:'Especialidades, información, horarios y contacto para facilitar el primer paso del paciente.',features:['Especialidades','Citas online','Información clara'],preview:'previews/clinica.html',device:'clinic',brand:'Clínica Vital',photo:'assets/business-clinica.webp',photoPosition:'center center',heroTitle:'Confianza desde la primera vista.',heroText:'Presenta tus especialidades, citas y atención con una imagen profesional y humana.',heroCta:'Agendar cita',cards:[['Especialidades','Médicas'],['Citas','En línea'],['Atención','Más clara']]},
  {id:'tienda',label:'Tienda',title:'Productos, ofertas y pedidos en una vitrina propia.',desc:'Ideal para mini-super, comercio, ferretería o negocio con catálogo y pedidos recurrentes.',features:['Catálogo','Ofertas','Pedidos'],preview:'previews/minisuper.html',device:'shop',brand:'Mercado Local',photo:'assets/business-tienda.webp',photoPosition:'center center',heroTitle:'Tu tienda lista para vender más.',heroText:'Muestra productos, ofertas y pedidos con un formato visual más cercano al cliente.',heroCta:'Comprar ahora',cards:[['Ofertas','Del día'],['Catálogo','Productos'],['Pedidos','Más rápidos']]},
  {id:'profesional',label:'Profesional independiente',title:'Tu experiencia convertida en una oferta clara.',desc:'Presenta servicios, metodología, testimonios y un CTA directo para generar conversaciones.',features:['Servicios','Testimonios','Cotización o contacto'],preview:'previews/farmacia.html',device:'professional',brand:'Tu Marca',photo:'assets/business-profesional.webp',photoPosition:'center center',heroTitle:'Tu experiencia, mejor comunicada.',heroText:'Haz que tus servicios se vean confiables, profesionales y fáciles de contratar.',heroCta:'Quiero información',cards:[['Servicios','Bien explicados'],['Confianza','Tu experiencia'],['Contacto','CTA directo']]},
  {id:'fitness',label:'Entrenador personal',title:'Tu marca fitness organizada para convertir visitas en clientes.',desc:'Planes, rutinas, asesoría, agenda, testimonios y contacto directo por WhatsApp. Demo completamente genérica.',features:['Planes de entrenamiento','Reservación de sesiones','Progreso y testimonios'],preview:'previews/entrenador.html',device:'fitness',brand:'NextLevel Fitness',photo:'assets/fitness-coach.webp',photoPosition:'center 22%',heroTitle:'Tu transformación, <span>mejor presentada.</span>',heroText:'Planes, asesoría, agenda y seguimiento en una experiencia clara.',heroCta:'Reservar valoración',stats:[['12','PLANES ACTIVOS'],['48','SESIONES / MES'],['96%','SEGUIMIENTO']]}
];

const diagOptions = [
  {id:'web',label:'Página web',desc:'Presencia profesional y conversión'},
  {id:'system',label:'Sistema',desc:'Procesos y gestión interna'},
  {id:'dashboard',label:'Dashboard',desc:'KPIs, gráficos y reportes'},
  {id:'inventory',label:'Inventario',desc:'Stock, movimientos y alertas'},
  {id:'booking',label:'Reservaciones',desc:'Agenda y citas online'},
  {id:'automation',label:'Automatización',desc:'Flujos y tareas conectadas'},
  {id:'digital360',label:'Presencia Digital 360°',desc:'Web + redes + WhatsApp + Google'},
  {id:'social',label:'Redes sociales',desc:'Identidad y contenido consistente'}
];

function solutionPreview(id){
  if(id==='web') return `<div class="preview-window web-preview"><div class="preview-browser"><i></i><i></i><i></i><span>tumarca.com</span></div><div class="preview-nav"><div class="preview-logo"><i></i> Tu Marca</div><nav><span>Inicio</span><span>Servicios</span><span>Nosotros</span><span>Contacto</span></nav><button>Cotizar</button></div><div class="preview-hero"><div><h4>Soluciones que impulsan tu negocio</h4><p>Diseño, tecnología y estrategia para llevar tu empresa al siguiente nivel.</p><span class="tiny-cta">Conoce más</span></div></div><div class="preview-thumbs"><i></i><i></i><i></i><i></i></div></div>`;
  if(id==='system') return `<div class="preview-window app-preview"><div class="preview-browser"><i></i><i></i><i></i><span>panel.tunegocio.com</span></div><div class="app-shell"><div class="app-menu"><span class="active">Inicio</span><span>Clientes</span><span>Solicitudes</span><span>Facturas</span><span>Reportes</span><span>Usuarios</span></div><div class="app-content"><div class="app-toolbar"><b>Gestión de solicitudes</b><i></i></div><div class="app-table"><div class="table-row head"><span>Cliente</span><span>Estado</span><span>Fecha</span><span>Acción</span></div><div class="table-row"><span>Empresa Norte</span><span class="table-status">ACTIVO</span><span>Hoy</span><span>Ver</span></div><div class="table-row"><span>Grupo Sol</span><span class="table-status">ACTIVO</span><span>Ayer</span><span>Ver</span></div><div class="table-row"><span>Comercial 360</span><span class="table-status">ACTIVO</span><span>02 Sep</span><span>Ver</span></div><div class="table-row"><span>Proyecto Uno</span><span class="table-status">ACTIVO</span><span>30 Ago</span><span>Ver</span></div></div></div></div></div>`;
  if(id==='dashboard') return `<div class="preview-window dashboard-preview"><div class="preview-browser"><i></i><i></i><i></i><span>dashboard.tunegocio.com</span></div><div class="dash-demo-kpis"><article><small>VENTAS</small><b>$18.4K</b></article><article><small>CLIENTES</small><b>326</b></article><article><small>CONVERSIÓN</small><b>18.2%</b></article></div><div class="dash-demo-main"><div class="dash-demo-chart"><small>RENDIMIENTO</small><div class="fake-bars"><i style="--h:38%"></i><i style="--h:55%"></i><i style="--h:44%"></i><i style="--h:78%"></i><i style="--h:62%"></i><i style="--h:90%"></i></div></div><div class="dash-demo-list"><span>Venta registrada</span><span>Cliente nuevo</span><span>Stock actualizado</span><span>Reserva confirmada</span><span>Reporte listo</span></div></div></div>`;
  if(id==='booking') return `<div class="preview-window booking-preview"><div class="preview-browser"><i></i><i></i><i></i><span>reservas.tunegocio.com</span></div><div class="booking-grid"><div class="calendar"><div class="calendar-head"><b>Septiembre 2026</b><span>‹ ›</span></div><div class="calendar-days">${Array.from({length:28},(_,i)=>`<span class="${[4,9,15,22].includes(i)?'active':''}">${i+1}</span>`).join('')}</div></div><div class="booking-side"><article><b>Servicio</b><span>Sesión / cita</span></article><article><b>Hora</b><span>5:00 PM disponible</span></article><article><b>Cliente</b><span>Datos confirmados</span></article><article><b>Estado</b><span>✓ Reserva lista</span></article></div></div></div>`;
  if(id==='inventory') return `<div class="preview-window inventory-preview"><div class="preview-browser"><i></i><i></i><i></i><span>inventario.tunegocio.com</span></div><div class="inventory-kpis"><div><small>PRODUCTOS</small><b>248</b></div><div><small>BAJO MÍNIMO</small><b>7</b></div><div><small>MOVIMIENTOS</small><b>83</b></div></div><div class="inventory-list"><div><b>Producto</b><b>Stock</b><b>Estado</b></div><div><span>Café premium</span><span>32</span><span>OK</span></div><div><span>Empaque</span><span>3</span><span class="low">REABASTECER</span></div><div><span>Producto A</span><span>18</span><span>OK</span></div><div><span>Producto B</span><span>11</span><span>OK</span></div></div></div>`;
  return `<div class="preview-window automation-preview"><div class="preview-browser"><i></i><i></i><i></i><span>automation.flow</span></div><div class="flow-canvas"><div class="flow-line"></div><div class="flow-packet"></div><div class="flow-nodes"><div class="flow-node"><div><strong>FORMULARIO</strong>Entrada</div></div><div class="flow-node"><div><strong>AUTOMATIZACIÓN</strong>Reglas</div></div><div class="flow-node"><div><strong>SISTEMA</strong>Registro</div></div><div class="flow-node"><div><strong>WHATSAPP</strong>Aviso</div></div></div></div></div>`;
}

function renderSolutionTabs(){
  const tabs = $('#solutionTabs');
  tabs.innerHTML = solutionData.map((s,i)=>`<button class="solution-tab ${i===0?'active':''}" type="button" role="tab" aria-selected="${i===0}" data-solution="${s.id}">${icons[s.id]}<span>${s.label}</span></button>`).join('');
  $$('.solution-tab',tabs).forEach(btn=>btn.addEventListener('click',()=>setSolution(btn.dataset.solution)));
  setSolution('web');
}

function setSolution(id){
  const data = solutionData.find(s=>s.id===id) || solutionData[0];
  $$('.solution-tab').forEach(b=>{const on=b.dataset.solution===id;b.classList.toggle('active',on);b.setAttribute('aria-selected',String(on));});
  const stage=$('#solutionStage');
  stage.classList.add('switching');
  setTimeout(()=>{
    $('#solutionEyebrow').textContent=data.eyebrow;
    $('#solutionTitle').textContent=data.title;
    $('#solutionDescription').textContent=data.desc;
    $('#solutionBenefits').innerHTML=data.benefits.map(x=>`<li>${x}</li>`).join('');
    $('#solutionCta').textContent=data.cta;
    $('#solutionCta').href=id==='web'?'#casos':WA+'?text='+encodeURIComponent(`Hola Erik, me interesa evaluar ${data.label} para mi negocio.`);
    if(id!=='web'){ $('#solutionCta').target='_blank'; $('#solutionCta').rel='noopener'; } else { $('#solutionCta').removeAttribute('target'); }
    $('#solutionPreview').innerHTML=solutionPreview(id);
    const others=solutionData.filter(s=>s.id!==id).slice(0,5);
    $('#solutionSideList').innerHTML=others.map(s=>`<button class="side-item" type="button" data-side="${s.id}"><span class="side-icon">${s.label.charAt(0)}</span><span><b>${s.label}</b><span>${s.desc.split('.')[0]}</span></span></button>`).join('');
    $$('[data-side]').forEach(b=>b.addEventListener('click',()=>setSolution(b.dataset.side)));
    stage.classList.remove('switching');
  },120);
}

function businessDevice(data){
  const fitness = data.device==='fitness';
  const hasPhoto = !!data.photo;
  const heroClass = `${hasPhoto?'device-photo ':''}${fitness?'fitness-photo':''}`.trim();
  const heroStyle = hasPhoto
    ? `style="background-image:linear-gradient(90deg,rgba(4,15,25,.90),rgba(4,15,25,.42)),url('${data.photo}');background-position:${data.photoPosition||'center center'}"`
    : '';
  const footer = fitness
    ? `<div class="progress-demo">${(data.stats||[]).map(item=>`<article><b>${item[0]}</b><small>${item[1]}</small></article>`).join('')}</div>`
    : `<div class="device-cards">${(data.cards||[['Oferta clara','Servicios o productos'],['Conversión','CTA directo'],['Confianza','Prueba social']]).map(item=>`<article><b>${item[0]}</b><span>${item[1]}</span></article>`).join('')}</div>`;
  return `<div class="device-shell ${hasPhoto?'photo-device':''} ${fitness?'fitness-device':''}"><div class="device-top"><i></i><i></i><i></i></div><div class="device-web"><header><b>${data.brand||'Tu Marca'}</b><nav><span>Inicio</span><span>Servicios</span><span>Contacto</span></nav></header><div class="device-hero ${heroClass}" ${heroStyle}><h4>${data.heroTitle || (data.label+' digital')}</h4><p>${data.heroText || 'Una presencia creada para que tu cliente encuentre lo importante sin perder tiempo.'}</p><span>${data.heroCta || 'Quiero información'}</span></div>${footer}</div></div>`;
}

function renderBusinessTabs(){
  $('#businessTabs').innerHTML=businessData.map((b,i)=>`<button type="button" class="business-tab ${i===0?'active':''}" data-business="${b.id}" role="tab" aria-selected="${i===0}">${b.label}</button>`).join('');
  $$('.business-tab').forEach(b=>b.addEventListener('click',()=>setBusiness(b.dataset.business)));
  setBusiness('restaurante');
}

let currentBusiness=businessData[0];
function setBusiness(id){
  currentBusiness=businessData.find(b=>b.id===id)||businessData[0];
  $$('.business-tab').forEach(btn=>{const on=btn.dataset.business===id;btn.classList.toggle('active',on);btn.setAttribute('aria-selected',String(on));});
  $('#businessType').textContent=currentBusiness.label.toUpperCase();
  $('#businessTitle').textContent=currentBusiness.title;
  $('#businessDesc').textContent=currentBusiness.desc;
  $('#businessFeatures').innerHTML=currentBusiness.features.map(x=>`<li>${x}</li>`).join('');
  $('#businessDevice').innerHTML=businessDevice(currentBusiness);
}

function initBusinessModal(){
  const modal=$('#demoModal'),frame=$('#demoFrame');
  const open=()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');$('#demoModalTitle').textContent=currentBusiness.label+' · Demo';frame.src=currentBusiness.preview;setTimeout(()=>$('#demoClose').focus(),100)};
  const close=()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');setTimeout(()=>frame.src='about:blank',250);$('#businessOpen').focus()};
  $('#businessOpen').addEventListener('click',open);$('#demoClose').addEventListener('click',close);$('#demoScrim').addEventListener('click',close);
  window.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))close();});
}

function initMenu(){
  const overlay=$('#menuOverlay'),openBtn=$('#menuOpen'),closeBtn=$('#menuClose');
  const open=()=>{overlay.classList.add('open');overlay.setAttribute('aria-hidden','false');openBtn.setAttribute('aria-expanded','true');document.body.classList.add('menu-open');setTimeout(()=>closeBtn.focus(),80)};
  const close=()=>{overlay.classList.remove('open');overlay.setAttribute('aria-hidden','true');openBtn.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')};
  openBtn.addEventListener('click',()=>overlay.classList.contains('open')?close():open());closeBtn.addEventListener('click',close);$$('[data-menu-link]').forEach(a=>a.addEventListener('click',close));window.addEventListener('keydown',e=>{if(e.key==='Escape'&&overlay.classList.contains('open'))close()});
}

function initReveal(){
  if(reduced){$$('.reveal').forEach(el=>el.classList.add('in-view'));return;}
  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in-view');io.unobserve(e.target)}}),{rootMargin:'0px 0px -10% 0px'});$$('.reveal').forEach(el=>io.observe(el));
}

function initScroll(){
  const header=$('#siteHeader'),progress=$('#scrollProgress');
  const navMap=[...$$('[data-nav]')];
  const sections=navMap.map(a=>({id:a.dataset.nav,el:document.getElementById(a.dataset.nav),a})).filter(x=>x.el);
  let lastY=window.scrollY;
  const onScroll=()=>{
    const y=window.scrollY;header.classList.toggle('scrolled',y>30);
    const doc=document.documentElement;const max=doc.scrollHeight-window.innerHeight;progress.style.transform=`scaleX(${max?y/max:0})`;
    const line=y+window.innerHeight*.35;let active=sections[0];for(const s of sections){if(s.el.offsetTop<=line)active=s;}sections.forEach(s=>s.a.classList.toggle('active',s===active));
    const dy=y-lastY;window.__scrollVelocity=dy;lastY=y;
  };
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll,{passive:true});
}

function initParallax(){
  if(reduced)return;
  const planes=$$('[data-parallax]');let ticking=false;
  const update=()=>{const hero=$('#inicio');const r=hero.getBoundingClientRect();const p=Math.min(1,Math.max(0,-r.top/Math.max(1,r.height)));planes.forEach(el=>{const factor=parseFloat(el.dataset.parallax||0);el.style.transform=`translate3d(0,${p*180*factor}px,0)`});ticking=false};
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(update);ticking=true}},{passive:true});update();
}

function initMagnetic(){
  if(reduced||!window.matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  $$('.magnetic').forEach(el=>{el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();const x=(e.clientX-(r.left+r.width/2))*.16;const y=(e.clientY-(r.top+r.height/2))*.16;el.style.transform=`translate(${x}px,${y}px)`});el.addEventListener('mouseleave',()=>el.style.transform='')});
}

function initSpotlights(){
  if(!window.matchMedia('(hover:hover)').matches)return;
  $$('.spotlight').forEach(el=>el.addEventListener('mousemove',e=>{const r=el.getBoundingClientRect();el.style.setProperty('--mx',`${e.clientX-r.left}px`);el.style.setProperty('--my',`${e.clientY-r.top}px`)}));
}

function initMarquees(){
  const rows=$$('[data-marquee]');if(!rows.length)return;
  const states=rows.map(row=>({row,strip:$('.marquee-strip',row),x:0,base:parseFloat(row.dataset.speed||20)}));let last=performance.now();
  function tick(now){const dt=Math.min(.04,(now-last)/1000);last=now;const boost=reduced?0:Math.max(-80,Math.min(80,window.__scrollVelocity||0))*1.2;states.forEach(s=>{const dir=Math.sign(s.base)||1;s.x+=(s.base+boost*dir)*dt;const w=s.strip.scrollWidth/2||1000;if(s.x>w)s.x-=w;if(s.x<-w)s.x+=w;s.strip.style.transform=`translate3d(${s.x}px,0,0)`});window.__scrollVelocity=(window.__scrollVelocity||0)*.92;requestAnimationFrame(tick)}requestAnimationFrame(tick);
}

function initProcessRail(){
  const wrap=$('#processSteps'),fill=$('#processFill');if(!wrap||!fill)return;
  const update=()=>{const r=wrap.getBoundingClientRect();const start=window.innerHeight*.72;const end=window.innerHeight*.28-r.height;const raw=(start-r.top)/(start-end);const p=Math.min(1,Math.max(0,raw));fill.style.transform=`scaleY(${reduced?1:p})`};update();window.addEventListener('scroll',update,{passive:true});window.addEventListener('resize',update,{passive:true});
}

function initDiagnostic(){
  const selected=new Set();
  $('#diagNeeds').innerHTML=diagOptions.map(o=>`<button class="diag-need" type="button" data-need="${o.id}" aria-pressed="false"><b>${o.label}</b></button>`).join('');
  const update=()=>{const count=selected.size;$('#diagCount').textContent=count;$('#diagProgress').style.transform=`scaleX(${count/diagOptions.length})`;$('#diagStatus').textContent=count?`${Math.round(count/diagOptions.length*100)}% del alcance seleccionado`:'Completa tu selección';const rec=diagOptions.filter(o=>selected.has(o.id));$('#recommendList').innerHTML=rec.length?rec.slice(0,5).map((o,i)=>`<div class="rec-item"><span>0${i+1}</span><div><b>${o.label}</b><small>${o.desc}</small></div></div>`).join(''):'<p class="empty-state">Selecciona al menos una necesidad para construir la recomendación.</p>';$('#diagSend').disabled=!(($('#businessType').value||count)&&$('#privacyConsent').checked)};
  $$('.diag-need').forEach(b=>b.addEventListener('click',()=>{const id=b.dataset.need;if(selected.has(id))selected.delete(id);else selected.add(id);const on=selected.has(id);b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on));update()}));
  ['businessType','clientName','businessName','privacyConsent'].forEach(id=>$('#'+id).addEventListener(id==='businessType'||id==='privacyConsent'?'change':'input',update));
  $('#diagSend').addEventListener('click',()=>{if($('#diagSend').disabled)return;const name=$('#clientName').value.trim()||'un cliente';const business=$('#businessName').value.trim()||'mi negocio';const type=$('#businessType').value||'otro tipo de negocio';const labels=diagOptions.filter(o=>selected.has(o.id)).map(o=>o.label);const msg=`MicroPCExpress — Diagnóstico Digital\n\nHola Erik, soy ${name}.\nMi negocio es ${business} (${type}).\n\nQuiero mejorar:\n• ${labels.join('\n• ')||'Necesito orientación general'}\n\nMe gustaría conversar sobre una solución para mi negocio.`;window.open(WA+'?text='+encodeURIComponent(msg),'_blank','noopener')});
  update();
}

function initOrbit(){
  const stage=$('#ecosystemVisual');if(!stage||reduced)return;let rx=0,ry=0;stage.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();rx=(e.clientX-r.left-r.width/2)/r.width;ry=(e.clientY-r.top-r.height/2)/r.height;stage.style.transform=`perspective(1000px) rotateX(${ry*-2.5}deg) rotateY(${rx*3.5}deg)`});stage.addEventListener('pointerleave',()=>stage.style.transform='');
}

function initBackTop(){
  $('#backTop').addEventListener('click',()=>window.scrollTo({top:0,behavior:reduced?'auto':'smooth'}));
}

function initSmoothAnchors(){
  document.addEventListener('click',e=>{const a=e.target.closest('a[href^="#"]');if(!a)return;const id=a.getAttribute('href');if(id==='#')return;const target=$(id);if(!target)return;e.preventDefault();target.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});});
}

function init(){
  document.body.classList.add('ready');
  $('#year').textContent=new Date().getFullYear();
  renderSolutionTabs();renderBusinessTabs();initBusinessModal();initMenu();initReveal();initScroll();initParallax();initMagnetic();initSpotlights();initMarquees();initProcessRail();initDiagnostic();initOrbit();initBackTop();initSmoothAnchors();
}

document.addEventListener('DOMContentLoaded',()=>requestAnimationFrame(init));
