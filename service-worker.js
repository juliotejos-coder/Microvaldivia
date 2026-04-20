const CACHE_NAME='valdivia-recorridos-v1';
const ASSETS=['./','./mapa_valdivia.html','./manifest.json','./service-worker.js','./data/index.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE_NAME).then(c=>c.addAll(ASSETS)))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE_NAME).map(x=>caches.delete(x))))) });
self.addEventListener('fetch',e=>{e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{if(e.request.url.includes('/data/')){caches.open(CACHE_NAME).then(c=>c.put(e.request,resp.clone()));}return resp;})).catch(()=>caches.match(e.request)));});