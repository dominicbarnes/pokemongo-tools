<template>
  <b-card title="Level">
    <progress-level v-bind:level="pokemon.level" class="mb-2" />
    <b-alert v-if="pokemon.level < 40" variant="secondary" show>
      To fully power up this Pokémon, you will need
      <b-badge>{{ upgradeCost.stardust | number('0,0') }}</b-badge>
      stardust and
      <b-badge>{{ upgradeCost.candy }}</b-badge>
      candy.
    </b-alert>
    <b-alert v-else variant="primary" show>
      This Pokémon is fully powered up.
    </b-alert>
    <b-dropdown v-if="pokemon.level < 40" split text="Power Up" variant="success" v-on:click="powerUp(pokemon.level + 0.5)">
      <b-dropdown-item v-if="pokemon.level <= 39" v-on:click="powerUp(pokemon.level + 1)">Level {{ pokemon.level + 1 }} (2 times)</b-dropdown-item>
      <b-dropdown-item v-if="pokemon.level <= 35" v-on:click="powerUp(pokemon.level + 5)">Level {{ pokemon.level + 5 }} (10 times)</b-dropdown-item>
      <b-dropdown-item v-on:click="powerUp(40)">Max (level 40)</b-dropdown-item>
    </b-dropdown>
  </b-card>
</template>

<script>
  import { mapGetters } from 'vuex';

  import { dex } from '../../../utils.js'
  import { BadgeGeneration, BadgeRarity, BadgeType } from '../../badges'
  import { ProgressLevel } from '../../progress'

  export default {
    data() {
      return {
        costume: null,
        shiny: false
      }
    },

    props: {
      pokemon: {
        type: Object,
        required: true
      }
    },

    computed: {
      ...mapGetters([ 'upgradeCosts' ]),

      upgradeCost() {
        const { upgradeCosts } = this
        const total = { stardust: 0, candy: 0 }
        for (let x = this.pokemon.level; x < 40; x += 0.5) {
          const cost = upgradeCosts(x)
          if (cost) {
            total.stardust += cost.stardust
            total.candy += cost.candy
          }
        }
        return total
      }
    },

    methods: {
      async powerUp(level) {
        await this.$store.dispatch('catalog/update', {
          pokemon: {
            _id: this.pokemon.id,
            level: level
          }
        })
      },
    },

    components: { BadgeGeneration, BadgeRarity, BadgeType, ProgressLevel }
  }
</script>
