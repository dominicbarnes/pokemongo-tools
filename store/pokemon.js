
import moment from 'moment'

import { cp, hp, spriteURL, smallIconURL } from '../utils.js'

export default function pokemon (catalog, state) {
  const { cpMultipliers, movesByID, pokemonByID } = state

  const metadata = pokemonByID(catalog.pokemonID, catalog.form)
  if (!metadata) return {}

  const species = pokemonByID(catalog.pokemonID)
  const multiplier = cpMultipliers(catalog.level)

  const { attack, defense, stamina } = metadata.baseStats
  const { hoodie, attackIV = 0, defenseIV = 0, staminaIV = 0 } = catalog
  const totalIV = attackIV + defenseIV + staminaIV
  const totalAttack = attack + attackIV
  const totalDefense = defense + defenseIV
  const totalStamina = stamina + staminaIV

  return {
    // general
    id: catalog._id,
    dex: metadata.dex,
    generation: metadata.generation,
    costume: catalog.costume,
    form: catalog.form || 'normal',
    types: metadata.types,

    // metadata
    pokemonID: catalog.pokemonID,
    familyID: metadata.family,
    quickMoveID: catalog.quickMove,
    chargeMoveID: catalog.chargeMove,

    // naming
    name: catalog.nickname || metadata.name,
    nickname: catalog.nickname,
    species: species.name,

    // stats
    level: catalog.level,
    cp: cp(totalAttack, totalDefense, totalStamina, multiplier),
    hp: hp(totalStamina, multiplier),
    multiplier: multiplier,
    attack: totalAttack,
    defense: totalDefense,
    stamina: totalStamina,
    baseAttack: attack,
    baseDefense: defense,
    baseStamina: stamina,
    attackIV: attackIV,
    defenseIV: defenseIV,
    staminaIV: staminaIV,
    totalIV: totalIV,
    percentIV: totalIV / 45,
    uncertainIV: !!catalog.uncertainStats,

    // evolutions
    nextEvolutions: nextEvolutions(metadata.nextEvolutions),
    prevEvolution: pokemonByID(metadata.prevEvolution),

    // moves
    quickMove: move(metadata.types, metadata.quickMoves, movesByID(catalog.quickMove, catalog.hiddenPowerType)),
    chargeMove: move(metadata.types, metadata.chargeMoves, movesByID(catalog.chargeMove)),

    // misc
    notes: catalog.notes,
    rarity: metadata.rarity,
    shiny: !!catalog.shiny,

    // images
    spriteURL: spriteURL(metadata, catalog),
    smallIconURL: smallIconURL(metadata, catalog),

    // timeline
    addedAt: date(hoodie.createdAt),
    caughtAt: date(catalog.caughtAt),
    updatedAt: date(hoodie.updatedAt)
  }
}

function nextEvolutions (list) {
  if (!list) return []
  return list.map(evolution => {
    return {
      pokemonID: evolution.pokemon,
      itemID: evolution.item,
      candy: evolution.candy
    }
  })
}

function date (input) {
  return input ? moment(input).toDate() : null
}

function move (types, moves, move) {
  if (!move) return null
  const stab = types.indexOf(move.type) > -1
  const legacy = !!moves[move._id]
  return Object.assign({ stab, legacy }, move)
}
