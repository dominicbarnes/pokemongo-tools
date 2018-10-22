
module.exports = function (m, data) {
  if (data.has('playerLevel')) {
    data.get('playerLevel').forEach(function (settings) {
      m.set('CP_MULTIPLIERS', cpMultipliers(settings))
    })
  }

  if (data.has('pokemonUpgrades')) {
    data.get('pokemonUpgrades').forEach(function (settings) {
      m.set('UPGRADE_COSTS', pokemonUpgrades(settings))
    })
  }
}

function cpMultipliers (settings) {
  const levels = settings.cpMultiplier.reduce(function (acc, mult, x, arr) {
    const level = x + 1
    acc[level] = mult
    if (level < 40) {
      acc[level + 0.5] = Math.sqrt((Math.pow(mult, 2) + Math.pow(arr[x + 1], 2)) / 2)
    }
    return acc
  }, Object.create(null))

  return { levels }
}

function pokemonUpgrades (settings) {
  const levels = settings.candyCost.reduce((acc, candy, x) => {
    const level = x + 1
    const stardust = settings.stardustCost[x]
    const cost = { candy, stardust }
    acc[level] = cost
    if (level < 40) {
      acc[level + 0.5] = cost
    }
    return acc
  }, Object.create(null))

  return { levels }
}
