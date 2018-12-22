importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js')

const staleWhileRevalidate = workbox.strategies.staleWhileRevalidate()
const networkOnly = workbox.strategies.networkOnly()

workbox.clientsClaim()

// first-party
workbox.routing.registerRoute('/', staleWhileRevalidate) // skeleton
workbox.routing.registerRoute(/\.(js|css)(\.map)?$/, staleWhileRevalidate) // js/css
workbox.routing.registerRoute(/\.(ico|png)$/, staleWhileRevalidate) // images
workbox.routing.registerRoute('/hoodie/(.*)', networkOnly)

// third-party
workbox.precaching.precacheAndRoute([
  'https://raw.githubusercontent.com/ZeChrales/PogoAssets/master/pokemon_icons/pokemon_icon_000.png',
  'https://raw.githubusercontent.com/ZeChrales/PogoAssets/master/static_assets/png/ui_bg_lucky_pokemon.png'
])
workbox.routing.registerRoute(/https:\/\/raw\.githubusercontent\.com\/ZeChrales\/PogoAssets\/master\//, staleWhileRevalidate)
