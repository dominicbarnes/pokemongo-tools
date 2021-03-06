
import numeral from 'numeral'

export function page (list, currentPage, perPage) {
  const start = (currentPage - 1) * perPage
  const end = start + perPage
  return list.slice(start, end)
}

export function dex (number) {
  return `#${numeral(number).format('000')}`
}

export function cp (attack, defense, stamina, multiplier) {
  return Math.max(Math.floor((attack * Math.sqrt(defense) * Math.sqrt(stamina) * Math.pow(multiplier, 2)) / 10), 10)
}

export function hp (stamina, multiplier) {
  return Math.max(Math.floor(stamina * multiplier), 10)
}

export function multiplier (cp, attack, defense, stamina) {
  return Math.sqrt((cp * 10) / (attack * Math.sqrt(defense) * Math.sqrt(stamina)))
}

// sprites come from github, until it gets embedded

const baseSpriteURL = 'https://raw.githubusercontent.com/ZeChrales/PogoAssets/master'

// TODO: rename sprite -> icon
export function spriteURL (metadata, catalog) {
  if (!metadata) return `${baseSpriteURL}/pokemon_icons/pokemon_icon_000.png`
  const bundle = getAssetBundle(metadata, catalog)
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

export function smallIconURL (metadata) {
  if (!metadata) return null
  let basename = `pokemon_icon_${numeral(metadata.dex).format('000')}_00`
  return `${baseSpriteURL}/pixels/${basename}.png`
}

function getAssetBundle (metadata, catalog) {
  const form = catalog.form || metadata.defaultForm
  if (form && metadata.forms && form in metadata.forms) {
    const formMetadata = metadata.forms[form]
    if (formMetadata.assetBundle) return formMetadata.assetBundle
  }
  return metadata.assetBundle
}
