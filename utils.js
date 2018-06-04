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
  return Math.floor(stamina * multiplier)
}

exports.multiplier = function (cp, attack, defense, stamina) {
  return Math.sqrt((cp * 10) / (attack * Math.sqrt(defense) * Math.sqrt(stamina)))
}
