/* =========================================================
   MICROPCEXPRESS — SOLUCIONES DIGITALES PARA NEGOCIOS
   REACTIVE ENGINE & DEMO BUSINESS STATE PROVIDER
   ========================================================= */

const $=(s,p=document)=>p.querySelector(s),$$=(s,p=document)=>[...p.querySelectorAll(s)];
const A='assets/';
const srcsetFor=src=>src.endsWith('.webp')?`${src.replace('.webp','-480.webp')} 480w, ${src} 900w`:'';
const track=(event,params={})=>{try{window.mpcTrack?.(event,params)}catch(_){}};

/* =========================================================
   01 — SHARED STATE ENGINE (DEMO BUSINESS PROVIDER)
   ========================================================= */
const initialStore = {
  inventory: [
    { sku: 'CAF-101', name: 'Café Americano', stock: 32, min: 8, category: 'Cafés' },
    { sku: 'CAF-102', name: 'Cappuccino', stock: 18, min: 6, category: 'Cafés' },
    { sku: 'CAF-103', name: 'Latte', stock: 22, min: 6, category: 'Cafés' },
    { sku: 'BEB-201', name: 'Café Frío', stock: 9, min: 5, category: 'Bebidas Frías' },
    { sku: 'ALI-301', name: 'Sándwich de Pollo', stock: 7, min: 4, category: 'Alimentos' },
    { sku: 'REP-401', name: 'Cheesecake', stock: 4, min: 5, category: 'Repostería' },
    { sku: 'INS-501', name: 'Empaque biodegradable', stock: 3, min: 10, category: 'Insumos' }
  ],
  customers: [
    { id: 1, name: 'Ana Rodríguez', status: 'CLIENTE ACTIVO', last: 'Reserva confirmada · Hoy', history: ['Pedido POS #1082 ($18.50)', 'Stock descontado automáticamente', 'Reserva confirmada'] },
    { id: 2, name: 'Carlos Méndez', status: 'SEGUIMIENTO', last: 'Cotización enviada · Ayer', history: ['Cotización #EC-2026-014 ($1,200.00)', 'Enlace abierto por el cliente'] },
    { id: 3, name: 'María Batista', status: 'PROSPECTO', last: 'Consulta web · Hace 2 días', history: ['Formulario de contacto recibido'] }
  ],
  orders: 42,
  revenue: 18450,
  conversion: 18.2,
  activities: [
    { time: 'Hace 5 min', text: 'Venta registrada en POS (Mesa 4)', type: 'pos' },
    { time: 'Hace 12 min', text: 'Alerta: Empaque biodegradable bajo mínimo', type: 'alert' },
    { time: 'Hace 1 hora', text: 'Reserva confirmada para Ana Rodríguez', type: 'booking' }
  ]
};

let demoStore = JSON.parse(JSON.stringify(initialStore));

function resetDemoStore() {
  demoStore = JSON.parse(JSON.stringify(initialStore));
  notifyStoreUpdate();
}

function dispatchSaleCompleted(cartItems, totalAmount) {
  demoStore.orders += 1;
  demoStore.revenue += totalAmount;
  
  // Deduct inventory
  cartItems.forEach(item => {
    const invItem = demoStore.inventory.find(i => i.name.toLowerCase().includes(item.name.toLowerCase()));
    if (invItem) {
      invItem.stock = Math.max(0, invItem.stock - 1);
    }
  });

  // Add customer timeline activity
  demoStore.customers[0].history.unshift(`Venta POS registrada ($${totalAmount.toFixed(2)})`);
  demoStore.activities.unshift({
    time: 'Justo ahora',
    text: `Venta registrada ($${totalAmount.toFixed(2)}) → Inventario & Dashboard actualizados`,
    type: 'pos'
  });

  notifyStoreUpdate();
}

function notifyStoreUpdate() {
  // Re-render open demo components if active
  const activeSlug = location.hash.replace('#solution/', '');
  if (activeSlug && $('#experience').classList.contains('open')) {
    bindDemo(activeSlug);
  }
}

/* =========================================================
   02 — DATA DEFINITIONS (SOLUTIONS, INDUSTRIES, SCENARIOS)
   ========================================================= */
