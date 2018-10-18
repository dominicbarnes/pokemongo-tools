<template>
  <b-card class="border rounded mb-3" no-body v-bind:class="{ 'border-primary': selected, 'bg-light': selected }">
    <b-card-body>
      <h4 class="card-title">
        <b-link v-bind:to="view">{{ title }}</b-link>
        <small v-if="subtitle">({{ subtitle }})</small>
      </h4>
      <div>
        <b-badge variant="dark">{{ pokemon.dex | dex }}</b-badge>
        <generation-badge v-bind:generation="pokemon.generation" />
        <rarity-badge v-if="pokemon.rarity !== 'common'" v-bind:rarity="pokemon.rarity" />
        <shiny-badge v-if="pokemon.shiny" />
      </div>
      <div>
        <type-badge v-for="(type, i) in pokemon.types" v-bind:type="type" v-bind:title="'Type ' + (i + 1)" v-b-tooltip.hover.top />
      </div>
      <div>
        <type-badge v-for="move in moves" v-bind:type="move.type" v-bind:title="move.name" v-b-tooltip.hover.bottom />
      </div>
      <b-card-img v-bind:src="pokemon.spriteURL" v-img-fallback="fallbackSpriteURL" />
      <b-alert show v-if="pokemon.notes" variant="info" class="card-text mt-2">
        <b>Notes:</b> {{ pokemon.notes }}
      </b-alert>
      <stat-grid class="mt-2">
        <stat-grid-cell cols="4" label="CP">
          {{ pokemon.cp | number('0,0') }}
        </stat-grid-cell>
        <stat-grid-cell cols="4" label="HP">
          {{ pokemon.hp | number('0,0') }}
        </stat-grid-cell>
        <stat-grid-cell cols="4" label="IVs">
          <b-badge v-bind:variant="ivVariant">{{ pokemon.percentIV | number('0%') }}</b-badge>
        </stat-grid-cell>
        <stat-grid-cell cols="12" label="Level">
          <b-progress v-bind:value="pokemon.level" v-bind:max="40" show-value v-bind:variant="levelVariant" />
        </stat-grid-cell>
      </stat-grid>
    </b-card-body>
    <b-card-footer v-if="pokemon.caughtAt" class="text-right text-muted">
      <small>Caught <rel-time v-bind:datetime="pokemon.caughtAt" format-tooltip="LL" refresh="1m" /></small>
    </b-card-footer>
  </b-card>
</template>

<script>
  import numeral from 'numeral'
  import { mapGetters } from 'vuex'

  import { variantTotalIV, variantLevel } from '../../utils.js'

  import GenerationBadge from '../badges/generation.vue'
  import LevelBadge from '../badges/level.vue'
  import RarityBadge from '../badges/rarity.vue'
  import RelTime from '../rel-time.vue'
  import ShinyBadge from '../badges/shiny.vue'
  import TypeBadge from '../badges/type.vue'

  import StatGrid from '../stat-grid.vue'
  import StatGridCell from '../stat-grid-cell.vue'

  export default {
    props: {
      pokemon: {
        type: Object,
        required: true
      },
      selected: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      ...mapGetters([ 'fallbackSpriteURL' ]),

      title() {
        const { nickname, species } = this.pokemon
        return nickname || species
      },

      subtitle() {
        const { nickname, species } = this.pokemon
        return nickname && species
      },

      view() {
        return { name: 'catalog-view', params: { pokemon: this.pokemon.id } }
      },

      moves() {
        return [ this.pokemon.quickMove, this.pokemon.chargeMove ].filter(Boolean)
      },

      ivVariant() {
        return variantTotalIV(this.pokemon.percentIV)
      },

      levelVariant() {
        return variantLevel(this.pokemon.level)
      }
    },

    components: { GenerationBadge, LevelBadge, RarityBadge, RelTime, ShinyBadge, TypeBadge, StatGrid, StatGridCell }
  }
</script>
