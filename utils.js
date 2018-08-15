import numeral from 'numeral'
import slugify from 'slugify'

slugify.extend({
  '♀': 'f',
  '♂': 'm'
})

exports.dex = function (number) {
  return `#${numeral(number).format('000')}`
}

exports.slugify = function (name) {
  return slugify(name, { lower: true })
}

exports.page = function (list, currentPage, perPage) {
  const start = (currentPage - 1) * perPage
  const end = start + perPage
  return list.slice(start, end)
}

exports.cp = function (attack, defense, stamina, multiplier) {
  return Math.max(Math.floor((attack * Math.sqrt(defense) * Math.sqrt(stamina) * Math.pow(multiplier, 2)) / 10), 10)
}

exports.hp = function (stamina, multiplier) {
  return Math.max(Math.floor(stamina * multiplier), 10)
}

exports.multiplier = function (cp, attack, defense, stamina) {
  return Math.sqrt((cp * 10) / (attack * Math.sqrt(defense) * Math.sqrt(stamina)))
}

exports.spriteURL = function (metadata, catalog) {
  if (!metadata) return null
  if (metadata.dex === 20) console.log(metadata, catalog)
  const bundle = metadata.assetBundle || 0
  let basename = `pokemon_icon_${numeral(metadata.dex).format('000')}_${numeral(bundle).format('00')}`
  if (catalog && catalog.shiny) basename += '_shiny'
  return `https://raw.githubusercontent.com/ZeChrales/PogoAssets/master/decrypted_assets/${basename}.png`
}
