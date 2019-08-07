
import Client from '@hoodie/client'
import PouchDB from 'pouchdb-browser'

const url = window.location.origin

window.hoodie = new Client({ PouchDB, url })
