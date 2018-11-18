
const transformers = [
  require('./types.js'),
  require('./families.js'),
  require('./moves.js'),
  require('./pokemon.js'),
  require('./settings.js')
]

module.exports = async function (m, raw, special, enums) {
  const data = prepare(raw)
  transformers.forEach(fn => fn(m, data, special, enums))
}

function prepare (data) {
  return data.itemTemplates.reduce((m, item) => {
    for (const key in item) {
      if (key === 'templateId') continue
      if (item.hasOwnProperty(key) && item[key]) {
        if (!m.has(key)) m.set(key, new Set())
        m.get(key).add(item[key])
      }
    }
    return m
  }, new Map())
}
