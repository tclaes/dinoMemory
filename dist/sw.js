importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js');

workbox.precaching.precacheAndRoute([
  {
    "url": "build.js",
    "revision": "d6e77570f20ca34ba57fac588844889c"
  },
  {
    "url": "data.json",
    "revision": "6f795be96f6826e89ad85018597ad50d"
  },
  {
    "url": "img/dinos/allosaurus.svg",
    "revision": "e01b4abb7f19daaa6610e2ff40331867"
  },
  {
    "url": "img/dinos/ankylosaurus.svg",
    "revision": "7884316144742736bffdd5c9e9ea8573"
  },
  {
    "url": "img/dinos/brachiosaurus.svg",
    "revision": "11bcbeebcd66afb63cb7364f6f9b2e5a"
  },
  {
    "url": "img/dinos/brontosaurus.svg",
    "revision": "d86d23c1176090df3a4333db66e3ca8e"
  },
  {
    "url": "img/dinos/ceratosaurus.svg",
    "revision": "a3aab58fb22c1c295461fb005b15a670"
  },
  {
    "url": "img/dinos/diplodocus.svg",
    "revision": "2eb4fe4dd9c95e3d6a5dec7e4a76f9b9"
  },
  {
    "url": "img/dinos/elasmosaurus.svg",
    "revision": "90d88130ee6f6c2b3b938cee246de3f9"
  },
  {
    "url": "img/dinos/guanlong.svg",
    "revision": "ae6d42dcfa5cb796d50e3a02ee759e0e"
  },
  {
    "url": "img/dinos/ichthyosaurus.svg",
    "revision": "65dad74a53dbf1ae8e28e7a93c6e35b6"
  },
  {
    "url": "img/dinos/iguanodon.svg",
    "revision": "a0a4684ae643c8637599b9aeb69a1f94"
  },
  {
    "url": "img/dinos/kentrosaurus.svg",
    "revision": "166b7cce2bd0bea6e1e3210e47c42aea"
  },
  {
    "url": "img/dinos/lambeosaurus.svg",
    "revision": "5895bef478e005a3a51c2b2ff723c90c"
  },
  {
    "url": "img/dinos/ouranosaurus.svg",
    "revision": "72630b27e481f92281ac988298ac5b8b"
  },
  {
    "url": "img/dinos/oviraptor.svg",
    "revision": "72c5ca7b62db65146c214cd3a89190cf"
  },
  {
    "url": "img/dinos/parasaurolophus.svg",
    "revision": "5908e890c9fe0eab179d195adc6dfffd"
  },
  {
    "url": "img/dinos/plateosaurus.svg",
    "revision": "9594c4ec42a8ea6e89b59abd8bdbdbfc"
  },
  {
    "url": "img/dinos/pliosaurus.svg",
    "revision": "a9a8b6e42c74a33cd346339b49478763"
  },
  {
    "url": "img/dinos/pterosaurus-1.svg",
    "revision": "7f84683032889a6dcb16a5114657bac8"
  },
  {
    "url": "img/dinos/pterosaurus.svg",
    "revision": "3427b551205500633f271e0c05014464"
  },
  {
    "url": "img/dinos/spinosaurus.svg",
    "revision": "a77f42ceab9b015535d6a97010a8ba8e"
  },
  {
    "url": "img/dinos/stegosaurus.svg",
    "revision": "bf400fa71e7b5fd605af9a3648f3cba4"
  },
  {
    "url": "img/dinos/styracosaurus.svg",
    "revision": "11d08ecf161f943b3bd9c818e7f7e995"
  },
  {
    "url": "img/dinos/triceratops.svg",
    "revision": "fa984a553acd8d2f73447e39e6453e10"
  },
  {
    "url": "img/dinos/tyrannosaurus-rex.svg",
    "revision": "2222b705d5584906fc70dabff7e51f0b"
  },
  {
    "url": "img/dinos/velociraptor.svg",
    "revision": "f1037462daddcaa11d1720f16d631b57"
  },
  {
    "url": "img/frameworks/angular.svg",
    "revision": "664397dc412fb031725ff121153d02b9"
  },
  {
    "url": "img/frameworks/aurelia.svg",
    "revision": "f09f45daff5b00602e80386cb6a73e5a"
  },
  {
    "url": "img/frameworks/backbone.svg",
    "revision": "65465956a275c29e78ecec571d77d247"
  },
  {
    "url": "img/frameworks/ember.svg",
    "revision": "d848fbc3db83ca5e94bb208a12cc418d"
  },
  {
    "url": "img/frameworks/js-badge.svg",
    "revision": "d680b4570bd8511a42eef346d818e1e2"
  },
  {
    "url": "img/frameworks/react.svg",
    "revision": "1b7f7aac77d71ef59e4c9e8d2cb2067e"
  },
  {
    "url": "img/frameworks/vue.svg",
    "revision": "4a16cd4e21cff053a732796b4c895186"
  },
  {
    "url": "index.html",
    "revision": "5cc596eef6d7a2d3e515195adff0292d"
  },
  {
    "url": "manifest.json",
    "revision": "12c80693e4c732fe2ea682beb6985174"
  },
  {
    "url": "styles.css",
    "revision": "6b4a4ee5ac400fe135770ac97e5d66d8"
  },
  {
    "url": "styles.min.css",
    "revision": "76141dc1c623f6b069179d8a0e33e3d5"
  }
]);

workbox.routing.registerRoute(
  new RegExp('.*\.js'),
  workbox.strategies.networkFirst()
);

workbox.routing.registerRoute(
  // Cache CSS files
  /.*\.css/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'css-cache',
  })
);

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: 'image-cache',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images
        maxEntries: 20,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);
