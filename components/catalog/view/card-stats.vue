<template>
  <b-card title="Stats">
    <b-row class="text-center mb-2">
      <b-col cols="4">
        <div>{{ pokemon.cp | number('0,0') }}</div>
        <small class="text-muted">CP</small>
      </b-col>
      <b-col cols="4">
        <div>{{ pokemon.hp | number('0,0') }}</div>
        <small class="text-muted">HP</small>
      </b-col>
      <b-col cols="4">
        <div v-b-tooltip.hover.right v-bind:title="ivTooltip">{{ pokemon.percentIV | percentage }}</div>
        <small class="text-muted">IVs</small>
      </b-col>
    </b-row>
    <b-row class="text-center mb-2">
      <b-col cols="4">
        <div v-b-tooltip.hover.right v-bind:title="attackTooltip">{{ pokemon.attack | number('0,0') }}</div>
        <small class="text-muted">Attack</small>
      </b-col>
      <b-col cols="4">
        <div v-b-tooltip.hover.right v-bind:title="defenseTooltip">{{ pokemon.defense | number('0,0') }}</div>
        <small class="text-muted">Defense</small>
      </b-col>
      <b-col cols="4">
        <div v-b-tooltip.hover.right v-bind:title="staminaTooltip">{{ pokemon.stamina | number('0,0') }}</div>
        <small class="text-muted">Stamina</small>
      </b-col>
    </b-row>
    <b-alert show v-if="pokemon.uncertainIV" variant="warning">
      <b>NOTE:</b>
      These stats are uncertain.
    </b-alert>
  </b-card>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      pokemon: {
        type: Object,
        required: true
      }
    },

    computed: {
      attackTooltip() {
        const { baseAttack: base, attackIV: iv } = this.pokemon
        return `= ${base} (Base) + ${iv} (IV)`
      },
      defenseTooltip() {
        const { baseDefense: base, defenseIV: iv } = this.pokemon
        return `= ${base} (Base) + ${iv} (IV)`
      },
      staminaTooltip() {
        const { baseStamina: base, staminaIV: iv } = this.pokemon
        return `= ${base} (Base) + ${iv} (IV)`
      },
      ivTooltip() {
        const { attackIV, defenseIV, staminaIV } = this.pokemon
        return `= ${attackIV}/15 ATK + ${defenseIV}/15 DEF + ${staminaIV}/15 STA`
      }
    }
  }
</script>
