const p = [".data", "runner.js", ".wasm", "runner.worker.js", ".unx"]
  , g = "https://api.gx.games"
  , m = [location.origin, "https://play.gxc.gg", "https://play.gx.games"]
  , y = async e=>{
    if (!m.some(s=>e.url.startsWith(s)) || !p.some(s=>e.url.endsWith(s)))
        return fetch(e);
    const r = await caches.match(e);
    if (r)
        return r.clone();
    const a = new URL(e.url).pathname.split("/")
      , n = a[1]
      , l = a[2]
      , c = a[3];
    if (!n || !l || !c)
        return fetch(e);
    const h = fetch(e)
      , o = [];
    (await caches.keys()).forEach(s=>{
        try {
            const i = JSON.parse(s);
            o.push(i)
        } catch {}
    }
    );
    let t = o.find(({version: s})=>s === c);
    if (!t)
        try {
            const i = await (await fetch(`${g}/gg/games/${n}`)).json();
            t = {
                gameId: n,
                name: i.data.title,
                version: c
            }
        } catch {
            return h
        }
    for (const s of o)
        s.name === t.name && s.version !== t.version && await caches.delete(JSON.stringify(s));
    const f = await h
      , d = f.clone();
    return (await caches.open(JSON.stringify(t))).put(e, d),
    f
}
;
self.addEventListener("fetch", async e=>{
    e.respondWith(y(e.request))
}
);
self.addEventListener("activate", e=>{
    e.waitUntil(self.clients.claim())
}
);
self.addEventListener("message", e=>{
    e.data === "SKIP_WAITING" && self.skipWaiting()
}
);
