<template>
  <b-card v-if="pokemon.level < 40" title="Power Up">
    <stat-grid>
      <stat-grid-cell cols="6" label="Candy Cost">
        {{ upgradeCost.candy | number('0,0') }}
      </stat-grid-cell>
      <stat-grid-cell cols="6" label="Calculated CP">
        {{ calculatedCP | number('0,0') }}
      </stat-grid-cell>
      <stat-grid-cell cols="6" label="Stardust Cost">
        {{ upgradeCost.stardust | number('0,0') }}
      </stat-grid-cell>
      <stat-grid-cell cols="6" label="Calculated HP">
        {{ calculatedHP }}
      </stat-grid-cell>
    </stat-grid>
    <vue-slider ref="level" v-bind:min="pokemon.level" v-bind:max="40" v-bind:interval="0.5" v-model="level" />
    <center class="mt-3">
      <b-button v-if="greatLeagueLevel" v-on:click="level = greatLeagueLevel">Great League</b-button>
      <b-button v-if="ultraLeagueLevel" v-on:click="level = ultraLeagueLevel">Ultra League</b-button>
    </center>
    <center class="mt-3">
      <b-button v-on:click="powerUp(level)" v-bind:disabled="level === pokemon.level" variant="success">Power Up to Level {{ level | number('0.0') }}</b-button>
    </center>
  </b-card>
</template>

<script>
  import { mapGetters } from 'vuex'
  import VueSlider from 'vue-slider-component'

  import { dex, cp, hp } from '../../../utils.js'
  import StatGrid from '../../stat-grid.vue'
  import StatGridCell from '../../stat-grid-cell.vue'

  export default {
    data() {
      return {
        costume: null,
        shiny: false,
        level: 40
      }
    },

    props: {
      pokemon: {
        type: Object,
        required: true
      }
    },

    computed: {
      ...mapGetters([ 'upgradeCosts', 'cpMultipliers' ]),

      upgradeCost() {
        const { upgradeCosts } = this
        const total = { stardust: 0, candy: 0 }
        for (let x = this.pokemon.level; x < this.level; x += 0.5) {
          const cost = upgradeCosts(x)
          if (cost) {
            total.stardust += cost.stardust
            total.candy += cost.candy
          }
        }
        return total
      },

      multiplier() {
        return this.cpMultipliers(this.level)
      },

      calculatedCP() {
        const { attack, defense, stamina } = this.pokemon
        return cp(attack, defense, stamina, this.multiplier)
      },

      calculatedHP() {
        return hp(this.pokemon.stamina, this.multiplier)
      },

      greatLeagueLevel() {
        return this.getMaxLevel(1500)
      },

      ultraLeagueLevel() {
        return this.getMaxLevel(2500)
      }
    },

    methods: {
      async powerUp(level) {
        await this.$store.dispatch('catalog/pokemonUpdate', {
          pokemon: {
            _id: this.pokemon.id,
            level: level
          }
        })
      },

      getMaxLevel(maxCP) {
        const { attack, defense, stamina } = this.pokemon
        const { cpMultipliers } = this

        if (this.pokemon.cp > 2500) return null

        for (let x = this.pokemon.level; x <= 40; x += 0.5) {
          const newCP = cp(attack, defense, stamina, cpMultipliers(x))
          if (newCP > maxCP) return x - 0.5
        }

        return 40
      }
    },

    mounted() {
      this.$refs.level.refresh()
    },

    components: { StatGrid, StatGridCell, VueSlider }
  }
</script>