const solutions = [
  { slug: 'web', cat: 'sales', num: '01', title: 'PÁGINA WEB PROFESIONAL', desc: 'Presencia digital executive que explica tu propuesta, genera prestigio e impulsa contactos 24/7.', img: A+'restaurant.webp', tags: ['High-Converting UI/UX', 'SEO Local', 'Respuesta < 0.4s'], why: ['Tus clientes investigan tu marca antes de escribirte.', 'Una web executive transmite autoridad sobre tus competidores.', 'Funciona como un canal comercial activo las 24 horas.'], modules: ['Propuesta de valor', 'Catálogo de productos', 'Captura de Leads', 'Optimización Google SEO', 'Integración WhatsApp'] },
  { slug: 'ecommerce', cat: 'sales', num: '02', title: 'TIENDA ONLINE / ECOMMERCE', desc: 'Catálogo de productos, carrito de compras y pedidos directos a tu sistema o WhatsApp.', img: A+'retail.webp', tags: ['Catálogo Digital', 'Carrito', 'Pagos Online'], why: ['Permite a tus clientes comprar a cualquier hora sin depender de un vendedor.', 'Reduce errores en la toma de pedidos.', 'Centraliza tu catálogo con precios e imágenes actualizadas.'], modules: ['Catálogo por categorías', 'Carrito flotante', 'Cálculo de impuestos', 'Integración de Pagos', 'Notificación de pedidos'] },
  { slug: 'inventory', cat: 'ops', num: '03', title: 'SISTEMA DE INVENTARIO', desc: 'Control en tiempo real de existencias, mínimos configurables y alertas automáticas de reabastecimiento.', img: A+'inventory.webp', tags: ['Stock Real-Time', 'Kardex', 'Alertas de Mínimos'], why: ['Evita pérdidas por quiebres de stock impensados.', 'Optimiza el capital al comprar solo lo que rota.', 'Trazabilidad total entre compras y ventas.'], modules: ['Inventario en vivo', 'Alertas de reposición', 'Historial de movimientos', 'Control de proveedores', 'Categorías & SKU'] },
  { slug: 'crm', cat: 'clients', num: '04', title: 'CLIENTES / CRM', desc: 'Ficha 360°, historial de compras y seguimiento comercial organizado sin perder prospectos.', img: A+'clinic_web.webp', tags: ['Ficha 360°', 'Pipeline de Ventas', 'Seguimiento'], why: ['Un prospecto sin seguimiento a tiempo se enfría.', 'Todo el equipo conoce el contexto de cada cliente.', 'Permite campañas de fidelización según historial.'], modules: ['Directorio 360°', 'Etapas comerciales', 'Historial de interacciones', 'Recordatorios de tarea', 'Exportación de datos'] },
  { slug: 'pos', cat: 'sales', num: '05', title: 'POS / PUNTO DE VENTA', desc: 'Facturación rápida que descuenta stock automáticamente y actualiza clientes y reportes.', img: A+'pos-venta.webp', tags: ['Venta Rápida', 'Descuento de Stock', 'Cierre Diario'], why: ['Cobrar rápido elimina colas y errores de caja.', 'Sincronización instantánea con tu inventario central.', 'Cierres diarios de caja claros y sin descuadres.'], modules: ['Pantalla táctil POS', 'Facturación e ITBMS', 'Stock automático', 'Cierre diario', 'Múltiples métodos de pago'] },
  { slug: 'booking', cat: 'clients', num: '06', title: 'RESERVAS / CITAS ONLINE', desc: 'Agenda disponible 24/7 con disponibilidad en tiempo real, confirmaciones y recordatorios.', img: A+'beauty.webp', tags: ['Agenda 24/7', 'Confirmaciones', 'Recordatorios'], why: ['Tus clientes agendan sin esperar respuesta por chat.', 'Evita cruces de horarios y citas duplicadas.', 'Reduce ausencias con recordatorios automáticos.'], modules: ['Calendario interactivo', 'Reglas de horario', 'Confirmaciones WhatsApp', 'Historial por cliente', 'Anticipos en línea'] },
  { slug: 'app', cat: 'experience', num: '07', title: 'APLICACIONES MÓVIL', desc: 'Apps nativas e híbridas con notificaciones push, fidelización y herramientas de campo.', img: A+'app.webp', tags: ['iOS & Android', 'Push Notifications', 'Modo Offline'], why: ['Ocupas un lugar permanente en el celular de tu cliente.', 'Notificaciones directas con ofertas o avisos.', 'Simplifica tareas de equipos en la calle o campo.'], modules: ['Fidelización por puntos', 'Notificaciones push', 'Acceso biométrico', 'Historial de pedidos', 'Sincronización offline'] },
  { slug: 'quotes', cat: 'sales', num: '08', title: 'COTIZADOR AUTOMÁTICO', desc: 'Creación rápida de propuestas comerciales con vista previa y seguimiento de lectura.', img: A+'consulting.webp', tags: ['Propuestas B2B', 'Notificación Lectura', 'PDF Auto'], why: ['Envías cotizaciones impecables en menos de 2 minutos.', 'Sabes cuándo el cliente abre tu propuesta.', 'Control de estados: Borrador, Enviada, Aprobada.'], modules: ['Formulario interactivo', 'Cálculo de ítems', 'Seguimiento de estado', 'Exportación PDF', 'Historial comercial'] },
  { slug: 'dashboard', cat: 'management', num: '09', title: 'DASHBOARD / REPORTES', desc: 'KPIs, gráficos en tiempo real y alertas gerenciales para tomar mejores decisiones.', img: A+'dashboard-reportes.webp', tags: ['KPIs Gerenciales', 'Gráficos En Vivo', 'Automatización'], why: ['Información clara para decidir sin adivinar.', 'Detección temprana de bajas de ventas o quiebres.', 'Automatizaciones que ejecutan tareas repetitivas.'], modules: ['Indicadores clave', 'Gráficos interactivos', 'Flujos automáticos', 'Reportes periódicos', 'Control de permisos'] },
  { slug: 'automatizacion', cat: 'ops', num: '10', title: 'AUTOMATIZACIÓN DE FLUJOS', desc: 'Conecta procesos entre canales, inventario, facturación y avisos sin intervención manual.', img: A+'automatizacion-flujos.webp', tags: ['Integración APIs', 'Flujos Automáticos', 'Ahorro Tiempo'], why: ['Elimina tareas administrativas repetitivas.', 'Reduce errores de digitación manual entre sistemas.', 'Acelera la respuesta al cliente.'], modules: ['Conectores webhooks', 'Alertas por eventos', 'Formatos de correo/WA', 'Reglas de negocio', 'Bitácora de ejecuciones'] },
  { slug: 'portales', cat: 'experience', num: '11', title: 'PORTALES INTERNOS', desc: 'Plataformas exclusivas para empleados, proveedores o clientes con acceso seguro.', img: A+'portales-internos.webp', tags: ['Acceso Seguro', 'Documentos', 'Roles'], why: ['Centraliza archivos y solicitudes internas.', 'Permite a proveedores ver pedidos o pagos.', 'Seguridad basada en roles de usuario.'], modules: ['Autenticación de usuarios', 'Gestor documental', 'Tickets de soporte', 'Panel por rol', 'Auditoría de ingresos'] },
  { slug: 'custom', cat: 'management', num: '12', title: 'SISTEMAS A LA MEDIDA', desc: 'Software diseñado específicamente alrededor de las reglas de operación de tu empresa.', img: A+'sistemas-medida.webp', tags: ['Código Custom', 'Reglas Únicas', '100% Escalable'], why: ['Se adapta al 100% a la forma en que trabaja tu negocio.', 'Sin licencias mensuales por usuario de terceros.', 'Escala sin límites conforme crece la empresa.'], modules: ['Arquitectura a medida', 'Bases de datos dedicadas', 'APIs personalizadas', 'Panel gerencial', 'Soporte continuo'] }
];

const industries = [
  ['RESTAURANTES & CAFETERÍAS', 'Web Executive · Menú Digital · Pedidos · Reservas · POS · Inventario', A+'restaurant.webp'],
  ['TIENDAS & COMERCIOS', 'Web · eCommerce · POS · Inventario · Clientes · Reportes', A+'retail.webp'],
  ['CLÍNICAS & CONSULTORIOS', 'Web Executive · Citas 24/7 · Clientes · Recordatorios Auto · Historial', A+'clinic_web.webp'],
  ['SALONES & BELLEZA', 'Web · Reservas Online · Clientes · Loyalty App · Recordatorios WhatsApp', A+'beauty.webp'],
  ['FARMACIAS & FERRETERÍAS', 'Inventario Kardex · POS Multi-caja · Proveedores · Alertas · Catálogo Web', A+'pharmacy_pos.webp'],
  ['SERVICIOS PROFESIONALES', 'Web Executive · CRM Pro · Cotizador Automático · Seguimiento · Dashboard', A+'consulting.webp']
];

const scenarios = [
  ['DE MENSAJES SUELTOS A UN PROCESO ORGANIZADO', 'Pedidos por WhatsApp, notas en papel y llamadas dispersas.', 'Pedido → cliente → inventario → reporte automático.'],
  ['DE CONTROL REACTIVO A GESTIÓN INTELIGENTE', 'Descubres que falta producto cuando el cliente lo solicita.', 'Mínimo de stock → alerta automática → orden de reposición.'],
  ['DE COTIZAR Y OLVIDAR A SEGUIMIENTO VISIBLE', 'Envías una propuesta y la conversación se pierde entre chats.', 'Cotización → notificación de lectura → seguimiento → decisión.'],
  ['DE CITAS MANUALES A AGENDA AUTÓNOMA 24/7', 'Cruces de horarios y confirmaciones una por una por mensaje.', 'Disponibilidad en vivo → reserva → confirmación → historial.']
];

const needs = solutions.map(s => [s.slug, s.title]);

let scenario = 0;
let fullMode = false;
let selectedNeeds = [];
let cart = [];
let currentLightboxIndex = 0;

const showroomItems = [
  { title: 'Zapatería · Paso Firme', preview: 'previews/zapateria.html' },
  { title: 'Panadería · La Estrella', preview: 'previews/panaderia.html' },
  { title: 'Farmacia · VidaSalud', preview: 'previews/farmacia.html' },
  { title: 'Clínica · Bienestar', preview: 'previews/clinica.html' },
  { title: 'Cafetería · El Buen Café', preview: 'previews/cafeteria.html' },
  { title: 'Mini-super · Don Marco', preview: 'previews/minisuper.html' }
];

/* =========================================================
   03 — INITIALIZATION & EVENT LISTENERS
   ========================================================= */
function init() {
  renderSolutions();
  setupMobileSolutionCompact();
  setupSingleSolutionCTAs();
  renderIndustries();
  renderScenario();
  renderMode();
  renderSteps();
  renderNeeds();
  setupReveal();
  setupScroll();
  setupMenu();
  setupFlow();
  setupDiagnosis();
  setupPrivacy();
  setupTerms();
  setupContactFallback();
  setupTracking();
  setupMagnetic();
  setupHeroDrift();
  setupShowroomLightbox();
  setupBackToTop();
  setTimeout(checkHash, 150);
}

