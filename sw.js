const CACHE="mi-octubre-v1";
const CORE=["./", "index.html", "manifest.webmanifest", "icon-192.png", "icon-512.png", "icon-180.png", "archivos/Practica1_ImagenCorporativa.pdf", "archivos/Briefing_BurgerKing_Inspirational.pdf", "archivos/Prueba_RRPP_mensaje_profesora.pdf", "archivos/Temario_Estrategias_2026-27.pdf", "archivos/Calendario_octubre.jpg"];
const CDN=["https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js","https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE).then(()=>Promise.all(CDN.map(u=>c.add(u).catch(()=>{})))))) ;self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const url=new URL(e.request.url);
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put("index.html",cp));return r;}).catch(()=>caches.match("index.html")));
    return;
  }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{
    if(r.ok&&(url.origin===location.origin||url.hostname.endsWith("cdnjs.cloudflare.com")||url.hostname.endsWith("gstatic.com")||url.hostname.endsWith("googleapis.com"))){const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp));}
    return r;})));
});
