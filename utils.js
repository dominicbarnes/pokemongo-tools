
import numeral from 'numeral'

exports.page = function (list, currentPage, perPage) {
  const start = (currentPage - 1) * perPage
  const end = start + perPage
  return list.slice(start, end)
}

exports.dex = function (number) {
  return `#${numeral(number).format('000')}`
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

// variants correlate with the appraisal system
// see: https://pokemongohub.net/pokemon-go-appraisal-chart

exports.variantTotalIV = function (percentage) {
  if (percentage === 1) return 'primary'
  if (percentage >= 0.822) return 'success'
  if (percentage >= 0.667) return 'warning'
  if (percentage >= 0.511) return 'warning'
  return 'danger'
}

exports.variantIV = function (iv) {
  if (iv === 15) return 'primary'
  if (iv >= 13) return 'success'
  if (iv >= 8) return 'warning'
  return 'danger'
}

exports.variantLevel = function (level) {
  if (level === 40) return 'primary'
  if (level >= 35) return 'success'
  return 'secondary'
}

// sprites come from github, until it gets embedded

const baseSpriteURL = 'https://raw.githubusercontent.com/ZeChrales/PogoAssets/master'

// TODO: rename sprite -> icon
exports.spriteURL = function (metadata, catalog) {
  if (!metadata) return `${baseSpriteURL}/pokemon_icons/pokemon_icon_000.png`
  const bundle = metadata.assetBundle || 0
  let basename = `pokemon_icon_${numeral(metadata.dex).format('000')}_${numeral(bundle).format('00')}`
  if (catalog) {
    if (catalog.costume) {
      const costume = metadata.costumes[catalog.costume]
      basename += `_${numeral(costume).format('00')}`
    }
    if (catalog.shiny) {
      basename += '_shiny'
    }
  }
  return `${baseSpriteURL}/pokemon_icons/${basename}.png`
}

exports.smallIconURL = function (metadata) {
  if (!metadata) return null
  let basename = `pokemon_icon_${numeral(metadata.dex).format('000')}_00`
  return `${baseSpriteURL}/pixels/${basename}.png`
}
