<template>
  <b-card class="border rounded mb-3" no-body v-bind:class="{ 'border-primary': selected, 'bg-light': selected }">
    <b-card-img v-bind:src="pokemon.sprite" v-img-fallback="fallbackSpriteURL" />
    <b-card-body>
      <h2 v-if="pokemon.nickname" class="h3 mt-1 mb-0">
        <b-link v-bind:to="{ name: 'catalog-view', params: { pokemon: pokemon.id } }">{{ pokemon.nickname }}</b-link>
        <small class="text-muted">({{ pokemon.species }})</small>
      </h2>
      <h2 v-else class="h3 mt-1 mb-0">
        <b-link v-bind:to="{ name: 'catalog-view', params: { pokemon: pokemon.id } }">{{ pokemon.name }}</b-link>
      </h2>
      <div>
        <b-badge variant="dark">{{ pokemon.dex | dex }}</b-badge>
        <generation-badge v-bind:generation="pokemon.generation" />
        <type-badge v-for="type in pokemon.types" v-bind:type="type" />
      </div>
      <div>
        <rarity-badge v-if="pokemon.rarity" v-bind:rarity="pokemon.rarity" />
        <shiny-badge v-if="pokemon.shiny" />
        <b-badge v-if="pokemon.ivs === 45" variant="success" title="100% IVs">Wonder</b-badge>
        <b-badge v-if="pokemon.notes" v-b-tooltip.hover.right v-bind:title="pokemon.notes">Notes</b-badge>
      </div>
      <div>
        Level <level-badge v-bind:level="pokemon.level" />
        &bull;
        <b-badge variant="primary">{{ pokemon.ivp | number('0%') }}</b-badge>
        <abbr title="Individual Values" class="initialism">IVs</abbr>
      </div>
      <div>
        <b-badge v-if="pokemon.uncertain" variant="warning" title="Uncertain Stats">{{ pokemon.cp | number('0,0') }}*</b-badge>
        <b-badge v-else variant="info">{{ pokemon.cp | number('0,0') }}</b-badge>
        <abbr title="Combat Power" class="initialism">CP</abbr>
        <b-badge variant="info">{{ pokemon.hp | number('0,0') }}</b-badge>
        <abbr title="Hit Points" class="initialism">HP</abbr>
      </div>
      <small class="text-muted">
        <template v-if="pokemon.caught">
          Caught <rel-time v-bind:datetime="pokemon.caught" format-tooltip="LL" refresh="1m" />
          &bull;
        </template>
        Added <rel-time v-bind:datetime="pokemon.added" refresh="1m" />
      </small>
    </b-card-body>
  </b-card>
</template>

<script>
  import { spriteURL } from '../../utils.js'

  import GenerationBadge from '../badges/generation.vue'
  import LevelBadge from '../badges/level.vue'
  import PokemonSprite from '../pokemon-sprite.vue'
  import RarityBadge from '../badges/rarity.vue'
  import RelTime from '../rel-time.vue'
  import ShinyBadge from '../badges/shiny.vue'
  import TypeBadge from '../badges/type.vue'

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
      fallbackSpriteURL() {
        return spriteURL(null)
      }
    },

    components: { GenerationBadge, LevelBadge, PokemonSprite, RarityBadge, RelTime, ShinyBadge, TypeBadge }
  }
</script>
