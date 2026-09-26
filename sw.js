const CACHE='the-hollow-v38';
const ASSETS=[
  './index.html',
  './manifest.webmanifest',
  './icon.svg',
  './assets/images/main-menu-bg.jpg',
  './assets/images/prologue-hallway-bg.png',
  './assets/images/loading-photo-noah-elias.png',
  './assets/images/loading-photo-elias-hollow.png',
  './assets/audio/elias/elias_001_where_am_i.mp3',
  './assets/audio/elias/elias_002_not_my_apartment.mp3',
  './assets/audio/elias/elias_003_somebody_there.mp3',
  './assets/audio/elias/elias_004_nobody_answers.mp3',
  './assets/audio/elias/elias_005_place_looks_abandoned.mp3',
  './assets/audio/elias/elias_006_door_other_side.mp3',
  './assets/audio/elias/elias_007_already_walked_past_this.mp3',
  './assets/audio/elias/elias_008_what_is_that.mp3',
  './assets/audio/elias/elias_009_dont_move.mp3',
  './vendor/three.min.js'
];

self.addEventListener('install',event=>{
  event.waitUntil(
    caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())
  );
});

self.addEventListener('activate',event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.mode==='navigate' || req.destination==='document'){
    event.respondWith(
      fetch(req,{cache:'no-store'})
        .then(res=>{
          const copy=res.clone();
          caches.open(CACHE).then(cache=>cache.put('./index.html',copy));
          return res;
        })
        .catch(()=>caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(req).then(cached=>{
      if(cached) return cached;
      return fetch(req).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(cache=>cache.put(req,copy));
        return res;
      });
    })
  );
});