/* =========================================================
   04 — CORE UI RENDERERS & SETUP
   ========================================================= */
function setupShowroomLightbox() {
  const modal = $('#lightboxModal');
  const frame = $('#lightboxFrame');
  const title = $('#lightboxTitle');
  const counter = $('#lightboxCounter');
  const address = $('#previewAddress');
  const stage = $('#previewStage');
  const close = $('#lightboxClose');
  const prev = $('#lightboxPrev');
  const next = $('#lightboxNext');
  const desktop = $('#previewDesktop');
  const mobile = $('#previewMobile');
  if (!modal || !frame) return;

  $$('.showroom-item').forEach((item, index) => {
    item.setAttribute('role', item.getAttribute('role') || 'button');
    if (!item.hasAttribute('tabindex')) item.tabIndex = 0;
    item.onclick = () => {
      currentLightboxIndex = index;
      openPreview();
    };
    item.onkeydown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        currentLightboxIndex = index;
        openPreview();
      }
    };
  });

  function openPreview() {
    const data = showroomItems[currentLightboxIndex];
    frame.src = data.preview;
    title.textContent = data.title;
    counter.textContent = `0${currentLightboxIndex + 1} / 0${showroomItems.length}`;
    address.textContent = `DEMO INTERACTIVA · MICROPCEXPRESS · ${data.preview.split('/').pop().replace('.html','').toUpperCase()}`;
    if (window.matchMedia('(max-width: 760px)').matches) stage.classList.add('mobile-mode');
    else stage.classList.remove('mobile-mode');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    close.focus();
  }

  function closePreview() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
    frame.src = 'about:blank';
  }

  close.onclick = closePreview;
  prev.onclick = () => {
    currentLightboxIndex = (currentLightboxIndex - 1 + showroomItems.length) % showroomItems.length;
    openPreview();
  };
  next.onclick = () => {
    currentLightboxIndex = (currentLightboxIndex + 1) % showroomItems.length;
    openPreview();
  };
  desktop.onclick = () => stage.classList.remove('mobile-mode');
  mobile.onclick = () => stage.classList.add('mobile-mode');
  modal.onclick = (e) => { if (e.target === modal) closePreview(); };
}

function setupBackToTop() {
  const btn = $('#backToTop');
  if (!btn) return;
  btn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
}

function setupPrivacy() {
  const modal = $('#privacyModal');
  if (!modal) return;
  const openers = [$('#privacyOpen'), $('#privacyFooter')].filter(Boolean);
  const open = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    requestAnimationFrame(() => $('#privacyClose')?.focus());
  };
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
  };
  openers.forEach(button => button.addEventListener('click', open));
  $('#privacyClose')?.addEventListener('click', close);
  $('#privacyAccept')?.addEventListener('click', close);
  $('#privacyBackdrop')?.addEventListener('click', close);
}


function setupTerms() {
  const modal = $('#termsModal');
  if (!modal) return;
  const openers = [$('#termsOpen'), $('#termsOpenFromErik'), $('#termsFooter')].filter(Boolean);
  const open = () => {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('lock');
    requestAnimationFrame(() => $('#termsClose')?.focus());
  };
  const close = () => {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
  };
  openers.forEach(button => button.addEventListener('click', open));
  $('#termsClose')?.addEventListener('click', close);
  $('#termsAccept')?.addEventListener('click', close);
  $('#termsBackdrop')?.addEventListener('click', close);
}

function setupContactFallback() {
  const b = $('#copyContact');
  if (!b) return;
  b.onclick = async () => {
    const text = 'MicroPCExpress · Erik Coronado · WhatsApp +507 6012-4997 · David, Chiriquí, Panamá';
    try { await navigator.clipboard.writeText(text); $('#contactStatus').textContent = 'Datos de contacto copiados.'; }
    catch (_) { $('#contactStatus').textContent = text; }
    track('contact_copy');
  };
}

function setupTracking() {
  $$('.track-whatsapp,.wa').forEach(a => a.addEventListener('click', () => track('whatsapp_click', { source: a.classList.contains('wa') ? 'floating' : 'contact' })));
}

function setupReveal() {
  const items = $$('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(x => x.classList.add('in'));
    return;
  }
  const o = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } }), { threshold: .08, rootMargin: '120px 0px' });
  items.forEach(x => o.observe(x));
}

function setupScroll() {
  addEventListener('scroll', () => {
    const m = document.documentElement.scrollHeight - innerHeight;
    $('#progress').style.transform = `scaleX(${m ? scrollY / m : 0})`;
    $('#header').classList.toggle('scrolled', scrollY > 40);
    $('#backToTop')?.classList.toggle('visible', scrollY > 600);
    const wa = $('.wa');
    if (wa) wa.classList.toggle('mobile-visible', scrollY > Math.min(520, innerHeight * .68));
  }, { passive: true });
}

function setupMenu() {
  const o = $('#menuOverlay');
  const trigger = $('#menuBtn');
  trigger?.setAttribute('aria-expanded', 'false');
  trigger.onclick = () => { o.classList.add('open'); o.setAttribute('aria-hidden', 'false'); trigger.setAttribute('aria-expanded', 'true'); document.body.classList.add('lock'); $('#menuClose')?.focus(); };
  $('#menuClose').onclick = close;
  $$('.menu-list a').forEach(a => a.onclick = close);
  function close() { o.classList.remove('open'); o.setAttribute('aria-hidden', 'true'); trigger?.setAttribute('aria-expanded', 'false'); document.body.classList.remove('lock'); trigger?.focus(); }
}

function setupHeroDrift() {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  const h = $('#heroVisual'), s = $('.ecosystem-cluster');
  if (!h || !s) return;
  h.addEventListener('pointermove', e => {
    const r = h.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    s.style.transform = `translate(${x * 10}px,${y * 8}px)`;
  });
  h.onpointerleave = () => { s.style.transform = ''; };
}

