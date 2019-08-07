
import pkg from './package.json'

// meta
export const version = pkg.version

// env
export const env = process.env.NODE_ENV
export const stage = process.env.UP_STAGE

// metrics
export const segmentWriteKey = process.env.SEGMENT_WRITE_KEY

// db
export const metadataURL = env === 'development'
  ? 'http://admin:secret@localhost:5984/pokemongo-metadata'
  : 'https://pokemongo-metadata:readonly@c38aeb6d-2e18-40ca-b7e9-404da06abd39-bluemix.cloudant.com/pokemongo-metadata'

const { origin, protocol, hostname, port } = window.location

export const hoodieURL = origin || `${protocol}//${hostname}:${port}`
