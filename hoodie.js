import Client from '@hoodie/client'
import PouchDB from 'pouchdb-browser'

// const stage = process.env.UP_STAGE
// const url = stage
//   ? `${origin}/${stage}`
//   : origin

window.hoodie = new Client({
  url: remoteURL(),
  PouchDB: PouchDB
})

function remoteURL () {
  const { origin, pathname } = window.location
  const env = pathname.split('/').filter(Boolean).join('/')
  return env ? `${origin}/${env}` : origin
}