function setupMagnetic() {
  if (!matchMedia('(hover:hover) and (pointer:fine)').matches) return;
  $$('.magnetic').forEach(el => {
    el.onpointermove = e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .12}px,${(e.clientY - r.top - r.height / 2) * .12}px)`;
    };
    el.onpointerleave = () => el.style.transform = '';
  });
}

function setupFlow() {
  const info = $('#flowInfo'), texts = {
    cliente: ['CLIENTE', 'Todo comienza cuando una persona busca información, agendar una cita o realizar una compra.'],
    web: ['WEB / APP', 'La plataforma explica tu oferta, transmite confianza y guía hacia la acción comercial.'],
    pedido: ['PEDIDO / CITA', 'La intención del cliente se registra como una solicitud clara en el sistema.'],
    pos: ['POS / AGENDA', 'El punto de venta o agenda procesa la venta sin errores manuales.'],
    inventario: ['INVENTARIO', 'El stock se descuenta automáticamente y genera alertas si llega al mínimo.'],
    crm: ['CRM', 'El historial del cliente se actualiza para futuros seguimientos o ventas.'],
    reportes: ['REPORTES', 'Ingresos, ventas e indicadores se reflejan en el panel gerencial.'],
    decision: ['DECISIÓN', 'Utilizas información en tiempo real para hacer crecer tu negocio.']
  };
  $$('#flowBoard button').forEach((b, i) => b.onclick = () => {
    $$('#flowBoard button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const t = texts[b.dataset.node];
    info.innerHTML = `<small>ETAPA ${String(i + 1).padStart(2, '0')} · CONEXIÓN</small><b>${t[0]}</b><p>${t[1]}</p>`;
  });
}

function renderSolutions() {
  const g = $('#solutionGrid');
  if (!g) return;
  g.innerHTML = solutions.map(s => `
    <article class="solution-card" data-cat="${s.cat}" data-slug="${s.slug}">
      <div class="solution-visual">
        <img src="${s.img}" srcset="${srcsetFor(s.img)}" sizes="(max-width: 620px) 100vw, 33vw" width="900" height="506" alt="${s.title}" loading="lazy">
      </div>
      <div class="solution-copy">
        <small>${s.num} · ${s.cat.toUpperCase()}</small>
        <h3>${s.title}</h3>
        <p>${s.desc}</p>
        <div class="tags">${s.tags.map(t => `<span>${t}</span>`).join('')}</div>
      </div>
    </article>
  `).join('');
  $$('.solution-card').forEach(c => c.onclick = () => openExperience(c.dataset.slug));
  $$('#filters button').forEach(b => b.onclick = () => {
    $$('#filters button').forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    const f = b.dataset.filter;
    $$('.solution-card').forEach(c => c.classList.toggle('hide', f !== 'all' && c.dataset.cat !== f));
    syncMobileSolutionCompact(f);
  });
}

function setupMobileSolutionCompact() {
  const grid = $('#solutionGrid');
  const wrap = $('#solutionMoreWrap');
  const btn = $('#solutionMore');
  if (!grid || !wrap || !btn) return;

  let expanded = false;
  const apply = () => {
    const mobile = matchMedia('(max-width:760px)').matches;
    const activeFilter = $('#filters button.active')?.dataset.filter || 'all';
    if (!mobile || activeFilter !== 'all') {
      grid.classList.remove('mobile-compact');
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    grid.classList.toggle('mobile-compact', !expanded);
    btn.textContent = expanded ? 'MOSTRAR MENOS' : 'VER LAS 12 SOLUCIONES';
    btn.setAttribute('aria-expanded', String(expanded));
  };

  btn.onclick = () => {
    expanded = !expanded;
    apply();
    if (!expanded) $('#soluciones')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  window.addEventListener('resize', apply, { passive:true });
  grid._syncCompact = (filter='all') => {
    if (filter !== 'all') expanded = true;
    else if (matchMedia('(max-width:760px)').matches) expanded = false;
    apply();
  };
  apply();
}

function syncMobileSolutionCompact(filter='all') {
  $('#solutionGrid')?._syncCompact?.(filter);
}

function setupSingleSolutionCTAs() {
  $$('[data-open-solution]').forEach(card => {
    const button = card.querySelector('button');
    if (!button) return;
    button.addEventListener('click', () => openExperience(card.dataset.openSolution));
  });
}

function renderIndustries() {
  const g = $('#industryGrid');
  if (!g) return;
  g.innerHTML = industries.map((x, i) => `
    <article class="industry-card">
      <img src="${x[2]}" srcset="${srcsetFor(x[2])}" sizes="(max-width: 620px) 100vw, 33vw" width="900" height="506" alt="${x[0]}" loading="lazy">
      <div>
        <small>0${i + 1} · ECOSISTEMA SUGERIDO</small>
        <h3>${x[0]}</h3>
        <p>${x[1]}</p>
      </div>
    </article>
  `).join('');
}

function renderScenario() {
  const s = scenarios[scenario];
  $('#scenarioCount').textContent = `0${scenario + 1} / 0${scenarios.length}`;
  $('#scenarioBody').innerHTML = `
    <h3>${s[0]}</h3>
    <div class="scenario-panels">
      <article><small>ANTES</small><p>${s[1]}</p></article>
      <article><small>DESPUÉS</small><p>${s[2]}</p></article>
    </div>
  `;
  $('#scenarioDots').innerHTML = scenarios.map((_, i) => `<button class="${i === scenario ? 'active' : ''}" data-i="${i}"></button>`).join('');
  $$('#scenarioDots button').forEach(b => b.onclick = () => { scenario = +b.dataset.i; renderScenario(); });
}
$('#prevScenario').onclick = () => { scenario = (scenario - 1 + scenarios.length) % scenarios.length; renderScenario(); };
$('#nextScenario').onclick = () => { scenario = (scenario + 1) % scenarios.length; renderScenario(); };

function renderMode() {
  const d = fullMode ? [
    ['01', 'ARQUITECTURA', 'Diseñamos la estructura completa conectando ventas, inventario y gestión.'],
    ['02', 'IMPLEMENTACIÓN', 'Construimos los módulos principales por sprints semanales.'],
    ['03', 'EVOLUCIÓN', 'Medimos el desempeño y ampliamos funcionalidades según el crecimiento.']
  ] : [
    ['01', 'PRESENCIA', 'Resolvemos primero visibilidad, prestigio y captación de clientes.'],
    ['02', 'OPERACIÓN', 'Digitalizamos el proceso con mayor fricción (Inventario / POS / Citas).'],
    ['03', 'CONEXIÓN', 'Integramos nuevos módulos progresivamente conforme aporten valor.']
  ];
  $('#modeTitle').textContent = fullMode ? 'ECOSISTEMA COMPLETO CON ARQUITECTURA GLOBAL.' : 'POR ETAPAS, SIN COMPLICARLO.';
  $('#modeGrid').innerHTML = d.map(x => `<article><em>${x[0]}</em><b>${x[1]}</b><p>${x[2]}</p></article>`).join('');
  $('#modeSwitch').classList.toggle('on', fullMode);
  $('#modeSwitch').setAttribute('aria-checked', fullMode);
}
$('#modeSwitch').onclick = () => { fullMode = !fullMode; renderMode(); };

function renderSteps() {
  const s = [
    ['01', 'DIAGNÓSTICO', 'Entendemos cómo funciona hoy tu negocio.'],
    ['02', 'PRIORIDADES', 'Definimos qué proceso generará más impacto.'],
    ['03', 'ARQUITECTURA', 'Diseñamos la conexión entre módulos.'],
    ['04', 'DISEÑO', 'Creamos una experiencia visual limpia e intuitiva.'],
    ['05', 'DESARROLLO', 'Construimos el sistema con código limpio.'],
    ['06', 'REVISIÓN', 'Probamos con escenarios reales de tu negocio.'],
    ['07', 'ENTREGA', 'Publicamos la plataforma y capacitamos a tu equipo.'],
    ['08', 'SOPORTE', 'Monitoreamos, ajustamos y evolucionamos.']
  ];
  $('#steps').innerHTML = s.map(x => `<article><em>${x[0]}</em><h3>${x[1]}</h3><p>${x[2]}</p></article>`).join('');
}

function renderNeeds() {
  $('#needGrid').innerHTML = needs.map(n => `<button type="button" aria-pressed="false" data-slug="${n[0]}">${n[1]}</button>`).join('');
  $$('#needGrid button').forEach(b => b.onclick = () => {
    const s = b.dataset.slug;
    b.classList.toggle('active');
    b.setAttribute('aria-pressed', String(b.classList.contains('active')));
    selectedNeeds = b.classList.contains('active') ? [...new Set([...selectedNeeds, s])] : selectedNeeds.filter(x => x !== s);
    updateRec();
  });
}

function setupDiagnosis() {
  const bt = $('#businessType'), cn = $('#clientName'), bn = $('#businessName'), pc = $('#privacyConsent');
  bt.onchange = updateRec;
  cn.oninput = updateRec;
  bn.oninput = updateRec;
  pc.onchange = updateRec;
  $('#diagSend').onclick = sendDiag;
}

function updateRec() {
  const sel = solutions.filter(s => selectedNeeds.includes(s.slug)).slice(0, 4),
    hasIntent = !!$('#businessType').value || !!sel.length,
    consent = $('#privacyConsent')?.checked;
  $('#diagSend').disabled = !(hasIntent && consent);

  let estWeeks = sel.length > 2 ? '3 a 4 semanas' : (sel.length > 0 ? '2 a 3 semanas' : '1 a 2 semanas');
  let stack = selectedNeeds.includes('app') ? 'React Native + Node + Cloudflare' : (selectedNeeds.includes('dashboard') || selectedNeeds.includes('crm') ? 'Next.js + PostgreSQL + Node' : 'Next.js Custom + Tailwind + Vercel');
  const badge = $('#techEstimateBadge');
  if (badge) badge.innerHTML = `<span>⏱ Tiempo est.: <b>${estWeeks}</b></span> | <span>⚡ Stack: <b>${stack}</b></span>`;

  $('#recommendList').innerHTML = sel.length ? sel.map((s, i) => `
    <div class="rec-item">
      <b>0${i + 1}</b>
      <div><strong>${s.title}</strong><span>${s.desc}</span></div>
    </div>
  `).join('') : '<div class="empty">Selecciona tus objetivos para construir la recomendación.</div>';
}

async function sendDiag() {
  if (!$('#privacyConsent')?.checked) { $('#privacyConsent')?.focus(); return; }
  const n = $('#clientName').value.trim() || 'un cliente',
    bn = $('#businessName').value.trim() || 'mi negocio',
    bt = $('#businessType').value || 'sector general',
    sel = solutions.filter(s => selectedNeeds.includes(s.slug));

  let estWeeks = sel.length > 2 ? '3 a 4 semanas' : (sel.length > 0 ? '2 a 3 semanas' : '1 a 2 semanas');
  let stack = selectedNeeds.includes('app') ? 'React Native + Node' : 'Next.js Custom + Tailwind';
  const text = `MicroPCExpress — Soluciones Digitales\n\nHola Erik Coronado, soy ${n}.\nMi negocio es ${bn} (${bt}).\n\nQuiero mejorar mi negocio con:\n📌 Alcance: ${sel.map(s => s.title).join(', ') || 'Asesoría general'}\n⏱ Estimado: ${estWeeks}\n⚡ Stack sugerido: ${stack}\n\nMe gustaría conversar sobre las soluciones para mi empresa.`;
  
  open('https://wa.me/50760124997?text=' + encodeURIComponent(text), '_blank', 'noopener');
}

/* =========================================================
   05 — SOLUTION EXPERIENCE LAB & REACIVE DEMOS
   ========================================================= */
function openExperience(slug) {
  const s = solutions.find(x => x.slug === slug), e = $('#experience');
  if (!s) return;
  $('#expCrumb').textContent = s.title;
  $('#experienceContent').innerHTML = `
    <section class="exp-hero">
      <div>
        <span class="eyebrow">${s.num} · MICROPCEXPRESS · SOLUCIONES DIGITALES</span>
        <h1>${s.title}</h1>
        <p>${s.desc}</p>
        <a class="btn primary magnetic" target="_blank" rel="noopener" href="https://wa.me/50760124997?text=${encodeURIComponent('Hola Erik, vi la demo de ' + s.title + ' en MicroPCExpress y me gustaría evaluarla para mi negocio.')}">SOLICITAR ASESORÍA POR WHATSAPP ↗</a>
      </div>
      <img src="${s.img}" srcset="${srcsetFor(s.img)}" sizes="(max-width: 1000px) 100vw, 45vw" width="900" height="506" alt="${s.title}" loading="lazy">
    </section>

    <section class="exp-section">
      <div class="exp-grid">
        <div>
          <span class="eyebrow">POR QUÉ LO NECESITAS</span>
          <h2>LA TECNOLOGÍA TIENE VALOR CUANDO ELIMINA UNA FRICCIÓN.</h2>
        </div>
        <div class="why-cards">
          ${s.why.map((w, i) => `<article><em>0${i + 1}</em><p>${w}</p></article>`).join('')}
        </div>
      </div>
    </section>

    <section class="exp-section">
      <div class="section-head">
        <span class="eyebrow">DEMO EN VIVO · DATOS FICTICIOS</span>
        <h2>PRUÉBALO COMO SI FUERA TU PROPIO NEGOCIO.</h2>
        <p>Los datos son demostrativos, pero el estado se sincroniza en tiempo real entre inventario, ventas y reportes.</p>
      </div>
      <div class="demo-shell">
        ${demoMarkup(slug)}
      </div>
    </section>

    <section class="exp-section">
      <span class="eyebrow">MÓDULOS POSIBLES</span>
      <h2>PUEDES EMPEZAR CON LO PRIORITARIO Y CONECTAR MÁS DESPUÉS.</h2>
      <div class="modules">
        ${s.modules.map(m => `<article class="module-card"><b>${m}</b><span>Configurable según las reglas operativas de tu empresa.</span></article>`).join('')}
      </div>
    </section>
  `;
  e.classList.add('open');
  e.setAttribute('aria-hidden', 'false');
  document.body.classList.add('lock');
  history.replaceState(null, '', '#solution/' + slug);
  setTimeout(() => { e.scrollTo(0, 0); $('#expClose')?.focus(); }, 10);
  bindDemo(slug);
}

$('#expClose').onclick = closeExperience;
function closeExperience() {
  const e = $('#experience');
  if (!e.classList.contains('open')) return;
  e.classList.remove('open');
  e.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('lock');
  history.replaceState(null, '', '#soluciones');
}

function checkHash() {
  if (location.hash.startsWith('#solution/')) openExperience(location.hash.split('/')[1]);
}

/* =========================================================
   06 — DEMO MARKUP & BINDINGS (INTERCONNECTED WOW MOMENTS)
   ========================================================= */
function demoMarkup(slug) {
  if (slug === 'inventory') {
    return `
      <div class="demo-top"><span>● ● ●</span><b>SISTEMA DE INVENTARIO DEMO</b><span>DATOS DEMOSTRATIVOS</span></div>
      <div class="demo-body">
        <div class="demo-kpis">
          <div><small>PRODUCTOS TOTALES</small><b>${demoStore.inventory.length}</b></div>
          <div><small>STOCK CRÍTICO</small><b id="lowKpi" style="color:var(--teal)">${demoStore.inventory.filter(i => i.stock <= i.min).length}</b></div>
          <div><small>ORDENES HOY</small><b>${demoStore.orders}</b></div>
          <div><small>INGRESOS DEMO</small><b>B/. ${demoStore.revenue.toLocaleString()}</b></div>
        </div>
        <div class="demo-controls">
          <input id="invSearch" placeholder="Buscar producto o SKU…" />
          <button id="lowFilter">SOLO STOCK CRÍTICO</button>
          <button id="saleSim">SIMULAR ENTRADA DE STOCK</button>
          <button id="resetDemo" style="margin-left:auto;font-size:10px;background:#f0faf8;color:var(--teal);border-color:var(--teal-light)">REINICIAR DEMO</button>
        </div>
        <table class="demo-table">
          <thead><tr><th>SKU</th><th>PRODUCTO</th><th>CATEGORÍA</th><th>STOCK</th><th>MÍNIMO</th><th>ESTADO</th></tr></thead>
          <tbody id="invRows"></tbody>
        </table>
      </div>
    `;
  }

  if (slug === 'pos' || slug === 'ecommerce') {
    return `
      <div class="demo-top"><span>● ● ●</span><b>PUNTO DE VENTA / POS DEMO</b><span>SINCRONIZACIÓN EN VIVO</span></div>
      <div class="demo-body demo-layout">
        <div class="products-demo pos-demo-grid" id="posProducts"></div>
        <div class="cart-box">
          <b>CARRITO DE PEDIDO</b>
          <p class="demo-helper" style="font-size:11px;color:#6b8292;margin:6px 0 12px">Selecciona productos. Al registrar la venta, el stock se descontará en el Inventario y la transacción actualizará el Dashboard.</p>
          <div id="cartRows" style="min-height:160px"></div>
          <div class="cart-row"><span>SUBTOTAL</span><b id="cartSubtotal">B/. 0.00</b></div>
          <div class="cart-row"><span>ITBMS (7%)</span><b id="cartTax">B/. 0.00</b></div>
          <div class="cart-row" style="font-size:14px;color:var(--navy);font-weight:800"><span>TOTAL</span><b id="cartTotal">B/. 0.00</b></div>
          <button id="completeSale" style="width:100%;margin-top:12px;border:0;border-radius:14px;padding:14px;background:var(--navy);color:#fff;font-weight:900;cursor:pointer">REGISTRAR VENTA EN VIVO ↗</button>
          <div id="saleResult" style="font-size:12px;color:var(--teal);margin-top:12px;font-weight:700;line-height:1.5"></div>
        </div>
      </div>
    `;
  }

  if (slug === 'crm') {
    return `
      <div class="demo-top"><span>● ● ●</span><b>CRM & CLIENTES DEMO</b><span>FICHA 360°</span></div>
      <div class="demo-body demo-layout">
        <div class="info-box" id="clientList"></div>
        <div class="info-box">
          <span class="eyebrow">FICHA DE CLIENTE 360°</span>
          <h3 id="crmName" style="font-size:24px;color:var(--navy);margin:6px 0">ANA RODRÍGUEZ</h3>
          <p id="crmState" style="color:var(--teal);font-size:12px;font-weight:800">CLIENTE ACTIVO</p>
          <div id="crmTimeline" style="margin-top:14px"></div>
        </div>
      </div>
    `;
  }

  if (slug === 'booking') {
    return `
      <div class="demo-top"><span>● ● ●</span><b>AGENDA DE RESERVAS DEMO</b><span>CONFIRMACIÓN AUTOMÁTICA</span></div>
      <div class="demo-body demo-layout">
        <div class="info-box">
          <div class="demo-controls" id="days"></div>
          <div class="products-demo" id="slots"></div>
        </div>
        <div class="info-box">
          <span class="eyebrow">DETALLE DE RESERVA</span>
          <h3 id="bookPick" style="font-size:22px;color:var(--navy);margin:8px 0">ELIGE FECHA Y HORA</h3>
          <p style="font-size:13px;color:#5f7789;line-height:1.6">Disponibilidad en vivo, recordatorios automáticos por WhatsApp y registro inmediato.</p>
          <button id="bookNow" style="width:100%;margin-top:16px;border:0;border-radius:12px;padding:14px;background:var(--teal);color:#fff;font-weight:900;cursor:pointer">CONFIRMAR RESERVA DEMO ↗</button>
          <p id="bookResult" style="font-size:12px;color:var(--teal);font-weight:700;margin-top:12px"></p>
        </div>
      </div>
    `;
  }

  if (slug === 'app') {
    return `
      <div class="demo-top"><span>● ● ●</span><b>APLICACIÓN MÓVIL DEMO</b><span>EXPERIENCIA DE USUARIO</span></div>
      <div class="demo-body">
        <div class="phone-demo">
          <b>Hola, Ana 👋</b>
          <div class="offer">
            <small>BENEFICIO DE BIENVENIDA</small>
            <h3 style="margin:4px 0 10px;font-size:20px">2x PUNTOS EN COMPRAS</h3>
            <button id="addPoints">ACTIVAR BENEFICIO +50 PTS</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px">
            <button data-app="PEDIR">PEDIR</button>
            <button data-app="RESERVAR">RESERVAR</button>
            <button data-app="PUNTOS">PUNTOS</button>
          </div>
          <div class="info-box" style="margin-top:12px">
            <b id="appPanel">REPETIR PEDIDO #1082</b>
            <p id="pointsValue" style="font-size:12px;color:#5f7789;margin-top:4px">840 puntos acumulados</p>
          </div>
        </div>
      </div>
    `;
  }

  if (slug === 'quotes') {
    return `
      <div class="demo-top"><span>● ● ●</span><b>COTIZADOR AUTOMÁTICO DEMO</b><span>VALORES DEMOSTRATIVOS</span></div>
      <div class="demo-body quote-demo">
        <div class="quote-form">
          <label>EMPRESA CLIENTE</label>
          <input id="qClient" value="Comercial Chiriquí, S.A." />
          <label>SOLUCIÓN REQUERIDA</label>
          <select id="qService">
            <option>Página web executive + eCommerce</option>
            <option>Sistema de inventario + POS</option>
            <option>Ecosistema digital completo</option>
          </select>
          <label>INVERSIÓN DEMOSTRATIVA</label>
          <input id="qPrice" type="text" value="B/. 1,250.00 · dato demo" />
          <div class="demo-controls">
            <button data-status="BORRADOR" class="active">BORRADOR</button>
            <button data-status="ENVIADA">ENVIADA</button>
            <button data-status="APROBADA">APROBADA</button>
          </div>
        </div>
        <div class="quote-paper">
          <small>PROPUESTA #EC-2026-014</small>
          <h3 id="pqClient" style="font-size:22px;color:var(--navy);margin:8px 0">Comercial Chiriquí, S.A.</h3>
          <hr style="border:0;border-top:1px solid var(--border);margin:12px 0" />
          <p id="pqService" style="font-size:14px;color:#546e81">Página web executive + eCommerce</p>
          <h2 id="pqPrice" style="font-size:32px;color:var(--navy);margin:12px 0">B/. 1,250.00</h2>
          <b id="pqStatus" class="status">BORRADOR</b>
          <p style="font-size:11px;color:#748998;margin-top:14px;line-height:1.5">* Valores exclusivamente demostrativos. La inversión real se define según alcance de proyecto.</p>
        </div>
      </div>
    `;
  }

  if (slug === 'dashboard') {
    return `
      <div class="demo-top"><span>● ● ●</span><b>DASHBOARD GERENCIAL DEMO</b><span>ACTIVIDAD EN TIEMPO REAL</span></div>
      <div class="demo-body">
        <div class="demo-controls">
          <button data-metric="VENTAS" class="active">VENTAS</button>
          <button data-metric="CLIENTES">CLIENTES</button>
          <button data-metric="INVENTARIO">INVENTARIO</button>
          <button id="autoToggle" class="active">AUTOMATIZACIÓN ON</button>
        </div>
        <div class="demo-kpis">
          <div><small>INGRESOS DEMO</small><b>B/. ${demoStore.revenue.toLocaleString()}</b></div>
          <div><small>ÓRDENES TOTALES</small><b>${demoStore.orders}</b></div>
          <div><small>CLIENTES</small><b>${demoStore.customers.length}</b></div>
          <div><small>CONVERSIÓN</small><b>${demoStore.conversion}%</b></div>
        </div>
        <div class="demo-layout" style="margin-top:14px">
          <div class="info-box">
            <b id="metricTitle">VENTAS EN TIEMPO REAL</b>
            <div class="dash-bars" id="dashBars"></div>
          </div>
          <div class="info-box">
            <b>BITÁCORA DE ACTIVIDAD EN VIVO</b>
            <div id="flows" style="margin-top:10px"></div>
          </div>
        </div>
      </div>
    `;
  }

  // DEFAULT WEB DEMO SHOWCASE
  return `
    <div class="demo-top"><span>● ● ●</span><b>MICROPCEXPRESS STUDIO</b><span>SHOWROOM DE INTERFACES</span></div>
    <div class="demo-body">
      <span class="eyebrow">SHOWROOM DE PÁGINAS WEB</span>
      <h2 style="font-size:32px;color:var(--navy);margin:10px 0">TU NEGOCIO MERECE UNA PLATAFORMA A SU MEDIDA.</h2>
      <p style="color:#5a7284;max-width:700px;font-size:15px;line-height:1.6">Cada industria requiere una estructura de conversión diferente. Explora prototipos demostrativos por sector.</p>
      <div class="demo-controls" id="webFilters">
        <button class="active" data-web="todos">Todos</button>
        <button data-web="restaurante">Restaurantes</button>
        <button data-web="clinica">Clínicas</button>
        <button data-web="belleza">Belleza</button>
        <button data-web="servicios">Servicios</button>
      </div>
      <div class="products-demo web-demo-grid" id="webDemoGrid">
        ${[
          ['Restaurante Premium', 'Menú · Pedidos · Reservas', 'restaurante'],
          ['Clínica Médica', 'Servicios · Citas 24/7 · Contacto', 'clinica'],
          ['Salón & Belleza', 'Reservas · Loyalty · Promos', 'belleza'],
          ['Servicios Profesionales', 'Presencia · Cotizador · Leads', 'servicios'],
          ['Tienda eCommerce', 'Catálogo · Carrito · Pagos', 'servicios'],
          ['Landing Comercial', 'Campaña · Conversión Instantánea', 'servicios']
        ].map(x => `<button data-kind="${x[2]}"><b>${x[0]}</b><span>${x[1]} ↗</span></button>`).join('')}
      </div>
    </div>
  `;
}

function bindDemo(slug) {
  if (slug === 'inventory') {
    let lowOnly = false;
    const render = () => {
      const q = ($('#invSearch')?.value || '').toLowerCase();
      const rows = demoStore.inventory.filter(r => (!lowOnly || r.stock <= r.min) && (r.name.toLowerCase().includes(q) || r.sku.toLowerCase().includes(q)));
      $('#invRows').innerHTML = rows.map(r => `
        <tr>
          <td><b>${r.sku}</b></td>
          <td>${r.name}</td>
          <td>${r.category}</td>
          <td><b>${r.stock}</b></td>
          <td>${r.min}</td>
          <td><span class="status ${r.stock <= r.min ? 'bad' : ''}">${r.stock <= r.min ? 'REABASTECER' : 'OK'}</span></td>
        </tr>
      `).join('');
      $('#lowKpi').textContent = demoStore.inventory.filter(i => i.stock <= i.min).length;
    };
    render();
    if ($('#invSearch')) $('#invSearch').oninput = render;
    if ($('#lowFilter')) $('#lowFilter').onclick = () => { lowOnly = !lowOnly; $('#lowFilter').classList.toggle('active', lowOnly); render(); };
    if ($('#saleSim')) $('#saleSim').onclick = () => { demoStore.inventory[0].stock += 10; notifyStoreUpdate(); };
    if ($('#resetDemo')) $('#resetDemo').onclick = resetDemoStore;
  }

  if (slug === 'pos' || slug === 'ecommerce') {
    const products = [
      { id: 1, name: 'Café Americano', tagline: 'Intenso y clásico', price: 2.50, img: A+'pos-products/cafe-americano.webp' },
      { id: 2, name: 'Cappuccino', tagline: 'Suave y cremoso', price: 3.25, img: A+'pos-products/cappuccino.webp' },
      { id: 3, name: 'Latte', tagline: 'Equilibrio perfecto', price: 3.50, img: A+'pos-products/latte.webp' },
      { id: 4, name: 'Café Frío', tagline: 'Refrescante', price: 3.75, img: A+'pos-products/cafe-frio.webp' },
      { id: 5, name: 'Sándwich de Pollo', tagline: 'Fresco y saludable', price: 4.75, img: A+'pos-products/sandwich-pollo.webp' },
      { id: 6, name: 'Cheesecake', tagline: 'Clásico favorito', price: 4.00, img: A+'pos-products/cheesecake.webp' }
    ];
    cart = [];
    
    $('#posProducts').innerHTML = products.map((p, i) => `
      <button data-i="${i}" aria-label="Agregar ${p.name} al pedido">
        <img src="${p.img}" alt="${p.name}" width="720" height="432" style="border-radius:12px;width:100%;height:92px;object-fit:cover" />
        <b style="display:block;margin-top:8px;font-size:13px;color:var(--navy)">${p.name}</b>
        <small style="display:block;margin-top:2px;color:#718797;font-size:10px;line-height:1.35">${p.tagline}</small>
        <span style="color:var(--teal);font-size:12px;font-weight:800;margin-top:6px">B/. ${p.price.toFixed(2)} +</span>
      </button>
    `).join('');

    const renderCart = () => {
      $('#cartRows').innerHTML = cart.length ? cart.map((item, n) => `
        <div class="cart-row">
          <span>${n + 1}. ${item.name}</span>
          <b>B/. ${item.price.toFixed(2)}</b>
        </div>
      `).join('') : '<p style="font-size:12px;color:#718797;line-height:1.6">Haz clic en los productos para agregarlos al pedido.</p>';

      const sub = cart.reduce((acc, item) => acc + item.price, 0);
      const tax = sub * 0.07;
      const total = sub + tax;

      $('#cartSubtotal').textContent = `B/. ${sub.toFixed(2)}`;
      $('#cartTax').textContent = `B/. ${tax.toFixed(2)}`;
      $('#cartTotal').textContent = `B/. ${total.toFixed(2)}`;
    };

    renderCart();
    $$('#posProducts button').forEach(b => b.onclick = () => { cart.push(products[+b.dataset.i]); renderCart(); });
    
    $('#completeSale').onclick = () => {
      if (!cart.length) {
        $('#saleResult').textContent = 'Agrega productos al carrito primero.';
        return;
      }
      const total = cart.reduce((acc, item) => acc + item.price, 0) * 1.07;
      dispatchSaleCompleted(cart, total);
      $('#saleResult').textContent = `✓ Venta de B/. ${total.toFixed(2)} registrada. ¡Inventario, CRM y Dashboard actualizados en vivo!`;
      cart = [];
      renderCart();
    };
  }

  if (slug === 'crm') {
    const list = $('#clientList');
    list.innerHTML = demoStore.customers.map((c, i) => `
      <button data-c="${i}" style="display:block;width:100%;text-align:left;border:1px solid var(--border);background:#fff;border-radius:12px;padding:12px;margin-bottom:8px;cursor:pointer">
        <b style="font-size:14px;color:var(--navy)">${c.name}</b>
        <small style="display:block;color:var(--teal);font-size:10px;font-weight:700;margin-top:2px">${c.status}</small>
        <span style="font-size:11px;color:#718797">${c.last}</span>
      </button>
    `).join('');

    const selectClient = (index) => {
      const c = demoStore.customers[index];
      $('#crmName').textContent = c.name;
      $('#crmState').textContent = c.status;
      $('#crmTimeline').innerHTML = c.history.map(item => `
        <div class="cart-row">
          <span>${item}</span>
          <b style="color:var(--teal)">✓</b>
        </div>
      `).join('');
    };
    selectClient(0);
    $$('#clientList button').forEach(b => b.onclick = () => selectClient(+b.dataset.c));
  }

  if (slug === 'booking') {
    const days = ['LUN 7', 'MAR 8', 'MIÉ 9', 'JUE 10', 'VIE 11'];
    const slots = ['9:00 AM', '10:30 AM', '2:00 PM', '3:30 PM'];
    let selDay = 1, selSlot = '';

    $('#days').innerHTML = days.map((d, i) => `<button data-d="${i}" class="${i === 1 ? 'active' : ''}">${d}</button>`).join('');
    $('#slots').innerHTML = slots.map(s => `<button data-s="${s}"><b>${s}</b><span>DISPONIBLE</span></button>`).join('');

    const updatePick = () => $('#bookPick').textContent = selSlot ? `${days[selDay]} · ${selSlot}` : 'ELIGE FECHA Y HORA';
    $$('#days button').forEach(b => b.onclick = () => { selDay = +b.dataset.d; $$('#days button').forEach(x => x.classList.remove('active')); b.classList.add('active'); updatePick(); });
    $$('#slots button').forEach(b => b.onclick = () => { selSlot = b.dataset.s; updatePick(); });

    $('#bookNow').onclick = () => {
      if (!selSlot) { $('#bookResult').textContent = 'Selecciona una hora disponible.'; return; }
      demoStore.activities.unshift({ time: 'Justo ahora', text: `Reserva agendada para ${days[selDay]} a las ${selSlot}`, type: 'booking' });
      $('#bookResult').textContent = `✓ Reserva confirmada para ${days[selDay]} a las ${selSlot}. ¡Recordatorio automático preparado!`;
    };
  }

  if (slug === 'app') {
    let pts = 840;
    $$('[data-app]').forEach(b => b.onclick = () => {
      $('#appPanel').textContent = b.dataset.app === 'PUNTOS' ? `${pts} PUNTOS ACUMULADOS` : (b.dataset.app === 'RESERVAR' ? 'PRÓXIMA CITA: MAÑANA 3:30 PM' : 'PEDIDO #1082 REPETIDO');
    });
    $('#addPoints').onclick = () => {
      pts += 50;
      $('#pointsValue').textContent = `${pts} puntos acumulados`;
      $('#appPanel').textContent = `+50 PUNTOS ACTIVADOS (${pts} TOTAL)`;
    };
  }

  if (slug === 'quotes') {
    const sync = () => {
      $('#pqClient').textContent = $('#qClient').value;
      $('#pqService').textContent = $('#qService').value;
      $('#pqPrice').textContent = $('#qPrice').value || 'Consultar';
    };
    $('#qClient').oninput = sync;
    $('#qService').onchange = sync;
    $('#qPrice').oninput = sync;
    sync();

    $$('[data-status]').forEach(b => b.onclick = () => {
      $$('[data-status]').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      $('#pqStatus').textContent = b.dataset.status;
    });
  }

  if (slug === 'dashboard') {
    let metric = 'VENTAS';
    let auto = true;
    const barsData = [45, 68, 55, 88, 72, 95, 82];

    const renderDash = () => {
      $('#metricTitle').textContent = `${metric} · 7 DÍAS EN VIVO`;
      $('#dashBars').innerHTML = barsData.map(h => `<i style="--h:${h}%"></i>`).join('');
      $('#flows').innerHTML = demoStore.activities.slice(0, 4).map(act => `
        <div class="cart-row" style="opacity:${auto ? 1 : .4}">
          <span>${act.text}</span>
          <b style="color:var(--teal);font-size:10px">${act.time}</b>
        </div>
      `).join('');
    };
    renderDash();

    $$('[data-metric]').forEach(b => b.onclick = () => {
      metric = b.dataset.metric;
      $$('[data-metric]').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      renderDash();
    });

    $('#autoToggle').onclick = () => {
      auto = !auto;
      $('#autoToggle').classList.toggle('active', auto);
      $('#autoToggle').textContent = `AUTOMATIZACIÓN ${auto ? 'ON' : 'OFF'}`;
      renderDash();
    };
  }

  if (slug === 'web') {
    const filters = $$('[data-web]');
    const cards = $$('#webDemoGrid [data-kind]');
    filters.forEach(b => b.onclick = () => {
      filters.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const f = b.dataset.web;
      cards.forEach(c => c.style.display = (f === 'todos' || c.dataset.kind === f) ? 'block' : 'none');
    });
  }
}


/* =========================================================
   07A — SOCIAL ORBIT INTERACTION
   ========================================================= */
function initOrbitInteraction(){
  const stage = document.querySelector('[data-orbit-stage]');
  if (!stage) return;

  const nodes = Array.from(stage.querySelectorAll('.orbit-node'));
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  const resetOrbit = () => {
    stage.style.setProperty('--ringShiftX', '0px');
    stage.style.setProperty('--ringShiftY', '0px');
    stage.style.setProperty('--ringSpinA', '0deg');
    stage.style.setProperty('--ringSpinB', '0deg');
    stage.style.setProperty('--coreX', '0px');
    stage.style.setProperty('--coreY', '0px');
    stage.style.setProperty('--coreScale', '1');
    nodes.forEach(node => {
      node.style.setProperty('--tx', '0px');
      node.style.setProperty('--ty', '0px');
      node.style.setProperty('--scale', '1');
      node.classList.remove('is-hot');
    });
  };

  const updateOrbit = (event) => {
    if (!finePointer.matches || window.innerWidth <= 860) return;

    const rect = stage.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const py = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    const spin = px * 16;

    stage.style.setProperty('--ringShiftX', `${(px * 12).toFixed(2)}px`);
    stage.style.setProperty('--ringShiftY', `${(py * 8).toFixed(2)}px`);
    stage.style.setProperty('--ringSpinA', `${spin.toFixed(2)}deg`);
    stage.style.setProperty('--ringSpinB', `${(-spin * 0.55).toFixed(2)}deg`);
    stage.style.setProperty('--coreX', `${(-px * 10).toFixed(2)}px`);
    stage.style.setProperty('--coreY', `${(-py * 8).toFixed(2)}px`);
    stage.style.setProperty('--coreScale', `${(1 + Math.abs(px) * 0.018 + Math.abs(py) * 0.012).toFixed(3)}`);

    nodes.forEach((node, index) => {
      const angleDeg = parseFloat(node.dataset.angle || '0');
      const radius = parseFloat(node.dataset.radius || '180');
      const theta = angleDeg * Math.PI / 180;
      const delta = px * 0.23;
      const orbitalX = radius * (Math.cos(theta + delta) - Math.cos(theta));
      const orbitalY = radius * (Math.sin(theta + delta) - Math.sin(theta));
      const depthX = px * (4 + index * 0.75);
      const depthY = py * (6 + index * 0.65);
      const finalX = orbitalX + depthX;
      const finalY = orbitalY + depthY;
      const scale = 1 + Math.max(0, 0.028 - Math.abs(delta - index * 0.007));

      node.style.setProperty('--tx', `${finalX.toFixed(2)}px`);
      node.style.setProperty('--ty', `${finalY.toFixed(2)}px`);
      node.style.setProperty('--scale', scale.toFixed(3));
    });
  };

  if (finePointer.matches && window.innerWidth > 860) {
    stage.addEventListener('mousemove', updateOrbit);
    stage.addEventListener('mouseenter', updateOrbit);
    stage.addEventListener('mouseleave', resetOrbit);
    nodes.forEach(node => {
      node.addEventListener('mouseenter', () => node.classList.add('is-hot'));
      node.addEventListener('mouseleave', () => node.classList.remove('is-hot'));
    });
  }

  const mediaReset = () => {
    if (!finePointer.matches || window.innerWidth <= 860) resetOrbit();
  };
  window.addEventListener('resize', mediaReset);
  if (finePointer.addEventListener) finePointer.addEventListener('change', mediaReset);
  else if (finePointer.addListener) finePointer.addListener(mediaReset);
  resetOrbit();
}

/* =========================================================
   07 — DOM READY INITIALIZER & KEYBOARD ACCESSIBILITY
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {
  init();
  initOrbitInteraction();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeExperience();
    $('#menuOverlay')?.classList.remove('open');
    $('#menuOverlay')?.setAttribute('aria-hidden', 'true');
    $('#privacyModal')?.classList.remove('open');
    $('#privacyModal')?.setAttribute('aria-hidden', 'true');
    $('#termsModal')?.classList.remove('open');
    $('#termsModal')?.setAttribute('aria-hidden', 'true');
    $('#lightboxModal')?.classList.remove('open');
    $('#lightboxModal')?.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('lock');
  }
});
