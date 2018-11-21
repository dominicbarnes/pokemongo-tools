importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.6.1/workbox-sw.js')

const staleWhileRevalidate = workbox.strategies.staleWhileRevalidate()
const networkOnly = workbox.strategies.networkOnly()

workbox.clientsClaim()

workbox.router.registerRoute('/', staleWhileRevalidate) // skeleton
workbox.router.registerRoute(/\.(js|css)(\.map)?$/, staleWhileRevalidate) // js/css
workbox.router.registerRoute(/\.(ico|png)$/, staleWhileRevalidate) // images
workbox.router.registerRoute('/hoodie/(.*)', networkOnly)

// third-party
workbox.router.registerRoute(/https:\/\/raw.githubusercontent.com\/ZeChrales\/PogoAssets\/master\/pokemon_icons\/.+\.png$/, staleWhileRevalidate)