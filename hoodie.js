import Client from '@hoodie/client'
import PouchDB from 'pouchdb-browser'

window.hoodie = new Client({
  url: window.location.origin,
  PouchDB: PouchDB
})
