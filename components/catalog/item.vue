<template>
  <b-card class="border rounded mb-3" no-body v-bind:class="{ 'border-primary': selected, 'bg-light': selected }">
    <b-card-body>
      <h4 class="card-title">
        <b-link v-bind:to="view">{{ title }}</b-link>
        <small v-if="subtitle">({{ subtitle }})</small>
      </h4>
      <div>
        <b-badge variant="dark">{{ pokemon.dex | dex }}</b-badge>
        <badge-generation v-bind:generation="pokemon.generation" />
        <badge-rarity v-if="pokemon.rarity !== 'common'" v-bind:rarity="pokemon.rarity" />
        <badge-shiny v-if="pokemon.shiny" />
        <b-badge variant="info" v-if="pokemon.lucky">Lucky</b-badge>
      </div>
      <div>
        <badge-type v-for="(type, i) in pokemon.types" v-bind:type="type" v-bind:title="'Type ' + (i + 1)" v-b-tooltip.hover.top />
      </div>
      <div>
        <badge-type v-for="move in moves" v-bind:type="move.type" v-bind:title="move.name" v-b-tooltip.hover.bottom />
        <b-badge variant="warning" v-if="legacyMoves">Legacy Moves</b-badge>
      </div>
      <center>
        <pokemon-icon v-bind:pokemon="pokemon.pokemonID" v-bind:form="pokemon.form" v-bind:costume="pokemon.costume" v-bind:lucky="pokemon.lucky" v-bind:shiny="pokemon.shiny" />
      </center>
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
          <badge-ivs v-bind:percentage="pokemon.percentIV" v-bind:uncertain="pokemon.uncertainIV" />
        </stat-grid-cell>
        <stat-grid-cell cols="12" label="Level">
          <progress-level v-bind:level="pokemon.level" />
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

  import { BadgeIvs, BadgeGeneration, BadgeRarity, BadgeShiny, BadgeType } from '../badges'
  import { ProgressLevel } from '../progress'
  import StatGrid from '../stat-grid.vue'
  import StatGridCell from '../stat-grid-cell.vue'
  import RelTime from '../rel-time.vue'
  import PokemonIcon from '../pokemon-icon.vue'

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
        return [ this.pokemon.quickMove, this.pokemon.chargeMove, this.pokemon.chargeMove2 ].filter(Boolean)
      },

      legacyMoves() {
        return this.moves.some(move => move.legacy)
      }
    },

    components: { BadgeIvs, BadgeGeneration, BadgeRarity, BadgeShiny, BadgeType, ProgressLevel, StatGrid, StatGridCell, PokemonIcon, RelTime }
  }
</script>
