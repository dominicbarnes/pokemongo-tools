
import Client from '@hoodie/client'
import PouchDB from 'pouchdb-browser'

import { hoodieURL as url } from './config.js'

window.hoodie = new Client({ PouchDB, url })
