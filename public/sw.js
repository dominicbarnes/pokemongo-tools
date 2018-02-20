importScripts('https://unpkg.com/workbox-sw@2.1.1/build/importScripts/workbox-sw.prod.v2.1.1.js')

const workbox = new WorkboxSW({ clientsClaim: true })

const staleWhileRevalidate = workbox.strategies.staleWhileRevalidate()
const networkOnly = workbox.strategies.networkOnly()

workbox.router.registerRoute('/', staleWhileRevalidate) // skeleton
workbox.router.registerRoute(/\.(js|css)(\.map)?$/, staleWhileRevalidate) // js/css
workbox.router.registerRoute(/\.(ico|png)$/, staleWhileRevalidate) // images
workbox.router.registerRoute('/hoodie/(.*)', networkOnly)
