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
        <rarity-badge v-if="pokemon.rarity" v-bind:rarity="pokemon.rarity" />
        <shiny-badge v-if="pokemon.shiny" />
      </div>
      <div>
        <type-badge v-for="type in pokemon.types" v-bind:type="type" />
        &bull;
        <type-badge v-for="type in moveTypes" v-bind:type="type" />
      </div>
      <b-card-img v-bind:src="pokemon.spriteURL" v-img-fallback="fallbackSpriteURL" />
      <b-alert show v-if="pokemon.notes" variant="info" class="card-text mt-2">
        <b>Notes:</b> {{ pokemon.notes }}
      </b-alert>
      <stat-grid class="mt-2">
        <stat-grid-cell cols="6" label="CP">{{ pokemon.cp | number('0,0') }}</stat-grid-cell>
        <stat-grid-cell cols="6" label="HP">{{ pokemon.hp | number('0,0') }}</stat-grid-cell>
        <stat-grid-cell cols="6" label="IVs">
          <b-badge v-if="pokemon.percentIV === 1" variant="success">Wonder</b-badge>
          <b-badge v-else>{{ pokemon.percentIV | number('0%') }}</b-badge>
        </stat-grid-cell>
        <stat-grid-cell cols="6" label="Level">
          <b-badge v-if="pokemon.level === 40" variant="success">Max</b-badge>
          <span v-else>{{ pokemon.level | number('0.0') }}</span>
        </stat-grid-cell>
      </stat-grid>
    </b-card-body>
    <b-card-footer>
      <b-row no-gutters class="text-muted">
        <b-col class="text-left">
          <small v-if="pokemon.caughtAt">
            Caught <rel-time v-bind:datetime="pokemon.caughtAt" format-tooltip="LL" refresh="1m" />
          </small>
        </b-col>
        <b-col class="text-right">
          <small v-if="pokemon.updatedAt">
            Updated <rel-time v-bind:datetime="pokemon.updatedAt" format-tooltip="LL" refresh="1m" />
          </small>
          <small v-else>
            Added <rel-time v-bind:datetime="pokemon.createdAt" format-tooltip="LL" refresh="1m" />
          </small>
        </b-col>
      </b-row>
    </b-card-footer>
  </b-card>
</template>

<script>
  import numeral from 'numeral'
  import { mapGetters } from 'vuex'

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

      moveTypes() {
        return [ this.pokemon.quickMove, this.pokemon.chargeMove ].filter(Boolean).map(move => move.type)
      }
    },

    components: { GenerationBadge, LevelBadge, RarityBadge, RelTime, ShinyBadge, TypeBadge, StatGrid, StatGridCell }
  }
</script>
